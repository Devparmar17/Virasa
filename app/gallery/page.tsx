"use client";

// Photo gallery for Sidi Saiyyed Mosque, with room for the traveller's own shots.
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/Toast";
import { share } from "@/components/Tap";
import { frame, ScreenHeader } from "@/components/ui";

type Photo = { src: string; caption: string; credit: string };

const PHOTOS: Photo[] = [
  { src: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", caption: "The Tree of Life jali, seen from inside the prayer hall", credit: "Virasa" },
  { src: "/images/358cd23211709da539c3303890c27e8b.jpg", caption: "Sidi Saiyyed Mosque — light through the carved screen", credit: "Virasa" },
  { src: "/images/sidi-tree.jpg", caption: "The Tree of Life jali from the street side", credit: "Snehrashmi, CC BY-SA 4.0, via Wikimedia Commons" },
  { src: "/images/sidi-lattice.jpg", caption: "One of the eight geometric screens", credit: "Bernard Gagnon, CC BY-SA 3.0, via Wikimedia Commons" },
  { src: "/images/sidi-exterior.jpg", caption: "The mosque from its garden, with the row of screened arches", credit: "Bernard Gagnon, CC BY-SA 3.0, via Wikimedia Commons" },
];

export default function GalleryScreen() {
  const [mine, setMine] = useState<Photo[]>([]);
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const touchX = useRef<number | null>(null);
  const photos = [...PHOTOS, ...mine];
  const photo = photos[Math.min(index, photos.length - 1)];
  const go = (step: number) => {
    setIndex((i) => (i + step + photos.length) % photos.length);
    setZoomed(false);
  };

  // Photos the traveller adds stay on this phone for the visit; free them on leaving.
  const urls = useRef<string[]>([]);
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const round = { width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "rgba(251, 246, 238, 0.14)", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } as const;

  return (
    <div style={frame({ background: "#1E130B", color: "#FBF6EE", paddingBottom: "40px" })}>
      <ScreenHeader
        dark
        title="Sidi Saiyyed Mosque"
        back="/place"
        action={
          <button type="button" aria-label="Share photo" onClick={() => share("Sidi Saiyyed Mosque", photo.caption)} style={{ ...round, background: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" x2="12" y1="2" y2="15" />
            </svg>
          </button>
        }
      />
      <div
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
        style={{ position: "relative", margin: "8px 0 0", height: "470px", overflow: "hidden", background: "#120B06" }}
      >
        <button type="button" data-plain aria-label={zoomed ? "Zoom out" : "Zoom in"} onClick={() => setZoomed(!zoomed)} style={{ width: "100%", height: "100%", padding: 0, border: 0, background: "none", cursor: zoomed ? "zoom-out" : "zoom-in" }}>
          <img key={photo.src} className="fade-in" src={photo.src} alt={photo.caption} style={{ width: "100%", height: "100%", objectFit: zoomed ? "cover" : "contain", scale: zoomed ? "1.6" : "1", transition: "scale 0.35s ease", display: "block" }} />
        </button>
        {photos.length > 1 ? (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} style={{ ...round, position: "absolute", left: "12px", top: "50%", marginTop: "-22px", background: "rgba(20, 12, 6, 0.55)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} style={{ ...round, position: "absolute", right: "12px", top: "50%", marginTop: "-22px", background: "rgba(20, 12, 6, 0.55)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        ) : null}
        <span style={{ position: "absolute", right: "14px", bottom: "14px", height: "30px", padding: "0 12px", borderRadius: "999px", background: "rgba(20, 12, 6, 0.7)", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", fontVariantNumeric: "tabular-nums" }}>
          {Math.min(index, photos.length - 1) + 1} / {photos.length}
        </span>
      </div>
      <div key={photo.src} className="rise" style={{ padding: "16px 20px 0" }}>
        <p style={{ margin: 0, fontSize: "16px", lineHeight: 1.4, fontWeight: 700 }}>{photo.caption}</p>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#C9B6A0" }}>Photo: {photo.credit}</p>
      </div>
      <div className="hscroll" style={{ margin: "18px 0 0", padding: "0 20px", display: "flex", gap: "10px", overflowX: "auto", scrollbarWidth: "none" }}>
        {photos.map((p, i) => (
          <button key={p.src} type="button" aria-label={`Photo ${i + 1}: ${p.caption}`} aria-pressed={i === index} onClick={() => { setIndex(i); setZoomed(false); }} style={{ flex: "0 0 72px", width: "72px", height: "72px", padding: 0, borderRadius: "14px", border: i === index ? "3px solid #F3D9A8" : "3px solid transparent", background: "none", overflow: "hidden", cursor: "pointer" }}>
            <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </button>
        ))}
        <button type="button" onClick={() => picker.current?.click()} style={{ flex: "0 0 72px", width: "72px", height: "72px", borderRadius: "14px", border: "2px dashed rgba(251, 246, 238, 0.4)", background: "none", color: "#FBF6EE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add yours
        </button>
        <input
          ref={picker}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const src = URL.createObjectURL(file);
            urls.current.push(src);
            setMine((m) => [...m, { src, caption: "Your photo of Sidi Saiyyed Mosque", credit: "You" }]);
            setIndex(photos.length);
            toast("Photo added to this visit");
          }}
        />
      </div>
      <p style={{ margin: "14px 20px 0", fontSize: "12px", lineHeight: 1.45, color: "#A8927C" }}>Photos you add stay on this phone and are not uploaded.</p>
    </div>
  );
}
