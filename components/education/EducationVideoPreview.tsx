"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

type EducationVideoPreviewProps = {
  videoId: string;
  title: string;
  posterUrl: string;
  className?: string;
  aspectRatio?: string;
  posterPosition?: string;
  playLabel?: string;
};

export default function EducationVideoPreview({
  videoId,
  title,
  posterUrl,
  className = "",
  aspectRatio = "16 / 9",
  posterPosition = "center center",
  playLabel = "Play video",
}: EducationVideoPreviewProps) {
  const [isActive, setIsActive] = useState(false);
  const style = {
    "--education-video-ratio": aspectRatio,
  } as CSSProperties;

  return (
    <div className={`education-video-preview ${className}`.trim()} style={style}>
      {isActive ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
        />
      ) : (
        <button
          aria-label={`${playLabel}: ${title}`}
          className="education-video-preview__poster"
          onClick={() => setIsActive(true)}
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(20, 22, 28, 0.12), rgba(20, 22, 28, 0.22)), url(${posterUrl})`,
            backgroundPosition: posterPosition,
          }}
          type="button"
        >
          <span className="education-video-preview__play" aria-hidden="true">
            <svg fill="none" viewBox="0 0 24 24">
              <path d="M8 6.5v11l9-5.5L8 6.5Z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
