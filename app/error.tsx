"use client";

import { useEffect } from "react";
import Link from "next/link";
import { frame } from "@/components/ui";

// Shown when a screen fails to load; the traveller can retry in place.
export default function ErrorScreen({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div style={frame({ height: "844px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" })}>
      <span aria-hidden="true" style={{ width: "96px", height: "96px", borderRadius: "50%", background: "#FBE9E4", color: "#A23A2A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </span>
      <h1 style={{ margin: "26px 0 0", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em" }}>This screen didn&apos;t load</h1>
      <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#5A4434" }}>Something went wrong on our side. Your saved places and downloads are safe.</p>
      <button type="button" onClick={() => retry()} style={{ marginTop: "26px", alignSelf: "stretch", height: "56px", border: 0, borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", fontSize: "16px", fontWeight: 800, cursor: "pointer" }}>
        Try again
      </button>
      <Link href="/home" style={{ marginTop: "6px", height: "48px", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: 700, color: "#5A4434" }}>
        Back to Home
      </Link>
    </div>
  );
}
