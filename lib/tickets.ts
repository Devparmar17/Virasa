// What can be booked in Virasa: guided walks, monument entry, activities and
// cars with a driver (including senior-friendly and wheelchair-accessible ones).
// Bookings are paid when made. Prices are sample values and payment is
// simulated in the prototype: no real money moves.

export type Bookable = {
  id: string;
  kind: "guided" | "entry" | "activity" | "car";
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
  // Easy for older travellers: seated, step-free or with help on hand.
  senior?: boolean;
  // Cars are priced per car, not per person, and carry up to `seats` passengers.
  seats?: number;
  // A car there and back, added to a tour or ticket: the price for this place's distance.
  carPrice?: number;
};

// The cars that can be added to a booking, on top of the place's car price.
export const CAR_ADDONS = [
  { id: "car", label: "Car", extra: 0, seats: 4 },
  { id: "senior", label: "Senior-friendly car", extra: 200, seats: 4 },
  { id: "van", label: "Wheelchair van", extra: 600, seats: 4 },
] as const;
export type CarAddonId = (typeof CAR_ADDONS)[number]["id"];
export const carAddon = (id: string) => CAR_ADDONS.find((c) => c.id === id);
// What a car there and back costs for a booking (cars themselves don't take one).
export const addonPrice = (b: Bookable, id: string | null) => {
  const c = id ? carAddon(id) : undefined;
  return c && b.kind !== "car" ? (b.carPrice ?? 600) + c.extra : 0;
};

// Help a driver can give, chosen when booking a car.
export const CAR_HELP = ["Help getting in and out", "Folding wheelchair in the car", "Stops to rest on the way", "Driver speaks Hindi or Gujarati"];

