// What can be booked in Virasa: guided walks and monument entry.
// Prices are sample values for the prototype; no payment is taken in the app.

export type Bookable = {
  id: string;
  kind: "guided" | "entry";
  title: string;
  place: string;
  blurb: string;
  duration: string;
  adult: number;
  child: number;
  slots: string[];
  meet: string;
  img?: string;
  // Weekdays (0 = Sunday) on which it does not run.
  closed?: number[];
  tag?: string;
};

export const BOOKABLES: Bookable[] = [
  { id: "sidi-guided", kind: "guided", title: "Tree of Life guided visit", place: "Sidi Saiyyed Mosque, Ahmedabad", blurb: "A heritage guide walks you through all ten jalis and the story of the window left blank.", duration: "45 min", adult: 150, child: 75, slots: ["8:00 AM", "10:00 AM", "4:30 PM"], meet: "Meet at the mosque gate, Lal Darwaja", img: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", tag: "Most booked" },
  { id: "morning-walk", kind: "guided", title: "Old City in a morning, with a guide", place: "Ahmedabad Old City · 6 stops", blurb: "The planned walk from Sidi Saiyyed to Dhal ni Pol, led by a local guide. Chai at Manek Chowk included.", duration: "2 h 40", adult: 350, child: 175, slots: ["7:45 AM"], meet: "Meet at Sidi Saiyyed Mosque", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg" },
  { id: "sarkhej-sunset", kind: "guided", title: "Sarkhej Roza at sunset", place: "Sarkhej Roza, Ahmedabad", blurb: "Tombs, mosque and pavilions in the best light of the day, with a guide.", duration: "1 h 15", adult: 250, child: 125, slots: ["4:45 PM"], meet: "Meet at the main gateway", img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg" },
  { id: "adalaj", kind: "entry", title: "Adalaj Stepwell", place: "Adalaj, 18 km from Ahmedabad", blurb: "Skip the counter queue with entry reserved for the day.", duration: "Any time, 8 AM – 6 PM", adult: 25, child: 0, slots: ["Any time"], meet: "Show your code at the ticket window", img: "/images/adalaj-stepwell.jpg" },
  { id: "ranikivav", kind: "entry", title: "Rani ki Vav", place: "Patan, Gujarat", blurb: "Entry to the UNESCO-listed stepwell. Allow two hours.", duration: "Any time, 8 AM – 6 PM", adult: 40, child: 0, slots: ["Any time"], meet: "Show your code at the ticket window", img: "/images/rani-ki-vav.jpg" },
  { id: "calico", kind: "entry", title: "Calico Museum of Textiles tour", place: "Shahibaug, Ahmedabad", blurb: "A guided tour of one of the finest textile collections in India. Free, but places are limited.", duration: "2 h", adult: 0, child: 0, slots: ["10:30 AM"], meet: "Arrive 15 minutes early at the museum gate", img: "/images/calico-museum.jpg", closed: [3], tag: "Free · book ahead" },
  { id: "hawamahal", kind: "entry", title: "Hawa Mahal", place: "Jaipur, Rajasthan", blurb: "Entry to the Palace of Winds. Best at sunrise.", duration: "Any time, 9 AM – 5 PM", adult: 50, child: 0, slots: ["Any time"], meet: "Show your code at the ticket window", img: "/images/hawa-mahal.jpg", tag: "For your Jaipur trip" },
];

export type Ticket = {
  ref: string;
  item: string;
  date: string; // YYYY-MM-DD
  slot: string;
  adults: number;
  children: number;
  name: string;
  guideLang?: string;
  total: number;
};

export const bookable = (id: string) => BOOKABLES.find((b) => b.id === id);
export const rupees = (n: number) => (n === 0 ? "Free" : `₹${n.toLocaleString("en-IN")}`);
export const priceOf = (b: Bookable, adults: number, children: number) => b.adult * adults + b.child * children;

// Dates are handled as plain YYYY-MM-DD strings in local time.
const pad = (n: number) => String(n).padStart(2, "0");
export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export function nextDays(todayKey: string, count = 7) {
  const start = fromKey(todayKey);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { key: dayKey(d), weekday: d.getDay(), top: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" }), day: d.getDate(), month: d.toLocaleDateString("en-IN", { month: "short" }) };
  });
}
export const longDate = (key: string) => fromKey(key).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function newRef() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "VR-" + [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join("");
}
