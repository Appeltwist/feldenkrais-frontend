import Image from "next/image";
import Link from "next/link";

import { localizePath } from "@/lib/locale-path";

export const NEUROSOMATIC_PLATFORM_URL = "https://neurosomatic.com";

const LOGO_IMAGE_URL = "/brands/feldenkrais-education/logo/feldenkrais-education-logo.png";

type EducationNeurosomaticHeaderProps = {
  locale: string;
  title: string;
  loginLabel: string;
  routePath: string;
};

export default function EducationNeurosomaticHeader({
  locale,
  title,
  loginLabel,
  routePath,
}: EducationNeurosomaticHeaderProps) {
  const currentLocale = locale.toLowerCase().startsWith("fr") ? "FR" : "EN";

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
          <details className="neuro-platform-header__locale">
            <summary>{currentLocale} ▾</summary>
            <div className="neuro-platform-header__locale-menu">
              <Link href={localizePath("en", routePath)}>EN</Link>
              <Link href={localizePath("fr", routePath)}>FR</Link>
            </div>
          </details>

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
