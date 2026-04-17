import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";

import { resolveEducationArchiveDir } from "@/lib/education-archive";
import { resolveLocale } from "@/lib/i18n";
import { localizePath } from "@/lib/locale-path";

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

export type EducationVideoItem = {
  title: string;
  videoId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
};

export type EducationVideoSection = {
  title: string;
  items: EducationVideoItem[];
};

export type EducationVideoGuideTopic = {
  title: string;
  href: string;
  description: string;
  questionCount: number;
  sampleQuestions: string[];
  previewVideo: EducationVideoItem | null;
  playlistUrl: string | null;
};

export type EducationVideosData = {
  pageTitle: string;
  pageSummary: string;
  heroImageUrl: string | null;
  sourceUrl: string;
  featuredHeading: string;
  featuredVideo: EducationVideoItem | null;
  sections: EducationVideoSection[];
  starterGuideTitle: string;
  starterGuideSubtitle: string;
  starterGuideSummary: string;
  starterGuideTopics: EducationVideoGuideTopic[];
  totalVideoCount: number;
};

type LocaleConfig = {
  slug: string;
  featuredHeading: string;
  galleryHeadings: string[];
  starterGuideTitle: string;
  starterGuideTopicConfigs: Array<{
    anchor: string;
    heading: string;
    href: string;
  }>;
};

const VIDEO_PAGE_CONFIG: Record<"en" | "fr", LocaleConfig> = {
  en: {
    slug: "watch",
    featuredHeading: "Highlight of the week",
    galleryHeadings: [
      "About the Feldenkrais trainings",
      "What people say about the training",
      "Conferences",
    ],
    starterGuideTitle: "20 Questions",
    starterGuideTopicConfigs: [
      {
        anchor: "training",
        heading: "About the Feldenkrais Training",
        href: "/trainings",
      },
      {
        anchor: "method",
        heading: "About the Feldenkrais Method",
        href: "/what-is-feldenkrais",
      },
      {
        anchor: "moshe",
        heading: "About Moshe Feldenkrais",
        href: "/what-is-feldenkrais#biography",
      },
      {
        anchor: "fe",
        heading: "About Feldenkrais Education",
        href: "/about",
      },
    ],
  },
  fr: {
    slug: "videos",
    featuredHeading: "À la une",
    galleryHeadings: [
      "À propos des formations Feldenkrais",
      "Témoignages",
      "Conférences",
    ],
    starterGuideTitle: "20 Questions",
    starterGuideTopicConfigs: [
      {
        anchor: "training",
        heading: "À propos de la formation Feldenkrais",
        href: "/trainings",
      },
      {
        anchor: "method",
        heading: "À propos de la méthode Feldenkrais",
        href: "/what-is-feldenkrais",
      },
      {
        anchor: "moshe",
        heading: "À propos de Moshe Feldenkrais",
        href: "/what-is-feldenkrais#biography",
      },
      {
        anchor: "fe",
        heading: "À propos de Feldenkrais Education",
        href: "/about",
      },
    ],
  },
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

function findPageRow(rows: ArchiveRow[], locale: string, config: LocaleConfig) {
  const targetLocale = resolveLocale(locale);
  return (
    rows.find(
      (row) =>
        row.source_type === "page" &&
        row.slug === config.slug &&
        resolveLocale(row.locale ?? "en") === targetLocale,
    ) ?? null
  );
}

function findNextIndex(source: string, start: number, markers: string[]) {
  const positions = markers
    .map((marker) => source.indexOf(marker, start))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right);

  return positions[0] ?? source.length;
}

function extractSectionBlock(source: string, heading: string, nextHeadings: string[]) {
  const marker = `<span class="title-text pp-primary-title">${heading}</span>`;
  const start = source.indexOf(marker);
  if (start === -1) {
    return "";
  }

  const end = findNextIndex(
    source,
    start + marker.length,
    nextHeadings.map((value) => `<span class="title-text pp-primary-title">${value}</span>`),
  );

  return source.slice(start, end);
}

function uniqueByVideo(items: EducationVideoItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.videoId)) {
      return false;
    }

    seen.add(item.videoId);
    return true;
  });
}

