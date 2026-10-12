import Link from "next/link";
import { screens } from "@/lib/screens";

export const metadata = { title: "All screens — Virasa" };

export default function ScreensIndex() {
  return (
    <div style={{ width: 390, background: "#FBF6EE", padding: "48px 20px 32px" }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Virasa screens</h1>
      <p style={{ margin: "8px 0 20px", fontSize: 14, lineHeight: 1.45, color: "#5A4434" }}>
        Every screen from the design. Start at the splash to tap through the prototype flow.
      </p>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {screens.map((s) => (
          <li key={s.route}>
            <Link
              href={s.route}
              style={{
                minHeight: 52,
                padding: "10px 14px",
                borderRadius: 14,
                background: "#FFFFFF",
                border: "1px solid #EADFD2",
                color: "#2B1B10",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              <span>{s.title}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6F5B4B" }}>{s.route}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
