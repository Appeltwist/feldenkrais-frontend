"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AboutNavItem = {
  label: string;
  path: string;
};

const ABOUT_NAV_ITEMS: AboutNavItem[] = [
  { label: "About", path: "/about" },
  { label: "Domains", path: "/domains" },
  { label: "Visit", path: "/visit" },
  { label: "Contact", path: "/contact" },
];

function getLocalePrefix(pathname: string): string {
  if (pathname.startsWith("/fr/") || pathname === "/fr") {
    return "/fr";
  }
  if (pathname.startsWith("/en/") || pathname === "/en") {
    return "/en";
  }
  return "";
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

function isAboutRoute(pathname: string): boolean {
  return pathname === "/about" || pathname === "/domains" || pathname === "/visit" || pathname === "/contact";
}

export default function AboutSubNav() {
  const pathname = usePathname() || "/";
  const localePrefix = getLocalePrefix(pathname);
  const barePathname = stripLocalePrefix(pathname);

  if (!isAboutRoute(barePathname)) {
    return null;
  }

  return (
    <nav aria-label="About navigation" className="about-subnav-wrap">
      <div className="about-subnav">
        {ABOUT_NAV_ITEMS.map((item) => {
          const href = `${localePrefix}${item.path}`;
          const isActive = barePathname === item.path;
          return (
            <Link className={`about-subnav__link${isActive ? " is-active" : ""}`} href={href} key={item.path}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
