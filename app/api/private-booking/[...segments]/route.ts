import { NextResponse } from "next/server";

import { rewriteForestMediaPayload } from "@/lib/forest-media";
import { getRequiredApiBase } from "@/lib/server-env";
import { resolveHostname } from "@/lib/server-hostname";

const API_BASE = getRequiredApiBase();

async function proxy(request: Request, segments: string[]) {
  const url = new URL(request.url);
  const hostname = resolveHostname(url.searchParams.get("hostname") ?? "");
  const center = (url.searchParams.get("center") ?? "").trim();
  const locale = (url.searchParams.get("locale") ?? "").trim();

  if (!hostname) {
    return NextResponse.json({ detail: "Missing required query param: hostname." }, { status: 400 });
  }

  const backendUrl = new URL(`${API_BASE}/private-booking/${segments.join("/")}`);
  backendUrl.searchParams.set("domain", hostname);
  if (center) {
    backendUrl.searchParams.set("center", center);
  }
  if (locale) {
    backendUrl.searchParams.set("locale", locale);
  }

  for (const [key, value] of url.searchParams.entries()) {
    if (key === "hostname" || key === "center" || key === "locale") {
      continue;
    }
    backendUrl.searchParams.append(key, value);
  }

  const init: RequestInit = {
    method: request.method,
    cache: "no-store",
    headers: {},
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.headers = {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
    };
    init.body = await request.text();
  }

  const backendResponse = await fetch(backendUrl.toString(), init);
  const contentType = backendResponse.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await backendResponse.json();
    const rewrittenBody = hostname.includes("forest-lighthouse") ? rewriteForestMediaPayload(body) : body;
    return NextResponse.json(rewrittenBody, { status: backendResponse.status });
  }

  const textBody = await backendResponse.text();
  return NextResponse.json({ detail: textBody || "Private booking request failed." }, { status: backendResponse.status });
}

type RouteContext = {
  params: Promise<{ segments: string[] }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { segments } = await context.params;
  return proxy(request, segments);
}

export async function POST(request: Request, context: RouteContext) {
  const { segments } = await context.params;
  return proxy(request, segments);
}
