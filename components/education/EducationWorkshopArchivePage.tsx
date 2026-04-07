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
  platformPage?: NarrativePage | null;
  upcomingWorkshops: EducationWorkshopCollectionItem[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationWorkshopArchivePage({
  locale,
  page,
  platformPage,
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
              {resolvedPage.hero.body ||
                t(
                  locale,
                  "Les introductions FE à la formation apparaissent ici avec trois workshops Feldenkrais proposés par Forest Lighthouse.",
                  "The FE introductions to the training appear here alongside three Feldenkrais-related workshops offered by Forest Lighthouse.",
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

      <section className="education-promo-row education-promo-row--platform education-workshops-page__platform">
        <div className="education-promo-row__copy education-promo-row__copy--dark">
          <h2>
            <span>{platformPage?.hero.title || platformPage?.title || t(locale, "Masterclasses en ligne", "Online Masterclasses")}</span>
          </h2>
          <div className="education-promo-row__rule" />
          <p>
            {platformPage?.hero.body ||
              platformPage?.subtitle ||
              t(
                locale,
                "Découvrez nos ressources en ligne: workshops publics, masterclasses et contenus d’approfondissement pour prolonger l’apprentissage.",
                "Check out our online resources: public workshops, masterclasses, and deeper study material to continue the learning.",
              )}
          </p>
          <div className="education-promo-row__actions">
            <Link
              className="education-button"
              href={
                platformPage?.primaryCta?.url?.startsWith("/")
                  ? localizePath(locale, platformPage.primaryCta.url)
                  : platformPage?.primaryCta?.url || localizePath(locale, "/platform")
              }
            >
              {platformPage?.primaryCta?.label || t(locale, "En savoir plus", "Learn more")}
            </Link>
          </div>
        </div>

        <div className="education-promo-row__visual">
          <img
            alt={platformPage?.hero.title || t(locale, "Aperçu des masterclasses en ligne", "Preview of online masterclasses")}
            height={653}
            loading="lazy"
            src={platformPage?.hero.imageUrl || "/brands/feldenkrais-education/workshops/group-23942.png"}
            width={1154}
          />
        </div>
      </section>
    </EducationContentPage>
  );
}
