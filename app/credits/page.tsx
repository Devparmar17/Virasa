// Photo credits — who took the photographs and under which licence.
import { frame, ScreenHeader } from "@/components/ui";
import { CREDITS } from "@/lib/credits";

export const metadata = { title: "Photo credits — Virasa" };

export default function CreditsScreen() {
  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader title="Photo credits" back="/settings" />
      <p style={{ margin: "4px 20px 0", fontSize: "14px", lineHeight: 1.5, color: "#5A4434" }}>These photographs come from Wikimedia Commons and are used under the licence shown. Tap one to see the original.</p>
      <ul className="stagger" style={{ listStyle: "none", margin: "16px 0 0", padding: "0 20px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {CREDITS.map((c) => (
          <li key={c.file}>
            <a href={c.source} target="_blank" rel="noopener noreferrer" style={{ padding: "10px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #EADFD2", color: "#2B1B10", display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={`/images/${c.file}`} alt="" loading="lazy" style={{ flex: "0 0 64px", width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: "14px", lineHeight: 1.3, fontWeight: 800 }}>{c.shows}</span>
                <span style={{ display: "block", marginTop: "3px", fontSize: "12px", lineHeight: 1.4, color: "#5A4434", overflowWrap: "anywhere" }}>
                  {c.author} · {c.license}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p style={{ margin: "18px 20px 0", fontSize: "12px", lineHeight: 1.5, color: "#6F5B4B" }}>Photographs without a credit here were supplied with the Virasa design.</p>
    </div>
  );
}
