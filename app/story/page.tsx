"use client";

// 10 · Audio story — one player for every story. The full Sidi Saiyyed story
// has chapters, three transcript languages and three lengths; each place's
// short listen plays the same way. When a story ends, the next one starts by
// itself after a short countdown (or straight away, or not at all).
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackLink from "@/components/Back";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Tap";
import { Tick } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";
import { DEPTH_LABEL, LANG_NAME, SPEECH_LOCALE, type Depth, type Lang } from "./script";
import { nextTrack, track, type Track } from "./tracks";

const SPEEDS = [1, 1.25, 1.5, 0.75];
const DEPTHS: [Depth, string][] = [
  ["quick", "Quick · 1 min"],
  ["classic", "Classic"],
  ["deep", "Deep · 4 min"],
];
const LANG_SHORT: Record<Lang, string> = { en: "EN", hi: "हिं", gu: "ગુ" };
const COUNTDOWN = 5;
const noop = () => () => {};
const query = (k: string) => new URLSearchParams(window.location.search).get(k);
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// The address picks the story (/story?s=manek) and, for the full story, a chapter (?ch=2).
export default function StoryScreen() {
  const id = useSyncExternalStore(noop, () => query("s"), () => null);
  const ch = useSyncExternalStore(noop, () => query("ch"), () => null);
  const tr = track(id);
  // A new story starts from fresh.
  return <Player key={`${tr.id}-${ch ?? ""}`} tr={tr} chosen={ch} />;
}

