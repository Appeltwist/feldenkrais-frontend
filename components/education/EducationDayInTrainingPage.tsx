import Link from "next/link";

import type {
  EducationTrainingCohort,
  EducationTrainingIncludedItem,
  EducationTrainingProgramStat,
} from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationDayInTrainingPageProps = {
  locale: string;
  page: NarrativePage;
  cohorts: EducationTrainingCohort[];
  includedItems: EducationTrainingIncludedItem[];
  trainingStats: EducationTrainingProgramStat[];
};

type RhythmCard = {
  title: string;
  body: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationDayInTrainingPage({
  locale,
  page,
  cohorts,
  includedItems,
  trainingStats,
}: EducationDayInTrainingPageProps) {
  const fallbackTitle = t(locale, "Une journée dans la formation", "A day in training");
  const fallbackSubtitle = t(
    locale,
    "Un aperçu du rythme, de la présence et de la continuité réelle d’un segment FE.",
    "A look at the rhythm, presence, and real continuity of an FE segment.",
  );
  const fallbackHeroBody = t(
    locale,
    "La force du parcours FE ne tient pas seulement au contenu. Elle tient au rythme quotidien, à la qualité d’attention, au temps d’intégration, et à ce qui continue entre les segments.",
    "The strength of the FE pathway does not come only from content. It comes from the daily rhythm, the quality of attention, the time for integration, and what continues between segments.",
  );
  const resolvedPage: NarrativePage = {
    ...page,
    title: page.title || fallbackTitle,
    subtitle: page.subtitle || fallbackSubtitle,
    hero: {
      ...page.hero,
      title: page.hero.title || page.title || fallbackTitle,
      body: page.hero.body || page.subtitle || fallbackHeroBody,
    },
    primaryCta: page.primaryCta ?? {
      label: t(locale, "Voir la formation", "View the training"),
      url: localizePath(locale, "/trainings"),
    },
  };

  const rhythm: RhythmCard[] = [
    {
      title: t(locale, "Commencer doucement", "Start gently"),
      body: t(
        locale,
        "La journée commence souvent autour d’un café, dans un rythme qui laisse le temps d’arriver, de s’orienter, et d’entrer dans l’étude.",
        "The day often begins around coffee, in a rhythm that leaves time to arrive, orient yourself, and enter the study.",
      ),
    },
    {
      title: t(locale, "Leçon collective", "Group lesson"),
      body: t(
        locale,
        "Les leçons d’Awareness Through Movement ouvrent la journée avec une recherche guidée, sensible et progressive.",
        "Awareness Through Movement lessons open the day with guided, sensitive, and progressive research.",
      ),
    },
    {
      title: t(locale, "Démonstration FI", "FI demonstration"),
      body: t(
        locale,
        "Les démonstrations d’Intégration Fonctionnelle montrent comment le travail passe aussi par l’écoute manuelle et la relation.",
        "Functional Integration demonstrations show how the work also passes through hands-on listening and relationship.",
      ),
    },
    {
      title: t(locale, "Pause et intégration", "Pause and integration"),
      body: t(
        locale,
        "Le déjeuner, la bibliothèque, le jardin ou la cuisine deviennent des lieux d’échange, de repos et de maturation.",
        "Lunch, the library, the garden, or the kitchen become places for exchange, rest, and digestion of the work.",
      ),
    },
    {
      title: t(locale, "Tout est enregistré", "Everything is recorded"),
      body: t(
        locale,
        "Les journées sont ensuite déposées sur la plateforme pour revoir un segment, rattraper une absence, ou continuer à intégrer.",
        "The days are then uploaded to the platform to review a segment, catch up if needed, or continue integrating.",
      ),
    },
    {
      title: t(locale, "Au-delà des heures de cours", "Beyond teaching hours"),
      body: t(
        locale,
        "Les soirées, les moments informels, et les jours off font partie du parcours: on apprend aussi par les liens qui se tissent.",
        "Evenings, informal moments, and days off are part of the pathway too: learning also happens through the relationships that form.",
      ),
    },
  ];

  return (
    <EducationContentPage className="education-day-in-training-page" eyebrow={t(locale, "Formation", "Training")} page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Bien plus qu’une formation", "Much more than a training")}</p>
          <h2>
            {t(
              locale,
              "Ce qui donne envie de rester, c’est l’expérience vécue dans le segment.",
              "What makes people stay is the lived experience inside the segment.",
            )}
          </h2>
          <p>
            {t(
              locale,
              "Au-delà des raisons qui amènent à commencer, c’est le rythme quotidien, la qualité de présence, et la continuité entre étude, pratique et vie collective qui donnent sa force à la formation.",
              "Beyond the reasons that bring someone to start, it is the daily rhythm, quality of presence, and continuity between study, practice, and collective life that give the training its depth.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "C’est aussi la meilleure manière de comprendre qu’une cohorte FE n’est pas une suite de cours isolés, mais un environnement d’apprentissage étalé dans le temps.",
              "It is also the clearest way to understand that an FE cohort is not a series of isolated classes, but a learning environment unfolding over time.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Repères FE", "FE markers")}</p>
          <h2>{t(locale, "Ce que cela implique", "What that implies")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Durée du parcours", "Program duration")}</dt>
              <dd>{trainingStats[0]?.value || t(locale, "4 ans", "4 years")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Temps cumulé", "Cumulative time")}</dt>
              <dd>{trainingStats[2]?.value || t(locale, "160 jours", "160 days")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Entre les segments", "Between segments")}</dt>
              <dd>{t(locale, "Pratique, plateforme, intégration", "Practice, platform, integration")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/trainings")}>
              {t(locale, "Revenir à la formation", "Back to training")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
              {t(locale, "Poser une question", "Ask a question")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Le rythme d’une journée", "The rhythm of a day")}</h2>
          <Link className="text-link" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir la formation", "View the training")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-pathway">
          {rhythm.map((item) => (
            <article className="education-card education-training-pathway-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Ce qui continue entre les segments", "What continues between segments")}</h2>
          <Link className="text-link" href={localizePath(locale, "/platform")}>
            {t(locale, "Voir la plateforme", "See the platform")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {includedItems.slice(0, 5).map((item) => (
            <article className="education-card education-home-link-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Des atmosphères différentes selon la cohorte", "Different atmospheres depending on the cohort")}</h2>
          <Link className="text-link" href={localizePath(locale, "/centers")}>
            {t(locale, "Voir tous les centres", "View all centers")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-cohorts">
          {cohorts.map((cohort) => (
            <article className="education-card education-training-cohort-card" key={cohort.slug}>
              <p className="education-page__date-range">{cohort.location}</p>
              <h3>{cohort.name}</h3>
              <p>{cohort.overviewParagraphs[0] ?? cohort.page.subtitle ?? ""}</p>
              <div className="education-training-cohort-card__facts">
                <div>
                  <strong>{t(locale, "Centre", "Center")}</strong>
                  <span>{cohort.centerName}</span>
                </div>
                <div>
                  <strong>{t(locale, "Direction", "Direction")}</strong>
                  <span>{cohort.director}</span>
                </div>
                <div>
                  <strong>{t(locale, "Segments", "Segments")}</strong>
                  <span>{cohort.segments}</span>
                </div>
              </div>
              <div className="education-offer-card__actions">
                <Link className="education-button" href={localizePath(locale, `/trainings/${cohort.slug}`)}>
                  {t(locale, "Voir cette cohorte", "View this cohort")}
                </Link>
                <Link className="education-text-link" href={localizePath(locale, `/centers/${cohort.centerSlug}`)}>
                  {t(locale, "Découvrir ce centre", "Discover this center")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="education-training-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Approfondir", "Go further")}</p>
          <h2>{t(locale, "Envie de voir si ce rythme vous convient ?", "Curious whether this rhythm fits you?")}</h2>
          <p>
            {t(
              locale,
              "Passez ensuite par la page formation, le financement, ou un échange direct avec l’équipe pour préciser votre point d’entrée.",
              "From here, continue with the training page, financing guidance, or a direct conversation with the team to clarify your entry point.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/trainings")}>
            {t(locale, "Voir la formation", "View the training")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/financing")}>
            {t(locale, "Voir le financement", "See financing")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
