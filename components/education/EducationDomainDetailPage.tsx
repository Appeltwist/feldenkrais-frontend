import Link from "next/link";

import type { EducationDomainEntry } from "@/lib/education-domains";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationDomainDetailPageProps = {
  entry: EducationDomainEntry;
  relatedEntries: EducationDomainEntry[];
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationDomainDetailPage({
  entry,
  relatedEntries,
  locale,
}: EducationDomainDetailPageProps) {
  const page: NarrativePage = {
    routeKey: `domain-${entry.slug}`,
    locale,
    title: entry.title,
    subtitle: entry.excerpt,
    hero: {
      title: entry.title,
      body: entry.excerpt,
      imageUrl: entry.imageUrl,
    },
    sections: [],
    primaryCta: null,
    seo: {
      title: `${entry.title} | Feldenkrais Education`,
      description: entry.excerpt,
    },
  };

  return (
    <EducationContentPage className="education-domain-detail-page" eyebrow={t(locale, "Domaine", "Domain")} page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Perspective FE", "FE perspective")}</p>
          <h2>{t(locale, "Comment la méthode rencontre ce champ", "How the method meets this field")}</h2>
          <p>{entry.excerpt}</p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Cette page vient de l’archive du site FE historique. Elle garde sa fonction d’orientation et de contextualisation, tout en préparant le passage vers les formations, ateliers et ressources actuels.",
              "This page comes from the historic FE site archive. It keeps its role as orientation and context while preparing the move toward current trainings, workshops, and resources.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Archive FE", "FE archive")}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Langue", "Language")}</dt>
              <dd>{locale.toLowerCase().startsWith("fr") ? "Français" : "English"}</dd>
            </div>
            <div>
              <dt>{t(locale, "Domaines liés", "Related domains")}</dt>
              <dd>{relatedEntries.length}</dd>
            </div>
            <div>
              <dt>{t(locale, "Source", "Source")}</dt>
              <dd>{t(locale, "Archive WordPress FE", "FE WordPress archive")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/domains")}>
              {t(locale, "Retour aux domaines", "Back to domains")}
            </Link>
            {entry.sourceUrl ? (
              <a
                className="education-button education-button--secondary"
                href={entry.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {t(locale, "Voir la source d’origine", "See original source")}
              </a>
            ) : null}
          </div>
        </aside>
      </section>

      {entry.bodyHtml ? (
        <section className="education-domain-body education-card">
          <div className="legacy-html-block rich-text" dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} />
        </section>
      ) : null}

      {!entry.bodyHtml && entry.bodyParagraphs.length > 0 ? (
        <section className="education-domain-body education-card">
          <div className="rich-text">
            {entry.bodyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {entry.bulletPoints.length > 0 ? (
        <section className="education-domain-points education-card">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Pistes et questions", "Themes and questions")}</h2>
            <Link className="text-link" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir la formation", "View the training")}
            </Link>
          </div>
          <ul className="education-domain-points__list">
            {entry.bulletPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {relatedEntries.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Domaines liés", "Related domains")}</h2>
            <Link className="text-link" href={localizePath(locale, "/domains")}>
              {t(locale, "Voir tous les domaines", "View all domains")}
            </Link>
          </div>
          <div className="education-card-grid education-card-grid--domains">
            {relatedEntries.map((related) => (
              <article className="education-domain-card" key={related.slug}>
                {related.imageUrl ? (
                  <div
                    className="education-domain-card__media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.92)), url(${related.imageUrl})`,
                    }}
                  />
                ) : null}
                <div className="education-domain-card__body">
                  <h3>{related.title}</h3>
                  <p>{related.excerpt}</p>
                  <div className="education-offer-card__actions">
                    <Link className="education-button" href={localizePath(locale, `/domains/${related.slug}`)}>
                      {t(locale, "Explorer", "Explore")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="education-center-cta education-card">
        <h2>{t(locale, "Continuer l’exploration", "Keep exploring")}</h2>
        <p>
          {t(
            locale,
            "Ces domaines prennent vraiment sens quand on les relie à des parcours concrets: une formation longue, un atelier, un centre, ou une ressource thématique.",
            "These domains become most meaningful when connected to concrete pathways: a long training, a workshop, a center, or a themed resource.",
          )}
        </p>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/trainings")}>
            {t(locale, "Explorer les formations", "Explore trainings")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/workshops")}>
            {t(locale, "Explorer les ateliers", "Explore workshops")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
