import { cleanDisplayText } from "@/lib/content-cleanup";

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value: string) {
  return cleanDisplayText(
    decodeEntities(value)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

export function extractLegacyParagraphs(html: string | null | undefined, limit = 4) {
  if (!html) {
    return [];
  }

  const matches = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
  const paragraphs = matches
    .map((match) => stripHtml(match[1] || ""))
    .filter(Boolean);

  return paragraphs.slice(0, limit);
}

export function extractLegacyImageUrl(html: string | null | undefined) {
  if (!html) {
    return null;
  }

  const patterns = [
    /data-fallback="([^"]+)"/i,
    /<img[^>]+src="([^"]+)"/i,
    /background-image:\s*url\((['"]?)([^'")]+)\1\)/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[2] || match[1] || null;
    }
  }

  return null;
}

export function extractLegacyYouTubeId(html: string | null | undefined) {
  if (!html) {
    return null;
  }

  const patterns = [
    /data-video-id="([^"]+)"/i,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/i,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function extractLegacyDualHeading(html: string | null | undefined) {
  if (!html) {
    return null;
  }

  const titleMatch = html.match(/<span[^>]*class="[^"]*pp-primary-title[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
  const subtitleMatch = html.match(/<span[^>]*class="[^"]*pp-secondary-title[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
  const title = stripHtml(titleMatch?.[1] || "");
  const subtitle = stripHtml(subtitleMatch?.[1] || "");

  if (!title && !subtitle) {
    return null;
  }

  return {
    subtitle: subtitle || null,
    title: title || null,
  };
}

export function extractLegacyDualButtonLinks(html: string | null | undefined) {
  if (!html) {
    return [];
  }

  return [...html.matchAll(/<div class="pp-dual-button-[^"]*"[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/gi)]
    .map((match) => {
      const href = match[1]?.trim();
      const label = stripHtml(match[2] || "");

      if (!href || !label) {
        return null;
      }

      return { href, label };
    })
    .filter((item): item is { href: string; label: string } => item !== null);
}
