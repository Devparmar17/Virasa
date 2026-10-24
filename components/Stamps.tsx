"use client";

// The traveller's stamp count, for screens rendered on the server.
import { useStored } from "@/lib/store";
import type { Stamp } from "@/lib/stamps";

const useCount = () => Object.keys(useStored<Record<string, Stamp>>("stamps", {})[0]).length;

export function StampCount() {
  const n = useCount();
  return <>{`${n} ${n === 1 ? "stamp" : "stamps"}`}</>;
}

// Points earned in quizzes and puzzles.
export function Points() {
  const [n] = useStored<number>("points", 0);
  return <>{`${n} pts`}</>;
}

export function StampBar() {
  const n = useCount();
  return <div style={{ width: `${Math.min(100, n * 10)}%`, height: "100%", borderRadius: "999px", background: "#8A6424" }} />;
}
