"use client";

import { useEffect } from "react";

type RevealObserverProps = {
  scopeId: string;
  rootMargin?: string;
  threshold?: number;
};

export default function RevealObserver({
  scopeId,
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.18,
}: RevealObserverProps) {
  useEffect(() => {
    const scope = document.getElementById(scopeId);
    if (!scope) return;

    const targets = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scope.classList.add("motion-active");

    for (const target of targets) {
      if (target.dataset.reveal !== "stagger") continue;
      const children = Array.from(target.children);
      for (let index = 0; index < children.length; index += 1) {
        const child = children[index];
        if (child instanceof HTMLElement) {
          child.style.setProperty("--i", prefersReducedMotion ? "0" : `${index}`);
        }
      }
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      for (const target of targets) {
        target.classList.add("is-visible");
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");
          observer.unobserve(target);
        }
      },
      { root: null, rootMargin, threshold }
    );

    for (const target of targets) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, [scopeId, rootMargin, threshold]);

  return null;
}
