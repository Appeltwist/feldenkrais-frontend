import { NextResponse } from "next/server";

import { rewriteForestMediaPayload } from "@/lib/forest-media";
import { resolveApiHostname } from "@/lib/hostname-routing";
import { getRequiredApiBase } from "@/lib/server-env";
import { resolveHostname } from "@/lib/server-hostname";

const API_BASE = getRequiredApiBase();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const hostname = resolveApiHostname(resolveHostname(url.searchParams.get("hostname") ?? ""));
  const locale = (url.searchParams.get("locale") ?? "").trim();
  const from = (url.searchParams.get("from") ?? "").trim();
  const to = (url.searchParams.get("to") ?? "").trim();
  const limit = (url.searchParams.get("limit") ?? "").trim();

  if (!hostname) {
    return NextResponse.json({ detail: "Missing required query param: hostname." }, { status: 400 });
  }

  const backendUrl = new URL(`${API_BASE}/home`);
  backendUrl.searchParams.set("domain", hostname);
  if (locale) {
    backendUrl.searchParams.set("locale", locale);
  }
  if (from) {
    backendUrl.searchParams.set("from", from);
  }
  if (to) {
    backendUrl.searchParams.set("to", to);
  }
  if (limit) {
    backendUrl.searchParams.set("limit", limit);
  }

  const backendResponse = await fetch(backendUrl.toString(), {
    method: "GET",
    cache: "no-store",
  });

  const contentType = backendResponse.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await backendResponse.json();
    const rewrittenBody = hostname.includes("forest-lighthouse") ? rewriteForestMediaPayload(body) : body;
    return NextResponse.json(rewrittenBody, { status: backendResponse.status });
  }

  const textBody = await backendResponse.text();
  return NextResponse.json({ detail: textBody || "Home request failed." }, { status: backendResponse.status });
}
