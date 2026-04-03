import { NextResponse } from "next/server";

import { getBackendNewsletterUrl, rewriteNewsletterHtmlOrigins } from "@/lib/newsletter-html";

type NewsletterDetailRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: NewsletterDetailRouteContext) {
  const { slug } = await context.params;
  const backendResponse = await fetch(
    getBackendNewsletterUrl(request.headers.get("x-locale"), slug),
    {
      method: "GET",
      cache: "no-store",
      headers: {
        accept: "text/html",
      },
    },
  );

  const html = await backendResponse.text();
  const requestOrigin = new URL(request.url).origin;

  return new NextResponse(rewriteNewsletterHtmlOrigins(html, requestOrigin), {
    status: backendResponse.status,
    headers: {
      "content-type": backendResponse.headers.get("content-type") ?? "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
