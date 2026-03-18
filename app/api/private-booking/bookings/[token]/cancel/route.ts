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
  const locale = (url.searchParams.get("locale") ?? "").trim() || "fr";

  try {
    const response = await proxyPrivateBookingMutation(
      request.headers.get("host"),
      `/private-booking/bookings/${encodeURIComponent(token)}/cancel`,
      locale,
      payload ?? {},
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return privateBookingErrorResponse(error, "Cancellation request failed.");
  }
}
