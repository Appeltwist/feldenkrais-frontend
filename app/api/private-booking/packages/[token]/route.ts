import { NextResponse } from "next/server";

import { fetchPrivateBookingPackage } from "@/lib/private-booking-api";

import { privateBookingErrorResponse } from "../../_helpers";

type RouteContext = {
  params: Promise<{ token: string }> | { token: string };
};

export async function GET(request: Request, context: RouteContext) {
  const { token } = await context.params;

  try {
    const payload = await fetchPrivateBookingPackage(request.headers.get("host"), token);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return privateBookingErrorResponse(error, "Package detail request failed.");
  }
}
