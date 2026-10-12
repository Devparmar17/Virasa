"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Sheet from "./Sheet";
import { toast } from "./Toast";
import { LANGS, langOf, useStored } from "@/lib/store";

// The language pill: shows the current language and opens the picker.
// `icon` is the pill's glyph, passed in so each screen keeps its own styling.
export default function LangButton({ style, pillStyle, icon }: { style?: CSSProperties; pillStyle?: CSSProperties; icon?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useStored("lang", "en");
  return (
    <>
      <button type="button" aria-label={`Language: ${langOf(lang).label}. Change language`} aria-haspopup="dialog" onClick={() => setOpen(true)} style={style}>
        <span style={pillStyle}>
          {icon}
          <span>{langOf(lang).short}</span>
        </span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Language">
        <p>Stories, the AI Guide and voice directions use this language.</p>
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            className="sheet-row"
            aria-pressed={lang === l.id}
            onClick={() => {
              setLang(l.id);
              setOpen(false);
              toast(`Language: ${l.label}`);
            }}
          >
            <span>
              {l.native}
              <small>{l.label}</small>
            </span>
            <span aria-hidden="true">{lang === l.id ? "✓" : ""}</span>
          </button>
        ))}
      </Sheet>
    </>
  );
}
