import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { ForestPageShell } from "@/components/forest/ForestPageShell";
import PrivateBookingPanel from "@/components/private-booking/PrivateBookingPanel";
import { ApiError, fetchOfferDetail, fetchPrivateBookingConfig, fetchSiteConfig, type OfferDetail } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getPrivateBookingLabels } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";
import { getCanonicalOfferPath, getOfferTitle, getOfferType } from "@/lib/offers";

type PrivateBookingEntryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PrivateBookingEntryPage({ params }: PrivateBookingEntryPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);

  if (!siteConfig) {
    return (
      <section className="page-section">
        <h1>Private booking</h1>
        <p>Unable to load booking details right now.</p>
      </section>
    );
  }

  const requestLocale = await getRequestLocale(siteConfig.defaultLocale);
  const labels = getPrivateBookingLabels(requestLocale);

  let offer: OfferDetail | null = null;

  try {
    offer = await fetchOfferDetail({
      hostname,
      slug,
      center: siteConfig.centerSlug,
      locale: requestLocale,
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

  if (siteConfig.centerSlug !== "forest-lighthouse") {
    permanentRedirect(localizePath(requestLocale, `/private-sessions/${offer.slug ?? slug}`));
  }

  const title = getOfferTitle(offer);
  const returnHref = localizePath(requestLocale, `/private-sessions/${offer.slug ?? slug}`);
  const bookingConfig = await fetchPrivateBookingConfig({
    hostname,
    center: siteConfig.centerSlug,
    slug: offer.slug ?? slug,
    locale: requestLocale,
  }).catch(() => null);
  const pageDescription = bookingConfig?.requires_intro_call
    ? labels.pageDescriptionIntro
    : labels.pageDescriptionStandard;

  return (
    <>
      <ForestPageShell className="forest-site-shell--booking">
        <section className="forest-booking-entry">
          <div className="forest-booking-entry__intro">
            <div className="forest-booking-entry__toolbar">
              <Link className="forest-booking-entry__back" href={returnHref}>
                ← {labels.backToSession}
              </Link>
            </div>
            <h1 className="forest-booking-entry__title">{title}</h1>
            <p className="forest-booking-entry__description">{pageDescription}</p>
          </div>

          <PrivateBookingPanel
            centerSlug={siteConfig.centerSlug}
            hostname={hostname}
            initialConfig={bookingConfig}
            locale={requestLocale}
            mode="page"
            offerSlug={offer.slug ?? slug}
          />
        </section>
      </ForestPageShell>
    </>
  );
}
