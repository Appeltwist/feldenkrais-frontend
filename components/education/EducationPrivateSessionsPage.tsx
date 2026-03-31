import Link from "next/link";

import type { EducationTeacherProfile } from "@/lib/education-teachers";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationTeacherCardGrid from "./EducationTeacherCardGrid";

type EducationPrivateSessionsPageProps = {
  locale: string;
  page: NarrativePage;
  featuredTeachers: EducationTeacherProfile[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationPrivateSessionsPage({
  locale,
  page,
  featuredTeachers,
}: EducationPrivateSessionsPageProps) {
  const situations = [
    {
      title: t(locale, "Besoin spécifique", "Specific need"),
      body: t(
        locale,
        "Douleur persistante, récupération, fatigue, voix, posture, reprise après blessure ou simple besoin d’un travail plus ciblé.",
        "Persistent pain, recovery, fatigue, voice, posture, return after injury, or simply the need for more targeted work.",
      ),
    },
    {
      title: t(locale, "Approche sur mesure", "Tailored approach"),
      body: t(
        locale,
        "La séance individuelle permet un rythme plus fin, une écoute manuelle et une progression ajustée à votre situation.",
        "A private session allows for a finer rhythm, hands-on listening, and progress adjusted to your situation.",
      ),
    },
    {
      title: t(locale, "Orientation vers la bonne personne", "Orientation toward the right person"),
      body: t(
        locale,
        "Le point important n’est pas seulement de réserver une séance, mais de trouver le bon praticien, la bonne langue, et le bon contexte.",
        "The important point is not only booking a session, but finding the right practitioner, language, and context.",
      ),
    },
  ];

  return (
    <EducationContentPage className="education-private-sessions-page" eyebrow={t(locale, "Accompagnement", "One-to-one work")} page={page}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Séance individuelle", "Private session")}</p>
          <h2>{t(locale, "Une orientation plus juste qu’un simple bouton de réservation", "Better orientation than a simple booking button")}</h2>
          <p>
            {t(
              locale,
              "Pour FE, les séances individuelles relèvent avant tout d’une mise en relation pertinente: trouver la bonne personne, dans le bon lieu, pour la bonne question.",
              "For FE, private sessions are above all about meaningful orientation: finding the right person, in the right place, for the right question.",
            )}
          </p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Nous gardons donc ici une page d’orientation vers les praticien·nes, les enseignant·es, et les centres où ce travail individuel peut réellement commencer.",
              "So we keep this page as an orientation point toward practitioners, teachers, and centers where this one-to-one work can genuinely begin.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Travail individuel", "One-to-one format")}</p>
          <h2>{t(locale, "Repères utiles", "Useful markers")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Format", "Format")}</dt>
              <dd>{t(locale, "Intégration Fonctionnelle / séance ciblée", "Functional Integration / targeted session")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Via", "Via")}</dt>
              <dd>{t(locale, "Praticien·nes, enseignant·es, centres", "Practitioners, teachers, centers")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Étape suivante", "Next step")}</dt>
              <dd>{t(locale, "Choisir la bonne personne", "Choose the right person")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/find-a-practitioner")}>
              {t(locale, "Trouver un praticien", "Find a practitioner")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/contact")}>
              {t(locale, "Être orienté·e", "Get oriented")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Quand une séance individuelle aide vraiment", "When a private session really helps")}</h2>
          <Link className="text-link" href={localizePath(locale, "/find-a-practitioner")}>
            {t(locale, "Commencer la recherche", "Start the search")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--training-support">
          {situations.map((item) => (
            <article className="education-card education-home-link-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {featuredTeachers.length > 0 ? (
        <section className="home-section">
          <div className="link-row home-section-head">
            <h2>{t(locale, "Quelques personnes à connaître", "A few people to know")}</h2>
            <Link className="text-link" href={localizePath(locale, "/teachers")}>
              {t(locale, "Voir les profils", "View profiles")}
            </Link>
          </div>
          <EducationTeacherCardGrid locale={locale} teachers={featuredTeachers} />
        </section>
      ) : null}

      <section className="education-center-cta education-card">
        <div>
          <p className="home-section-kicker">{t(locale, "Orientation", "Orientation")}</p>
          <h2>{t(locale, "Vous hésitez entre séance, cours ou atelier ?", "Unsure between a session, a class, or a workshop?")}</h2>
          <p>
            {t(
              locale,
              "Commencez par décrire votre situation. À partir de là, nous pouvons vous orienter vers le bon praticien, le bon centre, ou un autre format plus adapté.",
              "Start by describing your situation. From there, we can orient you toward the right practitioner, the right center, or another format that fits better.",
            )}
          </p>
        </div>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/find-a-practitioner")}>
            {t(locale, "Trouver un praticien", "Find a practitioner")}
          </Link>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/classes")}>
            {t(locale, "Voir les cours", "See classes")}
          </Link>
        </div>
      </section>
    </EducationContentPage>
  );
}
