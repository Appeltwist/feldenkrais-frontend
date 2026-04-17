import Link from "next/link";
import { redirect } from "next/navigation";

import EducationContentPage from "@/components/education/EducationContentPage";
import EducationDomainsArchivePage from "@/components/education/EducationDomainsArchivePage";
import { ForestPageShell } from "@/components/forest/ForestPageShell";
import RevealObserver from "@/components/motion/RevealObserver";
import { fetchSiteConfig } from "@/lib/api";
import { getEducationDomainArchive } from "@/lib/education-domains";
import { resolveEducationNarrativePage } from "@/lib/education-page";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { resolveApiHostname } from "@/lib/hostname-routing";
import { isForestCenter } from "@/lib/forest-theme";
import { getCanonicalOfferPathByTypeAndSlug } from "@/lib/offers";
import { localizePath } from "@/lib/locale-path";
import { getRequiredApiBase } from "@/lib/server-env";

type DomainPreviewCard = {
  offer: {
    type: string;
    title: string;
    slug: string;
  };
  cta_label: string;
  next_occurrences: Array<{
    id: number;
    start_datetime: string;
    timezone: string;
  }>;
};

type DomainsPayload = {
  page: {
    title: string;
    intro: string;
  };
  domains: Array<{
    slug: string;
    name: string;
    intro: string;
    body: string;
    links: {
      calendar: string;
      programs: string;
    };
    preview: DomainPreviewCard[];
  }>;
};

const API_BASE = getRequiredApiBase();

async function fetchDomainsPayload(hostname: string, locale: string) {
  const url = new URL(`${API_BASE}/domains`);
  url.searchParams.set("domain", resolveApiHostname(hostname));
  url.searchParams.set("include_previews", "1");
  url.searchParams.set("preview_limit", "10");
  if (locale) {
    url.searchParams.set("locale", locale);
  }

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as DomainsPayload;
}

function formatOccurrence(value: string, locale: string, timezone?: string) {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const formatted = new Intl.DateTimeFormat(locale || "en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || undefined,
  }).format(parsed);
  return timezone ? `${formatted} (${timezone})` : formatted;
}

