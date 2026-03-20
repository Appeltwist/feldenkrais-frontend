import "server-only";

import { fetchSiteConfig } from "@/lib/api";
import { rewriteForestMediaPayload } from "@/lib/forest-media";
import { resolveRuntimeHost } from "@/lib/get-hostname";
import { resolveApiHostname } from "@/lib/hostname-routing";
import type {
  PrivateBookingAvailability,
  PrivateBookingConfig,
  PrivateBookingPackageSummary,
  PrivateBookingSummary,
} from "@/lib/private-booking";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api").replace(/\/+$/, "");

export class PrivateBookingApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown = null) {
    super(message);
    this.name = "PrivateBookingApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestContext = {
  apiHostname: string;
  centerSlug: string;
};

type QueryValue = string | number | boolean | null | undefined;

function rewriteForestPrivateBookingPayload<T>(apiHostname: string, payload: T): T {
  return apiHostname.includes("forest-lighthouse") ? rewriteForestMediaPayload(payload) : payload;
}

function buildUrl(path: string, query: Record<string, QueryValue>) {
  const url = new URL(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    url.searchParams.set(key, String(value));
  }
  return url;
}

async function requestJson<T>(
  path: string,
  query: Record<string, QueryValue>,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    cache: "no-store",
    ...init,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new PrivateBookingApiError(`Request failed for ${path}`, response.status, payload);
  }

  return payload as T;
}

export async function resolvePrivateBookingRequestContext(rawHost?: string | null): Promise<RequestContext> {
  const hostname = resolveRuntimeHost(rawHost);
  const apiHostname = resolveApiHostname(hostname);
  const siteConfig = await fetchSiteConfig(hostname);

  return {
    apiHostname,
    centerSlug: siteConfig.centerSlug,
  };
}

export async function fetchPrivateBookingConfig(
  rawHost: string | null | undefined,
  slug: string,
  locale: string,
  packageToken?: string | null,
) {
  const context = await resolvePrivateBookingRequestContext(rawHost);
  const payload = await requestJson<PrivateBookingConfig>(`/private-booking/config/${encodeURIComponent(slug)}`, {
    domain: context.apiHostname,
    center: context.centerSlug,
    locale,
    package_token: packageToken ?? undefined,
  });
  return rewriteForestPrivateBookingPayload(context.apiHostname, payload);
}

export async function fetchPrivateBookingAvailability(
  rawHost: string | null | undefined,
  locale: string,
  params: Record<string, QueryValue>,
) {
  const context = await resolvePrivateBookingRequestContext(rawHost);
  const payload = await requestJson<PrivateBookingAvailability>("/private-booking/availability", {
    domain: context.apiHostname,
    center: context.centerSlug,
    locale,
    ...params,
  });
  return rewriteForestPrivateBookingPayload(context.apiHostname, payload);
}

export async function fetchPrivateBookingDetail(rawHost: string | null | undefined, token: string) {
  const context = await resolvePrivateBookingRequestContext(rawHost);
  const payload = await requestJson<PrivateBookingSummary>(`/private-booking/bookings/${encodeURIComponent(token)}`, {
    domain: context.apiHostname,
    center: context.centerSlug,
  });
  return rewriteForestPrivateBookingPayload(context.apiHostname, payload);
}

export async function fetchPrivateBookingPackage(rawHost: string | null | undefined, token: string) {
  const context = await resolvePrivateBookingRequestContext(rawHost);
  const payload = await requestJson<PrivateBookingPackageSummary>(`/private-booking/packages/${encodeURIComponent(token)}`, {
    domain: context.apiHostname,
    center: context.centerSlug,
  });
  return rewriteForestPrivateBookingPayload(context.apiHostname, payload);
}

export async function proxyPrivateBookingMutation<T>(
  rawHost: string | null | undefined,
  path: string,
  locale: string,
  payload: unknown,
) {
  const context = await resolvePrivateBookingRequestContext(rawHost);
  return requestJson<T>(path, {
    domain: context.apiHostname,
    center: context.centerSlug,
    locale,
  }, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
