import type { Metadata, Viewport } from "next";
import Link from "next/link";
import ToastHost from "@/components/Toast";
import Prefs from "@/components/Prefs";
import { NavTrail } from "@/components/Back";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virasa — Heritage AI",
  description: "Every street has a story. Heritage stories from every corner of India.",
};

// Screens are drawn 390px wide; phones scale that to fit their own width.
export const viewport: Viewport = { width: 390, themeColor: "#FBF6EE" };

const FONTS =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800" +
  "&family=Noto+Sans+Gujarati:wght@500;600;700&family=Noto+Sans+Devanagari:wght@500;600;700" +
  "&family=Noto+Sans+Tamil:wght@500;600&family=Noto+Sans+Bengali:wght@500;600" +
  "&family=Noto+Sans+Telugu:wght@500;600&family=Noto+Sans+Kannada:wght@500;600&family=Noto+Sans+Malayalam:wght@500;600" +
  "&family=Noto+Sans+Gurmukhi:wght@500;600&display=swap";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <main className="stage">{children}</main>
        <ToastHost />
        <Prefs />
        <NavTrail />
        <Link href="/screens" className="screens-link">
          All screens
        </Link>
      </body>
    </html>
  );
}
