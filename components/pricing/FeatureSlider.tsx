"use client";

import { useRef, useState } from "react";
import type { FeatureColumn } from "@/lib/pricing-content";

export default function FeatureSlider({ slides }: { slides: FeatureColumn[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function handleScroll() {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActive(idx);
  }

  function scrollTo(idx: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: "smooth" });
  }

  return (
    <div className="fp-slider">
      <button
        aria-label="Previous"
        className="fp-slider__arrow fp-slider__arrow--prev"
        disabled={active === 0}
        onClick={() => scrollTo(active - 1)}
        type="button"
      >
        &#8249;
      </button>

      <div className="fp-slider__track" onScroll={handleScroll} ref={trackRef}>
        {slides.map((slide, i) => (
          <div className="fp-slider__slide" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="fp-slider__image" loading="lazy" src={slide.image} />
            <h3 className="fp-slider__title">{slide.title}</h3>
            {slide.paragraphs.map((p, j) => (
              <p className="fp-slider__text" key={j}>{p}</p>
            ))}
          </div>
        ))}
      </div>

      <button
        aria-label="Next"
        className="fp-slider__arrow fp-slider__arrow--next"
        disabled={active === slides.length - 1}
        onClick={() => scrollTo(active + 1)}
        type="button"
      >
        &#8250;
      </button>

      <div className="fp-slider__dots">
        {slides.map((_, i) => (
          <button
            aria-label={`Slide ${i + 1}`}
            className={`fp-slider__dot${i === active ? " fp-slider__dot--active" : ""}`}
            key={i}
            onClick={() => scrollTo(i)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
