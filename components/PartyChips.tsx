"use client";

// "Who's travelling?" — the same chips in onboarding and Settings.
import { useStored } from "@/lib/store";
import { useT, type Key } from "@/lib/i18n";
import { DEFAULT_PROFILE, PARTIES, type Profile } from "@/lib/profile";

export default function PartyChips() {
  const t = useT();
  const [profile, setProfile] = useStored<Profile>("profile", DEFAULT_PROFILE);
  return (
    <div role="radiogroup" aria-label={t("trip.who")} style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {PARTIES.map((p) => {
        const on = profile.party === p.id;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setProfile((x) => ({ ...DEFAULT_PROFILE, ...x, party: p.id }))}
            style={{ height: "48px", padding: "0 14px 0 10px", borderRadius: "999px", border: `1.5px solid ${on ? "#9A4E36" : "#E2D3C1"}`, background: on ? "#FBEDE6" : "#FFFFFF", color: on ? "#7E3D29" : "#2B1B10", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "background-color 0.18s ease, border-color 0.18s ease" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={p.icon} />
            </svg>
            {t(`who.${p.id}` as Key)}
            {on ? (
              <svg className="pop-in" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
