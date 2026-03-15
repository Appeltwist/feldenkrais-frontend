"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export type ForestHomeOfferFilter = {
  slug: string;
  label: string;
};

export type ForestHomeOfferTypeFilter = {
  slug: ForestHomeOfferCard["typeVariant"];
  label: string;
};

export type ForestHomeOfferCard = {
  href: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  typeLabel: string;
  typeVariant: "workshop" | "training" | "class" | "private-session";
  facilitatorLine: string;
  dateLine: string;
  domainSlugs: string[];
};

type ForestHomeOfferExplorerProps = {
  cards: ForestHomeOfferCard[];
  domainFilters: ForestHomeOfferFilter[];
  typeFilters: ForestHomeOfferTypeFilter[];
  labels: {
    domainFilter: string;
    typeFilter: string;
    allDomains: string;
    allTypes: string;
    noResultsTitle: string;
    noResultsBody: string;
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

export default function ForestHomeOfferExplorer({
  cards,
  domainFilters,
  typeFilters,
  labels,
}: ForestHomeOfferExplorerProps) {
  const [activeDomainFilter, setActiveDomainFilter] = useState("all");
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const visibleCards = cards.filter((card) => {
    const matchesDomain =
      activeDomainFilter === "all" || card.domainSlugs.includes(activeDomainFilter);
    const matchesType = activeTypeFilter === "all" || card.typeVariant === activeTypeFilter;
    return matchesDomain && matchesType;
  });

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

  function resetTrack() {
    setActive(0);

    const track = trackRef.current;
    if (!track) {
      return;
    }

    track.scrollTo({ left: 0, behavior: "auto" });
  }

  function handleDomainFilterChange(value: string) {
    setActiveDomainFilter(value);
    resetTrack();
  }

  function handleTypeFilterChange(value: string) {
    setActiveTypeFilter(value);
    resetTrack();
  }

  return (
    <div className="fh-home-explore">
      <div className="fh-home-explore__toolbar">
        <div className="fh-home-explore__select-wrap">
          <label className="fh-home-explore__label" htmlFor="fh-home-offer-filter">
            {labels.domainFilter}
          </label>
          <select
            className="fh-home-explore__select"
            id="fh-home-offer-filter"
            onChange={(event) => handleDomainFilterChange(event.target.value)}
            value={activeDomainFilter}
          >
            <option value="all">{labels.allDomains}</option>
            {domainFilters.map((filter) => (
              <option key={filter.slug} value={filter.slug}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        <div className="fh-home-explore__select-wrap">
          <label className="fh-home-explore__label" htmlFor="fh-home-offer-type-filter">
            {labels.typeFilter}
          </label>
          <select
            className="fh-home-explore__select"
            id="fh-home-offer-type-filter"
            onChange={(event) => handleTypeFilterChange(event.target.value)}
            value={activeTypeFilter}
          >
            <option value="all">{labels.allTypes}</option>
            {typeFilters.map((filter) => (
              <option key={filter.slug} value={filter.slug}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {visibleCards.length > 1 ? (
          <div className="fh-home-explore__controls">
            <button
              aria-label={labels.previous}
              className="fh-home-explore__arrow"
              disabled={active === 0}
              onClick={() => scrollToSlide(active - 1)}
              type="button"
            >
              &#8249;
            </button>
            <button
              aria-label={labels.next}
              className="fh-home-explore__arrow"
              disabled={active >= visibleCards.length - 1}
              onClick={() => scrollToSlide(active + 1)}
              type="button"
            >
              &#8250;
            </button>
          </div>
        ) : null}
      </div>

      {visibleCards.length > 0 ? (
        <>
          <div
            className="fh-home-explore__track"
            onScroll={updateActiveFromScroll}
            ref={trackRef}
          >
            {visibleCards.map((card) => (
              <article className="fh-home-explore-card" key={card.href}>
                <Link
                  className={`fh-home-explore-card__link fh-home-explore-card__link--${card.typeVariant}`}
                  href={card.href}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(2, 10, 11, 0.08), rgba(2, 10, 11, 0.76) 68%, rgba(2, 10, 11, 0.92)), url(${card.imageUrl})`,
                  }}
                >
                  <span className={`fh-home-explore-card__badge fh-home-explore-card__badge--${card.typeVariant}`}>
                    {card.typeLabel}
                  </span>
                  <div className="fh-home-explore-card__content">
                    {card.facilitatorLine ? (
                      <p className="fh-home-explore-card__facilitator">{card.facilitatorLine}</p>
                    ) : null}
                    <h3>{card.title}</h3>
                    {card.excerpt ? <p className="fh-home-explore-card__excerpt">{card.excerpt}</p> : null}
                    {card.dateLine ? <p className="fh-home-explore-card__date">{card.dateLine}</p> : null}
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {visibleCards.length > 1 ? (
            <div className="fh-home-explore__dots">
              {visibleCards.map((card, index) => (
                <button
                  aria-label={`${labels.goTo} ${index + 1}`}
                  className={`fh-home-explore__dot${index === active ? " is-active" : ""}`}
                  key={card.href}
                  onClick={() => scrollToSlide(index)}
                  type="button"
                />
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="forest-empty-state">
          <h3>{labels.noResultsTitle}</h3>
          <p>{labels.noResultsBody}</p>
        </div>
      )}
    </div>
  );
}
