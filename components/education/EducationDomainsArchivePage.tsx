import Link from "next/link";

import type { EducationDomainEntry } from "@/lib/education-domains";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationDomainsArchivePageProps = {
  entries: EducationDomainEntry[];
  locale: string;
  page: NarrativePage;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationDomainsArchivePage({
  entries,
  locale,
  page,
}: EducationDomainsArchivePageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    title: page.title || t(locale, "Domaines d’exploration", "Domains of inquiry"),
    subtitle:
      page.subtitle ||
      t(
        locale,
        "Les grands thèmes du site FE historique, remis en circulation comme portes d’entrée vers la méthode.",
        "The main themes from the historic FE site, brought back as entry points into the method.",
      ),
    hero: {
      ...page.hero,
      title: page.hero.title || page.title || t(locale, "Domaines", "Domains"),
      body:
        page.hero.body ||
        page.subtitle ||
        t(
          locale,
          "Un panorama des champs d’application et des contextes dans lesquels FE a présenté la méthode.",
          "A panorama of the fields of application and contexts in which FE presented the method.",
        ),
      imageUrl: page.hero.imageUrl,
    },
    sections: [],
  };

  return (
    <EducationContentPage className="education-domains-page" eyebrow={t(locale, "Domaines", "Domains")} page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Cartographie FE", "FE map of inquiry")}</p>
          <h2>{t(locale, "Une bibliothèque de contextes d’application", "A library of application contexts")}</h2>
          <p>
            {t(
              locale,
              "Le site FE précédent structurait une partie importante de son contenu autour de domaines: sport, voix, douleur chronique, enfants, travail, vieillissement, créativité, et bien d’autres.",
              "The previous FE site organized a substantial part of its content around domains: sport, voice, chronic pain, children, work, ageing, creativity, and many more.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "On garde cette logique ici pour retrouver les mêmes portes d’entrée thématiques, tout en les reconnectant aux formations, ateliers, et ressources du nouveau site.",
              "We keep that logic here so the same thematic entry points remain available while reconnecting them to the trainings, workshops, and resources of the new site.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{entries.length} {t(locale, "domaines visibles", "visible domains")}</p>
          <h2>{t(locale, "Explorer ensuite", "Then explore")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Orientation", "Orientation")}</dt>
              <dd>{t(locale, "Méthode + applications", "Method + applications")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Source", "Source")}</dt>
              <dd>{t(locale, "Archive FE", "FE archive")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Étape suivante", "Next step")}</dt>
              <dd>{t(locale, "Voir les formations et ateliers", "See trainings and workshops")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir les formations", "View trainings")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/workshops")}>
              {t(locale, "Voir les ateliers", "View workshops")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Tous les domaines", "All domains")}</h2>
          <Link className="text-link" href={localizePath(locale, "/what-is-feldenkrais")}>
            {t(locale, "Revenir à la méthode", "Return to the method")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--domains">
          {entries.map((entry) => (
            <article className="education-domain-card" key={entry.slug}>
              {entry.imageUrl ? (
                <div
                  className="education-domain-card__media"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.92)), url(${entry.imageUrl})`,
                  }}
                />
              ) : null}
              <div className="education-domain-card__body">
                <p className="education-page__date-range">{t(locale, "Domaine FE", "FE domain")}</p>
                <h3>{entry.title}</h3>
                <p>{entry.excerpt}</p>
                <div className="education-offer-card__actions">
                  <Link className="education-button" href={localizePath(locale, `/domains/${entry.slug}`)}>
                    {t(locale, "Explorer ce domaine", "Explore this domain")}
                  </Link>
                  {entry.sourceUrl ? (
                    <a
                      className="education-button education-button--secondary"
                      href={entry.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {t(locale, "Source d’origine", "Original source")}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </EducationContentPage>
  );
}
