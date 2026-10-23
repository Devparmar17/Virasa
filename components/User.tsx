"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "./Toast";
import { logOut, useUser } from "@/lib/auth";
import { useT } from "@/lib/i18n";


// The signed-in traveller's name: whole, or just the first name for greetings.
export function UserName({ first, upper }: { first?: boolean; upper?: boolean }) {
  const [user] = useUser();
  const t = useT();
  let name = user?.name || t("home.guest");
  if (first) name = name.trim().split(/\s+/)[0];
  return <>{upper ? name.toUpperCase() : name}</>;
}

// "Namaste, Asha" in the chosen language, with a guest called a traveller.
export function Greeting() {
  const [user] = useUser();
  const t = useT();
  const first = (user?.name || t("home.guest")).trim().split(/\s+/)[0];
  return <>{t("home.namaste", { name: first })}</>;
}

// Their picture: the Google photo, initials for an email account, or a plain figure for a guest.
export function Avatar({ style }: { style: CSSProperties }) {
  const [user] = useUser();
  if (!user) {
    return (
      <span role="img" aria-label="Guest" style={{ ...style, background: "#F1E7DA", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4.5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      </span>
    );
  }
  if (!user.picture) {
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
  return <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" style={style} />;
}

export const GoogleMark = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

// The account strip on Profile: which account is signed in and a way out,
// or an invitation to sign in for a guest.
export function AccountCard() {
  const [user] = useUser();
  const router = useRouter();
  const box: CSSProperties = { margin: "14px 20px 0", minHeight: "56px", padding: "8px 8px 8px 14px", borderRadius: "16px", border: "1px solid #EFE6DA", background: "#F6F1EA", color: "#2B1B10", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" };
  if (!user) {
    return (
      <Link href="/login" style={box}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: "15px", fontWeight: 800 }}>Log in or sign up</span>
          <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>Keep your stamps, plans and tickets</span>
        </span>
        <span style={{ flex: "0 0 auto", height: "40px", padding: "0 14px", borderRadius: "12px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 800 }}>Log in</span>
      </Link>
    );
  }
  return (
    <div style={box}>
      <span aria-hidden="true" style={{ flex: "0 0 36px", width: "36px", height: "36px", borderRadius: "10px", background: "#FFFFFF", border: "1px solid #EFE6DA", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {user.provider === "google" ? (
          <GoogleMark />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        )}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>{user.provider === "google" ? "Signed in with Google" : "Signed in with email"}</span>
        <span style={{ display: "block", marginTop: "1px", fontSize: "14px", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
      </span>
      <button
        type="button"
        onClick={() => {
          logOut();
          toast("You're logged out");
          router.push("/login");
        }}
        style={{ flex: "0 0 auto", height: "40px", padding: "0 12px", border: "1.5px solid #E2D3C1", borderRadius: "12px", background: "#FFFFFF", color: "#A23A2A", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
      >
        Log out
      </button>
    </div>
  );
}
