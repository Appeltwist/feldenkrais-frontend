import { NextResponse } from "next/server";

import { getRequiredApiBase } from "@/lib/server-env";

// Same-origin proxy used by lead magnets and offer pages to download PDFs from Django.
const API_BASE = getRequiredApiBase();

function normalizeHostname(hostname: string) {
  const cleaned = hostname.trim().toLowerCase().replace(/^https?:\/\//, "");
  const firstPart = cleaned.split("/")[0] ?? cleaned;
  const firstHost = firstPart.split(",")[0]?.trim() ?? firstPart;
  return firstHost.replace(/:\d+$/, "");
}

type RouteContext = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const hostname = normalizeHostname(url.searchParams.get("hostname") ?? "");
  const locale = (url.searchParams.get("locale") ?? "").trim();
  const center = (url.searchParams.get("center") ?? "").trim();

  if (!hostname) {
    return NextResponse.json({ detail: "Missing required query param: hostname." }, { status: 400 });
  }

  const backendUrl = new URL(`${API_BASE}/offers/${encodeURIComponent(slug)}/pdf`);
  backendUrl.searchParams.set("domain", hostname);
  if (locale) {
    backendUrl.searchParams.set("locale", locale);
  }
  if (center) {
    backendUrl.searchParams.set("center", center);
  }

  const backendResponse = await fetch(backendUrl.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    const contentType = backendResponse.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await backendResponse.json();
      return NextResponse.json(body, { status: backendResponse.status });
    }
    const textBody = await backendResponse.text();
    return NextResponse.json({ detail: textBody || "PDF request failed." }, { status: backendResponse.status });
  }

  const content = await backendResponse.arrayBuffer();
  const contentType = backendResponse.headers.get("content-type") || "application/pdf";
  const contentDisposition =
    backendResponse.headers.get("content-disposition") || `attachment; filename="${slug}.pdf"`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
      "Cache-Control": "no-store",
    },
  });
}
