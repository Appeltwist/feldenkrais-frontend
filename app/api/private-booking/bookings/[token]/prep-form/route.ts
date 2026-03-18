import { NextResponse } from "next/server";

import { proxyPrivateBookingMutation } from "@/lib/private-booking-api";

import { parseJsonBody, privateBookingErrorResponse } from "../../../_helpers";

type RouteContext = {
  params: Promise<{ token: string }> | { token: string };
};

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  const url = new URL(request.url);
  const payload = await parseJsonBody(request);

  if (payload === null) {
    return NextResponse.json({ detail: "Invalid JSON payload." }, { status: 400 });
  }

  const locale = (url.searchParams.get("locale") ?? "").trim() || "fr";

  try {
    const response = await proxyPrivateBookingMutation(
      request.headers.get("host"),
      `/private-booking/bookings/${encodeURIComponent(token)}/prep-form`,
      locale,
      payload,
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return privateBookingErrorResponse(error, "Prep form request failed.");
  }
}
