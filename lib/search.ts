// Searches what Virasa already knows on this phone: the finds and highlights,
// the map's places, bookable tickets and walks, and the city trip plans.

import { SECRETS } from "./secrets";
import { BOOKABLES, rupees } from "./tickets";
import { CITY_PLANS } from "./plans";
import { PLACES } from "@/app/explore/places";

export type Hit = { id: string; kind: string; title: string; sub: string; href: string; img?: string };
type Entry = Hit & { words: string; detail: { name: string; text: string }[] };

// Lower case without accents, and plurals folded ("stepwells" finds "stepwell").
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
const stem = (w: string) => (w.length > 4 && w.endsWith("es") && !w.endsWith("ses") ? w.slice(0, -2) : w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
const STOP = new Set(["the", "a", "an", "of", "in", "at", "to", "and", "for", "me", "near", "my", "is", "what", "where", "show", "find", "best", "some"]);
const terms = (q: string) => [...new Set(norm(q).split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem))];

const INDEX: Entry[] = [
  ...SECRETS.map((s) => ({
    id: s.id,
    kind: s.group === "secret" ? "Local find" : s.group === "stop" ? "On the Old City walk" : "Heritage highlight",
    title: s.title,
    sub: `${s.tag} · ${s.distance}`,
    href: `/secret?id=${s.id}`,
    img: s.img,
    words: `${s.title} ${s.line} ${s.tag} ${s.kind} ${s.story.join(" ")}`,
    detail: s.list.map((i) => ({ name: i.name, text: `${i.name} ${i.note} ${i.badge || ""}` })),
  })),
  ...PLACES.filter((p) => !SECRETS.some((s) => s.id === p.id)).map((p) => ({
    id: p.id,
    kind: "Place",
    title: p.name,
    sub: `${p.mins} min walk · ${p.open}`,
    href: p.href || `/navigate?to=${p.id}`,
    img: p.img,
    words: `${p.name} ${p.cat} ${p.fact} ${p.id === "sidi" ? "jali tree of life mosque" : ""}`,
    detail: [],
  })),
  ...BOOKABLES.map((b) => ({
    id: `ticket-${b.id}`,
    kind: b.kind === "guided" ? "Guided walk" : "Entry ticket",
    title: b.title,
    sub: `${b.place} · from ${rupees(b.adult)}`,
    href: `/tickets?book=${b.id}`,
    img: b.img,
    words: `${b.title} ${b.place} ${b.blurb} ticket booking ${b.kind === "guided" ? "guide tour walk" : "entry"}`,
    detail: [],
  })),
  {
    id: "ai-trip",
    kind: "AI trip planner",
    title: "Plan my trip with AI",
    sub: "Any city, day by day, for whoever is going",
    href: "/trip",
    words: "plan trip itinerary holiday vacation tour days family kids children elders parents solo couple friends budget ai planner schedule",
    detail: [],
  },
  {
    id: "ai-discover",
    kind: "Discover",
    title: "Discover like a local",
    sub: "Hidden places, local food, markets and festivals",
    href: "/discover",
    words: "hidden gems secret places local food street food stall eat market bazaar shopping festival events experiences what to see",
    detail: [],
  },
  ...CITY_PLANS.map((c) => ({
    id: `plan-${c.id}`,
    kind: "Trip plan",
    title: `Plan a trip to ${c.name}`,
    sub: c.tag,
    href: `/plan?city=${c.id}`,
    img: c.img,
    words: `${c.name} ${c.tag} trip plan itinerary`,
    detail: c.stops.map((s) => ({ name: s.name, text: `${s.name} ${s.note}` })),
  })),
];

const hasWord = (text: string, w: string) => new RegExp(`\\b${w}`).test(text);

export function searchApp(query: string, limit = 8): Hit[] {
  const ws = terms(query);
  if (!ws.length) return [];
  // Most of the words have to match, so "Manek Chowk food" doesn't list everything with food.
  const need = Math.ceil(ws.length / 2);
  return INDEX.map((e) => {
    const title = norm(e.title);
    const body = norm(e.words);
    let score = 0;
    let matched = 0;
    for (const w of ws) {
      if (hasWord(title, w)) {
        score += 3;
        matched++;
      } else if (hasWord(body, w) || e.detail.some((d) => hasWord(norm(d.text), w))) {
        score += 1;
        matched++;
      }
    }
    // Say why a trip plan or a find matched when it was something inside it.
    const inside = e.detail.find((d) => ws.some((w) => hasWord(norm(d.name), w)));
    const sub = inside && !ws.some((w) => hasWord(title, w)) ? `Includes ${inside.name}` : e.sub;
    return { hit: { id: e.id, kind: e.kind, title: e.title, sub, href: e.href, img: e.img }, score, matched };
  })
    .filter((r) => r.matched >= need)
    // Matching more of the words beats matching one of them in a title.
    .sort((a, b) => b.matched - a.matched || b.score - a.score)
    .slice(0, limit)
    .map((r) => r.hit);
}
