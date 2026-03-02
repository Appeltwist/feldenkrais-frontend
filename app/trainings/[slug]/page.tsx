import { notFound, permanentRedirect } from "next/navigation";

import TrainingInfoTemplate from "@/components/offers/TrainingInfoTemplate";
import { ApiError, fetchOfferDetail, fetchSiteConfig, type OfferDetail } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getCanonicalOfferPath, getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function TrainingDetailPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Training</h1>
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
  if (offerType !== "TRAINING_INFO") {
    const canonicalPath = getCanonicalOfferPath(offer);
    if (!canonicalPath) {
      notFound();
    }
    permanentRedirect(canonicalPath);
  }

  return <TrainingInfoTemplate offer={offer} locale={siteConfig.defaultLocale} />;
}
