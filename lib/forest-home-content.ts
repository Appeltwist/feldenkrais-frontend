type ForestHomeImage = {
  src: string;
  alt: string;
  caption: string;
};

type ForestHomePoint = {
  icon: "light" | "pause" | "terrace";
  title: string;
  body: string;
};

export type ForestHomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    videoId: string;
    posterImage: string;
  };
  highlights: {
    eyebrow: string;
    title: string;
    subtitle: string;
    linkLabel: string;
    emptyTitle: string;
    emptyBody: string;
    dateFallbackLabel: string;
  };
  explore: {
    eyebrow: string;
    title: string;
    subtitle: string;
    domainFilterLabel: string;
    typeFilterLabel: string;
    emptyTitle: string;
    emptyBody: string;
    allDomainsLabel: string;
    allTypesLabel: string;
    noResultsTitle: string;
    noResultsBody: string;
    datesComingSoonLabel: string;
    byAppointmentLabel: string;
    previousLabel: string;
    nextLabel: string;
    goToLabel: string;
  };
  story: {
    eyebrow: string;
    title: string;
    body: string;
    supportLinkLabel: string;
    points: ForestHomePoint[];
    gallery: ForestHomeImage[];
  };
  closing: {
    eyebrow: string;
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    note: string;
  };
};

