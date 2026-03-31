import "server-only";

import { fetchNarrativePage } from "@/lib/api";
import {
  getEducationCenter,
  getEducationFallbackNarrativePage,
  type EducationPageKey,
} from "@/lib/education-content";

const NARRATIVE_ROUTE_ALIASES: Partial<Record<EducationPageKey, EducationPageKey[]>> = {
  "find-a-practitioner": ["practitioner-finder"],
  "practitioner-finder": ["find-a-practitioner"],
};

function getNarrativeRouteCandidates(routeKey: EducationPageKey) {
  return [routeKey, ...(NARRATIVE_ROUTE_ALIASES[routeKey] ?? [])];
}

function getLocaleCandidates(locale: string) {
  const normalized = locale.toLowerCase();
  const primary = normalized.split("-")[0] || "en";
  const candidates = [primary];

  if (primary !== "en") {
    candidates.push("en");
  }

  return candidates;
}

export async function resolveEducationNarrativePage(
  hostname: string,
  routeKey: EducationPageKey,
  locale: string,
) {
  for (const candidateLocale of getLocaleCandidates(locale)) {
    for (const candidateRouteKey of getNarrativeRouteCandidates(routeKey)) {
      const backendPage = await fetchNarrativePage(hostname, candidateRouteKey, candidateLocale).catch(() => null);

      if (backendPage) {
        return backendPage;
      }
    }
  }

  return getEducationFallbackNarrativePage(routeKey, locale);
}

export async function resolveEducationCenterPage(locale: string, slug: string) {
  return getEducationCenter(locale, slug);
}
