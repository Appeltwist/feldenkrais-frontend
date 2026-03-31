import Link from "next/link";

import BlockRenderer from "@/components/blocks/BlockRenderer";
import EducationNewsletterSignupRow from "@/components/education/EducationNewsletterSignupRow";
import EducationPlatformPromoRow from "@/components/education/EducationPlatformPromoRow";
import ForestHomePage from "@/components/home/ForestHomePage";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { resolveApiHostname } from "@/lib/hostname-routing";
import { getCanonicalOfferPathByTypeAndSlug } from "@/lib/offers";
import { localizePath } from "@/lib/locale-path";
import { getRequiredApiBase } from "@/lib/server-env";
import type { SectionBlock } from "@/lib/types";

type HomeDomain = {
  slug: string;
  name: string;
};

type HomeOccurrence = {
  id: number;
  start_datetime: string;
  end_datetime: string;
  timezone: string;
};

type HomeOfferCard = {
  offer: {
    type: string;
    title: string;
    slug: string;
    hero_image_url?: string | null;
    domains?: HomeDomain[];
  };
  cta_label: string;
  next_occurrences: HomeOccurrence[];
};

type HomePillar = {
  key: string;
  title: string;
  description: string;
  cta_label: string;
  cta_href: string;
};

type HomePayload = {
  hero: {
    headline_lines: string[];
    subhead: string;
    media_url?: string | null;
  };
  main_hall: {
    title?: string | null;
    body?: string | null;
    image_url?: string | null;
  };
  pillars: HomePillar[];
  sections?: SectionBlock[];
  whats_on_preview: {
    cards: HomeOfferCard[];
  };
  domains_teaser: HomeDomain[];
  meta: {
    locale: string;
  };
};

type HomeEntryOption = {
  key: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
};

const MAX_WORKSHOP_PREVIEW_CARDS = 4;
const HOME_METHOD_CARD_IMAGE_URL = "/brands/forest-lighthouse/feldenkrais-session.jpg";
const HOME_METHOD_VIDEO_POSTER_URL =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2025/01/what-is-feldenkrais-scaled.jpg";
const HOME_PLATFORM_VISUAL_URL =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/Group-23809-1.png";
const HOME_TRAINING_VISUAL_URL =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/DSC02199-Large.jpeg";
const HOME_WORKSHOP_VISUAL_URL =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/1085_11201349_S321.jpg";
const HOME_WORKSHOP_FALLBACK_IMAGES = [HOME_WORKSHOP_VISUAL_URL, HOME_TRAINING_VISUAL_URL];
const API_BASE = getRequiredApiBase();

async function fetchHomePayload(hostname: string, locale: string) {
  const url = new URL(`${API_BASE}/home`);
  url.searchParams.set("domain", resolveApiHostname(hostname));
  url.searchParams.set("limit", "9");
  if (locale) {
    url.searchParams.set("locale", locale);
  }

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as HomePayload;
}

function isForestHomepage(hostname: string) {
  return resolveApiHostname(hostname).includes("forest-lighthouse");
}

function formatOccurrence(value: string, locale: string, timezone?: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const formatter = new Intl.DateTimeFormat(locale || "en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || undefined,
  });

  const formatted = formatter.format(parsed);
  return timezone ? `${formatted} (${timezone})` : formatted;
}

function buildHomeEntryOptions(locale: string): HomeEntryOption[] {
  const isFr = locale.toLowerCase().startsWith("fr");

  return [
    {
      key: "method",
      title: isFr ? "Découvrir la méthode" : "Discover the method",
      description:
        isFr
          ? "Comprendre les bases de la méthode Feldenkrais, ses principes, et les différentes façons d’y entrer."
          : "Understand the foundations of the Feldenkrais Method, its principles, and the different ways to begin.",
      ctaLabel: isFr ? "Aller à la méthode" : "Go to the method",
      href: "/what-is-feldenkrais",
      imageUrl: HOME_METHOD_CARD_IMAGE_URL,
      imageAlt: isFr ? "Personne en séance Feldenkrais" : "Person in a Feldenkrais session",
    },
    {
      key: "lesson",
      title: isFr ? "Faire une leçon" : "Try a lesson",
      description:
        isFr
          ? "Commencer en ligne avec des leçons guidées, des masterclasses et des ressources pratiques sur la plateforme."
          : "Start online with guided lessons, masterclasses, and practical resources on the platform.",
      ctaLabel: isFr ? "Essayer la plateforme" : "Try the platform",
      href: "/platform",
      imageUrl: HOME_PLATFORM_VISUAL_URL,
      imageAlt: isFr ? "Aperçu de la plateforme Neuro Somatic" : "Preview of the Neuro Somatic platform",
    },
    {
      key: "training",
      title: isFr ? "Devenir praticien·ne" : "Become a practitioner",
      description:
        isFr
          ? "Explorer le parcours de formation professionnelle, les centres, et les prochaines cohortes."
          : "Explore the professional training pathway, the centers, and the upcoming cohorts.",
      ctaLabel: isFr ? "Voir la formation" : "View the training",
      href: "/trainings",
      imageUrl: HOME_TRAINING_VISUAL_URL,
      imageAlt: isFr ? "Formation professionnelle Feldenkrais" : "Feldenkrais professional training",
    },
  ];
}

