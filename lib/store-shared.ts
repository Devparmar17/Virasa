// Plain data shared by client screens and server routes.

// A new traveller starts with nothing saved.
export const DEFAULT_SAVED: Record<string, boolean> = {};

export const LANGS = [
  { id: "en", short: "EN", label: "English", native: "English" },
  { id: "hi", short: "हिं", label: "Hindi", native: "हिन्दी" },
  { id: "gu", short: "ગુ", label: "Gujarati", native: "ગુજરાતી" },
  { id: "ta", short: "த", label: "Tamil", native: "தமிழ்" },
  { id: "bn", short: "বা", label: "Bengali", native: "বাংলা" },
  { id: "mr", short: "म", label: "Marathi", native: "मराठी" },
  { id: "te", short: "తె", label: "Telugu", native: "తెలుగు" },
  { id: "kn", short: "ಕ", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "ml", short: "മ", label: "Malayalam", native: "മലയാളം" },
  { id: "pa", short: "ਪੰ", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];
export const langOf = (id: string) => LANGS.find((l) => l.id === id) || LANGS[0];
// The speech voice for a language: English, Hindi, Tamil… as spoken in India.
export const speechLocale = (id: string) => `${langOf(id).id}-IN`;
