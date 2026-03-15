import "server-only";

import { cleanDisplayText, cleanRichTextHtml, isFacilitatorOnlySubtitle } from "@/lib/content-cleanup";
import { getForestExcerptOverride } from "@/lib/forest-excerpts";
import { getForestFacilitatorNamesOverride } from "@/lib/forest-facilitator-overrides";
import { getRequiredApiBase } from "@/lib/server-env";
import { resolveHostname } from "@/lib/server-hostname";
import type { CalendarItem, OfferDetail, OfferSummary, PrivateBookingConfig, SiteFaqSection } from "@/lib/types";

export type QueryValue = string | number | boolean | null | undefined;

type QueryParams = Record<string, QueryValue>;
type RawRecord = Record<string, unknown>;

export type SocialLink = {
  label: string;
  url: string;
};

export type Brand = {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  fontFamily: string;
  logoUrl?: string;
};

export type Center = {
  slug: string;
  name: string;
  socials: SocialLink[];
};

export type SiteConfig = {
  siteName: string;
  centerSlug: string;
  defaultLocale: string;
  brand: Brand;
  center: Center;
};

export type FetchOffersParams = {
  hostname: string;
  center?: string;
  type?: string;
  locale?: string;
  from?: string;
  to?: string;
};

export type FetchOfferDetailParams = {
  hostname: string;
  center?: string;
  slug: string;
  locale?: string;
};

export type FetchPrivateBookingConfigParams = {
  hostname: string;
  center?: string;
  slug: string;
  locale?: string;
};

export type FetchCalendarParams = {
  hostname: string;
  center?: string;
  locale?: string;
  from?: string;
  to?: string;
  groupBy?: "offer";
  offeringId?: number;
  domainTheme?: string;
};

export type CalendarDomainOption = {
  slug: string;
  name: string;
  name_en?: string | null;
  name_fr?: string | null;
  sort_order?: number;
};

export type CalendarMeta = {
  domains: CalendarDomainOption[];
  selectedDomains: string[];
};

export type CalendarResponse = {
  items: CalendarItem[];
  meta: CalendarMeta;
};

export type FetchTeacherDetailParams = {
  hostname: string;
  center?: string;
  slug: string;
  locale?: string;
};

export type FetchTeachersListParams = {
  hostname: string;
  center?: string;
  locale?: string;
};

export type { CalendarItem, OfferDetail, OfferSummary, SiteFaqSection, TeacherDetail, TeacherListItem } from "@/lib/types";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE = getRequiredApiBase();

function normalizeHostname(hostname: string) {
  return resolveHostname(hostname);
}

function isForestRequest(hostname: string, center?: string) {
  const normalizedHostname = normalizeHostname(hostname);
  return normalizedHostname.includes("forest-lighthouse") || center === "forest-lighthouse";
}

function asRecord(value: unknown): RawRecord | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as RawRecord;
  }

  return null;
}

