import { NextResponse } from "next/server";

import { proxyPrivateBookingMutation } from "@/lib/private-booking-api";

import { parseJsonBody, privateBookingErrorResponse } from "../_helpers";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const payload = await parseJsonBody(request);

  if (payload === null) {
    return NextResponse.json({ detail: "Invalid JSON payload." }, { status: 400 });
  }

  const localeFromPayload =
    typeof payload === "object" &&
    payload !== null &&
    "locale" in payload &&
    typeof payload.locale === "string"
      ? payload.locale
      : "";
  const locale = (url.searchParams.get("locale") ?? "").trim() || localeFromPayload || "fr";

  try {
    const response = await proxyPrivateBookingMutation(
      request.headers.get("host"),
      "/private-booking/book",
      locale,
      payload,
    );
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return privateBookingErrorResponse(error, "Booking request failed.");
  }
}
