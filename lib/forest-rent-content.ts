import type { LocaleCode } from "@/lib/types";

type RentSpec = {
  label: string;
  value: string;
};

type RentSpace = {
  name: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
  specs: RentSpec[];
  useCases: string[];
};

type RentInfoCard = {
  title: string;
  body: string;
  icon?: string;
};

export type ForestRentContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    highlights: string[];
    ctaLabel: string;
    imageUrl: string;
    imageAlt: string;
  };
  spaces: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: RentSpace[];
  };
  strengths: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: RentInfoCard[];
  };
  addOns: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: RentInfoCard[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    alt: string;
    images: string[];
  };
  inquiry: {
    eyebrow: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    email: string;
  };
};

export const FOREST_RENT_GALLERY_IMAGES = [
  "/brands/forest-lighthouse/rent/gallery-canopy.jpg",
  "/brands/forest-lighthouse/rent/gallery-sunlit-space.jpg",
  "/brands/forest-lighthouse/rent/gallery-window.jpeg",
  "/brands/forest-lighthouse/rent/the-nest.jpg",
  "/brands/forest-lighthouse/rent/gallery-gathering.jpeg",
  "/brands/forest-lighthouse/rent/ground-studio.jpg",
  "/brands/forest-lighthouse/rent/patio.jpg",
  "/brands/forest-lighthouse/rent/gallery-room-detail.jpg",
  "/brands/forest-lighthouse/rent/gallery-hallway.jpg",
] as const;

