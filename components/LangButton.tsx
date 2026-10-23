"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Sheet from "./Sheet";
import { toast } from "./Toast";
import { LANGS, langOf, useStored } from "@/lib/store";
import { translate, useT } from "@/lib/i18n";

// The language pill: shows the current language and opens the picker.
// `icon` is the pill's glyph, passed in so each screen keeps its own styling.
export default function LangButton({ style, pillStyle, icon }: { style?: CSSProperties; pillStyle?: CSSProperties; icon?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useStored("lang", "en");
  const t = useT();
  return (
    <>
      <button type="button" aria-label={`Language: ${langOf(lang).label}. Change language`} aria-haspopup="dialog" onClick={() => setOpen(true)} style={style}>
        <span style={pillStyle}>
          {icon}
          <span>{langOf(lang).short}</span>
        </span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={t("lang.title")}>
        <p>{t("lang.body")}</p>
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            className="sheet-row"
            aria-pressed={lang === l.id}
            onClick={() => {
              setLang(l.id);
              setOpen(false);
              // Said in the language just chosen, so it confirms itself.
              toast(translate(l.id, "lang.changed", { name: l.native }), "success");
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
