"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ── types ── */

type GalleryImage = {
  url: string;
  alt?: string;
};

type ForestMediaEmbedProps = {
  videoUrl?: string;
  galleryImages?: GalleryImage[];
  fallbackImageUrl?: string;
  title: string;
};

/* ── helpers ── */

function parseVimeoId(url: string): string | null {
  // https://vimeo.com/76979871
  // https://player.vimeo.com/video/76979871
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

function parseYouTubeId(url: string): string | null {
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

/* ── component ── */

export default function ForestMediaEmbed({
  videoUrl,
  galleryImages,
  fallbackImageUrl,
  title,
}: ForestMediaEmbedProps) {
  const normalizedVideoUrl = (videoUrl || "").trim();
  const vimeoId = normalizedVideoUrl ? parseVimeoId(normalizedVideoUrl) : null;
  const youTubeId = normalizedVideoUrl ? parseYouTubeId(normalizedVideoUrl) : null;
  const images = galleryImages?.filter((img) => img.url) ?? [];

  /* ── Vimeo embed with thumbnail + play overlay ── */
  if (vimeoId) {
    return <VimeoPlayer fallbackImageUrl={fallbackImageUrl} title={title} vimeoId={vimeoId} />;
  }

  /* ── YouTube embed with thumbnail + play overlay ── */
  if (youTubeId) {
    return <YouTubePlayer fallbackImageUrl={fallbackImageUrl} title={title} youTubeId={youTubeId} />;
  }

  /* ── Carousel (2+ images) ── */
  if (images.length >= 2) {
    return <ImageCarousel images={images} title={title} />;
  }

  /* ── Single image ── */
  const singleUrl = images[0]?.url || fallbackImageUrl;
  if (singleUrl) {
    return (
      <div className="forest-media-embed forest-media-embed--single">
        <img
          alt={images[0]?.alt || title}
          className="forest-media-embed__image"
          loading="lazy"
          src={singleUrl}
        />
      </div>
    );
  }

  return null;
}

/* ── Vimeo player — thumbnail + play button, loads iframe on click ── */

function VimeoPlayer({
  vimeoId,
  title,
  fallbackImageUrl,
}: {
  vimeoId: string;
  title: string;
  fallbackImageUrl?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumbUrl = `https://vumbnail.com/${vimeoId}.jpg`;

  if (playing) {
    return (
      <div className="forest-media-embed forest-media-embed--video">
        <div className="forest-media-embed__ratio">
          <iframe
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            src={`https://player.vimeo.com/video/${vimeoId}?dnt=1&byline=0&portrait=0&title=0&autoplay=1`}
            title={title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="forest-media-embed forest-media-embed--video">
      <VideoPosterButton
        fallbackImageUrl={fallbackImageUrl}
        key={`${thumbUrl}|${fallbackImageUrl || ""}`}
        onPlay={() => setPlaying(true)}
        primaryImageUrl={thumbUrl}
        title={title}
      />
    </div>
  );
}

function YouTubePlayer({
  title,
  youTubeId,
  fallbackImageUrl,
}: {
  title: string;
  youTubeId: string;
  fallbackImageUrl?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;

  if (playing) {
    return (
      <div className="forest-media-embed forest-media-embed--video">
        <div className="forest-media-embed__ratio">
          <iframe
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&rel=0`}
            title={title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="forest-media-embed forest-media-embed--video">
      <VideoPosterButton
        fallbackImageUrl={fallbackImageUrl}
        key={`${thumbUrl}|${fallbackImageUrl || ""}`}
        onPlay={() => setPlaying(true)}
        primaryImageUrl={thumbUrl}
        title={title}
      />
    </div>
  );
}

function VideoPosterButton({
  primaryImageUrl,
  fallbackImageUrl,
  onPlay,
  title,
}: {
  primaryImageUrl?: string;
  fallbackImageUrl?: string;
  onPlay: () => void;
  title: string;
}) {
  const normalizedPrimary = (primaryImageUrl || "").trim();
  const normalizedFallback = (fallbackImageUrl || "").trim();
  const preferredSource = normalizedFallback ? "fallback" : "primary";
  const [activeSource, setActiveSource] = useState<"primary" | "fallback">(preferredSource);

  const posterUrl = activeSource === "fallback"
    ? (normalizedFallback || normalizedPrimary)
    : (normalizedPrimary || normalizedFallback);

  return (
    <button
      aria-label={`Play ${title}`}
      className="forest-media-embed__poster"
      onClick={onPlay}
      type="button"
    >
      {posterUrl ? (
        <img
          alt=""
          className="forest-media-embed__thumb"
          loading="lazy"
          onError={() => {
            if (activeSource === "fallback" && normalizedPrimary) {
              setActiveSource("primary");
              return;
            }
            if (activeSource === "primary" && normalizedFallback) {
              setActiveSource("fallback");
            }
          }}
          src={posterUrl}
        />
      ) : null}
      <span aria-hidden="true" className="forest-media-embed__play">
        <svg fill="none" height="48" viewBox="0 0 48 48" width="48">
          <circle cx="24" cy="24" fill="rgba(0,0,0,0.55)" r="24" />
          <path d="M19 15l14 9-14 9V15z" fill="#fff" />
        </svg>
      </span>
    </button>
  );
}

/* ── Carousel sub-component ── */

function ImageCarousel({ images, title }: { images: GalleryImage[]; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.offsetWidth;
    const idx = Math.round(track.scrollLeft / slideWidth);
    setActiveIndex(idx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  function scrollTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.offsetWidth, behavior: "smooth" });
  }

  return (
    <div className="forest-media-embed forest-media-embed--carousel">
      <div className="forest-media-embed__track" ref={trackRef}>
        {images.map((img, i) => (
          <div className="forest-media-embed__slide" key={`slide-${i}`}>
            <img
              alt={img.alt || `${title} – ${i + 1}`}
              loading="lazy"
              src={img.url}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <nav aria-label="Gallery navigation" className="forest-media-embed__dots">
          {images.map((_, i) => (
            <button
              aria-label={`Go to image ${i + 1}`}
              className={`forest-media-embed__dot${i === activeIndex ? " forest-media-embed__dot--active" : ""}`}
              key={`dot-${i}`}
              onClick={() => scrollTo(i)}
              type="button"
            />
          ))}
        </nav>
      )}
    </div>
  );
}
