// AI trip plans: what the planner asks for, the shape of a plan, and a plan
// built from Virasa's own data for cities it already knows (used when Gemini
// isn't connected or doesn't answer).
import { CITY_PLANS, planStops, type Interest } from "./plans";
import type { Profile } from "./profile";

export type StopKind = "heritage" | "food" | "hidden" | "nature" | "spiritual" | "market" | "rest";
export type TripStop = { slot: "Morning" | "Afternoon" | "Evening"; name: string; kind: StopKind; why: string; tip?: string; duration?: string; cost?: string };
export type TripDay = { day: number; theme: string; stops: TripStop[] };
export type Trip = {
  title: string;
  city: string;
  summary: string;
  bestTime?: string;
  gettingAround?: string;
  budget?: string;
  days: TripDay[];
  food: { name: string; dish: string; area?: string; why: string }[];
  hidden: { name: string; area?: string; why: string }[];
  tips: string[];
  source?: "gemini" | "library";
};

export const TRIP_INTERESTS: [string, string][] = [
  ["heritage", "Heritage & history"],
  ["food", "Local food"],
  ["hidden", "Hidden gems"],
  ["spiritual", "Temples & spiritual"],
  ["nature", "Nature & views"],
  ["markets", "Markets & crafts"],
  ["photo", "Photo spots"],
  ["stories", "Legends & stories"],
];

export const POPULAR_CITIES = ["Ahmedabad", "Jaipur", "Varanasi", "Udaipur", "Hampi", "Kolkata", "Delhi", "Mysuru", "Kochi", "Amritsar"];

export type TripRequest = { city: string; days: number; interests: string[]; profile: Profile; lang: string; notes?: string };

