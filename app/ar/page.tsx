"use client";

// 19 · AR Tour — a guided walk round Sarkhej Roza, one stop at a time. Each
// stop is narrated; when its narration ends the stop is ticked off, and "Next
// stop" leads on. Finished stops are remembered.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import Capture from "@/components/Capture";
import LensModes from "@/components/LensModes";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { SuccessBadge, Tick } from "@/components/ui";
import { useStored } from "@/lib/store";
import { useT } from "@/lib/i18n";

type Stop = { name: string; note: string; dist: number; seconds: number; text: string };

const STOPS: Stop[] = [
  {
    name: "The grand mosque",
    note: "Completed 1451, with no arches on its face and no minarets",
    dist: 0,
    seconds: 26,
    text: "Sarkhej began as the home of the Sufi saint Shaikh Ahmed Khattu, a friend and adviser to Sultan Ahmad Shah, who founded Ahmedabad. When the saint died in 1445, the sultan's successors built this mosque beside his tomb, a wide court of slender columns finished in 1451.",
  },
  {
    name: "Ahmed Khattu's tomb",
    note: "One of the largest mausoleums in Gujarat",
    dist: 40,
    seconds: 18,
    text: "This is the saint's tomb, one of the largest in Gujarat. Inside, pierced metal screens ring the grave, and light falls through stone jalis on every side.",
  },
  {
    name: "The stepped tank",
    note: "The lake the whole complex is built around",
    dist: 90,
    seconds: 18,
    text: "The stepped tank is the heart of Sarkhej. After the monsoon it fills to the brim, and by summer it is dry. Every building opens toward it, so the breeze off the water moves through them all.",
  },
  {
    name: "The royal pavilions",
    note: "Where the sultans came for the cool of the water",
    dist: 160,
    seconds: 16,
    text: "Sultan Mahmud Begada and his queen lie in pavilions that open onto the water. Later sultans came here to escape the summer heat of the city.",
  },
];

