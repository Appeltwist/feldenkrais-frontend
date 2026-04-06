import Link from "next/link";

import type { ApiCenterDetail } from "@/lib/api";
import type { EducationCenterProfile } from "@/lib/education-content";
import { getEducationCenterPageContent } from "@/lib/education-center-page-content";
import { getEducationTeacherProfiles } from "@/lib/education-teachers";
import { getEducationTrainingCohortByCenter } from "@/lib/education-training";
import {
  extractLegacyDualButtonLinks,
  extractLegacyDualHeading,
  extractLegacyImageUrl,
  extractLegacyParagraphs,
  extractLegacyYouTubeId,
} from "@/lib/legacy-page-signals";

import EducationCenterContactForm from "./EducationCenterContactForm";
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

export default function EducationCenterDetailPage({
  center,
  cmsCenter,
  locale,
}: EducationCenterDetailPageProps) {
  const cohort = getEducationTrainingCohortByCenter(locale, center.slug);
  const content = getEducationCenterPageContent(locale, center, cohort);
  const cmsParagraphs = extractLegacyParagraphs(cmsCenter?.body, 5);
  const cmsHeroHeading = extractLegacyDualHeading(cmsCenter?.body);
  const cmsHeroButtons = extractLegacyDualButtonLinks(cmsCenter?.body);
  const cmsImageUrl = extractLegacyImageUrl(cmsCenter?.body);
  const cmsVideoId = extractLegacyYouTubeId(cmsCenter?.body);
  const cmsPrimaryAction = cmsHeroButtons[0] || null;
  const cmsSecondaryAction = cmsHeroButtons[1] || null;
  const teacherLookup = new Map(
    getEducationTeacherProfiles(locale).map((teacher) => [teacher.displayName, teacher]),
  );
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
          backgroundImage: `linear-gradient(180deg, rgba(15, 18, 24, 0.28), rgba(15, 18, 24, 0.56)), url(${cmsImageUrl || content.hero.backgroundImageUrl})`,
        }}
      >
        <div className="education-center-shell__hero-inner">
          <ScopeBadge>{content.labels.center}</ScopeBadge>
          <h1>{cmsHeroHeading?.title || content.hero.title}</h1>
          <p>{cmsHeroHeading?.subtitle || cmsCenter?.summary || content.hero.subtitle}</p>
          <div className="education-center-shell__hero-actions">
            {cohort || cmsPrimaryAction ? (
              <a
                className="education-button education-center-shell__primary-button"
                href={cmsPrimaryAction?.href || cohort?.admissionsUrl || "#"}
              >
                {cmsPrimaryAction?.label || content.hero.enrollLabel}
              </a>
            ) : null}
            <a
              className="education-button education-center-shell__secondary-button"
              href={cmsSecondaryAction?.href || content.hero.appointmentHref}
            >
              {cmsSecondaryAction?.label || content.hero.appointmentLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="education-center-shell education-center-shell--dark">
        <div className="education-center-section-grid education-center-section-grid--intro">
          <div className="education-center-section-copy">
            <ScopeBadge>{content.labels.center}</ScopeBadge>
            <SectionHeading subtitle={content.intro.subtitle} title={content.intro.title} />
            {(cmsParagraphs.length > 0 ? cmsParagraphs : content.intro.paragraphs).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <EducationVideoPreview
            className="education-center-video"
            playLabel={t(locale, "Lire la vidéo", "Play video")}
            posterPosition={content.intro.video.posterPosition}
            posterUrl={cmsImageUrl || content.intro.video.posterUrl}
            title={content.intro.video.title}
            videoId={cmsVideoId || content.intro.video.videoId}
          />
        </div>
      </section>

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
            <Link href={content.centerLife.classLink.href}>{content.centerLife.classLink.label}</Link>
            <Link href={content.centerLife.privateLink.href}>{content.centerLife.privateLink.label}</Link>
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
              {cohort ? (
                <>
                  <a className="education-button" href={cohort.admissionsUrl}>
                    {content.upcoming.enrollLabel}
                  </a>
                  <a className="education-button education-button--secondary" href={cohort.programPdfUrl}>
                    {content.upcoming.pdfLabel}
                  </a>
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

      <section className="education-center-shell education-center-shell--light">
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
              {cohort ? (
                <>
                  <a className="education-button education-button--secondary" href={cohort.programPdfUrl}>
                    {content.cohortDetails.pdfLabel}
                  </a>
                  <a className="education-button" href={cohort.admissionsUrl}>
                    {content.cohortDetails.enrollLabel}
                  </a>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="education-center-shell education-center-shell--light">
        <div className="education-center-contact-block">
          <div className="education-center-contact-block__intro">
            <ScopeBadge>{content.labels.center}</ScopeBadge>
            <SectionHeading subtitle={content.contact.subtitle} title={content.contact.title} />
            <p>{content.contact.intro}</p>
            <p className="education-center-contact-block__appointment">
              <strong>{content.contact.appointmentPrefix}</strong>{" "}
              <a href={cmsSecondaryAction?.href || content.contact.appointmentHref}>
                {cmsSecondaryAction?.label || content.contact.appointmentLabel}
              </a>
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
