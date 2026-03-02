import { headers } from "next/headers";

/**
 * Read the preferred locale from the `x-locale` header set by middleware,
 * falling back to the provided default.
 */
export async function getRequestLocale(defaultLocale = "en"): Promise<string> {
  const h = await headers();
  return h.get("x-locale") ?? defaultLocale;
}
