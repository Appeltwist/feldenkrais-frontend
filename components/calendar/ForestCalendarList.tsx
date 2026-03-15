"use client";

import { useCallback, useMemo, useState } from "react";

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

const TYPE_COLORS: Record<string, string> = {
  WORKSHOP: "rgba(210, 170, 60, 0.50)",
  TRAINING_INFO: "rgba(60, 120, 180, 0.50)",
  CLASS: "rgba(60, 140, 80, 0.45)",
  PRIVATE_SESSION: "rgba(120, 80, 160, 0.45)",
};

/** Used internally by the client component for filter chip accents */
function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toUpperCase()] ?? "rgba(0, 55, 56, 0.45)";
}

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
  };
}) {
  const [filter, setFilter] = useState<FilterKey>("all");

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

  const setFilterCb = useCallback(
    (key: FilterKey) => setFilter((prev) => (prev === key ? "all" : key)),
    [],
  );

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
          onClick={() => setFilter("all")}
          type="button"
        >
          {labels.all}
        </button>
        {counts.class > 0 && (
          <button
            className={`fp-calendar-filter${filter === "class" ? " is-active" : ""}`}
            onClick={() => setFilterCb("class")}
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
            onClick={() => setFilterCb("workshop")}
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
            onClick={() => setFilterCb("training")}
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
        <ul className="fp-calendar-list">
          {filtered.map((entry) => (
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
      )}
    </div>
  );
}
