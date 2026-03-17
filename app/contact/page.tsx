import { ForestPageShell } from "@/components/forest/ForestPageShell";
import ForestContactForm from "@/components/contact/ForestContactForm";
import { fetchSiteConfig } from "@/lib/api";
import { isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";

export default async function ContactPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isFr = locale.toLowerCase().startsWith("fr");

  if (!siteConfig || !isForestCenter(siteConfig.centerSlug)) {
    return (
      <div className="page-section">
        <h1>Contact</h1>
        <p>Coming soon.</p>
      </div>
    );
  }

  return (
    <ForestPageShell>
      <div className="fp-page fp-contact-page">
        <section className="fc-intro">
          <p className="fc-intro__eyebrow">{isFr ? "Échange" : "Get in touch"}</p>
          <h1 className="fc-intro__title">Contact</h1>
          <p className="fc-intro__subtitle">
            {isFr
              ? "Une question, une demande ou simplement envie de nous écrire ? On vous répond rapidement."
              : "A question, a request, or just want to say hello? We'll get back to you shortly."}
          </p>
        </section>

        <div className="fp-contact-layout">
          {/* ── Form ── */}
          <div className="fp-contact-layout__form">
            <ForestContactForm locale={locale} />
          </div>

          {/* ── Sidebar info ── */}
          <aside className="fp-contact-layout__aside">
            <div className="fp-contact-card">
              <h3 className="fp-contact-card__title">
                {isFr ? "Contact direct" : "Direct contact"}
              </h3>
              <div className="fp-contact-card__items">
                <a className="fp-contact-card__link" href="mailto:learn@forest-lighthouse.be">
                  <svg className="fp-contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  learn@forest-lighthouse.be
                </a>
                <a className="fp-contact-card__link" href="tel:+32485726837">
                  <svg className="fp-contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                  +32 485 72 68 37
                </a>
                <a className="fp-contact-card__link" href="https://www.instagram.com/forest_lighthouse/" rel="noreferrer" target="_blank">
                  <svg className="fp-contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  @forest_lighthouse
                </a>
              </div>
            </div>

            <div className="fp-contact-card">
              <h3 className="fp-contact-card__title">
                {isFr ? "Nous trouver" : "Find us"}
              </h3>
              <a
                className="fp-contact-card__link"
                href="https://maps.app.goo.gl/nSPE3XxYnA7ow1Qr7"
                rel="noreferrer"
                target="_blank"
              >
                <svg className="fp-contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                274 Rue des Alliés, 1190 Forest
              </a>
            </div>
          </aside>
        </div>
      </div>
    </ForestPageShell>
  );
}
