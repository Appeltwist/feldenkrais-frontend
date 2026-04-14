import { notFound } from "next/navigation";

import PrivateBookingPanel from "@/components/private-booking/PrivateBookingPanel";
import { fetchSiteConfig } from "@/lib/api";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { isForestSite } from "@/lib/site-config";
import { fetchPrivateBookingConfig, PrivateBookingApiError } from "@/lib/private-booking-api";
import type { PrivateBookingConfig as PanelPrivateBookingConfig } from "@/lib/types";

type PrivateSessionBookingPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PrivateSessionBookingPage({ params }: PrivateSessionBookingPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = await getRequestLocale(siteConfig?.defaultLocale ?? "en");

  if (siteConfig && !isForestSite(siteConfig.centerSlug)) {
    notFound();
  }

  try {
    const config = await fetchPrivateBookingConfig(hostname, slug, locale);

    return (
      <PrivateBookingPanel
        centerSlug={siteConfig?.centerSlug ?? ""}
        hostname={hostname}
        initialConfig={config as PanelPrivateBookingConfig}
        locale={locale}
        offerSlug={config.offer_slug || slug}
      />
    );
  } catch (error) {
    if (error instanceof PrivateBookingApiError && error.status === 404) {
      notFound();
    }

    return (
      <section className="private-booking-shell">
        <div className="private-booking-header">
          <p className="private-booking-eyebrow">
            {locale.startsWith("fr") ? "Reservation privee" : "Private booking"}
          </p>
          <h1>{locale.startsWith("fr") ? "Impossible de charger cette reservation" : "Unable to load this booking page"}</h1>
          <p>
            {locale.startsWith("fr")
              ? "Le systeme de reservation n'est pas accessible pour cette offre pour le moment."
              : "The booking system is not currently available for this offer."}
          </p>
        </div>
      </section>
    );
  }
}
