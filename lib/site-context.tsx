"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

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

export type SiteContextValue = SiteConfig & {
  hostname: string;
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
};

const SiteContext = createContext<SiteContextValue>(defaultSiteContext);

type SiteProviderProps = {
  hostname: string;
  initialSiteConfig: SiteConfig;
  children: ReactNode;
};

export function SiteProvider({ hostname, initialSiteConfig, children }: SiteProviderProps) {
  const value = useMemo(
    () => ({
      hostname,
      ...initialSiteConfig,
    }),
    [hostname, initialSiteConfig],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContext() {
  return useContext(SiteContext);
}
