"use client";

import { useEffect, useState } from "react";

let push: ((text: string) => void) | null = null;

// Shows a short confirmation at the bottom of the screen.
export function toast(text: string) {
  push?.(text);
}

export default function ToastHost() {
  const [item, setItem] = useState<{ id: number; text: string } | null>(null);
  useEffect(() => {
    push = (text) => setItem({ id: Date.now(), text });
    return () => {
      push = null;
    };
  }, []);
  useEffect(() => {
    if (!item) return;
    const t = setTimeout(() => setItem(null), 2600);
    return () => clearTimeout(t);
  }, [item]);
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {item ? (
        <div key={item.id} className="toast">
          {item.text}
        </div>
      ) : null}
    </div>
  );
}
