import Link from "next/link";

import type { EducationCenterProfile } from "@/lib/education-content";
import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationPractitionerFinderPageProps = {
  locale: string;
  page: NarrativePage;
  centers: EducationCenterProfile[];
  featuredTeachers: EducationTeacherProfile[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationPractitionerFinderPage({
  locale,
  page,
  centers,
  featuredTeachers,
}: EducationPractitionerFinderPageProps) {
  const routes = [
    {
      title: t(locale, "Pratique régulière", "Regular practice"),
      body: t(
        locale,
        "Si vous cherchez un rythme hebdomadaire ou une continuité dans l’exploration, commencez par les cours, les centres et les praticien·nes proches de vous.",
        "If you are looking for a weekly rhythm or continuity in exploration, start with classes, centers, and practitioners near you.",
      ),
      href: "/classes",
      cta: t(locale, "Voir les cours", "See classes"),
    },
    {
      title: t(locale, "Accompagnement ciblé", "Targeted support"),
      body: t(
        locale,
        "Si votre question est plus précise, une séance individuelle ou un échange avec la bonne personne est souvent le meilleur point de départ.",
        "If your question is more specific, a private session or conversation with the right person is often the best starting point.",
      ),
      href: "/private-sessions",
      cta: t(locale, "Voir les séances", "See private sessions"),
    },
    {
      title: t(locale, "Parcours long", "Long-form pathway"),
      body: t(
        locale,
        "Certaines recherches conduisent vers une cohorte, un centre, ou une formation complète plutôt que vers une simple séance.",
        "Some lines of inquiry lead toward a cohort, a center, or a full training rather than a single session.",
      ),
      href: "/trainings",
      cta: t(locale, "Voir les formations", "See trainings"),
    },
  ];

  return (
    <EducationContentPage className="education-practitioner-page" eyebrow={t(locale, "Orientation", "Orientation")} page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Trouver la bonne personne", "Finding the right person")}</p>
          <h2>{t(locale, "Un bon praticien, c’est aussi un bon contexte", "The right practitioner also means the right context")}</h2>
          <p>
            {t(
              locale,
              "Sur FE, trouver un praticien ne veut pas seulement dire trouver un nom. Cela veut dire repérer le bon format, la bonne langue, le bon centre, et la bonne personne pour votre question.",
              "On FE, finding a practitioner does not only mean finding a name. It means identifying the right format, language, center, and person for your question.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Cette page sert d’orientation entre pratique régulière, séance individuelle, atelier, et parcours plus approfondi.",
              "This page serves as orientation between regular practice, private sessions, workshops, and deeper pathways.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Réseau FE", "FE network")}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "À travers", "Across")}</dt>
              <dd>{t(locale, "Centres, enseignant·es et praticien·nes", "Centers, teachers, and practitioners")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Point de départ", "Starting point")}</dt>
              <dd>{t(locale, "Votre besoin, pas seulement un annuaire", "Your need, not only a directory")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Étape suivante", "Next step")}</dt>
              <dd>{t(locale, "Choisir le bon format", "Choose the right format")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/contact")}>
              {t(locale, "Être orienté·e", "Get oriented")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/teachers")}>
              {t(locale, "Voir les profils", "See profiles")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Par où commencer ?", "Where to start?")}</h2>
          <Link className="text-link" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous écrire", "Write to us")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {routes.map((route) => (
            <article className="education-card education-home-link-card" key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.body}</p>
              <Link className="education-text-link" href={localizePath(locale, route.href)}>
                {route.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {featuredTeachers.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Quelques personnes à connaître", "A few people to know")}</h2>
            <Link className="text-link" href={localizePath(locale, "/teachers")}>
              {t(locale, "Voir les enseignant·es", "See the teachers")}
            </Link>
          </div>
          <EducationTeacherCardGrid locale={locale} teachers={featuredTeachers} />
        </section>
      ) : null}

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Quelques lieux pour commencer", "A few places to begin")}</h2>
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

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Orientation FE", "FE orientation")}</p>
          <h2>{t(locale, "Vous ne savez pas encore si vous cherchez un praticien, un centre ou une formation ?", "Not sure whether you are looking for a practitioner, a center, or a training?")}</h2>
          <p>
            {t(
              locale,
              "C’est justement le rôle de FE: faire le lien entre les personnes, les lieux et les formats pour que votre point d’entrée soit juste.",
              "That is precisely FE’s role: linking people, places, and formats so your entry point is the right one.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/contact")}>
            {t(locale, "Parler avec l’équipe", "Talk with the team")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/private-sessions")}>
            {t(locale, "Voir les séances individuelles", "See private sessions")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
