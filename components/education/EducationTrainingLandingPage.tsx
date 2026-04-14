import Image from "next/image";
import Link from "next/link";

import { cleanDisplayText } from "@/lib/content-cleanup";
import type { ApiTrainingCohortSummary, ApiTrainingProgramDetail } from "@/lib/api";
import { getEducationCenters } from "@/lib/education-content";
import {
  getEducationTrainingCohorts,
  getEducationTrainingCurriculum,
  getEducationTrainingIncludedItems,
  getEducationTrainingProgramStats,
} from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";
import { asRecord, pickString } from "@/lib/offers";
import type { NarrativePage } from "@/lib/site-config";
import type { SectionBlock } from "@/lib/types";

import { EducationBetaReadOnlyButton } from "./EducationBetaReadOnly";
import EducationScrollSequence from "./EducationScrollSequence";
import EducationTrainingActionBar from "./EducationTrainingActionBar";
import EducationTrainingYearSlider from "./EducationTrainingYearSlider";

type EducationTrainingLandingPageProps = {
  cmsCohorts?: ApiTrainingCohortSummary[];
  page: NarrativePage;
  locale: string;
  program?: ApiTrainingProgramDetail | null;
};

const HERO_IMAGE_URL = "/brands/feldenkrais-education/training/hero-room.jpeg";
const TRAINING_PLATFORM_IMAGE_URL = "/brands/feldenkrais-education/training/platform-devices.png";
const TRAINING_EUROTAB_LOGO_URL = "/brands/feldenkrais-education/training/eurotab.png";
const TRAINING_IFF_LOGO_URL = "/brands/feldenkrais-education/training/iff.png";
const TRAINING_CERTIFICATION_IMAGE_URL = "/brands/feldenkrais-education/training/year-4.jpeg";
const TRAINING_YEAR_IMAGE_URLS = [
  "/brands/feldenkrais-education/training/year-1.jpeg",
  "/brands/feldenkrais-education/training/year-2.jpg",
  "/brands/feldenkrais-education/training/year-3.jpg",
  "/brands/feldenkrais-education/training/year-4.jpeg",
];

function buildSequenceFrameUrls(sequenceName: "hands" | "step" | "walk", frameCount: number) {
  return Array.from({ length: frameCount }, (_, index) => (
    `/brands/feldenkrais-education/training/sequences/${sequenceName}/frame-${String(index + 1).padStart(2, "0")}.png`
  ));
}

const TRAINING_STEP_FRAME_URLS = buildSequenceFrameUrls("step", 36);
const TRAINING_HANDS_FRAME_URLS = buildSequenceFrameUrls("hands", 27);
const TRAINING_WALK_FRAME_URLS = buildSequenceFrameUrls("walk", 29);

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function stripHtmlToText(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return cleanDisplayText(value.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " "));
}

function normalizeHeading(value: string | null | undefined) {
  return stripHtmlToText(value).toLowerCase();
}

function matchesHeading(heading: string | null | undefined, expected: string[]) {
  const normalized = normalizeHeading(heading);
  return expected.some((candidate) => normalized === candidate || normalized.includes(candidate));
}

function findSection(
  blocks: SectionBlock[] | null | undefined,
  type: string,
  headings: string[],
) {
  return (blocks || []).find((block) => {
    if (!block || typeof block !== "object" || block.type !== type) {
      return false;
    }

    const value = asRecord(block.value);
    return matchesHeading(pickString(value, ["heading", "title"]), headings);
  });
}

function getSectionHeading(block: SectionBlock | undefined, fallback: string) {
  const value = asRecord(block?.value);
  return pickString(value, ["heading", "title"]) || fallback;
}

function getRichSectionBody(block: SectionBlock | undefined, fallback: string) {
  const value = asRecord(block?.value);
  return stripHtmlToText(pickString(value, ["body", "description"])) || fallback;
}

function getFeatureItems(
  block: SectionBlock | undefined,
  fallback: Array<{ title: string; body: string }>,
) {
  const value = asRecord(block?.value);
  const rawItems = Array.isArray(value?.items) ? value.items : [];
  const items = rawItems
    .map((item) => {
      const record = asRecord(item);
      const title = pickString(record, ["title", "heading"]);
      const body = stripHtmlToText(pickString(record, ["body", "description"]));
      if (!title || !body) {
        return null;
      }

      return { title, body };
    })
    .filter((item): item is { title: string; body: string } => item !== null);

  return items.length > 0 ? items : fallback;
}

