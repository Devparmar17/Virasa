"use client";

// 10 · Audio story
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Tap";
import { useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";
import { buildCues, CHAPTERS, DEPTH_LABEL, LANG_NAME, SPEECH_LOCALE, type Depth, type Lang } from "./script";

const SPEEDS = [1, 1.25, 1.5, 0.75];
const DEPTHS: [Depth, string][] = [
  ["quick", "Quick · 1 min"],
  ["classic", "Classic"],
  ["deep", "Deep · 4 min"],
];
const LANGS: [Lang, string][] = [
  ["en", "EN"],
  ["hi", "हिं"],
  ["gu", "ગુ"],
];

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function StoryScreen() {
  // Length and language start from the traveller’s preferences until changed here.
  const [settings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const [appLang] = useStored("lang", "en");
  const [depthPick, setDepth] = useState<Depth | null>(null);
  const [langPick, setLang] = useState<Lang | null>(null);
  const depth = depthPick ?? settings.length;
  const lang: Lang = langPick ?? (appLang === "hi" || appLang === "gu" ? appLang : "en");
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(0);
  // Opens part-way through chapter 2, where the traveller left off.
  const [seek0, setPos] = useState<number | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  const { cues, total, chapterStarts } = useMemo(() => buildCues(depth), [depth]);
  const start = depth === "classic" ? 52 : chapterStarts[1];
  const pos = seek0 ?? start;
  const done = pos >= total;
  let current = 0;
  cues.forEach((c, i) => {
    if (pos >= c.at) current = i;
  });
  const cue = cues[current];
  const pct = Math.min(100, (pos / total) * 100);

  // The clock: advances while playing and stops at the end.
  useEffect(() => {
    if (!playing || done) return;
    const t = setInterval(() => setPos((p) => Math.min(total, (p ?? start) + 0.25 * SPEEDS[speed])), 250);
    return () => clearInterval(t);
  }, [playing, done, speed, total, start]);

  // The voice: reads each line aloud as it becomes current.
  const line = cue.text[lang];
  useEffect(() => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) return;
    synth.cancel();
    if (!playing || done) return;
    const u = new SpeechSynthesisUtterance(line);
    u.lang = SPEECH_LOCALE[lang];
    u.rate = SPEEDS[speed];
    synth.speak(u);
    return () => synth.cancel();
    // Speed applies from the next line, so it isn't a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line, lang, playing, done]);

  const seek = (to: number) => setPos(Math.max(0, Math.min(total, to)));
  const toggle = () => {
    if (done) {
      setPos(0);
      setPlaying(true);
    } else setPlaying(!playing);
  };

  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#1E130B", fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Gujarati', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#FBF6EE" }}>
      <div style={{ padding: "50px 8px 0", height: "94px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/place" aria-label="Minimise player" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FBF6EE" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Link>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em", color: "#C9B6A0", display: "flex", alignItems: "center", gap: "8px" }}>
            {playing && !done ? (
              <span className="eq" aria-hidden="true" style={{ height: "11px", color: "#F3D9A8" }}>
                <i />
                <i />
                <i />
              </span>
            ) : null}
            {done ? "FINISHED" : playing ? "NOW PLAYING" : "PAUSED"}
          </span>
          <span style={{ fontSize: "14px", fontWeight: "700" }}>Sidi Saiyyed Mosque</span>
        </div>
        <Toggle
          storeKey="downloads"
          field="story-tree"
          onLabel="Downloaded. Remove download"
          offLabel="Download for offline"
          onToast="Story downloaded for offline listening"
          offToast="Download removed"
          style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "none", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          on={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9FD3B0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
          }
          off={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
          }
        />
      </div>
      <div style={{ marginTop: "6px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "196px", height: "204px", borderRadius: "98px 98px 18px 18px", overflow: "hidden", boxShadow: "0 24px 50px rgba(0, 0, 0, 0.45)" }}>
          <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="Tree of Life jali" className={`kenburns${playing && !done ? "" : " paused"}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>
      <div style={{ padding: "20px 24px 0", textAlign: "center" }}>
        <p style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.14em", color: "#E7B98A" }}>CHAPTER {cue.ch + 1} OF 4</p>
        <h1 key={cue.ch} className="fade-in" style={{ margin: "6px 0 0", fontSize: "24px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.01em" }}>
          {CHAPTERS[cue.ch]}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: "600", color: "#C9B6A0" }}>
          {DEPTH_LABEL[depth]} · narrated in {LANG_NAME[lang]}
        </p>
      </div>
      <div style={{ padding: "18px 24px 0" }}>
        <div
          ref={bar}
          role="slider"
          tabIndex={0}
          aria-label="Story position"
          aria-valuemin={0}
          aria-valuemax={Math.round(total)}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${clock(pos)} of ${clock(total)}`}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - r.left) / r.width) * total);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") seek(pos + 5);
            if (e.key === "ArrowLeft") seek(pos - 5);
          }}
          style={{ position: "relative", height: "6px", borderRadius: "999px", background: "rgba(251, 246, 238, 0.18)", cursor: "pointer", touchAction: "none" }}
        >
          <div style={{ width: `${pct}%`, height: "100%", borderRadius: "999px", background: "#F3D9A8", transition: "width 0.25s linear" }} />
          {chapterStarts.slice(1).map((s) => (
            <span key={s} style={{ position: "absolute", left: `${(s / total) * 100}%`, top: "-2px", width: "2px", height: "10px", background: "#1E130B" }} />
          ))}
          <span style={{ position: "absolute", left: `calc(${pct}% - 8px)`, top: "-5px", width: "16px", height: "16px", borderRadius: "50%", background: "#FBF6EE", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)", transition: "left 0.25s linear" }} />
        </div>
        <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "#C9B6A0", fontVariantNumeric: "tabular-nums" }}>
          <span>{clock(pos)}</span>
          <span>{clock(total)}</span>
        </div>
      </div>
      <div style={{ padding: "10px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          aria-label={`Playback speed ${SPEEDS[speed]}x. Change speed`}
          onClick={() => {
            const next = (speed + 1) % SPEEDS.length;
            setSpeed(next);
            toast(`Speed ${SPEEDS[next]}×`);
          }}
          style={{ width: "48px", height: "48px", border: "0", borderRadius: "50%", background: "none", color: "#FBF6EE", fontSize: "15px", fontWeight: "800", cursor: "pointer" }}
        >
          {SPEEDS[speed]}×
        </button>
        <button type="button" aria-label="Back 10 seconds" onClick={() => seek(pos - 10)} style={{ width: "56px", height: "56px", border: "0", borderRadius: "50%", background: "none", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span style={{ position: "absolute", fontSize: "10px", fontWeight: "800", top: "22px" }}>10</span>
        </button>
        <button type="button" aria-label={done ? "Play again" : playing ? "Pause" : "Play"} onClick={toggle} style={{ width: "76px", height: "76px", border: "0", borderRadius: "50%", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 26px rgba(243, 217, 168, 0.25)" }}>
          {playing && !done ? (
            <svg key="pause" className="pop-in" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg key="play" className="pop-in" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <polygon points="7 4 19 12 7 20 7 4" />
            </svg>
          )}
        </button>
        <button type="button" aria-label="Forward 10 seconds" onClick={() => seek(pos + 10)} style={{ width: "56px", height: "56px", border: "0", borderRadius: "50%", background: "none", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <span style={{ position: "absolute", fontSize: "10px", fontWeight: "800", top: "22px" }}>10</span>
        </button>
        <Link href="/place#chapters" aria-label="All chapters" style={{ width: "48px", height: "48px", borderRadius: "50%", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
        </Link>
      </div>
      <div style={{ margin: "16px 24px 0", padding: "4px", borderRadius: "14px", background: "rgba(251, 246, 238, 0.08)", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "4px" }}>
        {DEPTHS.map(([id, text]) => (
          <button
            key={id}
            type="button"
            aria-pressed={depth === id}
            onClick={() => {
              // Keep the listener in the same chapter when the version changes.
              const next = buildCues(id);
              setDepth(id);
              setPos(next.chapterStarts[cue.ch]);
            }}
            style={{ height: "40px", border: "0", borderRadius: "10px", background: depth === id ? "#FBF6EE" : "transparent", color: depth === id ? "#2B1B10" : "#E7D3B5", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
          >
            {text}
          </button>
        ))}
      </div>
      <section aria-label="Transcript" style={{ margin: "14px 20px 0", padding: "14px 16px 16px", borderRadius: "18px", background: "rgba(251, 246, 238, 0.07)", border: "1px solid rgba(251, 246, 238, 0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "#C9B6A0" }}>LIVE TRANSCRIPT</span>
          <div style={{ display: "flex", gap: "2px" }}>
            {LANGS.map(([id, text]) => (
              <button key={id} type="button" lang={id} aria-label={`Transcript in ${LANG_NAME[id]}`} aria-pressed={lang === id} onClick={() => setLang(id)} style={{ height: "30px", minWidth: "40px", padding: "0 8px", border: "0", borderRadius: "8px", background: lang === id ? "#F3D9A8" : "none", color: lang === id ? "#2B1B10" : "#E7D3B5", fontSize: lang === id ? "12px" : "13px", fontWeight: lang === id ? 800 : 600, cursor: "pointer" }}>
                {text}
              </button>
            ))}
          </div>
        </div>
        <div key={`${current}-${lang}`} className="rise" lang={lang} aria-live="off">
          <p style={{ margin: "10px 0 0", minHeight: "20px", fontSize: "14px", lineHeight: "1.45", color: "#A8927C" }}>{current > 0 ? cues[current - 1].text[lang] : ""}</p>
          <p style={{ margin: "8px 0 0", fontSize: "calc(17px * var(--read-scale, 1))", lineHeight: "1.4", fontWeight: "700", color: "#FBF6EE" }}>{cue.text[lang]}</p>
          <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "1.45", color: "#A8927C" }}>{current < cues.length - 1 ? cues[current + 1].text[lang] : "End of story."}</p>
        </div>
      </section>
    </div>
  );
}
