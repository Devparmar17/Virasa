"use client";

// 23 · Jali puzzle (playable)
import { useState, Fragment } from "react";
import Link from "next/link";
import { Confetti, Tick } from "@/components/ui";
import BackLink from "@/components/Back";
import { renderVals } from "./logic";
import { useStored } from "@/lib/store";
import { useT } from "@/lib/i18n";

export default function PuzzleScreen() {
  const t = useT();
  const [state, setAll] = useState<Record<string, any>>({});
  const [, setPoints] = useStored<number>("points", 0);
  const setState = (patch: Record<string, any>) => {
    // Solving the puzzle earns 20 points, once per solve.
    const was = (state.board as number[] | undefined)?.every((n, i) => n === i);
    const now = (patch.board as number[] | undefined)?.every((n, i) => n === i);
    if (now && !was) setPoints((p) => p + 20);
    setAll((s) => ({ ...s, ...patch }));
  };
  const v: any = renderVals(state, setState);
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "var(--paper)", fontFamily: "inherit", color: "var(--ink)" }}>
      <div style={{ padding: "54px 16px 0 8px", height: "98px", display: "flex", alignItems: "center", gap: "8px" }}>
        <BackLink href="/games" aria-label={t("pz.back")} style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </BackLink>
        <h1 style={{ flex: "1", margin: "0", fontSize: "18px", fontWeight: "800" }}>
          {t("gm.puzzle")}
        </h1>
        <span role="status" style={{ height: "32px", padding: "0 12px", borderRadius: "999px", background: "var(--sand)", color: "var(--gold-deep)", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
          <span>
            {v.moves}
          </span>
          <span>
            {t("pz.moves")}
          </span>
        </span>
      </div>
      <p style={{ margin: "8px 24px 0", fontSize: "15px", lineHeight: "1.45", color: "var(--ink-soft)" }}>
        {t("pz.how")}
      </p>
      <div style={{ position: "relative", margin: "18px auto 0", width: "340px", padding: "8px", borderRadius: "20px", background: "var(--ink)", boxShadow: "0 14px 30px rgba(43, 27, 16, 0.25)" }}>
        <div role="group" aria-label={t("pz.board")} style={{ width: "324px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {v.cells.map((c: any, i: number) => (
            <Fragment key={i}>
              <button type="button" onClick={c.move} disabled={c.empty} aria-label={c.label} style={{ position: "relative", width: "104px", height: "104px", padding: "0", border: "0", borderRadius: "10px", overflow: "hidden", background: c.bg, outline: `3px solid ${c.ring}`, outlineOffset: "-3px", cursor: c.cursor }}>
                <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ display: "block", width: "324px", height: "324px", maxWidth: "none", objectFit: "cover", marginLeft: c.ml, marginTop: c.mt, opacity: c.op }} />
                <span style={{ position: "absolute", left: "6px", top: "6px", width: "22px", height: "22px", borderRadius: "50%", background: "rgba(20, 12, 6, 0.78)", color: "var(--paper)", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", opacity: c.numOp }}>
                  {c.num}
                </span>
              </button>
            </Fragment>
          ))}
        </div>
        {v.peek ? (
          <>
            <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="The finished picture" style={{ position: "absolute", left: "8px", top: "8px", width: "324px", height: "324px", objectFit: "cover", borderRadius: "10px", display: "block" }} />
          </>
        ) : null}
      </div>
      <div style={{ margin: "16px 24px 0", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
        <button type="button" aria-pressed={v.nums} onClick={v.toggleNums} style={{ height: "44px", borderRadius: "12px", border: `1.5px solid ${v.numsBd}`, background: v.numsBg, color: v.numsFg, fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          {t("pz.numbers")}
        </button>
        <button type="button" aria-pressed={v.peek} onClick={v.togglePeek} style={{ height: "44px", borderRadius: "12px", border: `1.5px solid ${v.peekBd}`, background: v.peekBg, color: v.peekFg, fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          {t("pz.peek")}
        </button>
        <button type="button" onClick={v.reset} style={{ height: "44px", borderRadius: "12px", border: "1.5px solid var(--line-strong)", background: "var(--paper)", color: "var(--ink)", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          {t("pz.restart")}
        </button>
      </div>
      {v.solved ? (
        <>
          <div role="status" className="rise" style={{ margin: "16px 24px 0", padding: "14px", borderRadius: "16px", background: "var(--green-tint)", border: "1px solid var(--green)", display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="success-badge" style={{ position: "relative", flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "50%", background: "var(--green)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Tick size={20} />
              <Confetti count={14} spread={70} />
            </span>
            <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800", color: "#1F5C36" }}>
                {t("pz.solved", { n: v.moves })}
              </span>
              <span style={{ fontSize: "13px", color: "var(--ink)" }}>
                {t("pz.hear")}
              </span>
            </span>
            <Link href="/story" style={{ height: "44px", padding: "0 12px", borderRadius: "12px", background: "var(--green)", color: "var(--paper)", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "700" }}>
              {t("trip.listen")}
            </Link>
          </div>
        </>
      ) : null}
      {v.unsolved ? (
        <>
          <div style={{ margin: "16px 24px 0", padding: "14px", borderRadius: "16px", background: "var(--paper)", border: "1px solid var(--line)", display: "flex", gap: "10px", fontSize: "13px", lineHeight: "1.45", color: "var(--ink-soft)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A6424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 18px", marginTop: "1px" }}>
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
            <span>
              {t("pz.tip")}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}
