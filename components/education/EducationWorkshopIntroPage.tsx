import Link from "next/link";

import type { EducationIntroWorkshopDetail } from "@/lib/education-workshops";
import { localizePath } from "@/lib/locale-path";

import { EducationBetaReadOnlyButton } from "./EducationBetaReadOnly";
import EducationContentPage from "./EducationContentPage";

type EducationWorkshopIntroPageProps = {
  locale: string;
  workshop: EducationIntroWorkshopDetail;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationWorkshopIntroPage({
  locale,
  workshop,
}: EducationWorkshopIntroPageProps) {
  return (
    <EducationContentPage
      className="education-workshop-intro-page"
      eyebrow={t(locale, "Workshop", "Workshop")}
      page={workshop.page}
    >
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{workshop.monthLabel}</p>
          <h2>{t(locale, "À quoi sert cette rencontre ?", "What is this session for?")}</h2>
          <p>{workshop.story}</p>
        </article>

        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Repères", "At a glance")}</p>
          <h2>{t(locale, "Détails de la session", "Session details")}</h2>
          <dl className="education-center-facts">
            {workshop.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir la formation", "Explore the training")}
            </Link>
            <EducationBetaReadOnlyButton label={t(locale, "Réserver un appel", "Book a call")} locale={locale} secondary />
          </div>
        </aside>
      </section>

      <section className="education-center-cta education-card">
        <p className="home-section-kicker">{t(locale, "Ce que vous allez clarifier", "What you will clarify")}</p>
        <h2>{t(locale, "Points abordés pendant l'introduction", "Topics covered during the introduction")}</h2>
        <ul className="education-workshop-intro-page__list">
          {workshop.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>
    </EducationContentPage>
  );
}