const FOREST_HOME_CONTENT: Record<"en" | "fr", ForestHomeContent> = {
  en: {
    hero: {
      eyebrow: "Practice in Brussels",
      title: "Forest Lighthouse",
      subtitle:
        "Weekly classes, immersive workshops, and long-form trainings in a light-filled movement institute and gathering place.",
      primaryCta: "See what's on",
      secondaryCta: "274 Rue des Alliés, 1190 Forest",
      videoId: "y4aE7SPz0Hk",
      posterImage: "/brands/forest-lighthouse/home/main-hall-wide.jpg",
    },
    highlights: {
      eyebrow: "Featured",
      title: "What's coming up",
      subtitle:
        "A curated selection of what might interest you to come and experience.",
      linkLabel: "See all workshops & trainings",
      emptyTitle: "More workshops are on the way",
      emptyBody: "Upcoming workshops and training paths will appear here as soon as they are announced.",
      dateFallbackLabel: "Dates to be announced",
    },
    explore: {
      eyebrow: "On offer",
      title: "Classes, workshops, trainings & sessions",
      subtitle:
        "Browse the full range of Forest Lighthouse offers, then narrow the slider by the domain that matters most to you.",
      domainFilterLabel: "Domain",
      typeFilterLabel: "Type",
      emptyTitle: "More offers are being prepared",
      emptyBody: "Additional classes, workshops, and sessions will appear here again shortly.",
      allDomainsLabel: "All interests",
      allTypesLabel: "All offer types",
      noResultsTitle: "No offers in this domain yet",
      noResultsBody: "Try another domain to explore the full range of what is currently on offer.",
      datesComingSoonLabel: "Dates coming soon",
      byAppointmentLabel: "By appointment",
      previousLabel: "Previous offers",
      nextLabel: "Next offers",
      goToLabel: "Go to offer",
    },
    story: {
      eyebrow: "Inside Forest Lighthouse",
      title: "A place that supports practice",
      body:
        "Forest Lighthouse is set up for weekly rhythm, immersive weekends, and the slower continuity of long-form learning. The space stays calm, bright, and easy to settle into.",
      supportLinkLabel: "Plan your visit",
      points: [
        {
          icon: "light",
          title: "Light-filled rooms",
          body: "The main hall and practice rooms are designed for attention, movement, and sustained group work.",
        },
        {
          icon: "pause",
          title: "A pause between sessions",
          body: "Tea, coffee, and a soft social rhythm make it easy to arrive early, stay a little, and reconnect.",
        },
        {
          icon: "terrace",
          title: "A neighborhood that breathes",
          body: "Step outside to parks, cafés, and restaurants — Forest is a lively quarter with plenty to explore between sessions.",
        },
      ],
      gallery: [
        {
          src: "/brands/forest-lighthouse/home/community-practice.jpg",
          alt: "Group practice at Forest Lighthouse",
          caption: "A place where weekly practice and longer immersions share the same atmosphere.",
        },
        {
          src: "/brands/forest-lighthouse/photos/forest-gathering-window.jpeg",
          alt: "A window and gathering space at Forest Lighthouse",
          caption: "Light, plants, and quiet edges that soften the day.",
        },
        {
          src: "/brands/forest-lighthouse/rent/patio.jpg",
          alt: "The patio at Forest Lighthouse",
          caption: "The patio opens the rhythm of workshops beyond the studio walls.",
        },
        {
          src: "/brands/forest-lighthouse/photos/portail.jpeg",
          alt: "The green entrance gate at Forest Lighthouse",
          caption: "The green gate on Rue des Alliés, the clearest first landmark.",
        },
      ],
    },
    closing: {
      eyebrow: "Your visit",
      title: "Prepare your visit to Forest Lighthouse",
      body:
        "Find the address, entrance notes, travel guidance, and the practical details that make arriving feel simple.",
      primaryCta: "Plan your visit",
      secondaryCta: "About",
      note: "Address, arrival guidance, and practical information before you come.",
    },
  },
  fr: {
    hero: {
      eyebrow: "Pratique à Bruxelles",
      title: "Forest Lighthouse",
      subtitle:
        "Cours réguliers, ateliers immersifs et formations de fond dans un lieu de pratique et de rassemblement baigné de lumière.",
      primaryCta: "Voir ce qui se passe",
      secondaryCta: "274 Rue des Alliés, 1190 Forest",
      videoId: "y4aE7SPz0Hk",
      posterImage: "/brands/forest-lighthouse/home/main-hall-wide.jpg",
    },
    highlights: {
      eyebrow: "À la une",
      title: "Ce qui arrive",
      subtitle:
        "Une sélection sur mesure de ce qui pourrait vous intéresser à venir.",
      linkLabel: "Voir tous les ateliers & formations",
      emptyTitle: "D'autres ateliers arrivent",
      emptyBody: "Les prochains ateliers et parcours de formation apparaîtront ici dès leur annonce.",
      dateFallbackLabel: "Dates à annoncer",
    },
    explore: {
      eyebrow: "À découvrir",
      title: "Cours, ateliers, formations & séances",
      subtitle:
        "Parcourez l'ensemble des propositions de Forest Lighthouse, puis filtrez le slider selon le domaine qui vous attire le plus.",
      domainFilterLabel: "Domaine",
      typeFilterLabel: "Type",
      emptyTitle: "D'autres propositions arrivent",
      emptyBody: "D'autres cours, ateliers et séances réapparaîtront ici très bientôt.",
      allDomainsLabel: "Tous les domaines",
      allTypesLabel: "Tous les types",
      noResultsTitle: "Rien pour ce domaine pour l'instant",
      noResultsBody: "Essayez un autre domaine pour explorer l'ensemble des propositions actuellement ouvertes.",
      datesComingSoonLabel: "Dates à venir",
      byAppointmentLabel: "Sur rendez-vous",
      previousLabel: "Propositions précédentes",
      nextLabel: "Propositions suivantes",
      goToLabel: "Aller à la proposition",
    },
    story: {
      eyebrow: "À l'intérieur de Forest Lighthouse",
      title: "Un lieu qui soutient la pratique",
      body:
        "Forest Lighthouse est pensé pour la régularité hebdomadaire, les week-ends immersifs et la continuité plus lente des parcours longs. Le lieu reste calme, lumineux et facile à habiter.",
      supportLinkLabel: "Préparer votre visite",
      points: [
        {
          icon: "light",
          title: "Des salles baignées de lumière",
          body: "La grande salle et les espaces de pratique soutiennent l'attention, le mouvement et le travail de groupe dans la durée.",
        },
        {
          icon: "pause",
          title: "Une pause entre les temps de pratique",
          body: "Thé, café et rythme social doux facilitent l'arrivée, la pause et les conversations entre les sessions.",
        },
        {
          icon: "terrace",
          title: "Un quartier qui respire",
          body: "Parcs, cafés et restaurants à deux pas — Forest est un quartier vivant où l'on profite entre les séances.",
        },
      ],
      gallery: [
        {
          src: "/brands/forest-lighthouse/home/community-practice.jpg",
          alt: "Une pratique collective au Forest Lighthouse",
          caption: "Un lieu où la pratique hebdomadaire et les formats longs partagent une même atmosphère.",
        },
        {
          src: "/brands/forest-lighthouse/photos/forest-gathering-window.jpeg",
          alt: "Une fenetre et un espace partagé au Forest Lighthouse",
          caption: "Lumière, plantes et bords calmes qui adoucissent la journée.",
        },
        {
          src: "/brands/forest-lighthouse/rent/patio.jpg",
          alt: "Le patio du Forest Lighthouse",
          caption: "Le patio laisse les ateliers respirer hors des salles.",
        },
        {
          src: "/brands/forest-lighthouse/photos/portail.jpeg",
          alt: "Le portail vert du Forest Lighthouse",
          caption: "Le portail vert de la rue des Alliés, premier repère pour une arrivée.",
        },
      ],
    },
    closing: {
      eyebrow: "Votre visite",
      title: "Préparer votre visite à Forest Lighthouse",
      body:
        "Adresse, accès, repères d'arrivée et informations pratiques : tout ce qu'il faut pour venir sereinement.",
      primaryCta: "Préparer votre visite",
      secondaryCta: "À propos",
      note: "Adresse, repères d'arrivée et informations pratiques avant de venir.",
    },
  },
};

export function getForestHomeContent(locale: string): ForestHomeContent {
  return locale.toLowerCase().startsWith("fr") ? FOREST_HOME_CONTENT.fr : FOREST_HOME_CONTENT.en;
}
