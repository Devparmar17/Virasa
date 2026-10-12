// City trip plans: a curated day-by-day outline for each city on Home's
// "Plan your next city" row. `core` stops are always in the plan; the others
// are added when one of their interests is switched on.

export type Interest = "arch" | "food" | "craft" | "legend" | "spirit" | "photo";
export const INTERESTS: [Interest, string][] = [
  ["arch", "Architecture"],
  ["food", "Food"],
  ["craft", "Crafts"],
  ["legend", "Legends"],
  ["spirit", "Spiritual"],
  ["photo", "Photo spots"],
];

export type Slot = "Morning" | "Afternoon" | "Evening";
export type Stop = { day: number; slot: Slot; name: string; note: string; tags: Interest[]; core?: boolean };
export type CityPlan = { id: string; name: string; img: string; alt: string; tag: string; season: string; getting: string; ticket?: string; stops: Stop[] };

export const CITY_PLANS: CityPlan[] = [
  {
    id: "jaipur",
    img: "/images/amber-fort.jpg",
    alt: "Amber Fort, Jaipur",
    name: "Jaipur",
    tag: "Rajasthan · forts & bazaars",
    season: "Best October to March",
    getting: "Overnight train or a 1 h 20 flight from Ahmedabad",
    ticket: "hawamahal",
    stops: [
      { day: 1, slot: "Morning", name: "Amber Fort", note: "Be at the gate when it opens and walk up through Suraj Pol before the heat.", tags: ["arch"], core: true },
      { day: 1, slot: "Morning", name: "Panna Meena ka Kund", note: "A criss-cross stepwell five minutes from the fort.", tags: ["photo", "arch"] },
      { day: 1, slot: "Afternoon", name: "City Palace", note: "Still partly a royal home. Look for the four painted season gates.", tags: ["arch"], core: true },
      { day: 1, slot: "Afternoon", name: "Jantar Mantar", note: "Sawai Jai Singh's observatory of giant stone instruments, UNESCO-listed.", tags: ["arch"], core: true },
      { day: 1, slot: "Evening", name: "Hawa Mahal and Johari Bazaar", note: "See the Palace of Winds from the street, then walk the jewellers' market.", tags: ["arch", "craft"], core: true },
      { day: 1, slot: "Evening", name: "Dal baati churma dinner", note: "The classic Rajasthani plate: baked wheat balls, lentils and sweet crumble.", tags: ["food"] },
      { day: 2, slot: "Morning", name: "Nahargarh Fort", note: "Sunrise over the whole city from the ridge.", tags: ["arch", "photo"], core: true },
      { day: 2, slot: "Morning", name: "Pyaaz kachori breakfast", note: "Onion-stuffed fried pastry, a Jaipur morning habit.", tags: ["food"] },
      { day: 2, slot: "Afternoon", name: "Albert Hall Museum", note: "Indo-Saracenic building of 1887 with a strong crafts collection.", tags: ["arch", "craft"], core: true },
      { day: 2, slot: "Afternoon", name: "Sanganer block printers", note: "Watch hand-block printing and paper making in the workshops.", tags: ["craft"] },
      { day: 2, slot: "Evening", name: "Galta Ji", note: "Temples and spring-fed tanks in a ravine at the edge of the city.", tags: ["spirit", "legend"], core: true },
      { day: 3, slot: "Morning", name: "Chand Baori, Abhaneri", note: "Day trip, 95 km: one of the deepest stepwells in India, about 3,500 steps.", tags: ["arch", "photo"], core: true },
      { day: 3, slot: "Afternoon", name: "Jaigarh Fort", note: "The fort above Amber, home to the huge Jaivana cannon.", tags: ["arch", "legend"], core: true },
      { day: 3, slot: "Evening", name: "Patrika Gate", note: "Painted arches at Jawahar Circle, best in the last light.", tags: ["photo"] },
    ],
  },
  {
    id: "varanasi",
    img: "/images/varanasi-ghats.jpg",
    alt: "Boats on the Ganga at Varanasi at sunrise",
    name: "Varanasi",
    tag: "Uttar Pradesh · ghats",
    season: "Best October to March",
    getting: "Direct flights from Ahmedabad, about 2 hours",
    stops: [
      { day: 1, slot: "Morning", name: "Dawn boat on the Ganga", note: "Row from Assi Ghat north past Dashashwamedh as the city wakes.", tags: ["spirit", "photo"], core: true },
      { day: 1, slot: "Morning", name: "Kashi Vishwanath Temple", note: "The city's principal Shiva temple. Leave phones and bags in a locker.", tags: ["spirit", "arch"], core: true },
      { day: 1, slot: "Afternoon", name: "Kachori Gali and Thatheri Bazaar", note: "Old-lane snacks: kachori-sabzi, chaat and lassi in clay cups.", tags: ["food"] },
      { day: 1, slot: "Afternoon", name: "Banarasi silk weavers", note: "See brocade woven on handlooms in the weavers' quarter.", tags: ["craft"] },
      { day: 1, slot: "Evening", name: "Ganga aarti at Dashashwamedh Ghat", note: "Arrive 45 minutes early, or watch from a boat.", tags: ["spirit"], core: true },
      { day: 2, slot: "Morning", name: "Sarnath", note: "10 km out: where the Buddha first taught. Dhamek Stupa and the Lion Capital in the museum.", tags: ["arch", "spirit", "legend"], core: true },
      { day: 2, slot: "Afternoon", name: "Ramnagar Fort", note: "The Maharaja's 18th-century fort across the river, with a faded museum.", tags: ["arch"], core: true },
      { day: 2, slot: "Afternoon", name: "Bharat Kala Bhavan", note: "The university museum: miniature paintings, textiles and sculpture.", tags: ["craft", "arch"] },
      { day: 2, slot: "Evening", name: "Assi Ghat at dusk", note: "A quieter evening by the river, with music most nights.", tags: ["photo"], core: true },
      { day: 3, slot: "Morning", name: "Subah-e-Banaras", note: "Sunrise ritual, music and yoga at Assi Ghat.", tags: ["spirit"], core: true },
      { day: 3, slot: "Afternoon", name: "Chunar Fort", note: "Day trip, 40 km: a sandstone fort on a bluff above the Ganga.", tags: ["arch", "legend"], core: true },
      { day: 3, slot: "Evening", name: "Panchganga Ghat and Alamgir Mosque", note: "Climb the steps for the wide view down the river.", tags: ["arch", "photo"] },
    ],
  },
  {
    id: "hampi",
    img: "/images/hampi-chariot.jpg",
    alt: "The stone chariot at Vittala Temple, Hampi",
    name: "Hampi",
    tag: "Karnataka · Vijayanagara ruins",
    season: "Best November to February",
    getting: "Fly to Hubballi or Bengaluru, then by road to Hosapete",
    stops: [
      { day: 1, slot: "Morning", name: "Virupaksha Temple and Hampi Bazaar", note: "The living temple at the heart of the ruins, in worship since the 7th century.", tags: ["arch", "spirit"], core: true },
      { day: 1, slot: "Afternoon", name: "Krishna Temple and the monolithic Ganeshas", note: "Kadalekalu and Sasivekalu Ganesha, each carved from a single boulder.", tags: ["arch"], core: true },
      { day: 1, slot: "Afternoon", name: "Thali by the river", note: "A South Indian meal on a banana leaf near the Tungabhadra.", tags: ["food"] },
      { day: 1, slot: "Evening", name: "Hemakuta Hill", note: "Small early shrines and the classic sunset over the boulders.", tags: ["photo", "arch"], core: true },
      { day: 2, slot: "Morning", name: "Vittala Temple", note: "The stone chariot and the hall of musical pillars. Walk in along the river.", tags: ["arch"], core: true },
      { day: 2, slot: "Morning", name: "Achyutaraya Temple", note: "A quieter complex on the riverside path, often nearly empty.", tags: ["arch", "photo"] },
      { day: 2, slot: "Afternoon", name: "Royal Enclosure", note: "Lotus Mahal, the Elephant Stables and the Queen's Bath.", tags: ["arch"], core: true },
      { day: 2, slot: "Afternoon", name: "Hazara Rama Temple", note: "The royal chapel, its walls carved with the whole Ramayana.", tags: ["legend", "arch"] },
      { day: 3, slot: "Morning", name: "Matanga Hill", note: "A steep 30-minute climb for sunrise over the whole site.", tags: ["photo"], core: true },
      { day: 3, slot: "Afternoon", name: "Anegundi and Anjanadri Hill", note: "Cross the river to the older village; the hill is held to be Hanuman's birthplace.", tags: ["legend", "spirit"], core: true },
      { day: 3, slot: "Afternoon", name: "Banana-fibre craft workshops", note: "Village women in Anegundi weave bags and mats from banana fibre.", tags: ["craft"] },
      { day: 3, slot: "Evening", name: "Coracle on the Tungabhadra", note: "A round basket boat between the boulders at dusk.", tags: ["photo"] },
    ],
  },
  {
    id: "kolkata",
    img: "/images/victoria-memorial.jpg",
    alt: "Victoria Memorial, Kolkata",
    name: "Kolkata",
    tag: "West Bengal · colonial lanes",
    season: "Best November to February",
    getting: "Direct flights from Ahmedabad, about 2 h 30",
    stops: [
      { day: 1, slot: "Morning", name: "Victoria Memorial", note: "White marble hall of 1921 in wide gardens. Go early for the light.", tags: ["arch", "photo"], core: true },
      { day: 1, slot: "Morning", name: "St Paul's Cathedral", note: "Gothic Revival cathedral a short walk away.", tags: ["arch"] },
      { day: 1, slot: "Afternoon", name: "Indian Museum", note: "The oldest museum in India, founded in 1814.", tags: ["arch", "craft"], core: true },
      { day: 1, slot: "Afternoon", name: "Kathi rolls on Park Street", note: "Kolkata's own street food: a paratha rolled around kebab.", tags: ["food"] },
      { day: 1, slot: "Evening", name: "Prinsep Ghat", note: "A boat on the Hooghly with the bridge lit up behind.", tags: ["photo"], core: true },
      { day: 2, slot: "Morning", name: "Mallick Ghat flower market and Howrah Bridge", note: "Go at dawn, when the marigold sellers are busiest.", tags: ["photo"], core: true },
      { day: 2, slot: "Morning", name: "Kumartuli", note: "The potters' quarter, where clay idols are shaped for the festivals.", tags: ["craft"], core: true },
      { day: 2, slot: "Afternoon", name: "College Street and the Indian Coffee House", note: "A mile of book stalls, then coffee where the city argues.", tags: ["legend"], core: true },
      { day: 2, slot: "Afternoon", name: "Jorasanko Thakurbari", note: "The Tagore family home, now a museum.", tags: ["legend", "arch"] },
      { day: 2, slot: "Evening", name: "Mishti in North Kolkata", note: "Rosogolla, sandesh and mishti doi at an old sweet shop.", tags: ["food"] },
      { day: 3, slot: "Morning", name: "Tiretta Bazaar breakfast", note: "Chinese breakfast sold on the street from about 6 AM.", tags: ["food"] },
      { day: 3, slot: "Morning", name: "Dakshineswar and Belur Math", note: "The riverside Kali temple, then a ferry across to the Ramakrishna Mission.", tags: ["spirit", "arch"], core: true },
      { day: 3, slot: "Afternoon", name: "South Park Street Cemetery", note: "Overgrown 18th-century tombs, calm in the middle of the city.", tags: ["legend", "arch"], core: true },
      { day: 3, slot: "Evening", name: "Tram ride and New Market", note: "Ride one of the last trams in India, then shop the old covered market.", tags: ["craft"] },
    ],
  },
];

export const cityPlan = (id: string) => CITY_PLANS.find((c) => c.id === id);

export type SavedPlan = { days: number; interests: Interest[]; savedAt: number };
export const DEFAULT_INTERESTS: Interest[] = ["arch", "food", "legend"];

// The stops for a trip of `days` days with these interests switched on.
export function planStops(city: CityPlan, days: number, interests: Interest[]) {
  return city.stops.filter((s) => s.day <= days && (s.core || s.tags.some((t) => interests.includes(t))));
}
