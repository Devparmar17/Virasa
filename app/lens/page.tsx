// 11 · AI Lens
import Link from "next/link";
import { Tap, Toggle } from "@/components/Tap";
import { AutoDescribe } from "@/components/Prefs";

export default function LensScreen() {
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#1E130B", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="Camera view of the Tree of Life jali" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "560px", objectFit: "cover", objectPosition: "26% 50%", display: "block" }} />
      <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "560px", background: "rgba(20, 12, 6, 0.18)" }} />
      <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "140px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.6) 0%, rgba(20, 12, 6, 0) 100%)" }} />
      <div style={{ position: "absolute", top: "50px", left: "8px", right: "8px", height: "48px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#FFFFFF" }}>
        <Link href="/place" aria-label="Close lens" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(20, 12, 6, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Link>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "16px", fontWeight: "800" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#F3D9A8" stroke="none" aria-hidden="true">
            <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
          </svg>
          <span>
            Heritage Lens
          </span>
        </span>
        <Toggle storeKey="prefs" field="flash" onLabel="Flash on" offLabel="Flash off" onToast="Flash on" offToast="Flash off" style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "rgba(20, 12, 6, 0.4)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          on={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#F3D9A8" stroke="#F3D9A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
            </svg>
          }
          off={<>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 16v1a2 2 0 0 1-2 2H6l-4-4V7a2 2 0 0 1 2-2h1" />
            <path d="M13 2 9 11h6l-4 9" />
            <path d="m2 2 20 20" />
          </svg>
        </>}
        />
      </div>
      <nav aria-label="Lens modes" style={{ position: "absolute", top: "104px", left: "50%", transform: "translateX(-50%)", padding: "4px", borderRadius: "999px", background: "rgba(20, 12, 6, 0.6)", display: "flex", gap: "2px" }}>
        <span aria-current="page" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", background: "#FBF6EE", color: "#2B1B10", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
          Identify
        </span>
        <Link href="/ar" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>
          AR Tour
        </Link>
        <Link href="/ar-time" style={{ height: "36px", padding: "0 14px", borderRadius: "999px", color: "#FFFFFF", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>
          Time travel
        </Link>
      </nav>
      <div aria-hidden="true" style={{ position: "absolute", left: "62px", top: "160px", width: "36px", height: "36px", borderTop: "4px solid #F3D9A8", borderLeft: "4px solid #F3D9A8", borderRadius: "14px 0 0 0" }} />
      <div aria-hidden="true" style={{ position: "absolute", right: "62px", top: "160px", width: "36px", height: "36px", borderTop: "4px solid #F3D9A8", borderRight: "4px solid #F3D9A8", borderRadius: "0 14px 0 0" }} />
      <div aria-hidden="true" style={{ position: "absolute", left: "62px", top: "420px", width: "36px", height: "36px", borderBottom: "4px solid #F3D9A8", borderLeft: "4px solid #F3D9A8", borderRadius: "0 0 0 14px" }} />
      <div aria-hidden="true" style={{ position: "absolute", right: "62px", top: "420px", width: "36px", height: "36px", borderBottom: "4px solid #F3D9A8", borderRight: "4px solid #F3D9A8", borderRadius: "0 0 14px 0" }} />
      <Tap toastText="Palm fronds: the curling leaves are date palms, a favourite motif of Gujarat's stone carvers." style={{ position: "absolute", left: "196px", top: "200px", height: "36px", padding: "0 12px 0 6px", border: "0", borderRadius: "999px", background: "rgba(255, 255, 255, 0.95)", color: "#2B1B10", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "800", boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)", cursor: "pointer" }}>
        <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#9A4E36", boxShadow: "0 0 0 4px rgba(154, 78, 54, 0.3)" }} />
        {" Palm fronds "}
      </Tap>
      <Tap toastText="One trunk, many branches: both trees rise from a single stem and fold back on themselves." style={{ position: "absolute", left: "112px", top: "352px", height: "36px", padding: "0 12px 0 6px", border: "0", borderRadius: "999px", background: "rgba(255, 255, 255, 0.95)", color: "#2B1B10", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "800", boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)", cursor: "pointer" }}>
        <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#9A4E36", boxShadow: "0 0 0 4px rgba(154, 78, 54, 0.3)" }} />
        {" One trunk, many branches "}
      </Tap>
      <AutoDescribe text="Identified: the Tree of Life jali at Sidi Saiyyed Mosque. A carved stone screen from around 1573, showing intertwined trees with curling palm fronds." />
      <section aria-label="Lens result" style={{ position: "absolute", left: "0", right: "0", top: "476px", bottom: "0", background: "#FFFFFF", borderRadius: "24px 24px 0 0", padding: "8px 20px 0", boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.25)" }}>
        <div style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#DCCDBA", margin: "0 auto" }} />
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ height: "26px", padding: "0 10px 0 6px", borderRadius: "999px", background: "#E3F1E7", color: "#2F7A4A", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>
              Identified
            </span>
          </span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
            {"You're at Sidi Saiyyed Mosque"}
          </span>
        </div>
        <h1 style={{ margin: "8px 0 0", fontSize: "22px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.01em" }}>
          Tree of Life jali
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: "600", color: "#A0522D" }}>
          Carved stone screen · c. 1573
        </p>
        <p style={{ margin: "10px 0 0", fontSize: "14px", lineHeight: "1.5", color: "#5A4434", textWrap: "pretty" }}>
          Intertwined trees with curling palm fronds, cut so finely the stone reads like lace. Tap a dot to learn what each detail means.
        </p>
        <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
          <Link href="/story" style={{ flex: "1", height: "52px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
            </svg>
            {" Hear its story · 0:50 "}
          </Link>
          <Toggle storeKey="saved" field="lens-tree" onLabel="Saved to your photo journal. Remove" offLabel="Save to your photos journal" onToast="Saved to your photo journal" offToast="Removed from your journal" style={{ flex: "0 0 52px", width: "52px", height: "52px", borderRadius: "14px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            on={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#9A4E36" stroke="#9A4E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            }
            off={<>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </>}
          />
        </div>
        <p style={{ margin: "14px 0 0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
          ASK VIRASA AI
        </p>
        <div className="hscroll" style={{ margin: "8px -20px 0", padding: "0 20px", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
          <Tap ask="Who carved the Tree of Life jali?" style={{ flex: "0 0 auto", height: "44px", padding: "0 14px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FBF6EE", color: "#2B1B10", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            Who carved it?
          </Tap>
          <Tap ask="How is a stone jali like this made?" style={{ flex: "0 0 auto", height: "44px", padding: "0 14px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FBF6EE", color: "#2B1B10", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            How was it made?
          </Tap>
          <Tap ask="Where can I see similar jalis nearby?" style={{ flex: "0 0 auto", height: "44px", padding: "0 14px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FBF6EE", color: "#2B1B10", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            Similar jalis nearby
          </Tap>
        </div>
      </section>
    </div>
  );
}