export const BOOKABLES: Bookable[] = [
  { id: "sidi-guided", kind: "guided", title: "Tree of Life guided visit", place: "Sidi Saiyyed Mosque, Ahmedabad", blurb: "A heritage guide walks you through all ten jalis and the story of the window left blank.", duration: "45 min", adult: 150, child: 75, slots: ["8:00 AM", "10:00 AM", "4:30 PM"], meet: "Meet at the mosque gate, Lal Darwaja", img: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", tag: "Most booked", carPrice: 500 },
  { id: "morning-walk", kind: "guided", title: "Old City in a morning, with a guide", place: "Ahmedabad Old City · 6 stops", blurb: "The planned walk from Sidi Saiyyed to Dhal ni Pol, led by a local guide. Chai at Manek Chowk included.", duration: "2 h 40", adult: 350, child: 175, slots: ["7:45 AM"], meet: "Meet at Sidi Saiyyed Mosque", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg", carPrice: 500 },
  { id: "sarkhej-sunset", kind: "guided", title: "Sarkhej Roza at sunset", place: "Sarkhej Roza, Ahmedabad", blurb: "Tombs, mosque and pavilions in the best light of the day, with a guide.", duration: "1 h 15", adult: 250, child: 125, slots: ["4:45 PM"], meet: "Meet at the main gateway", img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg", carPrice: 700 },
  { id: "adalaj", kind: "entry", title: "Adalaj Stepwell", place: "Adalaj, 18 km from Ahmedabad", blurb: "Skip the counter queue with entry reserved for the day.", duration: "Any time, 8 AM – 6 PM", adult: 25, child: 0, slots: ["Any time"], meet: "Show your code at the ticket window", img: "/images/adalaj-stepwell.jpg", carPrice: 900 },
  { id: "ranikivav", kind: "entry", title: "Rani ki Vav", place: "Patan, Gujarat", blurb: "Entry to the UNESCO-listed stepwell. Allow two hours.", duration: "Any time, 8 AM – 6 PM", adult: 40, child: 0, slots: ["Any time"], meet: "Show your code at the ticket window", img: "/images/rani-ki-vav.jpg", carPrice: 2600 },
  { id: "calico", kind: "entry", title: "Calico Museum of Textiles tour", place: "Shahibaug, Ahmedabad", blurb: "A guided tour of one of the finest textile collections in India. Free, but places are limited.", duration: "2 h", adult: 0, child: 0, slots: ["10:30 AM"], meet: "Arrive 15 minutes early at the museum gate", img: "/images/calico-museum.jpg", closed: [3], tag: "Free · book ahead", senior: true, carPrice: 500 },
  // Activities and experiences.
  { id: "cooking", kind: "activity", title: "Gujarati thali cooking class", place: "A family kitchen in Navrangpura, Ahmedabad", blurb: "Cook dal, kadhi, rotli and a sweet with a home cook, then sit down to eat what you made. Seated, with breaks.", duration: "3 h", adult: 1200, child: 600, slots: ["11:00 AM", "5:00 PM"], meet: "The host shares the address the day before", tag: "Easy for seniors", senior: true, carPrice: 500 },
  { id: "kites", kind: "activity", title: "Kite-making workshop", place: "Khadia pol, Old City, Ahmedabad", blurb: "Make and fly your own patang with a family that has made kites for Uttarayan for three generations.", duration: "1 h 30", adult: 400, child: 200, slots: ["10:00 AM", "3:00 PM"], meet: "Meet at the Khadia pol gate", tag: "Great with kids", carPrice: 500 },
  { id: "block-print", kind: "activity", title: "Block printing workshop", place: "Jamalpur, Ahmedabad", blurb: "Print your own cotton scarf with hand-carved wooden blocks and natural dyes. Take it home the same day.", duration: "2 h", adult: 600, child: 300, slots: ["10:30 AM", "2:30 PM"], meet: "Meet at the workshop, Jamalpur Darwaja", senior: true, carPrice: 500 },
  { id: "food-walk", kind: "activity", title: "Night food walk at Manek Chowk", place: "Manek Chowk, Old City, Ahmedabad", blurb: "Eight tastings at the city's night market with a local foodie, from Gwalior dosa to pineapple sandwich and kulfi.", duration: "2 h", adult: 600, child: 300, slots: ["8:30 PM"], meet: "Meet at the Manek Chowk clock tower", img: "/images/manek-chowk.jpg", tag: "Vegetarian", carPrice: 500 },
  { id: "riverfront-cycle", kind: "activity", title: "Sabarmati Riverfront cycle ride", place: "Sabarmati Riverfront, Ahmedabad", blurb: "An easy, flat ride along the river with stops at the ghats and Gandhi Bridge. Cycles and helmets included.", duration: "1 h 30", adult: 300, child: 150, slots: ["6:30 AM", "5:00 PM"], meet: "Meet at the Riverfront Event Centre gate", carPrice: 500 },
  { id: "garba", kind: "activity", title: "Garba evening for beginners", place: "Vastrapur, Ahmedabad", blurb: "Learn the basic Garba steps with a teacher, then join the circle. Outfits to borrow.", duration: "1 h 30", adult: 350, child: 175, slots: ["7:30 PM"], meet: "Meet at the community hall, Vastrapur Lake", carPrice: 500 },
  { id: "blue-pottery", kind: "activity", title: "Blue pottery workshop", place: "Amer Road, Jaipur", blurb: "Shape and paint a small bowl in Jaipur's famous blue-and-white style. Seated, at your own pace.", duration: "2 h", adult: 900, child: 450, slots: ["11:00 AM", "3:00 PM"], meet: "Meet at the studio on Amer Road", tag: "Jaipur", senior: true, carPrice: 600 },

  // Cars with a driver.
  { id: "car-senior", kind: "car", title: "Senior-friendly city car · 4 hours", place: "Ahmedabad · pickup from your hotel", blurb: "A comfortable sedan with a low step. The driver helps with getting in and out, waits at each stop and goes at your pace.", duration: "4 hours", adult: 1400, child: 0, slots: ["8:00 AM", "10:00 AM", "2:00 PM"], meet: "The driver calls you 15 minutes before pickup", tag: "Senior-friendly", senior: true, seats: 4 },
  { id: "car-wheelchair", kind: "car", title: "Wheelchair-accessible van · 4 hours", place: "Ahmedabad · pickup from your hotel", blurb: "A van with a ramp and space for a wheelchair, plus three more seats. The driver is trained to help.", duration: "4 hours", adult: 2200, child: 0, slots: ["8:00 AM", "10:00 AM", "2:00 PM"], meet: "The driver calls you 15 minutes before pickup", tag: "Wheelchair access", senior: true, seats: 4 },
  { id: "car-day", kind: "car", title: "Full-day car with driver · 8 hours", place: "Ahmedabad, Adalaj and Sarkhej", blurb: "Your own car and driver for the day: the Old City in the morning, Adalaj Stepwell at noon and Sarkhej Roza at sunset.", duration: "8 hours", adult: 2400, child: 0, slots: ["8:00 AM", "9:00 AM"], meet: "The driver calls you 15 minutes before pickup", senior: true, seats: 4 },
  { id: "car-pickup", kind: "car", title: "Station or airport pickup", place: "Ahmedabad airport or Kalupur station", blurb: "A driver waits with your name on a sign and takes you to your hotel. Help with bags included.", duration: "Up to 1 hour", adult: 700, child: 0, slots: ["6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"], meet: "The driver waits at arrivals with your name", tag: "Easy for seniors", senior: true, seats: 4 },
  { id: "car-jaipur", kind: "car", title: "Jaipur forts by car · 8 hours", place: "Amber Fort, Jal Mahal and Nahargarh", blurb: "A car and driver for Jaipur's hill forts, with stops at Jal Mahal and a sunset at Nahargarh.", duration: "8 hours", adult: 2800, child: 0, slots: ["8:00 AM", "9:00 AM"], meet: "The driver calls you 15 minutes before pickup", img: "/images/amber-fort.jpg", tag: "Jaipur", seats: 4 },
  { id: "amber-fort", kind: "entry", title: "Amber Fort", place: "Amer, 11 km from Jaipur", blurb: "Entry to the hilltop palace-fort: the Sheesh Mahal, the courtyards and the view over Maota Lake. Allow three hours.", duration: "Any time, 8 AM – 5:30 PM", adult: 100, child: 0, slots: ["8:00 AM", "10:00 AM", "2:00 PM"], meet: "Show your code at the ticket window", img: "/images/amber-fort.jpg", tag: "Jaipur · palace", carPrice: 900 },
  { id: "city-palace-udaipur", kind: "guided", title: "City Palace, Udaipur, with a guide", place: "City Palace, Udaipur", blurb: "The courtyards, mirror rooms and lake views of the Mewar palace, with a guide who knows its stories.", duration: "2 h", adult: 700, child: 350, slots: ["9:30 AM", "2:00 PM"], meet: "Meet at the Badi Pol gate", tag: "Udaipur · palace", senior: true, carPrice: 600 },
  { id: "hawamahal", kind: "entry", title: "Hawa Mahal", place: "Jaipur, Rajasthan", blurb: "Entry to the Palace of Winds. Best at sunrise.", duration: "Any time, 9 AM – 5 PM", adult: 50, child: 0, slots: ["Any time"], meet: "Show your code at the ticket window", img: "/images/hawa-mahal.jpg", tag: "Jaipur", carPrice: 500 },
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
  // Cars: where to pick up, and the help asked for.
  pickup?: string;
  help?: string[];
  // A car there and back added to a tour or ticket.
  car?: { id: string; label: string; price: number };
  total: number;
  // Set when the traveller cancels: what was kept as the charge and what was refunded.
  cancelled?: { at: number; fee: number; refund: number };
};

// Cancelling keeps half the price as a cancellation charge and refunds the rest.
export const CANCEL_FEE_RATE = 0.5;
export const cancelTerms = (total: number) => {
  const fee = Math.round(total * CANCEL_FEE_RATE);
  return { fee, refund: total - fee };
};

export const bookable = (id: string) => BOOKABLES.find((b) => b.id === id);
export const rupees = (n: number) => (n === 0 ? "Free" : `₹${n.toLocaleString("en-IN")}`);
export const priceOf = (b: Bookable, adults: number, children: number) => (b.kind === "car" ? b.adult : b.adult * adults + b.child * children);

// What each kind is called on a card.
export const KIND_LABEL: Record<Bookable["kind"], string> = { guided: "Guided walk", entry: "Entry ticket", activity: "Activity", car: "Car with driver" };

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
