import { NextResponse } from "next/server";

import { ApiError, fetchCalendar } from "@/lib/api";

function toPositiveInt(value: string | null) {
  if (!value) {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const hostname = (url.searchParams.get("hostname") ?? "").trim();
  const from = (url.searchParams.get("from") ?? "").trim();
  const to = (url.searchParams.get("to") ?? "").trim();
  const locale = (url.searchParams.get("locale") ?? "").trim();
  const center = (url.searchParams.get("center") ?? "").trim();
  const offeringId = toPositiveInt(url.searchParams.get("offering_id"));

  if (!hostname || !from || !to || offeringId === null) {
    return NextResponse.json(
      { detail: "Missing required params: hostname, from, to, offering_id." },
      { status: 400 },
    );
  }

  try {
    const payload = await fetchCalendar({
      hostname,
      center: center || undefined,
      locale: locale || undefined,
      from,
      to,
      offeringId,
    });
    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Failed to load occurrences." }, { status: 500 });
  }
}
