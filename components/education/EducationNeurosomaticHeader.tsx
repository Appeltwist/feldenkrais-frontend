"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { localizePath } from "@/lib/locale-path";

export const NEUROSOMATIC_PLATFORM_URL = "https://neurosomatic.com";
export const LESSON_LIBRARY_TRIAL_URL = "https://learn.feldenkrais-education.com/?lang=en";
export const LESSON_LIBRARY_GIFT_URL = "https://client.felded.com/b/fZu9AU8Mq0IP7I6aQT73G0c";

const LOGO_IMAGE_URL = "/brands/feldenkrais-education/logo/feldenkrais-education-logo.png";

type EducationNeurosomaticHeaderProps = {
  locale: string;
  title: string;
  loginLabel: string;
  routePath: string;
  localePaths?: {
    en: string;
    fr: string;
  } | null;
};

export default function EducationNeurosomaticHeader({
  locale,
  title,
  loginLabel,
  localePaths = null,
  routePath,
}: EducationNeurosomaticHeaderProps) {
  const currentLocale = locale.toLowerCase().startsWith("fr") ? "FR" : "EN";
  const enPath = localePaths?.en || localizePath("en", routePath);
  const frPath = localePaths?.fr || localizePath("fr", routePath);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!localeMenuRef.current?.contains(event.target as Node)) {
        setLocaleMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <header className="neuro-platform-header">
      <div className="neuro-platform-header__inner">
        <Link className="neuro-platform-header__brand" href={localizePath(locale, "/")}>
          <Image
            alt="Feldenkrais Education"
            className="neuro-platform-header__logo"
            height={108}
            src={LOGO_IMAGE_URL}
            width={420}
          />
        </Link>

        <p className="neuro-platform-header__title">{title}</p>

        <div className="neuro-platform-header__actions">
          <div
            className={`neuro-platform-header__locale${localeMenuOpen ? " is-open" : ""}`}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setLocaleMenuOpen(false);
              }
            }}
            onFocus={() => setLocaleMenuOpen(true)}
            onMouseEnter={() => setLocaleMenuOpen(true)}
            onMouseLeave={() => setLocaleMenuOpen(false)}
            ref={localeMenuRef}
          >
            <button
              aria-expanded={localeMenuOpen}
              aria-haspopup="true"
              className="neuro-platform-header__locale-button"
              onClick={() => setLocaleMenuOpen((current) => !current)}
              type="button"
            >
              {currentLocale} ▾
            </button>
            <div className="neuro-platform-header__locale-menu">
              <a
                className={locale === "en" ? "is-active" : ""}
                href={enPath}
                onClick={() => setLocaleMenuOpen(false)}
              >
                EN
              </a>
              <a
                className={locale === "fr" ? "is-active" : ""}
                href={frPath}
                onClick={() => setLocaleMenuOpen(false)}
              >
                FR
              </a>
            </div>
          </div>

          <a
            className="neuro-platform-header__login"
            href={NEUROSOMATIC_PLATFORM_URL}
            rel="noreferrer"
            target="_blank"
          >
            {loginLabel}
          </a>
        </div>
      </div>
    </header>
  );
}
