import Link from "next/link";

import type { EducationCenterProfile } from "@/lib/education-content";
import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationClassesPageProps = {
  locale: string;
  page: NarrativePage;
  centers: EducationCenterProfile[];
  featuredTeachers: EducationTeacherProfile[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationClassesPage({
  locale,
  page,
  centers,
  featuredTeachers,
}: EducationClassesPageProps) {
  return (
    <EducationContentPage className="education-classes-page" eyebrow={t(locale, "Pratique", "Practice")} page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Entrer dans la pratique", "Enter the practice")}</p>
          <h2>{t(locale, "Les cours existent à travers le réseau, pas sur un seul site", "Classes live across the network, not on a single site")}</h2>
          <p>
            {t(
              locale,
              "Pour FE, les cours réguliers sont une porte d’entrée vers la méthode, mais ils prennent forme dans les centres, auprès des praticien·nes et parfois comme prolongement des formations et ateliers.",
              "For FE, regular classes are one entry point into the method, but they take shape through the centers, with practitioners, and sometimes as a continuation of trainings and workshops.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Cette page sert donc d’orientation: où commencer, quels lieux regarder, et comment passer d’une pratique régulière à un parcours plus approfondi.",
              "So this page works as orientation: where to begin, which places to look at, and how to move from regular practice into a deeper pathway.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "À travers plusieurs centres", "Across multiple centers")}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Format", "Format")}</dt>
              <dd>{t(locale, "Cours collectifs et pratiques régulières", "Group classes and ongoing practice")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Orientation", "Orientation")}</dt>
              <dd>{t(locale, "Centres, praticien·nes, ateliers", "Centers, practitioners, workshops")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Étape suivante", "Next step")}</dt>
              <dd>{t(locale, "Choisir un lieu ou un praticien", "Choose a place or a practitioner")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/find-a-practitioner")}>
              {t(locale, "Trouver un praticien", "Find a practitioner")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/workshops")}>
              {t(locale, "Voir les ateliers", "View workshops")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Trois bonnes façons de commencer", "Three good ways to begin")}</h2>
          <Link className="text-link" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous écrire", "Write to us")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          <article className="education-card education-home-link-card">
            <h3>{t(locale, "Commencer par un cours", "Begin with a class")}</h3>
            <p>
              {t(
                locale,
                "Si vous cherchez un rythme régulier, commencez par un centre partenaire ou un·e praticien·ne qui propose des cours de groupe.",
                "If you are looking for a regular rhythm, start with a partner center or a practitioner offering group classes.",
              )}
            </p>
          </article>
          <article className="education-card education-home-link-card">
            <h3>{t(locale, "Passer par un atelier", "Start through a workshop")}</h3>
            <p>
              {t(
                locale,
                "Beaucoup de personnes découvrent d’abord la méthode dans un atelier intensif avant de poursuivre avec une pratique plus suivie.",
                "Many people first discover the method in an intensive workshop before continuing with more regular practice.",
              )}
            </p>
          </article>
          <article className="education-card education-home-link-card">
            <h3>{t(locale, "Chercher un accompagnement ciblé", "Look for targeted guidance")}</h3>
            <p>
              {t(
                locale,
                "Si votre question est plus précise, une séance individuelle ou une orientation vers le bon centre est souvent plus juste qu’un simple horaire de cours.",
                "If your question is more specific, a private session or orientation toward the right center is often more helpful than a simple class timetable.",
              )}
            </p>
          </article>
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Quelques portes d’entrée", "A few entry points")}</h2>
          <Link className="text-link" href={localizePath(locale, "/centers")}>
            {t(locale, "Voir tous les centres", "View all centers")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--centers">
          {centers.map((center) => (
            <article className="education-card home-center-card" key={center.slug}>
              <div
                className="home-center-card__media"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.92)), url(${center.heroImageUrl})`,
                }}
              />
              <div className="home-center-card__body">
                <p className="home-center-card__location">{center.location}</p>
                <h3>{center.name}</h3>
                <p>{center.summary}</p>
                <div className="education-offer-card__actions">
                  <Link className="education-button" href={localizePath(locale, `/centers/${center.slug}`)}>
                    {t(locale, "Voir ce centre", "View this center")}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {featuredTeachers.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Des personnes pour vous orienter", "People who can orient you")}</h2>
            <Link className="text-link" href={localizePath(locale, "/teachers")}>
              {t(locale, "Voir les enseignant·es", "See the teachers")}
            </Link>
          </div>
          <EducationTeacherCardGrid locale={locale} teachers={featuredTeachers} />
        </section>
      ) : null}

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Étape suivante", "Next step")}</p>
          <h2>{t(locale, "Pas sûr·e du bon point d’entrée ?", "Not sure what the right starting point is?")}</h2>
          <p>
            {t(
              locale,
              "On peut vous aider à choisir entre cours réguliers, séance individuelle, atelier ponctuel ou parcours plus long.",
              "We can help you choose between regular classes, a private session, a workshop, or a longer pathway.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/find-a-practitioner")}>
            {t(locale, "Trouver un praticien", "Find a practitioner")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
            {t(locale, "Parler avec l’équipe", "Talk with the team")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