export default async function DomainsPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale("en");
  const siteConfig = await fetchSiteConfig(hostname, locale).catch(() => null);
  const payload = await fetchDomainsPayload(hostname, locale);

  const isForest = Boolean(siteConfig && isForestCenter(siteConfig.centerSlug));

  if (!isForest && siteConfig?.siteSlug === "feldenkrais-education") {
    redirect(localizePath(locale, "/what-is-feldenkrais#12domains"));
  }

  if (!isForest && siteConfig?.siteSlug === "feldenkrais-education") {
    const archiveEntries = getEducationDomainArchive(locale);
    if (archiveEntries.length > 0) {
      const page = await resolveEducationNarrativePage(hostname, "domains", locale);
      return (
        <EducationDomainsArchivePage
          entries={archiveEntries}
          locale={locale}
          page={
            page ?? {
              routeKey: "domains",
              locale,
              title: payload?.page.title || "Domains of inquiry",
              subtitle:
                payload?.page.intro ||
                "Thematic entry points to explore how the Feldenkrais Method meets different needs, practices, and contexts.",
              hero: {
                title: payload?.page.title || "Domains of inquiry",
                body:
                  payload?.page.intro ||
                  "Thematic entry points to explore how the Feldenkrais Method meets different needs, practices, and contexts.",
                imageUrl: null,
              },
              sections: [],
              primaryCta: null,
            }
          }
        />
      );
    }
  }

  if (!payload) {
    return (
      <section className="page-section">
        <h1>Domains</h1>
        <p>Unable to load domains right now.</p>
      </section>
    );
  }

  if (isForest) {
    const isFr = locale.toLowerCase().startsWith("fr");
    const activeDomains = payload.domains.filter((d) => d.name && d.name.trim());

    return (
      <ForestPageShell className="forest-site-shell--domains">
        <div className="page-section forest-domains-page" id="domains-motion">
          <RevealObserver scopeId="domains-motion" />

          <div data-reveal="section">
            <section className="fc-intro">
              <p className="fc-intro__eyebrow">{isFr ? "Aires de recherche" : "Areas of inquiry"}</p>
              <h1 className="fc-intro__title">{payload.page.title}</h1>
              <p className="fc-intro__subtitle">{payload.page.intro}</p>
            </section>
          </div>

          <div className="forest-domains-grid" data-reveal="stagger">
            {activeDomains.map((domain) => {
              const hasOffers = Array.isArray(domain.preview) && domain.preview.length > 0;

              return (
                <article className="forest-domain-card" key={domain.slug}>
                  <h2 className="forest-domain-card__name">{domain.name}</h2>
                  {domain.intro ? (
                    <p className="forest-domain-card__intro">{domain.intro}</p>
                  ) : null}

                  {hasOffers ? (
                    <>
                      <div className="forest-domain-card__divider" />
                      <ul className="forest-domain-card__offers">
                        {domain.preview.map((card) => {
                          const detailsPath =
                            getCanonicalOfferPathByTypeAndSlug(card.offer.type, card.offer.slug) ||
                            `/offer/${card.offer.slug}`;
                          const localizedDetailsPath = localizePath(locale, detailsPath);

                          return (
                            <li key={`${domain.slug}-${card.offer.slug}`}>
                              <Link className="forest-domain-card__offer" href={localizedDetailsPath}>
                                <span className="forest-domain-card__offer-type" data-type={card.offer.type.replaceAll("_", " ").toLowerCase()}>
                                  {card.offer.type.replaceAll("_", " ")}
                                </span>
                                <span className="forest-domain-card__offer-title">{card.offer.title}</span>
                                <span className="forest-domain-card__offer-arrow" aria-hidden="true">→</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : null}

                  <Link className="forest-domain-card__explore" href={localizePath(locale, domain.links.programs)}>
                    {isFr ? "Explorer" : "Explore"} <span aria-hidden="true">→</span>
                  </Link>
                </article>
              );
            })}
          </div>

          <div data-reveal="section">
            <section className="forest-domains-cta forest-panel">
              <p className="forest-page-section__eyebrow">{isFr ? "Prochaines sessions" : "Upcoming sessions"}</p>
              <h2 className="forest-page-section__title">{isFr ? "Voir le calendrier complet" : "See the full calendar"}</h2>
              <div className="forest-page-hero__actions">
                <Link className="fl-btn" href={localizePath(locale, "/calendar")}>
                  {isFr ? "Calendrier" : "Calendar"}
                </Link>
                <Link className="fl-btn fl-btn--secondary" href={localizePath(locale, "/workshops")}>
                  {isFr ? "Tous les programmes" : "All programs"}
                </Link>
              </div>
            </section>
          </div>
        </div>
      </ForestPageShell>
    );
  }

  const page = await resolveEducationNarrativePage(hostname, "domains", locale);

  return (
    <EducationContentPage
      eyebrow={locale.toLowerCase().startsWith("fr") ? "Domaines" : "Domains"}
      page={
        page ?? {
          routeKey: "domains",
          locale,
          title: payload.page.title,
          subtitle: payload.page.intro,
          hero: {
            title: payload.page.title,
            body: payload.page.intro,
            imageUrl: null,
          },
          sections: [],
          primaryCta: null,
        }
      }
    >
      <section className="domains-page">
        {payload.domains.map((domain, index) => (
          <section className="education-card domains-room" key={domain.slug}>
            <p className="domains-room__eyebrow">Area {index + 1}</p>
            <h2>{domain.name}</h2>
            {domain.intro ? <p className="domains-room__intro">{domain.intro}</p> : null}
            {domain.body ? <p>{domain.body}</p> : null}

            {Array.isArray(domain.preview) && domain.preview.length > 0 ? (
              <div className="domains-room__preview">
                {domain.preview.map((card) => {
                  const rawDetailsPath =
                    getCanonicalOfferPathByTypeAndSlug(card.offer.type, card.offer.slug) || `/offer/${card.offer.slug}`;
                  const detailsPath = localizePath(locale, rawDetailsPath);
                  const primaryOccurrence = card.next_occurrences?.[0];

                  return (
                    <article
                      className="education-card education-offer-card education-offer-card--compact domains-room__preview-card"
                      key={`${domain.slug}-${card.offer.slug}`}
                    >
                      <div className="education-offer-card__body">
                        <p className="education-offer-card__type">{card.offer.type.replaceAll("_", " ")}</p>
                        <h3>{card.offer.title}</h3>
                        {primaryOccurrence ? (
                          <p className="domains-room__preview-time">
                            {formatOccurrence(
                              primaryOccurrence.start_datetime,
                              locale,
                              primaryOccurrence.timezone,
                            )}
                          </p>
                        ) : null}
                        <div className="link-row">
                          <Link className="education-text-link" href={detailsPath}>
                            Offer details
                          </Link>
                          <Link className="education-button education-button--secondary" href={detailsPath}>
                            {card.cta_label || "Book"}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}

            <div className="link-row domains-room__links">
              <Link className="education-text-link" href={localizePath(locale, domain.links.calendar)}>
                See what&apos;s on
              </Link>
              <Link className="education-text-link" href={localizePath(locale, domain.links.programs)}>
                Explore programs
              </Link>
            </div>
          </section>
        ))}
      </section>
    </EducationContentPage>
  );
}
