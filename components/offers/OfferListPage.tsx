import Link from "next/link";

import EducationContentPage from "@/components/education/EducationContentPage";
import { ForestPageHero, ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchOffers, fetchSiteConfig, type OfferSummary } from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { FOREST_PAGE_MEDIA, isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
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
  routeKey?: "trainings" | "workshops" | "private-sessions";
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

function getEducationCollectionLabel(offerType: OfferType, locale: string) {
  const isFrench = locale.toLowerCase().startsWith("fr");

  if (offerType === "TRAINING_INFO") {
    return isFrench ? "Formation Feldenkrais" : "Feldenkrais Training";
  }

  if (offerType === "PRIVATE_SESSION") {
    return isFrench ? "Séances individuelles" : "Individual Sessions";
  }

  return isFrench ? "Stages & Formations" : "All Workshops";
}

export default async function OfferListPage({ heading, offerType, routeKey }: OfferListPageProps) {
  const hostname = await getHostname();
  let siteConfig: Awaited<ReturnType<typeof fetchSiteConfig>> | null = null;
  let offers: OfferSummary[] = [];

  try {
    siteConfig = await fetchSiteConfig(hostname);
    const requestLocale = await getRequestLocale(siteConfig.defaultLocale);
    offers = await fetchOffers({
      hostname,
      center: siteConfig.centerSlug,
      type: offerType,
      locale: requestLocale,
    });
  } catch {
    return (
      <section className="page-section">
        <h1>{heading}</h1>
        <p>Unable to load offers right now.</p>
      </section>
    );
  }

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);
  const labels = getOfferLabels(requestLocale);
  const detailsLabel = labels.openDetails;
  const isForest = isForestCenter(siteConfig.centerSlug);
  const educationCollectionLabel = getEducationCollectionLabel(offerType, requestLocale);

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

  const page = routeKey ? await resolveEducationNarrativePage(hostname, routeKey, requestLocale) : null;

  return (
    <EducationContentPage
      eyebrow={siteConfig.center.name}
      page={
        page ?? {
          routeKey: routeKey || offerType.toLowerCase(),
          locale: requestLocale,
          title: heading,
          subtitle: siteConfig.center.name,
          hero: {
            title: heading,
            body: siteConfig.center.name,
            imageUrl: null,
          },
          sections: [],
          primaryCta: null,
          seo: undefined,
        }
      }
    >
      <section className="education-listing">
        {offers.length === 0 ? <p>No offers found.</p> : null}
        <div className="education-card-grid">
          {offers.map((offer, index) => {
            const offerRecord = asRecord(offer);
            const slug = getOfferSlug(offer);
            const title = getOfferTitle(offer, "Untitled offer");
            const canonicalPath = getCanonicalOfferPath(offer);
            const detailsPath = localizePath(requestLocale, canonicalPath || `/offer/${slug}`);
            const excerpt = pickString(offerRecord, ["excerpt", "summary", "short_description"]);
            const nextOccurrence = readNextOccurrence(offer);
            const nextOccurrenceLabel = formatDateTime(
              nextOccurrence.start,
              requestLocale,
              nextOccurrence.timezone,
            );
            const heroImageUrl = pickString(offerRecord, ["hero_image_url", "heroImageUrl"]);

            return (
              <article className="education-card education-offer-card" key={slug || `offer-${index}`}>
                {heroImageUrl ? (
                  <div
                    className="education-offer-card__media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.92)), url(${heroImageUrl})`,
                    }}
                  />
                ) : null}
                <div className="education-offer-card__body">
                  <p className="education-offer-card__type">{educationCollectionLabel}</p>
                  <h2>{title}</h2>
                  {excerpt ? <p>{excerpt}</p> : null}
                  <p className="education-offer-card__meta">
                    <strong>{labels.nextOccurrence}:</strong> {nextOccurrenceLabel || "-"}
                  </p>
                  {slug ? (
                    <div className="education-offer-card__actions">
                      <Link className="education-text-link" href={detailsPath}>
                        {detailsLabel}
                      </Link>
                      <Link className="education-button education-button--secondary" href={detailsPath}>
                        {requestLocale.toLowerCase().startsWith("fr") ? "Voir la page" : "View page"}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </EducationContentPage>
  );
}
