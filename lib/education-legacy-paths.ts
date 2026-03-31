import { localizePath } from "@/lib/locale-path";

const FE_HOST = "https://feldenkrais-education.com";

const LEGACY_FE_HOSTS = new Set(["feldenkrais-education.com", "www.feldenkrais-education.com"]);

const EDUCATION_LEGACY_PATH_ALIASES: Record<string, string> = {
  "/about": "/about",
  "/a-propos": "/about",
  "/equipe-feldenkrais-education": "/about",
  "/intervenants": "/teachers",
  "/teachers": "/teachers",
  "/team": "/team",
  "/press": "/press",
  "/presse": "/press",
  "/platform": "/platform",
  "/the-neuro-somatic-platform": "/platform",
  "/neuro-somatic-platform": "/platform",
  "/contact": "/contact",
  "/contact-us": "/contact",
  "/contact-nous": "/contact",
  "/get-in-touch": "/contact",
  "/what-is-feldenkrais": "/what-is-feldenkrais",
  "/feldenkrais-method": "/what-is-feldenkrais",
  "/methode-feldenkrais": "/what-is-feldenkrais",
  "/moshe-feldenkrais": "/moshe-feldenkrais",
  "/moshe-feldenkrais-a-life-in-movement": "/moshe-feldenkrais",
  "/newsletter": "/newsletter",
  "/infolettre": "/newsletter",
  "/domain": "/domains",
  "/domaine": "/domains",
  "/domains": "/domains",
  "/events": "/calendar",
  "/find-a-practitioner": "/find-a-practitioner",
  "/practitioner-finder": "/find-a-practitioner",
  "/trouver-un-praticien": "/find-a-practitioner",
  "/videos": "/videos",
  "/watch": "/videos",
  "/shop": "/shop",
  "/shop-en": "/shop",
  "/boutique-2": "/shop",
  "/trainings": "/trainings",
  "/feldenkrais-professional-training": "/trainings",
  "/feldenkrais-training": "/trainings",
  "/formation-professionelle-feldenkrais": "/trainings",
  "/formation-professionnelle-feldenkrais": "/trainings",
  "/formation-professionnelle": "/trainings",
  "/programs": "/trainings",
  "/workshops": "/workshops",
  "/all-workshops": "/workshops",
  "/ateliers-formations": "/workshops",
  "/day-in-training": "/day-in-training",
  "/a-typical-day-in-a-training": "/day-in-training",
  "/une-journee-dans-la-formation": "/day-in-training",
  "/visit": "/visit",
  "/your-visit": "/visit",
  "/location": "/location",
  "/financing": "/financing",
  "/comment-financer-ma-formation": "/financing",
  "/pdf-formation": "/trainings#request-pdf",
  "/program-cantal-6": "/trainings/cantal-6",
  "/program-cantal-6-2": "/trainings/cantal-6",
  "/online-trainings": "/platform",
  "/complaints": "/complaints",
  "/formulaire-de-reclamation": "/complaints",
  "/privacy": "/privacy",
  "/politique-de-confidentialite": "/privacy",
  "/terms": "/terms",
  "/cgv": "/terms",
  "/centers": "/centers",
  "/cantal-center": "/centers",
};

const LEGACY_CENTER_SLUG_ALIASES: Record<string, string> = {
  cantal: "cantal",
  "cantal-fr": "cantal",
  paris: "paris",
  "paris-fr": "paris",
  brussels: "brussels",
  bruxelles: "brussels",
};

export function normalizeEducationLegacyPath(pathname: string) {
  const decodedPath = (() => {
    try {
      return decodeURIComponent(pathname);
    } catch {
      return pathname;
    }
  })();

  const normalized = decodedPath.replace(/\/+$/, "") || "/";
  const withoutLocalePrefix = normalized.replace(/^\/(?:en|fr)(?=\/|$)/i, "") || "/";
  return withoutLocalePrefix.toLowerCase();
}

export function resolveEducationLegacyPath(pathname: string) {
  return EDUCATION_LEGACY_PATH_ALIASES[normalizeEducationLegacyPath(pathname)] ?? null;
}

export function mapEducationLegacyCenterSlug(slug: string) {
  return LEGACY_CENTER_SLUG_ALIASES[slug.trim().toLowerCase()] ?? null;
}

function isLegacyAssetPath(pathname: string) {
  return (
    pathname.startsWith("/wp-content/") ||
    /\.(?:pdf|docx?|xlsx?|pptx?|zip|mp3|mp4|mov|webm|jpe?g|png|gif|svg|webp|avif)$/i.test(pathname)
  );
}

export function rewriteEducationLegacyHref(href: string, locale: string) {
  if (!href || href.startsWith("#") || /^(?:mailto:|tel:|javascript:)/i.test(href)) {
    return href;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(href, FE_HOST);
  } catch {
    return href;
  }

  const isFirstPartyLegacyHost = LEGACY_FE_HOSTS.has(parsedUrl.hostname);
  const isRelativeLegacyPath = href.startsWith("/") && !href.startsWith("//");

  if (!isFirstPartyLegacyHost && !isRelativeLegacyPath) {
    return href;
  }

  if (isLegacyAssetPath(parsedUrl.pathname)) {
    return parsedUrl.toString();
  }

  const normalizedPath = normalizeEducationLegacyPath(parsedUrl.pathname);
  const shopMatch = normalizedPath.match(/^\/shop\/([^/]+)$/);
  if (shopMatch?.[1]) {
    const localizedPath = localizePath(locale, `/shop/${shopMatch[1]}`);
    return `${localizedPath}${parsedUrl.search}${parsedUrl.hash}`;
  }

  const newsletterMatch = normalizedPath.match(/^\/(?:newsletter|infolettre)\/([^/]+)$/);
  if (newsletterMatch?.[1]) {
    const localizedPath = localizePath(locale, `/newsletter/${newsletterMatch[1]}`);
    return `${localizedPath}${parsedUrl.search}${parsedUrl.hash}`;
  }

  const domainMatch = normalizedPath.match(/^\/(?:domain|domaine)\/([^/]+)$/);
  if (domainMatch?.[1]) {
    const localizedPath = localizePath(locale, `/domains/${domainMatch[1]}`);
    return `${localizedPath}${parsedUrl.search}${parsedUrl.hash}`;
  }

  const eventMatch = normalizedPath.match(/^\/event\/([^/]+)$/);
  if (eventMatch?.[1]) {
    const localizedPath = localizePath(locale, `/event/${eventMatch[1]}`);
    return `${localizedPath}${parsedUrl.search}${parsedUrl.hash}`;
  }

  const canonicalPath = resolveEducationLegacyPath(parsedUrl.pathname);

  if (!canonicalPath) {
    return href;
  }

  const localizedPath = localizePath(locale, canonicalPath);
  return `${localizedPath}${parsedUrl.search}${parsedUrl.hash}`;
}

export function rewriteEducationLegacyHtml(html: string, locale: string) {
  return html.replace(/(\shref\s*=\s*)(['"])([^'"]+)\2/gi, (_match, prefix, quote, href) => {
    const rewrittenHref = rewriteEducationLegacyHref(href, locale);
    return `${prefix}${quote}${rewrittenHref}${quote}`;
  });
}
