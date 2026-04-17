import Link from "next/link";
import type { ReactNode } from "react";

import type { ApiCenterDetail } from "@/lib/api";
import { getEducationCenterActionOption } from "@/lib/education-center-actions";
import type { EducationCenterProfile } from "@/lib/education-content";
import { getEducationCenterPageContent } from "@/lib/education-center-page-content";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";
import { getEducationTrainingCohortByCenter } from "@/lib/education-training";
import {
  extractLegacyDualHeading,
  extractLegacyImageUrl,
  extractLegacyParagraphs,
  extractLegacyYouTubeId,
} from "@/lib/legacy-page-signals";
import { isExternalHref } from "@/lib/locale-path";

import EducationCenterContactForm from "./EducationCenterContactForm";
import EducationCenterActionModalButton from "./EducationCenterActionModalButton";
import EducationContentPage from "./EducationContentPage";
import EducationVideoPreview from "./EducationVideoPreview";

type EducationCenterDetailPageProps = {
  center: EducationCenterProfile;
  cmsCenter?: ApiCenterDetail | null;
  locale: string;
};

function ScopeBadge({
  children,
  variant = "center",
}: {
  children: string;
  variant?: "center" | "cohort";
}) {
  return <p className={`education-center-scope education-center-scope--${variant}`}>{children}</p>;
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="education-center-section-heading">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
      <span className="education-center-section-heading__rule" />
    </header>
  );
}

