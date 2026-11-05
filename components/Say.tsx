"use client";

import { useT } from "@/lib/i18n";

// Short place facts written in English ("22 min walk", "Visit by day"), shown
// in the traveller's language. Anything it doesn't recognise is left as written.
export default function Say({ text }: { text: string }) {
  const t = useT();
  const said = text
    .replace(/(\d+) min walk/g, (_, n) => t("unit.min_walk", { n }))
    .replace(/(\d+) min drive/g, (_, n) => t("unit.min_drive", { n }))
    .replace(/^Visit by day$/, t("c.visit_day"))
    .replace(/^Open now$/, t("place.open_now"))
    .replace(/^Always open$/, t("ex.always_open"));
  return <>{said}</>;
}
