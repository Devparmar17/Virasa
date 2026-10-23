"use client";

// 22 · Heritage quiz (playable)
import { useState, Fragment } from "react";
import Link from "next/link";
import { Confetti } from "@/components/ui";
import BackLink from "@/components/Back";
import { renderVals } from "./logic";

export default function QuizScreen() {
  const [state, setAll] = useState<Record<string, any>>({});
  const setState = (patch: Record<string, any>) => setAll((s) => ({ ...s, ...patch }));
  const v: any = renderVals(state, setState);
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ padding: "54px 16px 0 8px", height: "98px", display: "flex", alignItems: "center", gap: "8px" }}>
        <BackLink href="/games" aria-label="Close quiz" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </BackLink>
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#6F5B4B" }}>
            {v.stepLabel}
          </span>
          <span style={{ height: "6px", borderRadius: "999px", background: "#EFE6DA", overflow: "hidden" }}>
            <span style={{ display: "block", width: `${v.pct}%`, height: "100%", borderRadius: "999px", background: "#9A4E36" }} />
          </span>
        </div>
        <span style={{ height: "32px", padding: "0 12px", borderRadius: "999px", background: "#F6EEE4", color: "#6E4E1E", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#C8902B" stroke="none" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>
            {v.score}{" / 3"}
          </span>
        </span>
      </div>
      {v.playing ? (
        <>
          <div>
            <div style={{ margin: "16px 20px 0", position: "relative", height: "160px", borderRadius: "18px", overflow: "hidden" }}>
              <img src="/images/358cd23211709da539c3303890c27e8b.jpg" alt="The Tree of Life jali at Sidi Saiyyed Mosque" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <span style={{ position: "absolute", left: "10px", top: "10px", height: "26px", padding: "0 10px", borderRadius: "999px", background: "rgba(43, 27, 16, 0.8)", color: "#F3D9A8", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center" }}>
                Sidi Saiyyed Mosque
              </span>
            </div>
            <h1 style={{ margin: "18px 20px 0", fontSize: "22px", lineHeight: "1.25", fontWeight: "800", letterSpacing: "-0.01em", textWrap: "balance" }}>
              {v.question}
            </h1>
            <div role="group" aria-label="Answers" style={{ margin: "16px 20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
              {v.opts.map((o: any, i: number) => (
                <Fragment key={i}>
                  <button type="button" onClick={o.pick} aria-pressed={o.chosen} className={o.showCheck ? "ans-right" : o.showX ? "ans-wrong" : undefined} style={{ minHeight: "56px", padding: "8px 14px 8px 10px", borderRadius: "14px", border: `1.5px solid ${o.bd}`, background: o.bg, color: o.fg, display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: "700", textAlign: "left", cursor: "pointer" }}>
                    <span style={{ flex: "0 0 32px", width: "32px", height: "32px", borderRadius: "50%", background: o.lbg, color: o.lfg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800" }}>
                      {o.letter}
                    </span>
                    <span style={{ flex: "1" }}>
                      {o.label}
                    </span>
                    {o.showCheck ? (
                      <>
                        <svg className="check-draw" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F7A4A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-label="Correct answer">
                          <path pathLength={1} d="M20 6 9 17l-5-5" />
                        </svg>
                      </>
                    ) : null}
                    {o.showX ? (
                      <>
                        <svg className="pop-in" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B3402A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-label="Your answer, incorrect">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </>
                    ) : null}
                  </button>
                </Fragment>
              ))}
            </div>
            {v.picked ? (
              <>
                <div role="status" className="rise" style={{ margin: "14px 20px 0", padding: "14px", borderRadius: "14px", background: v.fbBg, border: `1px solid ${v.fbBd}` }}>
                  <p style={{ margin: "0", fontSize: "15px", fontWeight: "800", color: v.fbFg }}>
                    {v.fbTitle}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", lineHeight: "1.45", color: "#2B1B10" }}>
                    {v.fbText}
                  </p>
                </div>
              </>
            ) : null}
            <div style={{ position: "absolute", left: "20px", right: "20px", bottom: "30px" }}>
              {v.picked ? (
                <>
                  <button type="button" onClick={v.next} className="pop-in" style={{ width: "100%", height: "56px", border: "0", borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.28)" }}>
                    {v.nextLabel}
                  </button>
                </>
              ) : null}
              {v.notPicked ? (
                <>
                  <button type="button" disabled={true} style={{ width: "100%", height: "56px", border: "0", borderRadius: "16px", background: "#EFE6DA", color: "#5A4434", fontSize: "16px", fontWeight: "700" }}>
                    Pick an answer
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
      {v.done ? (
        <>
          <div style={{ padding: "40px 28px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div className="success-badge" style={{ position: "relative", width: "150px", height: "150px", borderRadius: "50%", background: "#2B1B10", color: "#FBF6EE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "6px solid #F3D9A8" }}>
              <span style={{ fontSize: "44px", lineHeight: "1", fontWeight: "800" }}>
                {v.score}/3
              </span>
              <span style={{ marginTop: "6px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#E7B98A" }}>
                CORRECT
              </span>
              {v.score >= 2 ? <Confetti count={20} spread={120} /> : null}
            </div>
            <h1 style={{ margin: "26px 0 0", fontSize: "26px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.02em" }}>
              {v.resultTitle}
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#5A4434" }}>
              +{v.points}{" points added to your heritage passport."}
            </p>
            <div style={{ marginTop: "18px", padding: "12px 16px", borderRadius: "16px", background: "#F6F1EA", border: "1px solid #EFE6DA", display: "flex", alignItems: "center", gap: "12px", textAlign: "left" }}>
              <span style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", background: "#8A6424", border: "2px dashed #F3D9A8", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "14px", fontWeight: "800" }}>
                  60 pts to your next stamp
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  Gujarat gold stamp at 300 pts
                </span>
              </span>
            </div>
          </div>
          <div style={{ position: "absolute", left: "20px", right: "20px", bottom: "30px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href="/games" style={{ height: "56px", borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", textDecoration: "none" }}>
              More games
            </Link>
            <button type="button" onClick={v.reset} style={{ height: "52px", borderRadius: "16px", border: "1.5px solid #9A4E36", background: "#FFFFFF", color: "#9A4E36", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
              Play again
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
