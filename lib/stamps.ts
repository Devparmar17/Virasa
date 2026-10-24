// Passport stamps: one for each place the traveller has really been to. A
// stamp is added only when the phone's location shows they are at the place.

export type Stamp = { id: string; name: string; city: string; state: string; at: number };

// Where Virasa's own places are, to check that the traveller is really there.
export const PLACE_SPOTS: Record<string, { name: string; city: string; state: string; lat: number; lon: number }> = {
  sidi: { name: "Sidi Saiyyed Mosque", city: "Ahmedabad", state: "Gujarat", lat: 23.0273, lon: 72.581 },
  bhadra: { name: "Bhadra Fort", city: "Ahmedabad", state: "Gujarat", lat: 23.024, lon: 72.5806 },
  teen: { name: "Teen Darwaza", city: "Ahmedabad", state: "Gujarat", lat: 23.0243, lon: 72.5838 },
  jama: { name: "Jama Masjid", city: "Ahmedabad", state: "Gujarat", lat: 23.0236, lon: 72.5867 },
  manek: { name: "Manek Chowk", city: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.588 },
  dhal: { name: "Dhal ni Pol", city: "Ahmedabad", state: "Gujarat", lat: 23.0213, lon: 72.5937 },
  kalupur: { name: "Kalupur Swaminarayan Temple", city: "Ahmedabad", state: "Gujarat", lat: 23.0283, lon: 72.5964 },
  sarkhej: { name: "Sarkhej Roza", city: "Ahmedabad", state: "Gujarat", lat: 22.9926, lon: 72.5022 },
  adalaj: { name: "Adalaj Stepwell", city: "Ahmedabad", state: "Gujarat", lat: 23.1667, lon: 72.5806 },
  chandravilas: { name: "Chandravilas", city: "Ahmedabad", state: "Gujarat", lat: 23.0245, lon: 72.5852 },
  ranikivav: { name: "Rani ki Vav", city: "Patan", state: "Gujarat", lat: 23.8589, lon: 72.1016 },
  hawamahal: { name: "Hawa Mahal", city: "Jaipur", state: "Rajasthan", lat: 26.9239, lon: 75.8267 },
  amber: { name: "Amber Fort", city: "Jaipur", state: "Rajasthan", lat: 26.9855, lon: 75.8513 },
  citypalace: { name: "City Palace", city: "Udaipur", state: "Rajasthan", lat: 24.5764, lon: 73.6835 },
  taj: { name: "Taj Mahal", city: "Agra", state: "Uttar Pradesh", lat: 27.1751, lon: 78.0421 },
  dashashwamedh: { name: "Dashashwamedh Ghat", city: "Varanasi", state: "Uttar Pradesh", lat: 25.3069, lon: 83.0105 },
  qutub: { name: "Qutub Minar", city: "Delhi", state: "Delhi", lat: 28.5245, lon: 77.1855 },
  redfort: { name: "Red Fort", city: "Delhi", state: "Delhi", lat: 28.6562, lon: 77.241 },
  goldentemple: { name: "Golden Temple", city: "Amritsar", state: "Punjab", lat: 31.62, lon: 74.8765 },
  victoria: { name: "Victoria Memorial", city: "Kolkata", state: "West Bengal", lat: 22.5448, lon: 88.3426 },
  gateway: { name: "Gateway of India", city: "Mumbai", state: "Maharashtra", lat: 18.922, lon: 72.8347 },
  vittala: { name: "Vittala Temple", city: "Hampi", state: "Karnataka", lat: 15.342, lon: 76.474 },
  mysorepalace: { name: "Mysore Palace", city: "Mysuru", state: "Karnataka", lat: 12.3052, lon: 76.6552 },
};

// The order stamps are shown in the passport: famous places across India first, then Ahmedabad's Old City.
export const STAMP_ORDER = ["taj", "hawamahal", "goldentemple", "qutub", "sidi", "dashashwamedh", "victoria", "gateway", "amber", "citypalace", "redfort", "vittala", "mysorepalace", "ranikivav", "adalaj", "jama", "bhadra", "teen", "manek", "dhal", "kalupur", "sarkhej", "chandravilas"];

// Close enough to count as being there (the spots above are approximate).
export const ARRIVED_KM = 0.4;

// Short state codes for the stamp's seal.
const CODES: Record<string, string> = { Gujarat: "GJ", Rajasthan: "RJ", Delhi: "DL", "Uttar Pradesh": "UP", Maharashtra: "MH", "West Bengal": "WB", "Tamil Nadu": "TN", Karnataka: "KA", Kerala: "KL", Telangana: "TS", Punjab: "PB", Goa: "GA", "Madhya Pradesh": "MP", Odisha: "OD", Bihar: "BR" };
export const stateCode = (state: string) => CODES[state] ?? state.slice(0, 2).toUpperCase();
