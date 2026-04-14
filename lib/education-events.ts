import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

import { resolveLocale } from "@/lib/i18n";

type ArchiveRow = {
  excerpt?: string;
  featured_media_url?: string;
  html_snapshot_path?: string;
  locale?: string;
  slug?: string;
  source_type?: string;
  title?: string;
  url?: string;
};

type JsonLdGraph = {
  "@graph"?: Array<Record<string, unknown>>;
};

export type EducationEventEntry = {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  sourceUrl: string;
  startDate: string;
  endDate: string;
  attendanceMode: "online" | "in_person" | null;
  priceLabel: string | null;
  bodyParagraphs: string[];
  bulletPoints: string[];
};

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#038;/g, "&")
    .replace(/&hellip;/g, "…")
    .replace(/&raquo;/g, "»");
}

function stripTags(value: string) {
  return decodeEntities(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\*\*/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function resolveArchiveDir() {
  const root = process.env.FE_CRAWL_ARCHIVE_DIR?.trim();
  if (!root || !existsSync(root)) {
    return null;
  }

  const directIndex = path.join(root, "content_index.jsonl");
  if (existsSync(directIndex)) {
    return root;
  }

  const latestRun = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left))
    .find((dirname) => existsSync(path.join(root, dirname, "content_index.jsonl")));

  return latestRun ? path.join(root, latestRun) : null;
}

function readArchiveRows() {
  const archiveDir = resolveArchiveDir();
  if (!archiveDir) {
    return { archiveDir: null, rows: [] as ArchiveRow[] };
  }

  const contentIndexPath = path.join(archiveDir, "content_index.jsonl");
  if (!existsSync(contentIndexPath)) {
    return { archiveDir, rows: [] as ArchiveRow[] };
  }

  const rows = readFileSync(contentIndexPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ArchiveRow);

  return { archiveDir, rows };
}

function hasGraphType(value: unknown, expected: string) {
  if (Array.isArray(value)) {
    return value.includes(expected);
  }

  return value === expected;
}

function parseJsonLdEvent(rawHtml: string) {
  const graphMatch = rawHtml.match(
    /<script type="application\/ld\+json" class="yoast-schema-graph">([\s\S]*?)<\/script>/i,
  );

  if (!graphMatch?.[1]) {
    return null;
  }

  try {
    const payload = JSON.parse(graphMatch[1]) as JsonLdGraph;
    const graph = Array.isArray(payload["@graph"]) ? payload["@graph"] : [];
    const eventNode =
      graph.find((node) => hasGraphType(node["@type"], "Event")) ??
      null;

    if (!eventNode) {
      return null;
    }

    const imageValue = eventNode.image;
    let imageUrl = "";

    if (typeof imageValue === "string") {
      imageUrl = imageValue;
    } else if (imageValue && typeof imageValue === "object" && !Array.isArray(imageValue)) {
      const imageRecord = imageValue as Record<string, unknown>;
      const directImage =
        typeof imageRecord.url === "string"
          ? imageRecord.url
          : typeof imageRecord.contentUrl === "string"
            ? imageRecord.contentUrl
            : "";
      const referencedId = typeof imageRecord["@id"] === "string" ? imageRecord["@id"] : "";
      imageUrl = directImage;

      if (!imageUrl && referencedId) {
        const referencedImage = graph.find((node) => node["@id"] === referencedId);
        if (referencedImage) {
          imageUrl =
            (typeof referencedImage.url === "string" ? referencedImage.url : "") ||
            (typeof referencedImage.contentUrl === "string" ? referencedImage.contentUrl : "");
        }
      }
    }

    const offersValue = Array.isArray(eventNode.offers)
      ? eventNode.offers[0]
      : eventNode.offers && typeof eventNode.offers === "object"
        ? eventNode.offers
        : null;
    const rawPrice =
      offersValue && typeof offersValue === "object" && typeof offersValue.price === "string"
        ? offersValue.price.trim()
        : offersValue && typeof offersValue === "object" && typeof offersValue.price === "number"
          ? String(offersValue.price)
          : "";
    const currency =
      offersValue && typeof offersValue === "object" && typeof offersValue.priceCurrency === "string"
        ? offersValue.priceCurrency.trim()
        : "";

    return {
      title:
        typeof eventNode.name === "string" && eventNode.name.trim()
          ? decodeEntities(eventNode.name.trim())
          : "",
      description:
        typeof eventNode.description === "string" && eventNode.description.trim()
          ? stripTags(eventNode.description)
          : "",
      imageUrl: imageUrl || "",
      startDate:
        typeof eventNode.startDate === "string" && eventNode.startDate.trim()
          ? eventNode.startDate.trim()
          : "",
      endDate:
        typeof eventNode.endDate === "string" && eventNode.endDate.trim()
          ? eventNode.endDate.trim()
          : "",
      attendanceMode:
        typeof eventNode.eventAttendanceMode === "string" && eventNode.eventAttendanceMode.includes("Online")
          ? ("online" as const)
          : typeof eventNode.eventAttendanceMode === "string" && eventNode.eventAttendanceMode.includes("Offline")
            ? ("in_person" as const)
            : null,
      priceLabel:
        rawPrice === "0"
          ? "Free"
          : rawPrice
            ? `${rawPrice}${currency ? ` ${currency}` : ""}`.trim()
            : null,
    };
  } catch {
    return null;
  }
}

