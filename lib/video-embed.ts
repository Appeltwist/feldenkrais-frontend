export type ParsedVimeoVideo = {
  id: string;
  hash?: string;
};

function tryParseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function parseVimeoVideo(url: string): ParsedVimeoVideo | null {
  const parsed = tryParseUrl(url);
  if (parsed && /(^|\.)vimeo\.com$/i.test(parsed.hostname)) {
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const idIndex = pathParts.findIndex((part) => /^\d+$/.test(part));

    if (idIndex >= 0) {
      const id = pathParts[idIndex];
      const pathHash = pathParts[idIndex + 1];
      const queryHash = parsed.searchParams.get("h")?.trim();
      const hash = queryHash || (pathHash && /^[A-Za-z0-9]+$/.test(pathHash) ? pathHash : undefined);

      return hash ? { id, hash } : { id };
    }
  }

  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([A-Za-z0-9]+))?/i);
  if (!match) {
    return null;
  }

  return match[2] ? { id: match[1], hash: match[2] } : { id: match[1] };
}

export function buildVimeoEmbedUrl(
  video: ParsedVimeoVideo,
  extraParams: Record<string, string | number | boolean> = {},
): string {
  const params = new URLSearchParams();
  if (video.hash) {
    params.set("h", video.hash);
  }

  for (const [key, value] of Object.entries(extraParams)) {
    params.set(key, String(value));
  }

  return `https://player.vimeo.com/video/${video.id}?${params.toString()}`;
}

export function parseYouTubeId(url: string): string | null {
  const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (embedMatch) {
    return embedMatch[1];
  }

  const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (watchMatch) {
    return watchMatch[1];
  }

  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  return shortMatch ? shortMatch[1] : null;
}

export function buildYouTubeEmbedUrl(
  youTubeId: string,
  extraParams: Record<string, string | number | boolean> = {},
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(extraParams)) {
    params.set(key, String(value));
  }

  return `https://www.youtube.com/embed/${youTubeId}?${params.toString()}`;
}
