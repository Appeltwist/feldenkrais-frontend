import type { SectionBlock } from "@/lib/types";

export type SocialLink = {
  label: string;
  url: string;
};

export type SiteNavItem = {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: SiteNavItem[];
};

export type SiteFooterLink = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type SiteFooterGroup = {
  title: string;
  links: SiteFooterLink[];
};

export type SiteFooterContact = {
  heading?: string | null;
  body?: string | null;
  phone?: string | null;
  email?: string | null;
  mapUrl?: string | null;
};

export type SiteFooter = {
  groups: SiteFooterGroup[];
  contact: SiteFooterContact | null;
  socials: SocialLink[];
};

export type SiteAnnouncement = {
  enabled: boolean;
  text?: string | null;
  linkLabel?: string | null;
  url?: string | null;
};

export type Brand = {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  fontFamily: string;
  fontFamilyToken?: string;
  headingFontFamily?: string;
  backgroundColor?: string;
  ctaPrimaryColor?: string;
  ctaHoverColor?: string;
  textColor?: string;
  headingColor?: string;
  logoUrl?: string;
};

export type Center = {
  slug: string;
  name: string;
  socials: SocialLink[];
};

export type SiteConfig = {
  siteName: string;
  siteSlug: string;
  centerSlug: string;
  defaultLocale: string;
  locales: string[];
  brand: Brand;
  center: Center;
  nav: SiteNavItem[];
  footer: SiteFooter;
  announcement: SiteAnnouncement | null;
};

export type NarrativePageHero = {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
};

export type NarrativePagePrimaryCta = {
  label: string;
  url: string;
} | null;

export type NarrativePage = {
  routeKey: string;
  locale: string;
  title: string;
  subtitle?: string | null;
  hero: NarrativePageHero;
  sections: SectionBlock[];
  primaryCta: NarrativePagePrimaryCta;
  seo?: {
    title?: string | null;
    description?: string | null;
  };
};

export function isForestSite(centerSlug: string) {
  return centerSlug === "forest-lighthouse";
}

export function isEducationSite(centerSlug: string) {
  return !isForestSite(centerSlug);
}
