import Link from "next/link";

import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationTeamPageProps = {
  page: NarrativePage;
  teachers: EducationTeacherProfile[];
  locale: string;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationTeamPage({
  page,
  teachers,
  locale,
}: EducationTeamPageProps) {
  return (
    <EducationContentPage eyebrow={t(locale, "Équipe", "Team")} page={page}>
      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Les personnes qui rendent les parcours possibles", "The people who make the pathways possible")}</h2>
          <Link className="text-link" href={localizePath(locale, "/teachers")}>
            {t(locale, "Voir aussi les intervenants", "See the teachers too")}
          </Link>
        </div>
        <p className="home-section__intro">
          {t(
            locale,
            "Autour des formateur·rices, FE s’appuie sur une équipe qui organise, traduit, coordonne les centres et relie les cohortes à l’écosystème plus large.",
            "Alongside the trainers, FE relies on a team that organizes, translates, coordinates the centers, and connects the cohorts to the wider ecosystem.",
          )}
        </p>
        <EducationTeacherCardGrid locale={locale} teachers={teachers} />
      </section>

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Coordination", "Coordination")}</p>
          <h2>{t(locale, "Besoin de savoir à qui écrire ?", "Need to know who to contact?")}</h2>
          <p>
            {t(
              locale,
              "Si vous ne savez pas encore vers quel centre, quelle cohorte ou quelle personne vous tourner, commencez par le contact général: nous vous réorienterons.",
              "If you are not yet sure which center, cohort, or person to approach, start with the general contact and we will point you in the right direction.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/contact")}>
            {t(locale, "Nous contacter", "Contact us")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/platform")}>
            {t(locale, "Voir la plateforme", "View the platform")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
