"use client";

// 19 · AR Tour
import { useEffect, useState } from "react";
import Link from "next/link";
import { Tap } from "@/components/Tap";
import Capture from "@/components/Capture";
import SheetButton from "@/components/SheetButton";
import { renderVals } from "./logic";

const NARRATION =
  "Sarkhej began as the home of the Sufi saint Shaikh Ahmed Khattu, a friend and adviser to Sultan Ahmad Shah, who founded Ahmedabad. When the saint died in 1445, the sultan's successors built this mosque and tomb beside the lake in his honour. It was completed in 1451.";

export default function ARScreen() {
  const [state, setAll] = useState<Record<string, any>>({});
  const setState = (patch: Record<string, any>) => setAll((s) => ({ ...s, ...patch }));
  const v: any = renderVals(state, setState);
  const playing: boolean = v.playing;
  // The narration is spoken by the browser's own voice while "playing".
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    if (!playing) return;
    const u = new SpeechSynthesisUtterance(NARRATION);
    u.lang = "en-IN";
    synth.speak(u);
    return () => synth.cancel();
  }, [playing]);
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#1E130B", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#FFFFFF" }}>
      <img src="/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg" alt="Camera view of Sarkhej Roza" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "55% 45%", display: "block" }} />
      <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "200px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.65) 0%, rgba(20, 12, 6, 0) 100%)" }} />
      <div style={{ position: "absolute", top: "50px", left: "8px", right: "8px", height: "48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/home" aria-label="Close AR Tour" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(20, 12, 6, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Link>
        <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: "800" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7FD69A", boxShadow: "0 0 0 4px rgba(127, 214, 154, 0.25)" }} />
          {" AR Tour "}
        </span>
        <SheetButton title="How AR Tour works" ariaLabel="How AR Tour works" style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "rgba(20, 12, 6, 0.45)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} label={<>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </>}>
          <p>Hold your phone up and walk slowly. Virasa pins each stop to the real building in front of you.</p>
          <p>Gold markers are stops on the tour. The arrows on the ground lead to the next one, and the narration starts by itself when you arrive.</p>
          <p>Look up from the screen when you cross a path — the tour pauses while you move.</p>
        </SheetButton>
      </div>
      <nav aria-label="Lens modes" style={{ position: "absolute", top: "104px", left: "50%", transform: "translateX(-50%)", padding: "4px", borderRadius: "999px", background: "rgba(20, 12, 6, 0.6)", display: "flex", gap: "2px" }}>
        <Link href="/lens" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>
          Identify
        </Link>
        <span aria-current="page" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", background: "#FBF6EE", color: "#2B1B10", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
          AR Tour
        </span>
        <Link href="/ar-time" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>
          Time travel
        </Link>
      </nav>
      <div style={{ position: "absolute", top: "158px", left: "50%", transform: "translateX(-50%)", height: "30px", padding: "0 12px", borderRadius: "999px", background: "rgba(243, 217, 168, 0.95)", color: "#2B1B10", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
        <span>
          Stop 1 of 4
        </span>
        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#2B1B10" }} />
        <span>
          Sarkhej Roza
        </span>
      </div>
      <div style={{ position: "absolute", left: "112px", top: "206px", width: "214px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", padding: "10px 12px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.95)", color: "#2B1B10", boxShadow: "0 10px 24px rgba(0, 0, 0, 0.3)", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ flex: "0 0 36px", width: "36px", height: "36px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" x2="21" y1="22" y2="22" />
              <line x1="6" x2="6" y1="18" y2="11" />
              <line x1="10" x2="10" y1="18" y2="11" />
              <line x1="14" x2="14" y1="18" y2="11" />
              <line x1="18" x2="18" y1="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <span style={{ fontSize: "14px", fontWeight: "800" }}>
              The grand mosque
            </span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
              Completed 1451 · narrating now
            </span>
          </span>
        </div>
        <span aria-hidden="true" style={{ width: "2px", height: "44px", background: "rgba(255, 255, 255, 0.9)" }} />
        <span aria-hidden="true" style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 0 0 6px rgba(255, 255, 255, 0.3), 0 0 0 12px rgba(255, 255, 255, 0.12)" }} />
      </div>
      <div style={{ position: "absolute", left: "18px", top: "400px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ padding: "8px 12px", borderRadius: "14px", background: "rgba(20, 12, 6, 0.72)", border: "1px solid rgba(255, 255, 255, 0.25)", display: "flex", flexDirection: "column", gap: "1px" }}>
          <span style={{ fontSize: "13px", fontWeight: "800" }}>
            {"Ahmed Khattu's tomb"}
          </span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#E7D3B5" }}>
            Next stop · 40 m
          </span>
        </div>
        <span aria-hidden="true" style={{ marginLeft: "24px", width: "2px", height: "30px", background: "rgba(255, 255, 255, 0.8)" }} />
        <span aria-hidden="true" style={{ marginLeft: "18px", width: "14px", height: "14px", borderRadius: "50%", background: "#F3D9A8", boxShadow: "0 0 0 5px rgba(243, 217, 168, 0.3)" }} />
      </div>
      <Tap toastText="The stepped tank is stop 3, 90 m ahead — keep following the arrows." style={{ position: "absolute", right: "0", top: "330px", height: "40px", padding: "0 8px 0 12px", border: "0", borderRadius: "999px 0 0 999px", background: "rgba(20, 12, 6, 0.72)", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
        {" Stepped tank · 90 m "}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Tap>
      <svg aria-hidden="true" width="390" height="190" viewBox="0 0 390 190" style={{ position: "absolute", left: "0", top: "436px" }}>
        <g fill="none" stroke="#F3D9A8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="160 54 195 34 230 54" strokeWidth="6" opacity="0.55" />
          <polyline points="148 100 195 74 242 100" strokeWidth="8" opacity="0.75" />
          <polyline points="132 156 195 120 258 156" strokeWidth="11" opacity="0.95" />
        </g>
      </svg>
      <section aria-label="Tour narration" style={{ position: "absolute", left: "12px", right: "12px", bottom: "26px", padding: "14px", borderRadius: "24px", background: "rgba(30, 19, 11, 0.86)", border: "1px solid rgba(255, 255, 255, 0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button type="button" aria-label={v.playLabel} onClick={v.togglePlay} style={{ flex: "0 0 48px", width: "48px", height: "48px", border: "0", borderRadius: "50%", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {v.playing ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </>
            ) : null}
            {v.paused ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                  <polygon points="7 4 19 12 7 20 7 4" />
                </svg>
              </>
            ) : null}
          </button>
          <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "15px", fontWeight: "800" }}>
              Why Sarkhej was built
            </span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#E7D3B5" }}>
              For the Sufi saint Ahmed Khattu · 0:48 / 2:10
            </span>
          </span>
        </div>
        <div style={{ marginTop: "12px", height: "4px", borderRadius: "999px", background: "rgba(251, 246, 238, 0.2)" }}>
          <div style={{ width: "37%", height: "100%", borderRadius: "999px", background: "#F3D9A8" }} />
        </div>
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/explore" style={{ width: "76px", height: "48px", borderRadius: "14px", background: "rgba(251, 246, 238, 0.1)", color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", fontSize: "11px", fontWeight: "700", textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </svg>
            <span>
              Map
            </span>
          </Link>
          <Capture style={{ width: "64px", height: "64px", borderRadius: "50%", border: "4px solid #FFFFFF", background: "transparent", padding: "4px", cursor: "pointer" }}>
            <span style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: "#FFFFFF" }} />
          </Capture>
          <SheetButton title="Tour stops" ariaLabel="All 4 tour stops" style={{ width: "76px", height: "48px", border: "0", borderRadius: "14px", background: "rgba(251, 246, 238, 0.1)", color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }} label={<>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            <span>
              Stops
            </span>
          </>}>
            <p>Sarkhej Roza · 4 stops · about 25 minutes</p>
            {[
              ["1", "The grand mosque", "You are here · narrating now"],
              ["2", "Ahmed Khattu's tomb", "40 m · the saint's domed mausoleum"],
              ["3", "The stepped tank", "90 m · the lake the complex is built around"],
              ["4", "The royal pavilions", "160 m · where the sultans spent their summers"],
            ].map(([n, name, note]) => (
              <div key={n} className="sheet-row" aria-current={n === "1" ? "step" : undefined} style={{ cursor: "default", borderColor: n === "1" ? "#9A4E36" : undefined, background: n === "1" ? "#FBF1DE" : undefined }}>
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span aria-hidden="true" style={{ flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: n === "1" ? "#9A4E36" : "#2B1B10", color: "#FFFFFF", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
                  <span>
                    {name}
                    <small>{note}</small>
                  </span>
                </span>
              </div>
            ))}
          </SheetButton>
        </div>
        <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: "12px", color: "#C9B6A0" }}>
          Follow the arrows · look up when crossing paths
        </p>
      </section>
    </div>
  );
}
