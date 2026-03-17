import { notFound, permanentRedirect } from "next/navigation";

import { ApiError, fetchOfferDetail, fetchSiteConfig, type OfferDetail } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { getCanonicalOfferPath } from "@/lib/offers";

type OfferPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OfferLegacyRedirectPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Offer</h1>
        <p>Unable to load this offer right now.</p>
      </section>
    );
  }

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);

  let offer: OfferDetail | null = null;
  let locale = requestLocale;

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
          locale = siteConfig.defaultLocale;
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

  const canonicalPath = getCanonicalOfferPath(offer);
  if (!canonicalPath) {
    notFound();
  }

  permanentRedirect(canonicalPath);
}
