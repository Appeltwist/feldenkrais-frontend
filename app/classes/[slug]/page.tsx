import { notFound, permanentRedirect } from "next/navigation";

import ClassTemplate from "@/components/offers/ClassTemplate";
import ForestOfferTemplate from "@/components/offers/ForestOfferTemplate";
import { ApiError, fetchOfferDetail, fetchSiteConfig, fetchSiteFaq, type OfferDetail } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getCanonicalOfferPath, getOfferType } from "@/lib/offers";

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
  if (offerType !== "CLASS") {
    const canonicalPath = getCanonicalOfferPath(offer);
    if (!canonicalPath) {
      notFound();
    }
    permanentRedirect(canonicalPath);
  }

  if (siteConfig.centerSlug === "forest-lighthouse") {
    const siteFaqSections = await fetchSiteFaq(hostname).catch(() => []);
    return (
      <ForestOfferTemplate
        locale={siteConfig.defaultLocale}
        offer={offer}
        offerType={offerType}
        siteFaqSections={siteFaqSections}
      />
    );
  }

  return <ClassTemplate offer={offer} locale={siteConfig.defaultLocale} />;
}
