"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Sheet from "./Sheet";

// A button that opens a bottom sheet. `label` is the button's content and
// `children` the sheet's, so server-rendered screens can use it directly.
export default function SheetButton({ title, label, children, style, ariaLabel }: { title: string; label: ReactNode; children: ReactNode; style?: CSSProperties; ariaLabel?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-label={ariaLabel} aria-haspopup="dialog" onClick={() => setOpen(true)} style={style}>
        {label}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={title}>
        {children}
      </Sheet>
    </>
  );
}
