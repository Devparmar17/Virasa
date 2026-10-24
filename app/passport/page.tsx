"use client";

// Heritage passport — every stamp there is to collect. Collected ones are in
// colour; the rest are faded and locked until the traveller's location shows
// they're at the place (tap one to collect it there, or get directions).
import { useState } from "react";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { pop, share, useAsk } from "@/components/Tap";
import { frame, ScreenHeader, Spinner } from "@/components/ui";
import { UserName } from "@/components/User";
import { useStored } from "@/lib/store";
import { kmBetween } from "@/lib/here";
import { ARRIVED_KM, PLACE_SPOTS, STAMP_ORDER, stateCode, type Stamp } from "@/lib/stamps";

const INKS: Record<string, string> = { Gujarat: "#9A4E36", Rajasthan: "#B4552A", Delhi: "#8A6424", "Uttar Pradesh": "#2F7A4A", Punjab: "#B5841E", "West Bengal": "#3457C9", Maharashtra: "#7A4E9A", Karnataka: "#2B7A85" };
const inkOf = (state: string) => INKS[state] ?? "#9A4E36";
const LOCKED = "#C9B8A4";

const TILT = [-7, 4, -3, 6, -5, 3];
const when = (at: number) => new Date(at).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

type Spot = { id: string; name: string; city: string; state: string; lat: number; lon: number };
const SPOTS: Spot[] = STAMP_ORDER.map((id) => ({ id, ...PLACE_SPOTS[id] }));

