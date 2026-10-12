"use client";

import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useStored } from "@/lib/store";
import { toast } from "./Toast";

// Shares through the system share sheet, or copies the link when there isn't one.
export async function share(title: string, text?: string) {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  } catch (e) {
    if ((e as Error)?.name !== "AbortError") toast("Couldn't share right now");
  }
}

// Hands a question to the AI Guide screen, which asks it on arrival.
export function useAsk() {
  const router = useRouter();
  return (question: string) => {
    try {
      window.sessionStorage.setItem("virasa:ask", question);
    } catch {
      // The guide just opens without the question.
    }
    router.push("/ai-guide");
  };
}

// A quick bounce that confirms a press.
export function pop(el: Element) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.animate([{ scale: "1" }, { scale: "1.22" }, { scale: "0.94" }, { scale: "1" }], { duration: 380, easing: "ease-out" });
}

type TapProps =ButtonHTMLAttributes<HTMLButtonElement> & {
  toastText?: string;
  href?: string;
  shareTitle?: string;
  shareText?: string;
  ask?: string;
};

// A button that does one simple thing: confirm, navigate, share, or ask the guide.
export function Tap({ toastText, href, shareTitle, shareText, ask, children, ...rest }: TapProps) {
  const router = useRouter();
  const askGuide = useAsk();
  return (
    <button
      type="button"
      {...rest}
      onClick={() => {
        if (shareTitle) share(shareTitle, shareText);
        if (toastText) toast(toastText);
        if (ask) askGuide(ask);
        else if (href) router.push(href);
      }}
    >
      {children}
    </button>
  );
}

type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  storeKey: string;
  field: string;
  initial?: boolean;
  on: ReactNode;
  off: ReactNode;
  onLabel?: string;
  offLabel?: string;
  onToast?: string;
  offToast?: string;
};

// A persisted on/off button (save, like, mute…) that swaps its content when pressed.
export function Toggle({ storeKey, field, initial = false, on, off, onLabel, offLabel, onToast, offToast, ...rest }: ToggleProps) {
  const [map, setMap] = useStored<Record<string, boolean>>(storeKey, {});
  const active = map[field] ?? initial;
  return (
    <button
      type="button"
      {...rest}
      aria-pressed={active}
      aria-label={(active ? onLabel : offLabel) || rest["aria-label"]}
      onClick={(e) => {
        pop(e.currentTarget);
        setMap((m) => ({ ...m, [field]: !active }));
        const msg = active ? offToast : onToast;
        if (msg) toast(msg);
      }}
    >
      {active ? on : off}
    </button>
  );
}
