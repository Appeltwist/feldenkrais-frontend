"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Brand = {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  fontFamily: string;
  logoUrl?: string;
};

export type SocialLink = {
  label: string;
  url: string;
};

export type Center = {
  slug: string;
  name: string;
  socials: SocialLink[];
};

export type SiteConfig = {
  siteName: string;
  centerSlug: string;
  defaultLocale: string;
  brand: Brand;
  center: Center;
};

export type MobileBookingCta = {
  href: string;
  label?: string;
} | null;

export type SiteContextValue = SiteConfig & {
  hostname: string;
  mobileBookingCta: MobileBookingCta;
  setMobileBookingCta: (value: MobileBookingCta) => void;
};

const defaultSiteContext: SiteContextValue = {
  hostname: "localhost",
  siteName: "Feldenkrais",
  centerSlug: "forest-lighthouse",
  defaultLocale: "en",
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
  mobileBookingCta: null,
  setMobileBookingCta: () => undefined,
};

const SiteContext = createContext<SiteContextValue>(defaultSiteContext);

type SiteProviderProps = {
  hostname: string;
  initialSiteConfig: SiteConfig;
  children: ReactNode;
};

export function SiteProvider({ hostname, initialSiteConfig, children }: SiteProviderProps) {
  const [mobileBookingCta, setMobileBookingCta] = useState<MobileBookingCta>(null);

  const value = useMemo(
    () => ({
      hostname,
      ...initialSiteConfig,
      mobileBookingCta,
      setMobileBookingCta,
    }),
    [hostname, initialSiteConfig, mobileBookingCta],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContext() {
  return useContext(SiteContext);
}
