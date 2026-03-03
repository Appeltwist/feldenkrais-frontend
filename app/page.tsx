import Link from "next/link";
import { headers } from "next/headers";

import { getHostname } from "@/lib/get-hostname";
import { getCanonicalOfferPathByTypeAndSlug } from "@/lib/offers";

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
  pillars: Array<{
    key: string;
    title: string;
    description: string;
    cta_label: string;
    cta_href: string;
  }>;
  whats_on_preview: {
    cards: HomeOfferCard[];
  };
  domains_teaser: HomeDomain[];
  meta: {
    locale: string;
  };
};

async function fetchHomePayload() {
  const hostname = await getHostname();
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

export default async function HomePage() {
  const home = await fetchHomePayload();

  if (!home) {
    return (
      <section className="page-section">
        <h1>Home</h1>
        <p>Unable to load homepage content right now.</p>
      </section>
    );
  }

  const locale = home.meta.locale || "en";
  const heroMediaUrl = home.hero.media_url || home.main_hall.image_url || "";

  return (
    <section className="page-section home-page">
      <section
        className="home-hero"
        style={
          heroMediaUrl
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.2)), url(${heroMediaUrl})`,
              }
            : undefined
        }
      >
        <div className="home-hero__content">
          {home.hero.headline_lines.map((line, index) => (
            <h1 key={`${line}-${index}`}>{line}</h1>
          ))}
          <p>{home.hero.subhead}</p>
          <div className="link-row">
            <Link className="button-link" href="/calendar">
              Discover What&apos;s On
            </Link>
          </div>
        </div>
      </section>

      <section className="card home-main-hall">
        <div>
          <h2>{home.main_hall.title || "Main Hall"}</h2>
          <p>{home.main_hall.body || ""}</p>
        </div>
        {home.main_hall.image_url ? (
          <img
            alt={home.main_hall.title || "Main hall"}
            className="home-main-hall__image"
            loading="lazy"
            src={home.main_hall.image_url}
          />
        ) : null}
      </section>

      <section>
        <h2>Ways to Engage</h2>
        <div className="cards home-pillars">
          {home.pillars.map((pillar) => (
            <article className="card" key={pillar.key}>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
              <Link className="text-link" href={pillar.cta_href}>
                {pillar.cta_label}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="link-row home-section-head">
          <h2>What&apos;s On</h2>
          <Link className="text-link" href="/calendar">
            View full calendar
          </Link>
        </div>
        <ul className="calendar-group-grid">
          {home.whats_on_preview.cards.map((card) => {
            const offerPath =
              getCanonicalOfferPathByTypeAndSlug(card.offer.type, card.offer.slug) || `/offer/${card.offer.slug}`;
            const primary = card.next_occurrences[0];
            const domains = (card.offer.domains ?? []).map((domain) => domain.name).join(" · ");

            return (
              <li className="card calendar-group-card" key={`${card.offer.type}-${card.offer.slug}`}>
                {card.offer.hero_image_url ? (
                  <div
                    className="calendar-group-card__hero"
                    style={{
                      backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.48), rgba(0,0,0,0.18)), url(${card.offer.hero_image_url})`,
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
                    Offer details
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

      <section className="card">
        <div className="link-row home-section-head">
          <h2>Domains / Areas of Inquiry</h2>
          <Link className="text-link" href="/calendar">
            Explore all domains
          </Link>
        </div>
        <ul className="tag-list">
          {home.domains_teaser.map((domain) => (
            <li key={domain.slug}>{domain.name}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
