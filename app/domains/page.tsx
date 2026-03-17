import Link from "next/link";

import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { resolveApiHostname } from "@/lib/hostname-routing";
import { getCanonicalOfferPathByTypeAndSlug } from "@/lib/offers";

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

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api").replace(/\/+$/, "");

async function fetchDomainsPayload(hostname: string, locale: string) {
  const url = new URL(`${API_BASE}/domains`);
  url.searchParams.set("domain", resolveApiHostname(hostname));
  url.searchParams.set("include_previews", "1");
  url.searchParams.set("preview_limit", "3");
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
  const locale = await getRequestLocale();
  const payload = await fetchDomainsPayload(hostname, locale);

  if (!payload) {
    return (
      <section className="page-section">
        <h1>Domains</h1>
        <p>Unable to load domains right now.</p>
      </section>
    );
  }

  return (
    <section className="page-section domains-page">
      <header className="domains-page__header">
        <h1>{payload.page.title}</h1>
        <p>{payload.page.intro}</p>
      </header>

      {payload.domains.map((domain, index) => (
        <section className="card domains-room" key={domain.slug}>
          <p className="domains-room__eyebrow">Area {index + 1}</p>
          <h2>{domain.name}</h2>
          {domain.intro ? <p className="domains-room__intro">{domain.intro}</p> : null}
          {domain.body ? <p>{domain.body}</p> : null}

          {Array.isArray(domain.preview) && domain.preview.length > 0 ? (
            <div className="domains-room__preview">
              {domain.preview.map((card) => {
                const detailsPath =
                  getCanonicalOfferPathByTypeAndSlug(card.offer.type, card.offer.slug) || `/offer/${card.offer.slug}`;
                const primaryOccurrence = card.next_occurrences?.[0];

                return (
                  <article className="card domains-room__preview-card" key={`${domain.slug}-${card.offer.slug}`}>
                    <p className="offer-type-label">{card.offer.type.replaceAll("_", " ")}</p>
                    <h3>{card.offer.title}</h3>
                    {primaryOccurrence ? (
                      <p className="domains-room__preview-time">
                        {formatOccurrence(primaryOccurrence.start_datetime, locale, primaryOccurrence.timezone)}
                      </p>
                    ) : null}
                    <div className="link-row">
                      <Link className="text-link" href={detailsPath}>
                        Offer details
                      </Link>
                      <Link className="button-link button-link--secondary" href={detailsPath}>
                        {card.cta_label || "Book"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          <div className="link-row domains-room__links">
            <Link className="text-link" href={domain.links.calendar}>
              See what&apos;s on
            </Link>
            <Link className="text-link" href={domain.links.programs}>
              Explore programs
            </Link>
          </div>
        </section>
      ))}
    </section>
  );
}
