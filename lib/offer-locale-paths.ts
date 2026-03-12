import "server-only";

import { fetchOffers, type OfferSummary } from "@/lib/api";
import { localizePath } from "@/lib/locale-path";
import {
  getCanonicalOfferPathByTypeAndSlug,
  getOfferSlug,
  getOfferType,
} from "@/lib/offers";
import type { LocaleSwitchPaths } from "@/lib/site-context";
import type { OfferDetail } from "@/lib/types";

type BuildOfferLocaleSwitchPathsParams = {
  hostname: string;
  centerSlug: string;
  offer: OfferDetail;
  requestLocale: string;
};

export async function buildOfferLocaleSwitchPaths({
  hostname,
  centerSlug,
  offer,
  requestLocale,
}: BuildOfferLocaleSwitchPathsParams): Promise<LocaleSwitchPaths> {
  const normalizedRequestLocale = requestLocale.toLowerCase().startsWith("fr") ? "fr" : "en";
  const alternateLocale = normalizedRequestLocale === "fr" ? "en" : "fr";
  const offerType = getOfferType(offer);
  const currentSlug = getOfferSlug(offer);

  const paths: LocaleSwitchPaths = {};

  if (currentSlug) {
    paths[normalizedRequestLocale] = localizePath(
      normalizedRequestLocale,
      getCanonicalOfferPathByTypeAndSlug(offerType, currentSlug),
    );
  }

  const alternateOffers = await fetchOffers({
    hostname,
    center: centerSlug,
    locale: alternateLocale,
    type: offerType,
  }).catch(() => [] as OfferSummary[]);

  const alternateOffer = alternateOffers.find(
    (candidate) => String(candidate.id) === String(offer.id),
  );
  const alternateSlug = alternateOffer ? getOfferSlug(alternateOffer) : "";

  if (alternateSlug) {
    paths[alternateLocale] = localizePath(
      alternateLocale,
      getCanonicalOfferPathByTypeAndSlug(offerType, alternateSlug),
    );
  }

  return paths;
}
