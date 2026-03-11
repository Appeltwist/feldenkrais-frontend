"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ── types ── */

type GalleryImage = {
  url: string;
  alt?: string;
};

type ForestMediaEmbedProps = {
  vimeoUrl?: string;
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

/* ── component ── */

export default function ForestMediaEmbed({
  vimeoUrl,
  galleryImages,
  fallbackImageUrl,
  title,
}: ForestMediaEmbedProps) {
  const vimeoId = vimeoUrl ? parseVimeoId(vimeoUrl) : null;
  const images = galleryImages?.filter((img) => img.url) ?? [];

  /* ── Vimeo embed with thumbnail + play overlay ── */
  if (vimeoId) {
    return <VimeoPlayer vimeoId={vimeoId} title={title} />;
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

function VimeoPlayer({ vimeoId, title }: { vimeoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  /* Vimeo provides thumbnail URLs in predictable patterns via their oEmbed,
     but the simplest approach is their thumbnail URL scheme */
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
      <button
        aria-label={`Play ${title}`}
        className="forest-media-embed__poster"
        onClick={() => setPlaying(true)}
        type="button"
      >
        <img
          alt=""
          className="forest-media-embed__thumb"
          loading="lazy"
          src={thumbUrl}
        />
        <span aria-hidden="true" className="forest-media-embed__play">
          <svg fill="none" height="48" viewBox="0 0 48 48" width="48">
            <circle cx="24" cy="24" fill="rgba(0,0,0,0.55)" r="24" />
            <path d="M19 15l14 9-14 9V15z" fill="#fff" />
          </svg>
        </span>
      </button>
    </div>
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
