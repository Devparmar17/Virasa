"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sheet from "./Sheet";
import { toast } from "./Toast";
import { useStored, speechLocale } from "@/lib/store";
import { useT } from "@/lib/i18n";


// The microphone on a search bar. Listens with the browser's speech
// recognition, shows what it hears, then searches for it: by default it opens
// /search?q=…, or hands the words to `onResult` when a screen wants them itself.
export default function VoiceSearch({ style, children, onResult, label }: { style?: CSSProperties; children: ReactNode; onResult?: (text: string) => void; label?: string }) {
  const router = useRouter();
  const [lang] = useStored("lang", "en");
  const t = useT();
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const rec = useRef<any>(null);

  useEffect(() => () => rec.current?.abort?.(), []);

  const stop = () => {
    rec.current?.abort?.();
    rec.current = null;
    setListening(false);
  };

  const start = () => {
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      toast(t("vs.none"), "error");
      return;
    }
    const r = new Recognition();
    rec.current = r;
    r.lang = speechLocale(lang);
    r.interimResults = true;
    r.maxAlternatives = 1;
    let final = "";
    r.onresult = (e: any) => {
      let text = "";
      for (const result of e.results) text += result[0].transcript;
      setHeard(text);
      if (e.results[e.results.length - 1].isFinal) final = text.trim();
    };
    r.onerror = (e: any) => {
      if (e.error === "aborted") return;
      toast(e.error === "not-allowed" ? t("vs.allow") : e.error === "no-speech" ? t("vs.quiet") : t("vs.fail"), "error");
    };
    r.onend = () => {
      rec.current = null;
      setListening(false);
      if (!final) return;
      if (onResult) onResult(final);
      else router.push(`/search?q=${encodeURIComponent(final)}`);
    };
    setHeard("");
    setListening(true);
    r.start();
  };

  return (
    <>
      <button type="button" aria-label={label || t("vs.label")} onClick={start} style={style}>
        {children}
      </button>
      <Sheet open={listening} onClose={stop} title={t("vs.listening")}>
        <div style={{ padding: "8px 0 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px", textAlign: "center" }}>
          <span className="pulse" aria-hidden="true" style={{ width: "84px", height: "84px", borderRadius: "50%", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </span>
          <p aria-live="polite" style={{ margin: 0, minHeight: "52px", fontSize: "20px", lineHeight: 1.3, fontWeight: 800, color: "var(--ink)" }}>
            {heard || t("vs.say")}
          </p>
          <p style={{ margin: 0 }}>{t("vs.try")}</p>
        </div>
        <button type="button" className="sheet-row" onClick={stop} style={{ justifyContent: "center" }}>
          {t("trip.cancel")}
        </button>
      </Sheet>
    </>
  );
}
