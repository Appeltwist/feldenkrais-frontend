import Link from "next/link";

import { ForestPageHero, ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchSiteConfig } from "@/lib/api";
import { FOREST_PAGE_MEDIA, isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

export default async function VisitPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isFrench = locale.toLowerCase().startsWith("fr");

  if (!siteConfig || !isForestCenter(siteConfig.centerSlug)) {
    return (
      <section className="page-section">
        <h1>Visit</h1>
        <p>Visit information is being prepared and will be available soon.</p>
      </section>
    );
  }

  return (
    <ForestPageShell>
      <ForestPageHero
        actions={[
          { href: localizePath(locale, "/contact"), label: isFrench ? "Nous contacter" : "Contact us" },
          { href: localizePath(locale, "/calendar"), label: isFrench ? "Voir le calendrier" : "See calendar", variant: "secondary" },
        ]}
        eyebrow={isFrench ? "Préparer une venue" : "Plan a visit"}
        mediaUrl={FOREST_PAGE_MEDIA.visit}
        subtitle={
          isFrench
            ? "Quelques repères simples pour trouver le lieu, arriver sereinement, et comprendre l’atmosphère de Forest Lighthouse."
            : "A few simple cues for finding the space, arriving with ease, and understanding the atmosphere of Forest Lighthouse."
        }
        title={isFrench ? "Visiter Forest Lighthouse" : "Visit Forest Lighthouse"}
      />

      <div className="forest-info-grid">
        <ForestPageSection eyebrow={isFrench ? "Sur place" : "On site"} title={isFrench ? "Avant d’arriver" : "Before you arrive"}>
          <ul className="forest-bullet-list">
            <li>{isFrench ? "Prévoyez quelques minutes d’avance pour vous installer." : "Plan a few extra minutes to settle in."}</li>
            <li>{isFrench ? "Apportez une tenue confortable pour bouger facilement." : "Bring comfortable clothes for moving easily."}</li>
            <li>{isFrench ? "Le lieu privilégie une atmosphère calme et attentive." : "The space is organized around calm, attentive presence."}</li>
          </ul>
        </ForestPageSection>

        <ForestPageSection eyebrow={isFrench ? "Explorer" : "Explore"} title={isFrench ? "Continuer la visite" : "Continue exploring"}>
          <div className="forest-link-stack">
            <Link className="text-link" href={localizePath(locale, "/about")}>
              {isFrench ? "À propos du lieu" : "About the place"}
            </Link>
            <Link className="text-link" href={localizePath(locale, "/classes")}>
              {isFrench ? "Voir les cours" : "See classes"}
            </Link>
            <Link className="text-link" href={localizePath(locale, "/rent")}>
              {isFrench ? "Louer l’espace" : "Rent the space"}
            </Link>
          </div>
        </ForestPageSection>
      </div>
    </ForestPageShell>
  );
}
