"use client";

// 11 · Identify (Heritage Lens) — point, identify, learn. The camera scans for
// a moment, then names what it sees and marks its details with numbered dots;
// the same numbers label the details in the card below.
import { useEffect, useState } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import LensModes from "@/components/LensModes";
import { Tap, Toggle } from "@/components/Tap";
import { AutoDescribe } from "@/components/Prefs";
import { Tick } from "@/components/ui";

const DETAILS = [
  { name: "Palm fronds", note: "The curling leaves are date palms, a favourite motif of Gujarat's stone carvers.", x: 232, y: 214 },
  { name: "One trunk, many branches", note: "Both trees rise from a single stem and fold back on themselves.", x: 150, y: 352 },
];
const SCAN_MS = 1600;

export default function LensScreen() {
  const [scanning, setScanning] = useState(true);
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => {
    if (!scanning) return;
    const id = setTimeout(() => setScanning(false), SCAN_MS);
    return () => clearTimeout(id);
  }, [scanning]);

  return (
    <div style={{ width: "390px", minHeight: "844px", position: "relative", overflow: "hidden", background: "#1E130B", color: "#2B1B10" }}>
      {/* Camera */}
      <div style={{ position: "relative", height: "500px", overflow: "hidden" }}>
        <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="Camera view of the Tree of Life jali" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "26% 50%", display: "block", filter: scanning ? "brightness(0.85)" : "none", transition: "filter 0.4s ease" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "170px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.65) 0%, rgba(20, 12, 6, 0) 100%)" }} />

        {/* The frame the camera is reading, and a scan line while it looks. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "52px", right: "52px", top: "168px", bottom: "40px", borderRadius: "22px", boxShadow: scanning ? "0 0 0 2px rgba(243, 217, 168, 0.9)" : "0 0 0 2px rgba(159, 211, 176, 0.9)", transition: "box-shadow 0.4s ease", overflow: "hidden" }}>
          {scanning ? <span className="scan-line" /> : null}
        </div>

        {/* Numbered details, once identified. */}
        {!scanning
          ? DETAILS.map((d, i) => (
              <button
                key={d.name}
                type="button"
                aria-label={`Detail ${i + 1}: ${d.name}`}
                aria-pressed={pick === i}
                onClick={() => setPick(pick === i ? null : i)}
                className="label-in"
                style={{ position: "absolute", left: `${d.x - 22}px`, top: `${d.y - 22}px`, width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", animationDelay: `${i * 0.12}s` }}
              >
                <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: pick === i ? "#FFFFFF" : "#9A4E36", color: pick === i ? "#9A4E36" : "#FFFFFF", border: "2px solid #FFFFFF", boxShadow: "0 0 0 6px rgba(154, 78, 54, 0.35)", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.2s ease, color 0.2s ease" }}>
                  {i + 1}
                </span>
              </button>
            ))
          : null}

        {/* Top bar and modes */}
        <div style={{ position: "absolute", top: "50px", left: "12px", right: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#FFFFFF" }}>
          <BackLink href="/home" aria-label="Close lens" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(20, 12, 6, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </BackLink>
          <span style={{ fontSize: "16px", fontWeight: 800 }}>Identify</span>
          <Toggle storeKey="prefs" field="flash" onLabel="Flash on" offLabel="Flash off" onToast="Flash on" offToast="Flash off" style={{ width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "rgba(20, 12, 6, 0.45)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            on={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#F3D9A8" stroke="#F3D9A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
              </svg>
            }
            off={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
              </svg>
            }
          />
        </div>
        <LensModes active="lens" style={{ top: "108px" }} />
        {scanning ? (
          <p role="status" className="fade-in" style={{ position: "absolute", left: "50%", bottom: "64px", transform: "translateX(-50%)", margin: 0, height: "36px", padding: "0 14px", borderRadius: "999px", background: "rgba(20, 12, 6, 0.7)", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
            <span className="spin" aria-hidden="true" style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid rgba(255, 255, 255, 0.35)", borderTopColor: "#FFFFFF" }} />
            Point at a building or a detail…
          </p>
        ) : null}
      </div>

      {/* What it is, its details, and what to do next. */}
      {scanning ? null : (
        <section aria-label="Lens result" className="arrive-card" style={{ position: "relative", marginTop: "-24px", borderRadius: "26px 26px 0 0", background: "#FFFFFF", padding: "10px 20px 28px" }}>
          <AutoDescribe text="Identified: the Tree of Life jali at Sidi Saiyyed Mosque. A carved stone screen from around 1573, showing intertwined trees with curling palm fronds." />
          <div style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#E2D3C1", margin: "0 auto" }} />
          <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ height: "26px", padding: "0 10px 0 6px", borderRadius: "999px", background: "#E3F1E7", color: "#2F7A4A", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px" }}>
              <Tick size={14} width={3} />
              Identified
            </span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>Sidi Saiyyed Mosque</span>
            <button type="button" onClick={() => { setPick(null); setScanning(true); }} style={{ marginLeft: "auto", height: "36px", padding: "0 12px", border: "1.5px solid #E2D3C1", borderRadius: "999px", background: "#FFFFFF", color: "#2B1B10", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}>
              Scan again
            </button>
          </div>
          <h1 style={{ margin: "10px 0 0", fontSize: "23px", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.01em" }}>Tree of Life jali</h1>
          <p style={{ margin: "3px 0 0", fontSize: "13px", fontWeight: 600, color: "#6F5B4B" }}>Carved stone screen · c. 1573</p>

          <h2 style={{ margin: "16px 0 0", fontSize: "15px", fontWeight: 800 }}>What you&apos;re seeing</h2>
          <ol style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {DETAILS.map((d, i) => (
              <li key={d.name}>
                <button type="button" aria-pressed={pick === i} onClick={() => setPick(pick === i ? null : i)} style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${pick === i ? "#9A4E36" : "#EFE6DA"}`, borderRadius: "14px", background: pick === i ? "#FBEDE6" : "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "flex-start", gap: "10px", textAlign: "left", cursor: "pointer", transition: "background-color 0.2s ease, border-color 0.2s ease" }}>
                  <span style={{ flex: "0 0 24px", width: "24px", height: "24px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  <span>
                    <span style={{ display: "block", fontSize: "14px", fontWeight: 800 }}>{d.name}</span>
                    <span style={{ display: "block", marginTop: "2px", fontSize: "13px", lineHeight: 1.45, color: "#5A4434" }}>{d.note}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
            <Link href="/story?ch=1" style={{ flex: 1, height: "52px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: 800, textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="7 4 19 12 7 20 7 4" />
              </svg>
              Hear its story · 0:50
            </Link>
            <Toggle storeKey="saved" field="lens-tree" onLabel="Saved to your photo journal. Remove" offLabel="Save to your photo journal" onToast="Saved to your photo journal" offToast="Removed from your journal" style={{ flex: "0 0 52px", width: "52px", height: "52px", border: "1.5px solid #E2D3C1", borderRadius: "14px", background: "#FFFFFF", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              on={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#9A4E36" stroke="#9A4E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              }
              off={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              }
            />
          </div>

          <p style={{ margin: "18px 0 0", fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", color: "#8A6424" }}>ASK VIRASA AI</p>
          <div className="hscroll" style={{ margin: "8px -20px 0", padding: "0 20px", display: "flex", gap: "8px" }}>
            {[
              ["Who carved it?", "Who carved the Tree of Life jali?"],
              ["How was it made?", "How is a stone jali like this made?"],
              ["Similar jalis nearby", "Where can I see similar jalis nearby?"],
            ].map(([label, ask]) => (
              <Tap key={label} ask={ask} style={{ flex: "0 0 auto", height: "44px", padding: "0 14px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#F6F1EA", color: "#2B1B10", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                {label}
              </Tap>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
