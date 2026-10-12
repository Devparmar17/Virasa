// Plain data shared by client screens and server routes.

// Places saved in the design's Saved screen start out saved.
export const DEFAULT_SAVED: Record<string, boolean> = { sidi: true, dhal: true, sarkhej: true, hawa: true };

export const LANGS = [
  { id: "en", short: "EN", label: "English", native: "English" },
  { id: "hi", short: "हिं", label: "Hindi", native: "हिन्दी" },
  { id: "gu", short: "ગુ", label: "Gujarati", native: "ગુજરાતી" },
  { id: "ta", short: "த", label: "Tamil", native: "தமிழ்" },
  { id: "bn", short: "বা", label: "Bengali", native: "বাংলা" },
];
export const langOf = (id: string) => LANGS.find((l) => l.id === id) || LANGS[0];
