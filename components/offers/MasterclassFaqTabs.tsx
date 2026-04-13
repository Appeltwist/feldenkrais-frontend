"use client";

import { useState } from "react";

import type { MasterclassFaqTab } from "@/lib/masterclass-landing";

type MasterclassFaqTabsProps = {
  title: string;
  tabs: MasterclassFaqTab[];
};

export default function MasterclassFaqTabs({
  title,
  tabs,
}: MasterclassFaqTabsProps) {
  const availableTabs = tabs.filter((tab) => tab.items.length > 0);
  const [activeTabId, setActiveTabId] = useState(availableTabs[0]?.id ?? "");
  const activeTab = availableTabs.find((tab) => tab.id === activeTabId) ?? availableTabs[0] ?? null;

  if (!activeTab) {
    return null;
  }

  return (
    <section className="neuro-masterclass-faq">
      <h2>{title}</h2>

      <div className="neuro-masterclass-faq__tabs" role="tablist" aria-label={title}>
        {availableTabs.map((tab) => (
          <button
            aria-selected={tab.id === activeTab.id}
            className={`neuro-masterclass-faq__tab${tab.id === activeTab.id ? " is-active" : ""}`}
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="neuro-masterclass-faq__panel" role="tabpanel">
        {activeTab.items.map((item, index) => (
          <details className="neuro-masterclass-faq__item" key={`${item.question}-${index}`} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