// A plan on this phone: the last one made, or one saved to Saved › Plans.
export type SavedTrip = { id: string; trip: Trip; lang: string; savedAt: number; profile?: Profile };
export const tripId = (city: string) => `${city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;

// Photos Virasa has for a city, for the plan's cover.
const CITY_IMG: Record<string, string> = {
  ahmedabad: "/images/sidi-tree.jpg",
  amdavad: "/images/sidi-tree.jpg",
  jaipur: "/images/hawa-mahal.jpg",
  varanasi: "/images/varanasi-ghats.jpg",
  banaras: "/images/varanasi-ghats.jpg",
  hampi: "/images/hampi-chariot.jpg",
  kolkata: "/images/victoria-memorial.jpg",
  patan: "/images/rani-ki-vav.jpg",
};
export const cityImage = (city: string): string | undefined => CITY_IMG[city.trim().toLowerCase().split(/[ ,]/)[0]];

// The JSON shape Gemini must answer in.
export const TRIP_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    city: { type: "STRING" },
    summary: { type: "STRING" },
    bestTime: { type: "STRING" },
    gettingAround: { type: "STRING" },
    budget: { type: "STRING" },
    days: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          day: { type: "INTEGER" },
          theme: { type: "STRING" },
          stops: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                slot: { type: "STRING", enum: ["Morning", "Afternoon", "Evening"] },
                name: { type: "STRING" },
                kind: { type: "STRING", enum: ["heritage", "food", "hidden", "nature", "spiritual", "market", "rest"] },
                why: { type: "STRING" },
                tip: { type: "STRING" },
                duration: { type: "STRING" },
                cost: { type: "STRING" },
              },
              required: ["slot", "name", "kind", "why"],
            },
          },
        },
        required: ["day", "theme", "stops"],
      },
    },
    food: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, dish: { type: "STRING" }, area: { type: "STRING" }, why: { type: "STRING" } }, required: ["name", "dish", "why"] } },
    hidden: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, area: { type: "STRING" }, why: { type: "STRING" } }, required: ["name", "why"] } },
    tips: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["title", "city", "summary", "days", "food", "hidden", "tips"],
};

const norm = (s: string) => s.trim().toLowerCase();

// Interest names from the planner, in the curated plans' terms.
const CURATED: Record<string, Interest[]> = { heritage: ["arch"], food: ["food"], markets: ["craft"], stories: ["legend"], spiritual: ["spirit"], photo: ["photo"], hidden: ["legend", "photo"], nature: ["photo"] };
const KIND: Record<Interest, StopKind> = { arch: "heritage", food: "food", craft: "market", legend: "hidden", spirit: "spiritual", photo: "nature" };

// A plan from Virasa's own data, for the cities it knows. Null for other cities.
export function libraryTrip(req: TripRequest): Trip | null {
  const city = norm(req.city);
  if (city === "ahmedabad" || city === "amdavad") return ahmedabadTrip(req);
  const plan = CITY_PLANS.find((c) => norm(c.name) === city || c.id === city);
  if (!plan) return null;
  const wanted = [...new Set(req.interests.flatMap((i) => CURATED[i] ?? []))];
  const days = Math.min(req.days, Math.max(...plan.stops.map((s) => s.day)));
  const stops = planStops(plan, days, wanted.length ? wanted : ["arch", "food"]);
  return {
    title: `${days} ${days === 1 ? "day" : "days"} in ${plan.name}`,
    city: plan.name,
    summary: `A day-by-day outline of ${plan.name}: ${plan.tag.toLowerCase()}.`,
    bestTime: plan.season,
    gettingAround: plan.getting,
    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      theme: i === 0 ? "The highlights" : `Day ${i + 1}`,
      stops: stops.filter((s) => s.day === i + 1).map((s) => ({ slot: s.slot, name: s.name, kind: KIND[s.tags[0]] ?? "heritage", why: s.note })),
    })),
    food: stops.filter((s) => s.tags.includes("food")).map((s) => ({ name: s.name, dish: s.name, why: s.note })),
    hidden: [],
    tips: [plan.season, plan.getting],
    source: "library",
  };
}

function ahmedabadTrip(req: TripRequest): Trip {
  const elders = req.profile.party === "family-elders" || req.profile.stepFree;
  const kids = req.profile.party === "family-kids";
  const day1: TripStop[] = [
    { slot: "Morning", name: "Sidi Saiyyed Mosque", kind: "heritage", why: "The Tree of Life jali, the city's most famous stone carving.", tip: "Go before 9 am for soft light.", duration: "30 min", cost: "Free" },
    { slot: "Morning", name: "Bhadra Fort and Teen Darwaza", kind: "heritage", why: "The sultan's fort and its triple gateway, with the lamp said to have burned for 600 years.", duration: "45 min", cost: "Free" },
    { slot: "Afternoon", name: "Jama Masjid", kind: "spiritual", why: "260 pillars under 15 domes — calm and cool at midday.", tip: "Cover shoulders and knees.", duration: "30 min", cost: "Free" },
    { slot: "Evening", name: "Manek Chowk night market", kind: "food", why: "Gwalior dosa, pineapple sandwich and kulfi after 8 pm.", duration: "1 h", cost: "₹100–250 a person" },
  ];
  const day2: TripStop[] = [
    { slot: "Morning", name: elders ? "Calico Museum of Textiles" : "Dhal ni Pol woodcarvings", kind: elders ? "heritage" : "hidden", why: elders ? "A seated guided tour of India's finest textiles." : "Carved wooden havelis and a bird-feeder tower in a gated lane.", duration: "1 h 30", cost: elders ? "Free (book ahead)" : "Free" },
    { slot: "Afternoon", name: "Adalaj Stepwell", kind: "heritage", why: "Five carved storeys going down to the water, cool even at noon.", tip: elders ? "The top level shows most of it without the steps." : undefined, duration: "1 h", cost: "₹25" },
    { slot: "Evening", name: "Sarkhej Roza at sunset", kind: "spiritual", why: "Tombs and pavilions around a great tank, glowing at dusk.", duration: "1 h", cost: "Free" },
  ];
  const all = [day1, day2];
  return {
    title: `${Math.min(req.days, 2)} ${req.days === 1 ? "day" : "days"} in Ahmedabad`,
    city: "Ahmedabad",
    summary: kids ? "Forts, a stepwell to explore and a night food market — short stops with plenty to see." : "The Old City's carved stone, gated lanes and night food, then stepwells and tombs beyond.",
    bestTime: "November to February",
    gettingAround: "Walk the Old City; autos for Adalaj and Sarkhej",
    budget: req.profile.budget === "low" ? "About ₹600 a person a day" : req.profile.budget === "high" ? "About ₹3,000 a person a day" : "About ₹1,200 a person a day",
    days: all.slice(0, Math.max(1, Math.min(req.days, 2))).map((stops, i) => ({ day: i + 1, theme: i === 0 ? "The Old City" : "Stepwells and sunset", stops })),
    food: [
      { name: "Manek Chowk", dish: "Gwalior dosa, pineapple sandwich", area: "Old City", why: "The city's night food square, open past midnight." },
      { name: "Chandravilas", dish: "Fafda and jalebi", area: "Gandhi Road", why: "Frying breakfast snacks since 1900." },
    ],
    hidden: [
      { name: "Dhal ni Pol", area: "Khadia", why: "Carved havelis most visitors walk past." },
      { name: "The lamp at Teen Darwaza", area: "Old City", why: "Said to have been kept burning for six centuries." },
    ],
    tips: ["Carry a scarf: several stops are mosques.", "Start by 8 am — the lanes are cooler and quieter."],
    source: "library",
  };
}
