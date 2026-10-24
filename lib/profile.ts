// Who is travelling, and how they like to travel. Set in onboarding and
// Settings; the AI Guide, the trip planner and Discover all shape their
// answers to it (simpler and playful for children, gentle and step-free for
// elders, safety notes for solo travellers…).

export type Party = "solo" | "couple" | "family-kids" | "family-elders" | "friends";
export type Budget = "low" | "mid" | "high";
export type Pace = "relaxed" | "normal" | "packed";
export type Diet = "any" | "veg" | "jain";

export type Profile = { party: Party; budget: Budget; pace: Pace; diet: Diet; stepFree: boolean };

export const DEFAULT_PROFILE: Profile = { party: "solo", budget: "mid", pace: "normal", diet: "any", stepFree: false };

export const PARTIES: { id: Party; label: string; hint: string; icon: string }[] = [
  { id: "solo", label: "Just me", hint: "Solo traveller", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" },
  { id: "couple", label: "Couple", hint: "Two of us", icon: "M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 21a6 6 0 0 1 12 0m-2 0a6 6 0 0 1 10 0" },
  { id: "family-kids", label: "Family with kids", hint: "Short walks, fun stories", icon: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm9 3a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 21a5 5 0 0 1 10 0m1 0a3.5 3.5 0 0 1 7 0" },
  { id: "family-elders", label: "With elders", hint: "Easy pace, rest stops", icon: "M10 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 15 2-9h6l1 4m-3-4v9m7-7v7m0-7a2 2 0 0 0-2-2" },
  { id: "friends", label: "Friends", hint: "A group trip", icon: "M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 21a5 5 0 0 1 8-4m12 4a5 5 0 0 0-8-4m-6 4a4 4 0 0 1 8 0" },
];
export const BUDGETS: [Budget, string, string][] = [
  ["low", "₹", "Budget"],
  ["mid", "₹₹", "Comfortable"],
  ["high", "₹₹₹", "Splurge"],
];
export const PACES: [Pace, string][] = [
  ["relaxed", "Relaxed"],
  ["normal", "Balanced"],
  ["packed", "See it all"],
];
export const DIETS: [Diet, string][] = [
  ["any", "Anything"],
  ["veg", "Vegetarian"],
  ["jain", "Jain"],
];

const PARTY_NOTE: Record<Party, string> = {
  solo: "a solo traveller — include safety tips, places that are easy to visit alone, and chances to meet locals",
  couple: "a couple — include scenic spots, good places for an evening out, and quieter corners",
  "family-kids": "a family with young children — keep walks short, add breaks, playful stories and kid-friendly food, and explain things simply and with fun",
  "family-elders": "a family with elderly members — keep a gentle pace, avoid long walks and steep steps, suggest places to sit and rest, toilets and shade",
  friends: "a group of friends — include lively food streets, markets, photo spots and evening plans",
};
const BUDGET_NOTE: Record<Budget, string> = { low: "a tight budget (free sights, street food, shared autos)", mid: "a comfortable mid-range budget", high: "a generous budget (good restaurants, guided tours, cabs)" };
const PACE_NOTE: Record<Pace, string> = { relaxed: "a relaxed pace (2–3 stops a day)", normal: "a balanced pace (4–5 stops a day)", packed: "a packed pace (as much as fits in a day)" };
const DIET_NOTE: Record<Diet, string> = { any: "", veg: "Food must be vegetarian.", jain: "Food must be Jain (no onion, garlic or root vegetables)." };

// One plain sentence about the traveller, for an AI prompt.
export function describeProfile(p: Profile) {
  return [`The traveller is ${PARTY_NOTE[p.party]}.`, `They travel on ${BUDGET_NOTE[p.budget]} at ${PACE_NOTE[p.pace]}.`, DIET_NOTE[p.diet], p.stepFree ? "They need step-free, wheelchair-friendly routes." : ""].filter(Boolean).join(" ");
}

// Accepts whatever the browser sent and keeps only valid values.
export function cleanProfile(x: unknown): Profile {
  const o = (x && typeof x === "object" ? x : {}) as Partial<Profile>;
  const pick = <T extends string>(v: unknown, ok: readonly T[], d: T) => (ok.includes(v as T) ? (v as T) : d);
  return {
    party: pick(o.party, ["solo", "couple", "family-kids", "family-elders", "friends"], DEFAULT_PROFILE.party),
    budget: pick(o.budget, ["low", "mid", "high"], DEFAULT_PROFILE.budget),
    pace: pick(o.pace, ["relaxed", "normal", "packed"], DEFAULT_PROFILE.pace),
    diet: pick(o.diet, ["any", "veg", "jain"], DEFAULT_PROFILE.diet),
    stepFree: Boolean(o.stepFree),
  };
}
