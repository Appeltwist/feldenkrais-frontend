"use client";

import { useEffect, useRef } from "react";

type EducationScrollSequenceProps = {
  alt: string;
  className?: string;
  frameUrls: string[];
  height: number;
  width: number;
};

type FrameCacheStatus = "idle" | "loading" | "loaded" | "error";

type FrameCacheEntry = {
  image: HTMLImageElement | null;
  promise: Promise<HTMLImageElement | null> | null;
  status: FrameCacheStatus;
};

type QueuedFrameLoad = {
  run: () => void;
  src: string;
};

const FRAME_CACHE = new Map<string, FrameCacheEntry>();
const FRAME_LOAD_QUEUE: QueuedFrameLoad[] = [];
const MAX_CONCURRENT_FRAME_LOADS = 6;
const SEQUENCE_PRELOAD_ROOT_MARGIN = "360px 0px 360px 0px";

let activeFrameLoadCount = 0;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getFrameCacheEntry(src: string) {
  let entry = FRAME_CACHE.get(src);

  if (!entry) {
    entry = {
      image: null,
      promise: null,
      status: "idle",
    };
    FRAME_CACHE.set(src, entry);
  }

  return entry;
}

function dequeueFrameLoad(src: string) {
  const queueIndex = FRAME_LOAD_QUEUE.findIndex((item) => item.src === src);

  if (queueIndex >= 0) {
    FRAME_LOAD_QUEUE.splice(queueIndex, 1);
  }
}

function flushFrameLoadQueue() {
  while (activeFrameLoadCount < MAX_CONCURRENT_FRAME_LOADS && FRAME_LOAD_QUEUE.length > 0) {
    const nextLoad = FRAME_LOAD_QUEUE.shift();

    if (!nextLoad) {
      return;
    }

    nextLoad.run();
  }
}

function queueFrameLoad(src: string, run: () => void, priority: boolean) {
  dequeueFrameLoad(src);

  if (priority) {
    FRAME_LOAD_QUEUE.unshift({ run, src });
  } else {
    FRAME_LOAD_QUEUE.push({ run, src });
  }

  flushFrameLoadQueue();
}

function loadFrame(src: string, priority = false) {
  const entry = getFrameCacheEntry(src);

  if (entry.status === "loaded" && entry.image) {
    return Promise.resolve(entry.image);
  }

  if (entry.promise) {
    return entry.promise;
  }

  entry.status = "loading";
  entry.promise = new Promise<HTMLImageElement | null>((resolve) => {
    const startLoad = () => {
      activeFrameLoadCount += 1;
      const image = new window.Image();
      image.decoding = "async";

      const finishLoad = (status: FrameCacheStatus, loadedImage: HTMLImageElement | null) => {
        entry.image = loadedImage;
        entry.promise = null;
        entry.status = status;
        activeFrameLoadCount = Math.max(0, activeFrameLoadCount - 1);
        resolve(loadedImage);
        flushFrameLoadQueue();
      };

      image.onload = () => {
        finishLoad("loaded", image);
      };

      image.onerror = () => {
        finishLoad("error", null);
      };

      image.src = src;
    };

    queueFrameLoad(src, startLoad, priority);
  });

  return entry.promise;
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

function findLoadedFrameIndex(frameUrls: string[], targetIndex: number, currentIndex: number) {
  const cappedTargetIndex = clamp(targetIndex, 0, Math.max(frameUrls.length - 1, 0));

  if (getFrameCacheEntry(frameUrls[cappedTargetIndex] || "").status === "loaded") {
    return cappedTargetIndex;
  }

  for (let offset = 1; offset < frameUrls.length; offset += 1) {
    const lowerIndex = cappedTargetIndex - offset;
    if (lowerIndex >= 0 && getFrameCacheEntry(frameUrls[lowerIndex]).status === "loaded") {
      return lowerIndex;
    }

    const higherIndex = cappedTargetIndex + offset;
    if (higherIndex < frameUrls.length && getFrameCacheEntry(frameUrls[higherIndex]).status === "loaded") {
      return higherIndex;
    }
  }

  return clamp(currentIndex, 0, Math.max(frameUrls.length - 1, 0));
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
    let hasActivated = false;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let animationFrame = 0;
    const uniqueFrameUrls = Array.from(new Set(frameUrls));

    currentFrameRef.current = 0;

    const updateFrame = () => {
      animationFrame = 0;
      if (cancelled || !hasActivated) {
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
      const targetFrame = Math.min(frameUrls.length - 1, Math.floor(progress * frameUrls.length));
      const nextFrame = findLoadedFrameIndex(frameUrls, targetFrame, currentFrameRef.current);

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

    const activateSequence = () => {
      if (cancelled || hasActivated) {
        return;
      }

      hasActivated = true;
      attachListeners();

      uniqueFrameUrls.forEach((src, index) => {
        void loadFrame(src, index === 0).then(() => {
          if (cancelled) {
            return;
          }

          requestUpdate();
        });
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      activateSequence();
    } else if (containerRef.current) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry || (!entry.isIntersecting && entry.intersectionRatio <= 0)) {
            return;
          }

          activateSequence();
          intersectionObserver?.disconnect();
          intersectionObserver = null;
        },
        {
          rootMargin: SEQUENCE_PRELOAD_ROOT_MARGIN,
          threshold: 0,
        },
      );

      intersectionObserver.observe(containerRef.current);
    }

    return () => {
      cancelled = true;
      intersectionObserver?.disconnect();
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
