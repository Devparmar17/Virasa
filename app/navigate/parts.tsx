"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { canGoBack, replacingScreen } from "@/components/Back";
import { toast } from "@/components/Toast";
import { tr, useT } from "@/lib/i18n";
import { readStored, speechLocale, useStored } from "@/lib/store";
import { placeById } from "../explore/places";
import { kmBetween } from "@/lib/here";
import { ARRIVED_KM, PLACE_SPOTS, type Stamp } from "@/lib/stamps";

const noop = () => () => {};

// The walk in the design is already under way to Sidi Saiyyed. The map can
// send another destination as /navigate?to=<place id>.
export function useTrip() {
  const dest = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("to") || "sidi",
    () => "sidi"
  );
  const place = placeById(dest);
  // Where the destination is described: its own page, or the map for places without one.
  const page = place.href || place.detail || "/explore";
  return dest === "sidi"
    ? { id: dest, name: place.name, mins: 14, km: 1.1, page, img: place.img, arrive: "/arrived" }
    : { id: dest, name: place.name, mins: place.mins, km: place.km, page, img: place.img, arrive: page };
}

// Ends the walk and returns to where it was started from (the map, a place,
// the walk planner). Opened from a link, it replaces itself with the
// destination's page, so Back can never lead into the ended walk again.
export function useEndWalk() {
  const router = useRouter();
  const trip = useTrip();
  return (quiet?: boolean) => {
    window.speechSynthesis?.cancel();
    if (!quiet) toast(tr("nav.ended", { dest: trip.name }));
    if (canGoBack()) router.back();
    else {
      replacingScreen();
      router.replace(trip.page);
    }
  };
}

// Speaks in the app's language when the browser has a voice for it.
export function say(text: string, onEnd?: () => void) {
  const synth = window.speechSynthesis;
  if (!synth) return false;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = speechLocale(readStored("lang", "en"));
  if (onEnd) u.onend = onEnd;
  synth.speak(u);
  return true;
}

export const useVoice = () => {
  const [prefs] = useStored<Record<string, boolean>>("prefs", {});
  return prefs.voice ?? true;
};

// Turns spoken directions on or off; turning them on reads out the current instruction.
export function VoiceButton({ style, current }: { style: CSSProperties; current: string }) {
  const [prefs, setPrefs] = useStored<Record<string, boolean>>("prefs", {});
  const t = useT();
  const on = prefs.voice ?? true;
  return (
    <button
      type="button"
      aria-label={on ? t("nav.voice_on") : t("nav.voice_off")}
      aria-pressed={on}
      onClick={() => {
        setPrefs((p) => ({ ...p, voice: !on }));
        if (on) {
          window.speechSynthesis?.cancel();
          toast(t("nav.voice_off"));
        } else {
          say(current);
          toast(t("nav.voice_on"), "success");
        }
      }}
      style={{ ...style, opacity: on ? 1 : 0.7 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {on ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        ) : (
          <>
            <line x1="22" x2="16" y1="9" y2="15" />
            <line x1="16" x2="22" y1="9" y2="15" />
          </>
        )}
      </svg>
    </button>
  );
}

const TEASER =
  "Just ahead is Teen Darwaza, the triple gateway built in 1415. People say a lamp in one of its niches has been kept burning for six hundred years, lit for the goddess Lakshmi, who is said never to have left the city.";

// Plays the short story about the landmark on the route.
export function StoryPreview({ style }: { style: CSSProperties }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  return (
    <button
      type="button"
      aria-pressed={playing}
      aria-label={playing ? "Pause story about Teen Darwaza" : "Play story about Teen Darwaza, 1 minute 10"}
      onClick={() => {
        if (playing) {
          window.speechSynthesis?.cancel();
          setPlaying(false);
        } else if (say(TEASER, () => setPlaying(false))) {
          setPlaying(true);
        } else {
          toast("Audio isn't available in this browser", "error");
        }
      }}
      style={style}
    >
      {playing ? (
        <span className="eq" aria-hidden="true" style={{ height: "14px" }}>
          <i />
          <i />
          <i />
        </span>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
          <polygon points="7 4 19 12 7 20 7 4" />
        </svg>
      )}
      <span>{playing ? "" : "1:10"}</span>
    </button>
  );
}

// Real walking directions in Google Maps, for when the traveller is really going.
export function directionsUrl(id: string, name: string) {
  const spot = PLACE_SPOTS[id];
  const to = spot ? `${spot.lat},${spot.lon}` : `${name}, Ahmedabad`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(to)}&travelmode=walking`;
}

// On arrival: a stamp, shown only when the phone's location shows the
// traveller is really at the place.
export function StampCheck({ id, name }: { id: string; name: string }) {
  const t = useT();
  const [, setStamps] = useStored<Record<string, Stamp>>("stamps", {});
  const [yes, setYes] = useState(false);
  useEffect(() => {
    const spot = PLACE_SPOTS[id];
    if (!spot || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const here = kmBetween({ lat: p.coords.latitude, lon: p.coords.longitude }, spot) <= ARRIVED_KM;
        if (!here) return;
        setStamps((m) => (m[id] ? m : { ...m, [id]: { id, name: spot.name, city: spot.city, state: spot.state, at: Date.now() } }));
        setYes(true);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [id, setStamps]);
  if (!yes) return null;
  return (
    <div aria-live="polite" style={{ marginTop: "16px", width: "100%", padding: "12px 14px", borderRadius: "16px", background: "#E3F1E7", display: "flex", alignItems: "center", gap: "12px", textAlign: "left" }}>
      <span className="stamp-in" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", background: "#8A6424", border: "2px dashed #F3D9A8", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      </span>
      <span style={{ fontSize: "14px", lineHeight: 1.4, fontWeight: 800, color: "#2B1B10" }}>
        {t("nav.stamp")} · {name}
      </span>
    </div>
  );
}
