import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import CustomCursor from "../components/CustomCursor";
import SmoothScroll from "../components/SmoothScroll";
import NoiseOverlay from "../components/NoiseOverlay";
import IntroSplash from "../components/IntroSplash";
import Footer from "../components/Footer";
import ThemeScroll from "../components/ThemeScroll";
import { Analytics } from "@vercel/analytics/next";
import { getSiteUrl, siteConfig, toAbsoluteUrl } from "../lib/siteConfig";
import { getCategories, getMaintenanceMode } from "../lib/siteSettings";
import { getCustomCollections } from "../lib/categories";
import { headers } from "next/headers";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.defaultTitle,
    template: "%s",
  },
  applicationName: siteConfig.name,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: toAbsoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: `Portfolio photo de ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [toAbsoluteUrl("/opengraph-image")],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// viewport-fit=cover est requis pour que env(safe-area-inset-*) renvoie une valeur
// (encoche/barre gestuelle iPhone, mode PWA epingle).
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");
  const isMaintenance = await getMaintenanceMode();
  const collections = isAdmin ? [] : getCustomCollections(await getCategories());

  if (isMaintenance && !isAdmin) {
    return (
      <html lang="fr" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
        <body className="antialiased bg-paper text-ink" suppressHydrationWarning>
          <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,rgba(188,125,79,0.12),transparent_42%)]" />
            <p className="text-[11px] uppercase tracking-[0.4em] text-ink/40">Portfolio JerryPicsArt</p>
            <h1 className="mt-6 font-serif text-5xl md:text-7xl">Bientôt de retour.</h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-ink/60 md:text-lg">
              Le portfolio est actuellement en cours de mise à jour pour vous offrir une expérience encore plus raffinée.
            </p>
            <div className="mt-12 h-px w-24 bg-line/20" />
            <p className="mt-6 text-[11px] uppercase tracking-widest text-ink/45">Stay tuned</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {!isAdmin ? <IntroSplash /> : null}
        <SmoothScroll>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,rgba(188,125,79,0.18),transparent_42%)]" />
            <NoiseOverlay />
            <CustomCursor />
            {!isAdmin ? <Navbar /> : null}
            <main className={`w-full ${isAdmin ? "pb-16 pt-6" : "pt-20"}`}>{children}</main>
            {!isAdmin ? <ThemeScroll /> : null}
            {!isAdmin ? <Footer collections={collections} /> : null}
            {!isAdmin ? <Analytics /> : null}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
