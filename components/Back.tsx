"use client";

import { useEffect, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// The screens visited in this tab, so Back can return to wherever the
// traveller actually came from. Kept for the tab's session, so a reload doesn't
// lose it; only a link opened fresh falls back to the Back control's own link.
const KEY = "virasa:trail";
const trail: string[] = (() => {
  try {
    return typeof window === "undefined" ? [] : JSON.parse(window.sessionStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
})();
const keep = () => {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(trail.slice(-40)));
  } catch {
    // Still works for this page view.
  }
};

// Kept up to date from the layout. Coming back to the screen before this one
// counts as going back; anything else is a step forward.
export function NavTrail() {
  const path = usePathname();
  useEffect(() => {
    // The splash replaces itself, so it never sits in the history behind a screen.
    if (path === "/") return;
    if (trail.length > 1 && trail[trail.length - 2] === path) trail.pop();
    else if (trail[trail.length - 1] !== path) trail.push(path);
    keep();
  }, [path]);
  return null;
}

// Whether the previous screen in history is one of the app's own.
export const canGoBack = () => trail.length > 1;

// Call before router.replace(): the next screen takes this one's place.
export function replacingScreen() {
  trail.pop();
  keep();
}

// A back (or close) control: goes back in history when the previous screen is
// part of the app, otherwise opens `href`, so a shared link still has a way in.
export default function BackLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || !canGoBack()) return;
        e.preventDefault();
        router.back();
      }}
    />
  );
}
