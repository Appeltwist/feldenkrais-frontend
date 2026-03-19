import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import PrivateSessionTemplate from "@/components/offers/PrivateSessionTemplate";
import { buildOfferMetadata, loadOfferRouteData } from "@/lib/offer-page";
import { getCanonicalOfferPath, getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
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

export default async function PrivateSessionDetailPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const { locale, notFound: offerNotFound, offer, siteConfig } = await loadOfferRouteData(
    slug,
    "request",
  );

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Private session</h1>
        <p>Unable to load this offer right now.</p>
      </section>
    );
  }

  if (offerNotFound || !offer) {
    notFound();
  }

  const offerType = getOfferType(offer);
  if (offerType !== "PRIVATE_SESSION") {
    const canonicalPath = getCanonicalOfferPath(offer);
    if (!canonicalPath) {
      notFound();
    }
    permanentRedirect(canonicalPath);
  }

  return <PrivateSessionTemplate offer={offer} locale={locale} />;
}
