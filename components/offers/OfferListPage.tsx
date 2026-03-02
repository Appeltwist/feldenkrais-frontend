import Link from "next/link";

import { fetchOffers, fetchSiteConfig, type OfferSummary } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getOfferLabels } from "@/lib/i18n";
import {
  asRecord,
  formatDateTime,
  getOfferSlug,
  getOfferTitle,
  pickString,
  readNextOccurrence,
  type OfferType,
} from "@/lib/offers";

type OfferListPageProps = {
  heading: string;
  offerType: OfferType;
};

export default async function OfferListPage({ heading, offerType }: OfferListPageProps) {
  const hostname = await getHostname();
  let siteConfig: Awaited<ReturnType<typeof fetchSiteConfig>> | null = null;
  let offers: OfferSummary[] = [];

  try {
    siteConfig = await fetchSiteConfig(hostname);
    offers = await fetchOffers({
      hostname,
      center: siteConfig.centerSlug,
      type: offerType,
      locale: siteConfig.defaultLocale,
    });
  } catch {
    return (
      <section className="page-section">
        <h1>{heading}</h1>
        <p>Unable to load offers right now.</p>
      </section>
    );
  }

  const labels = getOfferLabels(siteConfig.defaultLocale);
  const detailsLabel = labels.openDetails;

  return (
    <section className="page-section">
      <h1>{heading}</h1>
      <p>{siteConfig.center.name}</p>
      {offers.length === 0 ? <p>No offers found.</p> : null}
      <div className="cards">
        {offers.map((offer, index) => {
          const offerRecord = asRecord(offer);
          const slug = getOfferSlug(offer);
          const title = getOfferTitle(offer, "Untitled offer");
          const excerpt = pickString(offerRecord, ["excerpt", "summary", "short_description"]);
          const nextOccurrence = readNextOccurrence(offer);
          const nextOccurrenceLabel = formatDateTime(
            nextOccurrence.start,
            siteConfig.defaultLocale,
            nextOccurrence.timezone,
          );

          return (
            <article className="card" key={slug || `offer-${index}`}>
              <h2>{title}</h2>
              {excerpt ? <p>{excerpt}</p> : null}
              <p>
                <strong>{labels.nextOccurrence}:</strong> {nextOccurrenceLabel || "-"}
              </p>
              {slug ? (
                <Link className="text-link" href={`/offer/${slug}`}>
                  {detailsLabel}
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
