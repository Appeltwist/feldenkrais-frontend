"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ForestImageGalleryProps = {
  images: string[];
  alt?: string;
};

export default function ForestImageGallery({ images, alt = "" }: ForestImageGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActive(idx);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  function scrollTo(idx: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: "smooth" });
  }

  if (images.length === 0) return null;

  return (
    <div className="forest-gallery">
      <div className="forest-gallery__viewport">
        {/* prev arrow */}
        <button
          aria-label="Previous image"
          className="forest-gallery__arrow forest-gallery__arrow--prev"
          disabled={active === 0}
          onClick={() => scrollTo(active - 1)}
          type="button"
        >
          &#8249;
        </button>

        {/* scrolling track */}
        <div className="forest-gallery__track" onScroll={handleScroll} ref={trackRef}>
          {images.map((src, i) => (
            <div className="forest-gallery__slide" key={src}>
              <img
                alt={alt ? `${alt} ${i + 1}` : `Photo ${i + 1}`}
                className="forest-gallery__img"
                loading={i === 0 ? "eager" : "lazy"}
                src={src}
              />
            </div>
          ))}
        </div>

        {/* next arrow */}
        <button
          aria-label="Next image"
          className="forest-gallery__arrow forest-gallery__arrow--next"
          disabled={active === images.length - 1}
          onClick={() => scrollTo(active + 1)}
          type="button"
        >
          &#8250;
        </button>
      </div>

      {/* dots */}
      {images.length > 1 ? (
        <nav aria-label="Gallery navigation" className="forest-gallery__dots">
          {images.map((_, i) => (
            <button
              aria-label={`Go to image ${i + 1}`}
              className={`forest-gallery__dot${i === active ? " forest-gallery__dot--active" : ""}`}
              key={`dot-${i}`}
              onClick={() => scrollTo(i)}
              type="button"
            />
          ))}
        </nav>
      ) : null}

      {/* counter */}
      <p className="forest-gallery__counter">
        {active + 1} / {images.length}
      </p>
    </div>
  );
}
