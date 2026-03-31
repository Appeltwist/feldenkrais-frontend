import Link from "next/link";

import { getEducationCenter } from "@/lib/education-content";
import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { getEducationTrainingCohort } from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";

import EducationContentPage from "./EducationContentPage";

type EducationTeacherProfilePageProps = {
  teacher: EducationTeacherProfile;
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationTeacherProfilePage({
  teacher,
  locale,
}: EducationTeacherProfilePageProps) {
  const centers = teacher.centerSlugs
    .map((slug) => getEducationCenter(locale, slug))
    .filter((center) => center !== null);
  const cohorts = teacher.cohortSlugs
    .map((slug) => getEducationTrainingCohort(locale, slug))
    .filter((cohort) => cohort !== null);
  const firstCohort = cohorts[0] ?? null;

  return (
    <EducationContentPage
      className="education-teacher-profile"
      eyebrow={teacher.section === "ecosystem" ? t(locale, "Écosystème", "Ecosystem") : t(locale, "Enseignant·e", "Teacher")}
      page={teacher.page}
    >
      <section className="education-teacher-profile__intro education-card">
        <div
          aria-hidden="true"
          className="education-teacher-profile__media"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.18)), url(${teacher.photoUrl})`,
          }}
        />
        <div className="education-teacher-profile__copy">
          <p className="education-page__date-range">{teacher.title}</p>
          <h2>{t(locale, "À propos", "About this teacher")}</h2>
          <p className="education-teacher-profile__lead">{teacher.shortBio}</p>
          {teacher.bioParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="education-teacher-profile__focus">
            {teacher.focusAreas.map((item) => (
              <span className="education-teacher-chip" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="education-offer-card__actions">
            <Link className="education-button" href={localizePath(locale, "/teachers")}>
              {t(locale, "Revenir aux intervenant·es", "Back to teachers")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir la formation", "View the training")}
            </Link>
          </div>
        </div>
      </section>

      {centers.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Où vous pouvez les rencontrer", "Where you may meet them")}</h2>
            <Link className="text-link" href={localizePath(locale, "/centers")}>
              {t(locale, "Voir tous les centres", "View all centers")}
            </Link>
          </div>
          <div className="education-card-grid education-card-grid--home-links">
            {centers.map((center) => (
              <article className="education-card education-home-link-card" key={center.slug}>
                <p className="education-page__date-range">{center.location}</p>
                <h3>{center.name}</h3>
                <p>{center.summary}</p>
                <div className="education-offer-card__actions">
                  <Link className="education-button" href={localizePath(locale, `/centers/${center.slug}`)}>
                    {t(locale, "Voir le centre", "View center")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {cohorts.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Les cohortes auxquelles cette personne contribue", "Cohorts this person contributes to")}</h2>
            <Link className="text-link" href={localizePath(locale, "/trainings")}>
              {t(locale, "Revenir à la formation", "Back to training")}
            </Link>
          </div>
          <div className="education-card-grid education-card-grid--training-cohorts">
            {cohorts.map((cohort) => (
              <article className="education-card education-training-cohort-card" key={cohort.slug}>
                <p className="education-page__date-range">{cohort.location}</p>
                <h3>{cohort.name}</h3>
                <p>{cohort.page.subtitle ?? cohort.overviewParagraphs[0] ?? ""}</p>
                <div className="education-training-cohort-card__facts">
                  <div>
                    <strong>{t(locale, "Période", "Period")}</strong>
                    <span>{cohort.periodLabel}</span>
                  </div>
                  <div>
                    <strong>{t(locale, "Direction", "Direction")}</strong>
                    <span>{cohort.director}</span>
                  </div>
                </div>
                <div className="education-offer-card__actions">
                  <Link className="education-button" href={localizePath(locale, `/trainings/${cohort.slug}`)}>
                    {t(locale, "Voir cette cohorte", "View this cohort")}
                  </Link>
                  <a className="education-text-link" href={cohort.pdfRequestHref}>
                    {t(locale, "Demander le PDF", "Request PDF")}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Étape suivante", "Next step")}</p>
          <h2>{t(locale, "Vous voulez savoir si cette personne sera dans votre parcours ?", "Want to know whether this person will be part of your pathway?")}</h2>
          <p>
            {firstCohort
              ? t(
                  locale,
                  "Le plus simple est de regarder la cohorte concernée, puis de demander le programme PDF ou de nous écrire pour clarifier les présences et la continuité pédagogique.",
                  "The simplest path is to look at the relevant cohort, then request the program PDF or write to us to clarify presence and pedagogical continuity.",
                )
              : t(
                  locale,
                  "Écrivez-nous si vous voulez comprendre comment cette personne intervient dans les formations, ateliers ou parcours du réseau FE.",
                  "Write to us if you want to understand how this person contributes to the trainings, workshops, or pathways across the FE network.",
                )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          {firstCohort ? (
            <Link className="education-button" href={localizePath(locale, `/trainings/${firstCohort.slug}`)}>
              {t(locale, "Voir la cohorte liée", "View related cohort")}
            </Link>
          ) : (
            <Link className="education-button" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir la formation", "View the training")}
            </Link>
          )}
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous contacter", "Contact us")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
