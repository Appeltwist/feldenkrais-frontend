import Link from "next/link";

export type CalendarListEntry = {
  id: number | string;
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

export function ForestCalendarEntryList({ entries }: { entries: CalendarListEntry[] }) {
  return (
    <div className="fp-calendar-list-wrap">
      {entries.length === 0 ? (
        <p className="forest-empty-state" style={{ marginTop: "2rem" }}>
          —
        </p>
      ) : (
        <ul className="fp-calendar-list">
          {entries.map((entry) => (
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

export default function ForestCalendarList({ entries }: { entries: CalendarListEntry[] }) {
  return <ForestCalendarEntryList entries={entries} />;
}
