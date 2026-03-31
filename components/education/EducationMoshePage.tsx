import Link from "next/link";

import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationMoshePageProps = {
  locale: string;
  page: NarrativePage;
  featuredTeachers: EducationTeacherProfile[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationMoshePage({
  locale,
  page,
  featuredTeachers,
}: EducationMoshePageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    title: "Moshe Feldenkrais",
    subtitle: t(locale, "Une vie en mouvement", "A life in movement"),
    hero: {
      ...page.hero,
      title: "Moshe Feldenkrais",
      body: t(
        locale,
        "Physicien, judoka, inventeur et pédagogue, Moshe Feldenkrais a développé une approche où le mouvement devient une voie d’apprentissage, d’autonomie et de transformation.",
        "Physicist, judoka, inventor, and educator, Moshe Feldenkrais developed an approach in which movement becomes a path toward learning, autonomy, and transformation.",
      ),
    },
  };

  const chapters = [
    {
      title: t(locale, "Science, arts martiaux, curiosité", "Science, martial arts, curiosity"),
      body: t(
        locale,
        "Son parcours traverse la physique, le judo, l’ingénierie et un intérêt constant pour la façon dont les êtres humains apprennent en situation réelle.",
        "His path moves through physics, judo, engineering, and a constant interest in how human beings learn in real situations.",
      ),
    },
    {
      title: t(locale, "Une recherche née d’une nécessité", "A line of inquiry born from necessity"),
      body: t(
        locale,
        "À partir de ses propres blessures et limites, il explore comment retrouver de l’aisance sans forcer, en affinant la perception et l’organisation du mouvement.",
        "Starting from his own injuries and limitations, he explored how to recover ease without forcing, by refining perception and the organization of movement.",
      ),
    },
    {
      title: t(locale, "De la leçon à la pédagogie", "From lesson to pedagogy"),
      body: t(
        locale,
        "Son travail ne s’est pas réduit à une technique. Il a donné naissance à une véritable pédagogie, avec des leçons collectives, un travail individuel, et une pensée cohérente de l’apprentissage.",
        "His work did not reduce itself to a technique. It gave rise to a real pedagogy, with group lessons, individual work, and a coherent understanding of learning.",
      ),
    },
    {
      title: t(locale, "Un héritage vivant", "A living legacy"),
      body: t(
        locale,
        "Aujourd’hui, la méthode continue à travers des formateurs, des centres, des cohortes, des archives, et des contextes d’application très variés. FE fait le lien entre cette source et le présent.",
        "Today, the method continues through trainers, centers, cohorts, archives, and a wide range of application contexts. FE links that source to the present.",
      ),
    },
  ];

  const continuities = [
    {
      title: t(locale, "Dans les formations", "In the trainings"),
      body: t(
        locale,
        "Les cohortes professionnelles prolongent une manière exigeante et nuancée de transmettre la méthode, avec un vrai temps d’étude et d’intégration.",
        "Professional cohorts extend a demanding and nuanced way of transmitting the method, with real time for study and integration.",
      ),
      href: "/trainings",
      cta: t(locale, "Voir les cohortes", "See cohorts"),
    },
    {
      title: t(locale, "Dans les domaines", "In the domains"),
      body: t(
        locale,
        "La méthode continue aussi à rencontrer le monde contemporain: douleur, sport, voix, éducation, vieillissement, créativité.",
        "The method also keeps meeting the contemporary world: pain, sport, voice, education, ageing, creativity.",
      ),
      href: "/domains",
      cta: t(locale, "Voir les domaines", "See domains"),
    },
    {
      title: t(locale, "Dans les personnes", "In the people"),
      body: t(
        locale,
        "Ce qui compte n’est pas seulement l’histoire de Moshe Feldenkrais, mais la qualité de celles et ceux qui continuent à faire vivre cette source.",
        "What matters is not only Moshe Feldenkrais’ story, but the quality of the people who continue to keep that source alive.",
      ),
      href: "/teachers",
      cta: t(locale, "Voir les enseignant·es", "See the teachers"),
    },
  ];

  return (
    <EducationContentPage className="education-moshe-page" eyebrow="Moshe Feldenkrais" page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "La source", "The source")}</p>
          <h2>{t(locale, "Une pensée du mouvement qui déborde largement le mouvement", "A way of thinking movement that reaches far beyond movement itself")}</h2>
          <p>
            {t(
              locale,
              "Parler de Moshe Feldenkrais, ce n’est pas seulement raconter une biographie. C’est comprendre comment une recherche singulière sur le mouvement, la perception et l’apprentissage est devenue une transmission mondiale.",
              "Speaking about Moshe Feldenkrais is not only telling a biography. It is understanding how a singular inquiry into movement, perception, and learning became a worldwide transmission.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "FE garde ce lien vivant en reliant la source historique aux enseignant·es, centres, cohortes et ressources d’aujourd’hui.",
              "FE keeps that link alive by connecting the historical source to today’s teachers, centers, cohorts, and resources.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Moshe Feldenkrais", "Moshe Feldenkrais")}</p>
          <h2>{t(locale, "Ce qui reste central", "What remains central")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Apprentissage", "Learning")}</dt>
              <dd>{t(locale, "Le changement passe par l’expérience", "Change happens through experience")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Organisation", "Organization")}</dt>
              <dd>{t(locale, "Le geste n’est jamais isolé du tout", "No gesture is isolated from the whole")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Transmission", "Transmission")}</dt>
              <dd>{t(locale, "Une source vivante, pas un culte de l’origine", "A living source, not a cult of origin")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/what-is-feldenkrais")}>
              {t(locale, "Voir la méthode", "See the method")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/videos")}>
              {t(locale, "Voir les vidéos", "See the videos")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Quelques repères biographiques", "A few biographical markers")}</h2>
          <Link className="text-link" href={localizePath(locale, "/what-is-feldenkrais")}>
            {t(locale, "Revenir à la méthode", "Return to the method")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {chapters.map((chapter) => (
            <article className="education-card education-home-link-card" key={chapter.title}>
              <h3>{chapter.title}</h3>
              <p>{chapter.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Comment cet héritage reste vivant", "How that legacy remains alive")}</h2>
          <Link className="text-link" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir le parcours FE", "See the FE pathway")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {continuities.map((item) => (
            <article className="education-card education-home-link-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link className="education-text-link" href={localizePath(locale, item.href)}>
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {featuredTeachers.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Une partie de la lignée FE aujourd’hui", "Part of the FE lineage today")}</h2>
            <Link className="text-link" href={localizePath(locale, "/teachers")}>
              {t(locale, "Voir tous les profils", "See all profiles")}
            </Link>
          </div>
          <EducationTeacherCardGrid locale={locale} teachers={featuredTeachers.slice(0, 4)} />
        </section>
      ) : null}

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Depuis la source jusqu’au présent", "From the source to the present")}</p>
          <h2>{t(locale, "Vous voulez comprendre comment cette histoire devient une expérience réelle aujourd’hui ?", "Want to understand how this history becomes a real experience today?")}</h2>
          <p>
            {t(
              locale,
              "Le plus parlant n’est pas seulement de lire Moshe Feldenkrais. C’est aussi de voir comment sa pensée traverse des enseignant·es, des centres, des cohortes et des situations concrètes d’apprentissage.",
              "The clearest thing is not only to read Moshe Feldenkrais. It is also to see how his thinking runs through teachers, centers, cohorts, and concrete learning situations.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/teachers")}>
            {t(locale, "Voir les enseignant·es", "See the teachers")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir les formations", "View trainings")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
