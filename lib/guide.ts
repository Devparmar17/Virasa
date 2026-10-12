// Virasa's built-in heritage library. The AI Guide answers from here when no
// language model is configured (see app/api/guide/route.ts).

export type GuideMessage = { role: "user" | "guide"; text: string };

// `city` entries answer "what should I see in…" and outrank general topics.
type Entry = { keys: string[]; en: string; hi?: string; kid?: string; city?: boolean };

const LIBRARY: Entry[] = [
  {
    keys: ["sidi", "saiyyed", "sayyid", "tree of life", "who carved", "carved it", "iim"],
    en: "Sidi Saiyyed Mosque was finished in 1573, the last year of the Gujarat Sultanate. It was commissioned by Sidi Saiyyed, an Abyssinian noble in the sultan's service. Its ten stone jalis are the draw — above all the Tree of Life, whose curling branches later inspired the IIM Ahmedabad logo. The carvers' own names were never recorded.",
    hi: "सीदी सैय्यद मस्जिद 1573 में बनी — गुजरात सल्तनत के आख़िरी साल में। इसे सुल्तान की सेवा में रहे हब्शी अमीर सीदी सैय्यद ने बनवाया था। इसकी दस पत्थर की जालियाँ मशहूर हैं, ख़ासकर 'जीवन वृक्ष', जिससे आगे चलकर IIM अहमदाबाद का लोगो प्रेरित हुआ। कारीगरों के नाम कहीं दर्ज नहीं हैं।",
    kid: "Imagine drawing a giant tree with twisty branches — and then carving it out of stone so the sun can shine through! That's the Tree of Life window at Sidi Saiyyed Mosque. It's about 450 years old, and nobody wrote down the names of the clever artists who made it.",
  },
  {
    keys: ["jali", "lattice", "how was it made", "screen", "made", "technique"],
    en: "A jali is a stone screen pierced with a pattern. Carvers drew the design on a single sandstone slab, drilled out the gaps, then filed every edge by hand — one slip and the slab was ruined. Jalis let breeze and soft light in while keeping glare and prying eyes out. You'll find more nearby at Rani Sipri's Mosque and Sarkhej Roza.",
    hi: "जाली पत्थर की ऐसी पट्टी है जिसमें नक़्क़ाशी करके आर-पार डिज़ाइन काटा जाता है। कारीगर एक ही बलुआ पत्थर पर नक़्शा बनाते, छेद करते और फिर हर किनारा हाथ से घिसते थे। जाली से हवा और हल्की रोशनी आती है, पर तेज़ धूप और बाहर की नज़र नहीं। पास में रानी सिपरी की मस्जिद और सरखेज रोज़ा में भी सुंदर जालियाँ हैं।",
    kid: "A jali is like a stone curtain with holes cut in pretty shapes. It lets the wind and a little sunshine in, so the room stays cool — like nature's air conditioner!",
  },
  {
    keys: ["bhadra", "fort", "tunnel", "teen darwaza", "darwaza"],
    en: "Bhadra Fort was built in 1411 by Sultan Ahmad Shah I, who founded Ahmedabad. Teen Darwaza, its triple-arched gateway, followed in 1415. Locals tell of a watchman who asked the goddess Lakshmi to wait while he fetched the king's permission for her to leave — and never came back, so prosperity stayed in the city. Stories of secret tunnels are part of the fort's folklore rather than recorded history.",
    hi: "भद्र क़िला 1411 में अहमदाबाद के संस्थापक सुल्तान अहमद शाह प्रथम ने बनवाया। इसका तीन मेहराबों वाला द्वार, तीन दरवाज़ा, 1415 में बना। कहते हैं एक पहरेदार ने देवी लक्ष्मी से राजा की इजाज़त लाने तक रुकने को कहा और लौटा ही नहीं — इसलिए समृद्धि शहर में ही रह गई।",
    kid: "Bhadra Fort is a castle more than 600 years old! A legend says a brave guard tricked the goddess of good luck into staying in the city forever.",
  },
  {
    keys: ["manek", "chowk", "food", "eat", "hungry", "chai", "snack", "street food"],
    en: "Manek Chowk changes three times a day: a vegetable market at dawn, the jewellers' market by day, and a street-food square after about 8 pm. Try the butter pav bhaji, a Gwalior-style dosa, the famous chocolate sandwich and a kulfi to finish. It's a 10-minute walk from Teen Darwaza and stays busy past midnight.",
    hi: "माणेक चौक दिन में तीन बार रूप बदलता है: सुबह सब्ज़ी मंडी, दिन में सराफ़ा बाज़ार, और रात 8 बजे के बाद खाने-पीने का चौक। पाव भाजी, ग्वालियर डोसा, चॉकलेट सैंडविच और आख़िर में कुल्फ़ी ज़रूर चखें। तीन दरवाज़ा से यह 10 मिनट की पैदल दूरी पर है।",
    kid: "Manek Chowk is a market that turns into a giant yummy food party at night — with dosas, kulfi and even chocolate sandwiches!",
  },
  {
    keys: ["stepwell", "vav", "adalaj", "rani ki", "patan", "stepped", "tank"],
    en: "Stepwells (vavs) are wells you walk down into — cool, shaded places to collect water and rest. Adalaj ni Vav (1499), 18 km north of the city, drops five carved storeys. Rani ki Vav in Patan, built in the 11th century by Queen Udayamati, is a UNESCO World Heritage Site and appears on the ₹100 note. Patan is about 2.5 hours away, so it makes a good day trip.",
    hi: "वाव यानी सीढ़ीदार कुआँ — जहाँ लोग पानी भरने और ठंडी छाँव में बैठने उतरते थे। अडालज की वाव (1499) शहर से 18 किमी उत्तर में पाँच मंज़िल गहरी है। पाटन की रानी की वाव 11वीं सदी में रानी उदयमती ने बनवाई; यह यूनेस्को विश्व धरोहर है और ₹100 के नोट पर छपी है।",
    kid: "A stepwell is an upside-down building: instead of climbing up, you walk DOWN lots of stairs to reach the water. It stays nice and cool down there, even on a super hot day.",
  },
  {
    keys: ["sarkhej", "roza", "sunset"],
    en: "Sarkhej Roza is a 15th-century complex of tombs, a mosque and palace pavilions around a great tank, built around the tomb of the Sufi saint Shaikh Ahmed Khattu. Le Corbusier compared it to the Acropolis. Go an hour before sunset, when the jalis throw long patterned shadows. It's about 8 km — 20 minutes by car — from the Old City.",
  },
  {
    keys: ["pol", "dhal", "haveli", "woodcarv", "old city", "khadia"],
    en: "Pols are the gated neighbourhoods of old Ahmedabad: narrow lanes, shared courtyards and carved wooden havelis, each with a chabutro (bird feeder). Dhal ni Pol in Khadia has some of the finest woodcarving. These lanes are a big reason Ahmedabad became India's first UNESCO World Heritage City in 2017. Mornings are best — it's cooler and residents are out.",
    kid: "A pol is a cosy little neighbourhood with a big gate, twisty lanes and wooden houses covered in carvings. Each one even has a tiny tower just for feeding birds!",
  },
  {
    keys: ["jaipur"],
    city: true,
    en: "Jaipur, the Pink City, was laid out in 1727 by Sawai Jai Singh II. Start early at Amber Fort, then come down to the City Palace and Jantar Mantar, his UNESCO-listed observatory. See Hawa Mahal from the street in late afternoon light and finish in Johari Bazaar.",
  },
  {
    keys: ["varanasi", "banaras", "benares", "kashi"],
    city: true,
    en: "Varanasi is one of the oldest living cities in the world. Take a boat at dawn along the ghats, walk the lanes to Kashi Vishwanath Temple, and go out to Sarnath, 10 km away, where the Buddha first taught. Be back at Dashashwamedh Ghat by dusk for the Ganga aarti.",
  },
  {
    keys: ["hampi", "vijayanagara"],
    city: true,
    en: "Hampi was the capital of the Vijayanagara Empire until it was sacked in 1565, and is now a UNESCO World Heritage Site. See Virupaksha Temple, the stone chariot at Vittala Temple, the Lotus Mahal and the Elephant Stables. Climb Matanga Hill for sunrise over the boulders.",
  },
  {
    keys: ["kolkata", "calcutta"],
    city: true,
    en: "Kolkata was the capital of British India until 1911. See the Victoria Memorial, cross Howrah Bridge to the flower market at Mallick Ghat, browse the book stalls of College Street and stop at the Indian Coffee House. In Kumartuli you can watch potters shaping clay idols.",
  },
  {
    keys: ["delhi"],
    city: true,
    en: "Delhi holds a thousand years of capitals. Three to start with: Qutub Minar, begun in 1193; Humayun's Tomb of 1570, a forerunner of the Taj Mahal; and the Red Fort of 1648. Then walk Chandni Chowk in Old Delhi for the Jama Masjid and the street food.",
  },
  {
    keys: ["udaipur"],
    city: true,
    en: "Udaipur was founded in 1559 by Maharana Udai Singh II. Spend the morning in the City Palace above Lake Pichola, then visit Jagdish Temple and Bagore ki Haveli. Take a boat on the lake before sunset.",
  },
  {
    keys: ["mysuru", "mysore"],
    city: true,
    en: "Mysuru is the old capital of the Wadiyar kings. Mysore Palace, finished in 1912, is the centrepiece and is lit up on Sunday evenings. Add Chamundi Hill for the view and Devaraja Market for flowers, sandalwood and silk.",
  },
  {
    keys: ["kochi", "cochin"],
    city: true,
    en: "Kochi has been a spice port for centuries. In Fort Kochi see the Chinese fishing nets and St Francis Church, where Vasco da Gama was first buried in 1524. In Mattancherry visit the Dutch Palace and the Paradesi Synagogue of 1568.",
  },
  {
    keys: ["hawa mahal", "palace of winds"],
    en: "Hawa Mahal, the 'Palace of Winds', was built in Jaipur in 1799 for Maharaja Sawai Pratap Singh. Its 953 small windows let royal women watch street processions unseen while the breeze cooled the rooms. Visit at sunrise, when the pink sandstone glows.",
  },
  {
    keys: ["plan", "hours", "itinerary", "route", "walk", "day trip", "half day"],
    en: "With two hours, do the Old City short loop: Sidi Saiyyed Mosque (20 min), Bhadra Fort (25 min), Teen Darwaza (10 min) and chai at Manek Chowk (20 min) — 1.4 km in all. With a full day, add Sarkhej Roza at sunset or Adalaj stepwell in the morning. Open the walk to change the stops or make it step-free.",
    hi: "दो घंटे हों तो पुराने शहर का छोटा चक्कर लगाइए: सीदी सैय्यद मस्जिद (20 मिनट), भद्र क़िला (25 मिनट), तीन दरवाज़ा (10 मिनट) और माणेक चौक पर चाय (20 मिनट) — कुल 1.4 किमी। पूरा दिन हो तो सुबह अडालज की वाव या शाम को सरखेज रोज़ा जोड़ लें।",
  },
  {
    keys: ["wear", "dress", "scarf", "etiquette", "shoes", "rules", "ticket", "fee", "open", "timing", "hours open", "when to"],
    en: "Most Old City monuments are free and open from sunrise to sunset. At mosques, take off your shoes, cover shoulders and knees, and carry a scarf; avoid the Friday midday prayer. Early morning (7–9 am) and the hour before sunset have the best light and the fewest people.",
    hi: "पुराने शहर के ज़्यादातर स्मारक निःशुल्क हैं और सूर्योदय से सूर्यास्त तक खुले रहते हैं। मस्जिद में जूते उतारें, कंधे-घुटने ढकें और साथ में स्कार्फ़ रखें; शुक्रवार दोपहर की नमाज़ के समय जाने से बचें।",
  },
  {
    keys: ["similar", "nearby", "near me", "around", "close"],
    en: "Close to you: Bhadra Fort (450 m), Teen Darwaza (600 m), Rani Sipri's Mosque for more fine jalis (1.6 km) and Manek Chowk for food (900 m). Tap Navigation to see them on the map.",
  },
];

