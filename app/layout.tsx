import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

import AnnouncementBar from "@/components/AnnouncementBar";
import AboutSubNav from "@/components/about/AboutSubNav";
import CoursSubNav from "@/components/classes/CoursSubNav";
import EducationAnnouncement from "@/components/education/EducationAnnouncement";
import EducationFooter from "@/components/education/EducationFooter";
import EducationHeader from "@/components/education/EducationHeader";
import ForestFooter from "@/components/ForestFooter";
import Header from "@/components/Header";
import MobileFixedFooter from "@/components/MobileFixedFooter";
import { fetchSiteConfig } from "@/lib/api";
import { getEducationFallbackSiteConfig, mergeEducationSiteConfig } from "@/lib/education-content";
import { resolveApiHostname } from "@/lib/hostname-routing";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import type { SiteConfig } from "@/lib/site-config";
import { SiteProvider } from "@/lib/site-context";

const FL_CONFIG: SiteConfig = {
  siteName: "Forest Lighthouse",
  siteSlug: "forest-lighthouse",
  centerSlug: "forest-lighthouse",
  defaultLocale: "en",
  locales: ["en", "fr"],
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
  nav: [],
  footer: {
    groups: [],
    contact: null,
    socials: [{ label: "Instagram", url: "https://www.instagram.com/forest_lighthouse/" }],
  },
  announcement: null,
};

const FALLBACK_CONFIGS: Record<string, SiteConfig> = {
  "forest-lighthouse.local": FL_CONFIG,
  "forest-lighthouse.be": FL_CONFIG,
  "www.forest-lighthouse.be": FL_CONFIG,
  "localhost": FL_CONFIG,
  "127.0.0.1": FL_CONFIG,
};

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const hostname = await getHostname();
  const requestLocale = await getRequestLocale("en");
  const apiHostname = resolveApiHostname(hostname);

  let siteConfig: Awaited<ReturnType<typeof fetchSiteConfig>> | null = null;

  try {
    siteConfig = await fetchSiteConfig(hostname, requestLocale);
  } catch {
    siteConfig = FALLBACK_CONFIGS[apiHostname] ?? null;
  }

  if (!siteConfig || siteConfig.centerSlug !== "forest-lighthouse") {
    siteConfig = mergeEducationSiteConfig(
      getEducationFallbackSiteConfig(apiHostname, requestLocale),
      siteConfig,
    );
  }

  if (siteConfig?.centerSlug === "forest-lighthouse") {
    return {
      title: "Forest Lighthouse",
      description: "Forest Lighthouse — embodied learning, classes, workshops, trainings, and individual sessions.",
      icons: {
        icon: [
          {
            url: "/brands/forest-lighthouse/logo/forest-lighthouse-tab-icon.svg",
            type: "image/svg+xml",
          },
        ],
        shortcut: ["/brands/forest-lighthouse/logo/forest-lighthouse-tab-icon.svg"],
      },
    };
  }

  return {
    title: siteConfig?.siteName || "Feldenkrais Education",
    description: "Feldenkrais Education",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const hostname = await getHostname();
  const requestLocale = await getRequestLocale("en");
  const apiHostname = resolveApiHostname(hostname);
  let siteConfig: Awaited<ReturnType<typeof fetchSiteConfig>> | null = null;

  try {
    siteConfig = await fetchSiteConfig(hostname, requestLocale);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to resolve site config, trying fallback", error);
    }
    siteConfig = FALLBACK_CONFIGS[apiHostname] ?? null;
  }

  if (!siteConfig || siteConfig.centerSlug !== "forest-lighthouse") {
    siteConfig = mergeEducationSiteConfig(
      getEducationFallbackSiteConfig(apiHostname, requestLocale),
      siteConfig,
    );
  }

  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (!siteConfig) {
    const isVercelPreview = hostname.includes("vercel.app");

    return (
      <html lang="en">
        <body>
          <main className="error-shell">
            <h1>Unable to load site configuration</h1>
            <p>Hostname: {hostname}</p>
            <p>Check backend API availability and domain mapping.</p>
            {isVercelPreview ? (
              <p>
                If you are testing on Vercel before the DNS switch, set{" "}
                <code>SITE_HOSTNAME_OVERRIDE</code> to a hostname the CMS already knows, for
                example <code>forest-lighthouse.be</code>.
              </p>
            ) : null}
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
    "--heading-font-family": siteConfig.brand.headingFontFamily || siteConfig.brand.fontFamily,
    "--background": siteConfig.brand.backgroundColor || (isForestLighthouse ? "#f6f8fa" : "#f2f2f2"),
    "--foreground": siteConfig.brand.textColor || (isForestLighthouse ? "#15202b" : "#44464c"),
    "--heading-color": siteConfig.brand.headingColor || (isForestLighthouse ? "#15202b" : "#333333"),
    "--cta-primary": siteConfig.brand.ctaPrimaryColor || siteConfig.brand.colorPrimary,
    "--cta-hover": siteConfig.brand.ctaHoverColor || siteConfig.brand.colorSecondary,
  } as CSSProperties;

  const bodyClass = isForestLighthouse ? "site-forest-lighthouse" : "site-education";
  const showDebugBar =
    process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_SHOW_DEBUG_BAR === "1";

  return (
    <html lang={locale}>
      {isForestLighthouse ? (
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
      ) : (
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap"
            rel="stylesheet"
          />
        </head>
      )}
      <body className={bodyClass} data-center={siteConfig.centerSlug} style={themeStyle}>
        <div className="page-wrapper">
          <SiteProvider hostname={hostname} initialSiteConfig={siteConfig}>
            {isForestLighthouse ? <AnnouncementBar locale={locale} /> : <EducationAnnouncement />}
            {showDebugBar ? (
              <div className="dev-debug-bar">
                hostname: {hostname} | centerSlug: {siteConfig.centerSlug} | defaultLocale:{" "}
                {siteConfig.defaultLocale} | locale: {locale}
              </div>
            ) : null}
            {isForestLighthouse ? <Header /> : <EducationHeader />}
            {isForestLighthouse ? <AboutSubNav /> : null}
            {isForestLighthouse ? <CoursSubNav /> : null}
            <main className={isForestLighthouse ? "" : "education-main-shell"}>{children}</main>
            {isForestLighthouse ? <ForestFooter locale={locale} /> : <EducationFooter locale={locale} />}
            {isForestLighthouse && <MobileFixedFooter locale={locale} />}
          </SiteProvider>
        </div>
      </body>
    </html>
  );
}
