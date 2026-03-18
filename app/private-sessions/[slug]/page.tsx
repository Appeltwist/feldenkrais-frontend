import { notFound, permanentRedirect } from "next/navigation";

import PrivateSessionTemplate from "@/components/offers/PrivateSessionTemplate";
import { ApiError, fetchOfferDetail, fetchSiteConfig, type OfferDetail } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getCanonicalOfferPath, getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PrivateSessionDetailPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "fr");

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Private session</h1>
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
      locale,
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
  if (offerType !== "PRIVATE_SESSION") {
    const canonicalPath = getCanonicalOfferPath(offer);
    if (!canonicalPath) {
      notFound();
    }
    permanentRedirect(canonicalPath);
  }

  return <PrivateSessionTemplate offer={offer} locale={locale} />;
}
