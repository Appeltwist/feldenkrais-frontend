import Link from "next/link";

import type { EducationNewsletterEntry } from "@/lib/education-newsletters";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationNewsletterArchivePageProps = {
  page: NarrativePage;
  entries: EducationNewsletterEntry[];
  locale: string;
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

export default function EducationNewsletterArchivePage({
  page,
  entries,
  locale,
}: EducationNewsletterArchivePageProps) {
  const [featured, ...archive] = entries;

  return (
    <EducationContentPage eyebrow="Newsletter" page={page}>
      {featured ? (
        <section className="education-center-intro education-card">
          <article className="education-center-intro__story">
            <p className="home-section-kicker">{t(locale, "Dernière édition", "Latest issue")}</p>
            <h2>{featured.title}</h2>
            <p>{featured.lead || featured.excerpt}</p>
            <p className="education-training-intro__note">
              {t(
                locale,
                "Nous commençons par remettre l’archive éditoriale FE en circulation avec les newsletters les plus récentes, avant une modélisation backend plus complète.",
                "We are bringing the FE editorial archive back into circulation through the recent newsletters first, ahead of a fuller backend article model.",
              )}
            </p>
          </article>
          <aside className="education-center-intro__facts">
            <p className="education-page__date-range">{formatDate(locale, featured.publishedAt, featured.publishedLabel)}</p>
            <h2>{t(locale, "À lire maintenant", "Read now")}</h2>
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
                <dt>{t(locale, "Éditions visibles", "Visible issues")}</dt>
                <dd>{entries.length}</dd>
              </div>
            </dl>
            <div className="education-center-intro__actions">
              <Link className="education-button" href={localizePath(locale, `/newsletter/${featured.slug}`)}>
                {t(locale, "Lire cette édition", "Read this issue")}
              </Link>
              <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
                {t(locale, "Nous contacter", "Contact us")}
              </Link>
            </div>
          </aside>
        </section>
      ) : null}

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Archive des éditions", "Issue archive")}</h2>
          <Link className="text-link" href={localizePath(locale, "/platform")}>
            {t(locale, "Voir la plateforme", "See the platform")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--newsletter">
          {archive.map((entry) => (
            <article className="education-card education-newsletter-card" key={entry.slug}>
              <div className="education-newsletter-card__body">
                <p className="education-page__date-range">{formatDate(locale, entry.publishedAt, entry.publishedLabel)}</p>
                <h3>{entry.title}</h3>
                <p>{entry.excerpt}</p>
                <div className="education-offer-card__actions">
                  <Link className="education-button" href={localizePath(locale, `/newsletter/${entry.slug}`)}>
                    {t(locale, "Lire", "Read")}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </EducationContentPage>
  );
}
