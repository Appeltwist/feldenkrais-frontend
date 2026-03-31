import Link from "next/link";

import EducationTeacherCardGrid from "@/components/education/EducationTeacherCardGrid";
import { getEducationTeachersByCohort } from "@/lib/education-teachers";
import type { EducationTrainingCohort } from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";

import EducationContentPage from "./EducationContentPage";

type EducationTrainingCohortPageProps = {
  cohort: EducationTrainingCohort;
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationTrainingCohortPage({
  cohort,
  locale,
}: EducationTrainingCohortPageProps) {
  const featuredTeachers = getEducationTeachersByCohort(locale, cohort.slug);

  return (
    <EducationContentPage
      className="education-training-page education-training-detail-page"
      eyebrow={t(locale, "Formation", "Training")}
      page={cohort.page}
    >
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{cohort.legacyTitle}</p>
          <h2>{t(locale, "Pourquoi cette cohorte", "Why this cohort")}</h2>
          {cohort.overviewParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{cohort.location}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Centre", "Center")}</dt>
              <dd>{cohort.centerName}</dd>
            </div>
            <div>
              <dt>{t(locale, "Période", "Period")}</dt>
              <dd>{cohort.periodLabel}</dd>
            </div>
            <div>
              <dt>{t(locale, "Direction pédagogique", "Educational direction")}</dt>
              <dd>{cohort.director}</dd>
            </div>
            <div>
              <dt>{t(locale, "Segments", "Segments")}</dt>
              <dd>{cohort.segments}</dd>
            </div>
            <div>
              <dt>{t(locale, "Prix", "Pricing")}</dt>
              <dd>{cohort.pricing}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <a
              className="education-button"
              href={cohort.admissionsUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t(locale, "Commencer l’inscription", "Start application")}
            </a>
            <a
              className="education-button education-button--secondary"
              href={cohort.pdfRequestHref}
            >
              {t(locale, "Demander le programme PDF", "Request the program PDF")}
            </a>
            <Link className="education-text-link" href={localizePath(locale, `/centers/${cohort.centerSlug}`)}>
              {t(locale, "Voir le centre", "View the center")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Ce que cette cohorte met en avant", "What this cohort emphasizes")}</h2>
          <Link className="text-link" href={localizePath(locale, "/trainings")}>
            {t(locale, "Revenir à la formation", "Back to training")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-pathway">
          {cohort.highlights.map((item) => (
            <article className="education-card education-training-pathway-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {featuredTeachers.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Quelques personnes qui portent cette cohorte", "Some of the people carrying this cohort")}</h2>
            <Link className="text-link" href={localizePath(locale, "/teachers")}>
              {t(locale, "Voir tous les intervenants", "See all teachers")}
            </Link>
          </div>
          <EducationTeacherCardGrid locale={locale} teachers={featuredTeachers} />
        </section>
      ) : null}

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Ce que le parcours comprend", "What the pathway includes")}</h2>
          <Link className="text-link" href={localizePath(locale, "/day-in-training")}>
            {t(locale, "Voir une journée type", "See a typical day")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--home-links">
          {cohort.pathwayIncludes.map((item) => (
            <article className="education-card education-home-link-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="education-center-training education-card">
        <div className="education-center-training__copy">
          <p className="home-section-kicker">{t(locale, "Préparer la suite", "Prepare the next step")}</p>
          <h2>{t(locale, "Vous voulez vérifier si cette cohorte vous correspond ?", "Want to check whether this cohort fits you?")}</h2>
          <p>
            {t(
              locale,
              "Commencez par regarder le centre, la journée type et les possibilités de financement. Ensuite, un échange direct permet souvent de clarifier le bon point d’entrée.",
              "Start by looking at the center, the typical day, and financing options. After that, a direct conversation often clarifies the right entry point.",
            )}
          </p>
          {cohort.note ? <p className="education-training-intro__note">{cohort.note}</p> : null}
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, `/centers/${cohort.centerSlug}`)}>
            {t(locale, "Voir le centre", "View the center")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/financing")}>
            {t(locale, "Voir le financement", "See financing")}
          </Link>
          <a
            className="education-text-link"
            href={cohort.admissionsUrl}
            rel="noreferrer"
            target="_blank"
          >
            {t(locale, "Ouvrir l’inscription", "Open application")}
          </a>
        </div>
      </section>
    </EducationContentPage>
  );
}
