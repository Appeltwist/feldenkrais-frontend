import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import ForestFooter from "@/components/ForestFooter";
import Header from "@/components/Header";
import MobileFixedFooter from "@/components/MobileFixedFooter";
import { fetchSiteConfig } from "@/lib/api";
import type { SiteConfig } from "@/lib/site-context";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { SiteProvider } from "@/lib/site-context";

const FL_CONFIG: SiteConfig = {
  siteName: "Forest Lighthouse",
  centerSlug: "forest-lighthouse",
  defaultLocale: "en",
  brand: {
    colorPrimary: "#14524d",
    colorSecondary: "#2f6e79",
    colorAccent: "#d4a64a",
    fontFamily: "Manrope, system-ui, sans-serif",
  },
  center: {
    slug: "forest-lighthouse",
    name: "Forest Lighthouse",
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/forest_lighthouse/" },
    ],
  },
};

const FALLBACK_CONFIGS: Record<string, SiteConfig> = {
  "forest-lighthouse.local": FL_CONFIG,
  "localhost": FL_CONFIG,
  "127.0.0.1": FL_CONFIG,
};

import "./globals.css";

export const metadata: Metadata = {
  title: "Feldenkrais Frontend",
  description: "Multi-site frontend for Feldenkrais Education",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  let siteConfig: Awaited<ReturnType<typeof fetchSiteConfig>> | null = null;

  try {
    siteConfig = await fetchSiteConfig(hostname);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to resolve site config, trying fallback", error);
    }
    siteConfig = FALLBACK_CONFIGS[hostname] ?? null;
  }

  if (!siteConfig) {
    return (
      <html lang="en">
        <body>
          <main className="error-shell">
            <h1>Unable to load site configuration</h1>
            <p>Hostname: {hostname}</p>
            <p>Check backend API availability and domain mapping.</p>
          </main>
        </body>
      </html>
    );
  }

  const isForestLighthouse = siteConfig.centerSlug === "forest-lighthouse";

  const themeStyle = {
    "--color-primary": siteConfig.brand.colorPrimary,
    "--color-secondary": siteConfig.brand.colorSecondary,
    "--color-accent": siteConfig.brand.colorAccent,
    "--font-family": siteConfig.brand.fontFamily,
  } as CSSProperties;

  const bodyClass = isForestLighthouse ? "site-forest-lighthouse" : "";

  return (
    <html lang={locale}>
      {isForestLighthouse && (
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
      )}
      <body className={bodyClass} data-center={siteConfig.centerSlug} style={themeStyle}>
        <div className="page-wrapper">
          <SiteProvider hostname={hostname} initialSiteConfig={siteConfig}>
            {isForestLighthouse && <AnnouncementBar locale={locale} />}
            {process.env.NODE_ENV === "development" ? (
              <div className="dev-debug-bar">
                hostname: {hostname} | centerSlug: {siteConfig.centerSlug} | defaultLocale:{" "}
                {siteConfig.defaultLocale} | locale: {locale}
              </div>
            ) : null}
            <Header />
            <main className={isForestLighthouse ? "" : "main-shell"}>{children}</main>
            {isForestLighthouse ? <ForestFooter locale={locale} /> : <Footer />}
            {isForestLighthouse && <MobileFixedFooter locale={locale} />}
          </SiteProvider>
        </div>
      </body>
    </html>
  );
}
