"use client";

import { useEffect } from "react";
import { useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, TEXT_SCALE, type Settings } from "@/lib/settings";

// Applies the reading-size preference to the whole document.
export default function Prefs() {
  const [settings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const [lang] = useStored("lang", "en");
  useEffect(() => {
    document.documentElement.style.setProperty("--read-scale", String(TEXT_SCALE[settings.text] ?? 1));
  }, [settings.text]);
  // The page's language follows the picker, so screen readers pronounce it right.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
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
