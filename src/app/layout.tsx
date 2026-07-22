import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Aref_Ruqaa, Markazi_Text } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LangProvider } from "@/components/LangProvider";
import Cursor from "@/components/Cursor";
import FilmGrain from "@/components/FilmGrain";
import { CONTENT, EVENT } from "@/lib/content";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-cinzel",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-aref",
});

const markaziText = Markazi_Text({
  subsets: ["arabic"],
  weight: ["400"],
  display: "swap",
  variable: "--font-markazi",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

const en = CONTENT.en;
const coupleEn = EVENT.couple.en;
const whenEn = `${EVENT.dateLong.en} at ${EVENT.time.en}`;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: en.meta.title,
    template: `%s · ${coupleEn}`,
  },
  description: en.meta.description,
  applicationName: `${coupleEn} Engagement`,
  authors: [{ name: coupleEn }],
  creator: coupleEn,
  keywords: [
    "Onur and Marina",
    "engagement",
    "invitation",
    "Cairo",
    "Dar Gardenia",
    "September 13 2026",
  ],
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/?lang=ar" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
    url: siteUrl ? `${siteUrl}/` : "/",
    siteName: `${coupleEn} — Engagement`,
    title: en.meta.title,
    description: `${whenEn} · ${EVENT.venue.en}, ${EVENT.hall.en}, Cairo.`,
  },
  twitter: {
    card: "summary_large_image",
    title: en.meta.title,
    description: `${whenEn} · ${EVENT.venue.en}, Cairo.`,
  },
  category: "event",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f2ea",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-theme="light"
      className={`${cinzel.variable} ${cormorant.variable} ${arefRuqaa.variable} ${markaziText.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('mo_theme_v1');if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
          }}
        />
        <SmoothScroll>
          <LangProvider>
            <FilmGrain />
            <Cursor />
            {children}
          </LangProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
