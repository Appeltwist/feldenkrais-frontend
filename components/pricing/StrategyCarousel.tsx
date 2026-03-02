"use client";

import { useRef, useState } from "react";
import type { Strategy } from "@/lib/pricing-content";

export default function StrategyCarousel({ strategies }: { strategies: Strategy[] }) {
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
    <div className="fp-strategy-carousel">
      <p className="fp-strategy-carousel__counter">
        {active + 1} / {strategies.length}
      </p>

      <button
        aria-label="Previous"
        className="fp-slider__arrow fp-slider__arrow--prev"
        disabled={active === 0}
        onClick={() => scrollTo(active - 1)}
        type="button"
      >
        &#8249;
      </button>

      <div className="fp-strategy-carousel__track" onScroll={handleScroll} ref={trackRef}>
        {strategies.map((s, i) => (
          <div className="fp-strategy-carousel__slide" key={i}>
            <span className="fp-strategy-carousel__num">{i + 1}</span>
            <h4 className="fp-strategy-carousel__title">{s.title}</h4>
            <p className="fp-strategy-carousel__desc">{s.description}</p>
          </div>
        ))}
      </div>

      <button
        aria-label="Next"
        className="fp-slider__arrow fp-slider__arrow--next"
        disabled={active === strategies.length - 1}
        onClick={() => scrollTo(active + 1)}
        type="button"
      >
        &#8250;
      </button>

      <div className="fp-slider__dots">
        {strategies.map((_, i) => (
          <button
            aria-label={`Strategy ${i + 1}`}
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
