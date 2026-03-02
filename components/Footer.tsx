"use client";

import { useSiteContext } from "@/lib/site-context";

export default function Footer() {
  const { center } = useSiteContext();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>{center.name}</p>
        {center.socials.length > 0 ? (
          <div className="site-footer__socials">
            {center.socials.map((social) => (
              <a key={`${social.label}-${social.url}`} href={social.url} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