function HomeEntryOptions({ locale }: { locale: string }) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const options = buildHomeEntryOptions(locale);

  return (
    <section className="home-section">
      <div className="home-section-head">
        <div>
          <p className="home-section-kicker">{isFr ? "Choisir une porte d’entrée" : "Choose an entry point"}</p>
          <h2>{isFr ? "Trois façons simples de commencer" : "Three simple ways to begin"}</h2>
        </div>
      </div>
      <div className="education-card-grid education-card-grid--home-entry">
        {options.map((option) => (
          <Link
            className={`education-card education-home-entry-card education-home-entry-card--${option.key}`}
            href={localizePath(locale, option.href)}
            key={option.key}
          >
            <div className="education-home-entry-card__media">
              <img alt={option.imageAlt} loading="lazy" src={option.imageUrl} />
            </div>
            <div className="education-home-entry-card__body">
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <span className="education-button education-home-entry-card__link">
                {option.ctaLabel}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomeIntroVideo({ locale }: { locale: string }) {
  const isFr = locale.toLowerCase().startsWith("fr");

  return (
    <section className="home-video-section">
      <div className="home-video-section__header">
        <p className="home-section-kicker">{isFr ? "Vidéo d’introduction" : "Intro video"}</p>
        <h2>{isFr ? "What is Feldenkrais ?" : "What is Feldenkrais?"}</h2>
      </div>
      <a
        className="home-video-card"
        href="https://www.youtube.com/watch?v=voC0aWkl3f8&t=1s"
        rel="noreferrer"
        target="_blank"
      >
        <img
          alt={isFr ? "Vidéo d’introduction à la méthode Feldenkrais" : "Introduction video to the Feldenkrais Method"}
          className="home-video-card__image"
          loading="lazy"
          src={HOME_METHOD_VIDEO_POSTER_URL}
        />
        <span className="home-video-card__play" aria-hidden="true">
          <svg fill="none" height="56" viewBox="0 0 56 56" width="56">
            <circle cx="28" cy="28" fill="currentColor" r="28" />
            <path d="M23 19.5 38 28l-15 8.5v-17Z" fill="#ffffff" />
          </svg>
        </span>
      </a>
    </section>
  );
}

function HomeWhatsOnPreview({
  locale,
  cards,
}: {
  locale: string;
  cards: HomeOfferCard[];
}) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const workshopCards = cards.filter((card) => card.offer.type.trim().toUpperCase() === "WORKSHOP");
  const previewCards = (workshopCards.length > 0
    ? [...workshopCards, ...cards.filter((card) => card.offer.type.trim().toUpperCase() !== "WORKSHOP")]
    : cards
  ).slice(0, MAX_WORKSHOP_PREVIEW_CARDS);

  if (previewCards.length === 0) {
    return (
      <section className="home-section home-workshops-section home-section--empty-state">
        <div className="home-workshops-section__head">
          <div>
            <h2>{isFr ? "Formations et ateliers" : "Trainings and workshops"}</h2>
            <div className="home-workshops-section__rule" />
            <p className="home-section__intro">
              {isFr
                ? "Développez vos compétences, en personne ou en ligne. Vous trouverez ici un aperçu des formations et ateliers proposés actuellement."
                : "Improve your skills, in person or online. Here, you will find an overview of the trainings and workshops we offer at the moment."}
            </p>
            <h3>{isFr ? "Événements en direct" : "Live events"}</h3>
          </div>
          <Link className="text-link" href={localizePath(locale, "/workshops")}>
            {isFr ? "Voir tous les ateliers" : "View all workshops"}
          </Link>
        </div>
        <div className="education-card-grid education-card-grid--home-links">
          <article className="education-card education-home-link-card home-workshops-fallback-card">
            <div
              className="education-offer-card__media home-workshops-fallback-card__media"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(19, 23, 32, 0.06), rgba(19, 23, 32, 0.72)), url(${HOME_TRAINING_VISUAL_URL})`,
              }}
            />
            <div className="education-offer-card__body home-workshops-fallback-card__body">
              <h3>{isFr ? "Formations professionnelles" : "Professional trainings"}</h3>
              <p>
                {isFr
                  ? "Explorer les cohortes, les centres et le parcours long pour devenir praticien·ne."
                  : "Explore the cohorts, centers, and long-form pathway for becoming a practitioner."}
              </p>
              <Link className="education-button home-workshops-fallback-card__link" href={localizePath(locale, "/trainings")}>
                {isFr ? "Voir la formation" : "View training"}
              </Link>
            </div>
          </article>
          <article className="education-card education-home-link-card home-workshops-fallback-card">
            <div
              className="education-offer-card__media home-workshops-fallback-card__media"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(19, 23, 32, 0.06), rgba(19, 23, 32, 0.72)), url(${HOME_WORKSHOP_VISUAL_URL})`,
              }}
            />
            <div className="education-offer-card__body home-workshops-fallback-card__body">
              <h3>{isFr ? "Ateliers & masterclasses" : "Workshops & masterclasses"}</h3>
              <p>
                {isFr
                  ? "Explorer les formats courts, intensifs et thématiques déjà disponibles dans le nouveau site."
                  : "Explore the short, intensive, and thematic formats already available in the new site."}
              </p>
              <Link className="education-button home-workshops-fallback-card__link" href={localizePath(locale, "/workshops")}>
                {isFr ? "Voir les ateliers" : "View workshops"}
              </Link>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="home-section home-workshops-section">
      <div className="home-workshops-section__head">
        <div>
          <h2>{isFr ? "Formations et ateliers" : "Trainings and workshops"}</h2>
          <div className="home-workshops-section__rule" />
          <p className="home-section__intro">
            {isFr
              ? "Développez vos compétences, en personne ou en ligne. Vous trouverez ici un aperçu des formations et ateliers proposés actuellement."
              : "Improve your skills, in person or online. Here, you will find an overview of the trainings and workshops we offer at the moment."}
          </p>
          <h3>{isFr ? "Événements en direct" : "Live events"}</h3>
        </div>
        <Link className="text-link" href={localizePath(locale, "/workshops")}>
          {isFr ? "Voir tous les ateliers" : "View all workshops"}
        </Link>
      </div>
      <ul className="calendar-group-grid">
        {previewCards.map((card, index) => {
          const rawOfferPath =
            getCanonicalOfferPathByTypeAndSlug(card.offer.type, card.offer.slug) || `/offer/${card.offer.slug}`;
          const offerPath = localizePath(locale, rawOfferPath);
          const primary = card.next_occurrences[0];
          const domains = (card.offer.domains ?? []).map((domain) => domain.name).join(" · ");
          const cardImageUrl =
            card.offer.hero_image_url || HOME_WORKSHOP_FALLBACK_IMAGES[index % HOME_WORKSHOP_FALLBACK_IMAGES.length];

          return (
            <li className="card calendar-group-card" key={`${card.offer.type}-${card.offer.slug}`}>
              <div
                className="calendar-group-card__hero"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(19, 23, 32, 0.08), rgba(19, 23, 32, 0.78)), url(${cardImageUrl})`,
                }}
              >
                <p className="offer-type-label">{card.offer.type.replaceAll("_", " ")}</p>
                <h2>{card.offer.title}</h2>
              </div>

              {domains ? <p className="calendar-group-card__domains">{domains}</p> : null}
              {primary ? (
                <p className="calendar-group-card__primary-time">
                  {formatOccurrence(primary.start_datetime, locale, primary.timezone)}
                </p>
              ) : null}
              <div className="link-row">
                <Link className="text-link" href={offerPath}>
                  {isFr ? "Voir le détail" : "Offer details"}
                </Link>
                {primary ? (
                  <Link className="button-link" href={offerPath}>
                    {card.cta_label || "Book"}
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function hasMeaningfulHomeEditorialSections(blocks: SectionBlock[] | undefined) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return false;
  }

  return blocks.some((block) => {
    const record = typeof block === "object" && block !== null ? (block as Record<string, unknown>) : null;
    return record?.type !== "legacy_html";
  });
}

function HomeEditorialSections({
  blocks,
  locale,
}: {
  blocks: SectionBlock[];
  locale: string;
}) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <section className="home-section home-editorial">
      <BlockRenderer blocks={blocks} locale={locale.toLowerCase().startsWith("fr") ? "fr" : "en"} />
    </section>
  );
}

export default async function HomePage() {
  const hostname = await getHostname();
  const requestedLocale = await getRequestLocale("en");
  if (isForestHomepage(hostname)) {
    return <ForestHomePage hostname={hostname} locale={requestedLocale} />;
  }

  const home = await fetchHomePayload(hostname, requestedLocale);

  if (!home) {
    return (
      <section className="page-section">
        <h1>Home</h1>
        <p>Unable to load homepage content right now.</p>
      </section>
    );
  }

  const locale = home.meta.locale || requestedLocale || "en";
  const hasEditorialSections = hasMeaningfulHomeEditorialSections(home.sections);
  const homeContent = (
    <section className="page-section home-page">
      <HomeEntryOptions locale={locale} />
      <HomeIntroVideo locale={locale} />
      <EducationNewsletterSignupRow locale={locale} />
      <HomeWhatsOnPreview cards={home.whats_on_preview.cards} locale={locale} />
      <EducationPlatformPromoRow locale={locale} />
      {hasEditorialSections ? <HomeEditorialSections blocks={home.sections || []} locale={locale} /> : null}
    </section>
  );

  return homeContent;
}
