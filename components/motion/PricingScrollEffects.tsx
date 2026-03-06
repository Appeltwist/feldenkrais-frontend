"use client";

import { useEffect, useRef } from "react";

type PricingScrollEffectsProps = {
  scopeId: string;
};

export default function PricingScrollEffects({ scopeId }: PricingScrollEffectsProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const scope = document.getElementById(scopeId);
    if (!scope) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    import("gsap").then(({ default: gsap }) =>
      import("gsap/ScrollTrigger").then(({ default: ScrollTrigger }) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        initialized.current = true;

        ctx = gsap.context(() => {
          ScrollTrigger.matchMedia({
            "(min-width: 901px)": () => {
              initHeroFade(gsap, scope);
              initFeatureReveal(gsap, scope);
              initParallaxSections(gsap, scope);

            },
          });
        }, scope);
      })
    );

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [scopeId]);

  return null;
}

/* ── Effect A: Hero Fade ── */

function initHeroFade(
  gsap: typeof import("gsap")["default"],
  scope: HTMLElement
) {
  const section = scope.querySelector("[data-scroll-hero]") as HTMLElement | null;
  const banner = scope.querySelector("[data-scroll-hero-img]") as HTMLElement | null;
  const content = scope.querySelector("[data-scroll-hero-content]") as HTMLElement | null;
  if (!section || !banner) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top+=10%",
      scrub: 0.45,
    },
  });

  tl.to(
    banner,
    {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    },
    0
  );

  if (content) {
    tl.to(
      content,
      {
        opacity: 0,
        y: -18,
        duration: 0.32,
        ease: "power1.in",
      },
      0.05
    );
  }
}

/* ── Effect B: Feature Vertical Reveal ── */

function initFeatureReveal(
  gsap: typeof import("gsap")["default"],
  scope: HTMLElement
) {
  const cards = gsap.utils.toArray<HTMLElement>(
    "[data-scroll-feature-card]",
    scope
  );
  if (!cards.length) return;

  cards.forEach((card) => {
    gsap.set(card, { opacity: 0, y: 60 });

    gsap.to(card, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "top 55%",
        scrub: 0.3,
      },
    });
  });
}

/* ── Effect C: Parallax Detail Sections ── */

function initParallaxSections(
  gsap: typeof import("gsap")["default"],
  scope: HTMLElement
) {
  const sections = gsap.utils.toArray<HTMLElement>(
    "[data-scroll-parallax-section]",
    scope
  );
  if (!sections.length) return;

  sections.forEach((section) => {
    const illus = section.querySelector("[data-scroll-parallax-illus]") as HTMLElement | null;
    const content = section.querySelector("[data-scroll-parallax-content]") as HTMLElement | null;
    const isReverse = section.classList.contains("fp-detail-section--reverse");

    if (illus) {
      gsap.to(illus, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    if (content) {
      const xStart = isReverse ? -60 : 60;
      gsap.set(content, { opacity: 0, x: xStart });

      gsap.to(content, {
        opacity: 1,
        x: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 35%",
          scrub: 0.4,
        },
      });
    }
  });
}
