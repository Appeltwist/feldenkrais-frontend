"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { SiteConfig } from "@/lib/site-config";

export type { Brand, Center, SiteAnnouncement, SiteConfig, SiteFooter, SiteFooterContact, SiteFooterGroup, SiteNavItem, SocialLink } from "@/lib/site-config";

export type MobileBookingCta = {
  href: string;
  label?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryIcon?: string | null;
} | null;

export type LocaleSwitchPaths = {
  en?: string;
  fr?: string;
} | null;

export type SiteContextValue = SiteConfig & {
  hostname: string;
  mobileBookingCta: MobileBookingCta;
  setMobileBookingCta: (value: MobileBookingCta) => void;
  localeSwitchPaths: LocaleSwitchPaths;
  setLocaleSwitchPaths: (value: LocaleSwitchPaths) => void;
};

const defaultSiteContext: SiteContextValue = {
  hostname: "localhost",
  siteName: "Feldenkrais",
  siteSlug: "forest-lighthouse",
  centerSlug: "forest-lighthouse",
  defaultLocale: "en",
  locales: ["en", "fr"],
  brand: {
    colorPrimary: "#14524d",
    colorSecondary: "#2f6e79",
    colorAccent: "#d4a64a",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
  },
  center: {
    slug: "forest-lighthouse",
    name: "Forest Lighthouse",
    socials: [],
  },
  nav: [],
  footer: {
    groups: [],
    contact: null,
    socials: [],
  },
  announcement: null,
  mobileBookingCta: null,
  setMobileBookingCta: () => undefined,
  localeSwitchPaths: null,
  setLocaleSwitchPaths: () => undefined,
};

const SiteContext = createContext<SiteContextValue>(defaultSiteContext);

type SiteProviderProps = {
  hostname: string;
  initialSiteConfig: SiteConfig;
  children: ReactNode;
};

export function SiteProvider({ hostname, initialSiteConfig, children }: SiteProviderProps) {
  const [mobileBookingCta, setMobileBookingCta] = useState<MobileBookingCta>(null);
  const [localeSwitchPaths, setLocaleSwitchPaths] = useState<LocaleSwitchPaths>(null);

  const value = useMemo(
    () => ({
      hostname,
      ...initialSiteConfig,
      mobileBookingCta,
      setMobileBookingCta,
      localeSwitchPaths,
      setLocaleSwitchPaths,
    }),
    [hostname, initialSiteConfig, mobileBookingCta, localeSwitchPaths],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContext() {
  return useContext(SiteContext);
}
