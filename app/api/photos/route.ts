// Photos for places and dishes the AI found, from Wikipedia.
// POST { city, items: [{ name, wiki?, kind }] } → { photos: (string | null)[] }
// First every candidate title is checked in one request (the AI's suggested
// article, then the place's own name); a search is only the fallback, and its
// result is used only when the article's title matches the place's name, so a
// search for "Bapu Bazaar" can't come back with a portrait of someone else.

type Item = { name: string; wiki?: string; kind?: string };

const API = "https://en.wikipedia.org/w/api.php";
const HEADERS = { "User-Agent": "Virasa/1.0 (heritage travel app)" };
const WEEK = 7 * 24 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; url: string | null }>();

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !["the", "and", "ka", "ki", "ke", "of"].includes(w));

// A search result counts only if every main word of its title is in the place's name.
const titleFits = (title: string, name: string, city: string) => {
  const t = words(title).filter((w) => w !== city.toLowerCase());
  const n = new Set(words(name));
  return t.length > 0 && t.every((w) => n.has(w));
};

async function wiki(params: Record<string, string>) {
  const qs = new URLSearchParams({ action: "query", format: "json", prop: "pageimages", piprop: "thumbnail", pithumbsize: "320", ...params });
  const res = await fetch(`${API}?${qs}`, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
  // Busy or rate-limited answers (sometimes plain text) count as failures, not "no photo".
  if (!res.ok) throw new Error(`wikipedia ${res.status}`);
  return (await res.json()) as {
    query?: { pages?: Record<string, { title: string; index?: number; thumbnail?: { source: string } }>; redirects?: { from: string; to: string }[]; normalized?: { from: string; to: string }[] };
  };
}

export async function POST(request: Request) {
  let city = "";
  let items: Item[] = [];
  try {
    const body = await request.json();
    city = String(body.city || "").trim().slice(0, 60);
    items = (Array.isArray(body.items) ? body.items : []).slice(0, 12).map((i: Item) => ({ name: String(i?.name || "").slice(0, 100), wiki: i?.wiki ? String(i.wiki).slice(0, 100) : undefined, kind: i?.kind }));
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const keyOf = (i: Item) => `${city}|${i.name}|${i.wiki || ""}`.toLowerCase();
  const photos: (string | null)[] = items.map((i) => {
    const hit = cache.get(keyOf(i));
    return hit && Date.now() - hit.at < WEEK ? hit.url : null;
  });
  const todo = items.map((_, n) => n).filter((n) => !cache.has(keyOf(items[n])) || Date.now() - cache.get(keyOf(items[n]))!.at >= WEEK);
  if (!todo.length) return Response.json({ photos });

  // Items Wikipedia couldn't answer for; they aren't remembered, so a later visit asks again.
  const unsure = new Set<number>();

  // 1. Exact titles, all in one request.
  const candidates = new Map<number, string[]>();
  for (const n of todo) {
    const { name, wiki: w } = items[n];
    candidates.set(n, [w, name, `${name}, ${city}`, `${name} (${city})`].filter((x): x is string => !!x));
  }
  const titles = [...new Set([...candidates.values()].flat())].slice(0, 50);
  try {
    const data = await wiki({ titles: titles.join("|"), redirects: "1" });
    const pages = Object.values(data?.query?.pages || {});
    // Follow normalised titles and redirects to the page that has the picture.
    const resolve = (t: string) => {
      let x = t;
      x = data?.query?.normalized?.find((r) => r.from === x)?.to ?? x;
      x = data?.query?.redirects?.find((r) => r.from === x)?.to ?? x;
      return pages.find((p) => p.title === x)?.thumbnail?.source ?? null;
    };
    for (const n of todo) {
      for (const t of candidates.get(n)!) {
        const url = resolve(t);
        if (url) {
          photos[n] = url;
          break;
        }
      }
    }
  } catch {
    // Wikipedia busy or unreachable: the search below may still find some.
  }

  // 2. A careful search for the rest, one at a time to stay polite to Wikipedia.
  for (const n of todo) {
    if (photos[n]) continue;
    try {
      const data = await wiki({ generator: "search", gsrsearch: `${items[n].name} ${city}`, gsrlimit: "3" });
      const pages = Object.values(data?.query?.pages || {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      const fit = pages.find((p) => p.thumbnail && titleFits(p.title, items[n].name, city));
      if (fit?.thumbnail) photos[n] = fit.thumbnail.source;
    } catch {
      // Wikipedia busy: no photo this time, and ask again next time.
      unsure.add(n);
    }
  }

  for (const n of todo) {
    if (unsure.has(n)) continue;
    if (cache.size > 2000) cache.delete(cache.keys().next().value as string);
    cache.set(keyOf(items[n]), { at: Date.now(), url: photos[n] });
  }
  return Response.json({ photos });
}
