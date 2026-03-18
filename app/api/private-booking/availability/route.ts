import { NextResponse } from "next/server";

import { fetchPrivateBookingAvailability } from "@/lib/private-booking-api";

import { privateBookingErrorResponse } from "../_helpers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = (url.searchParams.get("locale") ?? "").trim() || "fr";
  const bookingToken = (url.searchParams.get("booking_token") ?? "").trim();
  const packageToken = (url.searchParams.get("package_token") ?? "").trim();
  const offerSlug = (url.searchParams.get("offer_slug") ?? "").trim();
  const practitionerId = (url.searchParams.get("practitioner_id") ?? "").trim();
  const packageOptionId = (url.searchParams.get("package_option_id") ?? "").trim();

  try {
    const payload = await fetchPrivateBookingAvailability(request.headers.get("host"), locale, {
      booking_token: bookingToken || undefined,
      package_token: packageToken || undefined,
      offer_slug: offerSlug || undefined,
      practitioner_id: practitionerId || undefined,
      package_option_id: packageOptionId || undefined,
    });
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return privateBookingErrorResponse(error, "Availability request failed.");
  }
}
