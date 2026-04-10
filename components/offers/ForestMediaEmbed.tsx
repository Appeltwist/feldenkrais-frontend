"use client";

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import {
  buildVimeoEmbedUrl,
  buildYouTubeEmbedUrl,
  parseVimeoVideo,
  parseYouTubeId,
  type ParsedVimeoVideo,
} from "@/lib/video-embed";

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

/* ── component ── */

export default function ForestMediaEmbed({
  videoUrl,
  galleryImages,
  fallbackImageUrl,
  title,
}: ForestMediaEmbedProps) {
  const normalizedVideoUrl = (videoUrl || "").trim();
  const vimeoVideo = normalizedVideoUrl ? parseVimeoVideo(normalizedVideoUrl) : null;
  const youTubeId = normalizedVideoUrl ? parseYouTubeId(normalizedVideoUrl) : null;
  const images = galleryImages?.filter((img) => img.url) ?? [];

  /* ── Vimeo embed with thumbnail + play overlay ── */
  if (vimeoVideo) {
    return <VimeoPlayer fallbackImageUrl={fallbackImageUrl} title={title} vimeoVideo={vimeoVideo} />;
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
  vimeoVideo,
  title,
  fallbackImageUrl,
}: {
  vimeoVideo: ParsedVimeoVideo;
  title: string;
  fallbackImageUrl?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumbUrl = `https://vumbnail.com/${vimeoVideo.id}.jpg`;

  if (playing) {
    return (
      <div className="forest-media-embed forest-media-embed--video">
        <div className="forest-media-embed__ratio">
          <iframe
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            src={buildVimeoEmbedUrl(vimeoVideo, {
              autoplay: 1,
              byline: 0,
              dnt: 1,
              portrait: 0,
              title: 0,
            })}
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
            src={buildYouTubeEmbedUrl(youTubeId, {
              autoplay: 1,
              rel: 0,
            })}
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
  const [portraitByIndex, setPortraitByIndex] = useState<Record<number, boolean>>({});

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

  function handleImageLoad(index: number, event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;
    const isPortrait = image.naturalHeight > image.naturalWidth;

    setPortraitByIndex((current) => {
      if (current[index] === isPortrait) {
        return current;
      }
      return {
        ...current,
        [index]: isPortrait,
      };
    });
  }

  return (
    <div className="forest-media-embed forest-media-embed--carousel">
      <div className="forest-media-embed__track" ref={trackRef}>
        {images.map((img, i) => (
          <div
            className={`forest-media-embed__slide${portraitByIndex[i] ? " forest-media-embed__slide--portrait" : ""}`}
            key={`slide-${i}`}
          >
            <img
              alt={img.alt || `${title} – ${i + 1}`}
              className={`forest-media-embed__slide-image${portraitByIndex[i] ? " forest-media-embed__slide-image--portrait" : ""}`}
              loading="lazy"
              onLoad={(event) => handleImageLoad(i, event)}
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
