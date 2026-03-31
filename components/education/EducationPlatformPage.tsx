import Link from "next/link";

import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationPlatformPageProps = {
  page: NarrativePage;
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationPlatformPage({
  page,
  locale,
}: EducationPlatformPageProps) {
  return (
    <EducationContentPage eyebrow={t(locale, "Plateforme", "Platform")} page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Écosystème", "Ecosystem")}</p>
          <h2>{t(locale, "La partie en ligne du parcours vit sur Neurosomatic", "The online side of the pathway lives on Neurosomatic")}</h2>
          <p>
            {t(
              locale,
              "Pour FE, la plateforme n’est pas une page-pont à développer à l’intérieur du site public. Le bon geste est de vous orienter directement vers Neurosomatic, où l’écosystème numérique continuera de s’étoffer.",
              "For FE, the platform is not a bridge page to rebuild inside the public site. The right move is to orient you directly toward Neurosomatic, where the digital ecosystem will continue to grow.",
            )}
          </p>
        </article>

        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Lien externe", "External link")}</p>
          <h2>{t(locale, "Ce que vous y trouverez", "What you will find there")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Plateforme", "Platform")}</dt>
              <dd>Neurosomatic</dd>
            </div>
            <div>
              <dt>{t(locale, "Rôle actuel", "Current role")}</dt>
              <dd>{t(locale, "Accès à l’écosystème numérique", "Access to the digital ecosystem")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Phase", "Phase")}</dt>
              <dd>{t(locale, "Lien direct, sans page intermédiaire", "Direct link, without an intermediate page")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <a
              className="education-button"
              href="https://neurosomatic.com"
              rel="noreferrer"
              target="_blank"
            >
              {t(locale, "Ouvrir Neurosomatic", "Open Neurosomatic")}
            </a>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Revenir à la formation", "Back to training")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Depuis FE, où aller ensuite ?", "From FE, where to go next?")}</h2>
          <Link className="text-link" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous écrire", "Write to us")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--home-links">
          <article className="education-card education-home-link-card">
            <h3>{t(locale, "Explorer les cohortes", "Explore the cohorts")}</h3>
            <p>
              {t(
                locale,
                "Commencez par les pages de formation si vous cherchez la bonne cohorte ou le bon centre.",
                "Start with the training pages if you are looking for the right cohort or center.",
              )}
            </p>
            <Link className="education-text-link" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir la formation", "View the training")}
            </Link>
          </article>
          <article className="education-card education-home-link-card">
            <h3>{t(locale, "Voir les centres", "See the centers")}</h3>
            <p>
              {t(
                locale,
                "Bruxelles, Cantal et Paris restent les meilleurs points d’entrée pour sentir la couleur de chaque parcours.",
                "Brussels, Cantal, and Paris remain the best entry points to feel the character of each pathway.",
              )}
            </p>
            <Link className="education-text-link" href={localizePath(locale, "/centers")}>
              {t(locale, "Comparer les centres", "Compare the centers")}
            </Link>
          </article>
          <article className="education-card education-home-link-card">
            <h3>{t(locale, "Passer vers l’écosystème numérique", "Move into the digital ecosystem")}</h3>
            <p>
              {t(
                locale,
                "Quand vous êtes prêt·e à sortir du site FE public, Neurosomatic est le point de continuation naturel.",
                "When you are ready to leave the FE public site, Neurosomatic is the natural continuation point.",
              )}
            </p>
            <a className="education-text-link" href="https://neurosomatic.com" rel="noreferrer" target="_blank">
              {t(locale, "Aller sur neurosomatic.com", "Go to neurosomatic.com")}
            </a>
          </article>
        </div>
      </section>
    </EducationContentPage>
  );
}
