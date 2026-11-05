// Booking with the AI Guide: a sentence ("Amber Fort for 2 tomorrow with a
// senior-friendly car") becomes a draft the traveller confirms in the chat.
// Shared by the /api/book route and the guide's booking card.
import { addonPrice, bookable, BOOKABLES, CAR_ADDONS, newRef, nextDays, priceOf, type Bookable, type Ticket } from "./tickets";

export type BookingDraft = {
  item: string;
  date: string; // YYYY-MM-DD
  slot: string;
  adults: number;
  children: number;
  car: string | null; // a car added to the visit: "car" | "senior" | "van"
  pickup: string;
};

// Words that mean the traveller wants to book something, in the app's languages.
export const BOOKING_WORDS = /\b(book|booking|reserve|reservation|tickets?|cab|taxi|hire a car|van|need a car|want a car|car for)\b|बुक|टिकट|बुकिंग|આરક્ષ|બુક|ટિકિટ|புக்|டிக்கெட்|বুক|টিকিট/i;

// The bookable list, one line each, for the AI to choose from.
export const catalog = () =>
  BOOKABLES.map((b) => `${b.id} | ${b.title} | ${b.place} | ${b.kind} | times: ${b.slots.join(", ")}${b.closed?.length ? ` | closed on weekdays ${b.closed.join(",")} (0=Sunday)` : ""}${b.kind === "car" ? ` | seats ${b.seats ?? 4}` : ""}`).join("\n");

export const BOOKING_SCHEMA = {
  type: "OBJECT",
  properties: {
    intent: { type: "STRING", enum: ["book", "unavailable", "none"] },
    item: { type: "STRING", enum: [...BOOKABLES.map((b) => b.id), "none"] },
    date: { type: "STRING" },
    slot: { type: "STRING" },
    adults: { type: "INTEGER" },
    children: { type: "INTEGER" },
    car: { type: "STRING", enum: [...CAR_ADDONS.map((c) => c.id), "none"] },
    pickup: { type: "STRING" },
    reply: { type: "STRING" },
  },
  required: ["intent", "reply"],
};

// Makes whatever the AI (or the fallback) proposed into a draft that can be booked:
// a real item, an open day in the coming week, one of its times, sensible numbers.
export function cleanDraft(raw: Partial<BookingDraft> & { car?: string | null }, today: string): BookingDraft | null {
  const item = bookable(String(raw.item || ""));
  if (!item || !today) return null;
  const days = nextDays(today).filter((d) => !item.closed?.includes(d.weekday));
  const date = days.find((d) => d.key === raw.date)?.key ?? days[0]?.key ?? today;
  const slot = item.slots.find((s) => s.toLowerCase() === String(raw.slot || "").toLowerCase()) ?? item.slots[0];
  const max = item.kind === "car" ? item.seats ?? 4 : 10;
  const adults = Math.max(1, Math.min(max, Math.round(Number(raw.adults) || 1)));
  const children = item.kind === "car" ? 0 : Math.max(0, Math.min(10, Math.round(Number(raw.children) || 0)));
  const car = item.kind !== "car" && CAR_ADDONS.some((c) => c.id === raw.car) ? (raw.car as string) : null;
  return { item: item.id, date, slot, adults, children, car, pickup: String(raw.pickup || "").slice(0, 120) };
}

export const draftTotal = (d: BookingDraft) => {
  const item = bookable(d.item);
  return item ? priceOf(item, d.adults, d.children) + addonPrice(item, d.car) : 0;
};

