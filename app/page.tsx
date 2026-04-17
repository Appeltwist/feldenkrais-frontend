import Link from "next/link";

import BlockRenderer from "@/components/blocks/BlockRenderer";
import EducationNewsletterSignupRow from "@/components/education/EducationNewsletterSignupRow";
import EducationPlatformPromoRow from "@/components/education/EducationPlatformPromoRow";
import EducationWorkshopFeatureCard from "@/components/education/EducationWorkshopFeatureCard";
import EducationWorkshopSlider from "@/components/education/EducationWorkshopSlider";
import ForestHomePage from "@/components/home/ForestHomePage";
import {
  fetchOffers,
  fetchSiteConfig,
  fetchTrainingProgramDetail,
  fetchTrainingPrograms,
} from "@/lib/api";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import {
  buildEducationWorkshopCollection,
  fetchForestFeaturedWorkshops,
  type EducationWorkshopCollectionItem,
} from "@/lib/education-workshops";
import { EDUCATION_NEWSLETTER_SIGNUP_URL } from "@/lib/education-links";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { resolveApiHostname } from "@/lib/hostname-routing";
import { localizePath } from "@/lib/locale-path";
import { getRequiredApiBase } from "@/lib/server-env";
import type { NarrativePage } from "@/lib/site-config";
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
  href: string;
  imageUrl: string;
  imageAlt: string;
};

type HomePageReferences = {
  methodPage: NarrativePage | null;
  newsletterPage: NarrativePage | null;
  platformPage: NarrativePage | null;
  trainingsPage: NarrativePage | null;
  trainingProgramImageUrl?: string | null;
  workshopsPage: NarrativePage | null;
};

const HOME_METHOD_CARD_IMAGE_URL =
  "/brands/feldenkrais-education/media-library/079A23510.jpg";
const HOME_METHOD_VIDEO_POSTER_URL = "https://i.ytimg.com/vi/voC0aWkl3f8/maxresdefault.jpg";
const HOME_LESSON_CARD_IMAGE_URL = "/brands/feldenkrais-education/training/year-1.jpeg";
const HOME_TRAINING_VISUAL_URL =
  "https://feldenkrais-education.com/wp-content/uploads/sites/15/2024/10/DSC02199-Large.jpeg";
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

function resolveCmsHref(locale: string, href: string | null | undefined, fallbackPath: string) {
  const target = href || fallbackPath;
  return target.startsWith("/") ? localizePath(locale, target) : target;
}

function buildHomeEntryOptions(locale: string, refs: HomePageReferences): HomeEntryOption[] {
  const isFr = locale.toLowerCase().startsWith("fr");

  const defaults: HomeEntryOption[] = [
    {
      key: "lesson",
      title: refs.platformPage?.hero.title || refs.platformPage?.title || (isFr ? "Faire une leçon" : "Try a lesson"),
      description:
        refs.platformPage?.hero.body ||
        refs.platformPage?.subtitle ||
        (isFr
          ? "Commencer en ligne avec des leçons guidées, des masterclasses et des ressources pratiques sur la plateforme."
          : "Start online with guided lessons, masterclasses, and practical resources on the platform."),
      href: resolveCmsHref(locale, refs.platformPage?.primaryCta?.url, "/platform"),
      imageUrl: HOME_LESSON_CARD_IMAGE_URL,
      imageAlt: isFr ? "Personne suivant une leçon Feldenkrais" : "Person following a Feldenkrais lesson",
    },
    {
      key: "training",
      title: refs.trainingsPage?.hero.title || refs.trainingsPage?.title || (isFr ? "Devenir praticien·ne" : "Become a practitioner"),
      description:
        refs.trainingsPage?.hero.body ||
        refs.trainingsPage?.subtitle ||
        (isFr
          ? "Explorer le parcours de formation professionnelle, les centres, et les prochaines cohortes."
          : "Explore the professional training pathway, the centers, and the upcoming cohorts."),
      href: resolveCmsHref(locale, refs.trainingsPage?.primaryCta?.url, "/trainings"),
      imageUrl: refs.trainingsPage?.hero.imageUrl || refs.trainingProgramImageUrl || HOME_TRAINING_VISUAL_URL,
      imageAlt: refs.trainingsPage?.hero.title || (isFr ? "Formation professionnelle Feldenkrais" : "Feldenkrais professional training"),
    },
    {
      key: "method",
      title: refs.methodPage?.hero.title || refs.methodPage?.title || (isFr ? "Découvrir la méthode" : "Discover the method"),
      description:
        refs.methodPage?.hero.body ||
        refs.methodPage?.subtitle ||
        (isFr
          ? "Comprendre les bases de la méthode Feldenkrais, ses principes, et les différentes façons d’y entrer."
          : "Understand the foundations of the Feldenkrais Method, its principles, and the different ways to begin."),
      href: localizePath(locale, "/what-is-feldenkrais"),
      imageUrl: HOME_METHOD_CARD_IMAGE_URL,
      imageAlt: refs.methodPage?.hero.title || (isFr ? "Personne en séance Feldenkrais" : "Person in a Feldenkrais session"),
    },
  ];

  return defaults;
}

