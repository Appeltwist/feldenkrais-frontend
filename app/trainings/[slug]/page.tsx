import { notFound, permanentRedirect } from "next/navigation";

import LocaleSwitchSync from "@/components/LocaleSwitchSync";
import ForestOfferTemplate from "@/components/offers/ForestOfferTemplate";
import TrainingInfoTemplate from "@/components/offers/TrainingInfoTemplate";
import { ApiError, fetchOfferDetail, fetchSiteConfig, fetchSiteFaq, type OfferDetail } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { buildOfferLocaleSwitchPaths } from "@/lib/offer-locale-paths";
import { getCanonicalOfferPath, getOfferType } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }>;
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
  if (offerType !== "TRAINING_INFO") {
    const canonicalPath = getCanonicalOfferPath(offer);
    if (!canonicalPath) {
      notFound();
    }
    permanentRedirect(canonicalPath);
  }

  if (siteConfig.centerSlug === "forest-lighthouse") {
    const [siteFaqSections, localeSwitchPaths] = await Promise.all([
      fetchSiteFaq(hostname).catch(() => []),
      buildOfferLocaleSwitchPaths({
        hostname,
        centerSlug: siteConfig.centerSlug,
        offer,
        requestLocale,
      }),
    ]);
    return (
      <>
        <LocaleSwitchSync paths={localeSwitchPaths} />
        <ForestOfferTemplate
          locale={requestLocale}
          offer={offer}
          offerType={offerType}
          siteFaqSections={siteFaqSections}
        />
      </>
    );
  }

  return <TrainingInfoTemplate offer={offer} locale={requestLocale} />;
}
