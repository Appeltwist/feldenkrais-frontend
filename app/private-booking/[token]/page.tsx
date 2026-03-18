import { notFound } from "next/navigation";

import PrivateBookingManagePage from "@/components/private-booking/PrivateBookingManagePage";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import type { PrivateBookingPageEntity } from "@/lib/private-booking";
import {
  fetchPrivateBookingConfig,
  fetchPrivateBookingDetail,
  fetchPrivateBookingPackage,
  PrivateBookingApiError,
} from "@/lib/private-booking-api";

type PrivateBookingTokenPageProps = {
  params: Promise<{ token: string }> | { token: string };
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
};

function readSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function PrivateBookingTokenPage({
  params,
  searchParams,
}: PrivateBookingTokenPageProps) {
  const { token } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const hostname = await getHostname();
  const locale = await getRequestLocale("fr");
  const notice = readSingleValue(resolvedSearchParams.status);

  let entity: PrivateBookingPageEntity | null = null;

  try {
    const booking = await fetchPrivateBookingDetail(hostname, token);
    entity = {
      kind: "booking",
      booking,
      package: booking.package ?? null,
    };
  } catch (error) {
    if (!(error instanceof PrivateBookingApiError) || error.status !== 404) {
      throw error;
    }
  }

  if (!entity) {
    try {
      const packageSummary = await fetchPrivateBookingPackage(hostname, token);
      entity = {
        kind: "package",
        booking: null,
        package: packageSummary,
      };
    } catch (error) {
      if (error instanceof PrivateBookingApiError && error.status === 404) {
        notFound();
      }
      throw error;
    }
  }

  const packageToken =
    entity.kind === "booking" ? entity.booking.package_token ?? entity.package?.token ?? undefined : entity.package.token;

  try {
    const config = await fetchPrivateBookingConfig(
      hostname,
      entity.kind === "booking" ? entity.booking.offer_slug : entity.package.offer_slug,
      locale,
      packageToken,
    );

    return <PrivateBookingManagePage config={config} initialEntity={entity} locale={locale} notice={notice} />;
  } catch (error) {
    if (error instanceof PrivateBookingApiError && error.status === 404) {
      notFound();
    }

    return (
      <section className="private-booking-shell">
        <div className="private-booking-header">
          <p className="private-booking-eyebrow">
            {locale.startsWith("fr") ? "Gestion de reservation" : "Booking management"}
          </p>
          <h1>{locale.startsWith("fr") ? "Impossible de charger cette reservation" : "Unable to load this booking"}</h1>
          <p>
            {locale.startsWith("fr")
              ? "Le detail de reservation est actuellement indisponible."
              : "The booking details are currently unavailable."}
          </p>
        </div>
      </section>
    );
  }
}
