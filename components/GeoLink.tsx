"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./Toast";
import { Spinner } from "./ui";
import { useStored } from "@/lib/store";
import { DEFAULT_HERE, nearestCity, type Here } from "@/lib/here";

// Asks the browser for the traveller's location, sets the city the app
// follows to the nearest one it knows, says what it found, then moves on.
export default function GeoLink({ href, style, children }: { href?: string; style?: CSSProperties; children: ReactNode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, setHere] = useStored<Here>("here", DEFAULT_HERE);
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
            const { latitude: lat, longitude: lon } = p.coords;
            const near = nearestCity(lat, lon);
            setHere({ city: near.city, state: near.state, lat, lon, km: Math.round(near.km), source: "gps" });
            toast(near.km < 60 ? `Location on — you're in ${near.city}` : `Location on — the nearest city Virasa knows is ${near.city}, ${Math.round(near.km)} km away`, "success");
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
