import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

import { resolveEducationArchiveDir } from "@/lib/education-archive";
import { resolveLocale } from "@/lib/i18n";
import {
  EDUCATION_MASTERCLASS_COVER_MAP,
  EDUCATION_MASTERCLASS_ORDER,
} from "@/lib/education-masterclass-media";
import { localizePath } from "@/lib/locale-path";

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
  currentPrice: number | null;
  originalPrice: number | null;
  purchaseUrl: string;
  galleryImageUrls: string[];
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

type CuratedPhysicalProduct = {
  currentPrice: number;
  galleryFileNames: string[];
  key: "light-kit" | "table" | "full-kit";
  originalPrice: number;
  purchaseUrl: string;
  slugs: {
    en: string;
    fr: string;
  };
  titles: {
    en: string;
    fr: string;
  };
};

const SHOP_PRODUCT_IMAGE_BASE = "/brands/feldenkrais-education/media-library/shop-products";

const CURATED_PHYSICAL_PRODUCTS: CuratedPhysicalProduct[] = [
  {
    key: "light-kit",
    slugs: {
      en: "light-feldenkrais-practitioner-kit",
      fr: "kit-leger-du-praticien-feldenkrais",
    },
    titles: {
      en: '"Light" Feldenkrais practitioner Kit',
      fr: 'Kit "Léger" du Praticien Feldenkrais',
    },
    purchaseUrl: "https://client.felded.com/b/9B65kE7Im3V17I6e3573G0i",
    currentPrice: 242,
    originalPrice: 302.5,
    galleryFileNames: [
      "DSC02632.jpeg",
      "DSC02629.jpeg",
      "IMG_1955-scaled.jpeg",
      "DSC02619-Moyenne.jpeg",
      "DSC02631-Moyenne.jpeg",
      "DSC02455-Moyenne.jpeg",
      "DSC02616.jpeg",
      "DSC02625.jpeg",
      "WhatsApp-Image-2025-11-06-at-17.52.054.jpeg",
      "WhatsApp-Image-2025-11-06-at-17.52.06.jpeg",
      "WhatsApp-Image-2025-11-06-at-17.52.04.jpeg",
    ],
  },
  {
    key: "table",
    slugs: {
      en: "feldenkrais-table",
      fr: "table-de-feldenkrais",
    },
    titles: {
      en: "Feldenkrais Table",
      fr: "Table de Feldenkrais",
    },
    purchaseUrl: "https://client.felded.com/b/eVq6oI7Im9fl7I60cf73G0k",
    currentPrice: 665.5,
    originalPrice: 863.82,
    galleryFileNames: [
      "DSC02645.jpg",
      "DSC02644.jpg",
      "DSC02643.jpg",
      "DSC02641.jpg",
      "DSC02639.jpg",
      "DSC02638.jpg",
      "DSC02637.jpg",
    ],
  },
  {
    key: "full-kit",
    slugs: {
      en: "full-feldenkrais-practitioner-kit",
      fr: "kit-complet",
    },
    titles: {
      en: "Full Feldenkrais Practitioner Kit",
      fr: "Kit complet du Praticien Feldenkrais",
    },
    purchaseUrl: "https://client.felded.com/b/8x23cwbYCfDJbYm2kn73G0j",
    currentPrice: 459.8,
    originalPrice: 508.2,
    galleryFileNames: [
      "DSC02455-Moyenne.jpeg",
      "DSC02611-Moyenne.jpeg",
      "DSC02631-Moyenne.jpeg",
      "DSC02617-Moyenne.jpeg",
      "DSC02614.jpeg",
      "DSC02619.jpeg",
      "DSC02625.jpeg",
      "DSC02629.jpeg",
      "DSC02292.jpeg",
    ],
  },
];

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

