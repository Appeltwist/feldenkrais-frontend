import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import LocaleSwitchSync from "@/components/LocaleSwitchSync";
import ForestOfferTemplate from "@/components/offers/ForestOfferTemplate";
import WorkshopTemplate from "@/components/offers/WorkshopTemplate";
import { ApiError, fetchOfferDetail, fetchOffers, fetchSiteConfig, fetchSiteFaq, type OfferDetail, type OfferSummary } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getEducationAtelierIntroContent, getEducationIntroWorkshopBySlug } from "@/lib/education-workshops";
import { localizePath } from "@/lib/locale-path";
import { buildOfferMetadata, loadOfferRouteData } from "@/lib/offer-page";
import { buildOfferLocaleSwitchPaths } from "@/lib/offer-locale-paths";
import { getCanonicalOfferPath, getDomains, getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hostname = await getHostname();
  const requestSiteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const requestLocale = await getRequestLocale(requestSiteConfig?.defaultLocale || "en");
  const introWorkshop =
    requestSiteConfig?.siteSlug === "feldenkrais-education"
      ? getEducationIntroWorkshopBySlug(requestLocale, slug)
      : null;

  if (introWorkshop) {
    const atelierIntro = getEducationAtelierIntroContent(requestLocale);
    return {
      title: atelierIntro.page.seo?.title || atelierIntro.page.title,
      description: atelierIntro.page.seo?.description || atelierIntro.page.subtitle || atelierIntro.lead,
    };
  }

  const { offer, origin, siteConfig } = await loadOfferRouteData(slug, "request");

  if (!offer) {
    return {};
  }

  return buildOfferMetadata({
    offer,
    origin,
    siteName: siteConfig?.siteName,
  });
}

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

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);
  const introWorkshop =
    siteConfig.siteSlug === "feldenkrais-education"
      ? getEducationIntroWorkshopBySlug(requestLocale, slug)
      : null;

  if (introWorkshop) {
    permanentRedirect(localizePath(requestLocale, "/atelier_intro"));
  }

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
  if (offerType !== "WORKSHOP") {
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

  return <WorkshopTemplate offer={offer} locale={requestLocale} />;
}