function getJourneySteps(
  block: SectionBlock | undefined,
  fallback: Array<{ title: string; label: string }>,
) {
  const value = asRecord(block?.value);
  const rawItems = Array.isArray(value?.items) ? value.items : [];
  const items = rawItems
    .map((item) => {
      const record = asRecord(item);
      const title = pickString(record, ["title", "heading"]);
      const label = stripHtmlToText(pickString(record, ["description", "body"]));
      if (!title || !label) {
        return null;
      }

      return { title, label };
    })
    .filter((item): item is { title: string; label: string } => item !== null);

  return items.length > 0 ? items : fallback;
}

function SectionHeading({
  align = "center",
  subtitle,
  title,
}: {
  align?: "center" | "left";
  subtitle?: string;
  title: string;
}) {
  return (
    <div className={`education-training-section-heading education-training-section-heading--${align}`}>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
      <span className="education-training-section-heading__rule" />
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M2.5 8.7 12 4l9.5 4.7L12 13.4 2.5 8.7Z" fill="currentColor" />
      <path d="M6.5 10.6v4.2c0 1.2 2.5 3.2 5.5 3.2s5.5-2 5.5-3.2v-4.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="7.2" fill="currentColor" r="3.2" />
      <path d="M5.5 20c.4-3.5 2.8-5.6 6.5-5.6s6.1 2.1 6.5 5.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect height="14" rx="2" stroke="currentColor" strokeWidth="1.8" width="16" x="4" y="6" />
      <path d="M8 3.5v5M16 3.5v5M4 10.5h16" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EuroIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M16.8 6.5A6.7 6.7 0 0 0 12.1 5c-3.2 0-5.8 2-6.7 4.9M4.1 10.6h8.8M4.1 13.6h8.1M16.8 17.5A6.7 6.7 0 0 1 12.1 19c-3 0-5.6-1.9-6.6-4.7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TrainingFactIcon({ kind }: { kind: "director" | "period" | "pricing" | "title" }) {
  if (kind === "director") {
    return <PersonIcon />;
  }

  if (kind === "period") {
    return <CalendarIcon />;
  }

  if (kind === "pricing") {
    return <EuroIcon />;
  }

  return <GraduationCapIcon />;
}

export default function EducationTrainingLandingPage({
  cmsCohorts = [],
  page,
  locale,
  program,
}: EducationTrainingLandingPageProps) {
  const centers = getEducationCenters(locale);
  const localCohorts = getEducationTrainingCohorts(locale);
  const cmsCohortBySlug = new Map(cmsCohorts.map((cohort) => [cohort.slug, cohort]));
  const cmsCohortByCenter = new Map(
    cmsCohorts
      .filter((cohort) => cohort.center?.slug)
      .map((cohort) => [cohort.center?.slug || "", cohort]),
  );
  const cohorts = localCohorts.map((cohort) => {
    const cmsCohort = cmsCohortBySlug.get(cohort.slug) || cmsCohortByCenter.get(cohort.centerSlug);
    return {
      ...cohort,
      admissionsUrl: cmsCohort?.applicationUrl || cohort.admissionsUrl,
      director: cmsCohort?.facilitators[0]?.displayName || cohort.director,
      name: cmsCohort?.title || cohort.name,
      periodLabel: cmsCohort?.subtitle || cohort.periodLabel,
      pricing: cmsCohort?.pricingSummary || cohort.pricing,
      programPdfUrl: cmsCohort?.brochureUrl || cohort.programPdfUrl,
    };
  });
  const curriculum = getEducationTrainingCurriculum(locale);
  const defaultIncludedItems = getEducationTrainingIncludedItems(locale);
  const programStats = getEducationTrainingProgramStats(locale);
  const overviewSection = findSection(program?.sections, "rich_section", ["overview", "aperçu", "apercu"]);
  const includedSection = findSection(program?.sections, "feature_stack", ["what else is included", "ce qui est inclus"]);
  const betweenSection = findSection(program?.sections, "feature_stack", ["between segments", "entre les segments"]);
  const enrollmentSection = findSection(program?.sections, "journey_steps", ["enrollment process", "processus d inscription", "processus d'inscription"]);
  const includedItems = getFeatureItems(includedSection, defaultIncludedItems);
  const betweenSegmentsItems = getFeatureItems(betweenSection, defaultIncludedItems.slice(3, 7));
  const includedLearningItems = includedItems.slice(0, 3);
  const cohortByCenter = new Map(cohorts.map((cohort) => [cohort.centerSlug, cohort]));
  const actionCohorts = cohorts.map((cohort) => ({
    slug: cohort.slug,
    label: cohort.name,
    signupHref: cohort.admissionsUrl,
    pdfHref: cohort.programPdfUrl,
  }));
  const curriculumSlides = curriculum.map((year, index) => ({
    imageUrl: TRAINING_YEAR_IMAGE_URLS[index] || TRAINING_YEAR_IMAGE_URLS[0],
    steps: year.steps,
    subtitle: year.subtitle,
    title: `${year.title} - ${year.subtitle}`,
  }));
  const certificationStats = [
    {
      label: t(locale, "Stagiaires depuis 2016", "Trainees since 2016"),
      value: "148",
    },
    {
      label: t(locale, "Praticiens certifiés depuis 2016", "Practitioners certified since 2016"),
      value: "123",
    },
    {
      label: t(locale, "Satisfaction en 2024", "Satisfaction in 2024"),
      value: "100%",
    },
  ];
  const defaultEnrollmentSteps = [
    {
      label: t(locale, "Télécharger le PDF", "Download the PDF"),
      title: "Step 1",
    },
    {
      label: t(locale, "Remplir le formulaire", "Submit a form"),
      title: "Step 2",
    },
    {
      label: t(locale, "Nous planifions un échange", "We'll schedule a meeting"),
      title: "Step 3",
    },
    {
      label: t(locale, "Nous vous confirmons l'admission", "We'll notify you about your acceptance"),
      title: "Step 4",
    },
    {
      label: t(locale, "Commencer le parcours", "Start the journey"),
      title: "Step 5",
      },
    ];
  const enrollmentSteps = getJourneySteps(enrollmentSection, defaultEnrollmentSteps);
  const heroTitle = page.hero.title || program?.title || t(locale, "Formation Feldenkrais", "Feldenkrais Training");
  const heroSubtitle = program?.subtitle || page.subtitle || t(locale, "Vivre l'inhabituel", "Living the inhabitual");
  const heroImageUrl = page.hero.imageUrl || program?.heroImageUrl || HERO_IMAGE_URL;
  const introLead =
    getRichSectionBody(overviewSection, "") ||
    program?.excerpt ||
    page.hero.body ||
    t(
      locale,
      "C'est plus qu'un métier. Feldenkrais Education propose une formation professionnelle sur quatre ans pour devenir praticien certifié. Ce parcours vous permettra non seulement d'enseigner la méthode, mais aussi de transformer en profondeur votre manière de vivre et d'apprendre.",
      "It's more than just a profession. Feldenkrais Education proposes a 4-year professional training program to become a certified Feldenkrais practitioner. The training will allow you not only to teach the method, but also to profoundly change the quality of your life.",
    );

  return (
    <div
      className="education-training-landing"
      data-route={page.routeKey}
    >
      <div aria-hidden="true" className="education-training-landing__backdrop" />

      <section
        className="education-training-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(18, 23, 34, 0.42), rgba(18, 23, 34, 0.52)), url(${heroImageUrl})`,
        }}
      >
        <div className="education-training-hero__content">
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
          <EducationTrainingActionBar className="education-training-hero__actions" cohorts={actionCohorts} locale={locale} />
        </div>
      </section>

      <section className="education-training-section education-training-section--intro">
        <div className="education-training-video-copy">
          <SectionHeading
            align="left"
            subtitle={t(locale, "Devenir praticien Feldenkrais", "A Feldenkrais Practitioner")}
            title={t(locale, "Envisagez de le devenir", "Consider Becoming")}
          />
          <p>{introLead}</p>
        </div>

        <div className="education-training-video-frame">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            src="https://www.youtube-nocookie.com/embed/rhYI1kJYoo8?rel=0"
            title="The Feldenkrais training"
          />
        </div>
      </section>

      <section className="education-training-section education-training-section--centers" id="training-centers">
        <SectionHeading
          subtitle={t(locale, "Trois centres, trois atmosphères", "Three centers, three atmospheres")}
          title={t(locale, "Où faire la formation ?", "Where should you do the training?")}
        />

        <div className="education-training-centers-grid">
          {centers.map((center) => {
            const cohort = cohortByCenter.get(center.slug);
            if (!cohort) {
              return null;
            }

            return (
              <Link
                className="education-training-center-card"
                href={localizePath(locale, `/trainings/${cohort.slug}`)}
                key={center.slug}
              >
                <h3>{center.name}</h3>
                <div
                  className="education-training-center-card__image"
                  style={{ backgroundImage: `url(${center.heroImageUrl})` }}
                />

                <div className="education-training-center-card__facts">
                  <div className="education-training-center-card__fact">
                    <span className="education-training-center-card__icon">
                      <TrainingFactIcon kind="title" />
                    </span>
                    <div>
                      <strong>{cohort.name}</strong>
                      <span>{cohort.periodLabel}</span>
                    </div>
                  </div>

                  <div className="education-training-center-card__fact">
                    <span className="education-training-center-card__icon">
                      <TrainingFactIcon kind="director" />
                    </span>
                    <div>
                      <strong>{cohort.director}</strong>
                      <span>{t(locale, "Direction pédagogique", "Educational Director")}</span>
                    </div>
                  </div>

                  <div className="education-training-center-card__fact">
                    <span className="education-training-center-card__icon">
                      <TrainingFactIcon kind="period" />
                    </span>
                    <div>
                      <strong>{t(locale, "Segments", "Segments")}</strong>
                      <span>{cohort.segments}</span>
                    </div>
                  </div>

                  <div className="education-training-center-card__fact">
                    <span className="education-training-center-card__icon">
                      <TrainingFactIcon kind="pricing" />
                    </span>
                    <div>
                      <strong>{t(locale, "Tarif", "Pricing")}</strong>
                      <span>{cohort.pricing}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="education-training-support-card">
        <div>
          <p className="home-section-kicker">
            {t(locale, "Entrer dans la conversation", "Enter the conversation")}
          </p>
          <h2>{t(locale, "Vous ne savez pas encore quel centre vous convient ?", "Not sure which center suits you?")}</h2>
          <p>
            {t(
              locale,
              "Nous pouvons vous orienter vers le bon centre, le bon calendrier et les bons documents avant que vous vous engagiez.",
              "We can help you find the right center, the right calendar, and the right documents before you commit.",
            )}
          </p>
        </div>

        <div className="education-offer-card__actions">
          <EducationBetaReadOnlyButton label={t(locale, "Réserver un appel", "Book a call")} locale={locale} />
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/centers")}>
            {t(locale, "Voir tous les centres", "See all centers")}
          </Link>
        </div>
      </section>

      <section className="education-training-section education-training-section--stats-hero">
        <EducationTrainingActionBar cohorts={actionCohorts} locale={locale} />
        <div className="education-training-stat-hero">
          <div className="education-training-stat-hero__gif">
            <EducationScrollSequence
              alt="Training stairs illustration"
              frameUrls={TRAINING_STEP_FRAME_URLS}
              height={360}
              width={640}
            />
          </div>
          <div className="education-training-stat-hero__values">
            {programStats.map((stat, index) => (
              <p
                className={`education-training-stat-hero__value education-training-stat-hero__value--${index}`}
                key={stat.label}
              >
                {stat.value}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="education-training-section education-training-section--curriculum">
        <SectionHeading
          subtitle={t(locale, "Un état d'esprit de croissance", "A Growth Mindset")}
          title={t(locale, "Ce que vous allez apprendre", "What You Will Learn")}
        />
        <EducationTrainingYearSlider slides={curriculumSlides} />
      </section>

      <section className="education-training-section education-training-section--included">
        <EducationTrainingActionBar cohorts={actionCohorts} locale={locale} />
        <SectionHeading
          subtitle={t(locale, "Pour votre apprentissage", "For your learning")}
          title={getSectionHeading(includedSection, t(locale, "Ce qui est inclus", "What else is included"))}
        />

        <div className="education-training-included-grid">
          {includedLearningItems.map((item, index) => (
            <article
              className={`education-training-included-card education-training-included-card--${index}`}
              key={item.title}
            >
              <span className="education-training-included-card__wash" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="education-training-section education-training-section--gif-break">
        <EducationScrollSequence
          alt="Training hands-on illustration"
          className="education-training-gif-break"
          frameUrls={TRAINING_HANDS_FRAME_URLS}
          height={360}
          width={640}
        />
      </section>

      <section className="education-training-section education-training-section--between">
        <SectionHeading
          subtitle={t(locale, "Continuer l'apprentissage", "Continue the learning")}
          title={getSectionHeading(betweenSection, t(locale, "Entre les segments", "Between Segments"))}
        />

        <div className="education-training-between-grid">
          {betweenSegmentsItems.map((item) => (
            <article className="education-training-between-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="education-training-between-visual">
          <Image
            alt="Platform devices"
            height={1018}
            sizes="(max-width: 900px) 100vw, 980px"
            src={TRAINING_PLATFORM_IMAGE_URL}
            width={1874}
          />
        </div>
      </section>

      <section className="education-training-section education-training-section--enrollment">
        <div className="education-training-enrollment">
          <div className="education-training-enrollment__gif">
            <EducationScrollSequence
              alt="Walking illustration"
              frameUrls={TRAINING_WALK_FRAME_URLS}
              height={360}
              width={640}
            />
          </div>

          <div className="education-training-enrollment__steps">
            <SectionHeading
              align="left"
              title={getSectionHeading(enrollmentSection, t(locale, "Le processus d'inscription", "The Enrollment Process"))}
            />
            <div className="education-training-enrollment__list">
              {enrollmentSteps.map((step, index) => (
                <article className="education-training-enrollment__step" key={step.title}>
                  <span className="education-training-enrollment__step-count">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.label}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <EducationTrainingActionBar cohorts={actionCohorts} locale={locale} />
      </section>

      <section className="education-training-section education-training-section--certification">
        <div className="education-training-certification-stats">
          {certificationStats.map((stat, index) => (
            <article
              className={
                index === 1
                  ? "education-training-certification-stat is-highlighted"
                  : "education-training-certification-stat"
              }
              key={stat.label}
            >
              <p className="education-training-certification-stat__value">{stat.value}</p>
              <p className="education-training-certification-stat__label">{stat.label}</p>
            </article>
          ))}
        </div>

        <div className="education-training-certification">
          <div className="education-training-certification__copy">
            <SectionHeading
              align="left"
              title={t(locale, "Certification", "Certification")}
            />
            <p>
            {t(
              locale,
              "À la fin du parcours, vous recevez un certificat de complétion et êtes reconnu internationalement comme \"praticien de la Méthode Feldenkrais\". Vous rejoignez alors une communauté internationale de plus de 15 000 praticiens. La reconnaissance croissante de la méthode dans les domaines de l'éducation, du sport, des neurosciences et de la santé lui donne une place importante dans le futur.",
              'Upon successful graduation, you will receive a certificate of completion and be recognized internationally as a "Feldenkrais Method practitioner". You will then be part of a growing international community of over 15,000 practitioners today. The rising recognition in the fields of education, sports, neuroscience and health guarantees the Feldenkrais Method an important role in the future.',
            )}
            </p>

            <div className="education-training-certification__logos">
              <Image alt="EuroTAB" height={300} src={TRAINING_EUROTAB_LOGO_URL} width={300} />
              <div className="education-training-certification__logo-stack">
                <Image
                  alt="International Feldenkrais Federation"
                  height={95}
                  src={TRAINING_IFF_LOGO_URL}
                  width={284}
                />
                <p>International Feldenkrais Federation</p>
              </div>
            </div>
          </div>

          <div className="education-training-certification__image">
            <Image
              alt="Certification practice"
              height={1152}
              sizes="(max-width: 900px) 100vw, 520px"
              src={TRAINING_CERTIFICATION_IMAGE_URL}
              width={768}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
