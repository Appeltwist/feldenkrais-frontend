import Link from "next/link";

import type { EducationCenterProfile } from "@/lib/education-content";
import { getEducationTeachersByCenter } from "@/lib/education-teachers";
import { getEducationTrainingCohortByCenter } from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationCenterDetailPageProps = {
  center: EducationCenterProfile;
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationCenterDetailPage({
  center,
  locale,
}: EducationCenterDetailPageProps) {
  const cohort = getEducationTrainingCohortByCenter(locale, center.slug);
  const featuredTeachers = getEducationTeachersByCenter(locale, center.slug);

  return (
    <EducationContentPage
      className="education-center-page"
      eyebrow={t(locale, "Centre", "Center")}
      page={center.page}
    >
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{center.legacyTitle}</p>
          <h2>{t(locale, "Le lieu et son rythme", "The place and its rhythm")}</h2>
          {center.overviewParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{center.location}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Adresse", "Address")}</dt>
              <dd>{center.address}</dd>
            </div>
            <div>
              <dt>{t(locale, "Prochaine cohorte", "Current cohort")}</dt>
              <dd>{center.upcomingTraining.name}</dd>
            </div>
            {center.note ? (
              <div>
                <dt>{t(locale, "Pour qui", "Good fit")}</dt>
                <dd>{center.note}</dd>
              </div>
            ) : null}
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/contact")}>
              {t(locale, "Parler de ce centre", "Talk through this center")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Revenir à la formation", "Back to training")}
            </Link>
            <Link className="education-text-link" href={localizePath(locale, "/day-in-training")}>
              {t(locale, "Voir une journée type", "See a typical day")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Ce que ce centre rend possible", "What this center makes possible")}</h2>
          <Link className="text-link" href={localizePath(locale, "/centers")}>
            {t(locale, "Voir tous les centres", "View all centers")}
          </Link>
        </div>
        <p className="home-section__intro">{center.summary}</p>
        <div className="education-card-grid education-card-grid--training-pathway">
          {center.highlights.map((item) => (
            <article className="education-card education-training-pathway-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Quelques personnes que vous pourriez y rencontrer", "A few people you may meet here")}</h2>
          <Link className="text-link" href={localizePath(locale, "/teachers")}>
            {t(locale, "Voir les intervenants", "See the teachers")}
          </Link>
        </div>
        {featuredTeachers.length > 0 ? (
          <EducationTeacherCardGrid locale={locale} teachers={featuredTeachers} />
        ) : (
          <div className="education-card-grid education-card-grid--home-links">
            {center.teachers.map((teacher) => (
              <article className="education-card education-home-link-card" key={teacher.name}>
                <h3>{teacher.name}</h3>
                <p>{teacher.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="education-center-training education-card">
        <div className="education-center-training__copy">
          <p className="home-section-kicker">{t(locale, "Formation en cours", "Training opening")}</p>
          <h2>{center.upcomingTraining.name}</h2>
          <p>{center.upcomingTraining.body}</p>
          {center.upcomingTraining.note ? (
            <p className="education-training-intro__note">{center.upcomingTraining.note}</p>
          ) : null}
        </div>
        <div className="education-offer-card__actions">
          {cohort ? (
            <Link className="education-button" href={localizePath(locale, `/trainings/${cohort.slug}`)}>
              {t(locale, "Voir cette cohorte", "View this cohort")}
            </Link>
          ) : (
            <Link className="education-button" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir la page formation", "View training page")}
            </Link>
          )}
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/financing")}>
            {t(locale, "Préparer le financement", "Prepare financing")}
          </Link>
        </div>
      </section>

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Étape suivante", "Next step")}</p>
          <h2>{t(locale, "Besoin d’aide pour choisir entre plusieurs centres ?", "Need help choosing between centers?")}</h2>
          <p>
            {t(
              locale,
              "Commencez par un échange. Nous pouvons vous orienter vers le bon centre, le bon rythme et les bons documents.",
              "Start with a conversation. We can help orient you toward the right center, rhythm, and documents.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous contacter", "Contact us")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/centers")}>
            {t(locale, "Comparer les centres", "Compare centers")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
