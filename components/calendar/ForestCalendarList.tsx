"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

export type CalendarListEntry = {
  id: number;
  title: string;
  href: string;
  type: string;
  typeLabel: string;
  dateLabel: string;
  timeLabel: string;
  description?: string;
  facilitator?: string;
  domainsLabel: string;
  heroImageUrl?: string;
  color: string;
};

type FilterKey = "all" | "class" | "workshop" | "training";

const OFFERS_PER_PAGE = 12;

const TYPE_COLORS: Record<string, string> = {
  WORKSHOP: "rgba(210, 170, 60, 0.50)",
  TRAINING_INFO: "rgba(60, 120, 180, 0.50)",
  CLASS: "rgba(60, 140, 80, 0.45)",
  PRIVATE_SESSION: "rgba(120, 80, 160, 0.45)",
};

export default function ForestCalendarList({
  entries,
  labels,
}: {
  entries: CalendarListEntry[];
  labels: {
    all: string;
    classes: string;
    workshops: string;
    trainings: string;
    loadMore: string;
  };
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [visibleCount, setVisibleCount] = useState(OFFERS_PER_PAGE);

  const filtered = useMemo(() => {
    if (filter === "all") return entries;
    if (filter === "class")
      return entries.filter((e) => e.type === "CLASS");
    if (filter === "workshop")
      return entries.filter((e) => e.type === "WORKSHOP");
    if (filter === "training")
      return entries.filter((e) => e.type === "TRAINING_INFO");
    return entries;
  }, [entries, filter]);

  const counts = useMemo(() => {
    const c = entries.filter((e) => e.type === "CLASS").length;
    const w = entries.filter((e) => e.type === "WORKSHOP").length;
    const t = entries.filter((e) => e.type === "TRAINING_INFO").length;
    return { class: c, workshop: w, training: t };
  }, [entries]);

  function setFilterValue(key: FilterKey) {
    setFilter((prev) => (prev === key ? "all" : key));
    setVisibleCount(OFFERS_PER_PAGE);
  }

  const visibleEntries = filtered.slice(0, visibleCount);
  const hasMoreEntries = visibleCount < filtered.length;

  return (
    <div className="fp-calendar-list-wrap">
      {/* ── Filter chips ── */}
      <div
        className="fp-calendar-filters"
        role="group"
        aria-label="Filter by type"
      >
        <button
          className={`fp-calendar-filter${filter === "all" ? " is-active" : ""}`}
          onClick={() => {
            setFilter("all");
            setVisibleCount(OFFERS_PER_PAGE);
          }}
          type="button"
        >
          {labels.all}
        </button>
        {counts.class > 0 && (
          <button
            className={`fp-calendar-filter${filter === "class" ? " is-active" : ""}`}
            onClick={() => setFilterValue("class")}
            type="button"
            style={
              {
                "--filter-accent": TYPE_COLORS.CLASS,
              } as React.CSSProperties
            }
          >
            {labels.classes}
          </button>
        )}
        {counts.workshop > 0 && (
          <button
            className={`fp-calendar-filter${filter === "workshop" ? " is-active" : ""}`}
            onClick={() => setFilterValue("workshop")}
            type="button"
            style={
              {
                "--filter-accent": TYPE_COLORS.WORKSHOP,
              } as React.CSSProperties
            }
          >
            {labels.workshops}
          </button>
        )}
        {counts.training > 0 && (
          <button
            className={`fp-calendar-filter${filter === "training" ? " is-active" : ""}`}
            onClick={() => setFilterValue("training")}
            type="button"
            style={
              {
                "--filter-accent": TYPE_COLORS.TRAINING_INFO,
              } as React.CSSProperties
            }
          >
            {labels.trainings}
          </button>
        )}
      </div>

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <p className="forest-empty-state" style={{ marginTop: "2rem" }}>
          —
        </p>
      ) : (
        <>
          <ul className="fp-calendar-list">
            {visibleEntries.map((entry) => (
            <li className="fp-calendar-item" key={entry.id}>
              <Link
                className="fp-calendar-item__link"
                href={entry.href}
                style={
                  {
                    "--cal-accent": entry.color,
                  } as React.CSSProperties
                }
              >
                <div className="fp-calendar-item__thumb">
                  {entry.heroImageUrl ? (
                    <img
                      alt=""
                      className="fp-calendar-item__image"
                      src={entry.heroImageUrl}
                    />
                  ) : (
                    <span className="fp-calendar-item__image-placeholder" />
                  )}
                </div>
                <div className="fp-calendar-item__date">
                  <span className="fp-calendar-item__day">{entry.dateLabel}</span>
                  {entry.timeLabel ? (
                    <span className="fp-calendar-item__time">{entry.timeLabel}</span>
                  ) : null}
                </div>
                <div className="fp-calendar-item__body">
                  <h2 className="fp-calendar-item__title">{entry.title}</h2>
                  {entry.description ? (
                    <p className="fp-calendar-item__desc">{entry.description}</p>
                  ) : null}
                  <div className="fp-calendar-item__meta">
                    <span className="fp-calendar-item__type">{entry.typeLabel}</span>
                    {entry.facilitator ? (
                      <span className="fp-calendar-item__facilitator">
                        {entry.facilitator}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className="fp-calendar-item__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
            ))}
          </ul>

          {hasMoreEntries ? (
            <div className="fp-calendar-list__footer">
              <button
                className="button-link button-link--secondary"
                onClick={() => setVisibleCount((current) => current + OFFERS_PER_PAGE)}
                type="button"
              >
                {labels.loadMore}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
