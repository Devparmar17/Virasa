"use client";

// The app's own words in each language the picker offers. Place names, stories
// and descriptions are content, not interface, and stay as written.
import { readStored, useStored } from "./store";

export type Lang = "en" | "hi" | "gu" | "ta" | "bn";
type Entry = Record<Lang, string>;

const D = {
  // ---------- tab bar ----------
  "tab.home": { en: "Home", hi: "होम", gu: "હોમ", ta: "முகப்பு", bn: "হোম" },
  "tab.saved": { en: "Saved", hi: "सहेजे", gu: "સાચવેલું", ta: "சேமித்தவை", bn: "সংরক্ষিত" },
  "tab.explore": { en: "Explore", hi: "खोजें", gu: "શોધો", ta: "ஆராய்", bn: "ঘুরে দেখুন" },
  "tab.guide": { en: "AI Guide", hi: "AI गाइड", gu: "AI ગાઈડ", ta: "AI வழிகாட்டி", bn: "AI গাইড" },
  "tab.profile": { en: "Profile", hi: "प्रोफ़ाइल", gu: "પ્રોફાઇલ", ta: "சுயவிவரம்", bn: "প্রোফাইল" },

  // ---------- language picker ----------
  "lang.title": { en: "Language", hi: "भाषा", gu: "ભાષા", ta: "மொழி", bn: "ভাষা" },
  "lang.body": {
    en: "The app, stories, the AI Guide and voice directions use this language.",
    hi: "ऐप, कहानियाँ, AI गाइड और आवाज़ वाले निर्देश इसी भाषा में होंगे।",
    gu: "એપ, વાર્તાઓ, AI ગાઈડ અને અવાજવાળી દિશાઓ આ ભાષામાં હશે.",
    ta: "செயலி, கதைகள், AI வழிகாட்டி, குரல் வழிகாட்டுதல் அனைத்தும் இந்த மொழியில் இருக்கும்.",
    bn: "অ্যাপ, গল্প, AI গাইড ও কণ্ঠ নির্দেশনা এই ভাষায় হবে।",
  },
  "lang.changed": { en: "Language: {name}", hi: "भाषा: {name}", gu: "ભાષા: {name}", ta: "மொழி: {name}", bn: "ভাষা: {name}" },

  // ---------- home ----------
  "home.youre_in": { en: "YOU'RE IN", hi: "आप यहाँ हैं", gu: "તમે અહીં છો", ta: "நீங்கள் இருப்பது", bn: "আপনি আছেন" },
  "home.city": { en: "Ahmedabad, Old City", hi: "अहमदाबाद, पुराना शहर", gu: "અમદાવાદ, જૂનું શહેર", ta: "அகமதாபாத், பழைய நகரம்", bn: "আহমেদাবাদ, পুরনো শহর" },
  "home.namaste": { en: "Namaste, {name}", hi: "नमस्ते, {name}", gu: "નમસ્તે, {name}", ta: "வணக்கம், {name}", bn: "নমস্কার, {name}" },
  "home.guest": { en: "Traveller", hi: "यात्री", gu: "પ્રવાસી", ta: "பயணி", bn: "পর্যটক" },
  "home.title": {
    en: "Where will your story begin?",
    hi: "आपकी कहानी कहाँ से शुरू होगी?",
    gu: "તમારી વાર્તા ક્યાંથી શરૂ થશે?",
    ta: "உங்கள் கதை எங்கே தொடங்கும்?",
    bn: "আপনার গল্প কোথা থেকে শুরু হবে?",
  },
  "home.search": { en: "Search places, stories, food", hi: "जगहें, कहानियाँ, खाना खोजें", gu: "સ્થળો, વાર્તાઓ, ખોરાક શોધો", ta: "இடங்கள், கதைகள், உணவு தேடுக", bn: "জায়গা, গল্প, খাবার খুঁজুন" },
  "home.planned": { en: "PLANNED FOR YOU", hi: "आपके लिए योजना", gu: "તમારા માટે આયોજન", ta: "உங்களுக்காகத் திட்டமிட்டது", bn: "আপনার জন্য পরিকল্পিত" },
  "home.walk_title": { en: "Old City in a morning", hi: "एक सुबह में पुराना शहर", gu: "એક સવારમાં જૂનું શહેર", ta: "ஒரு காலையில் பழைய நகரம்", bn: "এক সকালে পুরনো শহর" },
  "home.walk_meta": { en: "6 stops · 2.4 km · 2 h 40", hi: "6 पड़ाव · 2.4 किमी · 2 घं 40 मि", gu: "6 સ્ટોપ · 2.4 કિમી · 2 ક 40 મિ", ta: "6 நிறுத்தங்கள் · 2.4 கி.மீ · 2 ம 40 நி", bn: "6টি স্টপ · 2.4 কিমি · 2 ঘ 40 মি" },
  "home.start_walk": { en: "Start walk", hi: "सैर शुरू करें", gu: "ચાલ શરૂ કરો", ta: "நடையைத் தொடங்கு", bn: "হাঁটা শুরু করুন" },
  "home.ar": { en: "AR Tour", hi: "AR टूर", gu: "AR ટૂર", ta: "AR சுற்றுலா", bn: "AR ট্যুর" },
  "home.stories": { en: "Stories", hi: "कहानियाँ", gu: "વાર્તાઓ", ta: "கதைகள்", bn: "গল্প" },
  "home.reels": { en: "Reels", hi: "रील्स", gu: "રીલ્સ", ta: "ரீல்கள்", bn: "রিলস" },
  "home.tickets": { en: "Tickets", hi: "टिकट", gu: "ટિકિટ", ta: "டிக்கெட்", bn: "টিকিট" },
  "home.games": { en: "Games", hi: "खेल", gu: "રમતો", ta: "விளையாட்டு", bn: "খেলা" },
  "home.highlights": { en: "Heritage highlights", hi: "विरासत की झलकियाँ", gu: "વારસાની ઝલક", ta: "பாரம்பரியச் சிறப்புகள்", bn: "ঐতিহ্যের আকর্ষণ" },
  "home.map": { en: "Map", hi: "नक्शा", gu: "નકશો", ta: "வரைபடம்", bn: "মানচিত্র" },
  "home.secrets": { en: "Local secrets", hi: "स्थानीय राज़", gu: "સ્થાનિક રહસ્યો", ta: "உள்ளூர் ரகசியங்கள்", bn: "স্থানীয় রহস্য" },
  "home.tag_gem": { en: "Hidden gem", hi: "छिपा रत्न", gu: "છુપાયેલું રત્ન", ta: "மறைந்த ரத்தினம்", bn: "লুকোনো রত্ন" },
  "home.tag_taste": { en: "Must-taste", hi: "ज़रूर चखें", gu: "ચાખવું જ જોઈએ", ta: "சுவைக்க வேண்டியது", bn: "অবশ্যই চাখুন" },
  "home.tag_folk": { en: "Folklore", hi: "लोककथा", gu: "લોકકથા", ta: "நாட்டுப்புறக் கதை", bn: "লোককথা" },
  "home.from_8pm": { en: "From 8 PM", hi: "रात 8 बजे से", gu: "રાત્રે 8 વાગ્યાથી", ta: "இரவு 8 மணி முதல்", bn: "রাত 8টা থেকে" },
  "home.quiz_label": { en: "TODAY'S QUIZ · +30 PTS", hi: "आज की क्विज़ · +30 अंक", gu: "આજની ક્વિઝ · +30 પોઈન્ટ", ta: "இன்றைய வினாடி வினா · +30 புள்ளி", bn: "আজকের কুইজ · +30 পয়েন্ট" },
  "home.quiz_title": {
    en: "How well do you know Sidi Saiyyed?",
    hi: "आप सीदी सैयद को कितना जानते हैं?",
    gu: "તમે સીદી સૈયદને કેટલું જાણો છો?",
    ta: "சிதி சையத் பற்றி உங்களுக்கு எவ்வளவு தெரியும்?",
    bn: "সিদি সৈয়দকে আপনি কতটা চেনেন?",
  },
  "home.next_city": { en: "Plan your next city", hi: "अगले शहर की योजना बनाएँ", gu: "આગલા શહેરની યોજના બનાવો", ta: "அடுத்த நகரத்தைத் திட்டமிடுங்கள்", bn: "পরের শহরের পরিকল্পনা করুন" },
  "home.all_cities": { en: "All cities", hi: "सभी शहर", gu: "બધાં શહેરો", ta: "எல்லா நகரங்களும்", bn: "সব শহর" },
  "city.jaipur": { en: "Jaipur", hi: "जयपुर", gu: "જયપુર", ta: "ஜெய்ப்பூர்", bn: "জয়পুর" },
  "city.varanasi": { en: "Varanasi", hi: "वाराणसी", gu: "વારાણસી", ta: "வாரணாசி", bn: "বারাণসী" },
  "city.hampi": { en: "Hampi", hi: "हम्पी", gu: "હમ્પી", ta: "ஹம்பி", bn: "হাম্পি" },
  "city.kolkata": { en: "Kolkata", hi: "कोलकाता", gu: "કોલકાતા", ta: "கொல்கத்தா", bn: "কলকাতা" },
  "city.jaipur_tag": { en: "Forts & bazaars", hi: "किले और बाज़ार", gu: "કિલ્લા અને બજારો", ta: "கோட்டைகள், சந்தைகள்", bn: "দুর্গ ও বাজার" },
  "city.varanasi_tag": { en: "Ghats & ritual", hi: "घाट और अनुष्ठान", gu: "ઘાટ અને વિધિ", ta: "படித்துறைகள், சடங்குகள்", bn: "ঘাট ও আচার" },
  "city.hampi_tag": { en: "Vijayanagara ruins", hi: "विजयनगर के खंडहर", gu: "વિજયનગરના અવશેષો", ta: "விஜயநகர இடிபாடுகள்", bn: "বিজয়নগরের ধ্বংসাবশেষ" },
  "city.kolkata_tag": { en: "Colonial lanes", hi: "औपनिवेशिक गलियाँ", gu: "વસાહતી ગલીઓ", ta: "காலனித்துவத் தெருக்கள்", bn: "ঔপনিবেশিক গলি" },
  "unit.min_walk": { en: "{n} min walk", hi: "{n} मिनट पैदल", gu: "{n} મિનિટ ચાલીને", ta: "{n} நிமிட நடை", bn: "{n} মিনিট হাঁটা" },
  "unit.min": { en: "{n} min", hi: "{n} मिनट", gu: "{n} મિનિટ", ta: "{n} நிமி", bn: "{n} মিনিট" },
  "unit.km": { en: "{n} km", hi: "{n} किमी", gu: "{n} કિમી", ta: "{n} கி.மீ", bn: "{n} কিমি" },
  "unit.m": { en: "{n} m", hi: "{n} मी", gu: "{n} મી", ta: "{n} மீ", bn: "{n} মি" },
  "place.open_now": { en: "Open now", hi: "अभी खुला", gu: "હમણાં ખુલ્લું", ta: "இப்போது திறந்துள்ளது", bn: "এখন খোলা" },

  // ---------- walking navigation ----------
  "nav.turn_left_relief": { en: "Turn left onto Relief Road", hi: "रिलीफ़ रोड पर बाएँ मुड़ें", gu: "રિલીફ રોડ પર ડાબે વળો", ta: "ரிலீஃப் சாலையில் இடதுபுறம் திரும்பவும்", bn: "রিলিফ রোডে বাঁ দিকে ঘুরুন" },
  "nav.turn_right_teen": { en: "Turn right at Teen Darwaza", hi: "तीन दरवाज़ा पर दाएँ मुड़ें", gu: "ત્રણ દરવાજા પાસે જમણે વળો", ta: "தீன் தர்வாசாவில் வலதுபுறம் திரும்பவும்", bn: "তিন দরওয়াজায় ডান দিকে ঘুরুন" },
  "nav.ahead": { en: "{dest} is ahead", hi: "{dest} आगे है", gu: "{dest} આગળ છે", ta: "{dest} முன்னால் உள்ளது", bn: "{dest} সামনে" },
  "nav.then": { en: "Then", hi: "फिर", gu: "પછી", ta: "பிறகு", bn: "তারপর" },
  "nav.arrive_at": { en: "Arrive at {dest}", hi: "{dest} पहुँचें", gu: "{dest} પહોંચો", ta: "{dest} சென்றடையவும்", bn: "{dest}-এ পৌঁছান" },
  "nav.pocket": {
    en: "Phone in your pocket? We'll vibrate before each turn.",
    hi: "फ़ोन जेब में है? हर मोड़ से पहले हम वाइब्रेट करेंगे।",
    gu: "ફોન ખિસ્સામાં છે? દરેક વળાંક પહેલાં અમે વાઇબ્રેટ કરીશું.",
    ta: "தொலைபேசி பையில் உள்ளதா? ஒவ்வொரு திருப்பத்திற்கும் முன் அதிரும்.",
    bn: "ফোন পকেটে? প্রতিটি মোড়ের আগে আমরা ভাইব্রেট করব।",
  },
  "nav.on_way": { en: "ON YOUR WAY · {n} MIN AHEAD", hi: "रास्ते में · {n} मिनट आगे", gu: "રસ્તામાં · {n} મિનિટ આગળ", ta: "வழியில் · {n} நிமிடம் முன்னால்", bn: "পথে · {n} মিনিট সামনে" },
  "nav.passing": { en: "ON YOUR WAY · YOU'RE HERE", hi: "रास्ते में · आप यहीं हैं", gu: "રસ્તામાં · તમે અહીં છો", ta: "வழியில் · நீங்கள் இங்கே", bn: "পথে · আপনি এখানে" },
  "nav.passed": { en: "PASSED · TAP TO HEAR IT", hi: "पार किया · सुनने के लिए टैप करें", gu: "પસાર કર્યું · સાંભળવા ટેપ કરો", ta: "கடந்தீர்கள் · கேட்கத் தட்டவும்", bn: "পেরিয়ে এসেছেন · শুনতে ট্যাপ করুন" },
  "nav.teen_story": { en: "Teen Darwaza and the 600-year lamp", hi: "तीन दरवाज़ा और 600 साल पुराना दीया", gu: "ત્રણ દરવાજા અને 600 વર્ષ જૂનો દીવો", ta: "தீன் தர்வாசாவும் 600 ஆண்டு விளக்கும்", bn: "তিন দরওয়াজা ও 600 বছরের প্রদীপ" },
  "nav.eta_line": { en: "{km} · arrive {time}", hi: "{km} · {time} पर पहुँचेंगे", gu: "{km} · {time} વાગ્યે પહોંચશો", ta: "{km} · {time}க்கு வருகை", bn: "{km} · {time}-এ পৌঁছাবেন" },
  "nav.end": { en: "End", hi: "समाप्त", gu: "સમાપ્ત", ta: "முடி", bn: "শেষ" },
  "nav.walking_to": { en: "Walking to", hi: "जा रहे हैं", gu: "જઈ રહ્યા છો", ta: "செல்லும் இடம்", bn: "যাচ্ছেন" },
  "nav.ar": { en: "AR view", hi: "AR दृश्य", gu: "AR દૃશ્ય", ta: "AR காட்சி", bn: "AR ভিউ" },
  "nav.pause": { en: "Pause", hi: "रोकें", gu: "થોભો", ta: "இடைநிறுத்து", bn: "থামান" },
  "nav.resume": { en: "Resume", hi: "जारी रखें", gu: "ચાલુ રાખો", ta: "தொடர்", bn: "আবার চালান" },
  "nav.paused": { en: "Paused", hi: "रुका हुआ", gu: "થોભાવેલું", ta: "இடைநிறுத்தப்பட்டது", bn: "থামানো" },
  "nav.ended": { en: "Walk to {dest} ended", hi: "{dest} की सैर समाप्त", gu: "{dest} ની ચાલ પૂરી", ta: "{dest} நடை முடிந்தது", bn: "{dest}-এ হাঁটা শেষ" },
  "nav.voice_on": { en: "Voice guidance on", hi: "आवाज़ निर्देश चालू", gu: "અવાજ માર્ગદર્શન ચાલુ", ta: "குரல் வழிகாட்டல் இயக்கத்தில்", bn: "কণ্ঠ নির্দেশনা চালু" },
  "nav.voice_off": { en: "Voice guidance off — we'll still vibrate before turns", hi: "आवाज़ निर्देश बंद — मोड़ों से पहले वाइब्रेट होगा", gu: "અવાજ માર્ગદર્શન બંધ — વળાંક પહેલાં વાઇબ્રેટ થશે", ta: "குரல் வழிகாட்டல் அணைந்தது — திருப்பங்களுக்கு முன் அதிரும்", bn: "কণ্ঠ নির্দেশনা বন্ধ — মোড়ের আগে ভাইব্রেট হবে" },
  "nav.arrived": { en: "You've arrived", hi: "आप पहुँच गए", gu: "તમે પહોંચી ગયા", ta: "நீங்கள் வந்துவிட்டீர்கள்", bn: "আপনি পৌঁছে গেছেন" },
  "nav.walked": { en: "You walked {km} in {m} min", hi: "आप {m} मिनट में {km} चले", gu: "તમે {m} મિનિટમાં {km} ચાલ્યા", ta: "{m} நிமிடத்தில் {km} நடந்தீர்கள்", bn: "আপনি {m} মিনিটে {km} হাঁটলেন" },
  "nav.stamp": { en: "Ahmedabad stamp collected", hi: "अहमदाबाद की मुहर मिली", gu: "અમદાવાદનો સ્ટેમ્પ મળ્યો", ta: "அகமதாபாத் முத்திரை கிடைத்தது", bn: "আহমেদাবাদের স্ট্যাম্প সংগ্রহ হয়েছে" },
  "nav.hear_story": { en: "Hear its story", hi: "इसकी कहानी सुनें", gu: "તેની વાર્તા સાંભળો", ta: "இதன் கதையைக் கேளுங்கள்", bn: "এর গল্প শুনুন" },
  "nav.sim": { en: "Demo: your walk is simulated", hi: "डेमो: आपकी सैर सिम्युलेट की गई है", gu: "ડેમો: તમારી ચાલ સિમ્યુલેટ કરેલી છે", ta: "டெமோ: உங்கள் நடை உருவகப்படுத்தப்பட்டது", bn: "ডেমো: আপনার হাঁটা সিমুলেট করা" },
  "nav.left": { en: "{dist} left", hi: "{dist} बाकी", gu: "{dist} બાકી", ta: "{dist} மீதம்", bn: "{dist} বাকি" },
  "nav.done": { en: "Done", hi: "हो गया", gu: "થઈ ગયું", ta: "முடிந்தது", bn: "হয়ে গেছে" },


  // ---------- explore ----------
  "ex.where": { en: "Where do you want to go?", hi: "आप कहाँ जाना चाहते हैं?", gu: "તમે ક્યાં જવા માંગો છો?", ta: "எங்கே போக விரும்புகிறீர்கள்?", bn: "আপনি কোথায় যেতে চান?" },
  "ex.all": { en: "All", hi: "सभी", gu: "બધું", ta: "அனைத்தும்", bn: "সব" },
  "ex.cat.monument": { en: "Monuments", hi: "स्मारक", gu: "સ્મારકો", ta: "நினைவுச்சின்னங்கள்", bn: "স্মৃতিস্তম্ভ" },
  "ex.cat.food": { en: "Food", hi: "खाना", gu: "ખોરાક", ta: "உணவு", bn: "খাবার" },
  "ex.cat.craft": { en: "Crafts", hi: "शिल्प", gu: "હસ્તકલા", ta: "கைவினை", bn: "কারুশিল্প" },
  "ex.cat.legend": { en: "Legends", hi: "किंवदंतियाँ", gu: "દંતકથાઓ", ta: "புராணக் கதைகள்", bn: "কিংবদন্তি" },
  "ex.one.monument": { en: "Monument", hi: "स्मारक", gu: "સ્મારક", ta: "நினைவுச்சின்னம்", bn: "স্মৃতিস্তম্ভ" },
  "ex.one.food": { en: "Food", hi: "खाना", gu: "ખોરાક", ta: "உணவு", bn: "খাবার" },
  "ex.one.craft": { en: "Craft", hi: "शिल्प", gu: "હસ્તકલા", ta: "கைவினை", bn: "কারুশিল্প" },
  "ex.one.legend": { en: "Legend", hi: "किंवदंती", gu: "દંતકથા", ta: "புராணம்", bn: "কিংবদন্তি" },
  "ex.nearby": { en: "12 places within a 25-min walk", hi: "25 मिनट की पैदल दूरी में 12 जगहें", gu: "25 મિનિટના અંતરે 12 સ્થળો", ta: "25 நிமிட நடையில் 12 இடங்கள்", bn: "25 মিনিট হাঁটা দূরত্বে 12টি জায়গা" },
  "ex.count": { en: "{n} places · {cat}", hi: "{n} जगहें · {cat}", gu: "{n} સ્થળો · {cat}", ta: "{n} இடங்கள் · {cat}", bn: "{n}টি জায়গা · {cat}" },
"ex.count_one": { en: "1 place · {cat}", hi: "1 जगह · {cat}", gu: "1 સ્થળ · {cat}", ta: "1 இடம் · {cat}", bn: "1টি জায়গা · {cat}" },
  "ex.found": { en: "{n} places match", hi: "{n} जगहें मिलीं", gu: "{n} સ્થળો મળ્યાં", ta: "{n} இடங்கள் பொருந்துகின்றன", bn: "{n}টি জায়গা মিলেছে" },
  "ex.found_one": { en: "1 place matches", hi: "1 जगह मिली", gu: "1 સ્થળ મળ્યું", ta: "1 இடம் பொருந்துகிறது", bn: "1টি জায়গা মিলেছে" },
  "ex.no_match": { en: "No places on this map match “{q}”", hi: "इस नक्शे पर “{q}” से मिलती कोई जगह नहीं", gu: "આ નકશા પર “{q}” સાથે મેળ ખાતું કોઈ સ્થળ નથી", ta: "இந்த வரைபடத்தில் “{q}” க்குப் பொருந்தும் இடம் இல்லை", bn: "এই মানচিত্রে “{q}”-এর সাথে মেলে এমন জায়গা নেই" },
  "ex.list": { en: "List view", hi: "सूची", gu: "યાદી", ta: "பட்டியல்", bn: "তালিকা" },
  "ex.walk_there": { en: "Walk there", hi: "वहाँ चलें", gu: "ત્યાં ચાલો", ta: "அங்கே நட", bn: "সেখানে হাঁটুন" },
  "ex.story": { en: "Story · 2 min", hi: "कहानी · 2 मिनट", gu: "વાર્તા · 2 મિનિટ", ta: "கதை · 2 நிமி", bn: "গল্প · 2 মিনিট" },
  "ex.read": { en: "Read about it", hi: "इसके बारे में पढ़ें", gu: "તેના વિશે વાંચો", ta: "இதைப் பற்றிப் படிக்க", bn: "এ সম্পর্কে পড়ুন" },
  "ex.ask": { en: "Ask the guide", hi: "गाइड से पूछें", gu: "ગાઈડને પૂછો", ta: "வழிகாட்டியிடம் கேள்", bn: "গাইডকে জিজ্ঞাসা করুন" },
  "ex.layers": { en: "Map layers", hi: "नक्शे की परतें", gu: "નકશાના સ્તરો", ta: "வரைபட அடுக்குகள்", bn: "মানচিত্রের স্তর" },
  "ex.always_open": { en: "Always open", hi: "हमेशा खुला", gu: "હંમેશા ખુલ્લું", ta: "எப்போதும் திறந்திருக்கும்", bn: "সবসময় খোলা" },

  // ---------- saved ----------
  "sv.title": { en: "Saved", hi: "सहेजे गए", gu: "સાચવેલું", ta: "சேமித்தவை", bn: "সংরক্ষিত" },
  "sv.Places": { en: "Places", hi: "जगहें", gu: "સ્થળો", ta: "இடங்கள்", bn: "জায়গা" },
  "sv.Walks": { en: "Walks", hi: "सैर", gu: "ચાલ", ta: "நடைகள்", bn: "হাঁটা" },
  "sv.Stories": { en: "Stories", hi: "कहानियाँ", gu: "વાર્તાઓ", ta: "கதைகள்", bn: "গল্প" },
  "sv.Plans": { en: "Plans", hi: "योजनाएँ", gu: "યોજનાઓ", ta: "திட்டங்கள்", bn: "পরিকল্পনা" },
  "sv.Offline": { en: "Offline", hi: "ऑफ़लाइन", gu: "ઑફલાઇન", ta: "ஆஃப்லைன்", bn: "অফলাইন" },
  "sv.search": { en: "Search saved places, walks, stories", hi: "सहेजी जगहें, सैर, कहानियाँ खोजें", gu: "સાચવેલાં સ્થળો, ચાલ, વાર્તાઓ શોધો", ta: "சேமித்த இடங்கள், நடைகள், கதைகள் தேடுக", bn: "সংরক্ষিত জায়গা, হাঁটা, গল্প খুঁজুন" },

  // ---------- search ----------
  "se.placeholder": { en: "Places, stories, food", hi: "जगहें, कहानियाँ, खाना", gu: "સ્થળો, વાર્તાઓ, ખોરાક", ta: "இடங்கள், கதைகள், உணவு", bn: "জায়গা, গল্প, খাবার" },
  "se.try": { en: "TRY SEARCHING", hi: "यह खोजकर देखें", gu: "આ શોધી જુઓ", ta: "இதைத் தேடிப் பாருங்கள்", bn: "এগুলো খুঁজে দেখুন" },
  "se.results": { en: "{n} results for “{q}”", hi: "“{q}” के {n} नतीजे", gu: "“{q}” માટે {n} પરિણામો", ta: "“{q}” க்கு {n} முடிவுகள்", bn: "“{q}”-এর {n}টি ফলাফল" },
  "se.result": { en: "1 result for “{q}”", hi: "“{q}” का 1 नतीजा", gu: "“{q}” માટે 1 પરિણામ", ta: "“{q}” க்கு 1 முடிவு", bn: "“{q}”-এর 1টি ফলাফল" },
  "se.ask": { en: "Ask the AI Guide about “{q}”", hi: "“{q}” के बारे में AI गाइड से पूछें", gu: "“{q}” વિશે AI ગાઈડને પૂછો", ta: "“{q}” பற்றி AI வழிகாட்டியிடம் கேள்", bn: "“{q}” নিয়ে AI গাইডকে জিজ্ঞাসা করুন" },
  "se.none": { en: "Nothing saved offline for “{q}”", hi: "“{q}” के लिए ऑफ़लाइन कुछ नहीं मिला", gu: "“{q}” માટે ઑફલાઇન કંઈ નથી", ta: "“{q}” க்கு ஆஃப்லைனில் எதுவும் இல்லை", bn: "“{q}”-এর জন্য অফলাইনে কিছু নেই" },
  "se.none_body": {
    en: "The AI Guide can still answer — it knows the Old City, its food and its legends.",
    hi: "AI गाइड फिर भी जवाब दे सकता है — वह पुराने शहर, उसके खाने और किंवदंतियों को जानता है।",
    gu: "AI ગાઈડ છતાં જવાબ આપી શકે છે — તે જૂના શહેર, તેના ખોરાક અને દંતકથાઓ જાણે છે.",
    ta: "AI வழிகாட்டி இன்னும் பதில் சொல்லும் — பழைய நகரம், அதன் உணவு, புராணங்கள் அதற்குத் தெரியும்.",
    bn: "AI গাইড তবুও উত্তর দিতে পারে — সে পুরনো শহর, তার খাবার ও কিংবদন্তি জানে।",
  },
  "se.ask_short": { en: "Ask the guide", hi: "गाइड से पूछें", gu: "ગાઈડને પૂછો", ta: "வழிகாட்டியிடம் கேள்", bn: "গাইডকে জিজ্ঞাসা করুন" },


  // ---------- settings ----------
  "st.title": { en: "Settings", hi: "सेटिंग्स", gu: "સેટિંગ્સ", ta: "அமைப்புகள்", bn: "সেটিংস" },
  "st.account": { en: "ACCOUNT", hi: "खाता", gu: "ખાતું", ta: "கணக்கு", bn: "অ্যাকাউন্ট" },
  "st.language": { en: "LANGUAGE", hi: "भाषा", gu: "ભાષા", ta: "மொழி", bn: "ভাষা" },
  "st.stories": { en: "STORIES", hi: "कहानियाँ", gu: "વાર્તાઓ", ta: "கதைகள்", bn: "গল্প" },
  "st.travel": { en: "TRAVEL", hi: "यात्रा", gu: "પ્રવાસ", ta: "பயணம்", bn: "ভ্রমণ" },
  "st.access": { en: "ACCESSIBILITY", hi: "सुगम्यता", gu: "સુલભતા", ta: "அணுகல்தன்மை", bn: "অ্যাক্সেসিবিলিটি" },
  "st.alerts": { en: "NOTIFICATIONS", hi: "सूचनाएँ", gu: "સૂચનાઓ", ta: "அறிவிப்புகள்", bn: "বিজ্ঞপ্তি" },
  "st.data": { en: "YOUR DATA", hi: "आपका डेटा", gu: "તમારો ડેટા", ta: "உங்கள் தரவு", bn: "আপনার ডেটা" },
  "st.about": { en: "ABOUT", hi: "जानकारी", gu: "વિશે", ta: "பற்றி", bn: "সম্পর্কে" },
  "st.lang_note": {
    en: "The app and the AI Guide use this language. Story transcripts come in English, Hindi and Gujarati.",
    hi: "ऐप और AI गाइड इसी भाषा में होंगे। कहानियों के लिखित पाठ अंग्रेज़ी, हिन्दी और गुजराती में हैं।",
    gu: "એપ અને AI ગાઈડ આ ભાષામાં હશે. વાર્તાઓના લખાણ અંગ્રેજી, હિન્દી અને ગુજરાતીમાં છે.",
    ta: "செயலியும் AI வழிகாட்டியும் இந்த மொழியில் இருக்கும். கதை எழுத்துரைகள் ஆங்கிலம், இந்தி, குஜராத்தியில் உள்ளன.",
    bn: "অ্যাপ ও AI গাইড এই ভাষায় হবে। গল্পের লিখিত পাঠ ইংরেজি, হিন্দি ও গুজরাটিতে আছে।",
  },
  "st.story_length": { en: "Story length", hi: "कहानी की लंबाई", gu: "વાર્તાની લંબાઈ", ta: "கதையின் நீளம்", bn: "গল্পের দৈর্ঘ্য" },
  "st.auto": { en: "Play story on arrival", hi: "पहुँचने पर कहानी चलाएँ", gu: "પહોંચતાં વાર્તા ચલાવો", ta: "வந்தவுடன் கதையை இயக்கு", bn: "পৌঁছালে গল্প চালান" },
  "st.auto_hint": { en: "Start the narration when you reach a place", hi: "किसी जगह पहुँचते ही वर्णन शुरू करें", gu: "સ્થળે પહોંચતાં જ વર્ણન શરૂ કરો", ta: "ஓர் இடத்தை அடைந்ததும் விவரிப்பைத் தொடங்கு", bn: "কোনো জায়গায় পৌঁছালে বর্ণনা শুরু করুন" },
  "st.pace": { en: "Walking pace", hi: "चलने की रफ़्तार", gu: "ચાલવાની ઝડપ", ta: "நடை வேகம்", bn: "হাঁটার গতি" },
  "st.voice": { en: "Voice guidance", hi: "आवाज़ निर्देश", gu: "અવાજ માર્ગદર્શન", ta: "குரல் வழிகாட்டல்", bn: "কণ্ঠ নির্দেশনা" },
  "st.voice_hint": { en: "Spoken turn-by-turn directions", hi: "हर मोड़ पर बोले गए निर्देश", gu: "દરેક વળાંકે બોલાતી દિશાઓ", ta: "ஒவ்வொரு திருப்பத்திற்கும் குரல் வழிகாட்டல்", bn: "প্রতি মোড়ে কণ্ঠে নির্দেশনা" },
  "st.steps": { en: "Step-free routes", hi: "बिना सीढ़ी वाले रास्ते", gu: "પગથિયાં વિનાના માર્ગો", ta: "படிகளற்ற வழிகள்", bn: "সিঁড়িহীন পথ" },
  "st.steps_hint": { en: "Avoid stairs and stepped lanes", hi: "सीढ़ियों और सीढ़ीदार गलियों से बचें", gu: "પગથિયાં અને પગથિયાંવાળી ગલીઓ ટાળો", ta: "படிகள், படிக்கட்டுத் தெருக்களைத் தவிர்", bn: "সিঁড়ি ও ধাপওয়ালা গলি এড়িয়ে চলুন" },
  "st.text": { en: "Text size", hi: "अक्षरों का आकार", gu: "અક્ષરનું કદ", ta: "எழுத்து அளவு", bn: "লেখার আকার" },
  "st.desc": { en: "Audio descriptions", hi: "ऑडियो विवरण", gu: "ઑડિયો વર્ણન", ta: "ஒலி விவரிப்பு", bn: "অডিও বর্ণনা" },
  "st.desc_hint": { en: "Describe what is in front of you at each stop", hi: "हर पड़ाव पर सामने क्या है, बताएँ", gu: "દરેક સ્ટોપ પર સામે શું છે તે વર્ણવો", ta: "ஒவ்வொரு நிறுத்தத்திலும் முன்னால் இருப்பதை விவரி", bn: "প্রতি স্টপে সামনে কী আছে বলুন" },
  "st.nearby": { en: "Stories nearby", hi: "आस-पास की कहानियाँ", gu: "નજીકની વાર્તાઓ", ta: "அருகிலுள்ள கதைகள்", bn: "কাছাকাছি গল্প" },
  "st.nearby_hint": { en: "When you walk past a place with a story", hi: "जब आप किसी कहानी वाली जगह के पास से गुज़रें", gu: "જ્યારે તમે વાર્તાવાળા સ્થળ પાસેથી પસાર થાઓ", ta: "கதையுள்ள இடத்தைக் கடக்கும்போது", bn: "যখন গল্প আছে এমন জায়গার পাশ দিয়ে যান" },
  "st.trips": { en: "Trip reminders", hi: "यात्रा रिमाइंडर", gu: "પ્રવાસ રિમાઇન્ડર", ta: "பயண நினைவூட்டல்கள்", bn: "ভ্রমণ রিমাইন্ডার" },
  "st.trips_hint": { en: "Packs to download before you travel", hi: "यात्रा से पहले डाउनलोड करने वाले पैक", gu: "પ્રવાસ પહેલાં ડાઉનલોડ કરવાના પૅક", ta: "பயணத்திற்கு முன் பதிவிறக்க வேண்டிய தொகுப்புகள்", bn: "ভ্রমণের আগে ডাউনলোড করার প্যাক" },
  "st.digest": { en: "Weekly digest", hi: "साप्ताहिक सार", gu: "સાપ્તાહિક સારાંશ", ta: "வாராந்திரச் சுருக்கம்", bn: "সাপ্তাহিক সারাংশ" },
  "st.digest_hint": { en: "New stories and games, once a week", hi: "नई कहानियाँ और खेल, हफ़्ते में एक बार", gu: "નવી વાર્તાઓ અને રમતો, અઠવાડિયે એકવાર", ta: "புதிய கதைகள், விளையாட்டுகள், வாரம் ஒருமுறை", bn: "নতুন গল্প ও খেলা, সপ্তাহে একবার" },


  // ---------- stories ----------
  "lib.continue": { en: "CONTINUE LISTENING", hi: "सुनना जारी रखें", gu: "સાંભળવાનું ચાલુ રાખો", ta: "தொடர்ந்து கேளுங்கள்", bn: "শোনা চালিয়ে যান" },
  "lib.chapter": { en: "Chapter {n} of {total}", hi: "अध्याय {n} / {total}", gu: "પ્રકરણ {n} / {total}", ta: "அத்தியாயம் {n} / {total}", bn: "অধ্যায় {n} / {total}" },
  "lib.full": { en: "The full story", hi: "पूरी कहानी", gu: "આખી વાર્તા", ta: "முழுக் கதை", bn: "পুরো গল্প" },
  "lib.full_hint": { en: "Sidi Saiyyed Mosque · 4 chapters", hi: "सीदी सैयद मस्जिद · 4 अध्याय", gu: "સીદી સૈયદ મસ્જિદ · 4 પ્રકરણ", ta: "சிதி சையத் மசூதி · 4 அத்தியாயங்கள்", bn: "সিদি সৈয়দ মসজিদ · 4টি অধ্যায়" },
  "lib.short": { en: "Short listens", hi: "छोटी कहानियाँ", gu: "ટૂંકી વાર્તાઓ", ta: "சிறு கதைகள்", bn: "ছোট গল্প" },
  "lib.short_hint": { en: "A minute or two each, narrated in English", hi: "हर एक एक-दो मिनट की, अंग्रेज़ी में", gu: "દરેક એક-બે મિનિટની, અંગ્રેજીમાં", ta: "ஒவ்வொன்றும் ஓரிரு நிமிடம், ஆங்கிலத்தில்", bn: "প্রতিটি এক-দুই মিনিটের, ইংরেজিতে" },
  "lib.play": { en: "Play", hi: "चलाएँ", gu: "ચલાવો", ta: "இயக்கு", bn: "চালান" },
  "lib.search": { en: "Search stories by place", hi: "जगह के नाम से कहानी खोजें", gu: "સ્થળના નામથી વાર્તા શોધો", ta: "இடத்தின் பெயரால் கதை தேடுக", bn: "জায়গার নামে গল্প খুঁজুন" },
  "lib.listened": { en: "Listened", hi: "सुन ली", gu: "સાંભળી લીધી", ta: "கேட்டாயிற்று", bn: "শোনা হয়েছে" },
  "lib.none": { en: "No stories match “{q}”", hi: "“{q}” से मिलती कोई कहानी नहीं", gu: "“{q}” સાથે મેળ ખાતી કોઈ વાર્તા નથી", ta: "“{q}” க்குப் பொருந்தும் கதை இல்லை", bn: "“{q}”-এর সাথে মেলে এমন গল্প নেই" },
  "lib.again": { en: "LISTEN AGAIN", hi: "फिर से सुनें", gu: "ફરી સાંભળો", ta: "மீண்டும் கேளுங்கள்", bn: "আবার শুনুন" },
  "lib.progress": { en: "{n} of {total} listened", hi: "{total} में से {n} सुनीं", gu: "{total}માંથી {n} સાંભળી", ta: "{total} இல் {n} கேட்டீர்கள்", bn: "{total}টির মধ্যে {n}টি শোনা" },
  "story.chapters": { en: "Chapters", hi: "अध्याय", gu: "પ્રકરણો", ta: "அத்தியாயங்கள்", bn: "অধ্যায়" },


  // ---------- player ----------
  "pl.now": { en: "NOW PLAYING", hi: "अभी चल रहा है", gu: "હમણાં વાગી રહ્યું છે", ta: "இப்போது ஒலிக்கிறது", bn: "এখন চলছে" },
  "pl.paused": { en: "PAUSED", hi: "रुका हुआ", gu: "થોભાવેલું", ta: "இடைநிறுத்தம்", bn: "থামানো" },
  "pl.finished": { en: "FINISHED", hi: "पूरी हुई", gu: "પૂરી થઈ", ta: "முடிந்தது", bn: "শেষ" },
  "pl.up_next": { en: "UP NEXT", hi: "अगली कहानी", gu: "આગલી વાર્તા", ta: "அடுத்தது", bn: "এরপর" },
  "pl.next_in": { en: "Playing next in {n} s", hi: "{n} सेकंड में अगली कहानी", gu: "{n} સેકન્ડમાં આગલી વાર્તા", ta: "{n} வினாடிகளில் அடுத்த கதை", bn: "{n} সেকেন্ডে পরের গল্প" },
  "pl.play_now": { en: "Play now", hi: "अभी चलाएँ", gu: "હમણાં ચલાવો", ta: "இப்போது இயக்கு", bn: "এখনই চালান" },
  "pl.stay": { en: "Stay here", hi: "यहीं रहें", gu: "અહીં જ રહો", ta: "இங்கேயே இரு", bn: "এখানেই থাকুন" },
  "pl.short": { en: "Short listen", hi: "छोटी कहानी", gu: "ટૂંકી વાર્તા", ta: "சிறு கதை", bn: "ছোট গল্প" },
  "pl.transcript": { en: "LIVE TRANSCRIPT", hi: "साथ-साथ पाठ", gu: "સાથે-સાથે લખાણ", ta: "நேரடி எழுத்துரை", bn: "সরাসরি পাঠ" },
  "pl.about": { en: "About this place", hi: "इस जगह के बारे में", gu: "આ સ્થળ વિશે", ta: "இந்த இடத்தைப் பற்றி", bn: "এই জায়গা সম্পর্কে" },
  "pl.next_story": { en: "Next story", hi: "अगली कहानी", gu: "આગલી વાર્તા", ta: "அடுத்த கதை", bn: "পরের গল্প" },
  "pl.all_done": { en: "You've heard every story", hi: "आपने सारी कहानियाँ सुन लीं", gu: "તમે બધી વાર્તાઓ સાંભળી લીધી", ta: "எல்லாக் கதைகளையும் கேட்டுவிட்டீர்கள்", bn: "আপনি সব গল্প শুনেছেন" },
  "pl.again": { en: "Play again", hi: "फिर से चलाएँ", gu: "ફરી ચલાવો", ta: "மீண்டும் இயக்கு", bn: "আবার চালান" },
  "pl.library": { en: "All stories", hi: "सारी कहानियाँ", gu: "બધી વાર્તાઓ", ta: "எல்லாக் கதைகளும்", bn: "সব গল্প" },

  // ---------- common ----------
  "common.back": { en: "Back", hi: "वापस", gu: "પાછા", ta: "பின்", bn: "ফিরে যান" },
} satisfies Record<string, Entry>;

export type Key = keyof typeof D;
type Vars = Record<string, string | number>;

const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? "")) : s);
export const asLang = (id: string): Lang => (["en", "hi", "gu", "ta", "bn"].includes(id) ? (id as Lang) : "en");

export function translate(lang: string, key: Key, vars?: Vars) {
  const e: Entry = D[key];
  return fill(e[asLang(lang)] || e.en, vars);
}

// In components: const t = useT(); t("home.title")
export function useT() {
  const [lang] = useStored("lang", "en");
  return (key: Key, vars?: Vars) => translate(lang, key, vars);
}

// Outside React (toasts from event handlers).
export const tr = (key: Key, vars?: Vars) => translate(readStored("lang", "en"), key, vars);

// For server-rendered screens: <T k="home.title" />
export function T({ k, v }: { k: Key; v?: Vars }) {
  return <>{useT()(k, v)}</>;
}

// The speech voice for each language.
export const VOICE: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", gu: "gu-IN", ta: "ta-IN", bn: "bn-IN" };
