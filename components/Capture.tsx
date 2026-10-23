"use client";

import type { CSSProperties, ReactNode } from "react";
import { toast } from "./Toast";

// The camera shutter: flashes the viewfinder and confirms the photo was kept.
export default function Capture({ style, children, label = "Capture photo" }: { style?: CSSProperties; children: ReactNode; label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        const frame = e.currentTarget.closest(".screen > div");
        if (frame) {
          const flash = document.createElement("div");
          flash.className = "flash";
          flash.addEventListener("animationend", () => flash.remove());
          frame.appendChild(flash);
        }
        toast("Photo saved to your journal", "success");
      }}
      style={style}
    >
      {children}
    </button>
  );
}
