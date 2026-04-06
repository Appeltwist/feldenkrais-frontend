import type {
  EducationVideoItem,
  EducationVideoSection,
  EducationVideosData,
} from "@/lib/education-videos";
import type { NarrativePage } from "@/lib/site-config";

import EducationContentPage from "./EducationContentPage";
import EducationPlatformPromoRow from "./EducationPlatformPromoRow";
import EducationVideoCarousel from "./EducationVideoCarousel";

type EducationVideosPageProps = {
  data: EducationVideosData;
  locale: string;
  page: NarrativePage;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function findSection(
  sections: EducationVideoSection[],
  patterns: RegExp[],
  fallbackIndex: number,
) {
  return (
    sections.find((section) => patterns.some((pattern) => pattern.test(section.title))) ??
    sections[fallbackIndex] ??
    null
  );
}

function uniqueByVideo(items: EducationVideoItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.videoId)) {
      return false;
    }

    seen.add(item.videoId);
    return true;
  });
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

  const conferencesSection = findSection(data.sections, [/conference/i, /conférence/i], 2);
  const testimonialsSection = findSection(
    data.sections,
    [/people say/i, /testimonial/i, /témoignage/i],
    1,
  );
  const trainingsSection = findSection(
    data.sections,
    [/training/i, /formation/i],
    0,
  );

  const highlightItems = uniqueByVideo(
    [
      ...(data.featuredVideo ? [data.featuredVideo] : []),
      ...(conferencesSection?.items ?? []),
      ...(trainingsSection?.items ?? []),
      ...(testimonialsSection?.items ?? []),
    ].filter(Boolean),
  ).slice(0, 7);

  const highlightHero = highlightItems[0] ?? data.featuredVideo ?? null;

  return (
    <EducationContentPage
      className="education-videos-page education-videos-page--reworked"
      eyebrow="Videos"
      hideHero
      page={resolvedPage}
    >
      <section
        className="education-videos-hero"
        style={
          resolvedPage.hero.imageUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(12, 19, 29, 0.56), rgba(14, 20, 30, 0.6)), url(${resolvedPage.hero.imageUrl})`,
              }
            : undefined
        }
      >
        <div className="education-videos-hero__inner">
          <h1>{resolvedPage.hero.title || resolvedPage.title}</h1>
          {resolvedPage.hero.body || resolvedPage.subtitle ? (
            <p>{resolvedPage.hero.body || resolvedPage.subtitle}</p>
          ) : null}
        </div>
      </section>

      {highlightHero ? (
        <section className="education-videos-section education-videos-section--highlight">
          <div className="education-videos-section__head">
            <h2>{data.featuredHeading}</h2>
          </div>
          <a
            className="education-videos-highlight"
            href={highlightHero.youtubeUrl}
            rel="noreferrer"
            target="_blank"
          >
            <div className="education-videos-highlight__poster">
              <img
                alt={highlightHero.title}
                className="education-videos-highlight__image"
                fetchPriority="high"
                loading="eager"
                src={highlightHero.thumbnailUrl}
              />
            </div>

            <span className="education-videos-highlight__play" aria-hidden="true">
              <span />
            </span>
          </a>
        </section>
      ) : null}

      {conferencesSection ? (
        <section className="education-videos-section">
          <div className="education-videos-section__head">
            <h2>{conferencesSection.title}</h2>
          </div>
          <EducationVideoCarousel
            className="education-video-carousel--wide"
            desktopSlides={2}
            items={conferencesSection.items}
            locale={locale}
            tabletSlides={1}
          />
        </section>
      ) : null}

      {testimonialsSection ? (
        <section className="education-videos-section">
          <div className="education-videos-section__head">
            <h2>{testimonialsSection.title}</h2>
          </div>
          <EducationVideoCarousel
            className="education-video-carousel--testimonials"
            desktopSlides={3}
            items={testimonialsSection.items}
            locale={locale}
            tabletSlides={2}
          />
        </section>
      ) : null}

      {trainingsSection ? (
        <section className="education-videos-section">
          <div className="education-videos-section__head">
            <h2>{trainingsSection.title}</h2>
          </div>
          <EducationVideoCarousel
            className="education-video-carousel--trainings"
            desktopSlides={2}
            items={trainingsSection.items}
            locale={locale}
            tabletSlides={1}
          />
        </section>
      ) : null}

      <EducationPlatformPromoRow
        className="education-videos-page__platform"
        content={{
          body: t(
            locale,
            "Si vous manquez une conférence en direct, vous pouvez retrouver la version complète sur la plateforme Feldenkrais. L’essai gratuit de 7 jours permet d’y entrer immédiatement.",
            "If you miss any live conferences, the full videos are available on the Feldenkrais platform. You can start with a 7-day free trial and watch them there.",
          ),
          buttonLabel: t(locale, "Commencer", "Start now"),
          href: "/platform",
          imageUrl: "/brands/feldenkrais-education/training/platform-devices.png",
          subtitle: t(locale, "sur la plateforme Feldenkrais", "on the Feldenkrais Platform"),
          title: t(locale, "Regardez les conférences complètes", "Watch the full conferences"),
        }}
        locale={locale}
      />

      <section className="education-videos-guide">
        <div className="education-videos-guide__intro">
          <p className="education-page__date-range">Alan Questel</p>
          <h2>{data.starterGuideTitle}</h2>
          {data.starterGuideSubtitle ? <p className="education-videos-guide__subtitle">{data.starterGuideSubtitle}</p> : null}
          <p>{data.starterGuideSummary}</p>
        </div>

        <div className="education-videos-guide__topics">
          {data.starterGuideTopics.map((topic) => (
            <article className="education-videos-guide-card" key={topic.title}>
              <div className="education-videos-guide-card__image-wrap">
                <img
                  alt={t(locale, "Alan Questel", "Alan Questel")}
                  className="education-videos-guide-card__image"
                  loading="lazy"
                  src="/brands/feldenkrais-education/day-in-training/alan.jpg"
                />
              </div>
              <div className="education-videos-guide-card__body">
                <p className="education-page__date-range">
                  {topic.questionCount} {t(locale, "questions", "questions")}
                </p>
                <h3>{topic.title}</h3>
                {topic.description ? <p>{topic.description}</p> : null}
                {topic.sampleQuestions.length > 0 ? (
                  <ul className="education-videos-guide-card__questions">
                    {topic.sampleQuestions.map((question) => (
                      <li key={`${topic.title}-${question}`}>{question}</li>
                    ))}
                  </ul>
                ) : null}
                {topic.playlistUrl ? (
                  <div className="education-videos-guide-card__actions">
                    <a
                      className="education-button education-button--secondary"
                      href={topic.playlistUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {t(locale, "Voir la playlist sur YouTube", "Watch playlist on YouTube")}
                    </a>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </EducationContentPage>
  );
}