function pickString(source: RawRecord | null, keys: string[], fallback = "") {
  if (!source) {
    return fallback;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function toArray<T>(value: unknown) {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toList<T>(payload: unknown, keys: string[]) {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  for (const key of keys) {
    const nested = record[key];
    if (Array.isArray(nested)) {
      return nested as T[];
    }
  }

  return [];
}

function formatDisplayNames(names: readonly string[]) {
  const cleaned = names.map((name) => cleanDisplayText(name)).filter(Boolean);
  if (cleaned.length === 0) {
    return "";
  }
  if (cleaned.length === 1) {
    return cleaned[0];
  }
  if (cleaned.length === 2) {
    return `${cleaned[0]} & ${cleaned[1]}`;
  }
  return `${cleaned.slice(0, -1).join(", ")} & ${cleaned[cleaned.length - 1]}`;
}

function sanitizeFacilitatorRecord<T>(facilitator: T): T {
  const record = asRecord(facilitator);
  if (!record) {
    return facilitator;
  }

  const sanitized: RawRecord = { ...record };

  for (const key of ["display_name", "name", "full_name", "title", "short_bio"] as const) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = cleanDisplayText(sanitized[key] as string);
    }
  }

  if (typeof sanitized.bio === "string") {
    sanitized.bio = cleanRichTextHtml(sanitized.bio);
  }

  return sanitized as T;
}

function normalizeForMatch(value: string) {
  return cleanDisplayText(value)
    .toLowerCase()
    .replace(/[^a-z0-9à-ÿ]+/gi, " ")
    .trim();
}

function facilitatorMatchesTarget(facilitator: RawRecord, target: string) {
  const candidate = normalizeForMatch(
    pickString(facilitator, ["display_name", "name", "full_name"]),
  );
  const targetName = normalizeForMatch(target);

  return candidate === targetName || candidate.includes(targetName) || targetName.includes(candidate);
}

function applyFacilitatorOverride(facilitators: unknown, names: readonly string[]) {
  const records = toArray<unknown>(facilitators)
    .map((item) => sanitizeFacilitatorRecord(asRecord(item)))
    .filter((item): item is RawRecord => item !== null);

  const used = new Set<number>();

  return names.map((targetName) => {
    const matchIndex = records.findIndex(
      (record, index) => !used.has(index) && facilitatorMatchesTarget(record, targetName),
    );

    if (matchIndex === -1) {
      return {
        display_name: targetName,
        name: targetName,
      };
    }

    used.add(matchIndex);
    return {
      ...records[matchIndex],
      display_name: targetName,
      name: targetName,
      full_name: targetName,
    };
  });
}

function needsForestExcerptOverride(rawExcerpt: string, cleanedExcerpt: string) {
  if (!cleanedExcerpt) {
    return true;
  }

  if (/(?:\.{3}|…)\s*$/u.test(rawExcerpt)) {
    return true;
  }

  return cleanedExcerpt.length > 100 && !/[.!?]$/u.test(cleanedExcerpt);
}

function sanitizeOfferRecord<T>(offer: T, isForest: boolean): T {
  const record = asRecord(offer);
  if (!record) {
    return offer;
  }

  const sanitized: RawRecord = { ...record };
  const slug = pickString(record, ["slug"]);
  const title = cleanDisplayText(pickString(record, ["title", "name"]));

  if (typeof sanitized.title === "string") {
    sanitized.title = title || sanitized.title;
  }

  if (typeof sanitized.subtitle === "string") {
    const cleanedSubtitle = cleanDisplayText(sanitized.subtitle);
    const facilitatorOverride = isForest ? getForestFacilitatorNamesOverride(slug) : null;

    if (facilitatorOverride && isFacilitatorOnlySubtitle(cleanedSubtitle)) {
      const prefix = cleanedSubtitle.match(/^(w\/|with|avec)\b/i)?.[0] ?? "";
      const formattedNames = formatDisplayNames(facilitatorOverride);
      sanitized.subtitle = prefix ? `${prefix} ${formattedNames}` : formattedNames;
    } else {
      sanitized.subtitle = cleanedSubtitle;
    }
  }

  if (typeof sanitized.excerpt === "string") {
    const rawExcerpt = sanitized.excerpt;
    const cleanedExcerpt = cleanDisplayText(rawExcerpt);
    const forestOverride = isForest ? getForestExcerptOverride(title) : null;

    sanitized.excerpt =
      forestOverride && needsForestExcerptOverride(rawExcerpt, cleanedExcerpt)
        ? forestOverride
        : cleanedExcerpt;
  }

  if (Array.isArray(sanitized.facilitators)) {
    const facilitatorOverride = isForest ? getForestFacilitatorNamesOverride(slug) : null;
    sanitized.facilitators = facilitatorOverride
      ? applyFacilitatorOverride(sanitized.facilitators, facilitatorOverride)
      : sanitized.facilitators.map((item) => sanitizeFacilitatorRecord(item));
  }

  return sanitized as T;
}

function sanitizeTeacherDetailRecord<T>(teacher: T): T {
  const record = asRecord(teacher);
  if (!record) {
    return teacher;
  }

  const sanitized: RawRecord = { ...record };

  for (const key of ["display_name", "title", "short_bio", "seo_title", "seo_description"] as const) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = cleanDisplayText(sanitized[key] as string);
    }
  }

  if (typeof sanitized.bio === "string") {
    sanitized.bio = cleanRichTextHtml(sanitized.bio);
  }

  return sanitized as T;
}

