import type { LocaleCode } from "@/lib/types";

type LocalizedText = {
  en: string;
  fr: string;
};

type AboutAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type AboutCard = {
  title: string;
  body: string;
};

export type ForestAboutPersonSeed = {
  id: string;
  featured?: boolean;
  localSlug?: string;
  imageUrl?: string;
  imageAlt: LocalizedText;
  name: string;
  role: LocalizedText;
  summary: LocalizedText;
};

export type ForestAboutContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string[];
    actions: AboutAction[];
    highlights: string[];
  };
  story: {
    eyebrow: string;
    title: string;
    subtitle: string;
    paragraphs: string[];
    asideTitle: string;
    asideBody: string;
    atmosphereTitle: string;
    atmosphereBody: string;
    imageUrl: string;
    imageAlt: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    alt: string;
  };
  practice: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: AboutCard[];
  };
  people: {
    eyebrow: string;
    title: string;
    subtitle: string;
    foundersLabel: string;
    constellationLabel: string;
    viewProfileLabel: string;
  };
  roots: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: AboutCard[];
  };
  closing: {
    eyebrow: string;
    title: string;
    body: string;
    actions: AboutAction[];
  };
};

export const FOREST_ABOUT_GALLERY_IMAGES = [
  "/brands/forest-lighthouse/about/gallery/hand-in-garden.jpg",
  "/brands/forest-lighthouse/about/gallery/studio-mats.jpeg",
  "/brands/forest-lighthouse/about/gallery/raised-hands.jpg",
  "/brands/forest-lighthouse/photos/079A0848.jpg",
  "/brands/forest-lighthouse/about/gallery/class-circle.jpg",
  "/brands/forest-lighthouse/about/gallery/gathering.jpeg",
  "/brands/forest-lighthouse/photos/IMG_1984.jpeg",
  "/brands/forest-lighthouse/about/gallery/sunlit-space.jpg",
  "/brands/forest-lighthouse/about/gallery/movement-practice.jpg",
  "/brands/forest-lighthouse/about/gallery/hallway.jpg",
  "/brands/forest-lighthouse/photos/DSC01185.JPG",
] as const;

