import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

import { resolveLocale } from "@/lib/i18n";

export type EducationNewsletterEntry = {
  slug: string;
  title: string;
  locale: string;
  excerpt: string;
  lead: string;
  contentHtml: string;
  publishedAt: string;
  publishedLabel: string;
  imageUrl: string | null;
  sourceUrl: string;
};

type ArchiveRow = {
  body_html_path?: string;
  html_snapshot_path?: string;
  excerpt?: string;
  featured_media_url?: string;
  last_modified?: string;
  locale?: string;
  slug?: string;
  source_type?: string;
  title?: string;
  url?: string;
};

const NEWSLETTER_BLOCK_RE =
  /(<h([12]) class="fl-heading">[\s\S]*?<\/h\2>|<div class="fl-rich-text">[\s\S]*?<\/div>)/g;

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
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
    .replace(/&#8230;|&hellip;/g, "…");
}

function stripTags(value: string) {
  return decodeEntities(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeText(value: string) {
  return stripTags(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function looksLikeDate(value: string) {
  return (
    /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/u.test(value) ||
    /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/u.test(value)
  );
}

function isUsefulImage(url: string | undefined) {
  if (!url) {
    return false;
  }

  return !/\/LOGO(?:[-_.]|\.png|\.jpe?g|\.webp)/i.test(url);
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
    .sort((a, b) => b.localeCompare(a))
    .find((dirname) => existsSync(path.join(root, dirname, "content_index.jsonl")));

  return latestRun ? path.join(root, latestRun) : null;
}

function extractNewsletterContent(rawHtml: string, title: string) {
  const beforeFooter = rawHtml.split("<footer", 1)[0] ?? rawHtml;
  const blocks = Array.from(beforeFooter.matchAll(NEWSLETTER_BLOCK_RE)).map((match) => match[1]);

  if (blocks.length === 0) {
    return {
      lead: "",
      publishedLabel: "",
      contentHtml: "",
    };
  }

  const normalizedTitle = normalizeText(title);
  const titleIndex = blocks.findIndex((block) => {
    const blockText = normalizeText(block);
    return blockText === normalizedTitle || blockText.includes(normalizedTitle);
  });

  const relevantBlocks = blocks.slice(titleIndex >= 0 ? titleIndex : 0);
  let cursor = 1;
  let lead = "";
  let publishedLabel = "";

  if (relevantBlocks[cursor]) {
    const candidateLead = stripTags(relevantBlocks[cursor]);
    if (candidateLead && !looksLikeDate(candidateLead)) {
      lead = candidateLead;
      cursor += 1;
    }
  }

  if (relevantBlocks[cursor]) {
    const candidateDate = stripTags(relevantBlocks[cursor]);
    if (looksLikeDate(candidateDate)) {
      publishedLabel = candidateDate;
      cursor += 1;
    }
  }

  const contentHtml = relevantBlocks
    .slice(cursor)
    .map((block) => {
      const plain = stripTags(block);
      if (!plain || plain === title || plain === lead || plain === publishedLabel) {
        return "";
      }

      if (block.startsWith("<h")) {
        return `<h2>${escapeHtml(plain)}</h2>`;
      }

      return block
        .replace(/^<div class="fl-rich-text">/i, "")
        .replace(/<\/div>\s*$/i, "")
        .trim();
    })
    .filter(Boolean)
    .join("\n");

  return {
    lead,
    publishedLabel,
    contentHtml,
  };
}

function parseArchiveRows(locale: string): EducationNewsletterEntry[] {
  const archiveDir = resolveArchiveDir();
  if (!archiveDir) {
    return [];
  }

  const contentIndexPath = path.join(archiveDir, "content_index.jsonl");
  if (!existsSync(contentIndexPath)) {
    return [];
  }

  const targetLocale = resolveLocale(locale);
  const rows = readFileSync(contentIndexPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ArchiveRow)
    .filter((row) => row.source_type === "newsletter" && resolveLocale(row.locale ?? "en") === targetLocale);

  return rows
    .sort((left, right) => (right.last_modified ?? "").localeCompare(left.last_modified ?? ""))
    .map((row) => {
      const rawHtmlPath =
        row.html_snapshot_path && existsSync(path.join(archiveDir, row.html_snapshot_path))
          ? path.join(archiveDir, row.html_snapshot_path)
          : row.body_html_path && existsSync(path.join(archiveDir, row.body_html_path))
            ? path.join(archiveDir, row.body_html_path)
            : "";
      const rawHtml = rawHtmlPath ? readFileSync(rawHtmlPath, "utf8") : "";
      const title = row.title?.trim() || "Newsletter";
      const extracted = extractNewsletterContent(rawHtml, title);

      return {
        slug: row.slug?.trim() || "",
        title,
        locale: targetLocale,
        excerpt: stripTags(row.excerpt?.trim() || extracted.lead || "").slice(0, 320),
        lead: extracted.lead,
        contentHtml: extracted.contentHtml,
        publishedAt: row.last_modified?.trim() || "",
        publishedLabel: extracted.publishedLabel,
        imageUrl: isUsefulImage(row.featured_media_url) ? row.featured_media_url ?? null : null,
        sourceUrl: row.url?.trim() || "",
      };
    })
    .filter((entry) => Boolean(entry.slug && entry.title));
}

const readEducationNewsletterArchive = cache((locale: string) => parseArchiveRows(locale));

export function getEducationNewsletterArchive(locale: string) {
  return readEducationNewsletterArchive(locale);
}

export function getEducationNewsletter(locale: string, slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return (
    readEducationNewsletterArchive(locale).find((entry) => entry.slug.toLowerCase() === normalizedSlug) ??
    null
  );
}