// The ticket a confirmed draft becomes — the same as booking on the Tickets screen.
export function draftTicket(d: BookingDraft, name: string): Ticket {
  const item = bookable(d.item) as Bookable;
  const needsPickup = item.kind === "car" || Boolean(d.car);
  const car = d.car ? CAR_ADDONS.find((c) => c.id === d.car) : undefined;
  return {
    ref: newRef(),
    item: item.id,
    date: d.date,
    slot: d.slot,
    adults: d.adults,
    children: d.children,
    name,
    guideLang: item.kind === "guided" ? "en" : undefined,
    ...(needsPickup ? { pickup: d.pickup, help: [] } : {}),
    ...(car ? { car: { id: car.id, label: car.label, price: addonPrice(item, car.id) } } : {}),
    total: draftTotal(d),
  };
}

// Words too common in titles to pick a place by.
const GENERIC = new Set(["with", "guide", "guided", "visit", "walk", "tour", "city", "car", "cars", "senior", "friendly", "hours", "hour", "ticket", "entry", "workshop", "class", "palace", "fort", "mahal", "temple", "museum", "full", "day", "driver", "night", "evening", "beginners", "morning", "old", "the", "and", "for", "from"]);

// Without the AI: only a clear "book …" naming a place Virasa sells. The place's
// own name must be there ("Hawa Mahal", not just "Mahal"); then the simple parts.
export function guessDraft(text: string, today: string): BookingDraft | null {
  const t = text.toLowerCase();
  if (!/\b(book|reserve|need|want|get me)\b|बुक|બુક/.test(t)) return null;
  const core = (b: Bookable) => b.title.toLowerCase().split(/ · |, /)[0];
  const distinct = (b: Bookable) => core(b).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !GENERIC.has(w));
  const wantsCar = /\b(car|cab|taxi|van|driver|pickup)\b/.test(t);
  const scored = BOOKABLES.filter((b) => b.kind !== "car" || wantsCar)
    .map((b) => {
      const words = distinct(b);
      const hits = words.filter((w) => t.includes(w)).length;
      // The whole name, or every distinctive word of it.
      const named = t.includes(core(b)) || (words.length > 0 && hits === words.length);
      return { b, named, hits };
    })
    .filter((x) => x.named)
    .sort((a, z) => z.hits - a.hits);
  // A place named outright beats a kind of car.
  const pick = scored.find((x) => x.b.kind !== "car") ?? scored[0];
  if (!pick) return null;
  const item = pick.b;
  const days = nextDays(today);
  const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const named = WEEKDAYS.findIndex((w) => t.includes(w));
  const date = /tomorrow|कल|આવતીકાલ/.test(t) ? days[1]?.key : named >= 0 ? days.find((d) => d.weekday === named)?.key : days[0]?.key;
  // "at 10", "at 4:30 pm": the nearest of the item's times.
  const at = t.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  const hourOf = (slot: string) => {
    const m = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    return m ? (Number(m[1]) % 12) + (m[3] === "PM" ? 12 : 0) + Number(m[2]) / 60 : -1;
  };
  let slot: string | undefined;
  if (at) {
    let h = Number(at[1]) + Number(at[2] || 0) / 60;
    if (at[3] === "pm" && h < 12) h += 12;
    else if (!at[3] && h < 7) h += 12;
    slot = [...item.slots].filter((s) => hourOf(s) >= 0).sort((a, z) => Math.abs(hourOf(a) - h) - Math.abs(hourOf(z) - h))[0];
  }
  const pickup = text.match(/(?:pick(?:\s*me)?\s*up|pickup)\s+(?:from|at)\s+([^,.;]+)/i)?.[1]?.trim() ?? "";
  const count = (re: RegExp) => Number(t.match(re)?.[1] || 0);
  const adults = count(/(\d+)\s*(adults?|people|persons?|of us|tickets?|passengers?)/) || count(/for\s+(\d+)/) || 1;
  const children = count(/(\d+)\s*(kids?|children|child)/);
  const car = /wheelchair/.test(t) ? "van" : /senior|elder|old|parents|grand/.test(t) ? "senior" : /\b(car|cab|taxi)\b/.test(t) ? "car" : null;
  return cleanDraft({ item: item.id, date, slot, adults, children, car, pickup }, today);
}
