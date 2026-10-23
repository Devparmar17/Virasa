"use client";

import { useEffect, useState } from "react";

type Tone = "info" | "success" | "error";
type Options = Tone | { tone?: Tone; action?: { label: string; run: () => void } };
type Item = { id: number; text: string; tone: Tone; action?: { label: string; run: () => void } };

let push: ((item: Item) => void) | null = null;

// A light tap on phones that can vibrate: one pulse for done, two for a problem.
function buzz(tone: Tone) {
  try {
    if (tone === "success") navigator.vibrate?.(12);
    else if (tone === "error") navigator.vibrate?.([18, 60, 18]);
  } catch {
    // Vibration blocked or unsupported: the toast is enough.
  }
}

// Shows a short confirmation at the bottom of the screen. "success" adds a
// tick, "error" a warning mark and a shake; an action (Undo) adds a button.
export function toast(text: string, options: Options = "info") {
  const o = typeof options === "string" ? { tone: options } : options;
  const tone = o.tone ?? "info";
  buzz(tone);
  push?.({ id: Date.now(), text, tone, action: o.action });
}

const ICON: Record<Exclude<Tone, "info">, React.ReactNode> = {
  success: (
    <svg className="check-draw" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path pathLength={1} d="M20 6 9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 7v6" />
      <path d="M12 17h.01" />
    </svg>
  ),
};

export default function ToastHost() {
  const [item, setItem] = useState<Item | null>(null);
  useEffect(() => {
    push = setItem;
    return () => {
      push = null;
    };
  }, []);
  useEffect(() => {
    if (!item) return;
    const t = setTimeout(() => setItem(null), item.action ? 4600 : item.tone === "error" ? 3600 : 2600);
    return () => clearTimeout(t);
  }, [item]);
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {item ? (
        <div key={item.id} className={`toast toast-${item.tone}${item.action ? " toast-action" : ""}`}>
          {item.tone !== "info" ? <span className="toast-icon">{ICON[item.tone]}</span> : null}
          <span style={{ flex: 1 }}>{item.text}</span>
          {item.action ? (
            <button
              type="button"
              onClick={() => {
                item.action?.run();
                setItem(null);
              }}
            >
              {item.action.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
