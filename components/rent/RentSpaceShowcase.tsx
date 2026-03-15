"use client";

import { useState } from "react";

type RentSpec = {
  label: string;
  value: string;
};

type RentSpace = {
  name: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
  specs: RentSpec[];
  useCases: string[];
};

type RentSpaceShowcaseProps = {
  spaces: RentSpace[];
};

export default function RentSpaceShowcase({ spaces }: RentSpaceShowcaseProps) {
  const [active, setActive] = useState(0);
  const current = spaces[active];

  return (
    <div className="rent-showcase">
      <div className="rent-showcase__tabs">
        {spaces.map((space, idx) => (
          <button
            className={`rent-showcase__tab${idx === active ? " rent-showcase__tab--active" : ""}`}
            key={space.name}
            onClick={() => setActive(idx)}
            type="button"
          >
            {space.name}
          </button>
        ))}
      </div>

      <div className="rent-showcase__body">
        <div className="rent-showcase__media-wrap">
          {spaces.map((space, idx) => (
            <div
              aria-hidden={idx !== active}
              aria-label={space.imageAlt}
              className={`rent-showcase__media${idx === active ? " rent-showcase__media--active" : ""}`}
              key={space.name}
              role="img"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(1,18,18,0.08), rgba(1,18,18,0.18)), url(${space.imageUrl})`,
              }}
            />
          ))}
        </div>

        <div className="rent-showcase__details">
          <div className="rent-showcase__header">
            <h3 className="rent-showcase__name">{current.name}</h3>
            <p className="rent-showcase__intro">{current.intro}</p>
          </div>

          <dl className="rent-showcase__specs">
            {current.specs.map((spec) => (
              <div className="rent-showcase__spec" key={`${current.name}-${spec.label}`}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="rent-showcase__uses">
            {current.useCases.map((item) => (
              <li key={`${current.name}-${item}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
