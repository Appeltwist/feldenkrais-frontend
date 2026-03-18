import { notFound } from "next/navigation";

import PrivateBookingForm from "@/components/private-booking/PrivateBookingForm";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { fetchPrivateBookingConfig, PrivateBookingApiError } from "@/lib/private-booking-api";

type PrivateSessionBookingPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function PrivateSessionBookingPage({ params }: PrivateSessionBookingPageProps) {
  const { slug } = await params;
  const hostname = await getHostname();
  const locale = await getRequestLocale("fr");

  try {
    const config = await fetchPrivateBookingConfig(hostname, slug, locale);

    return <PrivateBookingForm config={config} locale={locale} />;
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
