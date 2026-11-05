"use client";

// The traveller's stamp count, for screens rendered on the server.
import { useStored } from "@/lib/store";
import type { Stamp } from "@/lib/stamps";
import { useT } from "@/lib/i18n";

const useCount = () => Object.keys(useStored<Record<string, Stamp>>("stamps", {})[0]).length;

export function StampCount() {
  const n = useCount();
  const t = useT();
  return <>{t("gm.stamps", { n })}</>;
}

// Points earned in quizzes and puzzles.
export function Points() {
  const [n] = useStored<number>("points", 0);
  const t = useT();
  return <>{t("gm.points", { n })}</>;
}

export function StampBar() {
  const n = useCount();
  return <div style={{ width: `${Math.min(100, n * 10)}%`, height: "100%", borderRadius: "999px", background: "#8A6424" }} />;
}
