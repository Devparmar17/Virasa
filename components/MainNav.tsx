import Link from "next/link";
import type { ReactNode } from "react";
import { T, type Key } from "@/lib/i18n";

type Tab = "home" | "saved" | "explore" | "ai-guide" | "profile";

const TABS: { id: Tab; href: string; label: Key; icon: ReactNode }[] = [
  {
    id: "home",
    href: "/home",
    label: "tab.home",
    icon: (
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  {
    id: "saved",
    href: "/saved",
    label: "tab.saved",
    icon: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />,
  },
  {
    id: "explore",
    href: "/explore",
    label: "tab.explore",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </>
    ),
  },
  {
    id: "ai-guide",
    href: "/ai-guide",
    label: "tab.guide",
    icon: (
      <>
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
        <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
        <path fill="currentColor" stroke="none" d="M12 6.6l.85 2.1 2.1.85-2.1.85L12 12.5l-.85-2.1-2.1-.85 2.1-.85z" />
      </>
    ),
  },
  {
    id: "profile",
    href: "/profile",
    label: "tab.profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="4.5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </>
    ),
  },
];

// The main tab bar: a frosted bar floating just above the bottom edge. It
// stays in view while a long screen scrolls.
export default function MainNav({ active }: { active?: Tab }) {
  return (
    <div className="nav-rail">
      <div className="tabbar-wrap">
        <nav aria-label="Main" className="tabbar">
          {TABS.map((t) => {
            const on = t.id === active;
            return (
              <Link key={t.id} href={t.href} aria-current={on ? "page" : undefined} className="tab" data-plain>
                <span className={on ? "tab-icon tab-pill" : "tab-icon"}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {t.icon}
                  </svg>
                </span>
                <span className="tab-label">
                  <T k={t.label} />
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
