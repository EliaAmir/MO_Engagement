import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Amiri } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LangProvider } from "@/components/LangProvider";
import Cursor from "@/components/Cursor";
import FilmGrain from "@/components/FilmGrain";

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

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-amiri",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Onur & Marina â€” Engagement Invitation",
    template: "%s Â· Onur & Marina",
  },
  description:
    "You are cordially invited to the engagement of Onur & Marina, Saturday, September 13, 2026 at 7:00 PM, Dar Gardenia Wedding Halls, Cairo.",
  applicationName: "Onur & Marina Engagement",
  authors: [{ name: "Onur & Marina" }],
  creator: "Onur & Marina",
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
    siteName: "Onur & Marina â€” Engagement",
    title: "Onur & Marina â€” Engagement Invitation",
    description:
      "Saturday, September 13, 2026 at 7:00 PM Â· Dar Gardenia Wedding Halls, Tulip Hall, Cairo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onur & Marina â€” Engagement Invitation",
    description:
      "Saturday, September 13, 2026 at 7:00 PM Â· Dar Gardenia Wedding Halls, Cairo.",
  },
  category: "event",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
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
      data-theme="dark"
      className={`${cinzel.variable} ${cormorant.variable} ${amiri.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('mo_theme_v1');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
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
