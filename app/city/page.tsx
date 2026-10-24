"use client";

// Choose a city — where you are now (by location or by name), and a trip plan
// for anywhere else. The city chosen here is the one Home, the AI Guide,
// search and Discover follow.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GeoLink from "@/components/GeoLink";
import { toast } from "@/components/Toast";
import { frame, ScreenHeader } from "@/components/ui";
import { useStored } from "@/lib/store";
import { cityByName, DEFAULT_HERE, hereLabel, isAhmedabad, KNOWN_CITIES, type Here } from "@/lib/here";

// Listed first: the cities Virasa has the most for.
const FEATURED = ["Ahmedabad", "Jaipur", "Varanasi", "Udaipur", "Delhi", "Hampi", "Kolkata", "Mysuru", "Kochi", "Amritsar", "Agra", "Mumbai"];
const ORDERED = [...FEATURED.map((n) => KNOWN_CITIES.find((c) => c.city === n)!), ...KNOWN_CITIES.filter((c) => !FEATURED.includes(c.city))];

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default function CityScreen() {
  const router = useRouter();
  const [here, setHere] = useStored<Here>("here", DEFAULT_HERE);
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const list = ORDERED.filter((c) => c.city.toLowerCase() !== here.city.toLowerCase() && (!needle || `${c.city} ${c.state}`.toLowerCase().includes(needle)));
  const exact = list.some((c) => c.city.toLowerCase() === needle);

  const choose = (name: string) => {
    const next = cityByName(name);
    setHere(next);
    toast(`You're in ${next.city}`, "success");
    router.push("/home");
  };

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader title="Choose a city" back="/home" />
      <div style={{ padding: "0 20px" }}>
        <GeoLink href="/home" style={{ height: "54px", padding: "0 14px", borderRadius: "16px", background: "#E3EEF8", color: "#1F5A93", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: 700 }}>
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
        <Link href="/home" style={{ padding: "16px", borderRadius: "18px", background: "#2B1B10", color: "#FBF6EE", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
          <span className="pulse" aria-hidden="true" style={{ flex: "0 0 14px", width: "14px", height: "14px", borderRadius: "50%", background: "#9FD3B0" }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: "18px", fontWeight: 800 }}>{hereLabel(here)}</span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "13px", color: "#D9C6AE" }}>
              {here.source === "gps" ? "From your location" : here.source === "picked" ? "Chosen by you" : "Virasa's home city"}
              {isAhmedabad(here) ? " · walks, stories and the map" : " · plans, local finds and the AI Guide"}
            </span>
          </span>
          <span style={{ color: "#9FD3B0" }}>
            <Chevron />
          </span>
        </Link>

        <h2 style={{ margin: "24px 0 8px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#8A6424" }}>I&apos;M IN ANOTHER CITY</h2>
        <label style={{ height: "54px", padding: "0 14px", borderRadius: "16px", background: "#FFFFFF", border: "1.5px solid #D9C7B3", display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            aria-label="Type any city"
            placeholder="Type any city or town"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) choose(list[0]?.city ?? query);
            }}
            enterKeyHint="go"
            style={{ flex: 1, minWidth: 0, height: "44px", border: 0, outline: "none", background: "transparent", fontSize: "16px", color: "#2B1B10" }}
          />
        </label>
        <p style={{ margin: "8px 2px 10px", fontSize: "13px", lineHeight: 1.45, color: "#5A4434" }}>Tap a city to make it yours. Home, the AI Guide and Discover follow it.</p>

        <ul className="stagger" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {needle && !exact ? (
            <li style={{ padding: "6px 6px 6px 14px", borderRadius: "16px", background: "#FBEDE6", border: "1px solid #F0D3C6", display: "flex", alignItems: "center", gap: "8px" }}>
              <button type="button" onClick={() => choose(query)} style={{ flex: 1, minWidth: 0, minHeight: "48px", padding: 0, border: 0, background: "none", color: "#2B1B10", textAlign: "left", cursor: "pointer" }}>
                <span style={{ display: "block", fontSize: "16px", fontWeight: 800 }}>I&apos;m in {query.trim()}</span>
                <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>Tap to use this city</span>
              </button>
            </li>
          ) : null}
          {list.map((c) => {
            const mine = c.city.toLowerCase() === here.city.toLowerCase();
            return (
              <li key={c.city} style={{ padding: "6px 6px 6px 14px", borderRadius: "16px", background: "#FFFFFF", border: `1px solid ${mine ? "#BFDCC8" : "#EFE6DA"}`, display: "flex", alignItems: "center", gap: "8px" }}>
                <button type="button" aria-pressed={mine} onClick={() => choose(c.city)} style={{ flex: 1, minWidth: 0, minHeight: "48px", padding: 0, border: 0, background: "none", color: "#2B1B10", textAlign: "left", cursor: "pointer" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "16px", fontWeight: 800 }}>
                    {c.city}
                    {mine ? <span style={{ height: "22px", padding: "0 8px", borderRadius: "999px", background: "#E3F1E7", color: "#2F7A4A", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center" }}>You&apos;re here</span> : null}
                  </span>
                  <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>{c.city === "Ahmedabad" ? "Gujarat · walks, stories and the map" : c.state}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
