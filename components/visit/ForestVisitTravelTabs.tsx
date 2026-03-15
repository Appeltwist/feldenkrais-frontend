"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";

import type { ForestVisitLink, ForestVisitTravelTab } from "@/lib/forest-visit-content";
import { isExternalHref, localizePath } from "@/lib/locale-path";

type ForestVisitTravelTabsProps = {
  locale: string;
  tabs: ForestVisitTravelTab[];
};

function resolveVisitHref(locale: string, href: string) {
  return isExternalHref(href) ? href : localizePath(locale, href);
}

function TravelSupportLink({
  locale,
  link,
}: {
  locale: string;
  link: ForestVisitLink;
}) {
  const href = resolveVisitHref(locale, link.href);
  if (isExternalHref(link.href)) {
    const shouldOpenInNewTab = /^https?:/.test(link.href);
    return (
      <a
        className="forest-visit-support-link"
        href={href}
        rel={shouldOpenInNewTab ? "noreferrer" : undefined}
        target={shouldOpenInNewTab ? "_blank" : undefined}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link className="forest-visit-support-link" href={href}>
      {link.label}
    </Link>
  );
}

export default function ForestVisitTravelTabs({ locale, tabs }: ForestVisitTravelTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? "brussels");
  const baseId = useId();
  const activePanel = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];

  function moveFocus(index: number, nextIndex: number) {
    const tabButton = document.getElementById(`${baseId}-tab-${tabs[nextIndex]?.key}`);
    if (!tabs[nextIndex]) {
      return;
    }
    setActiveTab(tabs[nextIndex].key);
    (tabButton as HTMLButtonElement | null)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(index, (index + 1) % tabs.length);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(index, (index - 1 + tabs.length) % tabs.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      moveFocus(index, 0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      moveFocus(index, tabs.length - 1);
    }
  }

  if (!activePanel) {
    return null;
  }

  return (
    <div className="forest-visit-tabs">
      <div
        aria-label={locale.toLowerCase().startsWith("fr") ? "Type de trajet" : "Travel type"}
        className="forest-visit-tabs__list"
        role="tablist"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              aria-controls={`${baseId}-panel-${tab.key}`}
              aria-selected={isActive}
              className={`forest-visit-tabs__tab${isActive ? " is-active" : ""}`}
              id={`${baseId}-tab-${tab.key}`}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`${baseId}-tab-${activePanel.key}`}
        className="forest-visit-tabs__panel"
        id={`${baseId}-panel-${activePanel.key}`}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="forest-visit-tabs__intro">
          <h3 className="forest-visit-tabs__title">{activePanel.title}</h3>
          <p className="forest-visit-tabs__lead">{activePanel.intro}</p>
        </div>

        {activePanel.checklistItems?.length ? (
          <div className="forest-visit-tabs__checklist">
            {activePanel.checklistLabel ? <p className="forest-visit-tabs__kicker">{activePanel.checklistLabel}</p> : null}
            <ul className="forest-visit-tabs__checklist-list">
              {activePanel.checklistItems.map((item) => (
                <li key={`${activePanel.key}-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="forest-visit-tabs__grid">
          {activePanel.sections.map((section) => (
            <article className="forest-visit-tabs__block" key={`${activePanel.key}-${section.title}`}>
              <h4 className="forest-visit-tabs__block-title">{section.title}</h4>
              {section.body ? <p className="forest-visit-tabs__block-body">{section.body}</p> : null}
              {section.items?.length ? (
                <ul className="forest-visit-tabs__block-list">
                  {section.items.map((item) => (
                    <li key={`${section.title}-${item}`}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        {activePanel.supportLink ? <TravelSupportLink link={activePanel.supportLink} locale={locale} /> : null}
      </div>
    </div>
  );
}
