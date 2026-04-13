import Image from "next/image";
import Link from "next/link";

import { localizePath } from "@/lib/locale-path";

import EducationNeurosomaticHeader from "./EducationNeurosomaticHeader";

type EducationPlatformLandingPageProps = {
  locale: string;
};

type PlatformOptionCard = {
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
};

type PlatformProduct = {
  index: string;
  title: string;
  subtitle: string;
  bulletsLabel: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
};

type PlatformMasterclassCard = {
  title: string;
  speaker: string;
  imageUrl: string;
};

const DEVICE_IMAGE_URL = "/brands/feldenkrais-education/training/platform-devices.png";
const LESSONS_COLLAGE_IMAGE_URL = "/brands/feldenkrais-education/platform/group-23935.png";
const MASTERCLASSES_COLLAGE_IMAGE_URL = "/brands/feldenkrais-education/platform/group-23939.png";
const LESSON_LIBRARY_THUMBNAILS = [
  "/brands/feldenkrais-education/platform/3lesson.png",
  "/brands/feldenkrais-education/platform/albums-1.png",
  "/brands/feldenkrais-education/platform/12-weeks-scaled.jpg",
  "/brands/feldenkrais-education/platform/group-23932-scaled.png",
  "/brands/feldenkrais-education/platform/3lesson.png",
] as const;
const MASTERCLASS_CARD_IMAGES = [
  "/brands/feldenkrais-education/platform/howard-masterclass.jpeg",
  "/brands/feldenkrais-education/platform/robert-masterclass.jpeg",
  "/brands/feldenkrais-education/platform/sport-masterclass.jpeg",
  "/brands/feldenkrais-education/platform/howard-masterclass.jpeg",
] as const;

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function getPlatformLandingCopy(locale: string) {
  const isFr = locale.toLowerCase().startsWith("fr");

  const options: PlatformOptionCard[] = [
    {
      title: t(locale, "Accès à la bibliothèque de leçons", "Lesson Library Access"),
      subtitle: t(locale, "Abonnement annuel", "Yearly Membership"),
      imageUrl: LESSONS_COLLAGE_IMAGE_URL,
      href: localizePath(locale, "/lesson-library-access"),
    },
    {
      title: t(locale, "Masterclasses à la demande", "On Demand Masterclasses"),
      subtitle: t(locale, "Achat unique", "One-Time Purchase"),
      imageUrl: MASTERCLASSES_COLLAGE_IMAGE_URL,
      href: localizePath(locale, "/workshops"),
    },
  ];

  const lessonLibrary: PlatformProduct = {
    index: "1.",
    title: t(locale, "Accès à la bibliothèque de leçons", "Lesson Library Access"),
    subtitle: t(locale, "Abonnement annuel", "Yearly Membership"),
    bulletsLabel: t(locale, "L’abonnement inclut :", "Includes access to:"),
    bullets: [
      t(locale, "Leçons live hebdomadaires & replays", "Live weekly lessons & replays"),
      t(locale, "Accès aux enregistrements de notre programme sur 12 semaines", "Access to recordings of our 12-week program"),
      t(locale, "26 documentaires", "26 Documentaries"),
      t(locale, "Séries thématiques de leçons", "Thematic series of lessons"),
      t(locale, "Des centaines de leçons Awareness Through Movement", "Hundreds of Awareness Through Movement Lessons"),
    ],
    ctaLabel: t(locale, "En savoir plus", "Learn more"),
    ctaHref: localizePath(locale, "/lesson-library-access"),
  };

  const masterclasses: PlatformProduct = {
    index: "2.",
    title: t(locale, "Masterclasses à la demande", "On Demand Masterclasses"),
    subtitle: t(locale, "Achat unique", "One-Time Purchase"),
    bulletsLabel: t(locale, "Ce que vous obtenez :", "What you get:"),
    bullets: [
      t(locale, "Apprendre avec des experts internationaux", "Learn with international experts in their field"),
      t(locale, "Captation vidéo multicaméra de haute qualité", "High-quality multi-camera video recordings"),
      t(locale, "Supports d’étude et ressources complémentaires", "Extra study materials and resources"),
      t(locale, "Paiement unique, sans abonnement", "One-time purchase — no subscription"),
      t(locale, "Accès à vie à votre masterclass", "Lifetime access to your masterclass"),
    ],
    ctaLabel: t(locale, "Découvrir les masterclasses", "Check out the Masterclasses"),
    ctaHref: localizePath(locale, "/workshops"),
  };

  const masterclassCards: PlatformMasterclassCard[] = [
    {
      title: t(locale, "Unlearning Pain", "Unlearning Pain"),
      speaker: "Dr Howard Schubiner",
      imageUrl: MASTERCLASS_CARD_IMAGES[0],
    },
    {
      title: t(locale, "Skeletal Voice", "Skeletal Voice"),
      speaker: "Robert Sussuma",
      imageUrl: MASTERCLASS_CARD_IMAGES[1],
    },
    {
      title: t(locale, "Feldenkrais & Sport", "Feldenkrais & Sport"),
      speaker: "Choune Ostorero",
      imageUrl: MASTERCLASS_CARD_IMAGES[2],
    },
    {
      title: t(locale, "Unlearning Pain", "Unlearning Pain"),
      speaker: "Dr Howard Schubiner",
      imageUrl: MASTERCLASS_CARD_IMAGES[3],
    },
  ];

  return {
    headerTitle: t(locale, "LA PLATEFORME NEUROSOMATIQUE", "THE NEUROSOMATIC PLATFORM"),
    loginLabel: t(locale, "Connexion", "Login"),
    heroAlt: t(locale, "Aperçu de la plateforme Neurosomatic", "Neurosomatic platform preview"),
    twoWaysTitle: t(locale, "Deux façons d’apprendre", "Two Ways to Learn"),
    twoWaysSubtitle: t(locale, "Choisissez votre parcours", "Choose Your Learning Path"),
    twoWaysBody: t(
      locale,
      "Accédez par abonnement à une bibliothèque étendue de leçons, ou achetez des masterclasses individuelles.",
      "Get membership access to an extensive library of lessons, or purchase individual masterclasses.",
    ),
    options,
    lessonLibrary,
    masterclasses,
    masterclassCards,
    aboutTitle: t(locale, "Qu’est-ce que la plateforme Neurosomatic ?", "What is the Neurosomatic Platform?"),
    aboutParagraphs: isFr
      ? [
          "La plateforme Neurosomatic réunit un large éventail d’approches qui relient le système nerveux à l’expérience incarnée.",
          "Elle propose une riche bibliothèque de documentaires, de leçons hebdomadaires et de masterclasses spécialisées, du chant à la présence scénique jusqu’au travail sur la douleur chronique. Tous les contenus partagent un même fil conducteur : apprendre par le mouvement, l’attention et l’expérience.",
        ]
      : [
          "The Neurosomatic platform brings together a wide range of approaches that connect the nervous system with embodied experience.",
          "It offers a rich library of documentaries, weekly lessons, and specialized masterclasses on singing, stage presence, all the way to therapy for chronic pain. All the courses share one common thread: learning through movement, awareness, and experiential learning.",
        ],
  };
}