const ABOUT_PEOPLE: ForestAboutPersonSeed[] = [
  {
    id: "betzabel-falfan",
    featured: true,
    localSlug: "betzabel-falfan",
    imageAlt: {
      en: "Betzabel Falfan at Forest Lighthouse",
      fr: "Betzabel Falfan au Forest Lighthouse",
    },
    name: "Betzabel Falfan",
    role: {
      en: "Co-founder and Feldenkrais practitioner",
      fr: "Co-fondatrice et praticienne Feldenkrais",
    },
    summary: {
      en: "Betzabel brings the center's work back to lived experience: weekly classes, individual sessions, and a way of teaching grounded in warmth, rigor, and care.",
      fr: "Betzabel ramène le travail du centre vers l'expérience vécue : des cours hebdomadaires, des séances individuelles et une pédagogie ancrée dans la chaleur humaine, la rigueur et le soin.",
    },
  },
  {
    id: "nikos-appelqvist",
    featured: true,
    localSlug: "nikos-appelqvist",
    imageAlt: {
      en: "Nikos Appelqvist at Forest Lighthouse",
      fr: "Nikos Appelqvist au Forest Lighthouse",
    },
    name: "Nikos Appelqvist",
    role: {
      en: "Co-founder and Feldenkrais practitioner",
      fr: "Co-fondateur et praticien Feldenkrais",
    },
    summary: {
      en: "Nikos helps shape Forest Lighthouse as both a practice space and a research-minded ecosystem, where somatics, culture, and hospitality can meet.",
      fr: "Nikos façonne Forest Lighthouse comme un lieu de pratique et comme un écosystème de recherche, où la somatique, la culture et l'hospitalité peuvent se rencontrer.",
    },
  },
  {
    id: "mattis-appelqvist",
    imageUrl: "/brands/forest-lighthouse/about/mattis-appelqvist.jpg",
    imageAlt: {
      en: "Mattis Appelqvist portrait",
      fr: "Portrait de Mattis Appelqvist",
    },
    name: "Mattis Appelqvist",
    role: {
      en: "Co-founder, composer, and filmmaker",
      fr: "Co-fondateur, compositeur et réalisateur",
    },
    summary: {
      en: "Mattis works between music, film, and cognitive science, extending the center's pedagogical work into documentaries, animation, and narrative experiments.",
      fr: "Mattis travaille entre musique, cinéma et sciences cognitives, en prolongeant le travail pédagogique du centre dans des documentaires, des animations et des formes narratives.",
    },
  },
  {
    id: "eve-kolinski",
    imageUrl: "/brands/forest-lighthouse/about/eve-kolinski.jpg",
    imageAlt: {
      en: "Eve Kolinski portrait",
      fr: "Portrait d'Eve Kolinski",
    },
    name: "Eve Kolinski",
    role: {
      en: "Dancer, practitioner, and operations support",
      fr: "Danseuse, praticienne et soutien opérationnel",
    },
    summary: {
      en: "Eve brings the same attentiveness to organizing classes and trainings that she brings to movement practice: precise, responsive, and quietly essential.",
      fr: "Eve apporte à l'organisation des cours et des formations la même qualité d'attention qu'au mouvement : précision, réactivité et présence discrètement essentielle.",
    },
  },
  {
    id: "yvo-mentens",
    localSlug: "yvo-mentens",
    imageAlt: {
      en: "Yvo Mentens portrait",
      fr: "Portrait de Yvo Mentens",
    },
    name: "Yvo Mentens",
    role: {
      en: "Feldenkrais practitioner",
      fr: "Praticien Feldenkrais",
    },
    summary: {
      en: "Yvo's presence extends the center's commitment to nuanced perception, steady attention, and the long arc of embodied learning.",
      fr: "La présence de Yvo prolonge l'engagement du centre pour une perception nuancée, une attention stable et le temps long de l'apprentissage incarné.",
    },
  },
  {
    id: "pia-appelquist",
    localSlug: "pia-appelquist",
    imageAlt: {
      en: "Pia Appelquist portrait",
      fr: "Portrait de Pia Appelquist",
    },
    name: "Pia Appelquist",
    role: {
      en: "Feldenkrais practitioner and assistant trainer",
      fr: "Praticienne Feldenkrais et assistante formatrice",
    },
    summary: {
      en: "Pia contributes a long view of transmission, helping the center stay connected to lineage, clarity, and the craft of teaching over time.",
      fr: "Pia apporte une vision longue de la transmission, en aidant le centre à rester relié à une lignée, à la clarté et à l'art d'enseigner dans la durée.",
    },
  },
  {
    id: "dr-howard-schubiner",
    imageUrl: "/brands/forest-lighthouse/about/dr-howard-schubiner.jpg",
    imageAlt: {
      en: "Dr Howard Schubiner portrait",
      fr: "Portrait du Dr Howard Schubiner",
    },
    name: "Dr Howard Schubiner",
    role: {
      en: "Mind-body physician and educator",
      fr: "Médecin et pédagogue corps-esprit",
    },
    summary: {
      en: "Howard's work on chronic pain broadens the conversation at Forest Lighthouse, linking somatic learning with clinical insight and compassionate care.",
      fr: "Le travail de Howard sur la douleur chronique élargit le dialogue au Forest Lighthouse, en reliant l'apprentissage somatique à l'intuition clinique et au soin.",
    },
  },
  {
    id: "alan-questel",
    localSlug: "alan-questel",
    imageAlt: {
      en: "Alan Questel portrait",
      fr: "Portrait d'Alan Questel",
    },
    name: "Alan Questel",
    role: {
      en: "Feldenkrais trainer",
      fr: "Formateur Feldenkrais",
    },
    summary: {
      en: "Alan is part of the wider teaching constellation around the center, known for bringing clarity, creativity, humor, and humanity into the learning space.",
      fr: "Alan fait partie de la constellation pédagogique qui entoure le centre, avec une manière d'enseigner reconnue pour sa clarté, sa créativité, son humour et son humanité.",
    },
  },
];

