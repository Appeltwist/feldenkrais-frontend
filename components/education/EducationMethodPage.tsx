import Link from "next/link";

import type { EducationDomainEntry } from "@/lib/education-domains";
import type { EducationTeacherProfile } from "@/lib/education-teachers";
import type { EducationTrainingProgramStat } from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationMethodPageProps = {
  locale: string;
  page: NarrativePage;
  domains: EducationDomainEntry[];
  featuredTeachers: EducationTeacherProfile[];
  trainingStats: EducationTrainingProgramStat[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationMethodPage({
  locale,
  page,
  domains,
  featuredTeachers,
  trainingStats,
}: EducationMethodPageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    title: t(locale, "La méthode Feldenkrais", "The Feldenkrais Method"),
    subtitle: t(
      locale,
      "Une approche de l’apprentissage par le mouvement, l’attention et l’organisation de soi.",
      "An approach to learning through movement, attention, and self-organization.",
    ),
    hero: {
      ...page.hero,
      title: t(locale, "La méthode Feldenkrais", "The Feldenkrais Method"),
      body: t(
        locale,
        "FE présente la méthode comme une pédagogie vivante: une manière d’affiner la perception, d’ouvrir de nouvelles options, et de transformer l’apprentissage dans des contextes très différents.",
        "FE presents the method as a living pedagogy: a way to refine perception, open new options, and transform learning across very different contexts.",
      ),
    },
  };

  const principles = [
    {
      title: t(locale, "Prendre conscience par le mouvement", "Awareness through movement"),
      body: t(
        locale,
        "La méthode s’appuie sur des explorations guidées qui changent la qualité d’attention, pas seulement la forme visible du geste.",
        "The method relies on guided explorations that change the quality of attention, not only the visible shape of an action.",
      ),
    },
    {
      title: t(locale, "Multiplier les options", "Expand available options"),
      body: t(
        locale,
        "L’enjeu n’est pas d’apprendre un modèle unique, mais de retrouver davantage de choix, d’aisance et de réversibilité.",
        "The point is not to learn one correct model, but to recover more choice, ease, and reversibility.",
      ),
    },
    {
      title: t(locale, "Relier apprentissage et contexte", "Link learning and context"),
      body: t(
        locale,
        "Sport, voix, douleur, vieillissement, éducation, créativité: la méthode garde une même logique tout en rencontrant des situations très différentes.",
        "Sport, voice, pain, ageing, education, creativity: the method keeps the same logic while meeting very different situations.",
      ),
    },
  ];

  return (
    <EducationContentPage className="education-method-page" eyebrow="Feldenkrais" page={resolvedPage}>
      <nav className="education-anchor-nav" aria-label={t(locale, "Navigation de page", "Page navigation")}>
        <Link href="#method">{t(locale, "La méthode", "The method")}</Link>
        <Link href="#domains">{t(locale, "12 domaines", "12 domains")}</Link>
        <Link href="#training">{t(locale, "Formation", "Training")}</Link>
        <Link href="#teachers">{t(locale, "Enseignant·es", "Teachers")}</Link>
      </nav>

      <section className="education-center-intro education-card" id="method">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Entrée dans la méthode", "Entering the method")}</p>
          <h2>{t(locale, "Ni thérapie standardisée, ni gymnastique corrective", "Neither standardized therapy nor corrective gymnastics")}</h2>
          <p>
            {t(
              locale,
              "La méthode Feldenkrais est une pédagogie du mouvement. Elle travaille sur la façon dont nous percevons, organisons, différencions et apprenons, afin que le changement soit durable et réellement intégré.",
              "The Feldenkrais Method is a pedagogy of movement. It works on how we perceive, organize, differentiate, and learn, so that change can be durable and truly integrated.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "C’est pour cela que FE relie toujours la méthode à des situations concrètes: des formations, des centres, des ateliers, des ressources, et des domaines d’application.",
              "That is why FE always connects the method to concrete situations: trainings, centers, workshops, resources, and domains of application.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Repères FE", "FE markers")}</p>
          <h2>{t(locale, "Comment entrer", "How to enter")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Par la pratique", "Through practice")}</dt>
              <dd>{t(locale, "Cours, séance individuelle, atelier", "Classes, private sessions, workshops")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Par un domaine", "Through a domain")}</dt>
              <dd>{t(locale, "Douleur, voix, enfants, sport, créativité…", "Pain, voice, children, sport, creativity…")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Par la formation", "Through training")}</dt>
              <dd>{t(locale, "Un parcours professionnel complet", "A full professional pathway")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/find-a-practitioner")}>
              {t(locale, "Trouver une entrée", "Find an entry point")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir les formations", "View trainings")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Trois repères simples", "Three simple markers")}</h2>
          <Link className="text-link" href={localizePath(locale, "/find-a-practitioner")}>
            {t(locale, "Être orienté·e", "Get oriented")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {principles.map((principle) => (
            <article className="education-card education-home-link-card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      {domains.length > 0 ? (
        <section className="home-section" id="domains">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Quelques domaines d’application", "A few application domains")}</h2>
            <Link className="text-link" href={localizePath(locale, "/domains")}>
              {t(locale, "Voir les 12 domaines", "See the 12 domains")}
            </Link>
          </div>
          <div className="education-card-grid education-card-grid--domains">
            {domains.slice(0, 6).map((domain) => (
              <article className="education-domain-card" key={domain.slug}>
                {domain.imageUrl ? (
                  <div
                    className="education-domain-card__media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.92)), url(${domain.imageUrl})`,
                    }}
                  />
                ) : null}
                <div className="education-domain-card__body">
                  <p className="education-page__date-range">{t(locale, "Domaine FE", "FE domain")}</p>
                  <h3>{domain.title}</h3>
                  <p>{domain.excerpt}</p>
                  <div className="education-offer-card__actions">
                    <Link className="education-button" href={localizePath(locale, `/domains/${domain.slug}`)}>
                      {t(locale, "Explorer ce domaine", "Explore this domain")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="home-section" id="training">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Quand la méthode devient un parcours", "When the method becomes a pathway")}</h2>
          <Link className="text-link" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir la formation", "View the training")}
          </Link>
        </div>
        <p className="home-section__intro">
          {t(
            locale,
            "Sur FE, la méthode n’est pas seulement expliquée: elle est transmise dans des cohortes, des centres, des temps d’étude longs, et une continuité pédagogique réelle.",
            "On FE, the method is not only explained: it is transmitted through cohorts, centers, long periods of study, and real pedagogical continuity.",
          )}
        </p>
        <div className="education-card-grid education-card-grid--training-stats">
          {trainingStats.map((stat) => (
            <article className="education-card education-training-stat-card" key={stat.label}>
              <strong className="education-training-stat-card__value">{stat.value}</strong>
              <span className="education-training-stat-card__label">{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      {featuredTeachers.length > 0 ? (
        <section className="home-section" id="teachers">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Les personnes qui portent cette transmission", "The people carrying this transmission")}</h2>
            <Link className="text-link" href={localizePath(locale, "/teachers")}>
              {t(locale, "Voir les enseignant·es", "See the teachers")}
            </Link>
          </div>
          <EducationTeacherCardGrid locale={locale} teachers={featuredTeachers.slice(0, 4)} />
        </section>
      ) : null}

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Étape suivante", "Next step")}</p>
          <h2>{t(locale, "Vous voulez découvrir la méthode par un vrai point d’entrée ?", "Want to discover the method through a real entry point?")}</h2>
          <p>
            {t(
              locale,
              "Le meilleur chemin n’est pas toujours le même: parfois un centre, parfois un atelier, parfois une formation complète. FE sert justement à relier ces portes d’entrée.",
              "The best path is not always the same: sometimes a center, sometimes a workshop, sometimes a full training. FE exists precisely to connect those entry points.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/trainings")}>
            {t(locale, "Explorer les formations", "Explore trainings")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/find-a-practitioner")}>
            {t(locale, "Trouver un praticien", "Find a practitioner")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
