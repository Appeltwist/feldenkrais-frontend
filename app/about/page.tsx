import Link from "next/link";

import { ForestPageHero, ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import { fetchSiteConfig } from "@/lib/api";
import { FOREST_PAGE_MEDIA, isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { getRequestLocale } from "@/lib/get-locale";
import { localizePath } from "@/lib/locale-path";

export default async function AboutPage() {
  const hostname = await getHostname();
  const locale = await getRequestLocale();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const isFrench = locale.toLowerCase().startsWith("fr");

  if (!siteConfig || !isForestCenter(siteConfig.centerSlug)) {
    return (
      <div className="page-section">
        <h1>About</h1>
        <p>Coming soon.</p>
      </div>
    );
  }

  return (
    <ForestPageShell>
      <ForestPageHero
        actions={[
          { href: localizePath(locale, "/domains"), label: isFrench ? "Explorer les domaines" : "Explore domains" },
          { href: localizePath(locale, "/contact"), label: isFrench ? "Nous écrire" : "Contact us", variant: "secondary" },
        ]}
        eyebrow={isFrench ? "Forest Lighthouse" : "Forest Lighthouse"}
        mediaUrl={FOREST_PAGE_MEDIA.about}
        subtitle={
          isFrench
            ? "Un lieu pour pratiquer, apprendre, transmettre et se retrouver autour du mouvement, de l’écoute et de l’attention."
            : "A place to practice, learn, teach, and gather around movement, listening, and attention."
        }
        title={isFrench ? "À propos" : "About"}
      />

      <ForestPageSection
        eyebrow={isFrench ? "Le lieu" : "The place"}
        title={isFrench ? "Une maison pour la pratique" : "A house for practice"}
      >
        <div className="forest-copy-grid">
          <p>
            {isFrench
              ? "Forest Lighthouse relie cours hebdomadaires, ateliers, formations et espaces de rencontre dans un même environnement sensible."
              : "Forest Lighthouse connects weekly classes, workshops, trainings, and gathering spaces inside one coherent environment."}
          </p>
          <p>
            {isFrench
              ? "Cette première version garde un contenu simple, mais l’habille désormais dans le même langage visuel que la page Tarifs."
              : "This first pass keeps the content simple, but dresses it in the same visual language as the Pricing page."}
          </p>
        </div>
      </ForestPageSection>

      <div className="forest-info-grid">
        <ForestPageSection
          eyebrow={isFrench ? "Pratique" : "Practice"}
          title={isFrench ? "Des formats complémentaires" : "Complementary formats"}
        >
          <ul className="forest-bullet-list">
            <li>{isFrench ? "Cours réguliers pour installer une continuité" : "Regular classes to build continuity"}</li>
            <li>{isFrench ? "Ateliers pour approfondir une question" : "Workshops to deepen a question"}</li>
            <li>{isFrench ? "Formations pour structurer un parcours long" : "Trainings for long-form development"}</li>
          </ul>
        </ForestPageSection>

        <ForestPageSection
          eyebrow={isFrench ? "Suivant" : "Next"}
          title={isFrench ? "Où aller ensuite" : "Where to go next"}
        >
          <div className="forest-link-stack">
            <Link className="text-link" href={localizePath(locale, "/classes")}>
              {isFrench ? "Voir les cours" : "See classes"}
            </Link>
            <Link className="text-link" href={localizePath(locale, "/workshops")}>
              {isFrench ? "Voir les ateliers" : "See workshops"}
            </Link>
            <Link className="text-link" href={localizePath(locale, "/visit")}>
              {isFrench ? "Préparer une visite" : "Plan your visit"}
            </Link>
          </div>
        </ForestPageSection>
      </div>
    </ForestPageShell>
  );
}