function ProductBullets({ label, bullets }: { label: string; bullets: string[] }) {
  return (
    <div className="neuro-platform-landing-product__details">
      <p className="neuro-platform-landing-product__label">{label}</p>
      <ul className="neuro-platform-landing-product__bullets">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

export default function EducationPlatformLandingPage({
  locale,
}: EducationPlatformLandingPageProps) {
  const copy = getPlatformLandingCopy(locale);

  return (
    <div className="neuro-platform-page neuro-platform-page--landing">
      <EducationNeurosomaticHeader
        locale={locale}
        loginLabel={copy.loginLabel}
        routePath="/platform"
        title={copy.headerTitle}
      />

      <section className="neuro-platform-landing-section neuro-platform-landing-section--hero">
        <div className="neuro-platform-shell">
          <div className="neuro-platform-landing-hero">
            <Image
              alt={copy.heroAlt}
              className="neuro-platform-landing-hero__image"
              height={639}
              priority
              src={DEVICE_IMAGE_URL}
              width={820}
            />
          </div>
        </div>
      </section>

      <section className="neuro-platform-landing-section neuro-platform-landing-section--intro">
        <div className="neuro-platform-shell">
          <div className="neuro-platform-landing-intro">
            <h1>{copy.twoWaysTitle}</h1>
            <p className="neuro-platform-landing-intro__subtitle">{copy.twoWaysSubtitle}</p>
            <p className="neuro-platform-landing-intro__body">{copy.twoWaysBody}</p>
          </div>

          <div className="neuro-platform-landing-options">
            {copy.options.map((option) => (
              <Link className="neuro-platform-landing-option" href={option.href} key={option.title}>
                <Image alt={option.title} fill sizes="(max-width: 1024px) 100vw, 560px" src={option.imageUrl} />
                <div className="neuro-platform-landing-option__overlay" />
                <div className="neuro-platform-landing-option__copy">
                  <strong>{option.title}</strong>
                  <span>{option.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="neuro-platform-landing-section">
        <div className="neuro-platform-shell">
          <article className="neuro-platform-landing-product">
            <header className="neuro-platform-landing-product__header">
              <h2>
                {copy.lessonLibrary.index} {copy.lessonLibrary.title}
              </h2>
              <p>{copy.lessonLibrary.subtitle}</p>
            </header>

            <div className="neuro-platform-landing-library-rail">
              {LESSON_LIBRARY_THUMBNAILS.map((imageUrl, index) => (
                <div
                  className={`neuro-platform-landing-library-rail__item${index === 0 || index === LESSON_LIBRARY_THUMBNAILS.length - 1 ? " is-cropped" : ""}`}
                  key={`${imageUrl}-${index}`}
                >
                  <Image alt="" fill sizes="240px" src={imageUrl} />
                </div>
              ))}
            </div>

            <ProductBullets
              bullets={copy.lessonLibrary.bullets}
              label={copy.lessonLibrary.bulletsLabel}
            />

            <Link
              className="neuro-platform-button neuro-platform-button--primary"
              href={copy.lessonLibrary.ctaHref}
            >
              {copy.lessonLibrary.ctaLabel}
            </Link>
          </article>
        </div>
      </section>

      <section className="neuro-platform-landing-section">
        <div className="neuro-platform-shell">
          <article className="neuro-platform-landing-product">
            <header className="neuro-platform-landing-product__header">
              <h2>
                {copy.masterclasses.index} {copy.masterclasses.title}
              </h2>
              <p>{copy.masterclasses.subtitle}</p>
            </header>

            <div className="neuro-platform-landing-masterclass-rail">
              {copy.masterclassCards.map((card, index) => (
                <article
                  className={`neuro-platform-landing-masterclass-card${index === 0 || index === copy.masterclassCards.length - 1 ? " is-cropped" : ""}`}
                  key={`${card.title}-${card.speaker}-${index}`}
                >
                  <Image alt={card.title} fill sizes="220px" src={card.imageUrl} />
                  <div className="neuro-platform-landing-masterclass-card__overlay" />
                  <div className="neuro-platform-landing-masterclass-card__copy">
                    <h3>{card.title}</h3>
                    <p>{card.speaker}</p>
                  </div>
                </article>
              ))}
            </div>

            <ProductBullets
              bullets={copy.masterclasses.bullets}
              label={copy.masterclasses.bulletsLabel}
            />

            <Link
              className="neuro-platform-button neuro-platform-button--primary"
              href={copy.masterclasses.ctaHref}
            >
              {copy.masterclasses.ctaLabel}
            </Link>
          </article>
        </div>
      </section>

      <section className="neuro-platform-landing-section neuro-platform-landing-section--about">
        <div className="neuro-platform-shell">
          <div className="neuro-platform-landing-about">
            <div className="neuro-platform-landing-about__line" />
            <div className="neuro-platform-landing-about__content">
              <h2>{copy.aboutTitle}</h2>
              <div className="neuro-platform-landing-about__body">
                {copy.aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
