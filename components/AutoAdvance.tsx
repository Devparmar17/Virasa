"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Moves on to the next screen after a short delay (used by the splash).
export default function AutoAdvance({ to, ms }: { to: string; ms: number }) {
  const router = useRouter();
  useEffect(() => {
    // Travellers who have finished onboarding go straight home.
    let done = false;
    try {
      done = window.localStorage.getItem("virasa:onboarded") === "true";
    } catch {
      // No storage: treat as a first visit.
    }
    // Replaced rather than pushed, so Back from the next screen doesn't return here and bounce forward again.
    const t = setTimeout(() => router.replace(done ? "/home" : to), ms);
    return () => clearTimeout(t);
  }, [router, to, ms]);
  return null;
}
