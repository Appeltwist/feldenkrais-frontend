"use client";

import { useState } from "react";

type MethodInsightSlide = {
  title: string;
  paragraphs: string[];
};

type EducationMethodInsightSliderProps = {
  slides: MethodInsightSlide[];
};

export default function EducationMethodInsightSlider({ slides }: EducationMethodInsightSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  if (!activeSlide) {
    return null;
  }

  return (
    <article className="education-method-insight">
      <div className="education-method-insight__card">
        <h3>{activeSlide.title}</h3>
        {activeSlide.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {slides.length > 1 ? (
        <div className="education-method-insight__dots" role="tablist" aria-label={activeSlide.title}>
          {slides.map((slide, index) => (
            <button
              aria-label={slide.title}
              aria-selected={index === activeIndex}
              className={index === activeIndex ? "is-active" : undefined}
              key={slide.title}
              onClick={() => setActiveIndex(index)}
              role="tab"
              type="button"
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
