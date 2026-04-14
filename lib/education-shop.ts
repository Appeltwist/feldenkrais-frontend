import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

import { resolveLocale } from "@/lib/i18n";

export type EducationShopHighlight = {
  title: string;
  href: string;
  imageUrl: string | null;
  priceLabel: string | null;
  metaLabels: string[];
  sourceType: "digital";
};

export type EducationShopProduct = {
  slug: string;
  title: string;
  locale: string;
  excerpt: string;
  imageUrl: string | null;
  bodyHtml: string;
  priceLabel: string | null;
  sourceUrl: string;
};

type ArchiveRow = {
  body_html_path?: string;
  excerpt?: string;
  featured_media_url?: string;
  html_snapshot_path?: string;
  locale?: string;
  slug?: string;
  source_type?: string;
  title?: string;
  url?: string;
};

export type EducationShopData = {
  highlights: EducationShopHighlight[];
  products: EducationShopProduct[];
};

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
    .replace(/&#038;/g, "&")
    .replace(/&hellip;/g, "…");
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

function extractProductPriceLabel(html: string) {
  const match =
    html.match(/Price\s*:\s*([^<\n]+)/i) ??
    html.match(/Prix\s*:\s*([^<\n]+)/i);

  return match?.[1]?.trim() ?? null;
}

function extractDigitalHighlights(shopHtml: string): EducationShopHighlight[] {
  const start = shopHtml.indexOf("1. Online Platform Content");
  const end = shopHtml.indexOf("2. Physical Products");
  if (start === -1 || end === -1 || end <= start) {
    return [];
  }

  const section = shopHtml.slice(start, end);
  const chunks = section.split('<div class="pp-content-post pp-content-carousel-post').slice(1);

  return chunks
    .map((chunk) => `<div class="pp-content-post pp-content-carousel-post${chunk}`)
    .map((block) => {
      const titleMatch = block.match(/itemprop="mainEntityOfPage"[^>]*content="([^"]+)"/);
      const hrefMatch =
        block.match(/<a href="([^"]+)" class="pp-shop-image-link"/) ??
        block.match(/<a href="([^"]+)" title="[^"]*">/);
      const imageMatch = block.match(/<img[^>]+src="([^"]+)"/);
      const priceMatch = block.match(/pp-acf-price-overlay">\s*([^<]+)\s*<\/span>/);
      const metaMatches = [...block.matchAll(/<span class="pp-acf-pill">\s*([^<]+?)\s*<\/span>/g)]
        .map((match) => stripTags(match[1]))
        .filter(Boolean);

      return {
        title: titleMatch ? decodeEntities(titleMatch[1]).trim() : "",
        href: hrefMatch?.[1]?.trim() ?? "",
        imageUrl: imageMatch?.[1]?.trim() ?? null,
        priceLabel: priceMatch ? stripTags(priceMatch[1]) : null,
        metaLabels: metaMatches,
        sourceType: "digital" as const,
      };
    })
    .filter((item) => Boolean(item.title && item.href));
}

function buildShopData(locale: string): EducationShopData {
  const { archiveDir, rows } = readArchiveRows();
  if (!archiveDir) {
    return { highlights: [], products: [] };
  }

  const targetLocale = resolveLocale(locale);
  const localeRows = rows.filter((row) => resolveLocale(row.locale ?? "en") === targetLocale);
  const shopRow = localeRows.find((row) => row.source_type === "product" && (row.slug === "shop-en" || row.slug === "shop"));

  let highlights: EducationShopHighlight[] = [];
  if (shopRow?.html_snapshot_path) {
    const shopHtmlPath = path.join(archiveDir, shopRow.html_snapshot_path);
    if (existsSync(shopHtmlPath)) {
      const shopHtml = readFileSync(shopHtmlPath, "utf8");
      highlights = extractDigitalHighlights(shopHtml);
    }
  }

  const products = localeRows
    .filter((row) => row.source_type === "product" && row.slug && row.slug !== "shop" && row.slug !== "shop-en")
    .map((row) => {
      const bodyHtmlPath = row.body_html_path ? path.join(archiveDir, row.body_html_path) : "";
      const bodyHtml = bodyHtmlPath && existsSync(bodyHtmlPath) ? readFileSync(bodyHtmlPath, "utf8") : "";

      return {
        slug: row.slug?.trim() || "",
        title: (row.title?.trim() || "Product").replace(/\s*-\s*Feldenkrais Education$/i, ""),
        locale: targetLocale,
        excerpt: stripTags(row.excerpt?.trim() || "").slice(0, 420),
        imageUrl: row.featured_media_url?.trim() || null,
        bodyHtml,
        priceLabel: extractProductPriceLabel(bodyHtml),
        sourceUrl: row.url?.trim() || "",
      };
    })
    .filter((item) => Boolean(item.slug))
    .sort((left, right) => left.title.localeCompare(right.title));

  return { highlights, products };
}

const readEducationShopData = cache((locale: string) => buildShopData(locale));

export function getEducationShopData(locale: string) {
  return readEducationShopData(locale);
}

export function getEducationShopProduct(locale: string, slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return readEducationShopData(locale).products.find((item) => item.slug.toLowerCase() === normalizedSlug) ?? null;
}
