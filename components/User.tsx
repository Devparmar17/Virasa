"use client";

import type { CSSProperties } from "react";
import { useUser } from "@/lib/auth";

// The design's traveller, shown until someone signs in.
const GUEST = { name: "Dev Parmar", photo: "/images/09fefb6e9530a2db07f9fdf176246976.jpg" };

// The signed-in traveller's name: whole, or just the first name for greetings.
export function UserName({ first, upper }: { first?: boolean; upper?: boolean }) {
  const [user] = useUser();
  let name = user?.name || GUEST.name;
  if (first) name = name.trim().split(/\s+/)[0];
  return <>{upper ? name.toUpperCase() : name}</>;
}

// Their picture: the Google photo, initials for an email account, or the design's photo for a guest.
export function Avatar({ style }: { style: CSSProperties }) {
  const [user] = useUser();
  if (user && !user.picture) {
    const initials = user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
    return (
      <span role="img" aria-label={user.name} style={{ ...style, background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: `calc(${style.width} * 0.38)`, fontWeight: 800, letterSpacing: "0.02em" }}>
        {initials}
      </span>
    );
  }
  return <img src={user?.picture || GUEST.photo} alt={user?.name || GUEST.name} referrerPolicy="no-referrer" style={style} />;
}