function DetailIcon({ kind }: { kind: "cohort" | "director" | "segments" | "pricing" }) {
  if (kind === "cohort") {
    return (
      <svg fill="none" viewBox="0 0 24 24">
        <path
          d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Zm4 2.7v3.5c0 1.2 2.4 2.8 5 2.8s5-1.6 5-2.8v-3.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (kind === "director") {
    return (
      <svg fill="none" viewBox="0 0 24 24">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c0-3.1 3.1-5.5 7-5.5s7 2.4 7 5.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (kind === "segments") {
    return (
      <svg fill="none" viewBox="0 0 24 24">
        <path
          d="M7 3v4M17 3v4M4 9h16M6 6h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path
        d="M15 6.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5S10.3 9 12 9s3 1.1 3 2.5S13.7 14 12 14s-3-1.1-3-2.5M12 4v16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function ActionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  if (isExternalHref(href)) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

function ProgressRing({
  label,
  progress,
  detail,
}: {
  label: string;
  progress: number;
  detail: string;
}) {
  const boundedProgress = Math.max(0, Math.min(100, progress));

  return (
    <article className="education-center-progress-card">
      <div
        aria-hidden="true"
        className="education-center-progress-card__ring"
        style={{ ["--progress" as string]: `${boundedProgress}` }}
      >
        <span>{`${boundedProgress}%`}</span>
      </div>
      <h3>{label}</h3>
      <p>{detail}</p>
    </article>
  );
}

export default function EducationCenterDetailPage({
  center,
  cmsCenter,
  locale,
}: EducationCenterDetailPageProps) {
  const cohort = getEducationTrainingCohortByCenter(locale, center.slug);
  const content = getEducationCenterPageContent(locale, center, cohort);
  const centerAction = getEducationCenterActionOption(locale, center.slug as "cantal" | "brussels" | "paris");
  const cmsParagraphs = extractLegacyParagraphs(cmsCenter?.body, 5);
  const cmsHeroHeading = extractLegacyDualHeading(cmsCenter?.body);
  const cmsImageUrl = extractLegacyImageUrl(cmsCenter?.body);
  const cmsVideoId = extractLegacyYouTubeId(cmsCenter?.body);
  const teacherLookup = new Map(
    getEducationTeacherProfiles(locale).map((teacher) => [teacher.displayName, teacher]),
  );
  const introParagraphs =
    center.slug === "cantal"
      ? content.intro.paragraphs
      : cmsParagraphs.length > 0
        ? cmsParagraphs
        : content.intro.paragraphs;
  const featuredTeachers = center.teachers
    .map((teacher) => {
      const profile = teacherLookup.get(teacher.name);
      return {
        name: teacher.name,
        body: profile?.shortBio || teacher.body,
        photoUrl: profile?.photoUrl || center.heroImageUrl,
      };
    })
    .slice(0, 2);
  const heroBackgroundImageUrl = cmsImageUrl || content.hero.backgroundImageUrl;
  const heroTitle = cmsHeroHeading?.title || content.hero.title;
  const heroSubtitle = cmsHeroHeading?.subtitle || cmsCenter?.summary || content.hero.subtitle;

  const cohortFacts = cohort
    ? [
        {
          key: "cohort" as const,
          label: cohort.name,
          value: cohort.periodLabel,
        },
        {
          key: "director" as const,
          label: cohort.director,
          value: t(locale, "Direction pédagogique", "Educational Director"),
        },
        {
          key: "segments" as const,
          label: t(locale, "Segments", "Segments"),
          value: cohort.segments,
        },
        {
          key: "pricing" as const,
          label: t(locale, "Tarif", "Pricing"),
          value: cohort.pricing,
        },
      ]
    : [];

  return (
    <EducationContentPage
      className="education-center-page education-center-page--reworked"
      eyebrow={t(locale, "Centre", "Center")}
      hideHero
      page={center.page}
    >
      <section
        className="education-center-shell education-center-shell--hero"
        style={{
          backgroundImage: `url(${heroBackgroundImageUrl})`,
        }}
      >
        {content.hero.backgroundVideoUrl ? (
          <div className="education-center-shell__hero-video" aria-hidden="true">
            <iframe
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              src={content.hero.backgroundVideoUrl}
              tabIndex={-1}
              title={`${content.hero.title} background video`}
            />
          </div>
        ) : null}
        <div className="education-center-shell__hero-overlay" aria-hidden="true" />
        <div className="education-center-shell__hero-inner">
          <ScopeBadge>{content.labels.center}</ScopeBadge>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
          <div className="education-center-shell__hero-actions">
            {centerAction?.signupHref ? (
              <EducationCenterActionModalButton
                centers={[center.slug as "cantal" | "brussels" | "paris"]}
                className="education-center-shell__primary-button"
                label={content.hero.enrollLabel}
                locale={locale}
                variant="signup"
              />
            ) : (
              <ActionLink className="education-button education-center-shell__primary-button" href={content.contact.appointmentHref}>
                {t(locale, "Nous contacter", "Contact us")}
              </ActionLink>
            )}
            {centerAction?.bookCallHref ? (
              <EducationCenterActionModalButton
                centers={[center.slug as "cantal" | "brussels" | "paris"]}
                className="education-button education-center-shell__secondary-button"
                label={content.hero.appointmentLabel}
                locale={locale}
                secondary
                variant="book-call"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="education-center-shell education-center-shell--dark">
        <div className="education-center-section-grid education-center-section-grid--intro">
          <div className="education-center-section-copy">
            <ScopeBadge>{content.labels.center}</ScopeBadge>
            <SectionHeading subtitle={content.intro.subtitle} title={content.intro.title} />
            {introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {content.intro.video.imageOnly ? (
            <div
              aria-label={content.intro.video.title}
              className="education-center-video education-center-static-media"
              role="img"
              style={{
                backgroundImage: `url(${content.intro.video.posterUrl})`,
                backgroundPosition: content.intro.video.posterPosition || "center",
              }}
            />
          ) : (
            <EducationVideoPreview
              className="education-center-video"
              playLabel={t(locale, "Lire la vidéo", "Play video")}
              posterPosition={content.intro.video.posterPosition}
              posterUrl={cmsImageUrl || content.intro.video.posterUrl}
              title={content.intro.video.title}
              videoId={cmsVideoId || content.intro.video.videoId}
            />
          )}
        </div>
      </section>

      {content.address?.value ? (
        <section className="education-center-shell education-center-shell--light">
          <div className="education-center-address-card">
            <span className="education-center-address-card__icon" aria-hidden="true">
              <svg fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 20s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="10" fill="currentColor" r="2.2" />
              </svg>
            </span>
            <div>
              <p>{content.address.title}</p>
              <strong>{content.address.value}</strong>
            </div>
          </div>
        </section>
      ) : null}

      <section className="education-center-shell education-center-shell--light">
        <div className="education-center-general-grid">
          <div
            className="education-center-general-grid__image"
            style={{ backgroundImage: `url(${content.centerLife.imageUrl})` }}
          />

          <div className="education-center-general-grid__teachers">
            <ScopeBadge>{content.labels.center}</ScopeBadge>
            <SectionHeading title={content.centerLife.title} />
            <div className="education-center-general-grid__teacher-list">
              {featuredTeachers.map((teacher) => (
                <article className="education-center-mini-teacher" key={teacher.name}>
                  <div
                    className="education-center-mini-teacher__portrait"
                    style={{ backgroundImage: `url(${teacher.photoUrl})` }}
                  />
                  <h3>{teacher.name}</h3>
                  <p>{teacher.body}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="education-center-general-grid__links">
            <ActionLink href={content.centerLife.classLink.href}>{content.centerLife.classLink.label}</ActionLink>
            <ActionLink href={content.centerLife.privateLink.href}>{content.centerLife.privateLink.label}</ActionLink>
          </aside>
        </div>
      </section>

      <section className="education-center-shell education-center-shell--cohort">
        <div className="education-center-upcoming-grid">
          <div className="education-center-upcoming-grid__copy">
            <ScopeBadge variant="cohort">{content.labels.cohort}</ScopeBadge>
            <SectionHeading subtitle={content.upcoming.subtitle} title={content.upcoming.title} />
            <h3>{cohort?.name || center.upcomingTraining.name}</h3>
            {content.upcoming.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {content.upcoming.note ? (
              <p className="education-center-upcoming-grid__note">{content.upcoming.note}</p>
            ) : null}
            <div className="education-center-upcoming-grid__actions">
              {cohort || center.slug === "paris" ? (
                <>
                  {centerAction?.signupHref ? (
                    <EducationCenterActionModalButton
                      centers={[center.slug as "cantal" | "brussels" | "paris"]}
                      label={content.upcoming.enrollLabel}
                      locale={locale}
                      variant="signup"
                    />
                  ) : (
                    <ActionLink className="education-button" href={content.contact.appointmentHref}>
                      {t(locale, "Nous contacter", "Contact us")}
                    </ActionLink>
                  )}
                  <EducationCenterActionModalButton
                    centers={[center.slug as "cantal" | "brussels" | "paris"]}
                    label={t(locale, "Télécharger le PDF", "Download the PDF")}
                    locale={locale}
                    secondary
                    variant="download-pdf"
                  />
                </>
              ) : null}
            </div>
          </div>

          <div className="education-center-upcoming-grid__gallery">
            {content.upcoming.gallery.map((item) => (
              <div
                className="education-center-upcoming-grid__tile"
                key={`${item.imageUrl}-${item.alt}`}
                style={{ backgroundImage: `url(${item.imageUrl})` }}
                title={item.alt}
              />
            ))}
          </div>
        </div>
      </section>

      {content.hideCohortDetailsSection ? null : (
        <section className="education-center-shell education-center-shell--light">
          {content.cohortProgress ? (
            <div className="education-center-progress-panel">
              <ScopeBadge variant="cohort">{content.labels.cohort}</ScopeBadge>
              <h2>{content.cohortProgress.title}</h2>
              <p className="education-center-progress-panel__note">{content.cohortProgress.note}</p>
              <div className="education-center-progress-panel__grid">
                {content.cohortProgress.items.map((item) => (
                  <ProgressRing
                    detail={item.detail}
                    key={item.label}
                    label={item.label}
                    progress={item.progress}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="education-center-cohort-card">
              <div
                className="education-center-cohort-card__preview"
                style={{ backgroundImage: `url(${content.cohortDetails.programPreviewUrl})` }}
              />

              <div className="education-center-cohort-card__facts">
                <ScopeBadge variant="cohort">{content.labels.cohort}</ScopeBadge>
                <h2>{content.cohortDetails.title}</h2>
                <div className="education-center-cohort-card__fact-list">
                  {cohortFacts.map((fact) => (
                    <div className="education-center-cohort-card__fact" key={`${fact.key}-${fact.label}`}>
                      <span className="education-center-cohort-card__icon" aria-hidden="true">
                        <DetailIcon kind={fact.key} />
                      </span>
                      <div>
                        <strong>{fact.label}</strong>
                        <span>{fact.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="education-center-cohort-card__actions">
                  {centerAction?.signupHref ? (
                    <>
                      <EducationCenterActionModalButton
                        centers={[center.slug as "cantal" | "brussels" | "paris"]}
                        label={t(locale, "Télécharger le PDF", "Download the PDF")}
                        locale={locale}
                        secondary
                        variant="download-pdf"
                      />
                      <EducationCenterActionModalButton
                        centers={[center.slug as "cantal" | "brussels" | "paris"]}
                        label={content.cohortDetails.enrollLabel}
                        locale={locale}
                        variant="signup"
                      />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="education-center-shell education-center-shell--light">
        <div className="education-center-contact-block">
          <div className="education-center-contact-block__intro">
            <ScopeBadge>{content.labels.center}</ScopeBadge>
            <SectionHeading subtitle={content.contact.subtitle} title={content.contact.title} />
            <p>{content.contact.intro}</p>
            <p className="education-center-contact-block__appointment">
              <strong>{content.contact.appointmentPrefix}</strong>{" "}
              <ActionLink href={content.contact.appointmentHref}>{content.contact.appointmentLabel}</ActionLink>
            </p>
          </div>
          <EducationCenterContactForm
            centerName={center.name}
            centerSlug={center.slug}
            locale={locale}
            submitLabel={content.contact.submitLabel}
          />
        </div>
      </section>

      {content.accessibility ? (
        <section className="education-center-shell education-center-shell--light">
          <div className="education-center-accessibility">
            <ScopeBadge>{content.labels.center}</ScopeBadge>
            <SectionHeading title={content.accessibility.title} />
            <div className="education-center-accessibility__body">
              {content.accessibility.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="education-center-accessibility__links">
                {content.accessibility.links.map((link) => (
                  <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </EducationContentPage>
  );
}
