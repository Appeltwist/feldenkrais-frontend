"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSiteContext } from "@/lib/site-context";

type CoursNavItem = {
  label: string;
  labelFr: string;
  path: string;
  matchExact?: boolean;
};

const COURS_NAV_ITEMS: CoursNavItem[] = [
  { label: "Explore", labelFr: "Explorer", path: "/classes", matchExact: true },
  { label: "Schedule", labelFr: "Horaire", path: "/classes/schedule" },
  { label: "Pricing", labelFr: "Tarifs", path: "/pricing" },
];

function getLocalePrefix(pathname: string): string {
  if (pathname.startsWith("/fr/") || pathname === "/fr") return "/fr";
  if (pathname.startsWith("/en/") || pathname === "/en") return "/en";
  return "";
}

function stripLocalePrefix(pathname: string): string {
  if (pathname.startsWith("/fr/")) return pathname.slice(3) || "/";
  if (pathname === "/fr") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  if (pathname === "/en") return "/";
  return pathname;
}

function isCoursRoute(pathname: string): boolean {
  return (
    pathname === "/classes" ||
    pathname.startsWith("/classes/") ||
    pathname === "/pricing"
  );
}

export default function CoursSubNav() {
  const pathname = usePathname() || "/";
  const { defaultLocale } = useSiteContext();
  const localePrefix = getLocalePrefix(pathname);
  const barePathname = stripLocalePrefix(pathname);
  const isFrench = localePrefix === "/fr" || (localePrefix === "" && defaultLocale === "fr");

  if (!isCoursRoute(barePathname)) {
    return null;
  }

  return (
    <nav aria-label="Classes navigation" className="about-subnav-wrap">
      <div className="about-subnav">
        {COURS_NAV_ITEMS.map((item) => {
          const href = `${localePrefix}${item.path}`;
          const isActive = item.matchExact
            ? barePathname === item.path
            : barePathname === item.path || barePathname.startsWith(item.path + "/");
          return (
            <Link
              className={`about-subnav__link${isActive ? " is-active" : ""}`}
              href={href}
              key={item.path}
            >
              {isFrench ? item.labelFr : item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
