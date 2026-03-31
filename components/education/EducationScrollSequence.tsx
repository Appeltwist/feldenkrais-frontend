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
      const scrollWindow = window.innerHeight + rect.height;
      if (scrollWindow <= 0) {
        return;
      }

      const progress = clamp((window.innerHeight - rect.top) / scrollWindow, 0, 1);
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

    return () => {
      preloadedFrames.length = 0;
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
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
