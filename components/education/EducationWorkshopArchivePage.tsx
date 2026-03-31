import Link from "next/link";

import type { OfferSummary } from "@/lib/api";
import type { EducationEventEntry } from "@/lib/education-events";
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
} from "@/lib/offers";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationWorkshopArchivePageProps = {
  archiveEvents?: EducationEventEntry[];
  locale: string;
  offers: OfferSummary[];
  page: NarrativePage;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationWorkshopArchivePage({
  archiveEvents = [],
  locale,
  offers,
  page,
}: EducationWorkshopArchivePageProps) {
  const labels = getOfferLabels(locale);
  const nextOffer = offers
    .map((offer) => ({ offer, nextOccurrence: readNextOccurrence(offer) }))
    .sort((left, right) => left.nextOccurrence.start.localeCompare(right.nextOccurrence.start))[0];
  const nextArchiveEvent = [...archiveEvents].sort((left, right) => left.startDate.localeCompare(right.startDate))[0];

  const resolvedPage: NarrativePage = {
    ...page,
    title: t(locale, "Stages & formations", "Trainings and workshops"),
    subtitle: t(
      locale,
      "Améliorez vos compétences, en présence ou en ligne. Vous trouverez ici un aperçu des stages, événements et masterclasses FE.",
      "Improve your skills, in person or online. Here you can see the FE mix of live workshops, events, and masterclasses.",
    ),
    hero: {
      ...page.hero,
      title: t(locale, "Stages & formations", "Trainings and workshops"),
      body: t(
        locale,
        "Un point d’entrée FE pour les événements en direct et les formats d’apprentissage en ligne.",
        "An FE entry point for live events and online learning formats.",
      ),
      imageUrl:
        page.hero.imageUrl ||
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/DSC02199-Large.jpeg",
    },
    sections: [],
  };

  const eventCount = offers.length > 0 ? offers.length : archiveEvents.length;

  function formatArchiveEventWhen(startDate: string, endDate: string) {
    if (!startDate) {
      return t(locale, "Archive FE", "FE archive");
    }

    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) {
      return startDate;
    }

    const formatter = new Intl.DateTimeFormat(locale.toLowerCase().startsWith("fr") ? "fr-BE" : "en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    if (!endDate) {
      return formatter.format(start);
    }

    const end = new Date(endDate);
    if (Number.isNaN(end.getTime()) || start.toDateString() === end.toDateString()) {
      return formatter.format(start);
    }

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }

  return (
    <EducationContentPage className="education-workshops-page" eyebrow="Workshops" page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Événements FE", "FE events")}</p>
          <h2>{t(locale, "Événements en direct et approfondissements en ligne", "Live events and online deep dives")}</h2>
          <p>
            {t(
              locale,
              "Le site FE précédent ouvrait cette page sur les stages en direct, puis orientait vers les masterclasses et ressources en ligne. On garde cette logique ici.",
              "The previous FE site opened this page with live workshops, then directed people into online masterclasses and resources. We keep that structure here.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Les offres ci-dessous restent pilotées par le backend partagé, mais la présentation reprend le rôle éditorial FE de cette page.",
              "The offers below still come from the shared backend, but the presentation restores the FE editorial role this page used to have.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "À l’affiche", "What is on")}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Événements visibles", "Visible events")}</dt>
              <dd>{eventCount}</dd>
            </div>
            <div>
              <dt>{t(locale, "Formats", "Formats")}</dt>
              <dd>{t(locale, "Présentiel + en ligne", "In person + online")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Prochaine date", "Next date")}</dt>
              <dd>
                {nextOffer
                  ? formatDateTime(nextOffer.nextOccurrence.start, locale, nextOffer.nextOccurrence.timezone)
                  : nextArchiveEvent
                    ? formatArchiveEventWhen(nextArchiveEvent.startDate, nextArchiveEvent.endDate)
                  : t(locale, "À venir", "Coming soon")}
              </dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/calendar")}>
              {t(locale, "Voir le calendrier", "View the calendar")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/shop")}>
              {t(locale, "Voir les masterclasses", "See masterclasses")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Événements en direct", "Live events")}</h2>
          <Link className="text-link" href={localizePath(locale, "/calendar")}>
            {t(locale, "Ouvrir le calendrier", "Open the calendar")}
          </Link>
        </div>
        {offers.length === 0 && archiveEvents.length === 0 ? (
          <section className="education-listing">
            <p>
              {t(
                locale,
                "Aucun stage publié pour le moment. Les prochaines dates FE apparaîtront ici dès qu’elles seront publiées.",
                "No workshops are published right now. Upcoming FE dates will appear here as soon as they are published.",
              )}
            </p>
          </section>
        ) : offers.length === 0 ? (
          <div className="education-card-grid">
            {archiveEvents.map((event) => (
              <article className="education-card education-offer-card" key={event.slug}>
                {event.imageUrl ? (
                  <div
                    className="education-offer-card__media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.92)), url(${event.imageUrl})`,
                    }}
                  />
                ) : null}
                <div className="education-offer-card__body">
                  <p className="education-offer-card__type">
                    {event.attendanceMode === "online"
                      ? t(locale, "Webinaire FE", "FE webinar")
                      : t(locale, "Archive FE", "FE archive")}
                  </p>
                  <h2>{event.title}</h2>
                  <p>{event.excerpt}</p>
                  <p className="education-offer-card__meta">
                    <strong>{t(locale, "Date", "Date")}:</strong> {formatArchiveEventWhen(event.startDate, event.endDate)}
                  </p>
                  <div className="education-offer-card__actions">
                    <Link className="education-text-link" href={localizePath(locale, `/event/${event.slug}`)}>
                      {t(locale, "Voir les détails", "View details")}
                    </Link>
                    {event.sourceUrl ? (
                      <a className="education-button education-button--secondary" href={event.sourceUrl} rel="noreferrer" target="_blank">
                        {t(locale, "Source", "Source")}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="education-card-grid">
            {offers.map((offer, index) => {
              const offerRecord = asRecord(offer);
              const slug = getOfferSlug(offer);
              const title = getOfferTitle(offer, "Untitled offer");
              const canonicalPath = getCanonicalOfferPath(offer);
              const detailsPath = localizePath(locale, canonicalPath || `/offer/${slug}`);
              const excerpt = pickString(offerRecord, ["excerpt", "summary", "short_description"]);
              const nextOccurrence = readNextOccurrence(offer);
              const nextOccurrenceLabel = formatDateTime(
                nextOccurrence.start,
                locale,
                nextOccurrence.timezone,
              );
              const heroImageUrl = pickString(offerRecord, ["hero_image_url", "heroImageUrl"]);

              return (
                <article className="education-card education-offer-card" key={slug || `workshop-${index}`}>
                  {heroImageUrl ? (
                    <div
                      className="education-offer-card__media"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.92)), url(${heroImageUrl})`,
                      }}
                    />
                  ) : null}
                  <div className="education-offer-card__body">
                    <p className="education-offer-card__type">
                      {t(locale, "Événement FE", "FE live event")}
                    </p>
                    <h2>{title}</h2>
                    {excerpt ? <p>{excerpt}</p> : null}
                    <p className="education-offer-card__meta">
                      <strong>{labels.nextOccurrence}:</strong> {nextOccurrenceLabel || "-"}
                    </p>
                    {slug ? (
                      <div className="education-offer-card__actions">
                        <Link className="education-text-link" href={detailsPath}>
                          {labels.openDetails}
                        </Link>
                        <Link className="education-button education-button--secondary" href={detailsPath}>
                          {t(locale, "Voir la page", "View page")}
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Masterclasses et ressources en ligne", "Online masterclasses and resources")}</h2>
          <Link className="text-link" href={localizePath(locale, "/shop")}>
            {t(locale, "Voir la boutique FE", "See the FE shop")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--home-links">
          <article className="education-card education-home-link-card">
            <p className="home-section-kicker">{t(locale, "Catalogue", "Catalog")}</p>
            <h3>{t(locale, "Masterclasses publiques", "Public masterclasses")}</h3>
            <p>
              {t(
                locale,
                "Retrouvez les masterclasses FE et les ressources numériques qui prolongent les stages en direct.",
                "Browse FE masterclasses and digital resources that extend the live workshop experience.",
              )}
            </p>
            <div className="education-offer-card__actions">
              <Link className="education-button" href={localizePath(locale, "/shop")}>
                {t(locale, "Voir la sélection", "See the selection")}
              </Link>
            </div>
          </article>

          <article className="education-card education-home-link-card">
            <p className="home-section-kicker">{t(locale, "Plateforme", "Platform")}</p>
            <h3>{t(locale, "Approfondir entre les segments", "Go deeper between segments")}</h3>
            <p>
              {t(
                locale,
                "Le site FE ancien reliait déjà les stages à des formats en ligne. Nous gardons ici ce pont vers Neurosomatic.",
                "The old FE site already connected workshops to online learning formats. We keep that bridge to Neurosomatic here.",
              )}
            </p>
            <div className="education-offer-card__actions">
              <a className="education-button" href="https://neurosomatic.com" rel="noreferrer" target="_blank">
                {t(locale, "Ouvrir Neurosomatic", "Open Neurosomatic")}
              </a>
            </div>
          </article>
        </div>
      </section>
    </EducationContentPage>
  );
}
