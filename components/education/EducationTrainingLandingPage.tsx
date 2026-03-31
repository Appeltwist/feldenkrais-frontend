import Image from "next/image";
import Link from "next/link";

import { getEducationCenters } from "@/lib/education-content";
import {
  getEducationTrainingCohorts,
  getEducationTrainingCurriculum,
  getEducationTrainingIncludedItems,
  getEducationTrainingProgramStats,
} from "@/lib/education-training";
import { localizePath } from "@/lib/locale-path";
import type { NarrativePage } from "@/lib/site-config";

import EducationTrainingActionBar from "./EducationTrainingActionBar";
import EducationTrainingYearSlider from "./EducationTrainingYearSlider";

type EducationTrainingLandingPageProps = {
  page: NarrativePage;
  locale: string;
};

const HERO_IMAGE_URL = "/brands/feldenkrais-education/training/hero-room.jpeg";
const TRAINING_STAIRS_GIF_URL = "/brands/feldenkrais-education/training/gif-stairs.gif";
const TRAINING_HANDS_GIF_URL = "/brands/feldenkrais-education/training/gif-hands-on.gif";
const TRAINING_WALK_GIF_URL = "/brands/feldenkrais-education/training/gif-walk.gif";
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

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
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
  page,
  locale,
}: EducationTrainingLandingPageProps) {
  const centers = getEducationCenters(locale);
  const cohorts = getEducationTrainingCohorts(locale);
  const curriculum = getEducationTrainingCurriculum(locale);
  const includedItems = getEducationTrainingIncludedItems(locale);
  const programStats = getEducationTrainingProgramStats(locale);
  const includedLearningItems = includedItems.slice(0, 3);
  const betweenSegmentsItems = includedItems.slice(3, 7);
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
  const enrollmentSteps = [
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

  return (
    <div
      className="education-training-landing"
      data-route={page.routeKey}
    >
      <section
        className="education-training-hero"
        style={{
          backgroundImage:
            `linear-gradient(180deg, rgba(18, 23, 34, 0.42), rgba(18, 23, 34, 0.52)), url(${HERO_IMAGE_URL})`,
        }}
      >
        <div className="education-training-hero__content">
          <h1>{t(locale, "Formation Feldenkrais", "Feldenkrais Training")}</h1>
          <p>{t(locale, "Vivre l'inhabituel", "Living the inhabitual")}</p>
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
          <p>
            {t(
              locale,
              "C'est plus qu'un métier. Feldenkrais Education propose une formation professionnelle sur quatre ans pour devenir praticien certifié. Ce parcours vous permettra non seulement d'enseigner la méthode, mais aussi de transformer en profondeur votre manière de vivre et d'apprendre.",
              "It's more than just a profession. Feldenkrais Education proposes a 4-year professional training program to become a certified Feldenkrais practitioner. The training will allow you not only to teach the method, but also to profoundly change the quality of your life.",
            )}
          </p>
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
          <a className="education-button" href={localizePath(locale, "/contact")}>
            {t(locale, "Réserver un appel", "Book a call")}
          </a>
          <Link className="education-button education-button--secondary" href={localizePath(locale, "/centers")}>
            {t(locale, "Voir tous les centres", "See all centers")}
          </Link>
        </div>
      </section>

      <section className="education-training-section education-training-section--stats-hero">
        <EducationTrainingActionBar cohorts={actionCohorts} locale={locale} />
        <div className="education-training-stat-hero">
          <div className="education-training-stat-hero__gif">
            <Image
              alt="Training stairs illustration"
              height={400}
              sizes="(max-width: 900px) 100vw, 420px"
              src={TRAINING_STAIRS_GIF_URL}
              unoptimized
              width={400}
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
          title={t(locale, "Ce qui est inclus", "What else is included")}
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
        <Image
          alt="Training hands-on illustration"
          className="education-training-gif-break"
          height={250}
          sizes="(max-width: 900px) 60vw, 280px"
          src={TRAINING_HANDS_GIF_URL}
          unoptimized
          width={250}
        />
      </section>

      <section className="education-training-section education-training-section--between">
        <SectionHeading
          subtitle={t(locale, "Continuer l'apprentissage", "Continue the learning")}
          title={t(locale, "Entre les segments", "Between Segments")}
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
            <Image
              alt="Walking illustration"
              height={400}
              sizes="(max-width: 900px) 100vw, 420px"
              src={TRAINING_WALK_GIF_URL}
              unoptimized
              width={400}
            />
          </div>

          <div className="education-training-enrollment__steps">
            <SectionHeading
              align="left"
              title={t(locale, "Le processus d'inscription", "The Enrollment Process")}
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
