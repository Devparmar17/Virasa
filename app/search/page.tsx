"use client";

// 06 · Search results
import { useEffect, useState, useSyncExternalStore } from "react";
import { speechLocale, useStored } from "@/lib/store";
import Link from "next/link";
import BackLink from "@/components/Back";
import { useAsk } from "@/components/Tap";
import VoiceSearch from "@/components/VoiceSearch";
import { searchApp } from "@/lib/search";
import { useT } from "@/lib/i18n";

const TABS = [
  ["all", "All"],
  ["places", "Places 5"],
  ["stories", "Stories 2"],
  ["reels", "Reels 3"],
  ["open", "Open now"],
] as const;
type Tab = (typeof TABS)[number][0];

// The offline library on this phone only covers these so far.
const KNOWN = /jal+i|jaali|lattice|stone screen/i;
const SUGGESTIONS = ["jali", "stepwells", "Manek Chowk food", "Bhadra Fort legend"];

export default function SearchScreen() {
  // A search can arrive in the address (/search?q=…), for example from voice search on Home.
  const fromUrl = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).get("q"),
    () => null
  );
  const [typed, setQ] = useState<string | null>(null);
  // Opens empty (ready to type) unless a search arrived in the address.
  const q = typed ?? fromUrl ?? "";
  const [tab, setTab] = useState<Tab>("all");
  const ask = useAsk();
  const t = useT();
  const query = q.trim();
  const found = KNOWN.test(query);
  // Anything else is looked up across the places, finds, tickets and trips in the app.
  const hits = found ? [] : searchApp(query);

  // A short AI answer for what was typed: Gemini when it's connected, else the library.
  // Asked once the typing pauses; kept per question so going back to one is instant.
  const [lang] = useStored("lang", "en");
  const [answers, setAnswers] = useState<Record<string, { text: string; source: string } | null>>({});
  const key = query.toLowerCase();
  const wantAnswer = !found && key.length >= 3;
  const answer = wantAnswer ? answers[key] : undefined;
  const answering = wantAnswer && answer === undefined;
  useEffect(() => {
    if (!wantAnswer || answers[key] !== undefined) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/guide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", text: key }], lang, mode: "search" }) });
        const data = await res.json();
        setAnswers((a) => ({ ...a, [key]: data.text && !data.fallback ? { text: data.text, source: data.source } : null }));
      } catch {
        setAnswers((a) => ({ ...a, [key]: null }));
      }
    }, 550);
    return () => clearTimeout(timer);
  }, [wantAnswer, key, answers, lang]);
  const [speaking, setSpeaking] = useState(false);
  const listen = (text: string) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechLocale(lang);
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const openOnly = tab === "open";
  const show = {
    answer: tab === "all",
    places: tab === "all" || tab === "places" || openOnly,
    stories: tab === "all" || tab === "stories",
    reels: tab === "all" || tab === "reels",
  };
  const v = { q, onQ: (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value), clear: () => setQ("") };
  return (
    <div style={{ width: "390px", minHeight: "844px", paddingBottom: "40px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Gujarati', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ padding: "54px 16px 0 8px", display: "flex", alignItems: "center", gap: "6px" }}>
        <BackLink href="/home" aria-label="Back" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </BackLink>
        <div style={{ flex: "1", minWidth: "0", height: "50px", border: "1.5px solid #9A4E36", borderRadius: "14px", display: "flex", alignItems: "center", gap: "8px", padding: "0 2px 0 14px", background: "#FFFFFF", boxShadow: "0 0 0 4px rgba(154, 78, 54, 0.10)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input type="search" autoFocus enterKeyHint="search" aria-label="Search places, stories or food" placeholder={t("se.placeholder")} value={v.q} onChange={v.onQ} onKeyDown={(e) => { if (e.key === "Enter" && query && !found && !hits.length) ask(query); }} style={{ flex: "1", minWidth: "0", width: "0", height: "44px", border: "0", outline: "none", background: "transparent", fontSize: "16px", fontWeight: "600", color: "#2B1B10" }} />
          <VoiceSearch onResult={setQ} style={{ width: "44px", height: "44px", border: "0", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9A4E36" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </VoiceSearch>
          {q ? <button type="button" aria-label="Clear search" onClick={v.clear} style={{ width: "44px", height: "44px", border: "0", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6F5B4B" }}>
            <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#EFE6DA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </span>
          </button> : null}
        </div>
      </div>
      {found ? (
        <>
      <div className="hscroll" style={{ padding: "12px 20px 0", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
        {TABS.map(([id, text]) => (
          <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} style={{ flex: "0 0 auto", height: "38px", padding: "0 14px", borderRadius: "999px", border: tab === id ? "1.5px solid #2B1B10" : "1.5px solid #E2D3C1", background: tab === id ? "#2B1B10" : "#FFFFFF", color: tab === id ? "#FFFFFF" : "#2B1B10", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            {text}
          </button>
        ))}
      </div>
      <section hidden={!show.answer} aria-label="Quick answer" style={{ margin: "16px 20px 0", padding: "16px", borderRadius: "18px", background: "#F6F1EA", border: "1px solid #EFE6DA" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", color: "#8A6424" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#8A6424" stroke="none" aria-hidden="true">
            <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
            <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
          </svg>
          {" VIRASA AI · QUICK ANSWER "}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#2B1B10", textWrap: "pretty" }}>
          {"A "}
          <strong>
            jali
          </strong>
          {" is a stone screen carved into a lattice. It lets in light and breeze while keeping rooms cool and private. Famous ones range from Sidi Saiyyed Mosque here in Ahmedabad to Salim Chishti's Tomb at Fatehpur Sikri."}
        </p>
        <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#6F5B4B" }}>
          {"From Virasa's verified heritage library"}
        </p>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <Link href="/story" style={{ height: "44px", padding: "0 14px 0 10px", borderRadius: "12px", border: "1.5px solid #9A4E36", color: "#9A4E36", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "700", textDecoration: "none", background: "#FFFFFF" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <polygon points="7 4 19 12 7 20 7 4" />
            </svg>
            {" Listen · 30 s "}
          </Link>
          <button type="button" onClick={() => ask("Tell me more about jalis and where to see the best ones")} style={{ height: "44px", padding: "0 12px", borderRadius: "12px", border: "0", background: "none", color: "#5A4434", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Ask a follow-up
          </button>
        </div>
      </section>
      <section hidden={!show.places} style={{ marginTop: "26px" }}>
        <div style={{ padding: "0 20px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "800" }}>
            Places
          </h2>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
            Nearest first
          </span>
        </div>
        <p style={{ margin: "12px 20px 0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
          NEAR YOU · AHMEDABAD
        </p>
        <ul style={{ listStyle: "none", margin: "4px 0 0", padding: "0 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <li>
            <Link href="/place" style={{ minHeight: "80px", padding: "8px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10", background: "#FFFFFF" }}>
              <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ flex: "0 0 64px", width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "16px", fontWeight: "800" }}>
                  Sidi Saiyyed Mosque
                </span>
                <span style={{ fontSize: "13px", color: "#5A4434" }}>
                  Ten carved jalis, incl. the Tree of Life
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  {"22 min walk · "}
                  <span style={{ color: "#2F7A4A" }}>
                    Open now
                  </span>
                </span>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </li>
          <li>
            <button type="button" onClick={() => ask("Tell me about Rani Sipri's Mosque")} style={{ width: "100%", minHeight: "80px", padding: "8px", border: "0", borderRadius: "16px", background: "none", color: "#2B1B10", textAlign: "left", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
              <img src="/images/rani-sipri.jpg" alt="Rani Sipri's Mosque, Ahmedabad" style={{ flex: "0 0 64px", width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "16px", fontWeight: "800" }}>
                  {"Rani Sipri's Mosque"}
                </span>
                <span style={{ fontSize: "13px", color: "#5A4434" }}>
                  Slender minarets and fine jalis, 1514
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  {"2.4 km · "}
                  <span style={{ color: "#2F7A4A" }}>
                    Open now
                  </span>
                </span>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </li>
          <li hidden={openOnly}>
            <button type="button" onClick={() => ask("Tell me about Sarkhej Roza")} style={{ width: "100%", minHeight: "80px", padding: "8px", border: "0", borderRadius: "16px", background: "none", color: "#2B1B10", textAlign: "left", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
              <img src="/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg" alt="" style={{ flex: "0 0 64px", width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "16px", fontWeight: "800" }}>
                  Sarkhej Roza
                </span>
                <span style={{ fontSize: "13px", color: "#5A4434" }}>
                  Pierced stone screens around royal tombs
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  8 km · 20 min drive
                </span>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </li>
        </ul>
        {!openOnly ? (
          <>
        <p style={{ margin: "14px 20px 0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
          ACROSS INDIA
        </p>
        <ul style={{ listStyle: "none", margin: "4px 0 0", padding: "0 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <li>
            <button type="button" onClick={() => ask("Tell me about Salim Chishti's Tomb")} style={{ width: "100%", minHeight: "80px", padding: "8px", border: "0", borderRadius: "16px", background: "none", color: "#2B1B10", textAlign: "left", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
              <img src="/images/salim-chishti.jpg" alt="Marble jalis at the tomb of Salim Chishti" style={{ flex: "0 0 64px", width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "16px", fontWeight: "800" }}>
                  {"Salim Chishti's Tomb"}
                </span>
                <span style={{ fontSize: "13px", color: "#5A4434" }}>
                  Marble jalis as fine as lace
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  Fatehpur Sikri, Uttar Pradesh
                </span>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </li>
          <li>
            <button type="button" onClick={() => ask("Tell me about Hawa Mahal")} style={{ width: "100%", minHeight: "80px", padding: "8px", border: "0", borderRadius: "16px", background: "none", color: "#2B1B10", textAlign: "left", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
              <img src="/images/hawa-mahal.jpg" alt="The facade of Hawa Mahal, Jaipur" style={{ flex: "0 0 64px", width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "16px", fontWeight: "800" }}>
                  Hawa Mahal
                </span>
                <span style={{ fontSize: "13px", color: "#5A4434" }}>
                  953 latticed windows that catch the breeze
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  Jaipur, Rajasthan
                </span>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </li>
        </ul>
          </>
        ) : null}
      </section>
      <section hidden={!show.stories} style={{ marginTop: "22px" }}>
        <div style={{ padding: "0 20px" }}>
          <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "800" }}>
            Audio stories
          </h2>
        </div>
        <ul style={{ listStyle: "none", margin: "10px 0 0", padding: "0 20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <li style={{ minHeight: "64px", display: "flex", alignItems: "center", gap: "14px" }}>
            <Link href="/story" aria-label="Play: How stone became lace" style={{ flex: "0 0 48px", width: "48px", height: "48px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                <polygon points="7 4 19 12 7 20 7 4" />
              </svg>
            </Link>
            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "15px", fontWeight: "700" }}>
                How stone became lace: reading a jali
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                3 min · EN · हिं · ગુ
              </span>
            </span>
          </li>
          <li style={{ minHeight: "64px", display: "flex", alignItems: "center", gap: "14px" }}>
            <Link href="/story" aria-label="Play: The noble who built Ahmedabad's symbol" style={{ flex: "0 0 48px", width: "48px", height: "48px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                <polygon points="7 4 19 12 7 20 7 4" />
              </svg>
            </Link>
            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "15px", fontWeight: "700" }}>
                {"The noble who built Ahmedabad's symbol"}
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                2 min · EN · हिं · ગુ
              </span>
            </span>
          </li>
        </ul>
      </section>
      <section hidden={!show.reels} style={{ marginTop: "22px" }}>
        <div style={{ padding: "0 20px" }}>
          <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "800" }}>
            Reels
          </h2>
        </div>
        <div style={{ marginTop: "12px", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
          <Link href="/reels" style={{ position: "relative", height: "184px", borderRadius: "14px", overflow: "hidden", display: "block", textDecoration: "none", background: "#2B1B10" }}>
            <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "30% 50%", display: "block" }} />
            <span style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "28px 10px 10px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0) 0%, rgba(20, 12, 6, 0.86) 100%)", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", lineHeight: "1.25" }}>
                Golden hour at Sidi Saiyyed
              </span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#F3D9A8" }}>
                0:42
              </span>
            </span>
          </Link>
          <Link href="/reels" style={{ position: "relative", height: "184px", borderRadius: "14px", overflow: "hidden", display: "block", textDecoration: "none", background: "#2B1B10" }}>
            <img src="/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <span style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "28px 10px 10px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0) 0%, rgba(20, 12, 6, 0.86) 100%)", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", lineHeight: "1.25" }}>
                Sarkhej Roza in 30 seconds
              </span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#F3D9A8" }}>
                0:30
              </span>
            </span>
          </Link>
          <Link href="/reels" style={{ position: "relative", height: "184px", borderRadius: "14px", overflow: "hidden", display: "block", textDecoration: "none", background: "#2B1B10" }}>
            <img src="/images/6b114a4ce322f517be6c561ea38233e8.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <span style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "28px 10px 10px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0) 0%, rgba(20, 12, 6, 0.86) 100%)", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", lineHeight: "1.25" }}>
                Jali windows of the pols
              </span>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#F3D9A8" }}>
                0:55
              </span>
            </span>
          </Link>
        </div>
      </section>
        </>
      ) : (
        <div className="rise" style={{ padding: "22px 20px 0" }}>
          {answering || answer ? (
            <section aria-label="AI answer" aria-busy={answering} className="fade-in" style={{ marginBottom: "18px", padding: "14px 16px", borderRadius: "18px", background: "#F6F1EA", border: "1px solid #EFE6DA" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", color: answer?.source === "gemini" ? "#3457C9" : "#8A6424" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
                </svg>
                {answering ? "THINKING…" : answer?.source === "gemini" ? "AI ANSWER · GEMINI" : answer?.source === "claude" ? "AI ANSWER · CLAUDE" : "FROM VIRASA'S LIBRARY"}
              </div>
              {answering ? (
                <div aria-hidden="true" style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span className="shimmer" style={{ height: "12px", borderRadius: "6px", width: "92%" }} />
                  <span className="shimmer" style={{ height: "12px", borderRadius: "6px", width: "78%" }} />
                  <span className="shimmer" style={{ height: "12px", borderRadius: "6px", width: "60%" }} />
                </div>
              ) : answer ? (
                <>
                  <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#2B1B10" }}>{answer.text}</p>
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                    <button type="button" aria-pressed={speaking} onClick={() => listen(answer.text)} style={{ height: "40px", padding: "0 14px 0 10px", border: 0, borderRadius: "999px", background: speaking ? "#9A4E36" : "#FFFFFF", color: speaking ? "#FFFFFF" : "#7E3D29", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 800, cursor: "pointer" }}>
                      {speaking ? (
                        <span className="eq" aria-hidden="true" style={{ height: "12px" }}>
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <polygon points="7 4 19 12 7 20 7 4" />
                        </svg>
                      )}
                      {speaking ? "Stop" : "Listen"}
                    </button>
                    <button type="button" onClick={() => ask(query)} style={{ height: "40px", padding: "0 14px", border: "1.5px solid #E2D3C1", borderRadius: "999px", background: "#FFFFFF", color: "#2B1B10", fontSize: "13px", fontWeight: 800, cursor: "pointer" }}>
                      Ask a follow-up
                    </button>
                  </div>
                </>
              ) : null}
            </section>
          ) : null}
          {hits.length ? (
            <section aria-label={`Results for ${query}`} style={{ marginBottom: "22px" }}>
              <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "800" }}>
                {hits.length === 1 ? t("se.result", { q: query }) : t("se.results", { n: hits.length, q: query })}
              </h2>
              <ul style={{ listStyle: "none", margin: "8px -8px 0", padding: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                {hits.map((h) => (
                  <li key={h.id}>
                    <Link href={h.href} style={{ minHeight: "76px", padding: "8px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10" }}>
                      {h.img ? <img src={h.img} alt="" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", display: "block" }} /> : <span aria-hidden="true" style={{ flex: "0 0 60px", height: "60px", borderRadius: "12px", background: "#EFE1C9" }} />}
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#8A6424" }}>{h.kind}</span>
                        <span style={{ fontSize: "16px", fontWeight: "800" }}>{h.title}</span>
                        <span style={{ fontSize: "13px", lineHeight: 1.35, color: "#5A4434" }}>{h.sub}</span>
                      </span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => ask(query)} style={{ marginTop: "12px", width: "100%", height: "48px", border: "1.5px solid #9A4E36", borderRadius: "14px", background: "#FFFFFF", color: "#9A4E36", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
                {t("se.ask", { q: query })}
              </button>
            </section>
          ) : query ? (
            <section style={{ padding: "18px", borderRadius: "18px", background: "#F6F1EA", border: "1px solid #EFE6DA" }}>
              <p style={{ margin: "0", fontSize: "17px", fontWeight: "800" }}>
                {t("se.none", { q: query })}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#5A4434" }}>{t("se.none_body")}</p>
              <button type="button" onClick={() => ask(query)} style={{ marginTop: "14px", height: "48px", padding: "0 18px", border: "0", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}>
                {t("se.ask_short")}
              </button>
            </section>
          ) : null}
          <p style={{ margin: query && !hits.length ? "26px 0 0" : "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>{t("se.try")}</p>
          <div className="stagger" style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SUGGESTIONS.map((text) => (
              <button key={text} type="button" onClick={() => setQ(text)} style={{ height: "40px", padding: "0 14px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                {text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
