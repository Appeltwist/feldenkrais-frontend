import { headers } from "next/headers";

import { ForestPageHero, ForestPageSection, ForestPageShell } from "@/components/forest/ForestPageShell";
import RentInquiryForm from "@/components/rent/RentInquiryForm";
import { fetchSiteConfig } from "@/lib/api";
import { FOREST_PAGE_MEDIA, isForestCenter } from "@/lib/forest-theme";
import { getHostname } from "@/lib/get-hostname";
import { localizePath } from "@/lib/locale-path";

type RentTier = {
  title: string;
  details: string;
  rate: string;
};

function getRentTiers(locale: string): RentTier[] {
  if (locale.toLowerCase().startsWith("fr")) {
    return [
      {
        title: "Demi-journée studio",
        details: "Pour répétitions, cours privés, ou petits ateliers.",
        rate: "À partir de 220 EUR",
      },
      {
        title: "Journée complète",
        details: "Idéal pour stages, formations intensives et séminaires.",
        rate: "À partir de 380 EUR",
      },
      {
        title: "Week-end immersif",
        details: "Accès étendu avec configuration sur mesure.",
        rate: "Sur devis",
      },
    ];
  }

  return [
    {
      title: "Half-day studio",
      details: "For rehearsals, private sessions, or small workshops.",
      rate: "From EUR 220",
    },
    {
      title: "Full-day booking",
      details: "Best for intensives, trainings, and seminar days.",
      rate: "From EUR 380",
    },
    {
      title: "Immersive weekend",
      details: "Extended access with custom setup support.",
      rate: "Quoted",
    },
  ];
}

export default async function RentPage() {
  const hostname = await getHostname();
  const siteConfig = await fetchSiteConfig(hostname).catch(() => null);
  const locale = (await headers()).get("x-locale") ?? "en";
  const isFrench = locale.toLowerCase().startsWith("fr");
  const tiers = getRentTiers(locale);

  if (!siteConfig || !isForestCenter(siteConfig.centerSlug)) {
    return (
      <section className="page-section rent-page">
        <header className="rent-page__header">
          <h1>{isFrench ? "Location d’espace" : "Rent the space"}</h1>
          <p>
            {isFrench
              ? "Forest Lighthouse accueille cours, ateliers, résidences artistiques et journées de formation dans un cadre calme et chaleureux."
              : "Forest Lighthouse hosts classes, workshops, artist residencies, and training days in a calm and welcoming setting."}
          </p>
        </header>

        <section className="rent-tier-grid">
          {tiers.map((tier) => (
            <article className="card rent-tier" key={tier.title}>
              <h2>{tier.title}</h2>
              <p>{tier.details}</p>
              <p className="rent-tier__rate">{tier.rate}</p>
            </article>
          ))}
        </section>

        <RentInquiryForm locale={locale} />
      </section>
    );
  }

  return (
    <ForestPageShell>
      <ForestPageHero
        actions={[
          { href: "mailto:learn@forest-lighthouse.be", label: isFrench ? "Écrire pour louer" : "Email for rentals" },
          { href: localizePath(locale, "/contact"), label: isFrench ? "Contact" : "Contact", variant: "secondary" },
        ]}
        eyebrow={isFrench ? "Location d’espace" : "Room hire"}
        mediaUrl={FOREST_PAGE_MEDIA.rent}
        subtitle={
          isFrench
            ? "Des formats simples pour répétitions, ateliers, journées de travail ou week-ends immersifs."
            : "Simple formats for rehearsals, workshops, working days, or immersive weekends."
        }
        title={isFrench ? "Louer le lieu" : "Rent the space"}
      />

      <ForestPageSection
        eyebrow={isFrench ? "Options" : "Options"}
        subtitle={isFrench ? "Quelques repères pour cadrer une première demande." : "A few anchors for a first inquiry."}
        title={isFrench ? "Formats de location" : "Rental formats"}
      >
        <section className="rent-tier-grid forest-card-grid">
          {tiers.map((tier) => (
            <article className="card rent-tier forest-content-card" key={tier.title}>
              <h2>{tier.title}</h2>
              <p>{tier.details}</p>
              <p className="rent-tier__rate">{tier.rate}</p>
            </article>
          ))}
        </section>
      </ForestPageSection>

      <ForestPageSection
        eyebrow={isFrench ? "Demande" : "Inquiry"}
        subtitle={
          isFrench
            ? "Le formulaire reste simple à ce stade, mais il prend maintenant place dans le nouveau système visuel."
            : "The form stays simple at this stage, but now lives inside the new visual system."
        }
        title={isFrench ? "Demander un devis" : "Request a quote"}
      >
        <RentInquiryForm locale={locale} />
      </ForestPageSection>
    </ForestPageShell>
  );
}
