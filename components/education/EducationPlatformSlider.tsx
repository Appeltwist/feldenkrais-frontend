"use client";

import { Children, useRef, useState, type ReactNode } from "react";

type EducationPlatformSliderProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function EducationPlatformSlider({
  ariaLabel,
  children,
  className = "",
}: EducationPlatformSliderProps) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = Math.max(0, slides.length - 1);
  const safeActiveIndex = clamp(activeIndex, 0, maxIndex);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const nextIndex = clamp(index, 0, maxIndex);
    const width = track.clientWidth;

    track.scrollTo({
      left: nextIndex * width,
      behavior: "smooth",
    });

    setActiveIndex(nextIndex);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const width = track.clientWidth || 1;
    const nextIndex = clamp(
      Math.round(track.scrollLeft / width),
      0,
      maxIndex,
    );

    if (nextIndex !== safeActiveIndex) {
      setActiveIndex(nextIndex);
    }
  }

  return (
    <div className={`neuro-platform-slider ${className}`.trim()}>
      <button
        aria-label="Previous slide"
        className="neuro-platform-slider__arrow neuro-platform-slider__arrow--prev"
        disabled={safeActiveIndex <= 0}
        onClick={() => scrollToIndex(safeActiveIndex - 1)}
        type="button"
      >
        &#8249;
      </button>

      <div
        aria-label={ariaLabel}
        className="neuro-platform-slider__viewport"
        onScroll={handleScroll}
        ref={trackRef}
      >
        <div className="neuro-platform-slider__track">
          {slides.map((slide, index) => (
            <div className="neuro-platform-slider__slide" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button
        aria-label="Next slide"
        className="neuro-platform-slider__arrow neuro-platform-slider__arrow--next"
        disabled={safeActiveIndex >= slides.length - 1}
        onClick={() => scrollToIndex(safeActiveIndex + 1)}
        type="button"
      >
        &#8250;
      </button>

      {slides.length > 1 ? (
        <div className="neuro-platform-slider__dots" role="tablist" aria-label={ariaLabel}>
          {slides.map((_, index) => (
            <button
              aria-label={`Go to slide ${index + 1}`}
              className={`neuro-platform-slider__dot${index === safeActiveIndex ? " is-active" : ""}`}
              key={index}
              onClick={() => scrollToIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
