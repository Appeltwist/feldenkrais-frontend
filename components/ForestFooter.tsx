"use client";

import Link from "next/link";

import { useSiteContext } from "@/lib/site-context";
import { getFooterContent } from "@/lib/footer-content";

export default function ForestFooter({ locale }: { locale: string }) {
  const { centerSlug } = useSiteContext();
  if (centerSlug !== "forest-lighthouse") return null;

  const c = getFooterContent(locale);

  return (
    <footer className="fl-footer">
      <div className="fl-footer__inner">
        {/* Nav column */}
        <div className="fl-footer__col">
          <h4 className="fl-footer__heading">{c.navHeading}</h4>
          <ul className="fl-footer__nav">
            {c.navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter column */}
        <div className="fl-footer__col">
          <h4 className="fl-footer__heading">{c.newsletterHeading}</h4>
          <form
            className="fl-footer__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="fl-footer__input"
              placeholder={c.newsletterPlaceholder}
              type="email"
            />
            <button className="fl-footer__submit" type="submit">
              {c.newsletterCta}
            </button>
          </form>

          <div className="fl-footer__socials">
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/forest_lighthouse/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
              </svg>
            </a>
            <a
              aria-label="Email"
              href="mailto:learn@forest-lighthouse.be"
            >
              <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.236-8 4.882L4 8.236V6h16v2.236ZM4 18V10.618l8 4.882 8-4.882V18H4Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Contact column */}
        <div className="fl-footer__col">
          <h4 className="fl-footer__heading">{c.contactHeading}</h4>
          <address className="fl-footer__address">
            274 Rue des Alliés<br />
            1190 Forest, Belgium<br />
            <a href="tel:+32485726837">+32 485 72 68 37</a>
          </address>
        </div>
      </div>

      <div className="fl-footer__bottom">
        <p>{c.copyright}</p>
      </div>
    </footer>
  );
}
