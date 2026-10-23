// 17 · System states


export default function StatesScreen() {
  return (
    <div style={{ width: "1250px", height: "900px", position: "relative", overflow: "hidden", background: "#F4EEE6", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "40px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "56px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2px" }}>
          <span style={{ fontSize: "16px", fontWeight: "800" }}>
            Loading
          </span>
          <span style={{ fontSize: "13px", color: "#5A4434" }}>
            Skeleton keeps the layout steady while content arrives
          </span>
        </div>
        <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", borderRadius: "28px", border: "1px solid #E6D8C4" }}>
          <div style={{ padding: "54px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 8px 20px rgba(90, 60, 30, 0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/images/845c09135def6279c007582842533707.png" alt="" style={{ width: "46px", height: "50px", objectFit: "contain", display: "block" }} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
                <span style={{ fontSize: "24px", fontWeight: "800" }}>
                  Virasa
                </span>
                <span style={{ marginTop: "5px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.16em", color: "#8A6424" }}>
                  HERITAGE AI
                </span>
              </div>
            </div>
            <span style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#F3ECE2" }} />
          </div>
          <div aria-hidden="true" style={{ padding: "22px 20px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#F3ECE2" }} />
              <span style={{ width: "150px", height: "14px", borderRadius: "7px", background: "#F3ECE2" }} />
              <span style={{ marginLeft: "auto", width: "64px", height: "30px", borderRadius: "999px", background: "#F3ECE2" }} />
            </div>
            <span style={{ marginTop: "10px", width: "110px", height: "12px", borderRadius: "6px", background: "#F3ECE2" }} />
            <span style={{ width: "300px", height: "24px", borderRadius: "8px", background: "#F3ECE2" }} />
            <span style={{ width: "190px", height: "24px", borderRadius: "8px", background: "#F3ECE2" }} />
            <span style={{ marginTop: "6px", height: "58px", borderRadius: "16px", background: "#F3ECE2" }} />
            <div style={{ marginTop: "6px", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
              <span style={{ height: "90px", borderRadius: "18px", background: "#F3ECE2" }} />
              <span style={{ height: "90px", borderRadius: "18px", background: "#F3ECE2" }} />
              <span style={{ height: "90px", borderRadius: "18px", background: "#F3ECE2" }} />
              <span style={{ height: "90px", borderRadius: "18px", background: "#F3ECE2" }} />
            </div>
            <span style={{ marginTop: "16px", width: "180px", height: "18px", borderRadius: "8px", background: "#F3ECE2" }} />
            <span style={{ width: "240px", height: "12px", borderRadius: "6px", background: "#F3ECE2" }} />
            <div style={{ marginTop: "6px", display: "flex", gap: "14px" }}>
              <span style={{ flex: "0 0 300px", height: "300px", borderRadius: "20px", background: "#F3ECE2" }} />
              <span style={{ flex: "0 0 300px", height: "300px", borderRadius: "20px", background: "#F3ECE2" }} />
            </div>
          </div>
          <nav aria-label="Main" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "90px", padding: "10px 4px 24px", background: "#EBCFA3", borderRadius: "24px 24px 0 0", display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", boxShadow: "0 -8px 24px rgba(90, 60, 30, 0.10)" }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#7E3D29", fontSize: "12px", fontWeight: "800" }}>
              <span style={{ width: "58px", height: "32px", borderRadius: "999px", background: "#FBEDE6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              <span>
                Home
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#5C3D24", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </span>
              <span>
                Saved
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#5C3D24", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </span>
              <span>
                Explore
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#5C3D24", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                  <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
                  <path fill="currentColor" stroke="none" d="M12 6.6l.85 2.1 2.1.85-2.1.85L12 12.5l-.85-2.1-2.1-.85 2.1-.85z" />
                </svg>
              </span>
              <span>
                AI Guide
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#5C3D24", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4.5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </span>
              <span>
                Profile
              </span>
            </span>
          </nav>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "56px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2px" }}>
          <span style={{ fontSize: "16px", fontWeight: "800" }}>
            Offline
          </span>
          <span style={{ fontSize: "13px", color: "#5A4434" }}>
            Downloaded city packs keep the trip going
          </span>
        </div>
        <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", borderRadius: "28px", border: "1px solid #E6D8C4" }}>
          <div style={{ padding: "54px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 8px 20px rgba(90, 60, 30, 0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/images/845c09135def6279c007582842533707.png" alt="" style={{ width: "46px", height: "50px", objectFit: "contain", display: "block" }} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
                <span style={{ fontSize: "24px", fontWeight: "800" }}>
                  Virasa
                </span>
                <span style={{ marginTop: "5px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.16em", color: "#8A6424" }}>
                  HERITAGE AI
                </span>
              </div>
            </div>
            <span style={{ width: "50px", height: "50px", borderRadius: "50%", padding: "3px", background: "#8A6424" }}>
              <img src="/images/09fefb6e9530a2db07f9fdf176246976.jpg" alt="" style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", display: "block", border: "2px solid #FFFFFF" }} />
            </span>
          </div>
          <div role="status" style={{ margin: "18px 20px 0", padding: "14px", borderRadius: "16px", background: "#2B1B10", color: "#FBF6EE", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3D9A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 22px" }}>
              <path d="M12 20h.01" />
              <path d="M8.5 16.429a5 5 0 0 1 7 0" />
              <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
              <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
              <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
              <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
              <path d="m2 2 20 20" />
            </svg>
            <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "15px", fontWeight: "800" }}>
                {"You're offline"}
              </span>
              <span style={{ fontSize: "13px", lineHeight: "1.45", color: "#D9C6AE" }}>
                Using your Ahmedabad pack. Stories, maps and walks still work.
              </span>
            </span>
            <button type="button" style={{ height: "36px", padding: "0 10px", border: "0", borderRadius: "10px", background: "rgba(251, 246, 238, 0.12)", color: "#FBF6EE", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
              Retry
            </button>
          </div>
          <div style={{ margin: "18px 20px 0", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
            <span style={{ height: "90px", paddingTop: "16px", border: "1.5px solid #D9C7B3", borderRadius: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E3D29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4.5l-2-2.5h-3l-2 2.5H4a2 2 0 0 1-2-2z" />
                <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V7" />
              </svg>
              AR Tour
            </span>
            <span style={{ height: "90px", paddingTop: "16px", border: "1.5px solid #D9C7B3", borderRadius: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", textAlign: "center", lineHeight: "1.15" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E3D29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
              </svg>
              Audio stories
            </span>
            <span style={{ height: "90px", paddingTop: "16px", border: "1.5px dashed #D9C7B3", borderRadius: "18px", background: "#FAF6F0", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "#6F5B4B", textAlign: "center", lineHeight: "1.2" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9C8A78" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="7 4 19 12 7 20 7 4" />
              </svg>
              Reels need internet
            </span>
            <span style={{ height: "90px", paddingTop: "16px", border: "1.5px solid #D9C7B3", borderRadius: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700", textAlign: "center", lineHeight: "1.15" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E3D29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                <path d="M7 2v20" />
                <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
              </svg>
              Local bites
            </span>
          </div>
          <h2 style={{ margin: "26px 20px 0", fontSize: "19px", fontWeight: "800" }}>
            Ready offline
          </h2>
          <ul style={{ listStyle: "none", margin: "10px 0 0", padding: "0 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", border: "1px solid #EFE6DA", borderRadius: "16px" }}>
              <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ flex: "0 0 56px", width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "15px", fontWeight: "800" }}>
                  Sidi Saiyyed Mosque
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  Story, map and directions
                </span>
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F7A4A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Downloaded">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", border: "1px solid #EFE6DA", borderRadius: "16px" }}>
              <span style={{ flex: "0 0 56px", width: "56px", height: "56px", borderRadius: "12px", background: "#2B1B10", color: "#F3D9A8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="6" cy="19" r="3" />
                  <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                  <circle cx="18" cy="5" r="3" />
                </svg>
              </span>
              <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "15px", fontWeight: "800" }}>
                  Old City in a morning
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  Walk · 6 stops
                </span>
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F7A4A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Downloaded">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", border: "1px solid #EFE6DA", borderRadius: "16px" }}>
              <img src="/images/6b114a4ce322f517be6c561ea38233e8.jpg" alt="" style={{ flex: "0 0 56px", width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "15px", fontWeight: "800" }}>
                  Dhal ni Pol
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  Story and map
                </span>
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F7A4A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Downloaded">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </li>
          </ul>
          <nav aria-label="Main" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "90px", padding: "10px 4px 24px", background: "#EBCFA3", borderRadius: "24px 24px 0 0", display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", boxShadow: "0 -8px 24px rgba(90, 60, 30, 0.10)" }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#7E3D29", fontSize: "12px", fontWeight: "800" }}>
              <span style={{ width: "58px", height: "32px", borderRadius: "999px", background: "#FBEDE6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              <span>
                Home
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#5C3D24", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </span>
              <span>
                Saved
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#5C3D24", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </span>
              <span>
                Explore
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#5C3D24", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                  <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
                  <path fill="currentColor" stroke="none" d="M12 6.6l.85 2.1 2.1.85-2.1.85L12 12.5l-.85-2.1-2.1-.85 2.1-.85z" />
                </svg>
              </span>
              <span>
                AI Guide
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "#5C3D24", fontSize: "12px", fontWeight: "600" }}>
              <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4.5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              </span>
              <span>
                Profile
              </span>
            </span>
          </nav>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "56px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2px" }}>
          <span style={{ fontSize: "16px", fontWeight: "800" }}>
            No results nearby
          </span>
          <span style={{ fontSize: "13px", color: "#5A4434" }}>
            Explain why, then offer the next best step
          </span>
        </div>
        <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", borderRadius: "28px", border: "1px solid #E6D8C4" }}>
          <div style={{ padding: "54px 16px 0 8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ flex: "0 0 44px", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2B1B10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </span>
            <span style={{ flex: "1", height: "50px", border: "1.5px solid #9A4E36", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px", padding: "0 14px", fontSize: "16px", fontWeight: "600" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              rani ki vav
            </span>
          </div>
          <div style={{ padding: "56px 28px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div role="img" aria-label="Illustration placeholder: stepwell" style={{ width: "140px", height: "140px", borderRadius: "50%", background: "#EFE1C9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="84" height="84" viewBox="0 0 80 80" fill="none" stroke="#9C7A55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 18h68" />
                <path d="M14 30h52" />
                <path d="M22 42h36" />
                <path d="M30 54h20" />
                <path d="M36 66h8" />
                <path d="M14 30V18M66 30V18M22 42V30M58 42V30M30 54V42M50 54V42" />
              </svg>
            </div>
            <h1 style={{ margin: "26px 0 0", fontSize: "22px", lineHeight: "1.25", fontWeight: "800", letterSpacing: "-0.01em", textWrap: "balance" }}>
              Rani ki Vav is in Patan, 125 km away
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#5A4434", textWrap: "pretty" }}>
              Nothing by that name within walking distance — but this UNESCO-listed stepwell makes a great day trip.
            </p>
          </div>
          <div style={{ margin: "26px 24px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
            <button type="button" style={{ height: "52px", border: "0", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
              Plan a day trip to Patan
            </button>
            <button type="button" style={{ height: "52px", borderRadius: "14px", border: "1.5px solid #9A4E36", background: "#FFFFFF", color: "#9A4E36", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
              Show stepwells near me
            </button>
          </div>
          <p style={{ margin: "28px 24px 0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
            STEPWELLS CLOSER TO YOU
          </p>
          <div style={{ margin: "10px 24px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ minHeight: "48px", padding: "0 14px", borderRadius: "12px", background: "#F6F1EA", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", fontWeight: "700" }}>
              Dada Harir Stepwell
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
                6 km
              </span>
            </span>
            <span style={{ minHeight: "48px", padding: "0 14px", borderRadius: "12px", background: "#F6F1EA", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", fontWeight: "700" }}>
              Adalaj Stepwell
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
                18 km
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
