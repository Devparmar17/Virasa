import { FAST_MODELS, gemini } from "@/lib/gemini";
import { langOf } from "@/lib/store-shared";
import { nextDays } from "@/lib/tickets";
import { BOOKING_SCHEMA, catalog, cleanDraft, guessDraft } from "@/lib/booking";

// Turns a sentence to the AI Guide into a booking draft the traveller confirms
// in the chat. Gemini reads it; without Gemini, a simple name match does.

const SYSTEM = `You are the booking helper inside Virasa, a heritage travel app for India. The traveller has written to the AI Guide. Decide whether they want to book something from Virasa's list below, and if so, fill in the booking.

- intent "book": they want something on the list. Use its id as "item". "date" is YYYY-MM-DD from the coming days below ("today", "tomorrow", a weekday). "slot" must be one of that item's times, exactly as written; pick the nearest if they asked for another. "adults" and "children" are how many people (a car's passengers go in "adults"). "car": add "car", "senior" (senior-friendly car) or "van" (wheelchair van) only if they want a car to get to the place, else "none"; never add one to an item whose kind is car. "pickup": where to be picked up, if they said.
- intent "unavailable": they want to book something that isn't on the list. Say briefly that Virasa can't book it yet and suggest the closest things it can book.
- intent "none": they are not asking to book anything.

"reply" is one or two short, warm sentences: for "book", restate what will be booked (place, day, time, people, car) and say to tap Confirm. Never say it is booked already.

Virasa's list (id | title | place | kind | times | …):
`;

// The short reply with a quickly made booking, in the app's languages.
const READY: Record<string, string> = {
  en: "Here's the booking I've put together. Check the details and tap Confirm.",
  hi: "आपकी बुकिंग तैयार है। विवरण देखें और पुष्टि करें दबाएँ।",
  gu: "તમારું બુકિંગ તૈયાર છે. વિગતો જુઓ અને કન્ફર્મ દબાવો.",
  ta: "உங்கள் முன்பதிவு தயார். விவரங்களைப் பார்த்து உறுதிசெய் என்பதைத் தட்டுங்கள்.",
  bn: "আপনার বুকিং তৈরি। বিস্তারিত দেখে নিশ্চিত করুন চাপুন।",
};
const ready = (lang: string) => READY[lang] ?? READY.en;

export async function POST(request: Request) {
  let text = "";
  let today = "";
  let lang = "en";
  try {
    const body = await request.json();
    text = String(body.text || "").slice(0, 500);
    today = /^\d{4}-\d{2}-\d{2}$/.test(body.today) ? body.today : "";
    if (typeof body.lang === "string") lang = body.lang;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!text || !today) return Response.json({ error: "Say what you'd like to book." }, { status: 400 });

  const days = nextDays(today)
    .map((d, i) => `${d.key} (${i === 0 ? "today" : i === 1 ? "tomorrow" : ""} ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.weekday]})`)
    .join(", ");
  // A clear sentence naming a place Virasa sells gets its card within 8 s, even if Gemini is slow.
  const quick = guessDraft(text, today);
  const fromAI = gemini({
    system: `${SYSTEM}${catalog()}\n\nThe coming days: ${days}.\n\nWrite "reply" in ${langOf(lang).label}.`,
    contents: [{ role: "user", parts: [{ text }] }],
    schema: BOOKING_SCHEMA,
    maxTokens: 500,
    temperature: 0.2,
    timeoutMs: 15000,
    models: FAST_MODELS,
  });
  const first = quick ? await Promise.race([fromAI, new Promise<"slow">((r) => setTimeout(() => r("slow"), 8000))]) : await fromAI;
  if (first === "slow" && quick) return Response.json({ intent: "book", draft: quick, reply: ready(lang) });
  const answer = first === "slow" ? null : first;

  if (answer) {
    try {
      const out = JSON.parse(answer) as { intent: string; item?: string; date?: string; slot?: string; adults?: number; children?: number; car?: string; pickup?: string; reply: string };
      if (out.intent === "book" && out.item && out.item !== "none") {
        const draft = cleanDraft({ ...out, car: out.car === "none" ? null : out.car }, today);
        if (draft) return Response.json({ intent: "book", draft, reply: out.reply });
      }
      if (out.intent === "unavailable") return Response.json({ intent: "unavailable", reply: out.reply });
      return Response.json({ intent: "none" });
    } catch {
      // Unreadable: try the simple match below.
    }
  }
  const draft = quick;
  return draft ? Response.json({ intent: "book", draft, reply: ready(lang) }) : Response.json({ intent: "none" });
}