function readArchiveRows() {
  const archiveDir = resolveEducationArchiveDir();
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

function formatProductPrice(locale: string, amount: number) {
  return new Intl.NumberFormat(resolveLocale(locale), {
    currency: "EUR",
    style: "currency",
  }).format(amount);
}

function buildCuratedPhysicalProducts(locale: string, rows: ArchiveRow[], archiveDir: string): EducationShopProduct[] {
  const targetLocale = resolveLocale(locale);
  const rowsBySlug = new Map(
    rows
      .filter((row) => row.source_type === "product" && row.slug)
      .map((row) => [row.slug?.trim().toLowerCase() || "", row]),
  );

  return CURATED_PHYSICAL_PRODUCTS.map((product) => {
    const slug = product.slugs[targetLocale as "en" | "fr"] || product.slugs.en;
    const archiveRow =
      rowsBySlug.get(slug.toLowerCase()) ??
      rowsBySlug.get(product.slugs.en.toLowerCase()) ??
      rowsBySlug.get(product.slugs.fr.toLowerCase()) ??
      null;
    const bodyHtmlPath = archiveRow?.body_html_path ? path.join(archiveDir, archiveRow.body_html_path) : "";
    const bodyHtml = bodyHtmlPath && existsSync(bodyHtmlPath) ? readFileSync(bodyHtmlPath, "utf8") : "";
    const excerpt = stripTags(archiveRow?.excerpt?.trim() || "").slice(0, 420);
    const galleryImageUrls = product.galleryFileNames.map((filename) => `${SHOP_PRODUCT_IMAGE_BASE}/${filename}`);

    return {
      slug,
      title: product.titles[targetLocale as "en" | "fr"] || product.titles.en,
      locale: targetLocale,
      excerpt,
      imageUrl: galleryImageUrls[0] || archiveRow?.featured_media_url?.trim() || null,
      bodyHtml,
      priceLabel: formatProductPrice(locale, product.currentPrice),
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      purchaseUrl: product.purchaseUrl,
      galleryImageUrls,
      sourceUrl: archiveRow?.url?.trim() || "",
    } satisfies EducationShopProduct;
  });
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

function buildCuratedDigitalHighlights(locale: string): EducationShopHighlight[] {
  const entries: EducationShopHighlight[] = [
    {
      title: "Lesson Library Access",
      href: localizePath(locale, "/lesson-library-access"),
      imageUrl: "/brands/feldenkrais-education/platform/lesson-library-scaled.jpeg",
      priceLabel: resolveLocale(locale) === "fr" ? "Abonnement annuel" : "Yearly Membership",
      metaLabels: [
        resolveLocale(locale) === "fr" ? "Leçons & documentaires" : "Lessons & documentaries",
      ],
      sourceType: "digital",
    },
    ...EDUCATION_MASTERCLASS_ORDER.map((slug) => ({
      title:
        slug === "the-singers-voice"
          ? "The Singer's Voice"
          : slug === "the-skeletal-voice"
            ? "The Skeletal Voice"
            : slug === "unlearning-pain"
              ? "Unlearning Pain"
              : "Feldenkrais for Sports",
      href: localizePath(locale, `/masterclasses/${slug}`),
      imageUrl: EDUCATION_MASTERCLASS_COVER_MAP[slug],
      priceLabel: resolveLocale(locale) === "fr" ? "Masterclass à la demande" : "On-demand masterclass",
      metaLabels:
        slug === "feldenkrais-for-sports"
          ? ["Sports", "Performance"]
          : slug === "unlearning-pain"
            ? ["Pain", "Recovery"]
            : ["Voice", "Embodied performance"],
      sourceType: "digital" as const,
    })),
  ];

  return entries;
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
  const curatedHighlights = buildCuratedDigitalHighlights(locale);
  if (shopRow?.html_snapshot_path) {
    const shopHtmlPath = path.join(archiveDir, shopRow.html_snapshot_path);
    if (existsSync(shopHtmlPath)) {
      const shopHtml = readFileSync(shopHtmlPath, "utf8");
      highlights = extractDigitalHighlights(shopHtml);
    }
  }
  if (curatedHighlights.length > 0) {
    highlights = curatedHighlights;
  }

  return { highlights, products: buildCuratedPhysicalProducts(locale, rows, archiveDir) };
}

const readEducationShopData = cache((locale: string) => buildShopData(locale));

export function getEducationShopData(locale: string) {
  return readEducationShopData(locale);
}

export function getEducationShopProduct(locale: string, slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return readEducationShopData(locale).products.find((item) => item.slug.toLowerCase() === normalizedSlug) ?? null;
}
