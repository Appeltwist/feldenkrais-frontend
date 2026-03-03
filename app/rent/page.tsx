import { headers } from "next/headers";

import RentInquiryForm from "@/components/rent/RentInquiryForm";

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
  const locale = (await headers()).get("x-locale") ?? "en";
  const isFrench = locale.toLowerCase().startsWith("fr");
  const tiers = getRentTiers(locale);

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
