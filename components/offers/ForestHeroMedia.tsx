"use client";

import { useMemo, useState } from "react";

type ForestHeroMediaProps = {
  title: string;
  videoUrl?: string;
  imageUrl?: string;
  defaultImageUrl?: string;
};

export default function ForestHeroMedia({ title, videoUrl, imageUrl, defaultImageUrl }: ForestHeroMediaProps) {
  const normalizedVideoUrl = (videoUrl || "").trim();
  const fallbackImage = useMemo(() => {
    const preferred = (imageUrl || "").trim();
    if (preferred) {
      return preferred;
    }

    return (defaultImageUrl || "").trim();
  }, [defaultImageUrl, imageUrl]);
  const [showVideo, setShowVideo] = useState(Boolean(normalizedVideoUrl));

  return (
    <div className="forest-hero-media" aria-label={`${title} media`}>
      {fallbackImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={title} className="forest-hero-media__image" loading="lazy" src={fallbackImage} />
      ) : (
        <div aria-hidden="true" className="forest-hero-media__gradient" />
      )}

      {showVideo && normalizedVideoUrl ? (
        <video
          autoPlay
          className="forest-hero-media__video"
          loop
          muted
          onError={() => setShowVideo(false)}
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
