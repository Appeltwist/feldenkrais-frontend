import Link from "next/link";

import type { EducationCenterProfile } from "@/lib/education-content";
import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationAboutPageProps = {
  locale: string;
  page: NarrativePage;
  centers: EducationCenterProfile[];
  featuredTeachers: EducationTeacherProfile[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationAboutPage({
  locale,
  page,
  centers,
  featuredTeachers,
}: EducationAboutPageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    title: t(locale, "À propos de Feldenkrais Education", "About Feldenkrais Education"),
    subtitle: t(
      locale,
      "Un site de marque qui relie formations, centres, ressources et enseignants autour d’une même pédagogie.",
      "A brand site connecting trainings, centers, resources, and teachers around one shared pedagogy.",
    ),
    hero: {
      ...page.hero,
      title: t(locale, "À propos de Feldenkrais Education", "About Feldenkrais Education"),
      body: t(
        locale,
        "Feldenkrais Education n’est pas un centre unique. C’est une structure éditoriale et pédagogique qui met en relation des cohortes, des lieux, des personnes et des ressources à l’échelle du réseau.",
        "Feldenkrais Education is not a single center. It is an editorial and pedagogical structure that connects cohorts, places, people, and resources across the network.",
      ),
    },
  };

  const pillars = [
    {
      title: t(locale, "Former de nouveaux praticien·nes", "Train the next generation of practitioners"),
      body: t(
        locale,
        "FE sert d’abord de porte d’entrée vers les formations professionnelles, leurs cohortes, leurs centres, leurs documents et leur continuité pédagogique.",
        "FE first serves as an entry point into professional trainings, their cohorts, their centers, their documents, and their pedagogical continuity.",
      ),
      href: "/trainings",
      cta: t(locale, "Voir les formations", "View trainings"),
    },
    {
      title: t(locale, "Rendre la méthode accessible", "Make the method more accessible"),
      body: t(
        locale,
        "Le site relie aussi ateliers, domaines, vidéos, newsletter et pages éditoriales afin que la méthode soit compréhensible avant même d’entrer dans une formation.",
        "The site also connects workshops, domains, videos, newsletter, and editorial pages so the method is understandable before entering a training.",
      ),
      href: "/what-is-feldenkrais",
      cta: t(locale, "Découvrir la méthode", "Discover the method"),
    },
    {
      title: t(locale, "Relier le site à l’écosystème", "Connect the site to the wider ecosystem"),
      body: t(
        locale,
        "FE n’est qu’une partie du paysage: certains contenus, pratiques et continuités d’étude se poursuivent sur Neurosomatic et dans les centres partenaires.",
        "FE is only one part of the landscape: some content, practices, and study continuity continue on Neurosomatic and across partner centers.",
      ),
      href: "/platform",
      cta: t(locale, "Voir la plateforme", "See the platform"),
    },
  ];

  return (
    <EducationContentPage className="education-about-page" eyebrow={t(locale, "Présentation", "About")} page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "FE comme site de marque", "FE as a brand site")}</p>
          <h2>{t(locale, "Une porte d’entrée transversale, pas un lieu unique", "A cross-site entry point, not a single place")}</h2>
          <p>
            {t(
              locale,
              "L’ancien site FE mélangeait déjà des formations, des centres, des domaines, des enseignants et des ressources. Le nouveau site garde cette logique, mais de façon plus claire: FE présente l’ensemble, tandis que chaque centre garde sa singularité.",
              "The former FE site already mixed trainings, centers, domains, teachers, and resources. The new site keeps that logic, but more clearly: FE presents the whole while each center keeps its own specificity.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "C’est ce qui permet à une cohorte de vivre dans un centre précis tout en étant visible sur FE, et demain aussi sur d’autres sites du même écosystème.",
              "That is what allows a cohort to live in a specific center while also being visible on FE, and later on other sites in the same ecosystem.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Rôle principal", "Primary role")}</p>
          <h2>{t(locale, "Ce que FE rassemble", "What FE brings together")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Formations", "Trainings")}</dt>
              <dd>{t(locale, "Programmes, cohortes, brochures, admissions", "Programs, cohorts, brochures, admissions")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Centres", "Centers")}</dt>
              <dd>{t(locale, "Bruxelles, Cantal, Paris, et futurs lieux partenaires", "Brussels, Cantal, Paris, and future partner places")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Ressources", "Resources")}</dt>
              <dd>{t(locale, "Vidéos, domaines, newsletter, boutique, plateforme", "Videos, domains, newsletter, shop, platform")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/trainings")}>
              {t(locale, "Explorer le parcours", "Explore the pathway")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
              {t(locale, "Nous écrire", "Write to us")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Ce que fait FE aujourd’hui", "What FE does today")}</h2>
          <Link className="text-link" href={localizePath(locale, "/newsletter")}>
            {t(locale, "Suivre l’actualité", "Follow updates")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {pillars.map((pillar) => (
            <article className="education-card education-home-link-card" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
              <Link className="education-text-link" href={localizePath(locale, pillar.href)}>
                {pillar.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {centers.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Les centres visibles sur FE", "Centers visible on FE")}</h2>
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
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.92)), url(${center.heroImageUrl})`,
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
      ) : null}

      {featuredTeachers.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Les personnes qui incarnent cette transmission", "The people carrying this transmission")}</h2>
            <Link className="text-link" href={localizePath(locale, "/teachers")}>
              {t(locale, "Voir les enseignant·es", "See the teachers")}
            </Link>
          </div>
          <EducationTeacherCardGrid locale={locale} teachers={featuredTeachers.slice(0, 4)} />
        </section>
      ) : null}

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Prochaine étape", "Next step")}</p>
          <h2>{t(locale, "Vous voulez savoir où commencer dans l’écosystème FE ?", "Want to know where to start in the FE ecosystem?")}</h2>
          <p>
            {t(
              locale,
              "Selon votre question, le bon point de départ peut être une formation, un centre, un atelier, un domaine d’application, ou un échange direct avec l’équipe.",
              "Depending on your question, the right starting point may be a training, a center, a workshop, a domain of application, or a direct exchange with the team.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir les formations", "View trainings")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/find-a-practitioner")}>
            {t(locale, "Trouver un point d’entrée", "Find an entry point")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
