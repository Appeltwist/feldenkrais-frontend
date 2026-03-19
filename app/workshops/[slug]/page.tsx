import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import WorkshopTemplate from "@/components/offers/WorkshopTemplate";
import { buildOfferMetadata, loadOfferRouteData } from "@/lib/offer-page";
import { getCanonicalOfferPath, getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { offer, origin, siteConfig } = await loadOfferRouteData(slug);

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
  const { locale, notFound: offerNotFound, offer, siteConfig } = await loadOfferRouteData(slug);

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Workshop</h1>
        <p>Unable to load this offer right now.</p>
      </section>
    );
  }

  if (offerNotFound || !offer) {
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

  return <WorkshopTemplate offer={offer} locale={locale} />;
}
