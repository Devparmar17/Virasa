// Narration for the Sidi Saiyyed Mosque story, in the three transcript languages.
// `depth` is the shortest version a line appears in: quick ⊂ classic ⊂ deep.

export type Depth = "quick" | "classic" | "deep";
export type Lang = "en" | "hi" | "gu";

type Line = { ch: number; depth: Depth; en: string; hi: string; gu: string };

export const CHAPTERS = ["Who was Sidi Saiyyed?", "Reading the Tree of Life", "The window left blank", "From stone screen to a logo"];

// Seconds each chapter runs at each depth.
export const CHAPTER_SECONDS: Record<Depth, number[]> = {
  quick: [15, 20, 15, 10],
  classic: [40, 50, 30, 20],
  deep: [65, 85, 50, 40],
};

export const DEPTH_LABEL: Record<Depth, string> = { quick: "Quick", classic: "Classic", deep: "Deep dive" };
export const SPEECH_LOCALE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", gu: "gu-IN" };
export const LANG_NAME: Record<Lang, string> = { en: "English", hi: "Hindi", gu: "Gujarati" };

const LINES: Line[] = [
  { ch: 0, depth: "quick", en: "Welcome to Sidi Saiyyed Mosque, finished in 1573.", hi: "सीदी सैय्यद मस्जिद में आपका स्वागत है, जो 1573 में बनकर तैयार हुई।", gu: "સીદી સૈયદની મસ્જિદમાં તમારું સ્વાગત છે, જે 1573માં પૂરી થઈ." },
  { ch: 0, depth: "classic", en: "Sidi Saiyyed came to Gujarat from Abyssinia and rose to become a noble at the sultan's court.", hi: "सीदी सैय्यद हब्श से गुजरात आए और सुल्तान के दरबार में अमीर बने।", gu: "સીદી સૈયદ હબસાણથી ગુજરાત આવ્યા અને સુલતાનના દરબારમાં અમીર બન્યા." },
  { ch: 0, depth: "deep", en: "Many Africans served the sultans of Gujarat as soldiers, sailors and administrators. Their descendants, the Siddis, still live in the state.", hi: "कई अफ़्रीकी गुजरात के सुल्तानों के यहाँ सैनिक, नाविक और प्रशासक रहे। उनके वंशज, सिद्दी, आज भी गुजरात में रहते हैं।", gu: "ઘણા આફ્રિકન ગુજરાતના સુલતાનોને ત્યાં સૈનિક, નાવિક અને વહીવટકર્તા હતા. તેમના વંશજો, સીદીઓ, આજે પણ ગુજરાતમાં રહે છે." },
  { ch: 0, depth: "classic", en: "He built this small mosque in the last year of the Gujarat Sultanate.", hi: "उन्होंने यह छोटी मस्जिद गुजरात सल्तनत के आख़िरी साल में बनवाई।", gu: "તેમણે આ નાની મસ્જિદ ગુજરાત સલ્તનતના છેલ્લા વર્ષમાં બંધાવી." },
  { ch: 0, depth: "classic", en: "He is remembered less for power than for the windows you are about to see.", hi: "उन्हें सत्ता के लिए नहीं, बल्कि उन जालियों के लिए याद किया जाता है जो आप अभी देखेंगे।", gu: "તેમને સત્તા માટે નહીં, પણ તમે હમણાં જોશો એ જાળીઓ માટે યાદ કરવામાં આવે છે." },

  { ch: 1, depth: "classic", en: "Step closer to the rear wall.", hi: "पिछली दीवार के पास आइए।", gu: "પાછળની દીવાલની નજીક આવો." },
  { ch: 1, depth: "quick", en: "See how the branches curl like palm fronds, rising from one trunk.", hi: "देखिए, शाखाएँ खजूर के पत्तों की तरह मुड़ती हैं और एक ही तने से उठती हैं।", gu: "જુઓ, ડાળીઓ ખજૂરીનાં પાન જેમ વળે છે અને એક જ થડમાંથી ઊગે છે." },
  { ch: 1, depth: "classic", en: "Now follow the vines out to the edge of the frame…", hi: "अब बेलों के साथ-साथ चौखट के किनारे तक नज़र ले जाइए…", gu: "હવે વેલાઓની સાથે સાથે ચોકઠાની ધાર સુધી નજર લઈ જાઓ…" },
  { ch: 1, depth: "classic", en: "Every curve was cut from slabs of sandstone, then filed smooth by hand.", hi: "हर घुमाव बलुआ पत्थर की शिलाओं से काटा गया और फिर हाथ से घिसकर चिकना किया गया।", gu: "દરેક વળાંક રેતિયા પથ્થરની શિલાઓમાંથી કોતરાયો અને પછી હાથથી ઘસીને લીસો કરાયો." },
  { ch: 1, depth: "deep", en: "A jali does two jobs. It breaks harsh sun into soft patterned light, and it lets the breeze through while keeping the room private.", hi: "जाली दो काम करती है। वह तेज़ धूप को नरम, नक़्शीदार रोशनी में बदलती है, और हवा आने देती है पर कमरे की निजता बनाए रखती है।", gu: "જાળી બે કામ કરે છે. તે આકરા તડકાને નરમ, ભાતીગળ પ્રકાશમાં ફેરવે છે, અને ઓરડાની ગોપનીયતા જાળવીને પવન આવવા દે છે." },
  { ch: 1, depth: "deep", en: "Ten screens line this mosque. Most are geometric; only the two on the rear wall grow into trees.", hi: "इस मस्जिद में दस जालियाँ हैं। ज़्यादातर ज्यामितीय हैं; सिर्फ़ पिछली दीवार की दो जालियों में पेड़ उकेरे गए हैं।", gu: "આ મસ્જિદમાં દસ જાળીઓ છે. મોટાભાગની ભૌમિતિક છે; માત્ર પાછળની દીવાલની બે જાળીઓમાં વૃક્ષો કોતરાયાં છે." },
  { ch: 1, depth: "classic", en: "Come back near sunset and the whole screen glows gold.", hi: "सूर्यास्त के समय लौटिए — पूरी जाली सुनहरी चमक उठती है।", gu: "સૂર્યાસ્ત સમયે પાછા આવજો — આખી જાળી સોનેરી ઝળહળે છે." },

  { ch: 2, depth: "quick", en: "Now look at the central arch. It is filled with plain stone.", hi: "अब बीच की मेहराब देखिए। यह सादे पत्थर से भरी है।", gu: "હવે વચ્ચેની કમાન જુઓ. તે સાદા પથ્થરથી ભરેલી છે." },
  { ch: 2, depth: "classic", en: "The story goes that work stopped when the Mughals took Gujarat, before this screen could be carved.", hi: "कहा जाता है कि मुग़लों के गुजरात जीतते ही काम रुक गया, और यह जाली उकेरी ही नहीं जा सकी।", gu: "કહેવાય છે કે મુઘલોએ ગુજરાત જીત્યું ત્યારે કામ અટકી ગયું, અને આ જાળી કોતરાઈ જ ન શકી." },
  { ch: 2, depth: "deep", en: "No record tells us what was planned for it. Guides like to say the finest screen of all was meant to go here.", hi: "यहाँ क्या बनना था, इसका कोई लिखित प्रमाण नहीं है। गाइड कहते हैं कि सबसे सुंदर जाली यहीं लगनी थी।", gu: "અહીં શું બનવાનું હતું તેનો કોઈ લેખિત પુરાવો નથી. ગાઇડ કહે છે કે સૌથી સુંદર જાળી અહીં જ મુકાવાની હતી." },
  { ch: 2, depth: "classic", en: "It has stayed blank for more than four centuries.", hi: "यह चार सदियों से भी ज़्यादा समय से ख़ाली है।", gu: "તે ચાર સદીથી પણ વધુ સમયથી ખાલી છે." },

  { ch: 3, depth: "classic", en: "In 1961 a new management school in the city chose this tree as its emblem.", hi: "1961 में शहर के एक नए प्रबंधन संस्थान ने इसी वृक्ष को अपना प्रतीक चुना।", gu: "1961માં શહેરની એક નવી મેનેજમેન્ટ સંસ્થાએ આ વૃક્ષને પોતાનું પ્રતીક બનાવ્યું." },
  { ch: 3, depth: "deep", en: "That school is IIM Ahmedabad, and its logo still carries the curling branches you are looking at.", hi: "वह संस्थान IIM अहमदाबाद है, और उसके लोगो में आज भी वही मुड़ती शाखाएँ हैं जिन्हें आप देख रहे हैं।", gu: "એ સંસ્થા IIM અમદાવાદ છે, અને તેના લોગોમાં આજે પણ એ જ વળતી ડાળીઓ છે જે તમે જોઈ રહ્યા છો." },
  { ch: 3, depth: "quick", en: "Today the Tree of Life is the symbol of Ahmedabad itself.", hi: "आज जीवन वृक्ष ख़ुद अहमदाबाद की पहचान है।", gu: "આજે જીવનવૃક્ષ ખુદ અમદાવાદની ઓળખ છે." },
];

const RANK: Record<Depth, number> = { quick: 0, classic: 1, deep: 2 };

export type Cue = { at: number; ch: number; text: Record<Lang, string> };

// Lays the lines for a depth out on a timeline: each chapter's seconds are
// shared between its lines in proportion to their length.
export function buildCues(depth: Depth): { cues: Cue[]; total: number; chapterStarts: number[] } {
  const cues: Cue[] = [];
  const chapterStarts: number[] = [];
  let at = 0;
  CHAPTER_SECONDS[depth].forEach((seconds, ch) => {
    chapterStarts.push(at);
    const lines = LINES.filter((l) => l.ch === ch && RANK[l.depth] <= RANK[depth]);
    const weight = (l: Line) => l.en.split(" ").length + 4;
    const sum = lines.reduce((n, l) => n + weight(l), 0);
    let t = at;
    for (const l of lines) {
      cues.push({ at: t, ch, text: { en: l.en, hi: l.hi, gu: l.gu } });
      t += (seconds * weight(l)) / sum;
    }
    at += seconds;
  });
  return { cues, total: at, chapterStarts };
}
