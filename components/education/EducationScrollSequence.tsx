"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

export default function EducationScrollSequence({
  alt,
  className = "",
  frameUrls,
  height,
  width,
}: EducationScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentFrameRef = useRef(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const preloadedFrames = frameUrls.map((src) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
      return image;
    });

    let animationFrame = 0;

    const updateFrame = () => {
      animationFrame = 0;
      const element = containerRef.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = getViewportHeight();
      if (viewportHeight <= 0 || rect.height <= 0) {
        return;
      }

      const start = viewportHeight * 0.88;
      const end = viewportHeight * 0.14 - rect.height;
      const progressWindow = start - end;
      if (progressWindow <= 0) {
        return;
      }

      const progress = clamp((start - rect.top) / progressWindow, 0, 1);
      const nextFrame = Math.round(progress * (frameUrls.length - 1));

      if (currentFrameRef.current !== nextFrame) {
        currentFrameRef.current = nextFrame;
        setCurrentFrame(nextFrame);
      }
    };

    const requestUpdate = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateFrame);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("orientationchange", requestUpdate);
    window.visualViewport?.addEventListener("resize", requestUpdate);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            requestUpdate();
          })
        : null;

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      preloadedFrames.length = 0;
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
      <Image
        alt={alt}
        className="education-scroll-sequence__image"
        height={height}
        priority={false}
        sizes="100vw"
        src={frameUrls[currentFrame]}
        unoptimized
        width={width}
      />
    </div>
  );
}
