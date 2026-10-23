"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { canGoBack, replacingScreen } from "@/components/Back";
import { toast } from "@/components/Toast";
import { asLang, tr, useT, VOICE } from "@/lib/i18n";
import { readStored, useStored } from "@/lib/store";
import { placeById } from "../explore/places";

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
  u.lang = VOICE[asLang(readStored("lang", "en"))];
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
