import Link from "next/link";

import type { EducationNewsletterEntry } from "@/lib/education-newsletters";
import { rewriteEducationLegacyHtml } from "@/lib/education-legacy-paths";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationNewsletterDetailPageProps = {
  entry: EducationNewsletterEntry;
  locale: string;
  relatedEntries: EducationNewsletterEntry[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function formatDate(locale: string, value: string, fallback?: string) {
  if (!value) {
    return fallback ?? "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback ?? value;
  }

  return new Intl.DateTimeFormat(locale.toLowerCase().startsWith("fr") ? "fr-BE" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export default function EducationNewsletterDetailPage({
  entry,
  locale,
  relatedEntries,
}: EducationNewsletterDetailPageProps) {
  const page: NarrativePage = {
    routeKey: `newsletter-${entry.slug}`,
    locale,
    title: entry.title,
    subtitle: entry.lead || entry.excerpt,
    hero: {
      title: entry.title,
      body: entry.lead || entry.excerpt,
      imageUrl: entry.imageUrl,
    },
    sections: [],
    primaryCta: null,
    seo: {
      title: `${entry.title} | Feldenkrais Education`,
      description: entry.excerpt,
    },
  };
  const rewrittenContentHtml = rewriteEducationLegacyHtml(entry.contentHtml, locale);

  return (
    <EducationContentPage className="education-newsletter-page" eyebrow="Newsletter" page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Archive éditoriale", "Editorial archive")}</p>
          <h2>{t(locale, "Une newsletter FE remise en circulation", "An FE newsletter brought back into circulation")}</h2>
          <p>{entry.excerpt}</p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{formatDate(locale, entry.publishedAt, entry.publishedLabel)}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Archive", "Archive")}</dt>
              <dd>{t(locale, "Infolettre FE", "FE newsletter")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Langue", "Language")}</dt>
              <dd>{locale.toLowerCase().startsWith("fr") ? "Français" : "English"}</dd>
            </div>
            <div>
              <dt>{t(locale, "Source", "Source")}</dt>
              <dd>{t(locale, "Archive WordPress FE", "FE WordPress archive")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/newsletter")}>
              {t(locale, "Retour à l’archive", "Back to archive")}
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

      {rewrittenContentHtml ? (
        <section className="education-newsletter-body education-card">
          <div
            className="legacy-html-block rich-text"
            dangerouslySetInnerHTML={{ __html: rewrittenContentHtml }}
          />
        </section>
      ) : null}

      {relatedEntries.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Autres éditions", "Other issues")}</h2>
            <Link className="text-link" href={localizePath(locale, "/newsletter")}>
              {t(locale, "Voir toute l’archive", "View the archive")}
            </Link>
          </div>
          <div className="education-card-grid education-card-grid--newsletter">
            {relatedEntries.map((related) => (
              <article className="education-card education-newsletter-card" key={related.slug}>
                <div className="education-newsletter-card__body">
                  <p className="education-page__date-range">
                    {formatDate(locale, related.publishedAt, related.publishedLabel)}
                  </p>
                  <h3>{related.title}</h3>
                  <p>{related.excerpt}</p>
                  <div className="education-offer-card__actions">
                    <Link className="education-button" href={localizePath(locale, `/newsletter/${related.slug}`)}>
                      {t(locale, "Lire", "Read")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </EducationContentPage>
  );
}