function Player({ tr, chosen }: { tr: Track; chosen: string | null }) {
  const t = useT();
  const router = useRouter();
  const [settings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const [appLang] = useStored("lang", "en");
  const [depthPick, setDepth] = useState<Depth | null>(null);
  const [langPick, setLang] = useState<Lang | null>(null);
  const depth: Depth = tr.depths ? (depthPick ?? settings.length) : "classic";
  const fallbackLang: Lang = appLang === "hi" || appLang === "gu" ? appLang : "en";
  const lang: Lang = langPick ?? (tr.langs.includes(fallbackLang) ? fallbackLang : "en");
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [seek0, setPos] = useState<number | null>(null);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  // After a story ends: seconds left before the next one, unless "Stay here" was chosen.
  const [left, setLeft] = useState(COUNTDOWN);
  const [stayed, setStayed] = useState(false);
  const [storyDone, setStoryDone] = useStored<Record<number, boolean>>("storyDone", { 0: true });
  const [heard, setHeard] = useStored<Record<string, boolean>>("heard", {});
  const next = nextTrack(tr.id);

  const { cues, total, chapterStarts } = useMemo(() => tr.build(depth), [tr, depth]);
  const chosenCh = chosen !== null && chapterStarts[Number(chosen)] !== undefined ? Number(chosen) : null;
  // The full story opens part-way through chapter 2, where the traveller left off.
  const start = chosenCh !== null ? chapterStarts[chosenCh] : tr.id === "sidi" ? (depth === "classic" ? 52 : chapterStarts[1]) : 0;
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
    const id = setInterval(() => setPos((p) => Math.min(total, (p ?? start) + 0.25 * SPEEDS[speed])), 250);
    return () => clearInterval(id);
  }, [playing, done, speed, total, start]);

  // The voice: reads each line aloud as it becomes current.
  const line = cue.text[lang];
  useEffect(() => {
    const synth = window.speechSynthesis;
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

  // Ticks in the library: a chapter once ~80% of it has actually played
  // (skipping doesn't count), a short listen once it reaches the end.
  const heardIn = useRef<Record<number, number>>({});
  const lastPos = useRef(pos);
  useEffect(() => {
    const step = pos - lastPos.current;
    lastPos.current = pos;
    if (step <= 0 || step > 1) return;
    if (tr.id !== "sidi") return;
    const c = cue.ch;
    heardIn.current[c] = (heardIn.current[c] ?? 0) + step;
    const length = (chapterStarts[c + 1] ?? total) - chapterStarts[c];
    if (!storyDone[c] && heardIn.current[c] >= length * 0.8) {
      setStoryDone((d) => ({ ...d, [c]: true }));
      toast(`${t("lib.listened")} · ${tr.chapters[c]}`, "success");
    }
  }, [pos, cue.ch, chapterStarts, total, storyDone, setStoryDone, tr, t]);

  // The end: mark it heard, then count down to the next story.
  useEffect(() => {
    if (!done || tr.id === "sidi" || heard[tr.id]) return;
    setHeard((h) => ({ ...h, [tr.id]: true }));
    toast(`${t("lib.listened")} · ${tr.title}`, "success");
  }, [done, tr, heard, setHeard, t]);
  const countdown = done && next && !stayed ? left : null;
  useEffect(() => {
    if (countdown === null || !next) return;
    if (countdown <= 0) {
      router.replace(`/story?s=${next.id}`);
      return;
    }
    const id = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, next, router]);

  const seek = (to: number) => {
    setLeft(COUNTDOWN);
    setPos(Math.max(0, Math.min(total, to)));
  };
  const toggle = () => {
    if (done) {
      setLeft(COUNTDOWN);
      setPos(0);
      setPlaying(true);
    } else setPlaying(!playing);
  };
  const goNext = () => next && router.replace(`/story?s=${next.id}`);
  const multi = tr.chapters.length > 1;

  const icon = { width: "52px", height: "52px", border: 0, borderRadius: "50%", background: "none", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" as const };

  return (
    <div style={{ width: "390px", minHeight: "844px", position: "relative", background: "#1E130B", color: "#FBF6EE", paddingBottom: "28px" }}>
      {/* Header */}
      <div style={{ padding: "50px 8px 0", height: "94px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <BackLink href="/stories" aria-label="Minimise player" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FBF6EE" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </BackLink>
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", textAlign: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#C9B6A0", display: "flex", alignItems: "center", gap: "8px" }}>
            {playing && !done ? (
              <span className="eq" aria-hidden="true" style={{ height: "11px", color: "#F3D9A8" }}>
                <i />
                <i />
                <i />
              </span>
            ) : null}
            {done ? t("pl.finished") : playing ? t("pl.now") : t("pl.paused")}
          </span>
          <span style={{ fontSize: "14px", fontWeight: 700 }}>{tr.id === "sidi" ? tr.place : tr.title}</span>
        </div>
        <Toggle
          storeKey="downloads"
          field={tr.id === "sidi" ? "story-tree" : `story-${tr.id}`}
          onLabel="Downloaded. Remove download"
          offLabel="Download for offline"
          onToast="Story downloaded for offline listening"
          offToast="Download removed"
          style={{ width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "none", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          on={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9FD3B0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
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

      {/* Artwork */}
      <div style={{ marginTop: "4px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "168px", height: "180px", borderRadius: "84px 84px 18px 18px", overflow: "hidden", boxShadow: "0 22px 44px rgba(0, 0, 0, 0.45)" }}>
          <img src={tr.img} alt={tr.alt} className={`kenburns${playing && !done ? "" : " paused"}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>

      {/* What is playing: a chapter pill that opens the chapter list. */}
      <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {multi ? (
          <button type="button" aria-haspopup="dialog" onClick={() => setChaptersOpen(true)} style={{ height: "32px", padding: "0 12px", border: "1px solid rgba(231, 185, 138, 0.35)", borderRadius: "999px", background: "rgba(231, 185, 138, 0.1)", color: "#E7B98A", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer" }}>
            {t("lib.chapter", { n: cue.ch + 1, total: tr.chapters.length }).toUpperCase()}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ) : (
          <span style={{ height: "32px", display: "flex", alignItems: "center", fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", color: "#E7B98A" }}>{t("pl.short").toUpperCase()} · {tr.place.toUpperCase()}</span>
        )}
        <h1 key={cue.ch} className="fade-in" style={{ margin: "8px 0 0", fontSize: "23px", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.01em" }}>
          {tr.chapters[cue.ch]}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: 600, color: "#C9B6A0" }}>
          {tr.depths ? `${DEPTH_LABEL[depth]} · ` : ""}narrated in {LANG_NAME[lang]}
        </p>
      </div>

      {/* Position */}
      <div style={{ padding: "16px 24px 0" }}>
        <div
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
          <span style={{ position: "absolute", left: `calc(${pct}% - 8px)`, top: "-5px", width: "16px", height: "16px", borderRadius: "50%", background: "#F6F1EA", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)", transition: "left 0.25s linear" }} />
        </div>
        <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, color: "#C9B6A0", fontVariantNumeric: "tabular-nums" }}>
          <span>{clock(pos)}</span>
          <span>-{clock(Math.max(0, total - pos))}</span>
        </div>
      </div>

      {/* Controls: speed · back 10 · play · forward 10 · next story */}
      <div style={{ padding: "8px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          aria-label={`Playback speed ${SPEEDS[speed]}x. Change speed`}
          onClick={() => {
            const n = (speed + 1) % SPEEDS.length;
            setSpeed(n);
            toast(`Speed ${SPEEDS[n]}×`);
          }}
          style={{ ...icon, fontSize: "15px", fontWeight: 800 }}
        >
          {SPEEDS[speed]}×
        </button>
        <button type="button" aria-label="Back 10 seconds" onClick={() => seek(pos - 10)} style={icon}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span style={{ position: "absolute", fontSize: "10px", fontWeight: 800 }}>10</span>
        </button>
        <button type="button" aria-label={done ? t("pl.again") : playing ? "Pause" : "Play"} onClick={toggle} style={{ width: "76px", height: "76px", border: 0, borderRadius: "50%", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 12px 28px rgba(243, 217, 168, 0.25)" }}>
          {done ? (
            <svg key="again" className="pop-in" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          ) : playing ? (
            <svg key="pause" className="pop-in" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" />
            </svg>
          ) : (
            <svg key="play" className="pop-in" width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="7 4 19 12 7 20 7 4" />
            </svg>
          )}
        </button>
        <button type="button" aria-label="Forward 10 seconds" onClick={() => seek(pos + 10)} style={icon}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <span style={{ position: "absolute", fontSize: "10px", fontWeight: 800 }}>10</span>
        </button>
        <button type="button" aria-label={next ? `${t("pl.next_story")}: ${next.title}` : t("pl.next_story")} disabled={!next} onClick={goNext} style={{ ...icon, opacity: next ? 1 : 0.35 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5 4 15 12 5 20 5 4" />
            <rect x="17" y="4" width="2.6" height="16" rx="1" />
          </svg>
        </button>
      </div>

      {/* Length (full story only) */}
      {tr.depths ? (
        <div role="radiogroup" aria-label="Story length" style={{ margin: "14px 24px 0", padding: "4px", borderRadius: "14px", background: "rgba(251, 246, 238, 0.08)", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "4px" }}>
          {DEPTHS.map(([d, text]) => (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={depth === d}
              onClick={() => {
                // Keep the listener in the same chapter when the version changes.
                const nb = tr.build(d);
                setDepth(d);
                setPos(nb.chapterStarts[cue.ch]);
              }}
              style={{ height: "40px", border: 0, borderRadius: "10px", background: depth === d ? "#FBF6EE" : "transparent", color: depth === d ? "#2B1B10" : "#E7D3B5", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
            >
              {text}
            </button>
          ))}
        </div>
      ) : null}

      {/* Live transcript */}
      <section aria-label="Transcript" style={{ margin: "14px 20px 0", padding: "14px 16px 16px", borderRadius: "18px", background: "rgba(251, 246, 238, 0.07)", border: "1px solid rgba(251, 246, 238, 0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "40px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#C9B6A0" }}>{t("pl.transcript")}</span>
          {tr.langs.length > 1 ? (
            <div style={{ display: "flex", gap: "2px" }}>
              {tr.langs.map((l) => (
                <button key={l} type="button" lang={l} aria-label={`Transcript in ${LANG_NAME[l]}`} aria-pressed={lang === l} onClick={() => setLang(l)} style={{ height: "40px", minWidth: "44px", padding: "0 8px", border: 0, borderRadius: "10px", background: lang === l ? "#F3D9A8" : "transparent", color: lang === l ? "#2B1B10" : "#E7D3B5", fontSize: "13px", fontWeight: 800, cursor: "pointer" }}>
                  {LANG_SHORT[l]}
                </button>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#A8927C" }}>English</span>
          )}
        </div>
        <div key={`${current}-${lang}`} className="rise" lang={lang} aria-live="off">
          <p style={{ margin: "8px 0 0", minHeight: "20px", fontSize: "14px", lineHeight: 1.45, color: "#A8927C" }}>{current > 0 ? cues[current - 1].text[lang] : ""}</p>
          <p style={{ margin: "8px 0 0", fontSize: "calc(17px * var(--read-scale, 1))", lineHeight: 1.4, fontWeight: 700, color: "#FBF6EE" }}>{cue.text[lang]}</p>
          <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: 1.45, color: "#A8927C" }}>{current < cues.length - 1 ? cues[current + 1].text[lang] : "End of story."}</p>
        </div>
      </section>

      {/* Up next, and a way to the place itself. */}
      <div style={{ margin: "14px 20px 0", display: "flex", gap: "10px" }}>
        {next ? (
          <button type="button" onClick={goNext} style={{ flex: 1, minWidth: 0, padding: "8px", border: "1px solid rgba(251, 246, 238, 0.12)", borderRadius: "16px", background: "rgba(251, 246, 238, 0.05)", color: "#FBF6EE", display: "flex", alignItems: "center", gap: "10px", textAlign: "left", cursor: "pointer" }}>
            <img src={next.img} alt="" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: "#E7B98A" }}>{t("pl.up_next")}</span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "14px", lineHeight: 1.3, fontWeight: 700 }}>{next.title}</span>
            </span>
          </button>
        ) : (
          <Link href="/stories" style={{ flex: 1, minHeight: "60px", padding: "0 14px", border: "1px solid rgba(251, 246, 238, 0.12)", borderRadius: "16px", color: "#FBF6EE", display: "flex", alignItems: "center", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
            {t("pl.library")}
          </Link>
        )}
        <Link href={tr.page} style={{ flex: "0 0 auto", minHeight: "60px", padding: "0 14px", border: "1px solid rgba(251, 246, 238, 0.12)", borderRadius: "16px", color: "#FBF6EE", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
          {t("pl.about")}
        </Link>
      </div>

      {/* Finished: the next story starts by itself after a short countdown. */}
      {done ? (
        <div role="status" className="arrive-card" style={{ position: "fixed", left: "50%", bottom: "16px", width: "min(366px, calc(100vw - 24px))", transform: "translateX(-50%)", zIndex: 30, padding: "14px", borderRadius: "22px", background: "#FBF6EE", color: "#2B1B10", boxShadow: "0 18px 40px rgba(0, 0, 0, 0.45)" }}>
          {next && countdown !== null ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ position: "relative", flex: "0 0 52px" }}>
                  <img src={next.img} alt="" style={{ width: "52px", height: "52px", borderRadius: "14px", objectFit: "cover", display: "block" }} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: "#8A6424" }}>{t("pl.up_next")}</span>
                  <span style={{ display: "block", marginTop: "2px", fontSize: "16px", fontWeight: 800 }}>{next.title}</span>
                  <span style={{ display: "block", marginTop: "1px", fontSize: "13px", color: "#6F5B4B" }}>{t("pl.next_in", { n: countdown })}</span>
                </span>
              </div>
              <div aria-hidden="true" style={{ marginTop: "12px", height: "4px", borderRadius: "999px", background: "#EFE6DA", overflow: "hidden" }}>
                <div data-timer style={{ height: "100%", borderRadius: "999px", background: "#9A4E36", animation: `drain ${COUNTDOWN}s linear forwards` }} />
              </div>
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => setStayed(true)} style={{ flex: 1, height: "46px", border: "1.5px solid #E2D3C1", borderRadius: "14px", background: "#FFFFFF", color: "#2B1B10", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
                  {t("pl.stay")}
                </button>
                <button type="button" onClick={goNext} style={{ flex: 1, height: "46px", border: 0, borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
                  {t("pl.play_now")}
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "50%", background: "#2F7A4A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Tick size={20} />
              </span>
              <span style={{ flex: 1, fontSize: "15px", fontWeight: 800 }}>{next ? tr.title : t("pl.all_done")}</span>
              <Link href="/stories" style={{ height: "40px", padding: "0 14px", borderRadius: "12px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 800, textDecoration: "none" }}>
                {t("pl.library")}
              </Link>
            </div>
          )}
        </div>
      ) : null}

      {/* Chapters */}
      <Sheet open={chaptersOpen} onClose={() => setChaptersOpen(false)} title={t("story.chapters")}>
        {tr.chapters.map((title, i) => (
          <button
            key={title}
            type="button"
            className="sheet-row"
            aria-pressed={cue.ch === i}
            onClick={() => {
              seek(chapterStarts[i]);
              setPlaying(true);
              setChaptersOpen(false);
            }}
          >
            <span>
              {i + 1}. {title}
              <small>{storyDone[i] ? t("lib.listened") : t("lib.chapter", { n: i + 1, total: tr.chapters.length })}</small>
            </span>
            <span aria-hidden="true" style={{ color: storyDone[i] && cue.ch !== i ? "#2F7A4A" : undefined }}>{cue.ch === i ? "▶" : storyDone[i] ? "✓" : ""}</span>
          </button>
        ))}
      </Sheet>
    </div>
  );
}