function uniqueNonEmpty(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) {
      continue;
    }

    const dedupeKey = normalized.toLowerCase();
    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    result.push(normalized);
  }

  return result;
}

function isBoilerplateParagraph(value: string) {
  return (
    value.length < 12 ||
    /skip to content|aller au contenu|no comments|submit comment|manage cookie consent|privacy|email us|call us|certificat qualiopi|recherche|search|rendez-vous sur la boutique/i.test(
      value,
    )
  );
}

function extractContentWindow(rawHtml: string) {
  const startMarkers = ['class="fl-post-info"', 'class="fl-rich-text"', 'class="fl-heading-text"'];
  const start = startMarkers
    .map((marker) => rawHtml.indexOf(marker))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];

  if (start === undefined) {
    return rawHtml;
  }

  const endMarkers = ['<div id="respond"', "<footer", "<!-- .fl-page-content -->"];
  const end = endMarkers
    .map((marker) => rawHtml.indexOf(marker, start))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];

  return rawHtml.slice(start, end >= 0 ? end : undefined);
}

function extractBodyContent(rawHtml: string, excerpt: string) {
  const contentWindow = extractContentWindow(rawHtml);
  const paragraphs = uniqueNonEmpty(
    [...contentWindow.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => stripTags(match[1] ?? ""))
      .filter((value) => !isBoilerplateParagraph(value))
      .filter((value) => value.toLowerCase() !== excerpt.toLowerCase()),
  ).slice(0, 6);

  const bulletPoints = uniqueNonEmpty(
    [...contentWindow.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((match) => stripTags(match[1] ?? ""))
      .filter((value) => !isBoilerplateParagraph(value)),
  ).slice(0, 6);

  return { paragraphs, bulletPoints };
}

function buildArchive(locale: string) {
  const { archiveDir, rows } = readArchiveRows();
  if (!archiveDir) {
    return [] as EducationEventEntry[];
  }

  const targetLocale = resolveLocale(locale);
  const rowsForLocale = rows.filter(
    (row) =>
      row.source_type === "tribe_events" &&
      row.slug &&
      row.slug !== "events" &&
      resolveLocale(row.locale ?? "en") === targetLocale,
  );

  return rowsForLocale
    .map((row) => {
      const rawHtmlPath = row.html_snapshot_path ? path.join(archiveDir, row.html_snapshot_path) : "";
      const rawHtml = rawHtmlPath && existsSync(rawHtmlPath) ? readFileSync(rawHtmlPath, "utf8") : "";
      const structuredEvent = rawHtml ? parseJsonLdEvent(rawHtml) : null;
      const excerpt = stripTags(row.excerpt ?? structuredEvent?.description ?? "");
      const bodyContent = rawHtml ? extractBodyContent(rawHtml, excerpt) : { paragraphs: [], bulletPoints: [] };
      const inferredAttendanceMode =
        /webinar|webinaire|online|en ligne|zoom/i.test(`${row.title ?? ""} ${excerpt}`)
          ? ("online" as const)
          : structuredEvent?.attendanceMode ?? null;

      return {
        slug: row.slug?.trim() || "",
        locale: targetLocale,
        title:
          structuredEvent?.title ||
          decodeEntities((row.title?.trim() || "Event").replace(/\s*-\s*Feldenkrais Education$/i, "")),
        excerpt,
        imageUrl: row.featured_media_url?.trim() || structuredEvent?.imageUrl || null,
        sourceUrl: row.url?.trim() || "",
        startDate: structuredEvent?.startDate || "",
        endDate: structuredEvent?.endDate || "",
        attendanceMode: inferredAttendanceMode,
        priceLabel: structuredEvent?.priceLabel ?? null,
        bodyParagraphs: bodyContent.paragraphs,
        bulletPoints: bodyContent.bulletPoints,
      } satisfies EducationEventEntry;
    })
    .filter((item) => Boolean(item.slug))
    .sort((left, right) => right.startDate.localeCompare(left.startDate));
}

const readEducationEvents = cache((locale: string) => buildArchive(locale));

export function getEducationEventArchive(locale: string) {
  return readEducationEvents(locale);
}

export function getEducationEventDetail(locale: string, slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return readEducationEvents(locale).find((item) => item.slug.toLowerCase() === normalizedSlug) ?? null;
}
