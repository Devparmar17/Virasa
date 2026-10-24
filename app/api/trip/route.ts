import { FAST_MODELS, gemini } from "@/lib/gemini";
import { cleanProfile, describeProfile } from "@/lib/profile";
import { langOf } from "@/lib/store-shared";
import { libraryTrip, TRIP_INTERESTS, TRIP_SCHEMA, type Trip, type TripRequest } from "@/lib/trip";

// Plans a personalised trip with Gemini. Without Gemini (or if it doesn't
// answer) cities Virasa knows get a plan from its own data; others can't.

const SYSTEM = `You are the trip planner inside Virasa, a heritage travel app for India. Plan a realistic day-by-day trip shaped to the traveller below.

Each day has 3 to 6 stops across Morning, Afternoon and Evening, in an order that makes sense on the ground (nearby places together, meals at meal times). For every stop, "why" says in one sentence why it suits this traveller; "tip" is one practical tip; "duration" and "cost" are short and approximate (e.g. "45 min", "Free", "₹50–100").

Mix famous heritage with lesser-known places locals love: quiet stepwells, old lanes, small museums, local markets. For food, prefer long-standing local institutions and street-food areas known for a dish; name the dish to try. Only name real places you are confident exist; if unsure of a specific stall, name the street or area instead. Never invent ratings or reviews.

"hidden" lists 2 to 4 lesser-known places worth a detour. "food" lists 3 to 5 local food picks. "tips" gives 3 to 5 short practical tips for this traveller (safety, dress, timing, rest, children). "budget" is a one-line daily estimate per person. Keep every text short and plain, for reading on a phone.`;

export async function POST(request: Request) {
  let req: TripRequest;
  try {
    const body = await request.json();
    const city = String(body.city || "").trim().slice(0, 60);
    if (!city) return Response.json({ error: "Tell me which city you're going to." }, { status: 400 });
    const known = new Set(TRIP_INTERESTS.map(([id]) => id));
    req = {
      city,
      days: Math.max(1, Math.min(7, Number(body.days) || 2)),
      interests: (Array.isArray(body.interests) ? body.interests : []).filter((i: unknown) => known.has(String(i))).slice(0, 8),
      profile: cleanProfile(body.profile),
      lang: typeof body.lang === "string" ? body.lang : "en",
      notes: typeof body.notes === "string" ? body.notes.slice(0, 300) : "",
    };
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const interests = req.interests.map((i) => TRIP_INTERESTS.find(([id]) => id === i)?.[1]).filter(Boolean).join(", ") || "a bit of everything";
  const ask = `Plan ${req.days} ${req.days === 1 ? "day" : "days"} in ${req.city}, India. They are most interested in: ${interests}.${req.notes ? ` They also said: "${req.notes}".` : ""}`;
  const text = await gemini({
    system: `${SYSTEM}\n\n${describeProfile(req.profile)}\n\nWrite every text field in ${langOf(req.lang).label}, except place names, which stay as locals write them in English.`,
    contents: [{ role: "user", parts: [{ text: ask }] }],
    schema: TRIP_SCHEMA,
    maxTokens: 6000,
    temperature: 0.5,
    timeoutMs: 25000,
    models: FAST_MODELS,
  });
  if (text) {
    try {
      const trip = JSON.parse(text) as Trip;
      if (Array.isArray(trip.days) && trip.days.length) return Response.json({ trip: { ...trip, source: "gemini" } });
    } catch {
      // Unreadable answer: fall through to the library.
    }
  }
  const fallback = libraryTrip(req);
  if (fallback) return Response.json({ trip: fallback });
  return Response.json({ error: `I can plan ${req.city} once Gemini is connected. For now I can plan Ahmedabad, Jaipur, Varanasi, Hampi or Kolkata.` }, { status: 503 });
}