const glass: CSSProperties = { background: "rgba(20, 12, 6, 0.55)", WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" };
const round: CSSProperties = { ...glass, width: "44px", height: "44px", border: 0, borderRadius: "50%", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };

export default function ARScreen() {
  const t = useT();
  const [stop, setStop] = useState(0);
  const [done, setDone] = useStored<Record<number, boolean>>("arDone", {});
  const [playing, setPlaying] = useState(true);
  const [heard, setHeard] = useState(0); // seconds of this stop's narration heard
  const [help, setHelp] = useState(false);
  const [stopsOpen, setStopsOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const s = STOPS[stop];
  const last = stop === STOPS.length - 1;
  const complete = heard >= s.seconds;
  const doneCount = STOPS.filter((_, i) => done[i]).length;

  // Narration: the browser's voice reads the stop; the bar follows the stop's running time.
  const spoken = useRef(-1);
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!playing || complete) {
      synth?.cancel();
      spoken.current = -1;
      return;
    }
    if (synth && spoken.current !== stop) {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(s.text);
      u.lang = "en-IN";
      synth.speak(u);
      spoken.current = stop;
    }
    const id = setInterval(() => setHeard((h) => Math.min(s.seconds, h + 0.25)), 250);
    return () => clearInterval(id);
  }, [playing, complete, stop, s]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  // A stop is ticked off when its narration has been heard to the end.
  useEffect(() => {
    if (complete && !done[stop]) {
      setDone((d) => ({ ...d, [stop]: true }));
      toast(t("ar.done_toast", { n: stop + 1, name: s.name }), "success");
    }
  }, [complete, done, stop, s.name, setDone, t]);

  const goTo = (i: number) => {
    window.speechSynthesis?.cancel();
    spoken.current = -1;
    setStop(i);
    setHeard(0);
    setPlaying(true);
    setStopsOpen(false);
    setFinished(false);
  };
  const next = () => {
    if (!done[stop]) setDone((d) => ({ ...d, [stop]: true }));
    if (last) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
      setFinished(true);
    } else goTo(stop + 1);
  };

  return (
    <div style={{ width: "390px", height: "min(844px, 100dvh)", minHeight: "680px", position: "relative", overflow: "hidden", background: "var(--night)", color: "var(--paper)" }}>
      <img src="/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg" alt="Camera view of Sarkhej Roza" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "55% 45%", display: "block" }} />
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "220px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.7) 0%, rgba(20, 12, 6, 0) 100%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "380px", background: "linear-gradient(0deg, rgba(20, 12, 6, 0.85) 0%, rgba(20, 12, 6, 0) 100%)" }} />

      {/* Top: close, what this is, and help. */}
      <div style={{ position: "absolute", top: "50px", left: "12px", right: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <BackLink href="/home" aria-label="Close" style={round}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </BackLink>
        <span style={{ textAlign: "center" }}>
          <span style={{ display: "block", fontSize: "16px", fontWeight: 800 }}>{t("lm.ar")}</span>
          <span style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#E7D3B5" }}>Sarkhej Roza · {t("ar.of_done", { d: doneCount, n: STOPS.length })}</span>
        </span>
        <button type="button" aria-label={t("ar.how")} onClick={() => setHelp(true)} style={round}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </button>
      </div>

      {/* Mode switch. */}
      <LensModes active="ar" style={{ top: "108px" }} />

      {/* Progress: one segment per stop; finished ones are ticked. */}
      <ol aria-label={t("ar.progress")} style={{ listStyle: "none", position: "absolute", top: "162px", left: "40px", right: "40px", margin: 0, padding: 0, display: "flex", alignItems: "center", gap: "6px" }}>
        {STOPS.map((x, i) => (
          <li key={x.name} aria-current={i === stop ? "step" : undefined} style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
            <button type="button" aria-label={`${t("ar.stop_aria", { n: i + 1, name: x.name })}${done[i] ? `, ${t("ar.done")}` : ""}`} onClick={() => goTo(i)} style={{ flex: "0 0 40px", width: "40px", height: "40px", border: i === stop ? "2px solid var(--paper)" : 0, borderRadius: "50%", background: done[i] ? "var(--green)" : i === stop ? "var(--clay)" : "rgba(20, 12, 6, 0.6)", color: "var(--paper)", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background-color 0.3s ease" }}>
              {done[i] ? <Tick size={14} width={3.2} /> : i + 1}
            </button>
            {i < STOPS.length - 1 ? <span aria-hidden="true" style={{ flex: 1, height: "3px", borderRadius: "999px", background: done[i] ? "var(--green-light)" : "rgba(255, 255, 255, 0.3)", transition: "background-color 0.3s ease" }} /> : null}
          </li>
        ))}
      </ol>

      {/* In the scene: the stop you are at, and which way the next one is. */}
      <div key={`here-${stop}`} className="label-in" style={{ position: "absolute", left: "50%", top: "236px", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ padding: "10px 14px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.96)", color: "var(--ink)", boxShadow: "0 10px 24px rgba(0, 0, 0, 0.3)", display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
          <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--clay)", color: "var(--paper)", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{stop + 1}</span>
          <span>
            <span style={{ display: "block", fontSize: "15px", fontWeight: 800 }}>{s.name}</span>
            <span style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ink-muted)" }}>{stop === 0 ? t("ct.here") : t("ar.from_gate", { n: s.dist })}</span>
          </span>
        </span>
        <span aria-hidden="true" style={{ width: "2px", height: "56px", background: "rgba(255, 255, 255, 0.85)" }} />
        <span aria-hidden="true" style={{ width: "14px", height: "14px", borderRadius: "50%", background: "var(--paper)", boxShadow: "0 0 0 6px rgba(255, 255, 255, 0.25)" }} />
      </div>

      {/* Bottom: the stop's narration and one clear next step. */}
      <section aria-label={t("ar.narration")} style={{ position: "absolute", left: "12px", right: "12px", bottom: "20px", padding: "16px", borderRadius: "24px", background: "rgba(30, 19, 11, 0.92)", WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div key={`card-${stop}`} className="fade-in" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            type="button"
            aria-label={playing && !complete ? t("ar.pause") : complete ? t("ar.play_again") : t("ar.play")}
            onClick={() => {
              if (complete) {
                spoken.current = -1;
                setHeard(0);
                setPlaying(true);
              } else setPlaying(!playing);
            }}
            style={{ flex: "0 0 52px", width: "52px", height: "52px", border: 0, borderRadius: "50%", background: complete ? "var(--green)" : "var(--gold-light)", color: complete ? "var(--paper)" : "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background-color 0.3s ease" }}
          >
            {complete ? (
              <Tick size={22} width={3} />
            ) : playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="7 4 19 12 7 20 7 4" />
              </svg>
            )}
          </button>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: complete ? "var(--green-light)" : "var(--gold-on-dark)" }}>
              {complete ? t("ar.stop_done").toUpperCase() : playing ? (
                <>
                  <span className="eq" aria-hidden="true" style={{ height: "10px" }}>
                    <i />
                    <i />
                    <i />
                  </span>
                  {t("ar.playing").toUpperCase()}
                </>
              ) : t("ar.paused").toUpperCase()}{" "}
              · {t("ar.step", { n: stop + 1, total: STOPS.length }).toUpperCase()}
            </span>
            <span style={{ display: "block", marginTop: "3px", fontSize: "17px", fontWeight: 800 }}>{s.name}</span>
            <span style={{ display: "block", marginTop: "1px", fontSize: "13px", color: "var(--sand-on-dark)" }}>{s.note}</span>
          </span>
        </div>
        <div role="progressbar" aria-label={t("ar.narration")} aria-valuemin={0} aria-valuemax={s.seconds} aria-valuenow={Math.round(heard)} style={{ marginTop: "12px", height: "4px", borderRadius: "999px", background: "rgba(251, 246, 238, 0.2)", overflow: "hidden" }}>
          <div style={{ width: `${(heard / s.seconds) * 100}%`, height: "100%", borderRadius: "999px", background: complete ? "var(--green-light)" : "var(--gold-light)", transition: "width 0.25s linear" }} />
        </div>
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
          <button type="button" aria-label={t("ar.all_stops")} onClick={() => setStopsOpen(true)} style={{ flex: "0 0 52px", width: "52px", height: "52px", border: 0, borderRadius: "16px", background: "rgba(251, 246, 238, 0.1)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
          </button>
          <button type="button" onClick={next} style={{ flex: 1, height: "52px", border: 0, borderRadius: "16px", background: complete ? "var(--gold-light)" : "rgba(251, 246, 238, 0.14)", color: complete ? "var(--ink)" : "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: 800, cursor: "pointer", transition: "background-color 0.3s ease, color 0.3s ease" }}>
            {last ? t("ar.finish") : t("ar.next", { name: STOPS[stop + 1].name })}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <Capture style={{ flex: "0 0 52px", width: "52px", height: "52px", borderRadius: "50%", border: "3px solid var(--paper)", background: "transparent", padding: "3px", cursor: "pointer" }}>
            <span style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </span>
          </Capture>
        </div>
      </section>

      {/* Finished. */}
      {finished ? (
        <div role="dialog" aria-modal="true" aria-labelledby="tour-done" style={{ position: "absolute", inset: 0, zIndex: 40, display: "flex", alignItems: "flex-end" }}>
          <div className="fade-in" style={{ position: "absolute", inset: 0, background: "rgba(20, 12, 6, 0.55)" }} />
          <div className="arrive-card" style={{ position: "relative", width: "100%", padding: "32px 22px 28px", borderRadius: "28px 28px 0 0", background: "var(--paper)", color: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <SuccessBadge size={76} />
            <h2 id="tour-done" style={{ margin: "16px 0 0", fontSize: "24px", fontWeight: 800 }}>{t("ar.complete")}</h2>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--ink-muted)" }}>You saw all {STOPS.length} stops at Sarkhej Roza.</p>
            <Link href="/explore" style={{ marginTop: "18px", width: "100%", height: "52px", borderRadius: "16px", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, textDecoration: "none" }}>
              {t("ar.back_map")}
            </Link>
            <button type="button" onClick={() => goTo(0)} style={{ marginTop: "10px", width: "100%", height: "50px", borderRadius: "16px", border: "1.5px solid var(--line-strong)", background: "var(--paper)", color: "var(--ink)", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>
              {t("ar.restart")}
            </button>
          </div>
        </div>
      ) : null}

      <Sheet open={help} onClose={() => setHelp(false)} title={t("ar.how")}>
        {[
          ["1", t("ar.h1"), t("ar.h1s")],
          ["2", t("trip.listen"), t("ar.h2s")],
          ["3", t("ar.h3"), t("ar.h3s")],
        ].map(([n, title, body]) => (
          <div key={n} style={{ display: "flex", gap: "12px", padding: "8px 0" }}>
            <span style={{ flex: "0 0 30px", width: "30px", height: "30px", borderRadius: "50%", background: "var(--sand)", color: "var(--clay-deep)", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
            <span>
              <span style={{ display: "block", fontSize: "15px", fontWeight: 800, color: "var(--ink)" }}>{title}</span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "14px", lineHeight: 1.45, color: "var(--ink-soft)" }}>{body}</span>
            </span>
          </div>
        ))}
        <button type="button" className="sheet-cta" onClick={() => setHelp(false)}>
          {t("ar.got")}
        </button>
      </Sheet>

      <Sheet open={stopsOpen} onClose={() => setStopsOpen(false)} title={t("ar.stops")}>
        <p>
          Sarkhej Roza · {t("ar.summary", { n: STOPS.length, d: doneCount })}
        </p>
        {STOPS.map((x, i) => (
          <button key={x.name} type="button" className="sheet-row" aria-pressed={i === stop} onClick={() => goTo(i)}>
            <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span aria-hidden="true" style={{ flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: done[i] ? "var(--green)" : i === stop ? "var(--clay)" : "var(--ink)", color: "var(--paper)", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {done[i] ? <Tick size={14} width={3.2} /> : i + 1}
              </span>
              <span>
                {x.name}
                <small>{done[i] ? t("ar.done") : i === stop ? t("ct.here") : t("ar.from_gate", { n: x.dist })}</small>
              </span>
            </span>
          </button>
        ))}
      </Sheet>
    </div>
  );
}
