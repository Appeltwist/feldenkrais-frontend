import Link from "next/link";
import type { ReactNode } from "react";

import { isExternalHref } from "@/lib/locale-path";

type ForestHeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type ForestPageShellProps = {
  children: ReactNode;
  className?: string;
};

type ForestPageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  body?: ReactNode;
  mediaUrl?: string;
  actions?: ForestHeroAction[];
  children?: ReactNode;
  className?: string;
  compact?: boolean;
};

type ForestPageSectionProps = {
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
};

const BOTANICALS = [
  {
    className: "forest-site-shell__botanical forest-site-shell__botanical--one",
    src: "/brands/forest-lighthouse/photos/leaves1.png",
  },
  {
    className: "forest-site-shell__botanical forest-site-shell__botanical--two",
    src: "/brands/forest-lighthouse/photos/leaves2.png",
  },
  {
    className: "forest-site-shell__botanical forest-site-shell__botanical--three",
    src: "/brands/forest-lighthouse/photos/leaves3.png",
  },
  {
    className: "forest-site-shell__botanical forest-site-shell__botanical--four",
    src: "/brands/forest-lighthouse/photos/leaves5.png",
  },
];

function ForestHeroActionLink({ action }: { action: ForestHeroAction }) {
  const variant = action.variant === "secondary" ? "fl-btn fl-btn--secondary" : "fl-btn";
  if (isExternalHref(action.href)) {
    return (
      <a className={variant} href={action.href} rel="noreferrer" target="_blank">
        {action.label}
      </a>
    );
  }

  return (
    <Link className={variant} href={action.href}>
      {action.label}
    </Link>
  );
}

export function ForestPageShell({ children, className = "" }: ForestPageShellProps) {
  return (
    <div className={`forest-site-shell ${className}`.trim()}>
      <div aria-hidden="true" className="forest-site-shell__backdrop" />
      {BOTANICALS.map((botanical) => (
        <div aria-hidden="true" className={botanical.className} key={botanical.className}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" loading="lazy" src={botanical.src} />
        </div>
      ))}
      {children}
    </div>
  );
}

export function ForestPageHero({
  eyebrow,
  title,
  subtitle,
  body,
  mediaUrl,
  actions = [],
  children,
  className = "",
  compact = false,
}: ForestPageHeroProps) {
  return (
    <section className={`forest-page-hero${compact ? " forest-page-hero--compact" : ""} ${className}`.trim()}>
      {mediaUrl ? (
        <div
          className="forest-page-hero__media"
          style={{
            backgroundImage: `linear-gradient(125deg, rgba(0, 11, 12, 0.84), rgba(1, 38, 35, 0.56)), url(${mediaUrl})`,
          }}
        />
      ) : null}
      <div className="forest-page-hero__content">
        {eyebrow ? <p className="forest-page-hero__eyebrow">{eyebrow}</p> : null}
        <h1 className="forest-page-hero__title">{title}</h1>
        {subtitle ? <p className="forest-page-hero__subtitle">{subtitle}</p> : null}
        {body ? <div className="forest-page-hero__body">{body}</div> : null}
        {actions.length > 0 ? (
          <div className="forest-page-hero__actions">
            {actions.map((action) => (
              <ForestHeroActionLink action={action} key={`${action.href}-${action.label}`} />
            ))}
          </div>
        ) : null}
        {children ? <div className="forest-page-hero__extra">{children}</div> : null}
      </div>
    </section>
  );
}

export function ForestPageSection({
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: ForestPageSectionProps) {
  return (
    <section className={`forest-page-section forest-panel ${className}`.trim()}>
      {eyebrow ? <p className="forest-page-section__eyebrow">{eyebrow}</p> : null}
      {title ? <h2 className="forest-page-section__title">{title}</h2> : null}
      {subtitle ? <p className="forest-page-section__subtitle">{subtitle}</p> : null}
      {children}
    </section>
  );
}