function extractGalleryItems(block: string) {
  const itemBlocks = block
    .split('<div class="pp-video-gallery-item swiper-slide')
    .slice(1)
    .map((chunk) => `<div class="pp-video-gallery-item swiper-slide${chunk}`);

  return uniqueByVideo(
    itemBlocks
      .map((itemBlock) => {
        const titleMatch = itemBlock.match(/title="([^"]+)"/);
        const videoIdMatch = itemBlock.match(/youtube\.com\/embed\/([^?"&]+)\?/);
        const thumbnailMatch = itemBlock.match(/src="(https:\/\/i\.ytimg\.com\/vi\/[^"]+)"/);

        const videoId = videoIdMatch?.[1]?.trim() ?? "";
        if (!videoId) {
          return null;
        }

        const title = stripTags(titleMatch?.[1] ?? "");
        return {
          title: title || "Video",
          videoId,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnailUrl: thumbnailMatch?.[1]?.trim() || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        } satisfies EducationVideoItem;
      })
      .filter((item): item is EducationVideoItem => Boolean(item)),
  );
}

function extractIntroText(block: string) {
  const paragraphMatch = block.match(/<div class="pp-sub-heading">\s*<p[^>]*>([\s\S]*?)<\/p>/i);
  return stripTags(paragraphMatch?.[1] ?? "");
}

function extractSecondaryTitle(block: string) {
  return stripTags(block.match(/<span class="title-text pp-secondary-title">([\s\S]*?)<\/span>/)?.[1] ?? "");
}

function extractFeaturedVideo(block: string, fallbackTitle: string, fallbackImageUrl: string | null) {
  const videoIdMatch = block.match(/youtube\.com\/embed\/([^?"&]+)\?/);
  if (!videoIdMatch?.[1]) {
    return null;
  }

  const videoId = videoIdMatch[1].trim();
  const backgroundImageMatch = block.match(/background-image:\s*url\(([^)]+)\)/);

  return {
    title: fallbackTitle,
    videoId,
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl:
      backgroundImageMatch?.[1]?.trim() ||
      fallbackImageUrl ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  } satisfies EducationVideoItem;
}

function extractFaqBlock(source: string, heading: string, nextHeadings: string[]) {
  const marker = `<span class="fl-heading-text">${heading}</span>`;
  const start = source.indexOf(marker);
  if (start === -1) {
    return "";
  }

  const end = findNextIndex(
    source,
    start + marker.length,
    nextHeadings.map((value) => `<span class="fl-heading-text">${value}</span>`),
  );

  return source.slice(start, end);
}

function extractFaqItems(block: string) {
  const itemBlocks = block
    .split(/<div id="[^"]+" class="pp-faq-item">/g)
    .slice(1)
    .map((chunk) => `<div class="pp-faq-item">${chunk}`);

  return itemBlocks
    .map((itemBlock) => {
      const labelMatch = itemBlock.match(/<span class="pp-faq-button-label">([\s\S]*?)<\/span>/);
      const videoIdMatch = itemBlock.match(/youtube\.com\/embed\/([^?"&]+)\?/);
      const contentMatch = itemBlock.match(/<div class="pp-faq-content-text">([\s\S]*?)<\/div>\s*<\/div>/);

      const summary = stripTags(
        (contentMatch?.[1] ?? "").replace(/<p><iframe[\s\S]*?<\/iframe><\/p>/i, ""),
      );

      return {
        label: stripTags(labelMatch?.[1] ?? ""),
        videoId: videoIdMatch?.[1]?.trim() ?? "",
        summary,
      };
    })
    .filter((item) => item.label);
}

function buildVideoData(locale: string): EducationVideosData | null {
  const { archiveDir, rows } = readArchiveRows();
  if (!archiveDir) {
    return null;
  }

  const targetLocale = resolveLocale(locale);
  const config = VIDEO_PAGE_CONFIG[targetLocale];
  const pageRow = findPageRow(rows, targetLocale, config);
  if (!pageRow?.html_snapshot_path) {
    return null;
  }

  const rawHtmlPath = path.join(archiveDir, pageRow.html_snapshot_path);
  if (!existsSync(rawHtmlPath)) {
    return null;
  }

  const rawHtml = readFileSync(rawHtmlPath, "utf8");
  const heroTitle = stripTags(rawHtml.match(/<span class="title-text pp-primary-title">([\s\S]*?)<\/span>/)?.[1] ?? "") || "Video Library";
  const heroSummary = extractIntroText(rawHtml) || stripTags(pageRow.excerpt ?? "");
  const heroImageUrl =
    rawHtml.match(/data-parallax-image="([^"]+)"/)?.[1]?.trim() ||
    pageRow.featured_media_url?.trim() ||
    null;

  const relevantHeadings = [...config.galleryHeadings, config.starterGuideTitle];
  const featuredBlock = extractSectionBlock(rawHtml, config.featuredHeading, relevantHeadings);
  const sections = config.galleryHeadings
    .map((heading, index) => {
      const block = extractSectionBlock(rawHtml, heading, config.galleryHeadings.slice(index + 1).concat(config.starterGuideTitle));
      const items = extractGalleryItems(block).slice(0, 8);

      return {
        title: heading,
        items,
      } satisfies EducationVideoSection;
    })
    .filter((section) => section.items.length > 0);

  const featuredVideoId = featuredBlock.match(/youtube\.com\/embed\/([^?"&]+)\?/)?.[1]?.trim() ?? "";
  const featuredTitle =
    sections.flatMap((section) => section.items).find((item) => item.videoId === featuredVideoId)?.title ||
    config.featuredHeading;
  const featuredVideo = featuredBlock
    ? extractFeaturedVideo(featuredBlock, featuredTitle, pageRow.featured_media_url?.trim() || null)
    : null;

  const starterGuideBlock = extractSectionBlock(rawHtml, config.starterGuideTitle, []);
  const starterGuideSubtitle = extractSecondaryTitle(starterGuideBlock);
  const starterGuideSummary = extractIntroText(starterGuideBlock);
  const starterGuideTopics = config.starterGuideTopicConfigs.map((topicConfig, index) => {
    const block = extractFaqBlock(
      rawHtml,
      topicConfig.heading,
      config.starterGuideTopicConfigs.slice(index + 1).map((item) => item.heading),
    );
    const faqItems = extractFaqItems(block);
    const previewItem = faqItems.find((item) => item.videoId) ?? null;

    return {
      title: topicConfig.heading,
      href: localizePath(targetLocale, topicConfig.href),
      description: previewItem?.summary || "",
      playlistUrl:
        faqItems.some((item) => item.videoId)
          ? `https://www.youtube.com/watch_videos?video_ids=${faqItems
              .map((item) => item.videoId)
              .filter(Boolean)
              .join(",")}`
          : null,
      questionCount: faqItems.length,
      sampleQuestions: faqItems.slice(0, 3).map((item) => item.label),
      previewVideo: previewItem?.videoId
        ? {
            title: previewItem.label,
            videoId: previewItem.videoId,
            youtubeUrl: `https://www.youtube.com/watch?v=${previewItem.videoId}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${previewItem.videoId}/hqdefault.jpg`,
          }
        : null,
    } satisfies EducationVideoGuideTopic;
  });

  const guideVideoCount = starterGuideTopics.reduce((count, item) => count + item.questionCount, 0);
  const galleryVideoCount = sections.reduce((count, section) => count + section.items.length, 0);

  return {
    pageTitle: heroTitle,
    pageSummary: heroSummary,
    heroImageUrl,
    sourceUrl: pageRow.url?.trim() || "",
    featuredHeading: config.featuredHeading,
    featuredVideo,
    sections,
    starterGuideTitle: config.starterGuideTitle,
    starterGuideSubtitle,
    starterGuideSummary,
    starterGuideTopics,
    totalVideoCount: galleryVideoCount + guideVideoCount,
  };
}

const readEducationVideos = cache((locale: string) => buildVideoData(locale));

export function getEducationVideosData(locale: string) {
  return readEducationVideos(locale);
}