const CONTENT: Record<LocaleCode, ForestRentContent> = {
  en: {
    hero: {
      eyebrow: "Room hire",
      title: "A venue with room to think, move, and gather.",
      subtitle:
        "Bright practice rooms, a patio, a lounge, and a team that understands the work — in Brussels.",
      highlights: [
        "Canopy Hall + Ground Studio",
        "Patio, lounge, and coffee corner",
        "Technical and practice equipment available",
      ],
      ctaLabel: "Request a quote",
      imageUrl: "/brands/forest-lighthouse/rent/hero-canopy-hall.jpg",
      imageAlt: "Canopy Hall at Forest Lighthouse",
    },
    spaces: {
      eyebrow: "Spaces",
      title: "Two rooms, different scales, same care.",
      subtitle:
        "Each space is shaped for real use: movement, conversation, concentrated study, and the kind of pauses that make a full day feel well held.",
      cards: [
        {
          name: "Canopy Hall",
          intro:
            "The main room for larger groups, immersive trainings, conferences, and workshops that need openness, light, and a clear shared focus.",
          imageUrl: "/brands/forest-lighthouse/rent/hero-canopy-hall.jpg",
          imageAlt: "Canopy Hall interior",
          specs: [
            { label: "Size", value: "160 m2" },
            { label: "Seated", value: "60 people" },
            { label: "Lying down", value: "45 people" },
            { label: "Atmosphere", value: "Natural light and wide windows" },
          ],
          useCases: [
            "Well suited to trainings, talks, retreats, and larger practice-based workshops.",
            "Quiet wooden floor and generous circulation for somatic or movement work.",
            "Easy to pair with The Nest and patio for breaks, transitions, and informal exchange.",
          ],
        },
        {
          name: "Ground Studio",
          intro:
            "A more intimate room for smaller workshops, rehearsals, working sessions, breakouts, or groups that benefit from a contained atmosphere.",
          imageUrl: "/brands/forest-lighthouse/rent/ground-studio-new.jpg",
          imageAlt: "Ground Studio at Forest Lighthouse",
          specs: [
            { label: "Size", value: "60 m2" },
            { label: "Seated", value: "20 people" },
            { label: "Lying down", value: "15 people" },
            { label: "Connection", value: "Direct access to the patio" },
          ],
          useCases: [
            "Ideal for more intimate group formats, rehearsals, and focused studio time.",
            "A strong fit for classes, smaller circles, and side sessions within a larger event.",
            "Useful as a second room when you need breakout capacity during a training.",
          ],
        },
      ],
    },
    strengths: {
      eyebrow: "Why host here",
      title: "A venue that understands the work.",
      subtitle:
        "The practical details matter, but so does the feel of a place. Forest Lighthouse was built for learning situations that depend on attention, comfort, and good transitions.",
      items: [
        {
          title: "A team that knows events",
          body: "Support grounded in experience — from somatic teachers to technicians.",
          icon: "users",
        },
        {
          title: "Designed for somatic work",
          body: "Smooth wooden floors, natural light, and generous space for movement.",
          icon: "body",
        },
        {
          title: "The Nest for breaks",
          body: "A dedicated lounge with quality coffee and a softer rhythm between sessions.",
          icon: "coffee",
        },
        {
          title: "Equipped when needed",
          body: "Cameras, screens, projectors, and sound — available when your format needs it.",
          icon: "mic",
        },
      ],
    },
    addOns: {
      eyebrow: "Optional add-ons",
      title: "Extra support when the format asks for it.",
      subtitle:
        "You can keep things simple, or add the practical layer that helps a longer day feel seamless for both facilitators and participants.",
      items: [
        {
          title: "Meeting and brainstorming equipment",
          body: "Boards, paper, and facilitation tools for strategy days and collaborative formats.",
          icon: "clipboard",
        },
        {
          title: "Practice equipment",
          body: "Yoga, Pilates, Feldenkrais, and gentle gym props integrated into the room setup.",
          icon: "stretch",
        },
        {
          title: "Conference and recording setup",
          body: "Sound, projection, and capture for talks, conferences, and livestreams.",
          icon: "video",
        },
        {
          title: "Catering service",
          body: "Food options that support pauses, hospitality, and group flow.",
          icon: "utensils",
        },
        {
          title: "Barista service",
          body: "Hosted coffee breaks that feel warm, not just functional.",
          icon: "coffee-cup",
        },
      ],
    },
    gallery: {
      eyebrow: "Venue gallery",
      title: "See how the place feels in use.",
      subtitle:
        "A few glimpses of the rooms, transitions, and atmosphere that shape the experience of hosting at Forest Lighthouse.",
      alt: "Forest Lighthouse venue",
      images: [...FOREST_RENT_GALLERY_IMAGES],
    },
    inquiry: {
      eyebrow: "Inquiry",
      title: "Tell us what you are planning.",
      subtitle:
        "Share the format, dates, and group size. We'll follow up with availability and a quote.",
      emailLabel: "Or write directly",
      email: "learn@f-lh.be",
    },
  },
  fr: {
    hero: {
      eyebrow: "Location d'espace",
      title: "Un lieu qui donne de l'ampleur à ce que vous organisez.",
      subtitle:
        "Salles lumineuses, patio, lounge et une équipe qui connaît le travail — à Bruxelles.",
      highlights: [
        "Canopy Hall + Ground Studio",
        "Patio, lounge et coin café",
        "Matériel technique et de pratique disponible",
      ],
      ctaLabel: "Demander un devis",
      imageUrl: "/brands/forest-lighthouse/rent/hero-canopy-hall.jpg",
      imageAlt: "Canopy Hall au Forest Lighthouse",
    },
    spaces: {
      eyebrow: "Espaces",
      title: "Deux salles, deux échelles, une même qualité d'accueil.",
      subtitle:
        "Chaque espace est pensé pour un usage réel : mouvement, conversation, étude soutenue et pauses qui permettent à une journée dense de bien respirer.",
      cards: [
        {
          name: "Canopy Hall",
          intro:
            "La grande salle pour les groupes plus larges, les formations immersives, les conférences et les ateliers qui ont besoin d'ouverture, de lumière et d'un centre de gravité clair.",
          imageUrl: "/brands/forest-lighthouse/rent/hero-canopy-hall.jpg",
          imageAlt: "Intérieur du Canopy Hall",
          specs: [
            { label: "Surface", value: "160 m2" },
            { label: "Assis", value: "60 personnes" },
            { label: "Allongé", value: "45 personnes" },
            { label: "Atmosphère", value: "Lumière naturelle et larges fenêtres" },
          ],
          useCases: [
            "Très adaptée aux formations, conférences, retraites et grands ateliers de pratique.",
            "Sol en bois calme et circulation fluide pour le travail somatique ou corporel.",
            "Se combine facilement avec Le Nid et le patio pour les pauses, transitions et échanges informels.",
          ],
        },
        {
          name: "Ground Studio",
          intro:
            "Une salle plus intime pour les petits ateliers, répétitions, sessions de travail, sous-groupes ou formats qui gagnent à être contenus.",
          imageUrl: "/brands/forest-lighthouse/rent/ground-studio-new.jpg",
          imageAlt: "Ground Studio au Forest Lighthouse",
          specs: [
            { label: "Surface", value: "60 m2" },
            { label: "Assis", value: "20 personnes" },
            { label: "Allongé", value: "15 personnes" },
            { label: "Lien", value: "Accès direct au patio" },
          ],
          useCases: [
            "Idéal pour des formats plus intimes, des répétitions et du temps de studio concentré.",
            "Convient bien aux cours, petits cercles et sessions parallèles dans un événement plus large.",
            "Utile comme seconde salle quand une formation a besoin d'une capacité en sous-groupes.",
          ],
        },
      ],
    },
    strengths: {
      eyebrow: "Pourquoi ici",
      title: "Un lieu qui comprend la nature du travail.",
      subtitle:
        "Les détails pratiques comptent, mais la sensation d'un lieu aussi. Forest Lighthouse a été pensé pour les situations d'apprentissage qui dépendent de l'attention, du confort et de bonnes transitions.",
      items: [
        {
          title: "Une équipe qui connaît les événements",
          body: "Un soutien ancré dans l'expérience — enseignant·es, artistes, technicien·nes.",
          icon: "users",
        },
        {
          title: "Pensé pour le travail somatique",
          body: "Sols en bois lisse, lumière naturelle et espace généreux pour le mouvement.",
          icon: "body",
        },
        {
          title: "Le Nid pour les pauses",
          body: "Un lounge dédié avec du bon café et un rythme plus doux entre les sessions.",
          icon: "coffee",
        },
        {
          title: "Des salles équipées",
          body: "Caméras, écrans, projecteurs et son — disponibles quand le format le demande.",
          icon: "mic",
        },
      ],
    },
    addOns: {
      eyebrow: "En option",
      title: "Le soutien supplémentaire quand le format le demande.",
      subtitle:
        "Vous pouvez garder les choses simples, ou ajouter la couche pratique qui aide une journée dense à rester fluide pour les intervenant·es comme pour les participant·es.",
      items: [
        {
          title: "Matériel de réunion et de brainstorming",
          body: "Tableaux, papier et outils d'animation pour les journées collaboratives.",
          icon: "clipboard",
        },
        {
          title: "Matériel de pratique",
          body: "Yoga, Pilates, Feldenkrais et gym douce intégrés à la mise en salle.",
          icon: "stretch",
        },
        {
          title: "Installation conférence et enregistrement",
          body: "Son, projection et captation pour conférences et livestreams.",
          icon: "video",
        },
        {
          title: "Service traiteur",
          body: "Une proposition repas qui soutient les pauses et le rythme du groupe.",
          icon: "utensils",
        },
        {
          title: "Service barista",
          body: "Des pauses café soignées et réellement accueillantes.",
          icon: "coffee-cup",
        },
      ],
    },
    gallery: {
      eyebrow: "Galerie du lieu",
      title: "Voir comment le lieu se vit.",
      subtitle:
        "Quelques images des salles, des transitions et de l'atmosphère qui façonnent l'expérience d'un événement au Forest Lighthouse.",
      alt: "Lieu Forest Lighthouse",
      images: [...FOREST_RENT_GALLERY_IMAGES],
    },
    inquiry: {
      eyebrow: "Demande",
      title: "Parlez-nous de ce que vous préparez.",
      subtitle:
        "Indiquez le format, les dates et la taille du groupe. Nous reviendrons vers vous avec les disponibilités et un devis.",
      emailLabel: "Ou écrivez directement",
      email: "learn@f-lh.be",
    },
  },
};

export function getForestRentContent(locale: string): ForestRentContent {
  return locale.toLowerCase().startsWith("fr") ? CONTENT.fr : CONTENT.en;
}
