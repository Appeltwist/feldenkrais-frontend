"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type ForestHomeClassSlide = {
  href: string;
  title: string;
  imageUrl: string;
  facilitatorName: string;
  supportingText: string;
  nextOccurrenceLabel: string;
  badgeLabel: string;
};

type ForestHomeClassesSliderProps = {
  slides: ForestHomeClassSlide[];
  labels: {
    previous: string;
    next: string;
    goTo: string;
  };
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

export default function ForestHomeClassesSlider({ slides, labels }: ForestHomeClassesSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    setActive(findNearestSlide(track));
  }, [slides.length]);

  function updateActiveFromScroll() {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    setActive(findNearestSlide(track));
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

    track.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="fh-home-classes-slider">
      {slides.length > 1 ? (
        <div className="fh-home-classes-slider__controls">
          <button
            aria-label={labels.previous}
            className="fh-home-classes-slider__arrow fh-home-classes-slider__arrow--prev"
            disabled={active === 0}
            onClick={() => scrollToSlide(active - 1)}
            type="button"
          >
            &#8249;
          </button>
          <button
            aria-label={labels.next}
            className="fh-home-classes-slider__arrow fh-home-classes-slider__arrow--next"
            disabled={active >= slides.length - 1}
            onClick={() => scrollToSlide(active + 1)}
            type="button"
          >
            &#8250;
          </button>
        </div>
      ) : null}

      <div
        className="fh-home-classes-slider__track"
        onScroll={updateActiveFromScroll}
        ref={trackRef}
      >
        {slides.map((slide) => (
          <article className="fh-home-class-card" key={slide.href}>
            <Link
              className="fh-home-class-card__link"
              href={slide.href}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(2, 10, 11, 0.04), rgba(2, 10, 11, 0.74) 70%, rgba(2, 10, 11, 0.9)), url(${slide.imageUrl})`,
              }}
            >
              <span className="fh-home-class-card__badge">{slide.badgeLabel}</span>
              <div className="fh-home-class-card__body">
                <p className="fh-home-class-card__teacher">{slide.facilitatorName}</p>
                <h3 className="fh-home-class-card__title">{slide.title}</h3>
                {slide.supportingText ? (
                  <p className="fh-home-class-card__supporting">{slide.supportingText}</p>
                ) : null}
                {slide.nextOccurrenceLabel ? (
                  <p className="fh-home-class-card__time">{slide.nextOccurrenceLabel}</p>
                ) : null}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="fh-home-classes-slider__dots">
          {slides.map((slide, index) => (
            <button
              aria-label={`${labels.goTo} ${index + 1}`}
              className={`fh-home-classes-slider__dot${index === active ? " is-active" : ""}`}
              key={slide.href}
              onClick={() => scrollToSlide(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