function getHomeEntryButtonLabel(locale: string, key: HomeEntryOption["key"]) {
  const isFr = locale.toLowerCase().startsWith("fr");

  switch (key) {
    case "lesson":
      return isFr ? "Faire une leçon" : "Try a lesson";
    case "training":
      return isFr ? "Devenir praticien·ne" : "Become a practitioner";
    case "method":
      return isFr ? "Découvrir la méthode" : "Discover the method";
    default:
      return "";
  }
}

function HomeEntryOptions({
  locale,
  refs,
  pillars = [],
}: {
  locale: string;
  refs: HomePageReferences;
  pillars?: HomePillar[];
}) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const keyedPillars = new Map(
    pillars
      .filter((pillar) => pillar.key)
      .map((pillar) => [pillar.key, pillar] as const),
  );
  const hasKeyedPillars = keyedPillars.size > 0;
  const options = buildHomeEntryOptions(locale, refs).map((option, index) => {
    const pillar = keyedPillars.get(option.key) ?? (!hasKeyedPillars ? pillars[index] : undefined);
    if (!pillar) {
      return option;
    }

    return {
      ...option,
      title: pillar.title || option.title,
      description: pillar.description || option.description,
      href: resolveCmsHref(locale, pillar.cta_href, option.href),
    };
  });

  return (
    <section
      aria-label={isFr ? "Trois façons simples de commencer" : "Three simple ways to begin"}
      className="home-section home-section--entry-panels"
    >
      <div className="education-card-grid education-card-grid--home-entry">
        {options.map((option) => (
          <Link
            aria-label={option.title}
            className={`education-card education-home-entry-card education-home-entry-card--${option.key}`}
            href={option.href}
            key={option.key}
          >
            <div className="education-home-entry-card__media">
              <img alt={option.imageAlt} loading="lazy" src={option.imageUrl} />
            </div>
            <div className="education-home-entry-card__body">
              <span className="education-button education-home-entry-card__link">
                {getHomeEntryButtonLabel(locale, option.key)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomeIntroVideo({
  locale,
  methodPage,
}: {
  locale: string;
  methodPage: NarrativePage | null;
}) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const title = methodPage?.hero.title || methodPage?.title || (isFr ? "What is Feldenkrais ?" : "What is Feldenkrais?");
  const posterUrl = HOME_METHOD_VIDEO_POSTER_URL;

  return (
    <section className="home-video-section">
      <div className="home-video-section__header">
        <p className="home-section-kicker">{isFr ? "Vidéo d’introduction" : "Intro video"}</p>
        <h2>{title}</h2>
      </div>
      <a
        className="home-video-card"
        href="https://www.youtube.com/watch?v=voC0aWkl3f8&t=1s"
        rel="noreferrer"
        target="_blank"
      >
        <img
          alt={title}
          className="home-video-card__image"
          loading="lazy"
          src={posterUrl}
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
  upcomingWorkshops,
  workshopsPage,
}: {
  locale: string;
  upcomingWorkshops: EducationWorkshopCollectionItem[];
  workshopsPage: NarrativePage | null;
}) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const title = workshopsPage?.title || (isFr ? "Tous les workshops" : "All workshops");
  const intro =
    isFr
      ? "Découvrez les workshops de cette année, depuis des formations avancées ancrées dans des domaines spécifiques jusqu’aux workshops d’introduction qui donnent un aperçu des stratégies d’apprentissage neurosomatiques propres à FE."
      : "Discover this year's workshops, from advanced domain-specific trainings to introductory workshops that give you a taste of the unique neurosomatic learning strategies.";

  if (upcomingWorkshops.length === 0) {
    return (
      <section className="home-section home-workshops-section">
        <div className="home-workshops-section__head">
          <div>
            <h2>{title}</h2>
            <div className="home-workshops-section__rule" />
            <p className="home-section__intro">{intro}</p>
          </div>
        </div>
        <section className="education-listing">
          <p>{isFr ? "Aucun workshop à afficher pour le moment." : "No workshops to show right now."}</p>
        </section>
      </section>
    );
  }

  return (
    <section className="home-section home-workshops-section">
      <div className="home-workshops-section__head">
        <div>
          <h2>{title}</h2>
          <div className="home-workshops-section__rule" />
          <p className="home-section__intro">{intro}</p>
        </div>
      </div>
      <EducationWorkshopSlider
        ariaLabel={isFr ? "Liste des workshops à venir" : "List of upcoming workshops"}
      >
        {upcomingWorkshops.map((workshop) => (
          <EducationWorkshopFeatureCard key={workshop.id} locale={locale} workshop={workshop} />
        ))}
      </EducationWorkshopSlider>
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
  const [methodPage, platformPage, newsletterPage, trainingsPage, workshopsPage, trainingPrograms, siteConfig] = await Promise.all([
    resolveEducationNarrativePage(hostname, "what-is-feldenkrais", locale).catch(() => null),
    resolveEducationNarrativePage(hostname, "platform", locale).catch(() => null),
    resolveEducationNarrativePage(hostname, "newsletter", locale).catch(() => null),
    resolveEducationNarrativePage(hostname, "trainings", locale).catch(() => null),
    resolveEducationNarrativePage(hostname, "workshops", locale).catch(() => null),
    fetchTrainingPrograms(hostname, locale).catch(() => []),
    fetchSiteConfig(hostname).catch(() => null),
  ]);
  const [workshopOffers, forestWorkshops] = await Promise.all([
    fetchOffers({
      hostname,
      center: siteConfig?.centerSlug,
      type: "WORKSHOP",
      locale,
    }).catch(() => []),
    fetchForestFeaturedWorkshops(locale).catch(() => []),
  ]);
  const upcomingWorkshops = buildEducationWorkshopCollection(locale, workshopOffers, forestWorkshops);
  const primaryTrainingProgram = trainingPrograms[0]
    ? await fetchTrainingProgramDetail(hostname, trainingPrograms[0].slug, locale).catch(() => null)
    : null;
  const refs: HomePageReferences = {
    methodPage,
    newsletterPage,
    platformPage,
    trainingsPage,
    trainingProgramImageUrl: primaryTrainingProgram?.heroImageUrl || null,
    workshopsPage,
  };
  const hasEditorialSections = hasMeaningfulHomeEditorialSections(home.sections);
  const homeContent = (
    <section className="page-section home-page">
      <HomeEntryOptions locale={locale} pillars={home.pillars} refs={refs} />
      <HomeIntroVideo locale={locale} methodPage={methodPage} />
      <EducationNewsletterSignupRow
        content={{
          title: "Newsletter",
          subtitle: "",
          body: "",
          imageUrl: newsletterPage?.hero.imageUrl,
          href: EDUCATION_NEWSLETTER_SIGNUP_URL,
          buttonLabel: locale.toLowerCase().startsWith("fr")
            ? "S’inscrire à la newsletter"
            : "Sign up to the newsletter",
        }}
        locale={locale}
      />
      <HomeWhatsOnPreview locale={locale} upcomingWorkshops={upcomingWorkshops} workshopsPage={workshopsPage} />
      <EducationPlatformPromoRow
        content={{
          title: platformPage?.hero.title || platformPage?.title,
          subtitle: "",
          body: locale.toLowerCase().startsWith("fr")
            ? "La plateforme prolonge les workshops et formations en présence. C’est l’endroit où l’étude en ligne devient accessible à travers des leçons audio ou des documentaires innovants."
            : "The platform extends beyond in-person workshops and trainings. It is where online study become accessible through audio lessons or innovative documentaries",
          imageUrl: platformPage?.hero.imageUrl,
          href: platformPage?.primaryCta?.url || "/platform",
          buttonLabel: platformPage?.primaryCta?.label,
        }}
        locale={locale}
      />
      {hasEditorialSections ? <HomeEditorialSections blocks={home.sections || []} locale={locale} /> : null}
    </section>
  );

  return homeContent;
}
