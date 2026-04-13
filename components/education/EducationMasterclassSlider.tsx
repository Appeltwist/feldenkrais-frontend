"use client";

import type { ReactNode } from "react";
import { Children, useEffect, useRef, useState } from "react";

type EducationMasterclassSliderProps = {
  ariaLabel: string;
  children: ReactNode;
};

export default function EducationMasterclassSlider({
  ariaLabel,
  children,
}: EducationMasterclassSliderProps) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(items.length > 3);

  function updateButtons() {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setCanScrollPrev(track.scrollLeft > 8);
    setCanScrollNext(track.scrollLeft < maxScrollLeft - 8);
  }

  function scrollByPage(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.scrollBy({
      left: track.clientWidth * 0.92 * direction,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    updateButtons();

    const track = trackRef.current;
    if (!track) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => updateButtons());
    resizeObserver.observe(track);
    window.addEventListener("resize", updateButtons);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateButtons);
    };
  }, [items.length]);

  return (
    <div className="neuro-masterclass-slider">
      <button
        aria-label="Previous masterclasses"
        className="neuro-masterclass-slider__arrow neuro-masterclass-slider__arrow--prev"
        disabled={!canScrollPrev}
        onClick={() => scrollByPage(-1)}
        type="button"
      >
        &#8249;
      </button>

      <div
        aria-label={ariaLabel}
        className="neuro-masterclass-slider__track"
        onScroll={updateButtons}
        ref={trackRef}
      >
        {items.map((item, index) => (
          <div className="neuro-masterclass-slider__slide" key={index}>
            {item}
          </div>
        ))}
      </div>

      <button
        aria-label="Next masterclasses"
        className="neuro-masterclass-slider__arrow neuro-masterclass-slider__arrow--next"
        disabled={!canScrollNext}
        onClick={() => scrollByPage(1)}
        type="button"
      >
        &#8250;
      </button>
    </div>
  );
}
