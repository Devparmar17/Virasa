"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { toast } from "./Toast";

// Reads a passage aloud with the browser's own voice; press again to stop.
// `label` names an icon-only button for screen readers ("Listen, 2 min"); it says Stop while playing.
export default function Speak({ text, lang = "en-IN", style, children, playingLabel = "Stop", label, onDone }: { text: string; lang?: string; style?: CSSProperties; children: ReactNode; playingLabel?: string; label?: string; onDone?: () => void }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  return (
    <button
      type="button"
      aria-pressed={playing}
      aria-label={label ? (playing ? "Stop listening" : label) : undefined}
      onClick={() => {
        const synth = window.speechSynthesis;
        if (!synth) {
          toast("Audio isn't available in this browser", "error");
          return;
        }
        synth.cancel();
        if (playing) {
          setPlaying(false);
          return;
        }
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.onend = () => {
          setPlaying(false);
          onDone?.();
        };
        u.onerror = () => setPlaying(false);
        synth.speak(u);
        setPlaying(true);
      }}
      style={style}
    >
      {playing ? (
        <>
          <span className="eq" aria-hidden="true" style={{ height: "14px" }}>
            <i />
            <i />
            <i />
          </span>
          {playingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
