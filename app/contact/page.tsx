import Link from "next/link";

import { ForestPageHero, ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchSiteConfig } from "@/lib/api";
import { FOREST_PAGE_MEDIA, isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

export default async function ContactPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isFrench = locale.toLowerCase().startsWith("fr");

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
      <ForestPageHero
        actions={[
          { href: "mailto:learn@forest-lighthouse.be", label: isFrench ? "Écrire un e-mail" : "Send email" },
          { href: "https://www.instagram.com/forest_lighthouse/", label: "Instagram", variant: "secondary" },
        ]}
        eyebrow={isFrench ? "Échange" : "Get in touch"}
        mediaUrl={FOREST_PAGE_MEDIA.contact}
        subtitle={
          isFrench
            ? "Pour une question, une orientation, une location ou un premier contact, voici les points d’entrée essentiels."
            : "For a question, orientation, rental inquiry, or first contact, here are the main entry points."
        }
        title={isFrench ? "Contact" : "Contact"}
      />

      <div className="forest-info-grid">
        <ForestPageSection eyebrow={isFrench ? "Adresse" : "Address"} title="Forest Lighthouse">
          <p>274 Rue des Alliés</p>
          <p>1190 Forest, Belgium</p>
          <p>
            <a className="text-link" href="tel:+32485726837">
              +32 485 72 68 37
            </a>
          </p>
        </ForestPageSection>

        <ForestPageSection
          eyebrow={isFrench ? "Contact direct" : "Direct contact"}
          title={isFrench ? "Canaux principaux" : "Primary channels"}
        >
          <div className="forest-link-stack">
            <a className="text-link" href="mailto:learn@forest-lighthouse.be">
              learn@forest-lighthouse.be
            </a>
            <a className="text-link" href="https://www.instagram.com/forest_lighthouse/" rel="noreferrer" target="_blank">
              @forest_lighthouse
            </a>
            <Link className="text-link" href={localizePath(locale, "/rent")}>
              {isFrench ? "Demander un devis de location" : "Request a rental quote"}
            </Link>
          </div>
        </ForestPageSection>
      </div>
    </ForestPageShell>
  );
}
