import Link from "next/link";

import type { EducationVideosData } from "@/lib/education-videos";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";

type EducationVideosPageProps = {
  data: EducationVideosData;
  locale: string;
  page: NarrativePage;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

export default function EducationVideosPage({
  data,
  locale,
  page,
}: EducationVideosPageProps) {
  const resolvedPage: NarrativePage = {
    ...page,
    title: data.pageTitle || page.title,
    subtitle: data.pageSummary || page.subtitle,
    hero: {
      ...page.hero,
      title: data.pageTitle || page.hero.title || page.title,
      body: data.pageSummary || page.hero.body || page.subtitle,
      imageUrl: data.heroImageUrl || page.hero.imageUrl,
    },
    sections: [],
  };

  return (
    <EducationContentPage className="education-videos-page" eyebrow="Video" page={resolvedPage}>
      <section className="education-center-intro education-card">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{t(locale, "Bibliothèque FE", "FE video library")}</p>
          <h2>{t(locale, "Une archive vidéo remise en circulation", "A video archive brought back into circulation")}</h2>
          <p>{data.pageSummary}</p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Comme sur le site FE précédent, cette page mélange conférences, témoignages, présentation des formations et guide d’entrée dans l’univers Feldenkrais.",
              "As on the previous FE site, this page combines conferences, testimonials, training orientation, and a starter guide into the Feldenkrais world.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Archive FE", "FE archive")}</p>
          <h2>{t(locale, "Ce qui est visible", "What is visible")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Sections vidéo", "Video sections")}</dt>
              <dd>{data.sections.length}</dd>
            </div>
            <div>
              <dt>{t(locale, "Clips indexés", "Indexed clips")}</dt>
              <dd>{data.totalVideoCount}</dd>
            </div>
            <div>
              <dt>{t(locale, "Guide d’entrée", "Starter guide")}</dt>
              <dd>{data.starterGuideTopics.length}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href="#featured-video">
              {t(locale, "Voir la sélection", "See the selection")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/trainings")}>
              {t(locale, "Explorer les formations", "Explore trainings")}
            </Link>
          </div>
        </aside>
      </section>

      {data.featuredVideo ? (
        <section className="education-videos-featured education-card" id="featured-video">
          <div className="education-videos-featured__player">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              src={`https://www.youtube.com/embed/${data.featuredVideo.videoId}?rel=0`}
              title={data.featuredVideo.title}
            />
          </div>
          <div className="education-videos-featured__copy">
            <p className="home-section-kicker">{data.featuredHeading}</p>
            <h2>{data.featuredVideo.title}</h2>
            <p>
              {t(
                locale,
                "Nous gardons ici l’idée de la mise en avant du moment qui donnait du rythme à la vidéothèque FE historique.",
                "This keeps the old FE idea of a current highlight that gave rhythm to the video library.",
              )}
            </p>
            <div className="education-offer-card__actions">
              <a
                className="education-button"
                href={data.featuredVideo.youtubeUrl}
                rel="noreferrer"
                target="_blank"
              >
                {t(locale, "Voir sur YouTube", "Watch on YouTube")}
              </a>
              {data.sourceUrl ? (
                <a
                  className="education-button education-button--secondary"
                  href={data.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t(locale, "Voir la source d’origine", "See original source")}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {data.sections.map((section) => (
        <section className="home-section" key={section.title}>
          <div className="link-row home-section-head">
            <h2>{section.title}</h2>
            <Link className="text-link" href={localizePath(locale, "/trainings")}>
              {t(locale, "Voir les formations", "See trainings")}
            </Link>
          </div>
          <div className="education-card-grid education-card-grid--videos">
            {section.items.map((item) => (
              <article className="education-card education-video-card" key={`${section.title}-${item.videoId}`}>
                <a
                  aria-label={item.title}
                  className="education-video-card__media"
                  href={item.youtubeUrl}
                  rel="noreferrer"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.82)), url(${item.thumbnailUrl})`,
                  }}
                  target="_blank"
                >
                  <span className="education-video-card__play">
                    {t(locale, "Voir", "Watch")}
                  </span>
                </a>
                <div className="education-video-card__body">
                  <p className="education-page__date-range">{section.title}</p>
                  <h3>{item.title}</h3>
                  <div className="education-offer-card__actions">
                    <a className="education-button" href={item.youtubeUrl} rel="noreferrer" target="_blank">
                      {t(locale, "Lire la vidéo", "Play video")}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="education-center-intro education-card" id="starter-guide">
        <article className="education-center-intro__story">
          <p className="home-section-kicker">{data.starterGuideTitle}</p>
          <h2>{data.starterGuideSubtitle || t(locale, "Une porte d’entrée dans l’univers FE", "An entry point into the FE universe")}</h2>
          <p>{data.starterGuideSummary}</p>
          <p className="education-training-intro__note">
            {t(
              locale,
              "Le site historique FE terminait la vidéothèque par un guide structuré autour de la formation, de la méthode, de Moshe et de l’équipe. On garde cette logique ici.",
              "The historic FE site ended the library with a structured guide around the training, the method, Moshe, and the team. We keep that logic here.",
            )}
          </p>
        </article>
        <aside className="education-center-intro__facts">
          <p className="education-page__date-range">{t(locale, "Alan Questel", "Alan Questel")}</p>
          <h2>{t(locale, "Thèmes du guide", "Guide themes")}</h2>
          <dl className="education-center-facts">
            <div>
              <dt>{t(locale, "Chapitres", "Chapters")}</dt>
              <dd>{data.starterGuideTopics.length}</dd>
            </div>
            <div>
              <dt>{t(locale, "Questions visibles", "Visible questions")}</dt>
              <dd>{data.starterGuideTopics.reduce((count, item) => count + item.questionCount, 0)}</dd>
            </div>
            <div>
              <dt>{t(locale, "Orientation", "Orientation")}</dt>
              <dd>{t(locale, "Guide d’entrée FE", "FE starter guide")}</dd>
            </div>
          </dl>
          <div className="education-center-intro__actions">
            <Link className="education-button" href={localizePath(locale, "/teachers/alan-questel")}>
              {t(locale, "Voir Alan Questel", "View Alan Questel")}
            </Link>
            <Link className="education-button education-button--secondary" href={localizePath(locale, "/about")}>
              {t(locale, "À propos de FE", "About FE")}
            </Link>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <div className="link-row home-section-head">
          <h2>{t(locale, "Guide 20 Questions", "20 Questions guide")}</h2>
          <Link className="text-link" href={localizePath(locale, "/what-is-feldenkrais")}>
            {t(locale, "Approfondir la méthode", "Go deeper into the method")}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--videos-guide">
          {data.starterGuideTopics.map((topic) => (
            <article className="education-card education-video-guide-card" key={topic.title}>
              {topic.previewVideo ? (
                <div
                  className="education-video-guide-card__media"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.86)), url(${topic.previewVideo.thumbnailUrl})`,
                  }}
                />
              ) : null}
              <div className="education-video-guide-card__body">
                <p className="education-page__date-range">
                  {topic.questionCount} {t(locale, "questions", "questions")}
                </p>
                <h3>{topic.title}</h3>
                {topic.description ? <p>{topic.description}</p> : null}
                {topic.sampleQuestions.length > 0 ? (
                  <ul className="education-video-guide-card__questions">
                    {topic.sampleQuestions.map((question) => (
                      <li key={`${topic.title}-${question}`}>{question}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="education-offer-card__actions">
                  <Link className="education-button" href={topic.href}>
                    {t(locale, "Explorer ce thème", "Explore this topic")}
                  </Link>
                  {topic.previewVideo ? (
                    <a
                      className="education-button education-button--secondary"
                      href={topic.previewVideo.youtubeUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {t(locale, "Voir un extrait", "Watch an excerpt")}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="education-center-cta education-card">
        <h2>{t(locale, "Prolonger l’exploration", "Keep exploring")}</h2>
        <p>
          {t(
            locale,
            "Le site FE historique reliait les vidéos aux formations, à la méthode, à Moshe, à l’équipe et à la vie dans les centres. On garde cette circulation ici pour aider les visiteurs à avancer.",
            "The historic FE site tied videos back to trainings, the method, Moshe, the team, and life in the centers. We keep that circulation here to help visitors move forward.",
          )}
        </p>
        <div className="education-offer-card__actions">
          <Link className="education-button" href={localizePath(locale, "/day-in-training")}>
            {t(locale, "Voir une journée dans la formation", "See a day in training")}
          </Link>
          <a
            className="education-button education-button--secondary"
            href="https://vimeo.com/feldenkraiseducation"
            rel="noreferrer"
            target="_blank"
          >
            {t(locale, "Ouvrir Vimeo", "Open Vimeo")}
          </a>
        </div>
      </section>
    </EducationContentPage>
  );
}