function buildUrl(path: string, params: QueryParams) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE}${normalizedPath}`);

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

async function requestJson<T>(path: string, params: QueryParams) {
  const response = await fetch(buildUrl(path, params), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError(`Request failed for ${path}`, response.status);
  }

  return (await response.json()) as T;
}

function toSocialLinks(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const links: SocialLink[] = [];

  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      links.push({ label: "Social", url: item.trim() });
      continue;
    }

    const record = asRecord(item);
    if (!record) {
      continue;
    }

    const url = pickString(record, ["url", "href", "link"]);
    if (!url) {
      continue;
    }

    const label = pickString(record, ["label", "name", "platform"], "Social");
    links.push({ label, url });
  }

  return links;
}

function normalizeSiteConfig(payload: unknown, hostname: string): SiteConfig {
  const record = asRecord(payload) ?? {};
  const siteRecord = asRecord(record.site);
  const centerRecord = asRecord(record.center);
  const brandRecord = asRecord(record.brand) ?? asRecord(record.theme);
  const brandColors = asRecord(brandRecord?.colors);
  const locales = toArray<unknown>(record.locales).filter(
    (locale): locale is string => typeof locale === "string" && locale.trim().length > 0,
  );
  const centerSlug =
    pickString(record, ["centerSlug", "center_slug"]) ||
    pickString(centerRecord, ["slug", "center_slug"]) ||
    "forest-lighthouse";
  const centerName =
    pickString(record, ["centerName", "center_name"]) ||
    pickString(centerRecord, ["name", "title"]) ||
    centerSlug;
  const siteName =
    pickString(record, ["siteName", "site_name", "name", "title"]) ||
    pickString(siteRecord, ["site_name", "siteName", "name", "title"]) ||
    centerName ||
    hostname;
  const defaultLocale =
    pickString(record, ["defaultLocale", "default_locale", "locale"]) ||
    pickString(centerRecord, ["defaultLocale", "default_locale", "locale"]) ||
    pickString(brandRecord, ["defaultLanguage", "default_language", "language", "locale"]) ||
    locales[0] ||
    "en";
  const socials = toSocialLinks(record.socials ?? centerRecord?.socials);

  return {
    siteName,
    centerSlug,
    defaultLocale,
    brand: {
      colorPrimary: pickString(
        brandColors ?? brandRecord,
        ["primary", "primaryColor", "primary_color", "colorPrimary", "color_primary"],
        "#14524d",
      ),
      colorSecondary: pickString(
        brandColors ?? brandRecord,
        ["secondary", "secondaryColor", "secondary_color", "colorSecondary", "color_secondary"],
        "#2f6e79",
      ),
      colorAccent: pickString(
        brandColors ?? brandRecord,
        ["accent", "accentColor", "accent_color", "colorAccent", "color_accent"],
        "#d4a64a",
      ),
      fontFamily: pickString(
        brandRecord,
        ["fontFamily", "font_family", "font", "fontStack"],
        "system-ui, -apple-system, Segoe UI, sans-serif",
      ),
      logoUrl: pickString(brandRecord, ["logoUrl", "logo_url", "logo"]),
    },
    center: {
      slug: centerSlug,
      name: centerName,
      socials,
    },
  };
}

function normalizeSiteFaq(payload: unknown) {
  const record = asRecord(payload);
  const rawSections = toArray<unknown>(record?.sections);
  const sections: SiteFaqSection[] = [];

  for (const rawSection of rawSections) {
    const sectionRecord = asRecord(rawSection);
    const title = pickString(sectionRecord, ["title", "heading", "name"]);
    if (!title) {
      continue;
    }

    const items: SiteFaqSection["items"] = [];
    for (const rawItem of toArray<unknown>(sectionRecord?.items)) {
      const itemRecord = asRecord(rawItem);
      const question = pickString(itemRecord, ["question", "title", "heading"]);
      const answer = pickString(itemRecord, ["answer", "body", "text"]);
      if (!question || !answer) {
        continue;
      }
      items.push({ question, answer });
    }

    if (items.length === 0) {
      continue;
    }

    sections.push({ title, items });
  }

  return sections;
}

export async function fetchSiteConfig(hostname: string) {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>("/site-config", {
    domain: normalizedHostname,
  });

  return normalizeSiteConfig(payload, normalizedHostname);
}

export async function fetchSiteFaq(hostname: string, locale?: string) {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>("/site-faq", {
    domain: normalizedHostname,
    locale,
  });

  return normalizeSiteFaq(payload);
}

export async function fetchOffers({
  hostname,
  center,
  type,
  locale,
  from,
  to,
}: FetchOffersParams) {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>("/offers", {
    domain: normalizedHostname,
    center,
    type,
    locale,
    from,
    to,
  });

  return toList<OfferSummary>(payload, ["results", "items", "data", "offers"]).map((offer) =>
    sanitizeOfferRecord(offer, isForestRequest(normalizedHostname, center)),
  );
}

export async function fetchOfferDetail({ hostname, center, slug, locale }: FetchOfferDetailParams) {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>(`/offers/${encodeURIComponent(slug)}`, {
    domain: normalizedHostname,
    center,
    locale,
  });

  if (Array.isArray(payload)) {
    return toArray<OfferDetail>(payload)[0] ?? null;
  }

  const record = asRecord(payload);
  if (!record) {
    return null;
  }

  const wrapped = asRecord(record.data) ?? asRecord(record.item) ?? asRecord(record.offer);
  return sanitizeOfferRecord(wrapped ?? record, isForestRequest(normalizedHostname, center));
}

export async function fetchPrivateBookingConfig({ hostname, center, slug, locale }: FetchPrivateBookingConfigParams) {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>(`/private-booking/config/${encodeURIComponent(slug)}`, {
    domain: normalizedHostname,
    center,
    locale,
  });

  const record = asRecord(payload);
  if (!record) {
    return null;
  }

  const wrapped = asRecord(record.data) ?? asRecord(record.item) ?? asRecord(record.config);
  return (wrapped ?? record) as PrivateBookingConfig;
}

export async function fetchTeacherDetail({ hostname, center, slug, locale }: FetchTeacherDetailParams) {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>(`/teachers/${encodeURIComponent(slug)}`, {
    domain: normalizedHostname,
    center,
    locale,
  });

  const record = asRecord(payload);
  if (!record) {
    return null;
  }

  const wrapped = asRecord(record.data) ?? asRecord(record.item) ?? asRecord(record.teacher);
  return sanitizeTeacherDetailRecord((wrapped ?? record) as import("@/lib/types").TeacherDetail);
}

export async function fetchTeachersList({ hostname, center, locale }: FetchTeachersListParams) {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>("/teachers", {
    domain: normalizedHostname,
    center,
    locale,
  });

  return toList<import("@/lib/types").TeacherListItem>(payload, ["results", "items", "data", "teachers"]).map(
    (teacher) => sanitizeTeacherDetailRecord(teacher),
  );
}

export async function fetchCalendar({
  hostname,
  center,
  locale,
  from,
  to,
  groupBy,
  offeringId,
  domainTheme,
}: FetchCalendarParams) {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>("/calendar", {
    domain: normalizedHostname,
    center,
    locale,
    from,
    to,
    group_by: groupBy,
    offering_id: offeringId,
    domain_theme: domainTheme,
  });

  return toList<CalendarItem>(payload, ["results", "items", "data", "calendar", "events"]);
}

function toCalendarMeta(payload: unknown): CalendarMeta {
  const record = asRecord(payload);
  const metaRecord = asRecord(record?.meta);
  const domainsRaw = toArray<unknown>(metaRecord?.domains);
  const selectedRaw = toArray<unknown>(metaRecord?.selected_domains ?? metaRecord?.selectedDomains);

  const domains: CalendarDomainOption[] = [];
  for (const item of domainsRaw) {
    const domain = asRecord(item);
    const slug = pickString(domain, ["slug"]);
    const name = pickString(domain, ["name", "label"]);
    if (!slug || !name) {
      continue;
    }

    const sortOrderRaw = domain?.sort_order;
    const sortOrder =
      typeof sortOrderRaw === "number" && Number.isInteger(sortOrderRaw) ? sortOrderRaw : undefined;

    domains.push({
      slug,
      name,
      name_en: pickString(domain, ["name_en"]) || null,
      name_fr: pickString(domain, ["name_fr"]) || null,
      sort_order: sortOrder,
    });
  }

  const selectedDomains = selectedRaw
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return {
    domains,
    selectedDomains,
  };
}

export async function fetchCalendarWithMeta({
  hostname,
  center,
  locale,
  from,
  to,
  groupBy,
  offeringId,
  domainTheme,
}: FetchCalendarParams): Promise<CalendarResponse> {
  const normalizedHostname = normalizeHostname(hostname);
  const payload = await requestJson<unknown>("/calendar", {
    domain: normalizedHostname,
    center,
    locale,
    from,
    to,
    group_by: groupBy,
    offering_id: offeringId,
    domain_theme: domainTheme,
  });

  return {
    items: toList<CalendarItem>(payload, ["results", "items", "data", "calendar", "events"]),
    meta: toCalendarMeta(payload),
  };
}
