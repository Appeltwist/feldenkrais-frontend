"use client";

import Image from "next/image";
import { useState } from "react";

export type TrainingYearSlide = {
  imageUrl: string;
  steps: Array<{ body: string; title: string }>;
  subtitle: string;
  title: string;
};

type EducationTrainingYearSliderProps = {
  slides: TrainingYearSlide[];
};

export default function EducationTrainingYearSlider({ slides }: EducationTrainingYearSliderProps) {
  const [activeIndex, setActiveIndex] = useState(slides.length > 1 ? 1 : 0);
  const activeSlide = slides[activeIndex];

  if (!activeSlide) {
    return null;
  }

  return (
    <div className="education-training-year-slider">
      <div className="education-training-year-slider__card">
        <div className="education-training-year-slider__image">
          <Image
            alt={activeSlide.title}
            height={512}
            sizes="(max-width: 900px) 100vw, 320px"
            src={activeSlide.imageUrl}
            width={768}
          />
        </div>

        <div className="education-training-year-slider__content">
          <h3>{activeSlide.title}</h3>
          <div className="education-training-year-slider__steps">
            {activeSlide.steps.map((step) => (
              <article className="education-training-year-slider__step" key={`${activeSlide.title}-${step.title}`}>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="education-training-year-slider__dots" role="tablist" aria-label="Training years">
        {slides.map((slide, index) => (
          <button
            aria-label={slide.title}
            aria-selected={index === activeIndex}
            className={
              index === activeIndex
                ? "education-training-year-slider__dot is-active"
                : "education-training-year-slider__dot"
            }
            key={slide.title}
            onClick={() => setActiveIndex(index)}
            role="tab"
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
