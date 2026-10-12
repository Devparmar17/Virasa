"use client";

// Choose a city — where you are now, and packs for where you're going.
import { useState } from "react";
import Link from "next/link";
import GeoLink from "@/components/GeoLink";
import { toast } from "@/components/Toast";
import { useAsk } from "@/components/Tap";
import { frame, ScreenHeader } from "@/components/ui";
import { useStored } from "@/lib/store";

type City = { id: string; name: string; tag: string; mb: number; trip?: string };

const CITIES: City[] = [
  { id: "jaipur", name: "Jaipur", tag: "Rajasthan · forts & bazaars", mb: 112, trip: "Your trip · in 12 days" },
  { id: "varanasi", name: "Varanasi", tag: "Uttar Pradesh · ghats", mb: 94 },
  { id: "hampi", name: "Hampi", tag: "Karnataka · Vijayanagara ruins", mb: 78 },
  { id: "kolkata", name: "Kolkata", tag: "West Bengal · colonial lanes", mb: 126 },
  { id: "delhi", name: "Delhi", tag: "Seven cities in one", mb: 148 },
  { id: "udaipur", name: "Udaipur", tag: "Rajasthan · lakes & palaces", mb: 71 },
  { id: "mysuru", name: "Mysuru", tag: "Karnataka · palaces & silk", mb: 66 },
  { id: "kochi", name: "Kochi", tag: "Kerala · spice port", mb: 59 },
];

export default function CityScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [packs, setPacks] = useStored<Record<string, boolean>>("packs", {});
  const ask = useAsk();
  const needle = query.trim().toLowerCase();
  const list = CITIES.filter((c) => !needle || `${c.name} ${c.tag}`.toLowerCase().includes(needle));

  const download = (c: City) => {
    if (packs[c.id]) {
      setPacks((p) => ({ ...p, [c.id]: false }));
      toast(`${c.name} pack removed`);
      return;
    }
    setLoading(c.id);
    setTimeout(() => {
      setPacks((p) => ({ ...p, [c.id]: true }));
      setLoading(null);
      toast(`${c.name} pack ready — ${c.mb} MB`);
    }, 2200);
  };

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader title="Choose a city" back="/home" />
      <div style={{ padding: "0 20px" }}>
        <label style={{ height: "52px", padding: "0 14px", borderRadius: "16px", background: "#FFFFFF", border: "1.5px solid #D9C7B3", display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input type="search" aria-label="Search cities" placeholder="Search cities" value={query} onChange={(e) => setQuery(e.target.value)} style={{ flex: 1, minWidth: 0, height: "44px", border: 0, outline: "none", background: "transparent", fontSize: "16px", color: "#2B1B10" }} />
        </label>

        <GeoLink style={{ marginTop: "10px", height: "52px", padding: "0 14px", borderRadius: "16px", background: "#E3EEF8", color: "#1F5A93", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: 700 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="2" x2="5" y1="12" y2="12" />
            <line x1="19" x2="22" y1="12" y2="12" />
            <line x1="12" x2="12" y1="2" y2="5" />
            <line x1="12" x2="12" y1="19" y2="22" />
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Use my current location
        </GeoLink>

        <h2 style={{ margin: "24px 0 8px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#8A6424" }}>YOU ARE HERE</h2>
        <Link href="/home" style={{ padding: "16px", borderRadius: "18px", background: "#2B1B10", color: "#FBF6EE", display: "flex", alignItems: "center", gap: "14px" }}>
          <span className="pulse" aria-hidden="true" style={{ flex: "0 0 14px", width: "14px", height: "14px", borderRadius: "50%", background: "#9FD3B0" }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: "18px", fontWeight: 800 }}>Ahmedabad, Old City</span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "13px", color: "#D9C6AE" }}>Gujarat · 42 places, 30 stories, 2 walks</span>
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9FD3B0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </Link>

        <h2 style={{ margin: "24px 0 4px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#8A6424" }}>PLAN YOUR NEXT CITY</h2>
        <p style={{ margin: "0 0 10px", fontSize: "13px", lineHeight: 1.45, color: "#5A4434" }}>Download a pack before you travel, or ask the guide what to see.</p>
        {list.length ? (
          <ul className="stagger" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {list.map((c) => {
              const have = !!packs[c.id];
              const busy = loading === c.id;
              return (
                <li key={c.id} style={{ padding: "12px 12px 12px 14px", borderRadius: "16px", background: "#FFFFFF", border: `1px solid ${have ? "#BFDCC8" : "#EADFD2"}`, overflow: "hidden", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button type="button" onClick={() => ask(`What should I see in ${c.name}? Plan me a first day.`)} style={{ flex: 1, minWidth: 0, padding: 0, border: 0, background: "none", color: "#2B1B10", textAlign: "left", cursor: "pointer" }}>
                      <span style={{ display: "block", fontSize: "16px", fontWeight: 800 }}>{c.name}</span>
                      <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>{c.tag}</span>
                      {c.trip ? <span style={{ display: "inline-flex", marginTop: "6px", height: "24px", padding: "0 8px", borderRadius: "7px", background: "#F5E6CC", color: "#6E4E1E", fontSize: "12px", fontWeight: 700, alignItems: "center" }}>{c.trip}</span> : null}
                    </button>
                    <button type="button" disabled={busy} aria-label={have ? `Remove ${c.name} pack` : `Download ${c.name} pack, ${c.mb} megabytes`} onClick={() => download(c)} style={{ flex: "0 0 auto", minWidth: "104px", height: "44px", padding: "0 12px", borderRadius: "12px", border: have ? "1.5px solid #BFDCC8" : "0", background: have ? "#E3F1E7" : "#9A4E36", color: have ? "#2F7A4A" : "#FFFFFF", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}>
                      {busy ? (
                        <>
                          <span className="spin" aria-hidden="true" style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid rgba(255, 255, 255, 0.4)", borderTopColor: "#FFFFFF" }} />
                          Saving
                        </>
                      ) : have ? (
                        "✓ Offline"
                      ) : (
                        `Get · ${c.mb} MB`
                      )}
                    </button>
                  </div>
                  {busy ? <div data-timer style={{ position: "absolute", left: 0, bottom: 0, height: "3px", width: "100%", background: "#9A4E36", animation: "fill 2.2s linear backwards" }} /> : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rise" style={{ padding: "18px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #EADFD2" }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>No pack for “{query.trim()}” yet</p>
            <p style={{ margin: "6px 0 12px", fontSize: "14px", lineHeight: 1.45, color: "#5A4434" }}>The AI Guide can still tell you what to see there.</p>
            <button type="button" onClick={() => ask(`What heritage places should I see in ${query.trim()}?`)} style={{ height: "46px", padding: "0 16px", border: 0, borderRadius: "12px", background: "#9A4E36", color: "#FFFFFF", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
              Ask the guide
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
