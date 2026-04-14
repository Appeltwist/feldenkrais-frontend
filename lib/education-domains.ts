import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

import { rewriteEducationLegacyHtml } from "@/lib/education-legacy-paths";
import { resolveLocale } from "@/lib/i18n";

type ArchiveRow = {
  body_html_path?: string;
  excerpt?: string;
  featured_media_url?: string;
  first_party_links?: string[];
  locale?: string;
  slug?: string;
  source_type?: string;
  title?: string;
  url?: string;
};

export type EducationDomainEntry = {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  sourceUrl: string;
  bodyHtml: string;
  bodyParagraphs: string[];
  bulletPoints: string[];
  relatedSlugs: string[];
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
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function normalizeText(value: string) {
  return stripTags(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
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

function isBoilerplateText(value: string) {
  return (
    value.length < 28 ||
    /skip to content|aller au contenu|quick links|newsletter|find a practitioner|watch|shop|copyright|manage cookie consent|privacy|forest lighthouse|commentaires|rechercher|search/i.test(
      value,
    )
  );
}

function extractContentWindow(rawHtml: string) {
  const beforeFooter = rawHtml.split("<footer", 1)[0] ?? rawHtml;
  const startMarkers = ['class="fl-post-content"', 'class="fl-rich-text"', 'class="fl-module-heading"'];
  const start = startMarkers
    .map((marker) => beforeFooter.indexOf(marker))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];

  if (start === undefined) {
    return beforeFooter;
  }

  return beforeFooter.slice(start);
}

function extractRichTextHtml(rawHtml: string, locale: string, excerpt: string) {
  const contentWindow = extractContentWindow(rawHtml);
  const blocks = [...contentWindow.matchAll(/<div class="fl-rich-text">([\s\S]*?)<\/div>/gi)]
    .map((match) => match[1]?.trim() ?? "")
    .filter(Boolean)
    .filter((block) => {
      const text = stripTags(block);
      if (!text || isBoilerplateText(text)) {
        return false;
      }
      return normalizeText(text) !== normalizeText(excerpt);
    });

  const uniqueBlocks = uniqueNonEmpty(blocks.map((block) => block.trim()))
    .slice(0, 6)
    .join("\n");

  return uniqueBlocks ? rewriteEducationLegacyHtml(uniqueBlocks, locale) : "";
}

function extractBodyParagraphs(rawHtml: string, excerpt: string) {
  const contentWindow = extractContentWindow(rawHtml);
  return uniqueNonEmpty(
    [...contentWindow.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => stripTags(match[1] ?? ""))
      .filter((value) => !isBoilerplateText(value))
      .filter((value) => normalizeText(value) !== normalizeText(excerpt)),
  ).slice(0, 7);
}

function extractBulletPoints(rawHtml: string) {
  const contentWindow = extractContentWindow(rawHtml);
  return uniqueNonEmpty(
    [...contentWindow.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((match) => stripTags(match[1] ?? ""))
      .filter((value) => !isBoilerplateText(value)),
  ).slice(0, 8);
}

function extractRelatedSlugs(links: string[] | undefined, slug: string) {
  if (!Array.isArray(links)) {
    return [] as string[];
  }

  const related: string[] = [];

  for (const href of links) {
    try {
      const parsed = new URL(href);
      const normalizedPath =
        parsed.pathname.replace(/\/+$/, "").replace(/^\/(?:en|fr)(?=\/|$)/i, "") || "/";
      const match = normalizedPath.match(/^\/(?:domain|domaine)\/([^/]+)$/i);
      if (!match?.[1]) {
        continue;
      }

      const relatedSlug = match[1].trim().toLowerCase();
      if (!relatedSlug || relatedSlug === slug.toLowerCase() || related.includes(relatedSlug)) {
        continue;
      }

      related.push(relatedSlug);
    } catch {
      continue;
    }
  }

  return related.slice(0, 6);
}

function buildArchive(locale: string) {
  const { archiveDir, rows } = readArchiveRows();
  if (!archiveDir) {
    return [] as EducationDomainEntry[];
  }

  const targetLocale = resolveLocale(locale);
  const localeRows = rows.filter(
    (row) => row.source_type === "domain" && row.slug && resolveLocale(row.locale ?? "en") === targetLocale,
  );

  return localeRows
    .map((row) => {
      const rawHtmlPath = row.body_html_path ? path.join(archiveDir, row.body_html_path) : "";
      const rawHtml = rawHtmlPath && existsSync(rawHtmlPath) ? readFileSync(rawHtmlPath, "utf8") : "";
      const excerpt = stripTags(row.excerpt?.trim() || "");

      return {
        slug: row.slug?.trim() || "",
        locale: targetLocale,
        title: stripTags(row.title?.trim() || "Domain"),
        excerpt,
        imageUrl: row.featured_media_url?.trim() || null,
        sourceUrl: row.url?.trim() || "",
        bodyHtml: rawHtml ? extractRichTextHtml(rawHtml, targetLocale, excerpt) : "",
        bodyParagraphs: rawHtml ? extractBodyParagraphs(rawHtml, excerpt) : [],
        bulletPoints: rawHtml ? extractBulletPoints(rawHtml) : [],
        relatedSlugs: extractRelatedSlugs(row.first_party_links, row.slug?.trim() || ""),
      } satisfies EducationDomainEntry;
    })
    .filter((entry) => Boolean(entry.slug && entry.title))
    .sort((left, right) => left.title.localeCompare(right.title));
}

const readEducationDomainArchive = cache((locale: string) => buildArchive(locale));

export function getEducationDomainArchive(locale: string) {
  return readEducationDomainArchive(locale);
}

export function getEducationDomain(locale: string, slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return readEducationDomainArchive(locale).find((entry) => entry.slug.toLowerCase() === normalizedSlug) ?? null;
}
