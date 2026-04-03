import "server-only";

import { getRequiredApiBase } from "@/lib/server-env";

const API_BASE = getRequiredApiBase();
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

function normalizeLocale(value: string | null) {
  return value === "fr" ? "fr" : "en";
}

export function getBackendNewsletterUrl(localeHeader: string | null, slug?: string) {
  const locale = normalizeLocale(localeHeader);
  const suffix = slug ? `/${encodeURIComponent(slug)}` : "";
  return `${BACKEND_ORIGIN}/${locale}/newsletters${suffix}/`;
}

export function rewriteNewsletterHtmlOrigins(html: string, requestOrigin: string) {
  if (!html.trim()) {
    return html;
  }

  const escapedBackendOrigin = BACKEND_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${escapedBackendOrigin}/(en|fr)/newsletters`, "g");
  return html.replace(pattern, `${requestOrigin}/$1/newsletters`);
}

function firstMatch(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1]?.trim() ?? "";
}

export function extractNewsletterDocument(html: string) {
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const bodyHtml = firstMatch(html, /<body[^>]*>([\s\S]*?)<\/body>/i) || html;
  const styleBlocks = Array.from(html.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/gi)).map(
    (match) => match[0],
  );
  const metaBlocks = Array.from(
    html.matchAll(/<meta\b[^>]+(?:viewport|charset|x-apple-disable-message-reformatting)[^>]*>/gi),
  ).map((match) => match[0]);

  return {
    title,
    bodyHtml,
    headHtml: [...metaBlocks, ...styleBlocks].join("\n"),
  };
}

export async function fetchNewsletterDocument(localeHeader: string | null, requestOrigin: string, slug?: string) {
  const backendResponse = await fetch(getBackendNewsletterUrl(localeHeader, slug), {
    method: "GET",
    cache: "no-store",
    headers: {
      accept: "text/html",
    },
  });

  if (!backendResponse.ok) {
    return null;
  }

  const html = rewriteNewsletterHtmlOrigins(await backendResponse.text(), requestOrigin);
  return extractNewsletterDocument(html);
}