const FALLBACK = {
  en: "I don't have a verified story for that yet. I know the Old City best — try asking about Sidi Saiyyed Mosque, Bhadra Fort, Manek Chowk, the pols, stepwells or planning a walk.",
  hi: "इसके बारे में मेरे पास अभी प्रमाणित जानकारी नहीं है। मैं पुराने शहर को सबसे अच्छी तरह जानता हूँ — सीदी सैय्यद मस्जिद, भद्र क़िला, माणेक चौक, पोल, वाव या पैदल सैर की योजना के बारे में पूछिए।",
};

function find(text: string) {
  const q = text.toLowerCase();
  let best: Entry | null = null;
  let score = 0;
  for (const entry of LIBRARY) {
    const s = entry.keys.reduce((n, k) => n + (q.includes(k) ? k.length : 0), 0) * (entry.city ? 3 : 1);
    if (s > score) {
      best = entry;
      score = s;
    }
  }
  return best;
}

const isHindiRequest = (t: string) => /हिन्दी|हिंदी|hindi/i.test(t);
const isKidRequest = (t: string) => /kid|child|simple|simpler|easy/i.test(t);

// Answers the latest question from the library. "Explain in Hindi" and
// "kid-friendly" re-tell the previous answer's topic rather than starting over.
export function libraryAnswer(messages: GuideMessage[], lang: string): string {
  const users = messages.filter((m) => m.role === "user");
  const last = users[users.length - 1]?.text || "";
  const hindi = lang === "hi" || isHindiRequest(last);
  const kid = isKidRequest(last);

  let entry = find(last);
  if (!entry && (isHindiRequest(last) || kid)) {
    for (let i = users.length - 2; i >= 0 && !entry; i--) entry = find(users[i].text);
  }
  if (!entry) return hindi ? FALLBACK.hi : FALLBACK.en;
  if (kid && entry.kid) return entry.kid;
  if (hindi) return entry.hi || `${entry.en}\n\n(यह कहानी अभी हिन्दी में उपलब्ध नहीं है।)`;
  return entry.en;
}
