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

  // Lets a mouse drag sideways rows (.hscroll); touch and trackpads already scroll them.
  useEffect(() => {
    let row: HTMLElement | null = null;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const down = (e: MouseEvent) => {
      moved = false;
      if (e.button !== 0) return;
      row = (e.target as HTMLElement).closest<HTMLElement>(".hscroll");
      if (!row || row.scrollWidth <= row.clientWidth) {
        row = null;
        return;
      }
      startX = e.clientX;
      startLeft = row.scrollLeft;
      moved = false;
    };
    const move = (e: MouseEvent) => {
      if (!row) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      moved = true;
      row.classList.add("dragging");
      row.scrollLeft = startLeft - dx;
      e.preventDefault();
    };
    const up = () => {
      row?.classList.remove("dragging");
      row = null;
    };
    // A drag that ends on a card must not also open it.
    const click = (e: MouseEvent) => {
      if (!moved) return;
      moved = false;
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("click", click, true);
    // Stop the browser dragging a card's image or link out of the row instead.
    const dragstart = (e: DragEvent) => {
      if ((e.target as HTMLElement).closest?.(".hscroll")) e.preventDefault();
    };
    document.addEventListener("dragstart", dragstart);
    return () => {
      document.removeEventListener("dragstart", dragstart);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("click", click, true);
    };
  }, []);
  return null;
}
