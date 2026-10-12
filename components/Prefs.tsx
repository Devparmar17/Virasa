"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, TEXT_SCALE, type Settings } from "@/lib/settings";

// Applies the reading-size preference to the whole document.
export default function Prefs() {
  const [settings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  useEffect(() => {
    document.documentElement.style.setProperty("--read-scale", String(TEXT_SCALE[settings.text] ?? 1));
  }, [settings.text]);
  return null;
}

// Remembers that onboarding is done, so the splash goes straight home next time.
export function MarkOnboarded() {
  const [, setDone] = useStored("onboarded", false);
  useEffect(() => setDone(true), [setDone]);
  return null;
}

// Reads a description aloud on arrival when "Audio descriptions" is on.
export function AutoDescribe({ text }: { text: string }) {
  const [sw] = useStored("switches", { auto: true, desc: false, steps: false });
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!sw.desc || !synth) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    synth.speak(u);
    return () => synth.cancel();
  }, [sw.desc, text]);
  return null;
}

// On arrival, starts the place's story after a short countdown when
// "Play story on arrival" is on. The traveller can cancel it.
export function AutoStory({ href, seconds = 8 }: { href: string; seconds?: number }) {
  const router = useRouter();
  const [sw] = useStored("switches", { auto: true, desc: false, steps: false });
  const [left, setLeft] = useState(seconds);
  const [cancelled, setCancelled] = useState(false);
  const active = sw.auto && !cancelled;
  useEffect(() => {
    if (!active) return;
    if (left <= 0) {
      router.push(href);
      return;
    }
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [active, left, href, router]);
  if (!active) return null;
  return (
    <div className="rise" role="status" style={{ position: "absolute", left: "16px", right: "16px", top: "54px", zIndex: 5, height: "48px", padding: "0 6px 0 14px", borderRadius: "14px", background: "rgba(43, 27, 16, 0.92)", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "14px", fontWeight: 700, boxShadow: "0 10px 24px rgba(43, 27, 16, 0.3)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span className="eq" aria-hidden="true" style={{ height: "14px", color: "#F3D9A8" }}>
          <i />
          <i />
          <i />
        </span>
        Story starts in {left} s
      </span>
      <button type="button" onClick={() => setCancelled(true)} style={{ height: "36px", padding: "0 12px", border: "0", borderRadius: "10px", background: "rgba(251, 246, 238, 0.14)", color: "#FBF6EE", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
        Not now
      </button>
    </div>
  );
}
