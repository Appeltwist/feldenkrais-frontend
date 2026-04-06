"use client";

import { useState } from "react";

type ContactEntry = {
  slug: string;
  label: string;
  centerName: string;
  email: string;
  phone: string;
  lines: string[];
  icon: "mountain" | "city" | "building";
};

type EducationContactTabsProps = {
  locale: string;
  entries: ContactEntry[];
};

function t(locale: string, fr: string, en: string) {
  return locale.toLowerCase().startsWith("fr") ? fr : en;
}

function ContactIcon({ icon }: { icon: ContactEntry["icon"] }) {
  if (icon === "mountain") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M3 18 10.2 6.5c.5-.8 1.6-.8 2.1 0L21 18H3Z" />
      </svg>
    );
  }

  if (icon === "city") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M3 20V9h5v11H3Zm6 0V4h6v16H9Zm7 0v-8h5v8h-5ZM5 11h1v1H5v-1Zm0 3h1v1H5v-1Zm6-7h1v1h-1V7Zm0 3h1v1h-1v-1Zm0 3h1v1h-1v-1Zm3-6h1v1h-1V7Zm0 3h1v1h-1v-1Zm0 3h1v1h-1v-1Zm4 1h1v1h-1v-1Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 4h14v16H5V4Zm3 2v2h2V6H8Zm0 4v2h2v-2H8Zm0 4v2h2v-2H8Zm4-8v2h4V6h-4Zm0 4v2h4v-2h-4Zm0 4v2h4v-2h-4Z" />
    </svg>
  );
}

export default function EducationContactTabs({
  locale,
  entries,
}: EducationContactTabsProps) {
  const [activeSlug, setActiveSlug] = useState(entries[0]?.slug ?? "");
  const activeEntry = entries.find((entry) => entry.slug === activeSlug) ?? entries[0] ?? null;

  if (!activeEntry) {
    return null;
  }

  return (
    <div className="education-contact-tabs">
      <div className="education-contact-tabs__list" role="tablist">
        {entries.map((entry) => {
          const isActive = entry.slug === activeEntry.slug;
          return (
            <button
              aria-selected={isActive}
              className={`education-contact-tabs__tab${isActive ? " is-active" : ""}`}
              key={entry.slug}
              onClick={() => setActiveSlug(entry.slug)}
              role="tab"
              type="button"
            >
              <ContactIcon icon={entry.icon} />
              <span>{entry.label}</span>
            </button>
          );
        })}
      </div>

      <div className="education-contact-tabs__panel" role="tabpanel">
        <h3>{t(locale, "Contact", "Get in touch")}</h3>
        <a href={`mailto:${activeEntry.email}`}>{activeEntry.email}</a>
        <a href={`tel:${activeEntry.phone.replace(/\s+/g, "")}`}>{activeEntry.phone}</a>
        <p className="education-contact-tabs__center-name">{activeEntry.centerName}</p>
        <div className="education-contact-tabs__address">
          {activeEntry.lines.map((line) => (
            <p key={`${activeEntry.slug}-${line}`}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
