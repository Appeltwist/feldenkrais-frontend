import { notFound } from "next/navigation";

import ClassTemplate from "@/components/offers/ClassTemplate";
import PrivateSessionTemplate from "@/components/offers/PrivateSessionTemplate";
import TrainingInfoTemplate from "@/components/offers/TrainingInfoTemplate";
import WorkshopTemplate from "@/components/offers/WorkshopTemplate";
import { ApiError, fetchOfferDetail, fetchSiteConfig, type OfferDetail } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function OfferPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  let siteConfig: Awaited<ReturnType<typeof fetchSiteConfig>> | null = null;

  try {
    siteConfig = await fetchSiteConfig(hostname);
  } catch {
    return (
      <section className="page-section">
        <h1>Offer</h1>
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
  const locale = siteConfig.defaultLocale;

  if (offerType === "CLASS") {
    return <ClassTemplate offer={offer} locale={locale} />;
  }

  if (offerType === "PRIVATE_SESSION") {
    return <PrivateSessionTemplate offer={offer} locale={locale} />;
  }

  if (offerType === "TRAINING_INFO") {
    return <TrainingInfoTemplate offer={offer} locale={locale} />;
  }

  return <WorkshopTemplate offer={offer} locale={locale} />;
}
