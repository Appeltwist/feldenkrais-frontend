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
  localeMode: OfferLocaleMode = "site-default",
): Promise<OfferRouteData> {
  const [hostname, origin] = await Promise.all([getHostname(), getOrigin()]);
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale =
    localeMode === "request"
      ? await getRequestLocale(siteConfig?.defaultLocale ?? "en")
      : siteConfig?.defaultLocale ?? "en";

  if (!siteConfig) {
    return {
      hostname,
      origin,
      locale,
      siteConfig: null,
      offer: null,
      notFound: false,
    };
  }

  try {
    const offer = await fetchOfferDetail({
      hostname,
      slug,
      center: siteConfig.centerSlug,
      locale,
    });

    return {
      hostname,
      origin,
      locale,
      siteConfig,
      offer,
      notFound: false,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return {
        hostname,
        origin,
        locale,
        siteConfig,
        offer: null,
        notFound: true,
      };
    }

    throw error;
  }
}