const CONTENT: Record<LocaleCode, ForestAboutContent> = {
  en: {
    hero: {
      eyebrow: "Forest Lighthouse",
      title: "A lighthouse in a forest?",
      subtitle: "Meet the place, the people, and the practice behind Forest Lighthouse in Brussels.",
      body: [
        "Nuestra Casa Es Su Casa. Forest Lighthouse is designed as a place where movement, attention, and community can be lived, not just discussed.",
        "It is a home for classes, workshops, training paths, and conversations that help people come back to themselves and to one another.",
      ],
      actions: [
        { href: "/domains", label: "Explore domains" },
        { href: "/calendar", label: "See what's on", variant: "secondary" },
      ],
      highlights: ["Movement as inquiry", "Learning in company", "Practice for real life"],
    },
    story: {
      eyebrow: "Origins",
      title: "Nuestra Casa Es Su Casa.",
      subtitle: "Forest Lighthouse began as a desire to make room for humanity, connection, and serious embodied study.",
      paragraphs: [
        "Nikos, from the windswept coasts of Denmark, and Betzabel, from the vibrant heart of Mexico, met in India. Their shared love of art, research, and culture gradually turned into a vision for a center where people could rediscover themselves through movement, awareness, and community.",
        "The place was never imagined as a neutral venue. It was imagined as a living home: a space that can hold weekly rhythm, deeper study, informal exchange, and the many different tempos people need when they are learning.",
        "In uncertain moments, Forest Lighthouse offers gentleness and orientation. In more adventurous ones, it becomes a place to celebrate discovery, forgotten wisdom, and the pleasure of learning together.",
      ],
      asideTitle: "A living, extended family",
      asideBody:
        "The center is cultivated like a garden: shaped by different people, sustained by reciprocity, and made stronger because the whole is larger than the sum of its parts.",
      atmosphereTitle: "A house that participates",
      atmosphereBody:
        "The atmosphere matters here. Light, textures, conversation, and pacing are all treated as part of the pedagogy, not as decoration around it.",
      imageUrl: "/brands/forest-lighthouse/photos/DSC01037.jpg",
      imageAlt: "Interior atmosphere at Forest Lighthouse",
    },
    gallery: {
      eyebrow: "Inside the house",
      title: "A walk through the rooms, the garden, and the atmosphere",
      subtitle: "The About page on the live site carries a whole visual essay. This slider now brings that material into the rebuilt page too.",
      alt: "Forest Lighthouse atmosphere",
    },
    practice: {
      eyebrow: "Practice",
      title: "Awaken the body's wisdom",
      subtitle: "Learn together. Live more fully.",
      items: [
        {
          title: "Movement as a language",
          body: "Classes and workshops treat movement as a way to sense, think, feel, and reorganize. Technique matters, but it is always in service of aliveness and choice.",
        },
        {
          title: "Embodied learning that stays with you",
          body: "The work is designed to transfer back into daily life: teaching, art-making, caregiving, recovery, coordination, and the many small decisions that shape how we live.",
        },
        {
          title: "A place to pause and reorient",
          body: "Forest Lighthouse is built for people who need room to slow down, inquire, and find a clearer path forward without giving up depth or rigor.",
        },
      ],
    },
    people: {
      eyebrow: "People",
      title: "Nothing meaningful is ever built alone.",
      subtitle: "Meet some of the people who shape, support, teach, and extend the Forest Lighthouse ecosystem.",
      foundersLabel: "Co-founders",
      constellationLabel: "Teaching and research constellation",
      viewProfileLabel: "View profile",
    },
    roots: {
      eyebrow: "Roots",
      title: "Our roots",
      subtitle:
        "Diversity of people, cultures, and movement is the fertile soil this place depends on. When learning mirrors nature, it becomes adaptive, plural, and full of perspective.",
      items: [
        {
          title: "Curiosity",
          body: "Every meaningful connection begins with attention and a real question. Curiosity keeps the work alive and prevents certainty from closing it down too early.",
        },
        {
          title: "Cultivation",
          body: "Growth needs conditions. The center tries to create those conditions with care: time, structure, hospitality, continuity, and enough freedom for discovery.",
        },
        {
          title: "Community",
          body: "People learn better with and from one another. Forest Lighthouse treats companionship, dialogue, and shared practice as part of the work itself.",
        },
      ],
    },
    closing: {
      eyebrow: "Come by",
      title: "Come for a class. Stay for the conversation.",
      body:
        "Whether you are arriving for a first lesson, looking for a training path, or simply curious about the space, Forest Lighthouse is meant to be entered from many sides.",
      actions: [
        { href: "/visit", label: "Plan your visit" },
        { href: "/contact", label: "Contact us", variant: "secondary" },
      ],
    },
  },
  fr: {
    hero: {
      eyebrow: "Forest Lighthouse",
      title: "Un phare dans la forêt ?",
      subtitle: "Rencontrez le lieu, les personnes et la pratique qui donnent forme à Forest Lighthouse à Bruxelles.",
      body: [
        "Nuestra Casa Es Su Casa. Forest Lighthouse est pensé comme un lieu où le mouvement, l'attention et la communauté se vivent, et pas seulement se racontent.",
        "C'est une maison pour les cours, les stages, les parcours de formation et les conversations qui aident chacun·e à revenir à soi et aux autres.",
      ],
      actions: [
        { href: "/domains", label: "Explorer les domaines" },
        { href: "/calendar", label: "Voir ce qu'il y a à l'affiche", variant: "secondary" },
      ],
      highlights: ["Le mouvement comme recherche", "Apprendre ensemble", "Une pratique pour la vie"],
    },
    story: {
      eyebrow: "Origines",
      title: "Nuestra Casa Es Su Casa.",
      subtitle: "Forest Lighthouse est né d'un désir de faire de la place à l'humanité, à la rencontre et à une étude incarnée exigeante.",
      paragraphs: [
        "Nikos, venu des côtes venteuses du Danemark, et Betzabel, originaire du cœur vibrant du Mexique, se sont rencontrés en Inde. Leur amour commun pour les arts, la recherche et la culture s'est transformé peu à peu en une vision : créer un centre où l'on puisse se redécouvrir à travers le mouvement, la conscience de soi et la communauté.",
        "Le lieu n'a jamais été imaginé comme un simple contenant neutre. Il a été pensé comme une maison vivante : un espace capable d'accueillir le rythme hebdomadaire, l'étude approfondie, les échanges informels et les différents tempos dont chacun·e a besoin pour apprendre.",
        "Dans les moments d'incertitude, Forest Lighthouse offre de la douceur et des repères. Dans les moments plus aventureux, il devient un endroit où célébrer la découverte, les sagesses oubliées et le plaisir d'apprendre ensemble.",
      ],
      asideTitle: "Une famille élargie et vivante",
      asideBody:
        "Le centre se cultive comme un jardin : façonné par des personnes différentes, soutenu par la réciprocité et renforcé par le fait que le tout dépasse la somme de ses parties.",
      atmosphereTitle: "Une maison qui participe",
      atmosphereBody:
        "L'atmosphère compte ici. La lumière, les textures, les conversations et le rythme du lieu sont considérés comme faisant partie de la pédagogie elle-même.",
      imageUrl: "/brands/forest-lighthouse/photos/DSC01037.jpg",
      imageAlt: "Atmosphère intérieure du Forest Lighthouse",
    },
    gallery: {
      eyebrow: "À l'intérieur",
      title: "Une traversée des salles, du jardin et de l'atmosphère du lieu",
      subtitle: "La page À propos du site d'origine portait déjà un essai visuel. Ce slider le réintègre maintenant dans la nouvelle page.",
      alt: "Atmosphère Forest Lighthouse",
    },
    practice: {
      eyebrow: "Pratique",
      title: "Éveiller l'intelligence du corps",
      subtitle: "Apprendre ensemble. Vivre plus pleinement.",
      items: [
        {
          title: "Le mouvement comme langage",
          body: "Les cours et les stages abordent le mouvement comme une manière de sentir, de penser, de ressentir et de se réorganiser. La technique compte, mais toujours au service de la vitalité et du choix.",
        },
        {
          title: "Un apprentissage qui reste incarné",
          body: "Le travail est conçu pour retourner dans la vie quotidienne : l'enseignement, la création, le soin, la récupération, la coordination et toutes les petites décisions qui façonnent notre manière de vivre.",
        },
        {
          title: "Un lieu pour faire une pause et se réorienter",
          body: "Forest Lighthouse s'adresse aussi aux personnes qui ont besoin d'un espace pour ralentir, enquêter et retrouver un cap plus clair sans renoncer à la profondeur ni à l'exigence.",
        },
      ],
    },
    people: {
      eyebrow: "Personnes",
      title: "Rien de vraiment significatif ne se construit seul.",
      subtitle: "Rencontrez quelques-unes des personnes qui façonnent, soutiennent, enseignent et prolongent l'écosystème Forest Lighthouse.",
      foundersLabel: "Co-fondateur·rices",
      constellationLabel: "Constellation pédagogique et de recherche",
      viewProfileLabel: "Voir le profil",
    },
    roots: {
      eyebrow: "Racines",
      title: "Nos racines",
      subtitle:
        "La diversité des personnes, des cultures et des mouvements est le terreau fertile dont ce lieu a besoin. Quand l'apprentissage reflète la nature, il devient adaptatif, pluriel et riche de perspectives.",
      items: [
        {
          title: "Curiosité",
          body: "Toute connexion qui compte commence par l'attention et par une vraie question. La curiosité maintient le travail vivant et empêche les certitudes de le refermer trop tôt.",
        },
        {
          title: "Cultiver",
          body: "La croissance demande des conditions. Le centre essaie de les créer avec soin : du temps, une structure, de l'hospitalité, de la continuité et assez de liberté pour que la découverte advienne.",
        },
        {
          title: "Communauté",
          body: "On apprend mieux avec les autres et grâce aux autres. Forest Lighthouse considère la compagnie, le dialogue et la pratique partagée comme faisant partie du travail lui-même.",
        },
      ],
    },
    closing: {
      eyebrow: "Passer nous voir",
      title: "Venez pour un cours. Restez pour la conversation.",
      body:
        "Que vous arriviez pour une première séance, pour un parcours de formation ou simplement par curiosité, Forest Lighthouse est pensé pour être approché de plusieurs manières.",
      actions: [
        { href: "/visit", label: "Préparer votre visite" },
        { href: "/contact", label: "Nous contacter", variant: "secondary" },
      ],
    },
  },
};

export function getForestAboutContent(locale: LocaleCode) {
  return CONTENT[locale];
}

export function getForestAboutPeople() {
  return ABOUT_PEOPLE;
}
