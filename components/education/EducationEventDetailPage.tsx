import Link from "next/link";

import type { EducationEventEntry } from "@/lib/education-events";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationEventDetailPageProps = {
  event: EducationEventEntry;
  locale: string;
  relatedEvents: EducationEventEntry[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function formatWhen(locale: string, startDate: string, endDate: string) {
  if (!startDate) {
    return locale.toLowerCase().startsWith("fr") ? "Archive FE" : "FE archive";
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
  if (Number.isNaN(end.getTime())) {
    return formatter.format(start);
  }

  if (start.toDateString() === end.toDateString()) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function formatMode(locale: string, mode: EducationEventEntry["attendanceMode"]) {
  if (mode === "online") {
    return t(locale, "En ligne", "Online");
  }

  if (mode === "in_person") {
    return t(locale, "En présence", "In person");
  }

  return t(locale, "Format FE", "FE format");
}

export default function EducationEventDetailPage({
  event,
  locale,
  relatedEvents,
}: EducationEventDetailPageProps) {
  const page: NarrativePage = {
    routeKey: `event-${event.slug}`,
    locale,
    title: event.title,
    subtitle: event.excerpt,
    hero: {
      title: event.title,
      body: event.excerpt,
      imageUrl: event.imageUrl,
    },
    sections: [],
    primaryCta: null,
    seo: {
      title: `${event.title} | Feldenkrais Education`,
      description: event.excerpt,
    },
  };

  return (
    <EducationContentPage className="education-event-page" eyebrow="Event" page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Archive évènement", "Event archive")}</p>
          <h2>{t(locale, "Une page évènement FE remise en circulation", "An FE event page brought back into circulation")}</h2>
          <p>{event.excerpt}</p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Cette page restitue un évènement du site FE historique. Pour ce qui est vivant aujourd’hui, le plus utile est souvent de repartir vers les ateliers, formations et centres déjà reconstruits.",
              "This page restores an event from the historic FE site. For what is live today, the most useful path is often to move back toward the workshops, trainings, and centers already rebuilt.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{formatWhen(locale, event.startDate, event.endDate)}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Format", "Format")}</dt>
              <dd>{formatMode(locale, event.attendanceMode)}</dd>
            </div>
            <div>
              <dt>{t(locale, "Accès", "Access")}</dt>
              <dd>{event.priceLabel === "Free" ? t(locale, "Gratuit", "Free") : event.priceLabel || "-"}</dd>
            </div>
            <div>
              <dt>{t(locale, "Source", "Source")}</dt>
              <dd>{t(locale, "Archive WordPress FE", "FE WordPress archive")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/calendar")}>
              {t(locale, "Retour au calendrier", "Back to calendar")}
            </Link>
            {event.sourceUrl ? (
              <a className="education-button education-button--secondary" href={event.sourceUrl} rel="noreferrer" target="_blank">
                {t(locale, "Voir la source d’origine", "See original source")}
              </a>
            ) : null}
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Repartir vers les parcours actuels", "Move back toward current pathways")}</h2>
          <Link className="text-link" href={localizePath(locale, "/calendar")}>
            {t(locale, "Retour au calendrier", "Back to calendar")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {[
            {
              title: t(locale, "Ateliers & stages", "Workshops"),
              body: t(
                locale,
                "Si vous cherchez ce qui est le plus proche de cet évènement dans le site actuel, commencez ici.",
                "If you are looking for the closest current equivalent to this event, start here.",
              ),
              href: "/workshops",
              cta: t(locale, "Voir les ateliers", "View workshops"),
            },
            {
              title: t(locale, "Formations", "Trainings"),
              body: t(
                locale,
                "Pour les parcours longs, cohortes, PDF et continuité pédagogique du côté recrutement.",
                "For long-form pathways, cohorts, PDFs, and pedagogical continuity on the recruitment side.",
              ),
              href: "/trainings",
              cta: t(locale, "Voir les formations", "View trainings"),
            },
            {
              title: t(locale, "Centres", "Centers"),
              body: t(
                locale,
                "Le contexte d’un évènement se comprend souvent mieux à partir du lieu ou du centre partenaire.",
                "The context of an event is often easier to understand from the place or partner center.",
              ),
              href: "/centers",
              cta: t(locale, "Voir les centres", "View centers"),
            },
          ].map((item) => (
            <article className="education-card education-home-link-card" key={item.href}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link className="education-text-link" href={localizePath(locale, item.href)}>
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {event.bodyParagraphs.length > 0 || event.bulletPoints.length > 0 ? (
        <section className="education-newsletter-body education-card">
          <div className="rich-text">
            {event.bodyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {event.bulletPoints.length > 0 ? (
              <ul>
                {event.bulletPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {relatedEvents.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Autres évènements archivés", "Other archived events")}</h2>
            <Link className="text-link" href={localizePath(locale, "/workshops")}>
              {t(locale, "Voir stages & formations", "See workshops")}
            </Link>
          </div>
          <div className="education-card-grid">
            {relatedEvents.map((related) => (
              <article className="education-card education-offer-card" key={related.slug}>
                {related.imageUrl ? (
                  <div
                    className="education-offer-card__media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.92)), url(${related.imageUrl})`,
                    }}
                  />
                ) : null}
                <div className="education-offer-card__body">
                  <p className="education-offer-card__type">{formatMode(locale, related.attendanceMode)}</p>
                  <h2>{related.title}</h2>
                  <p>{related.excerpt}</p>
                  <p className="education-offer-card__meta">
                    <strong>{t(locale, "Date", "Date")}:</strong> {formatWhen(locale, related.startDate, related.endDate)}
                  </p>
                  <div className="education-offer-card__actions">
                    <Link className="education-button education-button--secondary" href={localizePath(locale, `/event/${related.slug}`)}>
                      {t(locale, "Voir la page", "View page")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Étape suivante", "Next step")}</p>
          <h2>{t(locale, "Vous voulez retrouver quelque chose d’actif aujourd’hui ?", "Want to find something active today?")}</h2>
          <p>
            {t(
              locale,
              "Le meilleur chemin est généralement de repartir vers les ateliers, les centres, ou directement l’équipe FE pour être orienté·e vers la bonne proposition.",
              "The best path is usually to go back toward workshops, centers, or directly to the FE team so you can be oriented toward the right current offer.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/workshops")}>
            {t(locale, "Voir les ateliers", "View workshops")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous contacter", "Contact us")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
