"use client";

import { useEffect, useRef } from "react";

type EducationScrollSequenceProps = {
  alt: string;
  className?: string;
  frameUrls: string[];
  height: number;
  width: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getViewportHeight() {
  if (typeof window === "undefined") {
    return 0;
  }

  return window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 0;
}

function getScrollProgress(rect: DOMRect, viewportHeight: number) {
  const start = viewportHeight * 0.8;
  const end = viewportHeight * 0.2 - rect.height;
  const progressWindow = start - end;

  if (progressWindow <= 0) {
    return 0;
  }

  return clamp((start - rect.top) / progressWindow, 0, 1);
}

export default function EducationScrollSequence({
  alt,
  className = "",
  frameUrls,
  height,
  width,
}: EducationScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    if (frameUrls.length === 0) {
      return;
    }

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    const preloadedFrames = frameUrls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          image.decoding = "async";
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        }),
    );

    let animationFrame = 0;

    const updateFrame = () => {
      animationFrame = 0;
      if (cancelled) {
        return;
      }

      const element = containerRef.current;
      const imageElement = imageRef.current;
      if (!element || !imageElement) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = getViewportHeight();
      if (viewportHeight <= 0 || rect.height <= 0) {
        return;
      }

      const progress = getScrollProgress(rect, viewportHeight);
      const nextFrame = Math.min(frameUrls.length - 1, Math.floor(progress * frameUrls.length));

      if (currentFrameRef.current !== nextFrame) {
        currentFrameRef.current = nextFrame;
        imageElement.src = frameUrls[nextFrame];
      }
    };

    const requestUpdate = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateFrame);
    };

    const attachListeners = () => {
      requestUpdate();
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
      window.addEventListener("orientationchange", requestUpdate);
      window.visualViewport?.addEventListener("resize", requestUpdate);

      resizeObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => {
              requestUpdate();
            })
          : null;

      if (resizeObserver && containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
    };

    void Promise.all(preloadedFrames).then(() => {
      if (cancelled) {
        return;
      }

      if (imageRef.current) {
        imageRef.current.src = frameUrls[currentFrameRef.current] || "";
      }

      attachListeners();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
      window.visualViewport?.removeEventListener("resize", requestUpdate);
      resizeObserver?.disconnect();
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [frameUrls]);

  return (
    <div className={`education-scroll-sequence ${className}`.trim()} ref={containerRef}>
      <img
        alt={alt}
        className="education-scroll-sequence__image"
        decoding="async"
        height={height}
        loading="eager"
        ref={imageRef}
        src={frameUrls[0] || ""}
        width={width}
      />
    </div>
  );
}
