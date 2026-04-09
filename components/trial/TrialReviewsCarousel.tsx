"use client";

import { useEffect, useRef, useState } from "react";

import type { TrialReview, TrialReviewsLabels } from "@/lib/trial-reviews-content";

type TrialReviewsCarouselProps = {
  ctaHref: string;
  labels: TrialReviewsLabels;
  reviews: TrialReview[];
};

function findNearestSlide(track: HTMLDivElement) {
  const children = Array.from(track.children) as HTMLElement[];
  if (children.length === 0) {
    return 0;
  }

  const midpoint = track.scrollLeft + track.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  children.forEach((child, index) => {
    const childMidpoint = child.offsetLeft + child.offsetWidth / 2;
    const distance = Math.abs(midpoint - childMidpoint);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

export default function TrialReviewsCarousel({
  ctaHref,
  labels,
  reviews,
}: TrialReviewsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [active, setActive] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);

  function clearAutoplayTimer() {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }

  function clearResumeTimer() {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }

  function scrollToSlide(index: number) {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const target = track.children[index] as HTMLElement | undefined;
    if (!target) {
      return;
    }

    setActive(index);
    track.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  }

  function scheduleAutoplay(delay = 4800) {
    clearAutoplayTimer();

    if (
      reviews.length <= 1 ||
      reducedMotionRef.current ||
      hoverRef.current ||
      focusRef.current ||
      !autoplayEnabled
    ) {
      return;
    }

    autoplayTimerRef.current = setTimeout(() => {
      const nextIndex = active >= reviews.length - 1 ? 0 : active + 1;
      scrollToSlide(nextIndex);
    }, delay);
  }

  function pauseAutoplay(resumeDelay = 4800) {
    clearAutoplayTimer();
    clearResumeTimer();

    if (reviews.length <= 1 || reducedMotionRef.current) {
      return;
    }

    resumeTimerRef.current = setTimeout(() => {
      if (!hoverRef.current && !focusRef.current) {
        scheduleAutoplay();
      }
    }, resumeDelay);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    setActive(findNearestSlide(track));
  }

  function handleMouseEnter() {
    hoverRef.current = true;
    clearAutoplayTimer();
    clearResumeTimer();
  }

  function handleMouseLeave() {
    hoverRef.current = false;
    scheduleAutoplay(1800);
  }

  function handleFocusCapture() {
    focusRef.current = true;
    clearAutoplayTimer();
    clearResumeTimer();
  }

  function handleBlurCapture(event: React.FocusEvent<HTMLElement>) {
    const container = event.currentTarget;

    requestAnimationFrame(() => {
      if (!container.contains(document.activeElement)) {
        focusRef.current = false;
        scheduleAutoplay(1800);
      }
    });
  }

  function handleManualNavigation(index: number) {
    scrollToSlide(index);
    pauseAutoplay();
  }

  useEffect(() => {
    if (reviews.length <= 1) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncMotionPreference() {
      reducedMotionRef.current = mediaQuery.matches;
      setAutoplayEnabled(!mediaQuery.matches);
    }

    syncMotionPreference();

    mediaQuery.addEventListener("change", syncMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncMotionPreference);
    };
  }, [reviews.length]);

  useEffect(() => {
    if (reviews.length <= 1) {
      return undefined;
    }

    clearAutoplayTimer();

    if (
      reducedMotionRef.current ||
      hoverRef.current ||
      focusRef.current ||
      !autoplayEnabled
    ) {
      return undefined;
    }

    autoplayTimerRef.current = setTimeout(() => {
      const nextIndex = active >= reviews.length - 1 ? 0 : active + 1;
      scrollToSlide(nextIndex);
    }, 4800);

    return () => {
      clearAutoplayTimer();
    };
  }, [active, autoplayEnabled, reviews.length]);

  useEffect(() => {
    return () => {
      clearAutoplayTimer();
      clearResumeTimer();
    };
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={labels.sectionLabel}
      className="trial-reviews"
      onBlurCapture={handleBlurCapture}
      onFocusCapture={handleFocusCapture}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={() => pauseAutoplay()}
      onTouchStart={() => pauseAutoplay()}
    >
      <div className="trial-reviews__header">
        <div className="trial-reviews__intro">
          {labels.eyebrow ? <p className="trial-reviews__eyebrow">{labels.eyebrow}</p> : null}
          <h2 className="trial-reviews__title">{labels.title}</h2>
          {labels.intro ? <p className="trial-reviews__summary">{labels.intro}</p> : null}
        </div>

        <a className="trial-reviews__cta" href={ctaHref} rel="noopener noreferrer" target="_blank">
          {labels.ctaLabel}
        </a>
      </div>

      {reviews.length > 1 ? (
        <div className="trial-reviews__controls">
          <button
            aria-label={labels.previousLabel}
            className="trial-reviews__arrow"
            disabled={active === 0}
            onClick={() => handleManualNavigation(active - 1)}
            type="button"
          >
            &#8249;
          </button>
          <button
            aria-label={labels.nextLabel}
            className="trial-reviews__arrow"
            disabled={active >= reviews.length - 1}
            onClick={() => handleManualNavigation(active + 1)}
            type="button"
          >
            &#8250;
          </button>
        </div>
      ) : null}

      <div
        aria-label={labels.trackLabel}
        className="trial-reviews__track"
        onScroll={handleScroll}
        ref={trackRef}
      >
        {reviews.map((review, index) => (
          <article className="trial-reviews__card" key={`${review.author}-${index}`}>
            <div className="trial-reviews__card-head">
              <p className="trial-reviews__author">{review.author}</p>
            </div>
            <p className="trial-reviews__body">{review.body}</p>
          </article>
        ))}
      </div>

      {reviews.length > 1 ? (
        <div className="trial-reviews__dots">
          {reviews.map((review, index) => (
            <button
              aria-label={`${labels.goToLabel} ${index + 1}`}
              className={`trial-reviews__dot${index === active ? " is-active" : ""}`}
              key={`${review.author}-dot-${index}`}
              onClick={() => handleManualNavigation(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
