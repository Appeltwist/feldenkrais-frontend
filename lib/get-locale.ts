import { headers } from "next/headers";

/**
 * Read the preferred locale from the `x-locale` header set by middleware.
 *
 * When the URL contains an explicit locale prefix (e.g. `/fr/calendar`),
 * that locale is returned. Otherwise falls back to `defaultLocale` — which
 * should be the site's configured default from the API.
 */
export async function getRequestLocale(defaultLocale = "en"): Promise<string> {
  const h = await headers();
  const isExplicit = h.get("x-locale-explicit") === "1";
  if (isExplicit) {
    return h.get("x-locale") ?? defaultLocale;
  }
  return defaultLocale;
}
