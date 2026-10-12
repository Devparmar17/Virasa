"use client";

import { useEffect } from "react";

// Fades blocks up as they scroll into view. Blocks already on screen when the
// page opens are left to the entrance animation in globals.css.
export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const blocks = document.querySelectorAll(
      ".screen section, .screen > div > *:not(:has(section)):not(.nav-rail), .screen > div > main > *:not(:has(section))"
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          entry.target.animate(
            [
              { opacity: 0, translate: "0 22px" },
              { opacity: 1, translate: "0 0" },
            ],
            { duration: 520, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
          );
        }
      },
      { threshold: 0.06 }
    );
    blocks.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
