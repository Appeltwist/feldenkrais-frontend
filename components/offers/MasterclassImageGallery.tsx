"use client";

import { useState } from "react";

type MasterclassImageGalleryProps = {
  alt: string;
  images: string[];
};

export default function MasterclassImageGallery({ alt, images }: MasterclassImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return null;
  }

  const safeIndex = Math.min(active, images.length - 1);
  const src = images[safeIndex];

  function showPrevious() {
    setActive((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function showNext() {
    setActive((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="neuro-masterclass-gallery">
      <img
        alt={`${alt} ${safeIndex + 1}`}
        className="neuro-masterclass-gallery__image"
        loading={safeIndex === 0 ? "eager" : "lazy"}
        src={src}
      />

      {images.length > 1 ? (
        <>
          <button
            aria-label="Previous gallery image"
            className="neuro-masterclass-gallery__arrow neuro-masterclass-gallery__arrow--prev"
            onClick={showPrevious}
            type="button"
          >
            &#8249;
          </button>

          <button
            aria-label="Next gallery image"
            className="neuro-masterclass-gallery__arrow neuro-masterclass-gallery__arrow--next"
            onClick={showNext}
            type="button"
          >
            &#8250;
          </button>

          <div className="neuro-masterclass-gallery__counter">
            {safeIndex + 1} / {images.length}
          </div>
        </>
      ) : null}
    </div>
  );
}
