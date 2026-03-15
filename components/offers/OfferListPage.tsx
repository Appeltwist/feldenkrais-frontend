import Link from "next/link";

import { ForestPageHero, ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchOffers, fetchSiteConfig, type OfferSummary } from "@/lib/api";
import { FOREST_PAGE_MEDIA, isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getOfferLabels } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";
import {
  asRecord,
  formatDateTime,
  getCanonicalOfferPath,
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

function getForestCollectionCopy(offerType: OfferType, locale: string) {
  const isFrench = locale.toLowerCase().startsWith("fr");

  if (offerType === "TRAINING_INFO") {
    return {
      eyebrow: isFrench ? "Parcours longs" : "Long-form pathways",
      title: isFrench ? "Formations" : "Training",
      subtitle: isFrench
        ? "Des formations et parcours de fond, présentés avec la même clarté visuelle que la page Tarifs."
        : "Longer-form trainings and learning pathways, presented with the same visual clarity as Pricing.",
      mediaUrl: FOREST_PAGE_MEDIA.trainings,
      actionHref: localizePath(locale, "/pricing"),
      actionLabel: isFrench ? "Voir les tarifs" : "See pricing",
    };
  }

  if (offerType === "PRIVATE_SESSION") {
    return {
      eyebrow: isFrench ? "Accompagnement individuel" : "One-to-one guidance",
      title: isFrench ? "Séances individuelles" : "Individual Sessions",
      subtitle: isFrench
        ? "Des séances individuelles et formats personnalisés, dans le même langage visuel que le reste du site Forest."
        : "Individual sessions and personalized formats in the same visual language as the rest of the Forest site.",
      mediaUrl: FOREST_PAGE_MEDIA.privateSessions,
      actionHref: localizePath(locale, "/contact"),
      actionLabel: isFrench ? "Nous écrire" : "Contact us",
    };
  }

  return {
    eyebrow: isFrench ? "À l'affiche" : "What is on",
    title: isFrench ? "Ateliers" : "Workshops",
    subtitle: isFrench
      ? "Ateliers immersifs, formats spéciaux et rencontres à venir à Forest Lighthouse."
      : "Immersive workshops, special formats, and upcoming gatherings at Forest Lighthouse.",
    mediaUrl: FOREST_PAGE_MEDIA.workshops,
    actionHref: localizePath(locale, "/calendar"),
    actionLabel: isFrench ? "Voir le calendrier" : "View calendar",
  };
}

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
  const isForest = isForestCenter(siteConfig.centerSlug);

  if (isForest) {
    const forestCopy = getForestCollectionCopy(offerType, siteConfig.defaultLocale);
    const isFrench = siteConfig.defaultLocale.toLowerCase().startsWith("fr");
    const offerCountLabel = isFrench
      ? `${offers.length} offre${offers.length > 1 ? "s" : ""}`
      : `${offers.length} ${offers.length === 1 ? "offer" : "offers"}`;

    return (
      <ForestPageShell>
        <ForestPageHero
          actions={[{ href: forestCopy.actionHref, label: forestCopy.actionLabel }]}
          eyebrow={forestCopy.eyebrow}
          mediaUrl={forestCopy.mediaUrl}
          subtitle={forestCopy.subtitle}
          title={forestCopy.title}
        />

        <ForestPageSection
          eyebrow={siteConfig.center.name}
          subtitle={
            offers.length > 0
              ? offerCountLabel
              : isFrench
                ? "Aucune offre publiée pour le moment."
                : "No published offers yet."
          }
          title={isFrench ? "Explorer les offres" : "Explore offers"}
        >
          {offers.length === 0 ? (
            <p className="forest-empty-state">
              {siteConfig.defaultLocale.toLowerCase().startsWith("fr")
                ? "Les offres apparaîtront ici dès qu'elles seront publiées."
                : "Offers will appear here as soon as they are published."}
            </p>
          ) : (
            <div className="forest-collection-grid">
              {offers.map((offer, index) => {
                const offerRecord = asRecord(offer);
                const slug = getOfferSlug(offer);
                const title = getOfferTitle(offer, "Untitled offer");
                const canonicalPath = getCanonicalOfferPath(offer);
                const detailsPath = localizePath(siteConfig.defaultLocale, canonicalPath || `/offer/${slug}`);
                const excerpt = pickString(offerRecord, ["excerpt", "summary", "short_description"]);
                const nextOccurrence = readNextOccurrence(offer);
                const nextOccurrenceLabel = formatDateTime(
                  nextOccurrence.start,
                  siteConfig.defaultLocale,
                  nextOccurrence.timezone,
                );
                const heroImageUrl = pickString(offerRecord, ["hero_image_url", "heroImageUrl"]);

                return (
                  <article className="forest-collection-card" key={slug || `offer-${index}`}>
                    {heroImageUrl ? (
                      <div
                        className="forest-collection-card__media"
                        style={{
                          backgroundImage: `linear-gradient(125deg, rgba(0, 11, 12, 0.74), rgba(1, 38, 35, 0.34)), url(${heroImageUrl})`,
                        }}
                      />
                    ) : null}
                    <div className="forest-collection-card__body">
                      <p className="offer-type-label">{forestCopy.title}</p>
                      <h2>{title}</h2>
                      {excerpt ? <p>{excerpt}</p> : null}
                      <p className="forest-collection-card__meta">
                        <strong>{labels.nextOccurrence}:</strong> {nextOccurrenceLabel || "-"}
                      </p>
                      {slug ? (
                        <div className="forest-collection-card__actions">
                          <Link className="text-link" href={detailsPath}>
                            {detailsLabel}
                          </Link>
                          <Link className="fl-btn fl-btn--secondary" href={detailsPath}>
                            {isFrench ? "Voir la page" : "View page"}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </ForestPageSection>
      </ForestPageShell>
    );
  }

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
          const canonicalPath = getCanonicalOfferPath(offer);
          const detailsPath = localizePath(siteConfig.defaultLocale, canonicalPath || `/offer/${slug}`);
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
                <Link className="text-link" href={detailsPath}>
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
