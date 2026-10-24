// Where the traveller is: a city they picked, or the one their location is
// nearest to. Home, the AI Guide, search and Discover all follow it. Walks,
// stories and the map cover Ahmedabad's Old City, so elsewhere those screens
// say so and lead to the planner and Discover instead.

export type Here = { city: string; state: string; lat?: number; lon?: number; km?: number; source: "default" | "gps" | "picked" };

export const DEFAULT_HERE: Here = { city: "Ahmedabad", state: "Gujarat", source: "default" };

export const isAhmedabad = (h: Pick<Here, "city">) => /^(ahmedabad|amdavad)\b/i.test(h.city.trim());

// Cities Virasa can recognise from a location: name, state, latitude, longitude.
const CITIES: [string, string, number, number][] = [
  ["Ahmedabad", "Gujarat", 23.0225, 72.5714],
  ["Vadodara", "Gujarat", 22.3072, 73.1812],
  ["Surat", "Gujarat", 21.1702, 72.8311],
  ["Rajkot", "Gujarat", 22.3039, 70.8022],
  ["Bhuj", "Gujarat", 23.242, 69.6669],
  ["Dwarka", "Gujarat", 22.2394, 68.9678],
  ["Somnath", "Gujarat", 20.888, 70.4012],
  ["Patan", "Gujarat", 23.8493, 72.1266],
  ["Gandhinagar", "Gujarat", 23.2156, 72.6369],
  ["Jaipur", "Rajasthan", 26.9124, 75.7873],
  ["Udaipur", "Rajasthan", 24.5854, 73.7125],
  ["Jodhpur", "Rajasthan", 26.2389, 73.0243],
  ["Jaisalmer", "Rajasthan", 26.9157, 70.9083],
  ["Ajmer", "Rajasthan", 26.4499, 74.6399],
  ["Delhi", "Delhi", 28.6139, 77.209],
  ["Agra", "Uttar Pradesh", 27.1767, 78.0081],
  ["Varanasi", "Uttar Pradesh", 25.3176, 82.9739],
  ["Lucknow", "Uttar Pradesh", 26.8467, 80.9462],
  ["Mumbai", "Maharashtra", 19.076, 72.8777],
  ["Pune", "Maharashtra", 18.5204, 73.8567],
  ["Aurangabad", "Maharashtra", 19.8762, 75.3433],
  ["Nashik", "Maharashtra", 19.9975, 73.7898],
  ["Kolkata", "West Bengal", 22.5726, 88.3639],
  ["Darjeeling", "West Bengal", 27.041, 88.2663],
  ["Chennai", "Tamil Nadu", 13.0827, 80.2707],
  ["Madurai", "Tamil Nadu", 9.9252, 78.1198],
  ["Thanjavur", "Tamil Nadu", 10.787, 79.1378],
  ["Mahabalipuram", "Tamil Nadu", 12.6208, 80.1945],
  ["Puducherry", "Puducherry", 11.9416, 79.8083],
  ["Bengaluru", "Karnataka", 12.9716, 77.5946],
  ["Mysuru", "Karnataka", 12.2958, 76.6394],
  ["Hampi", "Karnataka", 15.335, 76.46],
  ["Hyderabad", "Telangana", 17.385, 78.4867],
  ["Kochi", "Kerala", 9.9312, 76.2673],
  ["Thiruvananthapuram", "Kerala", 8.5241, 76.9366],
  ["Goa", "Goa", 15.4909, 73.8278],
  ["Amritsar", "Punjab", 31.634, 74.8723],
  ["Chandigarh", "Chandigarh", 30.7333, 76.7794],
  ["Shimla", "Himachal Pradesh", 31.1048, 77.1734],
  ["Rishikesh", "Uttarakhand", 30.0869, 78.2676],
  ["Haridwar", "Uttarakhand", 29.9457, 78.1642],
  ["Bhopal", "Madhya Pradesh", 23.2599, 77.4126],
  ["Khajuraho", "Madhya Pradesh", 24.8318, 79.9199],
  ["Gwalior", "Madhya Pradesh", 26.2183, 78.1828],
  ["Bhubaneswar", "Odisha", 20.2961, 85.8245],
  ["Puri", "Odisha", 19.8135, 85.8312],
  ["Guwahati", "Assam", 26.1445, 91.7362],
  ["Patna", "Bihar", 25.5941, 85.1376],
  ["Bodh Gaya", "Bihar", 24.6961, 84.987],
  ["Srinagar", "Jammu and Kashmir", 34.0837, 74.7973],
  ["Leh", "Ladakh", 34.1526, 77.5771],
  ["Gangtok", "Sikkim", 27.3389, 88.6065],
  ["Shillong", "Meghalaya", 25.5788, 91.8933],
];

export const KNOWN_CITIES = CITIES.map(([city, state]) => ({ city, state }));

export function kmBetween(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// The known city nearest to a location, and how far it is.
export function nearestCity(lat: number, lon: number) {
  let best = { city: CITIES[0][0], state: CITIES[0][1], km: Infinity };
  for (const [city, state, la, lo] of CITIES) {
    const km = kmBetween({ lat, lon }, { lat: la, lon: lo });
    if (km < best.km) best = { city, state, km };
  }
  return best;
}

// A city typed or picked by name: its state when Virasa knows it.
export function cityByName(name: string): Here {
  const clean = name.trim().replace(/\s+/g, " ");
  const hit = CITIES.find(([c]) => c.toLowerCase() === clean.toLowerCase());
  return { city: hit ? hit[0] : clean.replace(/\b\w/g, (c) => c.toUpperCase()), state: hit ? hit[1] : "", source: "picked" };
}

// "Ahmedabad, Old City" at home; "Jaipur, Rajasthan" elsewhere.
export const hereLabel = (h: Here) => (isAhmedabad(h) ? "Ahmedabad, Old City" : h.state ? `${h.city}, ${h.state}` : h.city);
