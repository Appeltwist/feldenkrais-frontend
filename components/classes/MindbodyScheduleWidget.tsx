"use client";

import { useEffect, useRef } from "react";

const MINDBODY_WIDGET_SCRIPT_SRC = "https://brandedweb.mindbodyonline.com/embed/widget.js";
const MINDBODY_WIDGET_GLOBAL_KEY = "bw-widget-unique-identifier";
const MINDBODY_WIDGET_STYLE_MARKER = ".bw-widget-styles";

type MindbodyScheduleWidgetProps = {
  widgetId: string;
  className?: string;
  loadingLabel?: string;
};

function resetMindbodyArtifacts(container: HTMLDivElement | null) {
  container?.replaceChildren();

  document.querySelectorAll(`script[src="${MINDBODY_WIDGET_SCRIPT_SRC}"]`).forEach((node) => {
    node.parentNode?.removeChild(node);
  });

  document.querySelectorAll("style").forEach((style) => {
    if (style.textContent?.includes(MINDBODY_WIDGET_STYLE_MARKER)) {
      style.parentNode?.removeChild(style);
    }
  });

  const widgetWindow = window as unknown as Window & Record<string, unknown>;
  delete widgetWindow[MINDBODY_WIDGET_GLOBAL_KEY];
}

export default function MindbodyScheduleWidget({
  widgetId,
  className = "",
  loadingLabel = "Loading schedule...",
}: MindbodyScheduleWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = widgetRef.current;
    if (!container) {
      return undefined;
    }

    resetMindbodyArtifacts(container);

    const script = document.createElement("script");
    script.async = true;
    script.src = MINDBODY_WIDGET_SCRIPT_SRC;
    script.dataset.mindbodyWidget = widgetId;
    document.body.appendChild(script);

    return () => {
      script.parentNode?.removeChild(script);
      resetMindbodyArtifacts(container);
    };
  }, [widgetId]);

  return (
    <div
      className={`mindbody-widget forest-mindbody-widget ${className}`.trim()}
      data-widget-id={widgetId}
      data-widget-type="Schedules"
      data-loading-label={loadingLabel}
      ref={widgetRef}
    />
  );
}
