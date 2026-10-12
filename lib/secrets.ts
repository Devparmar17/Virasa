// "Local secrets & flavours": the three neighbourhood finds on Home, each with
// its own description page. The page is laid out to suit the kind of find:
// things to spot for a hidden gem, dishes for a food market, and the tale set
// apart from the record for folklore.

export type SecretKind = "gem" | "food" | "legend" | "monument";

export type Secret = {
  id: string;
  // Which row on Home it belongs to: "Local secrets" or "Heritage highlights".
  group: "secret" | "highlight";
  kind: SecretKind;
  // Shown on the Heritage highlights card.
  rating?: string;
  fact?: string;
  open?: string;
  walk?: boolean;
  focus?: string;
  // The main action when walking there isn't it (a drive away, or ticketed).
  go?: { label: string; href: string };
  tag: string;
  title: string;
  line: string;
  distance: string;
  mins: number;
  img?: string;
  alt: string;
  // Read aloud by "Listen" and shown as the opening paragraphs.
  story: string[];
  // The main list: what to look for, what to eat, or what the legends say.
  listTitle: string;
  list: { name: string; note: string; badge?: string }[];
  // For folklore: what is actually on record.
  record?: { title: string; points: string[] };
  know: { label: string; value: string }[];
  tip: string;
  question: string;
};

export const KIND: Record<SecretKind, { tagBg: string; tagFg: string; tint: string; ink: string }> = {
  gem: { tagBg: "#F5E6CC", tagFg: "#6E4E1E", tint: "#EFE1C9", ink: "#8A6424" },
  food: { tagBg: "#F9DDD3", tagFg: "#8A3A22", tint: "#F6E3DA", ink: "#C0612F" },
  legend: { tagBg: "#EDE4DA", tagFg: "#4A3628", tint: "#EDE4DA", ink: "#5A4434" },
  monument: { tagBg: "#F6E3DA", tagFg: "#7E3D29", tint: "#F3E4D6", ink: "#9A4E36" },
};

