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

// Anek, by Ek Type: one family drawn for Latin and every Indian script the app
// speaks, so a screen reads the same in English, Hindi or Tamil. Each script is
// served as its own subset, so a phone only downloads the scripts on screen.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Anek+Latin:wdth,wght@75..125,400..800" +
  "&family=Anek+Devanagari:wght@400..800&family=Anek+Gujarati:wght@400..800" +
  "&family=Anek+Tamil:wght@400..800&family=Anek+Bangla:wght@400..800" +
  "&family=Anek+Telugu:wght@400..800&family=Anek+Kannada:wght@400..800" +
  "&family=Anek+Malayalam:wght@400..800&family=Anek+Gurmukhi:wght@400..800&display=swap";

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
