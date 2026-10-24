// Preferences edited on the Settings screen and read across the app.

export type Settings = {
  length: "quick" | "classic" | "deep";
  pace: "relaxed" | "steady" | "brisk";
  text: "default" | "large" | "xlarge";
  alerts: { nearby: boolean; trips: boolean; digest: boolean };
};

export const DEFAULT_SETTINGS: Settings = {
  length: "classic",
  pace: "relaxed",
  text: "default",
  alerts: { nearby: true, trips: true, digest: false },
};

export const LENGTHS: Record<Settings["length"], string> = { quick: "Quick · 1 min", classic: "Classic · 2 min", deep: "Deep dive · 4 min" };
export const PACES: Record<Settings["pace"], string> = { relaxed: "Relaxed", steady: "Steady", brisk: "Brisk" };
export const TEXT_SIZES: Record<Settings["text"], string> = { default: "Default", large: "Large", xlarge: "Extra large" };

// Metres walked per minute at each pace; the planner's times follow it.
export const PACE_SPEED: Record<Settings["pace"], number> = { relaxed: 80, steady: 90, brisk: 100 };

// How much story transcripts and guide answers are enlarged.
export const TEXT_SCALE: Record<Settings["text"], number> = { default: 1, large: 1.15, xlarge: 1.3 };
