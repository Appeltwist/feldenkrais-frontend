import Image from "next/image";

import { getEducationDayInTrainingContent } from "@/lib/education-day-in-training";
import type { NarrativePage } from "@/lib/site-config";

import EducationCenterActionModalButton from "./EducationCenterActionModalButton";
import EducationContentPage from "./EducationContentPage";
import EducationVideoPreview from "./EducationVideoPreview";

type EducationDayInTrainingPageProps = {
  locale: string;
  page: NarrativePage;
};

function SectionHeading({
  title,
  subtitle,
  inverted = false,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  inverted?: boolean;
  align?: "left" | "center";
}) {
  return (
    <header
      className={[
        "education-day-heading",
        inverted ? "education-day-heading--inverted" : "",
        align === "center" ? "education-day-heading--center" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
      <span className="education-day-heading__rule" />
    </header>
  );
}

function ActionRow({
  locale,
  signUpLabel,
  meetingLabel,
}: {
  locale: string;
  signUpLabel: string;
  meetingLabel: string;
}) {
  return (
    <div className="education-day-actions">
      <EducationCenterActionModalButton
        className="education-day-button education-day-button--light"
        label={signUpLabel}
        locale={locale}
        variant="signup"
      />
      <EducationCenterActionModalButton
        className="education-button education-day-button education-day-button--outline"
        label={meetingLabel}
        locale={locale}
        secondary
        variant="book-call"
      />
    </div>
  );
}

export default function EducationDayInTrainingPage({ locale, page }: EducationDayInTrainingPageProps) {
  const content = getEducationDayInTrainingContent(locale);
  const resolvedPage: NarrativePage = {
    ...page,
    title: page.title || content.hero.title,
    subtitle: content.hero.subtitle,
    hero: {
      ...page.hero,
      title: page.hero.title || page.title || content.hero.title,
      body: content.hero.subtitle,
      imageUrl: page.hero.imageUrl || content.hero.backgroundImageUrl,
    },
    sections: [],
    primaryCta: {
      label: content.actions.signUpLabel,
      url: content.actions.signUpUrl,
    },
  };
  const heroTitle = resolvedPage.hero.title || resolvedPage.title || content.hero.title;
  const heroBody = resolvedPage.hero.body || content.hero.subtitle;
  const signUpLabel = content.actions.signUpLabel;

  return (
    <EducationContentPage
      className="education-day-in-training-page"
      eyebrow={locale.toLowerCase().startsWith("fr") ? "Formation" : "Training"}
      hideHero
      page={resolvedPage}
    >
      <section
        className="education-day-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 18, 24, 0.26), rgba(15, 18, 24, 0.62)), url(${resolvedPage.hero.imageUrl || content.hero.backgroundImageUrl})`,
        }}
      >
        <div className="education-day-hero__inner">
          <h1>{heroTitle}</h1>
          <p>{heroBody}</p>
          <ActionRow
            locale={locale}
            meetingLabel={content.actions.meetingLabel}
            signUpLabel={signUpLabel}
          />
        </div>
      </section>

      <section className="education-day-section education-day-section--light">
        <div className="education-day-split">
          {content.dayOff.video ? (
            <EducationVideoPreview
              className="education-day-video-card"
              playLabel={locale.toLowerCase().startsWith("fr") ? "Lire la vidéo" : "Play video"}
              posterUrl={content.dayOff.video.posterUrl}
              title={content.dayOff.video.title}
              videoId={content.dayOff.video.videoId}
            />
          ) : null}

          <div className="education-day-copy">
            <SectionHeading subtitle={content.dayOff.subtitle} title={content.dayOff.title} />
            {content.dayOff.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="education-day-section education-day-section--dark">
        <div className="education-day-intro">
          <SectionHeading inverted title={content.intro.title} />
          <div className="education-day-copy">
            {content.intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="education-day-split education-day-split--intro">
          <div className="education-day-copy">
            <SectionHeading inverted subtitle={content.intro.morning.subtitle} title={content.intro.morning.title} />
            {content.intro.morning.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {content.intro.morning.video ? (
            <EducationVideoPreview
              className="education-day-video-card"
              playLabel={locale.toLowerCase().startsWith("fr") ? "Lire la vidéo" : "Play video"}
              posterUrl={content.intro.morning.video.posterUrl}
              title={content.intro.morning.video.title}
              videoId={content.intro.morning.video.videoId}
            />
          ) : null}
        </div>
      </section>

      <section className="education-day-section education-day-section--light">
        <div className="education-day-group">
          <article className="education-day-audio-card">
            <div className="education-day-audio-card__portrait">
              <Image
                alt={content.groupLessons.audioCard.title}
                height={128}
                src={content.groupLessons.audioCard.imageUrl}
                width={128}
              />
            </div>
            <h3>{content.groupLessons.audioCard.title}</h3>
            <p className="education-day-audio-card__meta">{content.groupLessons.audioCard.meta}</p>
            <audio controls preload="none" src={content.groupLessons.audioCard.audioUrl} />
            <p className="education-day-audio-card__note">{content.groupLessons.audioCard.note}</p>
          </article>

          <article className="education-day-group__copy">
            <SectionHeading subtitle={content.groupLessons.subtitle} title={content.groupLessons.title} />
            {content.groupLessons.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <p className="education-day-group__note">{content.groupLessons.secondaryParagraph}</p>

          {content.groupLessons.video ? (
            <EducationVideoPreview
              className="education-day-video-card"
              playLabel={locale.toLowerCase().startsWith("fr") ? "Lire la vidéo" : "Play video"}
              posterUrl={content.groupLessons.video.posterUrl}
              title={content.groupLessons.video.title}
              videoId={content.groupLessons.video.videoId}
            />
          ) : null}
        </div>
      </section>

      <section className="education-day-section education-day-section--dark">
        <div className="education-day-split education-day-split--fi">
          <div className="education-day-copy">
            <SectionHeading inverted subtitle={content.functionalIntegration.subtitle} title={content.functionalIntegration.title} />
            {content.functionalIntegration.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <blockquote className="education-day-quote">{content.functionalIntegration.quote}</blockquote>
          </div>

          <div className="education-day-stack">
            {content.functionalIntegration.videos.map((video) => (
              <EducationVideoPreview
                className="education-day-video-card education-day-video-card--stacked"
                key={video.videoId}
                playLabel={locale.toLowerCase().startsWith("fr") ? "Lire la vidéo" : "Play video"}
                posterPosition={video.posterPosition}
                posterUrl={video.posterUrl}
                title={video.title}
                videoId={video.videoId}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="education-day-section education-day-section--light">
        <div className="education-day-split">
          {content.lunch.video ? (
            <EducationVideoPreview
              className="education-day-video-card"
              playLabel={locale.toLowerCase().startsWith("fr") ? "Lire la vidéo" : "Play video"}
              posterUrl={content.lunch.video.posterUrl}
              title={content.lunch.video.title}
              videoId={content.lunch.video.videoId}
            />
          ) : null}

          <div className="education-day-copy">
            <SectionHeading subtitle={content.lunch.subtitle} title={content.lunch.title} />
            {content.lunch.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="education-day-section education-day-section--dark">
        <SectionHeading
          align="center"
          inverted
          title={content.testimonials.title}
        />
        <EducationVideoPreview
          className="education-day-video-card education-day-video-card--wide"
          playLabel={locale.toLowerCase().startsWith("fr") ? "Lire la vidéo" : "Play video"}
          posterUrl={content.testimonials.video.posterUrl}
          title={content.testimonials.video.title}
          videoId={content.testimonials.video.videoId}
        />
      </section>
    </EducationContentPage>
  );
}
