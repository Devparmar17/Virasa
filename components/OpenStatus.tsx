"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const hour = (h: number) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

// "Open now · closes 6 PM" or "Closed · opens 7 AM", from a place's daily
// hours and the phone's clock. Before the clock is read, just the hours.
export default function OpenStatus({ opens, closes }: { opens: number; closes: number }) {
  const now = useSyncExternalStore(noop, () => new Date().getHours() + new Date().getMinutes() / 60, () => -1);
  const open = now >= opens && now < closes;
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      {now < 0 ? (
        <span>
          {hour(opens)} – {hour(closes)}
        </span>
      ) : (
        <>
          <strong style={{ color: open ? "#2F7A4A" : "#A23A2A" }}>{open ? "Open now" : "Closed"}</strong>
          <span>· {open ? `closes ${hour(closes)}` : `opens ${hour(opens)}`}</span>
        </>
      )}
    </span>
  );
}
