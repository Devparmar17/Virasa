"use client";

// 20 · AR time travel
import { useState } from "react";
import Link from "next/link";
import { renderVals } from "./logic";

export default function ARTimeScreen() {
  const [state, setAll] = useState<Record<string, any>>({});
  const setState = (patch: Record<string, any>) => setAll((s) => ({ ...s, ...patch }));
  const v: any = renderVals(state, setState);
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#1E130B", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "620px", overflow: "hidden" }}>
        <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="Camera view of the Tree of Life jali today" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "28% 50%", display: "block" }} />
        <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "28% 50%", display: "block", filter: "sepia(0.85) saturate(1.35) brightness(1.08) contrast(1.05)", clipPath: `inset(0 ${v.rightPct}% 0 0)` }} />
        <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "190px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.65) 0%, rgba(20, 12, 6, 0) 100%)" }} />
        <span aria-hidden="true" style={{ position: "absolute", top: "0", bottom: "0", left: `${v.pos}%`, width: "3px", marginLeft: "-1.5px", background: "#FBF6EE", boxShadow: "0 0 12px rgba(243, 217, 168, 0.8)" }} />
        <span aria-hidden="true" style={{ position: "absolute", top: "360px", left: `${v.pos}%`, width: "48px", height: "48px", marginLeft: "-24px", borderRadius: "50%", background: "#FBF6EE", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(0, 0, 0, 0.35)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18-6-6 6-6" />
            <path d="m15 6 6 6-6 6" />
          </svg>
        </span>
        <span style={{ position: "absolute", left: "14px", top: "160px", height: "30px", padding: "0 12px", borderRadius: "999px", background: "rgba(243, 217, 168, 0.95)", color: "#2B1B10", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center" }}>
          1573 · reconstruction
        </span>
        <span style={{ position: "absolute", right: "14px", top: "160px", height: "30px", padding: "0 12px", borderRadius: "999px", background: "rgba(20, 12, 6, 0.72)", color: "#FFFFFF", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center" }}>
          Today
        </span>
      </div>
      <div style={{ position: "absolute", top: "50px", left: "8px", right: "8px", height: "48px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#FFFFFF" }}>
        <Link href="/lens" aria-label="Close time travel" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(20, 12, 6, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Link>
        <span style={{ fontSize: "16px", fontWeight: "800" }}>
          AR time travel
        </span>
        <span style={{ width: "44px" }} />
      </div>
      <nav aria-label="Lens modes" style={{ position: "absolute", top: "104px", left: "50%", transform: "translateX(-50%)", padding: "4px", borderRadius: "999px", background: "rgba(20, 12, 6, 0.6)", display: "flex", gap: "2px" }}>
        <Link href="/lens" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>
          Identify
        </Link>
        <Link href="/ar" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>
          AR Tour
        </Link>
        <span aria-current="page" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", background: "#FBF6EE", color: "#2B1B10", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
          Time travel
        </span>
      </nav>
      <section aria-label="Time travel controls" style={{ position: "absolute", left: "0", right: "0", top: "596px", bottom: "0", background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "8px 20px 0", boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.25)" }}>
        <div style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#DCCDBA", margin: "0 auto" }} />
        <h1 style={{ margin: "14px 0 0", fontSize: "20px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.01em" }}>
          The Tree of Life, then and now
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: "1.45", color: "#5A4434" }}>
          Slide to compare the screen as it may have looked newly carved with how it stands today.
        </p>
        <label htmlFor="yr" style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", color: "#8A6424" }}>
          <span>
            TRAVEL THROUGH TIME
          </span>
          <span style={{ letterSpacing: "0", color: "#6F5B4B" }}>
            {v.readout}
          </span>
        </label>
        <input id="yr" type="range" min="0" max="100" step="1" value={v.v} onChange={v.onV} style={{ margin: "6px 0 0", width: "100%", height: "28px", accentColor: "#9A4E36", cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "#5A4434" }}>
          <span>
            1573
          </span>
          <span>
            Today
          </span>
        </div>
        <p style={{ margin: "10px 0 0", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6F5B4B" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span>
            {"Artist's reconstruction — details may differ."}
          </span>
          <Link href="/story" style={{ marginLeft: "auto", fontWeight: "700", color: "#9A4E36" }}>
            Hear the story
          </Link>
        </p>
      </section>
    </div>
  );
}
