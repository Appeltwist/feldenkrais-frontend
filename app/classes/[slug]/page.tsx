import { notFound, permanentRedirect } from "next/navigation";

import LocaleSwitchSync from "@/components/LocaleSwitchSync";
import ClassTemplate from "@/components/offers/ClassTemplate";
import ForestOfferTemplate from "@/components/offers/ForestOfferTemplate";
import { ApiError, fetchOfferDetail, fetchOffers, fetchSiteConfig, fetchSiteFaq, type OfferDetail, type OfferSummary } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { buildOfferLocaleSwitchPaths } from "@/lib/offer-locale-paths";
import { getCanonicalOfferPath, getDomains, getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ClassDetailPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Class</h1>
        <p>Unable to load this offer right now.</p>
      </section>
    );
  }

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);

  let offer: OfferDetail | null = null;
  let contentLocale = requestLocale;

  try {
    offer = await fetchOfferDetail({
      hostname,
      slug,
      center: siteConfig.centerSlug,
      locale: requestLocale,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      if (requestLocale !== siteConfig.defaultLocale) {
        try {
          offer = await fetchOfferDetail({
            hostname,
            slug,
            center: siteConfig.centerSlug,
            locale: siteConfig.defaultLocale,
          });
          contentLocale = siteConfig.defaultLocale;
        } catch (retryError) {
          if (retryError instanceof ApiError && retryError.status === 404) {
            notFound();
          }
          throw retryError;
        }
      } else {
        notFound();
      }
    } else {
      throw error;
    }
  }

  if (!offer) {
    notFound();
  }

  const offerType = getOfferType(offer);
  if (offerType !== "CLASS") {
    const canonicalPath = getCanonicalOfferPath(offer);
    if (!canonicalPath) {
      notFound();
    }
    permanentRedirect(canonicalPath);
  }

  if (siteConfig.centerSlug === "forest-lighthouse") {
    const [siteFaqSections, allOffers, localeSwitchPaths] = await Promise.all([
      fetchSiteFaq(hostname, requestLocale).catch(() => []),
      fetchOffers({ hostname, center: siteConfig.centerSlug, locale: contentLocale }).catch(() => [] as OfferSummary[]),
      buildOfferLocaleSwitchPaths({
        hostname,
        centerSlug: siteConfig.centerSlug,
        offer,
        requestLocale,
      }),
    ]);

    const currentDomainSlugs = new Set(getDomains(offer).map((d) => String(d.id)));
    const otherOffers = allOffers.filter((o) => String(o.slug) !== slug);
    const domainMatched = otherOffers.filter((o) => {
      const oDomains = Array.isArray(o.domains)
        ? (o.domains as Array<{ slug?: string }>)
        : [];
      return oDomains.some((d) => d.slug && currentDomainSlugs.has(d.slug));
    });
    const relatedOffers = domainMatched.length > 0 ? domainMatched : otherOffers;

    return (
      <>
        <LocaleSwitchSync paths={localeSwitchPaths} />
        <ForestOfferTemplate
          locale={requestLocale}
          offer={offer}
          offerType={offerType}
          relatedOffers={relatedOffers}
          siteFaqSections={siteFaqSections}
        />
      </>
    );
  }

  return <ClassTemplate offer={offer} locale={requestLocale} />;
}
