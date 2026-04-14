import Link from "next/link";

import EducationTeacherCardGrid from "@/components/education/EducationTeacherCardGrid";
import type { EducationTeacherProfile } from "@/lib/education-teachers";
import type { EducationAtelierIntroContent } from "@/lib/education-workshops";
import { localizePath } from "@/lib/locale-path";

import { EducationBetaReadOnlyButton } from "./EducationBetaReadOnly";
import EducationContentPage from "./EducationContentPage";

type EducationAtelierIntroPageProps = {
  locale: string;
  content: EducationAtelierIntroContent;
  teachers: EducationTeacherProfile[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationAtelierIntroPage({
  locale,
  content,
  teachers,
}: EducationAtelierIntroPageProps) {
  return (
    <EducationContentPage
      className="education-atelier-intro-page"
      eyebrow={t(locale, "Workshop", "Workshop")}
      page={content.page}
    >
      <section className="education-training-section--intro">
        <div className="education-training-video-frame">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            src={`https://www.youtube-nocookie.com/embed/${content.videoId}?rel=0`}
            title={content.page.title}
          />
        </div>

        <div className="education-atelier-intro__copy">
          <p className="home-section-kicker">{content.byline}</p>
          <p className="education-atelier-intro__lead">{content.lead}</p>
          {content.storyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <dl className="education-center-facts education-atelier-intro__facts">
            <div>
              <dt>{t(locale, "Durée", "Duration")}</dt>
              <dd>{t(locale, "4 jours", "4 days")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Dates", "Dates")}</dt>
              <dd>{content.sessions.map((session) => `${session.city}: ${session.dateLabel}`).join(" · ")}</dd>
            </div>
            <div>
              <dt>{t(locale, "Horaires", "Hours")}</dt>
              <dd>{content.sessions[0]?.hours}</dd>
            </div>
            <div>
              <dt>{t(locale, "Prix", "Price")}</dt>
              <dd>
                {content.sessions[0]?.price} ·{" "}
                {t(
                  locale,
                  "déduit du prix total si vous poursuivez la formation",
                  "deducted from the full price if you continue the training",
                )}
              </dd>
            </div>
          </dl>

          <div className="education-atelier-intro__actions">
            <EducationBetaReadOnlyButton label={t(locale, "S’inscrire", "Sign up")} locale={locale} />
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir la formation", "View the training")}
            </Link>
            <EducationBetaReadOnlyButton label={t(locale, "Réserver un appel", "Book a call")} locale={locale} secondary />
          </div>
        </div>
      </section>

      <section className="education-center-cta education-card">
        <p className="home-section-kicker">{t(locale, "Avec les formateurs", "With the trainers")}</p>
        <h2>{t(locale, "Pia Appelquist & Yvo Mentens", "Pia Appelquist & Yvo Mentens")}</h2>
        <p>{content.teacherIntro}</p>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Les intervenants", "Meet the teachers")}</h2>
          <Link className="text-link" href={localizePath(locale, "/teachers")}>
            {t(locale, "Voir l’équipe", "See the team")}
          </Link>
        </div>
        <EducationTeacherCardGrid locale={locale} teachers={teachers} />
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Pour qui et pourquoi", "Who it is for and why")}</h2>
        </div>

        <div className="education-card-grid education-card-grid--training-support">
          <article className="education-card education-home-link-card">
            <p className="home-section-kicker">{t(locale, "Public", "Audience")}</p>
            <h3>{t(locale, "À qui s’adresse ce stage ?", "Who is this workshop for?")}</h3>
            <ul className="education-atelier-intro__list">
              {content.audience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="education-card education-home-link-card">
            <p className="home-section-kicker">{t(locale, "Pourquoi", "Why participate")}</p>
            <h3>{t(locale, "Ce que vous venez explorer", "What you come to explore")}</h3>
            <ul className="education-atelier-intro__list">
              {content.reasons.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="education-card education-home-link-card">
            <p className="home-section-kicker">{t(locale, "Formation", "Training")}</p>
            <h3>{t(locale, "Un vrai aperçu du cursus", "A real glimpse into the pathway")}</h3>
            <p>{content.professionalTraining}</p>
          </article>
        </div>
      </section>

      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Continuez après le stage", "Continue after the workshop")}</p>
          <h2>{t(locale, "Deux mois d’accès à la plateforme", "Two months of platform access")}</h2>
          <p>{content.platformIntro}</p>
          <ul className="education-atelier-intro__list">
            {content.platformFeatures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/platform")}>
              {t(locale, "Voir la plateforme", "See the platform")}
            </Link>
          </div>
        </article>

        <aside
          aria-label={t(locale, "Aperçu de la plateforme FE", "Preview of the FE platform")}
          className="education-atelier-intro__platform-visual"
        />
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <div>
            <h2>{t(locale, "Choisissez votre date", "Choose your date")}</h2>
            <p className="home-section__intro">
              {t(
                locale,
                "Les deux sessions renvoient au même atelier d’introduction, avec deux lieux et deux dates distincts.",
                "Both sessions lead into the same introduction workshop, with two different dates and locations.",
              )}
            </p>
          </div>
        </div>

        <div className="education-card-grid education-card-grid--training-cohorts">
          {content.sessions.map((session) => (
            <article className="education-card education-home-link-card education-atelier-intro__session-card" key={session.city}>
              <p className="education-page__date-range">{session.city}</p>
              <h3>{session.dateLabel}</h3>
              <p>{session.location}</p>
              <p>
                <strong>{t(locale, "Horaires", "Hours")}:</strong> {session.hours}
              </p>
              <p>
                <strong>{t(locale, "Prix", "Price")}:</strong> {session.price}
              </p>
              <p className="education-training-intro__note">{session.note}</p>
              <div className="education-offer-card__actions">
                <EducationBetaReadOnlyButton label={t(locale, "S’inscrire", "Sign up")} locale={locale} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </EducationContentPage>
  );
}
