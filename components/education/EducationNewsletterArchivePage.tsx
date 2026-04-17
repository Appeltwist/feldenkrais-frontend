import Link from "next/link";

import type { EducationNewsletterEntry } from "@/lib/education-newsletters";
import { EDUCATION_NEWSLETTER_SIGNUP_URL } from "@/lib/education-links";
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
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function buildCoverStyle(entry: EducationNewsletterEntry, index: number) {
  if (entry.imageUrl) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(20, 24, 34, 0.10), rgba(20, 24, 34, 0.72)), url(${entry.imageUrl})`,
    };
  }

  const gradients = [
    "linear-gradient(135deg, #44506d, #2f354a)",
    "linear-gradient(135deg, #7f8da8, #434d63)",
    "linear-gradient(135deg, #53637f, #30384b)",
    "linear-gradient(135deg, #6c7b95, #394155)",
  ];

  return { backgroundImage: gradients[index % gradients.length] };
}

export default function EducationNewsletterArchivePage({
  page,
  entries,
  locale,
}: EducationNewsletterArchivePageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    sections: [],
  };

  return (
    <EducationContentPage className="education-newsletter-archive-page" hideHero page={resolvedPage}>
      <section className="education-newsletter-signup">
        <div className="education-newsletter-signup__inner">
          <h1>{t(locale, "Abonnez-vous à la newsletter", "Subscribe to the newsletter")}</h1>
          <div className="education-newsletter-signup__form">
            <a className="education-button" href={EDUCATION_NEWSLETTER_SIGNUP_URL} rel="noreferrer" target="_blank">
              {t(locale, "S’inscrire à la newsletter", "Sign up to the newsletter")}
            </a>
          </div>
        </div>
      </section>

      <section className="education-newsletter-archive">
        <div className="education-newsletter-archive__heading">
          <h2>{t(locale, "Archive de la newsletter", "Newsletter archive")}</h2>
          <p>
            {t(
              locale,
              "Parcourez les anciennes éditions comme une petite bibliothèque éditoriale.",
              "Browse past issues like a small editorial library.",
            )}
          </p>
        </div>

        <div className="education-newsletter-archive__shelf">
          {entries.map((entry, index) => (
            <Link
              className="education-newsletter-issue-card"
              href={localizePath(locale, `/newsletter/${entry.slug}`)}
              key={entry.slug}
            >
              <div className="education-newsletter-issue-card__cover" style={buildCoverStyle(entry, index)}>
                <span className="education-newsletter-issue-card__date">
                  {formatDate(locale, entry.publishedAt, entry.publishedLabel)}
                </span>
                <div className="education-newsletter-issue-card__cover-text">
                  <span className="education-newsletter-issue-card__eyebrow">
                    {t(locale, "Newsletter", "Newsletter")}
                  </span>
                  <h3>{entry.title}</h3>
                </div>
              </div>

              <div className="education-newsletter-issue-card__body">
                <p>{entry.excerpt || entry.lead}</p>
                <span className="education-newsletter-issue-card__link">
                  {t(locale, "Lire l’édition", "Read issue")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </EducationContentPage>
  );
}
