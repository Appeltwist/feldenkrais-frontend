import { notFound, permanentRedirect } from "next/navigation";

import ForestOfferTemplate from "@/components/offers/ForestOfferTemplate";
import WorkshopTemplate from "@/components/offers/WorkshopTemplate";
import { ApiError, fetchOfferDetail, fetchOffers, fetchSiteConfig, fetchSiteFaq, type OfferDetail, type OfferSummary } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getCanonicalOfferPath, getDomains, getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkshopDetailPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Workshop</h1>
        <p>Unable to load this offer right now.</p>
      </section>
    );
  }

  let offer: OfferDetail | null = null;

  try {
    offer = await fetchOfferDetail({
      hostname,
      slug,
      center: siteConfig.centerSlug,
      locale: siteConfig.defaultLocale,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  if (!offer) {
    notFound();
  }

  const offerType = getOfferType(offer);
  if (offerType !== "WORKSHOP") {
    const canonicalPath = getCanonicalOfferPath(offer);
    if (!canonicalPath) {
      notFound();
    }
    permanentRedirect(canonicalPath);
  }

  if (siteConfig.centerSlug === "forest-lighthouse") {
    const [siteFaqSections, allOffers] = await Promise.all([
      fetchSiteFaq(hostname).catch(() => []),
      fetchOffers({ hostname, center: siteConfig.centerSlug, locale: siteConfig.defaultLocale }).catch(() => [] as OfferSummary[]),
    ]);

    const currentDomainSlugs = new Set(getDomains(offer).map((d) => String(d.id)));
    const relatedOffers = allOffers.filter((o) => {
      if (String(o.slug) === slug) return false;
      const oDomains = Array.isArray(o.domains)
        ? (o.domains as Array<{ slug?: string }>)
        : [];
      return oDomains.some((d) => d.slug && currentDomainSlugs.has(d.slug));
    });

    return (
      <ForestOfferTemplate
        locale={siteConfig.defaultLocale}
        offer={offer}
        offerType={offerType}
        relatedOffers={relatedOffers}
        siteFaqSections={siteFaqSections}
      />
    );
  }

  return <WorkshopTemplate offer={offer} locale={siteConfig.defaultLocale} />;
}
