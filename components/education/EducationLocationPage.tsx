import Link from "next/link";

import type { EducationCenterProfile } from "@/lib/education-content";
import type { EducationTrainingCohort } from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationLocationPageProps = {
  locale: string;
  page: NarrativePage;
  centers: EducationCenterProfile[];
  cohorts: EducationTrainingCohort[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationLocationPage({
  locale,
  page,
  centers,
  cohorts,
}: EducationLocationPageProps) {
  const fallbackTitle = t(locale, "Où FE prend place", "Where FE takes place");
  const fallbackSubtitle = t(
    locale,
    "Feldenkrais Education n’est pas un lieu unique. Le site relie plusieurs centres, chacun avec son rythme, son atmosphère et sa cohorte.",
    "Feldenkrais Education is not a single place. The site connects several centers, each with its own rhythm, atmosphere, and cohort.",
  );
  const fallbackHeroBody = t(
    locale,
    "Pour choisir un centre, il faut regarder plus que la géographie. Il faut regarder le rythme d’étude, l’atmosphère, la cohorte en cours, et la manière dont vous voulez entrer dans le parcours.",
    "To choose a center, you need to look at more than geography. You need to look at study rhythm, atmosphere, the cohort in progress, and how you want to enter the pathway.",
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
      label: t(locale, "Voir les formations", "View trainings"),
      url: localizePath(locale, "/trainings"),
    },
  };

  const choiceGuides = [
    {
      title: t(locale, "Immersion", "Immersion"),
      body: t(
        locale,
        "Si vous cherchez un séjour d’étude profond, un rythme plus retiré et du temps pour intégrer, regardez d’abord le Cantal.",
        "If you are looking for a deep study retreat, a more secluded rhythm, and time to integrate, start with Cantal.",
      ),
    },
    {
      title: t(locale, "Ville et réseau", "City and network"),
      body: t(
        locale,
        "Si vous cherchez une cohorte urbaine, internationale et reliée à un écosystème somatique plus large, Bruxelles est souvent le bon point d’entrée.",
        "If you are looking for an urban, international cohort connected to a wider somatic ecosystem, Brussels is often the right entry point.",
      ),
    },
    {
      title: t(locale, "Lignée et transmission", "Lineage and transmission"),
      body: t(
        locale,
        "Si vous êtes attiré·e par une continuité forte avec l’histoire de la méthode dans l’espace francophone, Paris donne un autre type d’ancrage.",
        "If you are drawn to a strong continuity with the history of the method in the French-speaking world, Paris offers another kind of anchor.",
      ),
    },
  ];

  return (
    <EducationContentPage className="education-location-page" eyebrow={t(locale, "Lieu", "Location")} page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "FE comme géographie", "FE as a geography")}</p>
          <h2>{t(locale, "Un site, plusieurs ancrages réels", "One site, several real anchors")}</h2>
          <p>
            {t(
              locale,
              "Le site FE présente une architecture partagée, mais les parcours se vivent dans des centres bien réels. C’est pourquoi le choix d’un lieu change aussi l’expérience du programme.",
              "The FE site presents a shared architecture, but the pathways are lived inside very real centers. That is why choosing a place also changes the experience of the program.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Cette page sert surtout à comprendre où les cohortes prennent place et comment les centres se différencient, plutôt qu’à vous renvoyer vers une seule adresse.",
              "This page mainly helps you understand where cohorts take place and how the centers differ, rather than sending you to one single address.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Repères FE", "FE markers")}</p>
          <h2>{t(locale, "Ce qui change selon le lieu", "What changes with the place")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Centre", "Center")}</dt>
              <dd>{centers.length} {t(locale, "lieux visibles", "visible places")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Cohortes", "Cohorts")}</dt>
              <dd>{cohorts.length} {t(locale, "points d’entrée actuels", "current entry points")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Question utile", "Useful question")}</dt>
              <dd>{t(locale, "Quel rythme d’étude vous convient ?", "What study rhythm fits you?")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir les formations", "View trainings")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/visit")}>
              {t(locale, "Préparer ma visite", "Plan my visit")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Centres partenaires", "Partner centers")}</h2>
          <Link className="text-link" href={localizePath(locale, "/centers")}>
            {t(locale, "Voir toutes les pages centre", "See all center pages")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--centers">
          {centers.map((center) => {
            const cohort = cohorts.find((item) => item.centerSlug === center.slug) ?? null;

            return (
              <article className="education-card home-center-card" key={center.slug}>
                <div
                  className="home-center-card__media"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.92)), url(${center.heroImageUrl})`,
                  }}
                />
                <div className="home-center-card__body">
                  <p className="home-center-card__location">{center.location}</p>
                  <p className="education-center-card__strap">{center.legacyTitle}</p>
                  <h3>{center.name}</h3>
                  <p>{center.summary}</p>
                  <p className="education-offer-card__meta">
                    <strong>{t(locale, "Adresse", "Address")}:</strong> {center.address}
                  </p>
                  {cohort ? (
                    <p className="education-offer-card__meta">
                      <strong>{t(locale, "Cohorte actuelle", "Current cohort")}:</strong> {cohort.name}
                    </p>
                  ) : null}
                  <div className="education-offer-card__actions">
                    <Link className="education-button" href={localizePath(locale, `/centers/${center.slug}`)}>
                      {t(locale, "Voir ce centre", "View this center")}
                    </Link>
                    {cohort ? (
                      <Link className="education-button education-button--secondary" href={localizePath(locale, `/trainings/${cohort.slug}`)}>
                        {t(locale, "Voir la cohorte", "View cohort")}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Comment choisir", "How to choose")}</h2>
          <Link className="text-link" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous demander conseil", "Ask for guidance")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {choiceGuides.map((item) => (
            <article className="education-card education-home-link-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Étape suivante", "Next step")}</p>
          <h2>{t(locale, "Vous hésitez encore entre plusieurs lieux ?", "Still hesitating between several places?")}</h2>
          <p>
            {t(
              locale,
              "Le plus simple est souvent de comparer une cohorte, une journée type, puis de nous écrire avec vos contraintes de rythme, de langue ou de financement.",
              "The simplest path is often to compare a cohort, a typical day, and then write to us with your rhythm, language, or financing constraints.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/day-in-training")}>
            {t(locale, "Voir une journée type", "See a typical day")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous contacter", "Contact us")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
