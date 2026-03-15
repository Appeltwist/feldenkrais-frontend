"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── types ── */

type FacilitatorSlide = {
  name: string;
  title?: string;
  imageUrl?: string;
  slug?: string;
  quote?: string;
  bio?: string;
  profileHref?: string;
};

type ForestFacilitatorShowcaseProps = {
  facilitators: FacilitatorSlide[];
  heading?: string;
};

/* ── component ── */

export default function ForestFacilitatorShowcase({
  facilitators,
  heading,
}: ForestFacilitatorShowcaseProps) {
  if (facilitators.length === 0) return null;

  /* single facilitator — static layout */
  if (facilitators.length === 1) {
    return (
      <div className="forest-facilitator-showcase">
        <p className="forest-facilitator-showcase__eyebrow">Votre guide</p>
        {heading ? <h2 className="forest-facilitator-showcase__heading">{heading}</h2> : null}
        <div className="forest-facilitator-showcase__panel">
          <FacilitatorCard f={facilitators[0]} />
        </div>
      </div>
    );
  }

  /* 2+ facilitators — slider */
  return (
    <div className="forest-facilitator-showcase">
      <p className="forest-facilitator-showcase__eyebrow">Votre guide</p>
      {heading ? <h2 className="forest-facilitator-showcase__heading">{heading}</h2> : null}
      <div className="forest-facilitator-showcase__panel">
        <FacilitatorSlider facilitators={facilitators} />
      </div>
    </div>
  );
}

/* ── single card ── */

function FacilitatorCard({ f }: { f: FacilitatorSlide }) {
  const hasQuote = Boolean(f.quote);

  return (
    <div className="forest-facilitator-slide forest-facilitator-slide--centered">
      {/* top: centered avatar + name + title */}
      <div className="forest-facilitator-slide__identity forest-facilitator-slide__identity--centered">
        {f.imageUrl ? (
          <img
            alt={f.name}
            className="forest-facilitator-slide__avatar forest-facilitator-slide__avatar--large"
            loading="lazy"
            src={f.imageUrl}
          />
        ) : (
          <div aria-hidden="true" className="forest-facilitator-slide__avatar-placeholder forest-facilitator-slide__avatar-placeholder--large">
            <svg fill="currentColor" height="48" viewBox="0 0 24 24" width="48">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
        <div className="forest-facilitator-slide__meta forest-facilitator-slide__meta--centered">
          {f.profileHref ? (
            <Link className="forest-facilitator-slide__name-link" href={f.profileHref}>
              <h3 className="forest-facilitator-slide__name">{f.name}</h3>
            </Link>
          ) : (
            <h3 className="forest-facilitator-slide__name">{f.name}</h3>
          )}
          {f.title ? (
            <p className="forest-facilitator-slide__title">{f.title}</p>
          ) : null}
        </div>
      </div>

      {/* middle: bio */}
      {f.bio ? (
        <div
          className="forest-facilitator-slide__bio forest-facilitator-slide__bio--full rich-text"
          dangerouslySetInnerHTML={{ __html: f.bio }}
        />
      ) : null}

      {/* bottom: prominent quote */}
      {hasQuote ? (
        <blockquote className="forest-facilitator-slide__quote forest-facilitator-slide__quote--centered">
          <span aria-hidden="true" className="forest-facilitator-slide__quote-mark forest-facilitator-slide__quote-mark--centered">&ldquo;</span>
          <p>{f.quote}</p>
        </blockquote>
      ) : null}
    </div>
  );
}

/* ── slider for 2+ facilitators ── */

function FacilitatorSlider({ facilitators }: { facilitators: FacilitatorSlide[] }) {
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

  return (
    <div className="forest-facilitator-slider">
      <button
        aria-label="Previous"
        className="forest-facilitator-slider__arrow forest-facilitator-slider__arrow--prev"
        disabled={active === 0}
        onClick={() => scrollTo(active - 1)}
        type="button"
      >
        &#8249;
      </button>

      <div className="forest-facilitator-slider__track" onScroll={handleScroll} ref={trackRef}>
        {facilitators.map((f, i) => (
          <div className="forest-facilitator-slider__slide" key={`fac-${i}`}>
            <FacilitatorCard f={f} />
          </div>
        ))}
      </div>

      <button
        aria-label="Next"
        className="forest-facilitator-slider__arrow forest-facilitator-slider__arrow--next"
        disabled={active === facilitators.length - 1}
        onClick={() => scrollTo(active + 1)}
        type="button"
      >
        &#8250;
      </button>

      <nav aria-label="Facilitator navigation" className="forest-facilitator-slider__dots">
        {facilitators.map((_, i) => (
          <button
            aria-label={`Go to facilitator ${i + 1}`}
            className={`forest-facilitator-slider__dot${i === active ? " forest-facilitator-slider__dot--active" : ""}`}
            key={`dot-${i}`}
            onClick={() => scrollTo(i)}
            type="button"
          />
        ))}
      </nav>
    </div>
  );
}
