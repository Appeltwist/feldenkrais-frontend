import Link from "next/link";

import { localizePath } from "@/lib/locale-path";
import type { EducationWorkshopCollectionItem } from "@/lib/education-workshops";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationWorkshopFeatureCard from "./EducationWorkshopFeatureCard";
import EducationWorkshopSlider from "./EducationWorkshopSlider";

type EducationWorkshopArchivePageProps = {
  locale: string;
  page: NarrativePage;
  upcomingWorkshops: EducationWorkshopCollectionItem[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationWorkshopArchivePage({
  locale,
  page,
  upcomingWorkshops,
}: EducationWorkshopArchivePageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    title: page.title || t(locale, "Tous les workshops", "All workshops"),
    subtitle:
      page.subtitle ||
      t(
        locale,
        "Retrouvez ici les workshops FE à venir et une sélection de formats Feldenkrais associés.",
        "Find the upcoming FE workshops here, along with a selection of related Feldenkrais formats.",
      ),
    hero: {
      title: page.hero.title || page.title || t(locale, "Tous les workshops", "All workshops"),
      body:
        page.hero.body ||
        page.subtitle ||
        t(
          locale,
          "Les introductions FE à la formation apparaissent ici avec une sélection de workshops Feldenkrais à venir, ainsi qu’un accès direct à la plateforme.",
          "The FE introductions to the training appear here alongside a curated set of upcoming Feldenkrais workshops, plus a direct path into the platform.",
        ),
      imageUrl: page.hero.imageUrl || null,
    },
    sections: [],
    primaryCta: page.primaryCta ?? null,
  };

  return (
    <EducationContentPage className="education-workshops-page" eyebrow="Workshops" hideHero page={resolvedPage}>
      <section className="home-section">
        <div className="link-row home-section-head">
          <div>
            <h2>{resolvedPage.title || t(locale, "Workshops à venir", "Upcoming workshops")}</h2>
            <p className="home-section__intro">
              {t(
                locale,
                "Découvrez les workshops de cette année, des formations spécialisées avancées aux workshops d’introduction qui donnent un aperçu des stratégies d’apprentissage neurosomatique uniques.",
                "Discover this year's workshops, from advanced domain-specific trainings to introductory workshops that give you a taste of the unique neurosomatic learning strategies.",
              )}
            </p>
          </div>
        </div>

        {upcomingWorkshops.length === 0 ? (
          <section className="education-listing">
            <p>{t(locale, "Aucun workshop à afficher pour le moment.", "No workshops to show right now.")}</p>
          </section>
        ) : (
          <EducationWorkshopSlider
            ariaLabel={t(locale, "Liste des workshops à venir", "List of upcoming workshops")}
          >
            {upcomingWorkshops.map((workshop) => (
              <EducationWorkshopFeatureCard locale={locale} key={workshop.id} workshop={workshop} />
            ))}
          </EducationWorkshopSlider>
        )}
      </section>

      <section className="home-section education-workshops-page__pathways">
        <div className="home-section-head">
          <div>
            <p className="home-section-kicker">
              {t(locale, "Ressources numériques", "Digital resources")}
            </p>
            <h2>{t(locale, "Deux parcours d’étude", "Two learning pathways")}</h2>
            <p className="home-section__intro">
              {t(
                locale,
                "Prolongez l’apprentissage en ligne avec un accès annuel à la bibliothèque de leçons, ou approfondissez un sujet précis grâce aux masterclasses à la demande.",
                "Continue the learning online with annual lesson-library access, or go deeper into one topic with on-demand masterclasses.",
              )}
            </p>
          </div>
        </div>

        <div className="neuro-platform-landing-options">
          <Link className="neuro-platform-landing-option" href={localizePath(locale, "/lesson-library-access")}>
            <img
              alt={t(locale, "Accès à la bibliothèque de leçons", "Lesson Library Access")}
              loading="lazy"
              src="/brands/feldenkrais-education/platform/group-23935.png"
            />
            <div className="neuro-platform-landing-option__overlay" />
            <div className="neuro-platform-landing-option__copy">
              <strong>{t(locale, "Accès à la bibliothèque de leçons", "Lesson Library Access")}</strong>
              <span>{t(locale, "Abonnement annuel", "Yearly membership")}</span>
            </div>
          </Link>

          <Link className="neuro-platform-landing-option" href={localizePath(locale, "/masterclasses")}>
            <img
              alt={t(locale, "Masterclasses à la demande", "On-demand masterclasses")}
              loading="lazy"
              src="/brands/feldenkrais-education/platform/group-23939.png"
            />
            <div className="neuro-platform-landing-option__overlay" />
            <div className="neuro-platform-landing-option__copy">
              <strong>{t(locale, "Masterclasses à la demande", "On-demand masterclasses")}</strong>
              <span>{t(locale, "Achat unique", "One-time purchase")}</span>
            </div>
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
