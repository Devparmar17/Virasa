import { FAST_MODELS, gemini } from "@/lib/gemini";
import { cleanProfile, describeProfile } from "@/lib/profile";
import { langOf } from "@/lib/store-shared";
import { DISCOVER_SCHEMA, FIND_KINDS, libraryDiscovery, type Discovery } from "@/lib/discover";

// Finds hidden places, local food, markets and festivals for any city with
// Gemini. Ahmedabad falls back to Virasa's own guides.

const SYSTEM = `You are the local-insider guide inside Virasa, a heritage travel app for India. A traveller wants what a well-travelled local friend would show them in a city: lesser-known heritage, old neighbourhoods, long-standing food institutions and street-food lanes, markets and crafts, festivals and seasonal events, and small experiences (a workshop, a sunrise spot, a boat ride).

Prefer places that are loved by locals but missed by most visitors; include at most two famous sights. Only name real places you are confident exist; if unsure of an exact stall, name the lane or area known for the dish. Never invent ratings, reviews, prices or phone numbers.

For each find: "why" is one sentence on why locals love it; "area" is the neighbourhood; "tryThis" is the dish to order or the thing to do there; "when" is the best time (time of day or months; for festivals, the month); "tip" is one practical tip. "intro" is one sentence about the city's character. Keep every text short and plain, for reading on a phone.`;

// Recent answers, so a second visit to the same city is instant.
const cache = new Map<string, { at: number; data: Discovery }>();
const HOURS_6 = 6 * 60 * 60 * 1000;

export async function POST(request: Request) {
  let city = "";
  let kind = "all";
  let lang = "en";
  let who = "";
  let key = "";
  try {
    const body = await request.json();
    city = String(body.city || "").trim().slice(0, 60);
    if (FIND_KINDS.some(([id]) => id === body.kind)) kind = body.kind;
    if (typeof body.lang === "string") lang = body.lang;
    const profile = cleanProfile(body.profile);
    who = describeProfile(profile);
    key = [city.toLowerCase(), kind, lang, profile.party, profile.diet, profile.stepFree].join("|");
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!city) return Response.json({ error: "Tell me which city to explore." }, { status: 400 });

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < HOURS_6) return Response.json({ discovery: hit.data });

  const what = kind === "all" ? "10 finds: a mix of hidden places, local food, markets, festivals and experiences (at least 3 food)" : `8 finds, all of kind "${kind}"`;
  const text = await gemini({
    system: `${SYSTEM}\n\n${who}\n\nWrite every text field in ${langOf(lang).label}, except place names, which stay as locals write them in English.`,
    contents: [{ role: "user", parts: [{ text: `Show me ${what} in ${city}, India.` }] }],
    schema: DISCOVER_SCHEMA,
    maxTokens: 4000,
    temperature: 0.6,
    timeoutMs: 20000,
    models: FAST_MODELS,
  });
  if (text) {
    try {
      const data = { ...(JSON.parse(text) as Discovery), source: "gemini" as const };
      if (Array.isArray(data.finds) && data.finds.length) {
        if (cache.size > 200) cache.delete(cache.keys().next().value as string);
        cache.set(key, { at: Date.now(), data });
        return Response.json({ discovery: data });
      }
    } catch {
      // Unreadable answer: fall through to the library.
    }
  }
  const fallback = libraryDiscovery(city);
  if (fallback) return Response.json({ discovery: kind === "all" ? fallback : { ...fallback, finds: fallback.finds.filter((f) => f.kind === kind) } });
  return Response.json({ error: `I can explore ${city} once Gemini is connected. For now I know Ahmedabad's local secrets.` }, { status: 503 });
}
