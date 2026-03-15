import { NextResponse } from "next/server";

import { getRequiredApiBase } from "@/lib/server-env";

const API_BASE = getRequiredApiBase();

function normalizeHostname(hostname: string) {
  const cleaned = hostname.trim().toLowerCase().replace(/^https?:\/\//, "");
  const firstPart = cleaned.split("/")[0] ?? cleaned;
  const firstHost = firstPart.split(",")[0]?.trim() ?? firstPart;
  return firstHost.replace(/:\d+$/, "");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const hostname = normalizeHostname(url.searchParams.get("hostname") ?? "");
  const locale = (url.searchParams.get("locale") ?? "").trim();
  const includePreviews = (url.searchParams.get("include_previews") ?? "").trim();
  const previewLimit = (url.searchParams.get("preview_limit") ?? "").trim();
  const from = (url.searchParams.get("from") ?? "").trim();
  const to = (url.searchParams.get("to") ?? "").trim();

  if (!hostname) {
    return NextResponse.json({ detail: "Missing required query param: hostname." }, { status: 400 });
  }

  const backendUrl = new URL(`${API_BASE}/domains`);
  backendUrl.searchParams.set("domain", hostname);
  if (locale) {
    backendUrl.searchParams.set("locale", locale);
  }
  if (includePreviews) {
    backendUrl.searchParams.set("include_previews", includePreviews);
  }
  if (previewLimit) {
    backendUrl.searchParams.set("preview_limit", previewLimit);
  }
  if (from) {
    backendUrl.searchParams.set("from", from);
  }
  if (to) {
    backendUrl.searchParams.set("to", to);
  }

  const backendResponse = await fetch(backendUrl.toString(), {
    method: "GET",
    cache: "no-store",
  });

  const contentType = backendResponse.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await backendResponse.json();
    return NextResponse.json(body, { status: backendResponse.status });
  }

  const textBody = await backendResponse.text();
  return NextResponse.json({ detail: textBody || "Domains request failed." }, { status: backendResponse.status });
}
