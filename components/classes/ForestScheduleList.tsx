"use client";

import { useCallback, useMemo, useState } from "react";

import type { ScheduleDay } from "@/lib/pricing-content";

type ForestScheduleListProps = {
  days: ScheduleDay[];
  labels: {
    allClassesLabel: string;
    classDetailsLabel: string;
    classBookLabel: string;
    classTeacherPrefix: string;
    scheduleScrollHint: string;
  };
};

export default function ForestScheduleList({
  days,
  labels,
}: ForestScheduleListProps) {
  const [openRowKey, setOpenRowKey] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const toggle = useCallback((key: string) => {
    setOpenRowKey((prev) => (prev === key ? null : key));
  }, []);

  /* Group similar class names under one filter label */
  const filterGroup = useCallback((className: string): string => {
    const lower = className.toLowerCase();
    if (lower.includes("vinyasa")) return "Vinyasa Yoga";
    return className;
  }, []);

  /* Extract unique filter groups + their associated color for filter chips */
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const day of days) {
      for (const entry of day.entries) {
        const group = filterGroup(entry.className);
        if (!seen.has(group)) {
          seen.set(group, entry.color || "rgba(0,55,56,0.55)");
        }
      }
    }
    return Array.from(seen, ([name, color]) => ({ name, color }));
  }, [days, filterGroup]);

  /* Filter days to only include entries matching the active filter group */
  const filteredDays = useMemo(() => {
    if (!activeFilter) return days;
    return days
      .map((day) => ({
        ...day,
        entries: day.entries.filter((e) => filterGroup(e.className) === activeFilter),
      }))
      .filter((day) => day.entries.length > 0);
  }, [days, activeFilter, filterGroup]);

  return (
    <div className="fp-schedule-list">
      {/* ── Category filter chips ── */}
      <div className="fp-schedule-filters" role="group" aria-label="Filter by class">
        <button
          className={`fp-schedule-filter${activeFilter === null ? " is-active" : ""}`}
          onClick={() => setActiveFilter(null)}
          type="button"
        >
          {labels.allClassesLabel}
        </button>
        {categories.map((cat) => (
          <button
            className={`fp-schedule-filter${activeFilter === cat.name ? " is-active" : ""}`}
            key={cat.name}
            onClick={() => setActiveFilter(activeFilter === cat.name ? null : cat.name)}
            type="button"
            style={{
              "--filter-bg": cat.color,
            } as React.CSSProperties}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Day groups ── */}
      {filteredDays.map((day) => (
        <div className="fp-schedule-list__day" key={day.day}>
          <h3 className="fp-schedule-list__day-name">{day.day}</h3>
          <ul className="fp-schedule-list__entries">
            {day.entries.map((entry, index) => {
              const rowKey = `${day.day}-${entry.className}-${entry.time}-${index}`;
              const isOpen = openRowKey === rowKey;
              const hasDetails = !!(entry.description || entry.bookingUrl);

              return (
                <li className="fp-schedule-list__item" key={rowKey}>
                  <button
                    className={`fp-schedule-list__row${isOpen ? " is-expanded" : ""}`}
                    onClick={hasDetails ? () => toggle(rowKey) : undefined}
                    type="button"
                    aria-expanded={hasDetails ? isOpen : undefined}
                    style={{
                      cursor: hasDetails ? "pointer" : "default",
                      background: entry.color || "rgba(0,55,56,0.35)",
                    }}
                  >
                    <span className="fp-schedule-list__time">{entry.time}</span>
                    <span className="fp-schedule-list__name">{entry.className}</span>
                    {entry.instructor ? (
                      <span className="fp-schedule-list__teacher">
                        {labels.classTeacherPrefix} {entry.instructor}
                      </span>
                    ) : null}
                    <span className="fp-schedule-list__langs">
                      {entry.languages.map((lang) => (
                        <span className="fp-schedule-list__lang" key={lang}>
                          {lang}
                        </span>
                      ))}
                    </span>
                    {entry.level && (
                      <span className="fp-schedule-list__level">{entry.level}</span>
                    )}
                    {hasDetails && (
                      <span
                        aria-hidden="true"
                        className={`fp-schedule-list__toggle${isOpen ? " is-open" : ""}`}
                      />
                    )}
                  </button>

                  {hasDetails && (
                    <div
                      className={`fp-class-expand${isOpen ? " is-open" : ""}`}
                      style={{
                        maxHeight: isOpen ? "24rem" : "0px",
                      }}
                    >
                      <div
                        className="fp-schedule-list__details"
                        style={{ background: entry.color || "rgba(0,55,56,0.35)" }}
                      >
                        <div className="fp-schedule-list__details-inner">
                          {entry.instructorImage ? (
                            <img
                              alt={entry.instructor}
                              className="fp-schedule-list__avatar"
                              src={entry.instructorImage}
                            />
                          ) : entry.instructor ? (
                            <span className="fp-schedule-list__avatar fp-schedule-list__avatar--initials" aria-hidden="true">
                              {entry.instructor.charAt(0)}
                            </span>
                          ) : null}
                          <div className="fp-schedule-list__details-body">
                            {entry.description && (
                              <p className="fp-schedule-list__desc">{entry.description}</p>
                            )}
                            {entry.bookingUrl && (
                              <a
                                className="fp-class-desc__book"
                                href={entry.bookingUrl}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {labels.classBookLabel}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
