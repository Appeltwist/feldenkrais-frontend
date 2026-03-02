"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSiteContext } from "@/lib/site-context";

type NavLink = { label: string; href: string };

const FOREST_NAV_EN: NavLink[] = [
  { label: "Explore", href: "/en" },
  { label: "About", href: "/en/about" },
  { label: "Class Schedule", href: "/en/classes" },
  { label: "Pricing", href: "/en/pricing" },
  { label: "Your visit", href: "/en/your-visit" },
  { label: "Rent", href: "/en/rent" },
  { label: "Contact", href: "/en/contact" },
];

const FOREST_NAV_FR: NavLink[] = [
  { label: "Explorer", href: "/fr" },
  { label: "À propos", href: "/fr/a-propos" },
  { label: "Horaire", href: "/fr/cours" },
  { label: "Tarifs", href: "/fr/prix" },
  { label: "Votre visite", href: "/fr/votre-visite" },
  { label: "Location", href: "/fr/location" },
  { label: "Contact", href: "/fr/contact" },
];

const DEFAULT_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Workshops", href: "/workshops" },
  { label: "Classes", href: "/classes" },
  { label: "Private Sessions", href: "/private-sessions" },
  { label: "Training", href: "/trainings" },
  { label: "Calendar", href: "/calendar" },
];

const LOGO_URL =
  "https://forest-lighthouse.be/wp-content/uploads/sites/12/2022/07/69289F3E-09F0-4D3A-AC4C-98B27501D6A5-e1657354348213.png";

function ForestHeader({
  navLinks,
  isFr,
}: {
  navLinks: NavLink[];
  isFr: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
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
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, langOpen, closeMenu]);

  // Click outside closes lang dropdown
  useEffect(() => {
    if (!langOpen) return;
    function onClick() {
      setLangOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [langOpen]);

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
          href={isFr ? "/fr" : "/en"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Forest Lighthouse" loading="eager" src={LOGO_URL} />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="fl-nav-desktop">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions: lang + book */}
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
              <Link href="/en" onClick={() => setLangOpen(false)} role="menuitem">
                English
              </Link>
              <Link href="/fr" onClick={() => setLangOpen(false)} role="menuitem">
                Français
              </Link>
            </div>
          </div>

          <Link
            aria-label="Book a class"
            className="fl-book"
            href={isFr ? "/fr/classes" : "/en/classes"}
          >
            <span className="fl-book__text">{isFr ? "Réserver" : "Book"}</span>
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
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={closeMenu}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="fl-nav-mobile__cta">
              <Link
                className="fl-nav-mobile__book"
                href={isFr ? "/fr/classes" : "/en/classes"}
                onClick={closeMenu}
              >
                {isFr ? "Réserver un cours" : "Book a class"}
              </Link>
              <div className="fl-nav-mobile__langs">
                <Link href="/en" onClick={closeMenu}>EN</Link>
                <span aria-hidden="true">•</span>
                <Link href="/fr" onClick={closeMenu}>FR</Link>
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
  navLinks: NavLink[];
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
  const { siteName, centerSlug, defaultLocale } = useSiteContext();

  const isForest = centerSlug === "forest-lighthouse";
  const isFr = defaultLocale?.startsWith("fr");

  if (isForest) {
    const navLinks = isFr ? FOREST_NAV_FR : FOREST_NAV_EN;
    return <ForestHeader isFr={!!isFr} navLinks={navLinks} />;
  }

  return <DefaultHeader navLinks={DEFAULT_NAV} siteName={siteName} />;
}
