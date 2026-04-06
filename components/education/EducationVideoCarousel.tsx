"use client";

import { useEffect, useRef, useState } from "react";

import type { EducationVideoItem } from "@/lib/education-videos";

type EducationVideoCarouselProps = {
  items: EducationVideoItem[];
  locale: string;
  className?: string;
  desktopSlides?: number;
  tabletSlides?: number;
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function getSlidesPerView(
  viewportWidth: number,
  desktopSlides: number,
  tabletSlides: number,
) {
  if (viewportWidth < 760) {
    return 1;
  }

  if (viewportWidth < 1120) {
    return tabletSlides;
  }

  return desktopSlides;
}

export default function EducationVideoCarousel({
  items,
  locale,
  className = "",
  desktopSlides = 2,
  tabletSlides = 1,
}: EducationVideoCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const isProgrammaticScrollRef = useRef(false);
  const scrollUnlockTimerRef = useRef<number | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(desktopSlides);
  const [activeIndex, setActiveIndex] = useState(0);

  const pageCount = Math.max(1, items.length - slidesPerView + 1);
  const maxIndex = pageCount - 1;
  const clampedActiveIndex = Math.min(activeIndex, maxIndex);
  const canScrollPrev = clampedActiveIndex > 0;
  const canScrollNext = clampedActiveIndex < maxIndex;

  useEffect(() => {
    function updateSlidesPerView() {
      setSlidesPerView(getSlidesPerView(window.innerWidth, desktopSlides, tabletSlides));
    }

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => {
      window.removeEventListener("resize", updateSlidesPerView);
    };
  }, [desktopSlides, tabletSlides]);

  useEffect(() => {
    const track = trackRef.current;
    const target = slideRefs.current[clampedActiveIndex];

    if (!track || !target) {
      return;
    }

    if (scrollUnlockTimerRef.current) {
      window.clearTimeout(scrollUnlockTimerRef.current);
    }

    isProgrammaticScrollRef.current = true;

    track.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });

    scrollUnlockTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      scrollUnlockTimerRef.current = null;
    }, 420);
  }, [clampedActiveIndex]);

  useEffect(() => {
    return () => {
      if (scrollUnlockTimerRef.current) {
        window.clearTimeout(scrollUnlockTimerRef.current);
      }
    };
  }, []);

  function handleScroll() {
    const track = trackRef.current;
    if (!track || isProgrammaticScrollRef.current) {
      return;
    }

    const nearestIndex = slideRefs.current.reduce((closestIndex, node, index) => {
      if (!node) {
        return closestIndex;
      }

      const closestNode = slideRefs.current[closestIndex];
      const currentDistance = Math.abs(node.offsetLeft - track.scrollLeft);
      const closestDistance = closestNode ? Math.abs(closestNode.offsetLeft - track.scrollLeft) : Number.POSITIVE_INFINITY;

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    setActiveIndex(Math.min(nearestIndex, maxIndex));
  }

  return (
    <div
      className={`education-video-carousel ${className}`.trim()}
      style={{ ["--education-video-slides" as string]: String(slidesPerView) }}
    >
      <button
        aria-label={t(locale, "Vidéo précédente", "Previous video")}
        className="education-video-carousel__arrow education-video-carousel__arrow--prev"
        disabled={!canScrollPrev}
        onClick={() => {
          setActiveIndex(Math.max(0, clampedActiveIndex - 1));
        }}
        type="button"
      >
        &#8592;
      </button>

      <div className="education-video-carousel__viewport" onScroll={handleScroll} ref={trackRef}>
        <div className="education-video-carousel__track">
          {items.map((item, index) => (
            <a
              className="education-video-carousel__slide"
              href={item.youtubeUrl}
              key={`${item.videoId}-${index}`}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              rel="noreferrer"
              target="_blank"
            >
              <div
                className="education-video-carousel__poster"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(16, 20, 34, 0.05), rgba(15, 21, 36, 0.78)), url(${item.thumbnailUrl})`,
                }}
              >
                <span className="education-video-carousel__play" aria-hidden="true">
                  <span />
                </span>
                <div className="education-video-carousel__copy">
                  <h3>{item.title}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <button
        aria-label={t(locale, "Vidéo suivante", "Next video")}
        className="education-video-carousel__arrow education-video-carousel__arrow--next"
        disabled={!canScrollNext}
        onClick={() => {
          setActiveIndex(Math.min(maxIndex, clampedActiveIndex + 1));
        }}
        type="button"
      >
        &#8594;
      </button>

      {pageCount > 1 ? (
        <div className="education-video-carousel__dots" role="tablist">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              aria-label={t(locale, `Aller à la vidéo ${index + 1}`, `Go to video ${index + 1}`)}
              className={`education-video-carousel__dot${index === clampedActiveIndex ? " is-active" : ""}`}
              key={index}
              onClick={() => {
                setActiveIndex(index);
              }}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
