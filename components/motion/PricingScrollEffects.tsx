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
              initCommitmentZone(gsap, scope);
              initCommitmentPin(gsap, ScrollTrigger, scope);
              initBotanicals(gsap, scope);
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
  const leaves = scope.querySelector("[data-scroll-hero-leaves]") as HTMLElement | null;
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

  /* Leaves zoom in as hero fades — creates visual bridge to steps */
  if (leaves) {
    tl.fromTo(
      leaves,
      { scale: 0.2, opacity: 0 },
      { scale: 0.8, opacity: 0.15, duration: 1, ease: "power1.out" },
      0.15
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

/* ── Effect D: Commitment Zone Fade-in ── */

function initCommitmentZone(
  gsap: typeof import("gsap")["default"],
  scope: HTMLElement
) {
  const section = scope.querySelector(".fp-commitment-reveal") as HTMLElement | null;
  if (!section) return;

  gsap.fromTo(
    section,
    { "--zone-opacity": 0 } as Record<string, number>,
    {
      "--zone-opacity": 1,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "top 45%",
        scrub: 0.4,
      },
    } as gsap.TweenVars
  );
}

/* ── Effect F: Commitment Lede Pin ── */

function initCommitmentPin(
  gsap: typeof import("gsap")["default"],
  ScrollTrigger: typeof import("gsap/ScrollTrigger")["default"],
  scope: HTMLElement
) {
  const section = scope.querySelector(".fp-commitment-reveal") as HTMLElement | null;
  const lede = scope.querySelector(".fp-commitment-reveal__lede") as HTMLElement | null;
  const cards = gsap.utils.toArray<HTMLElement>("[data-scroll-feature-card]", scope);
  if (!section || !lede || !cards.length) return;

  const lastCard = cards[cards.length - 1];

  ScrollTrigger.create({
    trigger: section,
    start: "top top+=96",
    endTrigger: lastCard,
    end: "top top+=45%",
    pin: lede,
    pinSpacing: false,
  });
}

/* ── Effect E: Botanical Illustrations — individual scroll animations ── */

function initBotanicals(
  gsap: typeof import("gsap")["default"],
  scope: HTMLElement
) {
  const botanicals = gsap.utils.toArray<HTMLElement>(
    "[data-botanical]",
    scope
  );
  if (!botanicals.length) return;

  const separators = gsap.utils.toArray<HTMLElement>(".fl-separator", scope);

  /*
   * Each leaf config:
   *   sep     — which separator to anchor near (0-based, -1 = hero exit via CSS)
   *   section — CSS selector for section-based anchoring (when no separator exists)
   *   off     — vertical offset from anchor (px)
   *   y       — yPercent drift over scroll
   *   rot     — rotation delta over scroll (adds to CSS initial rotation)
   *   sc      — scale target
   *   spd     — scrub speed (lower = snappier)
   */
  const configs: {
    sep?: number; section?: string; off: number;
    y: number; rot: number; sc: number; spd: number;
  }[] = [
    /* Pair A: hero exit */
    { sep: -1, off: 0,    y: -45, rot: 12,  sc: 1.15, spd: 0.5 },   // 1a: bird of paradise — drift up, rotate, zoom
    { sep: -1, off: 0,    y: -20, rot: -18, sc: 0.9,  spd: 0.8 },   // 1b: fan palm companion — slower counter-drift

    /* Pair: separator 0 (passes → packages) */
    { sep: 0,  off: -60,  y: 35,  rot: -10, sc: 0.94, spd: 0.6 },   // 2: hibiscus — drift down, rotate back
    { sep: 0,  off: 40,   y: -20, rot: 15,  sc: 0.88, spd: 0.85 },  // 2b: calathea companion — gentle drift up

    /* Pair B: separator 1 (packages → commitment) */
    { sep: 1,  off: -80,  y: -30, rot: 6,   sc: 1.2,  spd: 0.5 },   // 3a: fan palm — drift up, zoom in
    { sep: 1,  off: 40,   y: 25,  rot: -22, sc: 0.85, spd: 0.9 },   // 3b: monstera companion — slow drift down

    /* Pair: separator 2 (commitment → schedule) */
    { sep: 2,  off: -100, y: 40,  rot: 14,  sc: 1.05, spd: 0.6 },   // 4: monstera — drift down, gentle rotate
    { sep: 2,  off: -20,  y: -25, rot: -16, sc: 0.90, spd: 0.80 },  // 4b: hibiscus companion — drift up, counter-rotate

    /* Pair D: schedule → session (section-anchored) */
    { section: ".fp-session-section", off: -120, y: -35, rot: 10,  sc: 1.10, spd: 0.55 },  // 7a: calathea — drift up
    { section: ".fp-session-section", off: -40,  y: 20,  rot: -20, sc: 0.88, spd: 0.90 },  // 7b: calathea small — drift down

    /* Single: session → platform (section-anchored) */
    { section: ".fp-detail-section--platform", off: -100, y: 35, rot: -12, sc: 1.05, spd: 0.65 },  // 8: fan palm — drift down

    /* Pair C: separator 3 (platform → benefits) */
    { sep: 3,  off: -70,  y: -35, rot: -8,  sc: 1.12, spd: 0.5 },   // 5a: calathea — drift up, zoom
    { sep: 3,  off: 50,   y: -15, rot: 20,  sc: 0.92, spd: 0.9 },   // 5b: bird of paradise small — gentle drift

    /* Single: near FAQ area (after last separator) */
    { sep: 3,  off: 500,  y: 30,  rot: -15, sc: 1.0,  spd: 0.7 },   // 6: hibiscus flipped — drift down
  ];

  botanicals.forEach((el, i) => {
    const cfg = configs[i];
    if (!cfg) return;

    /* Position vertically near the target separator or section */
    if (cfg.sep !== undefined && cfg.sep >= 0 && separators[cfg.sep]) {
      el.style.top = `${separators[cfg.sep].offsetTop + cfg.off}px`;
    } else if (cfg.section) {
      const target = scope.querySelector(cfg.section) as HTMLElement | null;
      if (target) {
        el.style.top = `${target.offsetTop + cfg.off}px`;
      }
    }

    gsap.to(el, {
      yPercent: cfg.y,
      rotation: `+=${cfg.rot}`,
      scale: cfg.sc,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom+=10%",
        end: "bottom top-=10%",
        scrub: cfg.spd,
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
