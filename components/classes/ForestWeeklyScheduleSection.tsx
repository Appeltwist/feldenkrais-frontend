import type { CSSProperties } from "react";

import Image from "next/image";

import { getPricingContent } from "@/lib/pricing-content";

type ForestWeeklyScheduleSectionProps = {
  locale: string;
  eyebrow?: string;
  heading?: string;
  subtitle?: string | null;
  className?: string;
  parallax?: boolean;
};

export default function ForestWeeklyScheduleSection({
  locale,
  eyebrow,
  heading,
  subtitle,
  className = "",
  parallax = false,
}: ForestWeeklyScheduleSectionProps) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const content = getPricingContent(locale);
  const resolvedHeading = heading ?? content.schedule.heading;
  const resolvedSubtitle = subtitle ?? content.schedule.subtitle ?? null;
  const classDetailsLabel = isFr ? "Plus de d\u00e9tails" : "More details";
  const classBookLabel = isFr ? "R\u00e9server le cours" : "Book class";
  const classTeacherPrefix = isFr ? "avec" : "w/";
  const scheduleScrollHint = isFr ? "<- Glissez pour voir tous les jours ->" : "<- Scroll to see all days ->";

  return (
    <section
      aria-label={resolvedHeading}
      className={`fp-detail-section fp-detail-section--schedule ${className}`.trim()}
      data-scroll-parallax-section={parallax ? true : undefined}
    >
      <div
        className="fp-detail-section__illustration"
        data-scroll-parallax-illus={parallax ? true : undefined}
      >
        <Image
          alt={content.features.columns[0]?.title || "Group classes"}
          className="fp-detail-section__illus-img"
          fill
          sizes="(max-width: 900px) 100vw, 40vw"
          src="/brands/forest-lighthouse/yoga-lines.png"
        />
      </div>
      <div
        className="fp-detail-section__content"
        data-scroll-parallax-content={parallax ? true : undefined}
      >
        {eyebrow ? <p className="fp-chapter__eyebrow">{eyebrow}</p> : null}
        {resolvedHeading ? <h2 className="fp-section__heading fp-section__heading--left">{resolvedHeading}</h2> : null}
        {resolvedSubtitle ? (
          <p className="fp-section__subtitle fp-section__subtitle--left">{resolvedSubtitle}</p>
        ) : null}

        <div className="fp-schedule-wrap">
          <div className="fp-schedule">
            {content.schedule.days.map((day) => (
              <div className="fp-schedule__day" key={day.day}>
                <h3 className="fp-schedule__day-name">{day.day}</h3>
                <div className="fp-schedule__entries">
                  {day.entries.map((entry, index) => (
                    <div
                      className="fp-class-card"
                      data-hover-lift="true"
                      key={`${day.day}-${entry.className}-${entry.time}-${index}`}
                      style={{ "--card-bg": entry.color || "rgba(0,55,56,0.55)" } as CSSProperties}
                    >
                      <div className="fp-class-card__meta">
                        <div className="fp-class-card__meta-left">
                          <span className="fp-class-card__time">{entry.time}</span>
                          <span className="fp-class-card__langs">
                            {entry.languages.map((language) => (
                              <span className="fp-class-card__lang" key={language}>
                                {language}
                              </span>
                            ))}
                          </span>
                          {entry.level ? <span className="fp-class-card__level">{entry.level}</span> : null}
                        </div>
                      </div>

                      <h4 className="fp-class-card__name">{entry.className}</h4>
                      <span className="fp-class-card__teacher">
                        {classTeacherPrefix} <strong>{entry.instructor}</strong>
                      </span>

                      <details className="fp-class-details">
                        <summary className="fp-class-summary">
                          <span className="fp-class-summary__label">{classDetailsLabel}</span>
                          <span aria-hidden="true" className="fp-class-plus" />
                        </summary>
                        <div className="fp-class-desc">
                          <p className="fp-class-desc__text">{entry.description}</p>
                          {entry.bookingUrl ? (
                            <a
                              className="fp-class-desc__book"
                              href={entry.bookingUrl}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {classBookLabel}
                            </a>
                          ) : null}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p aria-hidden="true" className="fp-schedule__hint">{scheduleScrollHint}</p>
        </div>
      </div>
    </section>
  );
}