export const SECRETS: Secret[] = [
  {
    id: "dhal",
    group: "secret",
    kind: "gem",
    tag: "Hidden gem",
    title: "Dhal ni Pol woodcarvings",
    line: "Carved havelis and a pol bird-feeder tower",
    distance: "650 m · 8 min",
    mins: 8,
    img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg",
    alt: "Carved wooden facades in Dhal ni Pol",
    story: [
      "A pol is a gated lane of shared-wall houses built around a common court. The old city has hundreds of them, each once home to one community or trade.",
      "Dhal ni Pol, in Khadia, keeps some of the finest timber house-fronts in Ahmedabad. Almost nothing here is plain: brackets, balconies, door frames and window shutters are all carved, and most of it is still lived in.",
    ],
    listTitle: "Look for these",
    list: [
      { name: "Carved brackets", note: "The struts under each balcony are shaped as elephants, parrots, dancers and flowering vines." },
      { name: "The chabutro", note: "A tall carved tower on a post, built so the lane could feed birds after trees were lost to houses." },
      { name: "The pol gate", note: "One narrow entrance with a watch-room above it. At night the gate was shut and the lane became a fortress." },
      { name: "Hidden doorways", note: "Small back passages link one pol to the next, so neighbours could slip through unseen." },
      { name: "Courtyard tanks", note: "Many houses sit on an underground tank that stores the monsoon's rain for the year." },
    ],
    know: [
      { label: "Best time", value: "7–9 AM" },
      { label: "Time needed", value: "30 minutes" },
      { label: "Entry", value: "Free" },
      { label: "Terrain", value: "Narrow lanes, a few steps" },
    ],
    tip: "People live here. Keep your voice down, and ask before photographing anyone or stepping into a courtyard.",
    question: "What else should I know about the pols of Ahmedabad?",
  },
  {
    id: "manek",
    group: "secret",
    kind: "food",
    tag: "Must-taste · 8 PM",
    title: "Manek Chowk night market",
    line: "Must-try: Gwalior dosa, pineapple sandwich",
    distance: "1.1 km",
    mins: 14,
    img: "/images/manek-chowk.jpg",
    alt: "Food stalls at Manek Chowk at night",
    story: [
      "Manek Chowk lives three lives a day. At dawn it is a vegetable market. By mid-morning the shutters go up on the jewellers and bullion traders. After about 8 PM the square fills with food carts and plastic stools, and stays busy past midnight.",
      "It is named for Maneknath, a saint the city's founding legend remembers. Almost everything served is vegetarian, cooked in front of you and loaded with butter.",
    ],
    listTitle: "What to eat",
    list: [
      { name: "Gwalior dosa", note: "A crisp dosa finished with a slab of butter. The stall the dish is named after still draws the longest queue.", badge: "Start here" },
      { name: "Pineapple sandwich", note: "Grilled bread, pineapple, cheese and jam. Stranger than it sounds, and the square's signature." },
      { name: "Chocolate sandwich", note: "The same idea with melted chocolate and grated cheese. Share one." },
      { name: "Pav bhaji", note: "Spiced mashed vegetables with butter-toasted buns, made on a wide iron griddle." },
      { name: "Kulfi", note: "Dense Indian ice cream cut in slabs. The right way to finish.", badge: "Finish here" },
    ],
    know: [
      { label: "Best time", value: "8:30–10 PM" },
      { label: "Time needed", value: "45 minutes" },
      { label: "Cost", value: "About ₹80–250 a plate" },
      { label: "Diet", value: "Mostly vegetarian" },
    ],
    tip: "Order one dish at a time and share, or you will be full after the first stall. Stalls take cash and UPI.",
    question: "What should I eat at Manek Chowk, and in what order?",
  },
  {
    id: "bhadra",
    group: "secret",
    kind: "legend",
    tag: "Folklore",
    title: "Bhadra Fort's secret tunnels",
    line: "Myths of passages running under the old city",
    distance: "1.4 km · 18 min",
    mins: 18,
    img: "/images/bhadra-fort.jpg",
    alt: "The gate and tower of Bhadra Fort",
    story: [
      "Ask in the old city and someone will tell you that tunnels run out from Bhadra Fort: one to the river, one to the Jama Masjid, and one, in the boldest version, wide enough for a horse and rider and long enough to leave the city altogether.",
      "It is a good story for a fort that was the seat of the sultans, and nobody has ever shown it to be true.",
    ],
    listTitle: "The tales people tell",
    list: [
      { name: "The escape tunnels", note: "Passages said to lead from the royal quarters to the Sabarmati, so the court could flee a siege by boat.", badge: "Legend" },
      { name: "Lakshmi and the watchman", note: "The goddess of wealth came to the gate at night to leave the city. The watchman asked her to wait while he fetched the king's leave, then never returned, so she is waiting still.", badge: "Legend" },
      { name: "The lamp at Teen Darwaza", note: "A lamp in a niche of the gateway is said to have been kept burning for some six hundred years in her honour.", badge: "Legend" },
    ],
    record: {
      title: "What the record says",
      points: [
        "The fort was begun in 1411 by Sultan Ahmad Shah I, the year he founded Ahmedabad.",
        "It takes its name from the Bhadra Kali temple inside its walls.",
        "The clock tower was added in 1849, under British rule.",
        "No tunnel has been found or published by archaeologists.",
      ],
    },
    know: [
      { label: "Best time", value: "Early evening" },
      { label: "Time needed", value: "25 minutes" },
      { label: "Entry", value: "Free" },
      { label: "Nearby", value: "Teen Darwaza, 300 m" },
    ],
    tip: "Walk on to Teen Darwaza afterwards and look for the lamp niche in the gateway.",
    question: "Tell me the legends of Bhadra Fort and how much of them is true",
  },
  {
    id: "sarkhej",
    group: "highlight",
    kind: "monument",
    tag: "Tomb complex",
    title: "Sarkhej Roza",
    line: "Called the 'Acropolis of Ahmedabad'",
    distance: "8 km · 20 min drive",
    mins: 20,
    rating: "4.8",
    fact: "1451 · Tomb complex",
    open: "Open till 6 PM",
    focus: "30% 40%",
    img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg",
    alt: "Sarkhej Roza mosque and tomb complex",
    go: { label: "Start the AR tour", href: "/ar" },
    story: [
      "Sarkhej Roza grew around the home of Shaikh Ahmed Khattu, a Sufi saint and adviser to Sultan Ahmad Shah. After the saint died in 1445 the sultan's successor began a tomb and mosque for him here, finished in 1451.",
      "Later sultans, above all Mahmud Begada, added a great tank, palaces and their own tombs, and a saint's retreat became a royal one. The architect Le Corbusier compared it to the Acropolis in Athens.",
    ],
    listTitle: "Look for these",
    list: [
      { name: "The saint's tomb", note: "One of the largest mausoleums in Gujarat. Inside, pierced metal screens ring the grave." },
      { name: "The mosque", note: "A wide court of slender columns, with no arches on its face and no minarets." },
      { name: "The stepped tank", note: "A lake the size of several cricket fields, brim-full after the monsoon and dry by summer." },
      { name: "The royal tombs", note: "Mahmud Begada and his queen lie in pavilions opening onto the water." },
      { name: "Stone screens", note: "Jalis stand in for walls throughout, so the breeze from the tank moves through every building." },
    ],
    know: [
      { label: "Best time", value: "An hour before sunset" },
      { label: "Time needed", value: "1 hour" },
      { label: "Entry", value: "Free" },
      { label: "Getting there", value: "20 min by car" },
    ],
    tip: "This is an active shrine. Take your shoes off at the tomb and cover your head and shoulders. Thursdays are busiest.",
    question: "Tell me about Sarkhej Roza and why it was built",
  },
  {
    id: "jama",
    group: "highlight",
    kind: "monument",
    tag: "Mosque",
    title: "Jama Masjid",
    line: "260 pillars under 15 domes",
    distance: "11 min · 900 m",
    mins: 11,
    walk: true,
    rating: "4.8",
    fact: "1424 · Ahmad Shah I",
    open: "Open now",
    img: "/images/jama-masjid.jpg",
    alt: "The courtyard of Jama Masjid, Ahmedabad",
    story: [
      "Sultan Ahmad Shah I finished his Friday mosque in 1424, thirteen years after founding the city. For a time it was among the largest mosques in the subcontinent.",
      "Step in from the noise of the bazaar and the street disappears: a marble-paved court, a long pool, and a prayer hall where 260 columns hold up 15 domes. The carving borrows freely from Hindu and Jain temples, with bells, lotus flowers and chains cut into the stone.",
    ],
    listTitle: "Look for these",
    list: [
      { name: "The forest of pillars", note: "Stand in the centre of the hall and look along the rows: every line ends in light." },
      { name: "The central dome", note: "It rises in tiers like an opening lotus, a form taken from temple ceilings." },
      { name: "The missing minarets", note: "Two tall towers flanked the main arch until the earthquake of 1819. Only their carved bases remain." },
      { name: "The screened gallery", note: "A raised corner behind stone jalis, where the women of the court prayed unseen." },
      { name: "The sultan's tomb", note: "Ahmad Shah lies just outside the east gate; his queens are across the lane at Rani no Hajiro." },
    ],
    know: [
      { label: "Best time", value: "Early morning" },
      { label: "Time needed", value: "25 minutes" },
      { label: "Entry", value: "Free" },
      { label: "Dress", value: "Shoulders and knees covered" },
    ],
    tip: "Avoid the Friday midday prayer, and leave your shoes with the keeper at the gate.",
    question: "Tell me about the Jama Masjid of Ahmedabad",
  },
  {
    id: "adalaj",
    group: "highlight",
    kind: "monument",
    tag: "Stepwell",
    title: "Adalaj Stepwell",
    line: "Five storeys carved down into the earth",
    distance: "18 km · 35 min drive",
    mins: 35,
    rating: "4.7",
    fact: "1499 · Stepwell",
    open: "Open till 6 PM",
    img: "/images/adalaj-stepwell.jpg",
    alt: "Looking up the octagonal shaft of Adalaj Stepwell",
    go: { label: "Book entry · ₹25", href: "/tickets?book=adalaj" },
    story: [
      "A stepwell is a building you walk down into. Adalaj ni Vav drops five storeys to the water, and each level is a pillared hall that stays cool through the hottest afternoon.",
      "It was completed in 1499. The story told here is of Queen Rudabai, whose husband began the well and died before it was done. That part is legend; the inscription on the wall gives only the date and her name.",
    ],
    listTitle: "Look for these",
    list: [
      { name: "Three stairways", note: "Unusually, three flights of steps enter from different sides and meet on one landing." },
      { name: "The octagonal shaft", note: "Look straight up from the bottom level: the sky is framed by five carved rings." },
      { name: "Two traditions in one wall", note: "Islamic flower patterns sit beside Hindu and Jain figures, pots and elephants." },
      { name: "The change in the air", note: "It is several degrees cooler at the bottom than at the top." },
    ],
    know: [
      { label: "Best time", value: "Around noon, for the light" },
      { label: "Time needed", value: "45 minutes" },
      { label: "Entry", value: "₹25 (sample price)" },
      { label: "Getting there", value: "35 min by car" },
    ],
    tip: "Around midday the sun reaches straight down the shaft. Come early or late on weekends to avoid the crowd.",
    question: "Tell me about Adalaj Stepwell and the legend of Queen Rudabai",
  },
];

export const secret = (id: string) => SECRETS.find((s) => s.id === id);
export const HIGHLIGHTS = SECRETS.filter((s) => s.group === "highlight");
// How long the description takes to hear, for the card's Listen button.
export const listenMins = (s: Secret) => Math.max(1, Math.round(s.story.join(" ").split(/\s+/).length / 150));
