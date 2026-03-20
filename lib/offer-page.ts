import type { Metadata } from "next";

import { ApiError, fetchOfferDetail, fetchSiteConfig, type SiteConfig } from "@/lib/api";
import { getHostname, getOrigin } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import {
  getCanonicalOfferPath,
  getDeclaredCanonicalUrl,
  getOfferSeoDescription,
  getOfferSeoTitle,
  getOfferSocialImageUrl,
} from "@/lib/offers";
import type { OfferDetail } from "@/lib/types";

export type OfferLocaleMode = "site-default" | "request";

export type OfferRouteData = {
  hostname: string;
  origin: string;
  locale: string;
  siteConfig: SiteConfig | null;
  offer: OfferDetail | null;
  notFound: boolean;
};

function toAbsoluteUrl(value: string, origin: string) {
  if (!value) {
    return "";
  }

  try {
    return new URL(value, origin).toString();
  } catch {
    return "";
  }
}

export function buildOfferMetadata({
  offer,
  origin,
  siteName,
}: {
  offer: OfferDetail;
  origin: string;
  siteName?: string;
}): Metadata {
  const title = getOfferSeoTitle(offer);
  const description = getOfferSeoDescription(offer);
  const canonicalUrl = toAbsoluteUrl(getDeclaredCanonicalUrl(offer), origin);
  const openGraphUrl = canonicalUrl || toAbsoluteUrl(getCanonicalOfferPath(offer), origin);
  const imageUrl = toAbsoluteUrl(getOfferSocialImageUrl(offer), origin);

  const metadata: Metadata = {};

  if (title) {
    metadata.title = title;
  }

  if (description) {
    metadata.description = description;
  }

  if (canonicalUrl) {
    metadata.alternates = {
      canonical: canonicalUrl,
    };
  }

  if (title || description || openGraphUrl || imageUrl || siteName) {
    metadata.openGraph = {
      type: "website",
      ...(siteName ? { siteName } : {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(openGraphUrl ? { url: openGraphUrl } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title || siteName || "Offer image" }] } : {}),
    };
  }

  return metadata;
}

export async function loadOfferRouteData(
  slug: string,
  localeMode: OfferLocaleMode = "request",
): Promise<OfferRouteData> {
  const [hostname, origin] = await Promise.all([getHostname(), getOrigin()]);
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const requestLocale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");
  const primaryLocale = localeMode === "site-default" ? siteConfig?.defaultLocale ?? requestLocale : requestLocale;

  if (!siteConfig) {
    return {
      hostname,
      origin,
      locale: primaryLocale,
      siteConfig: null,
      offer: null,
      notFound: false,
    };
  }

  const fetchForLocale = async (locale: string) =>
    fetchOfferDetail({
      hostname,
      slug,
      center: siteConfig.centerSlug,
      locale,
    });

  try {
    const offer = await fetchForLocale(primaryLocale);

    return {
      hostname,
      origin,
      locale: primaryLocale,
      siteConfig,
      offer,
      notFound: false,
    };
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error;
    }

    if (primaryLocale !== siteConfig.defaultLocale) {
      try {
        const offer = await fetchForLocale(siteConfig.defaultLocale);

        return {
          hostname,
          origin,
          locale: siteConfig.defaultLocale,
          siteConfig,
          offer,
          notFound: false,
        };
      } catch (retryError) {
        if (!(retryError instanceof ApiError) || retryError.status !== 404) {
          throw retryError;
        }
      }
    }

    return {
      hostname,
      origin,
      locale: primaryLocale,
      siteConfig,
      offer: null,
      notFound: true,
    };
  }
}
