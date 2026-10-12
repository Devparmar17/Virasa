"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { toast } from "./Toast";

// Reads a passage aloud with the browser's own voice; press again to stop.
export default function Speak({ text, lang = "en-IN", style, children, playingLabel = "Stop" }: { text: string; lang?: string; style?: CSSProperties; children: ReactNode; playingLabel?: string }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  return (
    <button
      type="button"
      aria-pressed={playing}
      onClick={() => {
        const synth = window.speechSynthesis;
        if (!synth) {
          toast("Audio isn't available in this browser");
          return;
        }
        synth.cancel();
        if (playing) {
          setPlaying(false);
          return;
        }
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.onend = () => setPlaying(false);
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
