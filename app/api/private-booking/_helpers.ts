import { NextResponse } from "next/server";

import { PrivateBookingApiError } from "@/lib/private-booking-api";

export async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function privateBookingErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof PrivateBookingApiError) {
    return NextResponse.json(
      typeof error.payload === "string" ? { detail: error.payload } : error.payload,
      { status: error.status },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ detail: error.message || fallbackMessage }, { status: 500 });
  }

  return NextResponse.json({ detail: fallbackMessage }, { status: 500 });
}
