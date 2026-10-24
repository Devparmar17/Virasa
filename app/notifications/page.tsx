"use client";

// Notifications — what Virasa has flagged, newest first.
import Link from "next/link";
import { frame, ScreenHeader } from "@/components/ui";
import { useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";

type Kind = keyof Settings["alerts"] | "you";
type Note = { id: string; kind: Kind; title: string; body: string; when: string; href: string; day: "Today" | "Earlier"; look?: keyof typeof LOOKS };

const NOTES: Note[] = [
  { id: "welcome", kind: "you", title: "Welcome to Virasa", body: "Tell the AI where you're going and who's coming, and it plans each day for you.", when: "New", href: "/trip", day: "Today", look: "hello" },
  { id: "light", kind: "nearby", title: "Golden hour at the Tree of Life", body: "In Ahmedabad? The jali at Sidi Saiyyed Mosque glows in the late-afternoon light.", when: "Tip", href: "/place", day: "Today", look: "tip" },
  { id: "quiz", kind: "digest", title: "Quiz: Sidi Saiyyed Mosque", body: "3 questions about the Tree of Life jali.", when: "Tip", href: "/quiz", day: "Today" },
  { id: "safety", kind: "you", title: "Help numbers, one tap away", body: "112 for any emergency, plus helplines for tourists, women and children.", when: "Tip", href: "/safety", day: "Earlier", look: "help" },
];

// Icons for notes that aren't about something that happened.
const LOOKS = {
  hello: { bg: "#FBEDE6", fg: "#9A4E36", path: "M3 11l19-9-9 19-2-8-8-2z" },
  tip: { bg: "#F6EEE4", fg: "#8A6424", path: "M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" },
  help: { bg: "#FBE7E4", fg: "#B03A2E", path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
};

const ICON: Record<Kind, { bg: string; fg: string; path: string }> = {
  nearby: { bg: "#F6E3DA", fg: "#9A4E36", path: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" },
  trips: { bg: "#E3EEF8", fg: "#2F6FB0", path: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" },
  digest: { bg: "#F6EEE4", fg: "#8A6424", path: "M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" },
  you: { bg: "#E3F1E7", fg: "#2F7A4A", path: "M20 6 9 17l-5-5" },
};

export default function NotificationsScreen() {
  const [read, setRead] = useStored<Record<string, boolean>>("notesRead", { safety: true });
  const [settings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const notes = NOTES.filter((n) => n.kind === "you" || settings.alerts[n.kind]);
  const muted = NOTES.length - notes.length;
  const unread = notes.filter((n) => !read[n.id]).length;

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader
        title="Notifications"
        back="/profile"
        action={
          <Link href="/settings#alerts" aria-label="Notification settings" style={{ width: "44px", height: "44px", borderRadius: "50%", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" x2="20" y1="7" y2="7" />
              <line x1="4" x2="20" y1="17" y2="17" />
              <circle cx="9" cy="7" r="2.5" fill="#FBF6EE" />
              <circle cx="15" cy="17" r="2.5" fill="#FBF6EE" />
            </svg>
          </Link>
        }
      />
      <div style={{ padding: "4px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#6F5B4B" }}>{unread ? `${unread} new` : "You're all caught up"}</span>
        <button type="button" disabled={!unread} onClick={() => setRead(Object.fromEntries(NOTES.map((n) => [n.id, true])))} style={{ height: "40px", padding: "0 4px", border: "0", background: "none", color: unread ? "#9A4E36" : "#A8927C", fontSize: "13px", fontWeight: 700, cursor: unread ? "pointer" : "default" }}>
          Mark all read
        </button>
      </div>
      {(["Today", "Earlier"] as const).map((day) => {
        const list = notes.filter((n) => n.day === day);
        if (!list.length) return null;
        return (
          <section key={day} style={{ padding: "0 20px" }}>
            <h2 style={{ margin: "14px 0 8px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#8A6424" }}>{day.toUpperCase()}</h2>
            <ul className="stagger" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {list.map((n) => {
                const isNew = !read[n.id];
                const ic = n.look ? LOOKS[n.look] : ICON[n.kind];
                return (
                  <li key={n.id}>
                    <Link href={n.href} onClick={() => setRead((r) => ({ ...r, [n.id]: true }))} style={{ padding: "14px", borderRadius: "16px", background: "#FFFFFF", border: `1px solid ${isNew ? "#E2C9B4" : "#EFE6DA"}`, color: "#2B1B10", display: "flex", gap: "12px" }}>
                      <span aria-hidden="true" style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "12px", background: ic.bg, color: ic.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={ic.path} />
                        </svg>
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
                          <span style={{ fontSize: "15px", lineHeight: 1.3, fontWeight: isNew ? 800 : 600 }}>{n.title}</span>
                          <span style={{ flex: "0 0 auto", fontSize: "12px", color: "#6F5B4B" }}>{n.when}</span>
                        </span>
                        <span style={{ display: "block", marginTop: "4px", fontSize: "13px", lineHeight: 1.45, color: "#5A4434" }}>{n.body}</span>
                      </span>
                      {isNew ? <span aria-label="Unread" style={{ flex: "0 0 8px", width: "8px", height: "8px", marginTop: "6px", borderRadius: "50%", background: "#9A4E36" }} /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {muted ? (
        <p style={{ margin: "18px 20px 0", fontSize: "13px", lineHeight: 1.45, color: "#6F5B4B" }}>
          {muted} more hidden by your alert settings. <Link href="/settings#alerts">Change in Settings</Link>
        </p>
      ) : null}
    </div>
  );
}
