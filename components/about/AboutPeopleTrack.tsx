"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type AboutPerson = {
  id: string;
  name: string;
  role: string;
  summary: string;
  photoUrl?: string;
  imageAlt: string;
  href?: string;
};

type AboutPeopleTrackProps = {
  people: AboutPerson[];
  ctaLabel: string;
};

export default function AboutPeopleTrack({ people, ctaLabel }: AboutPeopleTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const speedRef = useRef(0.5); // px per frame

  useEffect(() => {
    if (!isAutoScrolling) {
      return () => cancelAnimationFrame(rafRef.current);
    }

    function tick() {
      const el = trackRef.current;
      if (!el) {
        return;
      }

      el.scrollLeft += speedRef.current;

      // loop: when reaching the end, jump back to start
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollLeft = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAutoScrolling]);

  /* ── pause on interaction, resume after delay ── */
  function pauseAutoScroll() {
    setIsAutoScrolling(false);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 4000); // resume after 4s of no interaction
  }

  function handleWheel() {
    pauseAutoScroll();
  }

  function handlePointerDown() {
    pauseAutoScroll();
  }

  function handleScroll() {
    // Only pause if user is manually scrolling (not auto)
    if (!isAutoScrolling) return;
  }

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  return (
    <div
      className="forest-about-people-track"
      onPointerDown={handlePointerDown}
      onScroll={handleScroll}
      onWheel={handleWheel}
      ref={trackRef}
    >
      {people.map((person) => (
        <article className="forest-about-person-chip" key={person.id}>
          {person.photoUrl ? (
            <img
              alt={person.imageAlt}
              className="forest-about-person-chip__avatar"
              loading="lazy"
              src={person.photoUrl}
            />
          ) : (
            <div
              aria-hidden="true"
              className="forest-about-person-chip__avatar forest-about-person-chip__avatar--placeholder"
            />
          )}
          <div className="forest-about-person-chip__body">
            <p className="forest-about-person-chip__role">{person.role}</p>
            <h3 className="forest-about-person-chip__name">{person.name}</h3>
            <p className="forest-about-person-chip__summary">{person.summary}</p>
            {person.href ? (
              <Link className="text-link forest-about-person-chip__link" href={person.href}>
                {ctaLabel}
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
