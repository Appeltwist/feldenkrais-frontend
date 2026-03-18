"use client";

import { useMemo, useState } from "react";
import {
  buildVimeoEmbedUrl,
  buildYouTubeEmbedUrl,
  parseVimeoVideo,
  parseYouTubeId,
} from "@/lib/video-embed";

type ForestHeroMediaProps = {
  title: string;
  videoUrl?: string;
  imageUrl?: string;
  defaultImageUrl?: string;
};

export default function ForestHeroMedia({ title, videoUrl, imageUrl, defaultImageUrl }: ForestHeroMediaProps) {
  const normalizedVideoUrl = (videoUrl || "").trim();
  const vimeoVideo = useMemo(
    () => (normalizedVideoUrl ? parseVimeoVideo(normalizedVideoUrl) : null),
    [normalizedVideoUrl],
  );
  const youTubeId = useMemo(
    () => (normalizedVideoUrl ? parseYouTubeId(normalizedVideoUrl) : null),
    [normalizedVideoUrl],
  );
  const fallbackImage = useMemo(() => {
    const preferred = (imageUrl || "").trim();
    if (preferred) {
      return preferred;
    }

    return (defaultImageUrl || "").trim();
  }, [defaultImageUrl, imageUrl]);
  const [showDirectVideo, setShowDirectVideo] = useState(Boolean(normalizedVideoUrl) && !vimeoVideo && !youTubeId);

  return (
    <div className="forest-hero-media" aria-label={`${title} media`}>
      {fallbackImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={title} className="forest-hero-media__image" loading="lazy" src={fallbackImage} />
      ) : (
        <div aria-hidden="true" className="forest-hero-media__gradient" />
      )}

      {vimeoVideo ? (
        <iframe
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="forest-hero-media__video forest-hero-media__video--embed"
          src={buildVimeoEmbedUrl(vimeoVideo, {
            autoplay: 1,
            autopause: 0,
            background: 1,
            byline: 0,
            dnt: 1,
            loop: 1,
            muted: 1,
            portrait: 0,
            title: 0,
          })}
          title={`${title} video`}
        />
      ) : null}

      {!vimeoVideo && youTubeId ? (
        <iframe
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="forest-hero-media__video forest-hero-media__video--embed"
          src={buildYouTubeEmbedUrl(youTubeId, {
            autoplay: 1,
            controls: 0,
            loop: 1,
            modestbranding: 1,
            mute: 1,
            playlist: youTubeId,
            playsinline: 1,
            rel: 0,
          })}
          title={`${title} video`}
        />
      ) : null}

      {showDirectVideo && normalizedVideoUrl ? (
        <video
          autoPlay
          className="forest-hero-media__video"
          loop
          muted
          onError={() => setShowDirectVideo(false)}
          playsInline
          poster={fallbackImage || undefined}
          preload="metadata"
        >
          <source src={normalizedVideoUrl} />
        </video>
      ) : null}

      <div aria-hidden="true" className="forest-hero-media__overlay" />
    </div>
  );
}
