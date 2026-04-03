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
