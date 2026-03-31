import Link from "next/link";

import type { EducationEventEntry } from "@/lib/education-events";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationEventArchivePageProps = {
  entries: EducationEventEntry[];
  locale: string;
  page: NarrativePage;
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

export default function EducationEventArchivePage({
  entries,
  locale,
  page,
}: EducationEventArchivePageProps) {
  const [featured, ...archive] = entries;
  const resolvedPage: NarrativePage = {
    ...page,
    title: t(locale, "Évènements FE", "FE events"),
    subtitle: t(
      locale,
      "Le flux live sera reconnecté progressivement. En attendant, cette page garde les derniers évènements FE visibles et relie vers les parcours en cours.",
      "The live feed will be reconnected progressively. In the meantime, this page keeps the latest FE events visible and points toward the current pathways.",
    ),
    hero: {
      ...page.hero,
      title: t(locale, "Évènements FE", "FE events"),
      body: t(
        locale,
        "Le calendrier backend sera remis à niveau progressivement. En attendant, cette page remet les derniers évènements FE en visibilité et vous renvoie vers les ateliers, formations et ressources actuellement utiles.",
        "The backend calendar will be rebuilt progressively. In the meantime, this page brings the latest FE public events back into view and points you toward the workshops, trainings, and resources that are currently useful.",
      ),
      imageUrl:
        featured?.imageUrl ||
        page.hero.imageUrl ||
        "https://feldenkrais-education.com/wp-content/uploads/sites/15/2022/11/workshop.jpeg",
    },
    sections: [],
  };

  return (
    <EducationContentPage className="education-event-page" eyebrow="Calendar" page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Transition FE", "FE transition")}</p>
          <h2>{t(locale, "Un calendrier historique remis en circulation", "A legacy calendar brought back into circulation")}</h2>
          <p>
            {t(
              locale,
              "Le site FE précédent publiait quelques pages d’évènements distinctes du flux principal des ateliers. Nous les remettons ici en circulation pendant la reconstruction, tout en renvoyant vers les parcours FE déjà actifs dans la nouvelle version.",
              "The previous FE site published a small set of standalone event pages distinct from the main workshop flow. We are bringing them back here during the rebuild while also pointing toward the FE pathways already active in the new version.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Repères", "Markers")}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Évènements archivés", "Archived events")}</dt>
              <dd>{entries.length}</dd>
            </div>
            <div>
              <dt>{t(locale, "Formats", "Formats")}</dt>
              <dd>{t(locale, "Webinaires, stages, introductions", "Webinars, workshops, introductions")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Aujourd’hui", "Today")}</dt>
              <dd>{t(locale, "Voir aussi ateliers, centres et formations", "Also see workshops, centers, and trainings")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/workshops")}>
              {t(locale, "Voir stages & formations", "See workshops")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir les formations", "See trainings")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Pendant que le flux live revient", "While the live feed returns")}</h2>
          <Link className="text-link" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous écrire", "Write to us")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {[
            {
              title: t(locale, "Ateliers & stages", "Workshops"),
              body: t(
                locale,
                "La meilleure vue actuelle sur les offres FE courtes, introductions et propositions ponctuelles.",
                "The best current view of FE short-format offers, introductions, and one-off propositions.",
              ),
              href: "/workshops",
              cta: t(locale, "Voir les ateliers", "View workshops"),
            },
            {
              title: t(locale, "Formations", "Trainings"),
              body: t(
                locale,
                "Pour les parcours longs, cohortes, PDF et points d’entrée liés à la formation professionnelle.",
                "For long-form pathways, cohorts, PDFs, and entry points tied to professional training.",
              ),
              href: "/trainings",
              cta: t(locale, "Voir les formations", "View trainings"),
            },
            {
              title: t(locale, "Centres", "Centers"),
              body: t(
                locale,
                "Chaque centre garde son rythme et son contexte. Cela reste souvent le bon point d’entrée pour comprendre un évènement.",
                "Each center keeps its own rhythm and context. That often remains the right entry point for understanding an event.",
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

      {featured ? (
        <section className="education-center-intro education-card">
          <article className="education-center-intro__story">
            <p className="home-section-kicker">{t(locale, "Dernier évènement archivé", "Latest archived event")}</p>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <p className="education-training-intro__note">
              {t(
                locale,
                "Cette page d’archive reste utile pour retrouver le ton et les thèmes de l’ancien site FE, même si les inscriptions actuelles passent désormais par d’autres parcours du nouveau site.",
                "This archive page remains useful for recovering the tone and themes of the former FE site, even if current registrations now flow through other paths in the new site.",
              )}
            </p>
          </article>
          <aside className="education-center-intro__facts">
            <p className="education-page__date-range">{formatWhen(locale, featured.startDate, featured.endDate)}</p>
            <h2>{t(locale, "Détails rapides", "Quick details")}</h2>
            <dl className="education-center-facts">
              <div>
                <dt>{t(locale, "Format", "Format")}</dt>
                <dd>{formatMode(locale, featured.attendanceMode)}</dd>
              </div>
              <div>
                <dt>{t(locale, "Accès", "Access")}</dt>
                <dd>{featured.priceLabel === "Free" ? t(locale, "Gratuit", "Free") : featured.priceLabel || "-"}</dd>
              </div>
            </dl>
            <div className="education-center-intro__actions">
              <Link className="education-button" href={localizePath(locale, `/event/${featured.slug}`)}>
                {t(locale, "Voir la page", "View page")}
              </Link>
              {featured.sourceUrl ? (
                <a className="education-button education-button--secondary" href={featured.sourceUrl} rel="noreferrer" target="_blank">
                  {t(locale, "Voir la source d’origine", "See original source")}
                </a>
              ) : null}
            </div>
          </aside>
        </section>
      ) : null}

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Évènements archivés", "Archived events")}</h2>
          <Link className="text-link" href={localizePath(locale, "/workshops")}>
            {t(locale, "Retour aux stages", "Back to workshops")}
          </Link>
        </div>
        <div className="education-card-grid">
          {archive.map((entry) => (
            <article className="education-card education-offer-card" key={entry.slug}>
              {entry.imageUrl ? (
                <div
                  className="education-offer-card__media"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.92)), url(${entry.imageUrl})`,
                  }}
                />
              ) : null}
              <div className="education-offer-card__body">
                <p className="education-offer-card__type">{formatMode(locale, entry.attendanceMode)}</p>
                <h2>{entry.title}</h2>
                <p>{entry.excerpt}</p>
                <p className="education-offer-card__meta">
                  <strong>{t(locale, "Date", "Date")}:</strong> {formatWhen(locale, entry.startDate, entry.endDate)}
                </p>
                <div className="education-offer-card__actions">
                  <Link className="education-text-link" href={localizePath(locale, `/event/${entry.slug}`)}>
                    {t(locale, "Voir les détails", "View details")}
                  </Link>
                  {entry.sourceUrl ? (
                    <a className="education-button education-button--secondary" href={entry.sourceUrl} rel="noreferrer" target="_blank">
                      {t(locale, "Source", "Source")}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Étape suivante", "Next step")}</p>
          <h2>{t(locale, "Vous cherchez surtout ce qui est actif aujourd’hui ?", "Mostly looking for what is active today?")}</h2>
          <p>
            {t(
              locale,
              "Le plus fiable est de repartir des formations, ateliers, centres et pages de contact déjà reconstruits dans la nouvelle version du site.",
              "The most reliable path is to start from the trainings, workshops, centers, and contact pages that are already rebuilt in the new version of the site.",
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
