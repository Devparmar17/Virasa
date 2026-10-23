"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./Toast";
import { Spinner } from "./ui";
import { useStored } from "@/lib/store";

// Ahmedabad's Old City, the area Virasa currently covers.
const OLD_CITY = { lat: 23.0258, lon: 72.5873 };

export function kmFromOldCity(lat: number, lon: number) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(rad(lat - OLD_CITY.lat) / 2) ** 2 + Math.cos(rad(OLD_CITY.lat)) * Math.cos(rad(lat)) * Math.sin(rad(lon - OLD_CITY.lon) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

// Asks the browser for the traveller's location, says what it found, then moves on.
export default function GeoLink({ href, style, children }: { href?: string; style?: CSSProperties; children: ReactNode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, setGeo] = useStored<{ lat: number; lon: number } | null>("geo", null);
  const next = () => {
    setBusy(false);
    if (href) router.push(href);
  };
  return (
    <button
      type="button"
      disabled={busy}
      aria-busy={busy}
      onClick={() => {
        if (!navigator.geolocation) {
          toast("This browser can't share location. You can still pick a city by hand.", "error");
          next();
          return;
        }
        setBusy(true);
        navigator.geolocation.getCurrentPosition(
          (p) => {
            setGeo({ lat: p.coords.latitude, lon: p.coords.longitude });
            const km = kmFromOldCity(p.coords.latitude, p.coords.longitude);
            toast(km < 30 ? "Location on — showing stories around you" : `Location on — you're about ${Math.round(km).toLocaleString("en-IN")} km from Ahmedabad's Old City`, "success");
            next();
          },
          () => {
            toast("No location for now. You can turn it on later in your browser.");
            next();
          },
          { timeout: 8000, maximumAge: 600000 }
        );
      }}
      style={{ border: "0", cursor: "pointer", width: "100%", ...style }}
    >
      {busy ? (
        <span key="busy" className="btn-swap">
          <Spinner />
          Finding you…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
