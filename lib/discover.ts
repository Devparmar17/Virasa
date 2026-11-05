// Discover like a local: hidden places, local food, markets and festivals for
// any city. Gemini finds them; for Ahmedabad, Virasa's own guides answer when
// Gemini can't. No ratings are invented — each find says why locals love it,
// and "Maps" opens the real place, with its reviews and opening hours.
import { SECRETS } from "./secrets";

export type FindKind = "hidden" | "food" | "market" | "festival" | "experience";
export type Find = { name: string; kind: FindKind; area?: string; why: string; tryThis?: string; when?: string; tip?: string; href?: string };
// A find saved from Discover, shown under Saved › Places.
export type SavedFind = Find & { city: string; savedAt: number };
export type Discovery = { city: string; intro: string; finds: Find[]; source?: "gemini" | "library" };

export const FIND_KINDS: [FindKind | "all", string][] = [
  ["all", "All"],
  ["hidden", "Hidden places"],
  ["food", "Local food"],
  ["market", "Markets"],
  ["festival", "Festivals"],
  ["experience", "Experiences"],
];

export const DISCOVER_SCHEMA = {
  type: "OBJECT",
  properties: {
    city: { type: "STRING" },
    intro: { type: "STRING" },
    finds: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          kind: { type: "STRING", enum: ["hidden", "food", "market", "festival", "experience"] },
          area: { type: "STRING" },
          why: { type: "STRING" },
          tryThis: { type: "STRING" },
          when: { type: "STRING" },
          tip: { type: "STRING" },
        },
        required: ["name", "kind", "why"],
      },
    },
  },
  required: ["city", "intro", "finds"],
};

const KIND: Record<string, FindKind> = { gem: "hidden", food: "food", legend: "hidden", monument: "hidden" };

// Ahmedabad's finds from Virasa's own guides, each with its page in the app.
export function libraryDiscovery(city: string): Discovery | null {
  if (!["ahmedabad", "amdavad"].includes(city.trim().toLowerCase())) return null;
  return {
    city: "Ahmedabad",
    intro: "Gated lanes, night food and stories most visitors walk past, from Virasa's own guides.",
    finds: SECRETS.filter((s) => s.group !== "highlight").map((s) => ({ name: s.title, kind: KIND[s.kind] ?? "hidden", area: "Old City", why: s.line, href: `/secret?id=${s.id}` })),
    source: "library",
  };
}

// The real place on Google Maps: reviews, opening hours and directions.
export const mapsUrl = (name: string, area: string | undefined, city: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, area, city].filter(Boolean).join(", "))}`;