function Seal({ state, line, index, ink, locked, size = 92 }: { state: string; line: string; index: number; ink: string; locked?: boolean; size?: number }) {
  return (
    <span aria-hidden="true" style={{ position: "relative", width: `${size}px`, height: `${size}px`, borderRadius: "50%", border: `2px dashed ${ink}`, padding: "5px", display: "block", rotate: `${TILT[index % TILT.length]}deg`, background: "#FFFDF8", opacity: locked ? 0.5 : 1 }}>
      <span style={{ width: "100%", height: "100%", borderRadius: "50%", border: `1.5px solid ${ink}`, color: ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1px" }}>
        <span style={{ fontSize: `${size * 0.09}px`, fontWeight: 800, letterSpacing: "0.14em" }}>VIRASA</span>
        <span style={{ fontSize: `${size * 0.3}px`, lineHeight: 1, fontWeight: 800, letterSpacing: "-0.02em" }}>{stateCode(state)}</span>
        <span style={{ maxWidth: "80%", fontSize: `${size * 0.09}px`, fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{line.toUpperCase()}</span>
      </span>
      {locked ? (
        <span style={{ position: "absolute", right: "-2px", bottom: "2px", width: `${size * 0.3}px`, height: `${size * 0.3}px`, borderRadius: "50%", background: "#FFFFFF", border: `1.5px solid ${LOCKED}`, color: "#A8927C", display: "flex", alignItems: "center", justifyContent: "center", rotate: `${-TILT[index % TILT.length]}deg` }}>
          <svg width={size * 0.15} height={size * 0.15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
      ) : null}
    </span>
  );
}

export default function PassportScreen() {
  const [stampMap, setStamps] = useStored<Record<string, Stamp>>("stamps", {});
  const stamps = Object.values(stampMap).sort((a, b) => b.at - a.at);
  const states = [...new Set(stamps.map((s) => s.state))];
  const cities = new Set(stamps.map((s) => s.city)).size;
  const [open, setOpen] = useState<Spot | null>(null);
  const [checking, setChecking] = useState(false);
  const ask = useAsk();
  // Collected first (newest first), then the ones still to collect.
  const all = [...stamps.map((s) => SPOTS.find((p) => p.id === s.id) ?? { ...s, lat: 0, lon: 0 }), ...SPOTS.filter((p) => !stampMap[p.id])];
  const got = open ? stampMap[open.id] : undefined;

  // Collect a stamp where the traveller is standing, if it's the place.
  const collect = (spot: Spot, el: Element) => {
    if (!navigator.geolocation) return toast("Turn on location to collect stamps.", "error");
    setChecking(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setChecking(false);
        const km = kmBetween({ lat: p.coords.latitude, lon: p.coords.longitude }, spot);
        if (km <= ARRIVED_KM) {
          pop(el, true);
          setStamps((m) => ({ ...m, [spot.id]: { id: spot.id, name: spot.name, city: spot.city, state: spot.state, at: Date.now() } }));
          toast(`Stamp collected · ${spot.name}`, "success");
        } else {
          toast(km < 10 ? `You're ${km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`} away — get closer to collect it` : `Collect this one when you're at ${spot.name}, ${spot.city}`);
        }
      },
      () => {
        setChecking(false);
        toast("Turn on location to collect stamps.", "error");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader
        title="Heritage passport"
        back="/profile"
        action={
          stamps.length ? (
            <button type="button" aria-label="Share passport" onClick={() => share("My Virasa heritage passport", `${stamps.length} ${stamps.length === 1 ? "stamp" : "stamps"} across ${cities} ${cities === 1 ? "city" : "cities"}`)} style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "none", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
            </button>
          ) : null
        }
      />
      <section aria-label="Progress" style={{ margin: "8px 20px 0", padding: "18px", borderRadius: "20px", background: "#2B1B10", color: "#FBF6EE" }}>
        <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#E7B98A" }}>
          <UserName upper />
        </p>
        <p style={{ margin: "8px 0 0", fontSize: "26px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>
          {stamps.length} of {SPOTS.length} stamps
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#D9C6AE" }}>
          {states.length} of 36 states &amp; UTs{stamps.length ? ` · ${cities} ${cities === 1 ? "city" : "cities"}` : ""}
        </p>
        <div style={{ marginTop: "14px", height: "6px", borderRadius: "999px", background: "rgba(251, 246, 238, 0.16)", overflow: "hidden" }}>
          <div className="splash-bar" style={{ width: `${Math.max(2, (stamps.length / SPOTS.length) * 100)}%`, height: "100%", borderRadius: "999px", background: "#F3D9A8" }} />
        </div>
      </section>

      <ul className="stagger" style={{ listStyle: "none", margin: "20px 0 0", padding: "0 14px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", rowGap: "18px" }}>
        {all.map((s, i) => {
          const have = stampMap[s.id];
          return (
            <li key={s.id}>
              <button type="button" onClick={() => setOpen(s)} aria-label={`${s.name}, ${s.city}${have ? `, collected ${when(have.at)}` : ", not collected yet"}`} style={{ width: "100%", padding: "4px 2px", border: "0", background: "none", color: "#2B1B10", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <Seal state={s.state} line={have ? when(have.at) : s.city} index={i} ink={inkOf(s.state)} locked={!have} />
                <span style={{ fontSize: "13px", lineHeight: 1.25, fontWeight: 700, textAlign: "center", color: have ? "#2B1B10" : "#6F5B4B" }}>{s.name}</span>
                <span style={{ marginTop: "-5px", fontSize: "12px", color: "#6F5B4B" }}>{s.city}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name || ""}>
        {open ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="pop-in">
                <Seal state={open.state} line={got ? when(got.at) : open.city} index={0} ink={inkOf(open.state)} locked={!got} size={104} />
              </span>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#2B1B10" }}>
                  {open.city}, {open.state}
                </strong>
                <br />
                {got ? `Collected ${new Date(got.at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : "Not collected yet"}
              </p>
            </div>
            {got ? null : (
              <button type="button" className="sheet-cta" disabled={checking} aria-busy={checking} onClick={(e) => collect(open, e.currentTarget)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {checking ? <Spinner /> : null}
                {checking ? "Checking where you are…" : "I'm here — collect stamp"}
              </button>
            )}
            {got ? null : (
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${open.lat},${open.lon}`} target="_blank" rel="noopener noreferrer" className="sheet-row">
                Directions in Google Maps
                <span aria-hidden="true">›</span>
              </a>
            )}
            <button type="button" className="sheet-row" onClick={() => ask(`Tell me the story of ${open.name} in ${open.city}`)}>
              <span>
                Hear its story
                <small>The AI Guide tells it</small>
              </span>
              <span aria-hidden="true">›</span>
            </button>
          </>
        ) : null}
      </Sheet>
    </div>
  );
}
