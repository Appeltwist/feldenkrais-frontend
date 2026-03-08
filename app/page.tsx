import Link from "next/link";
import { headers } from "next/headers";

import { ForestPageShell } from "@/components/forest/ForestPageShell";
import { getHostname } from "@/lib/get-hostname";
import { getCanonicalOfferPathByTypeAndSlug } from "@/lib/offers";
import { localizePath } from "@/lib/locale-path";

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
  whats_on_preview: {
    cards: HomeOfferCard[];
  };
  domains_teaser: HomeDomain[];
  meta: {
    locale: string;
  };
};

type EngageTile = {
  key: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

type HomeDetailImage = {
  src: string;
  alt: string;
};

type ForestHomeMedia = {
  hero: string;
  mainHall: string;
  detailImages: HomeDetailImage[];
};

const MAX_WHATS_ON_CARDS = 9;
const FOREST_HOST_MATCHERS = ["forest-lighthouse.local", "forest-lighthouse"];

const FOREST_HOME_MEDIA: ForestHomeMedia = {
  hero: "/brands/forest-lighthouse/home/hero-main-hall.jpg",
  mainHall: "/brands/forest-lighthouse/home/main-hall-wide.jpg",
  detailImages: [
    {
      src: "/brands/forest-lighthouse/home/community-practice.jpg",
      alt: "Group practice at Forest Lighthouse",
    },
    {
      src: "/brands/forest-lighthouse/home/terrace.jpg",
      alt: "Forest Lighthouse terrace and gathering space",
    },
    {
      src: "/brands/forest-lighthouse/home/cafe.jpg",
      alt: "Forest Lighthouse cafe and social room",
    },
  ],
};

async function fetchHomePayload(hostname: string) {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders.get("host") ?? `${hostname}:3000`;
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const locale = (requestHeaders.get("x-locale") ?? "").trim();

  const url = new URL("/api/home", `${protocol}://${host}`);
  url.searchParams.set("hostname", hostname);
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

function getForestHomeMedia(hostname: string): ForestHomeMedia | null {
  const normalizedHostname = hostname.toLowerCase();
  return FOREST_HOST_MATCHERS.some((host) => normalizedHostname.includes(host))
    ? FOREST_HOME_MEDIA
    : null;
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

function compactText(value: string | null | undefined, limit = 190): string {
  const text = (value || "").replace(/\s+/g, " ").trim();
  if (!text) {
    return "";
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit).trimEnd()}...`;
}

function normalizeHeadlineLine(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\s+/g, " ").trim();
}

function buildEngageTiles(locale: string, pillars: HomePillar[]): EngageTile[] {
  const isFr = locale.toLowerCase().startsWith("fr");
  const practice = pillars.find((pillar) => pillar.key === "practice") ?? pillars[0];
  const training =
    pillars.find((pillar) => pillar.key === "training") ??
    pillars.find((pillar) => pillar.cta_href.includes("training")) ??
    pillars[1];
  const rentFromPayload = pillars.find(
    (pillar) => pillar.key === "rent" || pillar.cta_href.includes("/rent")
  );

  const baseTiles: EngageTile[] = [
    {
      key: "classes",
      title: practice?.title || (isFr ? "Cours" : "Classes"),
      description:
        compactText(practice?.description, 130) ||
        (isFr ? "Pratique hebdomadaire en groupe." : "Weekly group practice sessions."),
      ctaLabel: practice?.cta_label || (isFr ? "Voir les cours" : "See classes"),
      href: "/classes",
    },
    {
      key: "private",
      title: isFr ? "Privé" : "Private",
      description: isFr
        ? "Accompagnement individuel pour besoins spécifiques et progression ciblée."
        : "One-to-one guidance for specific needs and focused progress.",
      ctaLabel: isFr ? "Découvrir" : "Explore",
      href: "/private-sessions",
    },
    {
      key: "training",
      title: training?.title || (isFr ? "Formation" : "Training"),
      description:
        compactText(training?.description, 130) ||
        (isFr ? "Parcours de formation sur la durée." : "Longer-form professional learning pathways."),
      ctaLabel: training?.cta_label || (isFr ? "Voir les formations" : "See trainings"),
      href: "/trainings",
    },
  ];

  if (rentFromPayload) {
    baseTiles.push({
      key: "rent",
      title: rentFromPayload.title || (isFr ? "Location" : "Rent"),
      description:
        compactText(rentFromPayload.description, 130) ||
        (isFr
          ? "Accueillez ateliers et événements dans notre espace principal."
          : "Host workshops and events in our main hall."),
      ctaLabel: rentFromPayload.cta_label || (isFr ? "Demander un devis" : "Request a quote"),
      href: "/rent",
    });
  }

  return baseTiles;
}

function HomeHero({
  hero,
  heroMediaUrl,
  locale,
}: {
  hero: HomePayload["hero"];
  heroMediaUrl: string;
  locale: string;
}) {
  const isFr = locale.toLowerCase().startsWith("fr");
  return (
    <section
      className="home-hero"
      style={
        heroMediaUrl
          ? {
              backgroundImage: `linear-gradient(120deg, rgba(7, 33, 33, 0.78), rgba(7, 33, 33, 0.36)), url(${heroMediaUrl})`,
            }
          : {
              backgroundImage:
                "linear-gradient(120deg, rgba(7, 33, 33, 0.9), rgba(20, 82, 77, 0.86))",
            }
      }
    >
      <div className="home-hero__content">
        <h1>
          {hero.headline_lines.map((line, index) => (
            <span className="home-hero__line" key={`${line}-${index}`}>
              {normalizeHeadlineLine(line)}
            </span>
          ))}
        </h1>
        <p className="home-hero__subhead">{hero.subhead}</p>
        <div className="link-row home-hero__actions">
          <Link className="button-link home-hero__primary-cta" href={localizePath(locale, "/calendar")}>
            {isFr ? "Découvrir ce qui se passe" : "Discover What's On"}
          </Link>
          <Link className="home-hero__about-link" href={localizePath(locale, "/about")}>
            {isFr ? "À propos" : "About"}
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomeMainHall({
  mainHall,
  imageUrl,
  detailImages,
  locale,
}: {
  mainHall: HomePayload["main_hall"];
  imageUrl?: string | null;
  detailImages?: HomeDetailImage[];
  locale: string;
}) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const title = mainHall.title || "Main Hall";
  const body = compactText(mainHall.body, 220);

  return (
    <section className="home-main-hall">
      <div className="home-main-hall__content">
        <p className="home-section-kicker">{isFr ? "Salle principale" : "Main Hall"}</p>
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      {imageUrl ? (
        <div className="home-main-hall__media">
          <img alt={title} className="home-main-hall__image" loading="lazy" src={imageUrl} />
          {detailImages?.length ? (
            <ul className="home-main-hall__thumbs">
              {detailImages.slice(0, 3).map((image) => (
                <li key={image.src}>
                  <img alt={image.alt} loading="lazy" src={image.src} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function HomePillars({
  locale,
  pillars,
}: {
  locale: string;
  pillars: HomePillar[];
}) {
  const isFr = locale.toLowerCase().startsWith("fr");
  const tiles = buildEngageTiles(locale, pillars);

  return (
    <section className="home-section">
      <h2>{isFr ? "Façons d’entrer dans la pratique" : "Ways to Engage"}</h2>
      <div className="home-engage-grid">
        {tiles.map((tile) => (
          <article className="home-engage-tile" key={tile.key}>
            <h3>{tile.title}</h3>
            <p>{tile.description}</p>
            <Link className="text-link" href={localizePath(locale, tile.href)}>
              {tile.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
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
  const previewCards = cards.slice(0, MAX_WHATS_ON_CARDS);

  return (
    <section className="home-section">
      <div className="link-row home-section-head">
        <h2>{isFr ? "À l’affiche" : "What's On"}</h2>
        <Link className="text-link" href={localizePath(locale, "/calendar")}>
          {isFr ? "Voir le calendrier complet" : "View full calendar"}
        </Link>
      </div>
      <ul className="calendar-group-grid">
        {previewCards.map((card) => {
          const rawOfferPath =
            getCanonicalOfferPathByTypeAndSlug(card.offer.type, card.offer.slug) || `/offer/${card.offer.slug}`;
          const offerPath = localizePath(locale, rawOfferPath);
          const primary = card.next_occurrences[0];
          const domains = (card.offer.domains ?? []).map((domain) => domain.name).join(" · ");

          return (
            <li className="card calendar-group-card" key={`${card.offer.type}-${card.offer.slug}`}>
              {card.offer.hero_image_url ? (
                <div
                  className="calendar-group-card__hero"
                  style={{
                    backgroundImage: `linear-gradient(120deg, rgba(7, 33, 33, 0.62), rgba(7, 33, 33, 0.25)), url(${card.offer.hero_image_url})`,
                  }}
                >
                  <p className="offer-type-label">{card.offer.type.replaceAll("_", " ")}</p>
                  <h2>{card.offer.title}</h2>
                </div>
              ) : (
                <>
                  <p className="offer-type-label">{card.offer.type.replaceAll("_", " ")}</p>
                  <h2>{card.offer.title}</h2>
                </>
              )}

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

function HomeDomainsTeaser({
  locale,
  domains,
}: {
  locale: string;
  domains: HomeDomain[];
}) {
  const isFr = locale.toLowerCase().startsWith("fr");
  return (
    <section className="home-section home-domains-teaser">
      <div className="link-row home-section-head">
        <h2>{isFr ? "Domaines / champs de recherche" : "Domains / Areas of Inquiry"}</h2>
        <Link className="text-link" href={localizePath(locale, "/domains")}>
          {isFr ? "Explorer tous les domaines" : "Explore all domains"}
        </Link>
      </div>
      <ul className="home-domains-teaser__list">
        {domains.slice(0, 3).map((domain) => (
          <li key={domain.slug}>{domain.name}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function HomePage() {
  const hostname = await getHostname();
  const home = await fetchHomePayload(hostname);

  if (!home) {
    return (
      <section className="page-section">
        <h1>Home</h1>
        <p>Unable to load homepage content right now.</p>
      </section>
    );
  }

  const locale = home.meta.locale || "en";
  const forestHomeMedia = getForestHomeMedia(hostname);
  const heroMediaUrl = forestHomeMedia?.hero || home.hero.media_url || home.main_hall.image_url || "";
  const mainHallImageUrl = forestHomeMedia?.mainHall || home.main_hall.image_url || "";
  const mainHallDetailImages = forestHomeMedia?.detailImages || [];
  const homeContent = (
    <section className="page-section home-page">
      <HomeHero hero={home.hero} heroMediaUrl={heroMediaUrl} locale={locale} />
      <HomeMainHall
        detailImages={mainHallDetailImages}
        imageUrl={mainHallImageUrl}
        locale={locale}
        mainHall={home.main_hall}
      />
      <HomePillars locale={locale} pillars={home.pillars} />
      <HomeWhatsOnPreview cards={home.whats_on_preview.cards} locale={locale} />
      <HomeDomainsTeaser domains={home.domains_teaser} locale={locale} />
    </section>
  );

  if (forestHomeMedia) {
    return <ForestPageShell className="forest-site-shell--home">{homeContent}</ForestPageShell>;
  }

  return homeContent;
}
