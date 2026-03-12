"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type DefaultNavLink = { label: string; href: string };
type ForestNavItem = {
  key: string;
  label: string;
  href?: string;
  children?: ForestNavItem[];
  activePrefixes?: string[];
  activeMatch?: "exact" | "prefix";
};

const DEFAULT_NAV: DefaultNavLink[] = [
  { label: "What's On", href: "/calendar" },
  { label: "Individual", href: "/private-sessions" },
  { label: "Classes", href: "/classes" },
  { label: "Workshops & Trainings", href: "/workshops" },
  { label: "Rent", href: "/rent" },
  { label: "About", href: "/about" },
];

const LOGO_URL =
  "https://forest-lighthouse.be/wp-content/uploads/sites/12/2022/07/69289F3E-09F0-4D3A-AC4C-98B27501D6A5-e1657354348213.png";

type LocaleCode = "en" | "fr";

function getLocaleFromPathname(pathname: string): LocaleCode {
  return pathname.startsWith("/fr") ? "fr" : "en";
}

function withLocalePrefix(locale: LocaleCode, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath}`;
}

function switchLocaleInPath(pathname: string, targetLocale: LocaleCode): string {
  /* Strip existing locale prefix (/en/... or /fr/...) if present */
  const stripped = pathname.replace(/^\/(en|fr)(\/|$)/, "/");
  const cleanPath = stripped === "" ? "/" : stripped;
  return `/${targetLocale}${cleanPath === "/" ? "" : cleanPath}`;
}

function stripLocalePrefix(pathname: string): string {
  if (pathname.startsWith("/fr/")) {
    return pathname.slice(3) || "/";
  }
  if (pathname === "/fr") {
    return "/";
  }
  if (pathname.startsWith("/en/")) {
    return pathname.slice(3) || "/";
  }
  if (pathname === "/en") {
    return "/";
  }
  return pathname;
}

function isPathActive(pathname: string, targetPath: string, mode: "exact" | "prefix" = "prefix"): boolean {
  if (!targetPath) {
    return false;
  }
  if (targetPath === "/") {
    return pathname === "/";
  }
  if (mode === "exact") {
    return pathname === targetPath;
  }
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

function isForestNavItemActive(item: ForestNavItem, barePathname: string): boolean {
  if (item.children?.some((child) => isForestNavItemActive(child, barePathname))) {
    return true;
  }

  if (item.activePrefixes?.some((prefix) => isPathActive(barePathname, prefix))) {
    return true;
  }

  if (item.href) {
    return isPathActive(barePathname, stripLocalePrefix(item.href), item.activeMatch);
  }

  return false;
}

function getForestNav(locale: LocaleCode): ForestNavItem[] {
  const isFr = locale === "fr";
  return [
    { key: "calendar", label: isFr ? "À l'affiche" : "What's On", href: withLocalePrefix(locale, "/calendar") },
    { key: "individual", label: isFr ? "Individuel" : "Individual", href: withLocalePrefix(locale, "/private-sessions") },
    {
      key: "classes",
      label: isFr ? "Cours" : "Classes",
      activePrefixes: ["/classes", "/pricing"],
      children: [
        {
          key: "classes-explore",
          label: isFr ? "Explorer" : "Explore",
          href: withLocalePrefix(locale, "/classes"),
          activeMatch: "exact",
        },
        {
          key: "classes-schedule",
          label: isFr ? "Horaire" : "Schedule",
          href: withLocalePrefix(locale, "/classes/schedule"),
          activeMatch: "exact",
        },
        {
          key: "classes-pricing",
          label: isFr ? "Tarifs" : "Pricing",
          href: withLocalePrefix(locale, "/pricing"),
          activeMatch: "exact",
        },
      ],
    },
    { key: "workshops", label: isFr ? "Ateliers & Formations" : "Workshops & Trainings", href: withLocalePrefix(locale, "/workshops") },
    { key: "rent", label: isFr ? "Location" : "Rent", href: withLocalePrefix(locale, "/rent") },
    { key: "about", label: isFr ? "À propos" : "About", href: withLocalePrefix(locale, "/about") },
  ];
}

function ForestHeader({
  navLinks,
  locale,
  pathname,
  localePaths,
}: {
  navLinks: ForestNavItem[];
  locale: LocaleCode;
  pathname: string;
  localePaths?: { en?: string; fr?: string } | null;
}) {
  const isFr = locale === "fr";
  const barePathname = stripLocalePrefix(pathname);
  const enPath = localePaths?.en || switchLocaleInPath(pathname, "en");
  const frPath = localePaths?.fr || switchLocaleInPath(pathname, "fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [desktopSubmenuKey, setDesktopSubmenuKey] = useState<string | null>(null);
  const [mobileSubmenuKey, setMobileSubmenuKey] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMobileSubmenuKey(null);
    setDesktopSubmenuKey(null);
    setLangOpen(false);
    document.body.style.overflow = "";
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setMobileSubmenuKey(null);
      }
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  }, []);

  // Resize expanding circle overlay to cover viewport
  useEffect(() => {
    function resize() {
      const el = overlayRef.current;
      if (!el) return;
      const radius = Math.sqrt(
        window.innerHeight ** 2 + window.innerWidth ** 2
      );
      const d = radius * 2;
      el.style.width = `${d}px`;
      el.style.height = `${d}px`;
      el.style.marginTop = `${-radius}px`;
      el.style.marginLeft = `${-radius}px`;
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ESC closes menus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (menuOpen) closeMenu();
        if (langOpen) setLangOpen(false);
        if (desktopSubmenuKey) setDesktopSubmenuKey(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, langOpen, desktopSubmenuKey, closeMenu]);

  // Click outside closes floating menus
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Node | null;
      if (langOpen && langRef.current && target && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
      if (desktopSubmenuKey && desktopNavRef.current && target && !desktopNavRef.current.contains(target)) {
        setDesktopSubmenuKey(null);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [langOpen, desktopSubmenuKey]);

  return (
    <header className={`fl-header${menuOpen ? " menu-open" : ""}`} role="banner">
      <div className="fl-header__inner">
        {/* Burger (mobile) */}
        <button
          aria-controls="fl-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className={`fl-burger${menuOpen ? " open" : ""}`}
          onClick={toggleMenu}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Logo */}
        <Link
          aria-label="Forest Lighthouse Home"
          className="fl-logo"
          href={`/${locale}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Forest Lighthouse" loading="eager" src={LOGO_URL} />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="fl-nav-desktop" ref={desktopNavRef}>
          {navLinks.map((item) => {
            const itemActive = isForestNavItemActive(item, barePathname);

            if (item.children?.length) {
              const isOpen = desktopSubmenuKey === item.key;
              return (
                <div
                  className={`fl-nav-desktop__item fl-nav-desktop__item--has-children${isOpen ? " is-open" : ""}${itemActive ? " is-active" : ""}`}
                  key={item.key}
                  onMouseEnter={() => setDesktopSubmenuKey(item.key)}
                  onMouseLeave={() => setDesktopSubmenuKey((current) => (current === item.key ? null : current))}
                >
                  <button
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className="fl-nav-desktop__trigger"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDesktopSubmenuKey((current) => (current === item.key ? null : item.key));
                    }}
                    type="button"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true" className="fl-nav-desktop__caret">▾</span>
                  </button>
                  <div aria-label={`${item.label} submenu`} className="fl-nav-desktop__submenu" role="menu">
                    {item.children.map((child) => {
                      const childActive = isForestNavItemActive(child, barePathname);
                      return child.href ? (
                        <Link
                          className={`fl-nav-desktop__submenu-link${childActive ? " is-active" : ""}`}
                          href={child.href}
                          key={child.key}
                          onClick={() => setDesktopSubmenuKey(null)}
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              );
            }

            return item.href ? (
              <Link
                className={itemActive ? "is-active" : undefined}
                href={item.href}
                key={item.key}
                onClick={() => setDesktopSubmenuKey(null)}
              >
                {item.label}
              </Link>
            ) : null;
          })}
        </nav>

        {/* Actions: lang + calendar */}
        <div className="fl-actions">
          <div className={`fl-lang${langOpen ? " is-open" : ""}`} ref={langRef}>
            <button
              aria-expanded={langOpen}
              aria-haspopup="true"
              className="fl-lang__btn"
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen((p) => !p);
              }}
              type="button"
            >
              {isFr ? "FR" : "EN"} <span aria-hidden="true">▾</span>
            </button>
            <div aria-label="Language" className="fl-lang__menu" role="menu">
              {/* Force a document navigation so locale-specific server content refreshes. */}
              <a href={enPath} onClick={() => setLangOpen(false)} role="menuitem">
                English
              </a>
              <a href={frPath} onClick={() => setLangOpen(false)} role="menuitem">
                Français
              </a>
            </div>
          </div>

          <Link
            aria-label={isFr ? "Ouvrir le calendrier" : "Open calendar"}
            className="fl-book"
            href={withLocalePrefix(locale, "/calendar")}
          >
            <span className="fl-book__text">{isFr ? "Calendrier" : "Calendar"}</span>
          </Link>
        </div>

        {/* Expanding circle overlay */}
        <div
          className={menuOpen ? "open" : ""}
          id="fl-nav-overlay"
          onClick={closeMenu}
          ref={overlayRef}
        />

        {/* Mobile fullscreen menu */}
        <nav
          aria-label="Mobile navigation"
          className={`fl-nav-mobile${menuOpen ? " open" : ""}`}
          id="fl-nav"
        >
          <div className="fl-nav-mobile__content">
            <ul className="fl-nav-mobile__links">
              {navLinks.map((item) => {
                const itemActive = isForestNavItemActive(item, barePathname);
                if (item.children?.length) {
                  const isExpanded = mobileSubmenuKey === item.key;
                  return (
                    <li
                      className={`fl-nav-mobile__item fl-nav-mobile__item--has-children${isExpanded ? " is-open" : ""}${itemActive ? " is-active" : ""}`}
                      key={item.key}
                    >
                      <button
                        aria-expanded={isExpanded}
                        className="fl-nav-mobile__parent"
                        onClick={() => setMobileSubmenuKey((current) => (current === item.key ? null : item.key))}
                        type="button"
                      >
                        <span>{item.label}</span>
                        <span aria-hidden="true" className="fl-nav-mobile__caret">▾</span>
                      </button>
                      <div className={`fl-nav-mobile__submenu${isExpanded ? " is-open" : ""}`}>
                        {item.children.map((child) => {
                          const childActive = isForestNavItemActive(child, barePathname);
                          return child.href ? (
                            <Link
                              className={`fl-nav-mobile__sublink${childActive ? " is-active" : ""}`}
                              href={child.href}
                              key={child.key}
                              onClick={closeMenu}
                            >
                              {child.label}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    </li>
                  );
                }

                return item.href ? (
                  <li className={`fl-nav-mobile__item${itemActive ? " is-active" : ""}`} key={item.key}>
                    <Link href={item.href} onClick={closeMenu}>
                      {item.label}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
            <div className="fl-nav-mobile__cta">
              <Link
                className="fl-nav-mobile__book"
                href={withLocalePrefix(locale, "/calendar")}
                onClick={closeMenu}
              >
                {isFr ? "Calendrier" : "Calendar"}
              </Link>
              <div className="fl-nav-mobile__langs">
                <a href={enPath} onClick={closeMenu}>EN</a>
                <span aria-hidden="true">•</span>
                <a href={frPath} onClick={closeMenu}>FR</a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

function DefaultHeader({
  navLinks,
  siteName,
}: {
  navLinks: DefaultNavLink[];
  siteName: string;
}) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/">
          {siteName}
        </Link>
        <nav className="site-nav">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default function Header() {
  const { siteName, centerSlug, defaultLocale, localeSwitchPaths } = useSiteContext();
  const pathname = usePathname() || "/";

  const isForest = centerSlug === "forest-lighthouse";

  // Use explicit URL locale if present, otherwise fall back to site default
  const hasExplicitLocale = /^\/(en|fr)(\/|$)/.test(pathname);
  const locale = hasExplicitLocale
    ? getLocaleFromPathname(pathname)
    : ((defaultLocale || "en") as LocaleCode);

  if (isForest) {
    const navLinks = getForestNav(locale);
    return (
      <ForestHeader
        locale={locale}
        localePaths={localeSwitchPaths}
        navLinks={navLinks}
        pathname={pathname}
      />
    );
  }

  return <DefaultHeader navLinks={DEFAULT_NAV} siteName={siteName} />;
}
