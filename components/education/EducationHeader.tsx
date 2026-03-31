"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { isExternalHref, localizePath } from "@/lib/locale-path";
import type { SiteNavItem } from "@/lib/site-config";
import { useSiteContext } from "@/lib/site-context";

type LocaleCode = "en" | "fr";

function getLocaleFromPathname(pathname: string, defaultLocale: string): LocaleCode {
  if (pathname.startsWith("/fr")) {
    return "fr";
  }
  if (pathname.startsWith("/en")) {
    return "en";
  }

  return defaultLocale.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function stripLocalePrefix(pathname: string): string {
  if (pathname.startsWith("/fr/")) return pathname.slice(3) || "/";
  if (pathname === "/fr") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  if (pathname === "/en") return "/";
  return pathname;
}

function switchLocaleInPath(pathname: string, targetLocale: LocaleCode): string {
  const stripped = pathname.replace(/^\/(en|fr)(\/|$)/, "/");
  const cleanPath = stripped === "" ? "/" : stripped;
  return `/${targetLocale}${cleanPath === "/" ? "" : cleanPath}`;
}

function isActive(pathname: string, href: string) {
  if (!href.startsWith("/")) {
    return false;
  }

  const barePath = stripLocalePrefix(pathname);
  const bareHref = stripLocalePrefix(href);

  if (bareHref === "/") {
    return barePath === "/";
  }

  return barePath === bareHref || barePath.startsWith(`${bareHref}/`);
}

function itemIsActive(pathname: string, item: SiteNavItem): boolean {
  if (isActive(pathname, item.href)) {
    return true;
  }

  return item.children?.some((child) => itemIsActive(pathname, child)) ?? false;
}

function NavAnchor({
  href,
  label,
  children,
  className,
  openInNewTab,
  onClick,
}: {
  href: string;
  label: string;
  children?: ReactNode;
  className?: string;
  openInNewTab?: boolean;
  onClick?: () => void;
}) {
  const external = isExternalHref(href);

  if (external) {
    return (
      <a
        className={className}
        href={href}
        onClick={onClick}
        rel={external || openInNewTab ? "noreferrer" : undefined}
        target={external || openInNewTab ? "_blank" : undefined}
      >
        {children ?? label}
      </a>
    );
  }

  return (
    <Link className={className} href={href} onClick={onClick}>
      {children ?? label}
    </Link>
  );
}

export default function EducationHeader() {
  const pathname = usePathname() || "/";
  const { brand, defaultLocale, footer, localeSwitchPaths, nav, siteName, siteSlug } = useSiteContext();
  const locale = getLocaleFromPathname(pathname, defaultLocale);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDesktopItem, setOpenDesktopItem] = useState<string | null>(null);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);

  const enPath = localeSwitchPaths?.en || switchLocaleInPath(pathname, "en");
  const frPath = localeSwitchPaths?.fr || switchLocaleInPath(pathname, "fr");
  const mapHref = footer.contact?.mapUrl || localizePath(locale, "/centers");
  const platformHref = localizePath(locale, "/platform");
  const platformLabel = locale === "fr" ? "La Plateforme" : "The Platform";
  const centerLabel = locale === "fr" ? "Les centres" : "Centers";

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="education-header" role="banner">
      <div className="education-header__inner">
        <button
          aria-controls="education-mobile-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          className={`education-header__burger${menuOpen ? " is-open" : ""}`}
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <Link className="education-header__brand" href={`/${locale}`}>
          {brand.logoUrl ? (
            <img alt={siteName} className="education-header__logo" loading="eager" src={brand.logoUrl} />
          ) : (
            <span className="education-header__brand-text">{siteName}</span>
          )}
        </Link>

        <nav aria-label="Primary navigation" className="education-nav education-nav--desktop">
          {nav.map((item) => {
            const active = itemIsActive(pathname, item);
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openDesktopItem === item.label;

            return (
              <div
                className={`education-nav__item${active ? " is-active" : ""}${hasChildren ? " has-children" : ""}${isOpen ? " is-open" : ""}`}
                key={item.label}
                onMouseEnter={() => setOpenDesktopItem(item.label)}
                onMouseLeave={() => setOpenDesktopItem((current) => (current === item.label ? null : current))}
              >
                <NavAnchor
                  className="education-nav__link"
                  href={item.href}
                  label={item.label}
                  openInNewTab={item.openInNewTab}
                >
                  <>
                    <span>{item.label}</span>
                    {hasChildren ? <span className="education-nav__caret">▾</span> : null}
                  </>
                </NavAnchor>
                {hasChildren ? (
                  <div className="education-nav__dropdown">
                    {item.children?.map((child) => (
                      <NavAnchor
                        className={`education-nav__dropdown-link${itemIsActive(pathname, child) ? " is-active" : ""}`}
                        href={child.href}
                        key={`${item.label}-${child.label}`}
                        label={child.label}
                        openInNewTab={child.openInNewTab}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="education-header__actions">
          <div
            className={`education-header__locale-picker${localeMenuOpen ? " is-open" : ""}`}
            onMouseLeave={() => setLocaleMenuOpen(false)}
          >
            <button
              aria-expanded={localeMenuOpen}
              aria-haspopup="true"
              className="education-header__locale-button"
              onClick={() => setLocaleMenuOpen((current) => !current)}
              type="button"
            >
              <span>{locale.toUpperCase()}</span>
              <span className="education-nav__caret">▾</span>
            </button>
            <div className="education-header__locale-menu">
              <a className={locale === "fr" ? "is-active" : ""} href={frPath}>
                FR
              </a>
              <a className={locale === "en" ? "is-active" : ""} href={enPath}>
                EN
              </a>
            </div>
          </div>

          <NavAnchor className="education-header__icon-link" href={mapHref} label={centerLabel}>
            <span className="education-header__icon-mark" aria-hidden="true">
              <svg fill="none" height="25" viewBox="0 0 24 24" width="25">
                <path
                  d="M8 6.75 3.75 8.5v9.25L8 16m0-9.25 8-2.5m-8 2.5V16m8-11.75 4.25 1.75v9.25L16 14m0-9.75V14m0 0-8 2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
                <path
                  d="M13 9.25a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </NavAnchor>

          {siteSlug === "feldenkrais-education" ? (
            <NavAnchor className="education-header__platform-link" href={platformHref} label={platformLabel}>
              <>
                <span className="education-header__platform-icon" aria-hidden="true">
                  <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
                    <rect height="9" rx="1.7" stroke="currentColor" strokeWidth="1.8" width="11" x="3" y="4" />
                    <rect height="9" rx="1.7" stroke="currentColor" strokeWidth="1.8" width="11" x="10" y="11" />
                  </svg>
                </span>
                <span>{platformLabel}</span>
              </>
            </NavAnchor>
          ) : null}
        </div>
      </div>

      <div className={`education-mobile-nav${menuOpen ? " is-open" : ""}`} id="education-mobile-nav">
        <div className="education-mobile-nav__panel">
          <div className="education-mobile-nav__header">
            <p>{siteName}</p>
            <button aria-label="Close navigation" onClick={() => setMenuOpen(false)} type="button">
              ×
            </button>
          </div>
          <div className="education-mobile-nav__body">
            {nav.map((item) => (
              <div className="education-mobile-nav__section" key={item.label}>
                <NavAnchor
                  className={`education-mobile-nav__link${itemIsActive(pathname, item) ? " is-active" : ""}`}
                  href={item.href}
                  label={item.label}
                  onClick={() => setMenuOpen(false)}
                  openInNewTab={item.openInNewTab}
                />
                {item.children?.length ? (
                  <div className="education-mobile-nav__children">
                    {item.children.map((child) => (
                      <NavAnchor
                        className={`education-mobile-nav__child${itemIsActive(pathname, child) ? " is-active" : ""}`}
                        href={child.href}
                        key={`${item.label}-${child.label}`}
                        label={child.label}
                        onClick={() => setMenuOpen(false)}
                        openInNewTab={child.openInNewTab}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="education-mobile-nav__section">
              <p className="education-mobile-nav__label">{locale === "fr" ? "Actions" : "Actions"}</p>
              <div className="education-mobile-nav__children">
                <NavAnchor
                  className="education-mobile-nav__child"
                  href={mapHref}
                  label={centerLabel}
                  onClick={() => setMenuOpen(false)}
                />
                {siteSlug === "feldenkrais-education" ? (
                  <NavAnchor
                    className="education-mobile-nav__child"
                    href={platformHref}
                    label={platformLabel}
                    onClick={() => setMenuOpen(false)}
                  />
                ) : null}
              </div>
            </div>
            <div className="education-mobile-nav__section">
              <p className="education-mobile-nav__label">{locale === "fr" ? "Langue" : "Language"}</p>
              <div className="education-mobile-nav__children">
                <a className={`education-mobile-nav__child${locale === "fr" ? " is-active" : ""}`} href={frPath}>
                  FR
                </a>
                <a className={`education-mobile-nav__child${locale === "en" ? " is-active" : ""}`} href={enPath}>
                  EN
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
