import type { LocaleCode } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════
   Pricing page content — bilingual (EN / FR)
   Source alignment: https://forest-lighthouse.be/en/pricing/
   ═══════════════════════════════════════════════════════════ */

/* ── types ── */

export type FeatureItem = string | { main: string; sub: string };

export type JourneyStep = {
  label: string;
  boldPart?: string;
  highlighted?: boolean;
  href?: string;
};

export type PackageCard = {
  tier: string;
  cardVariant?: string;
  recommended?: boolean;
  badgeText?: string;
  badgeVariant?: string;
  period: string;
  description?: string;
  price: string;
  strikePrice?: string;
  features: FeatureItem[];
  cta: string;
  ctaUrl?: string;
};

export type PassCard = {
  name: string;
  cardVariant?: string;
  price: string;
  perClass?: string;
  description?: string;
  features: FeatureItem[];
  cta: string;
  ctaUrl?: string;
};

export type FeatureColumn = {
  title: string;
  paragraphs: string[];
  image: string;
};

export type ScheduleEntry = {
  time: string;
  className: string;
  instructor: string;
  languages: string[];
  level?: string;
  description?: string;
  color?: string;
};

export type ScheduleDay = {
  day: string;
  entries: ScheduleEntry[];
};

export type Strategy = {
  title: string;
  description: string;
};

export type PlatformFeature = {
  title: string;
  description: string;
};

export type FaqCategory = {
  category: string;
  items: Array<{ question: string; answer: string }>;
};

export type BenefitsPack = {
  tier: string;
  highlights: string[];
};

export type PricingContent = {
  hero: {
    title: string;
    subtitle: string;
    journeySteps: JourneyStep[];
  };
  packages: {
    heading: string;
    cards: PackageCard[];
    cta: string;
    contactCta: string;
  };
  passes: {
    heading: string;
    cards: PassCard[];
    cta?: string;
    contactCta?: string;
  };
  commitment: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    bullets?: string[];
  };
  features: {
    columns: FeatureColumn[];
  };
  schedule: {
    heading: string;
    subtitle?: string;
    days: ScheduleDay[];
  };
  individualSession: {
    heading: string;
    subtitle?: string;
    subheading: string;
    strategies: Strategy[];
  };
  platform: {
    heading: string;
    subtitle: string;
    features: PlatformFeature[];
  };
  benefits: {
    heading: string;
    overview: BenefitsPack[];
    cta: string;
    contactCta: string;
  };
  faq: {
    heading: string;
    categories: FaqCategory[];
  };
};

/* ── booking URLs ── */

const BOOKING = {
  book: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23&prodId=100023",
  dropIn: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23&prodId=100003",
  memberships: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=40",
  classPasses: "https://clients.mindbodyonline.com/classic/ws?studioid=5742807&stype=41&sTG=23",
} as const;

/* ── class metadata ── */

function applyClassMeta(entries: ScheduleEntry[]): ScheduleEntry[] {
  return entries.map((e) => ({
    ...e,
    level: e.level ?? "All levels",
    color: e.color ?? "rgba(0,55,56,0.55)",
  }));
}

function applyClassMetaFr(entries: ScheduleEntry[]): ScheduleEntry[] {
  return entries.map((e) => ({
    ...e,
    level: e.level ?? "Tous niveaux",
    color: e.color ?? "rgba(0,55,56,0.55)",
  }));
}

/* ── content ── */

const CONTENT: Record<LocaleCode, PricingContent> = {
  en: {
    hero: {
      title: "Learn, Move And Live Fully",
      subtitle:
        "Every year, we support hundreds of people in their journey toward greater awareness, ease, and vitality through somatic education.",
      journeySteps: [
        { label: "Try a", boldPart: "free class", highlighted: true, href: BOOKING.book },
        { label: "Get your", boldPart: "pass or membership", },
        { label: "Practice regularly and", boldPart: "reconnect with your body" },
        { label: "Optionally, a", boldPart: "personalized one-to-one session" },
        { label: "", boldPart: "Deepen your practice", },
      ],
    },

    packages: {
      heading: "8-Week Starter Packages",
      cta: "Book",
      contactCta: "Contact",
      cards: [
        {
          tier: "Discovery",
          cardVariant: "lite",
          badgeText: "Simple",
          badgeVariant: "mint",
          price: "120\u00a0\u20ac",
          period: "8 weeks",
          description: "The simplest option: you come, you try, you build your own rhythm.",
          features: [
            { main: "Unlimited classes", sub: "for 8 weeks" },
            { main: "Ideal if you attend 2\u20133\u00d7 / week", sub: "" },
            { main: "You choose:", sub: "Feldenkrais, yoga, pilates, voice\u2026" },
          ],
          cta: "Book",
          ctaUrl: BOOKING.book,
        },
        {
          tier: "Guided Program",
          cardVariant: "featured",
          recommended: true,
          badgeText: "Recommended \u2013 limited spots",
          badgeVariant: "gold",
          price: "210\u00a0\u20ac",
          strikePrice: "370\u00a0\u20ac",
          period: "8 weeks",
          description: "The best way to start: you move forward with a clear strategy and simple guidance.",
          features: [
            { main: "Unlimited classes", sub: "for 8 weeks" },
            { main: "1 individual Feldenkrais session", sub: "to improve pain, performance, or comfort" },
            { main: "Platform access (2 months)", sub: "to continue between classes" },
          ],
          cta: "Book",
          ctaUrl: BOOKING.book,
        },
        {
          tier: "Immersive Program",
          cardVariant: "premium",
          badgeText: "Premium \u2013 limited spots",
          badgeVariant: "coral",
          price: "620\u00a0\u20ac",
          period: "8 weeks",
          description: "To go faster and deeper: classes plus private sessions, within a focused framework.",
          features: [
            { main: "Unlimited classes", sub: "for 8 weeks" },
            { main: "3 private sessions", sub: "(yoga or pilates\u2026) to progress quickly" },
            { main: "3 individual Feldenkrais sessions", sub: "to improve pain, performance, or comfort" },
            { main: "Platform access (2 months)", sub: "to continue between classes" },
          ],
          cta: "Book",
          ctaUrl: BOOKING.book,
        },
      ],
    },

    passes: {
      heading: "Passes & Subscriptions",
      cta: "See all passes",
      contactCta: "Contact",
      cards: [
        {
          name: "Drop-in",
          cardVariant: "lite",
          price: "17\u00a0\u20ac",
          perClass: "/ class",
          description: "Come once, no commitment. Ideal for discovering a class, a practice, or the atmosphere of the place.",
          features: [
            "Pay per class, no registration required.",
            "Useful for trying out different practices.",
            "If you come often, passes or memberships become more cost-effective.",
          ],
          cta: "Book",
          ctaUrl: BOOKING.dropIn,
        },
        {
          name: "Memberships",
          cardVariant: "featured",
          price: "60\u2013120\u00a0\u20ac",
          perClass: "/ month",
          description: "For a regular and steady practice. The most economical option if you attend every week.",
          features: [
            { main: "60\u00a0\u20ac / month", sub: "\u2014 5 classes per month." },
            { main: "120\u00a0\u20ac / month", sub: "\u2014 unlimited access." },
            "For those who enjoy establishing a steady rhythm.",
          ],
          cta: "Subscribe",
          ctaUrl: BOOKING.memberships,
        },
        {
          name: "Class Passes",
          cardVariant: "premium",
          price: "75\u2013300\u00a0\u20ac",
          perClass: "15\u00a0\u20ac / class",
          description: "A flexible option, without a subscription. You buy several classes in advance and come whenever you like.",
          features: [
            "Packs of 5, 10, 20, or 30 classes, valid for 3 to 6 months",
            "More cost-effective than drop-in.",
            "Ideal if your weekly rhythm varies.",
          ],
          cta: "Book",
          ctaUrl: BOOKING.classPasses,
        },
      ],
    },

    commitment: {
      heading: "Why do we recommend packages?",
      subheading: "You commit \u2014 and so do we.",
      paragraphs: [
        "Eight weeks provides the conditions for something real to happen. It\u2019s enough time to step out of the \u201cdoing it right\u201d logic, to allow your body to learn at its own pace, and to experience changes that last.",
        "When you commit to a package, you\u2019re choosing consistency \u2014 and we match that with tailored, personalized support across every session.",
      ],
      bullets: [
        "Step out of the logic of \u201cdoing it right\u201d",
        "Let the body learn at its own pace",
        "Feel stable, lasting changes \u2014 not just temporary ones",
      ],
    },

    features: {
      columns: [
        {
          title: "8 weeks of group classes",
          paragraphs: [
            "Explore freely, over 8 weeks, a diversity of practices: Pilates, Feldenkrais, various yoga styles, and polyphonic singing.",
            "Build functional mobility, finer coordination, and evenly distributed strength. All teachers hold advanced qualifications and engage in continuous training.",
          ],
          image: "/brands/forest-lighthouse/yoga-lines.png",
        },
        {
          title: "1 individual session with Neurosomatic guidance",
          paragraphs: [
            "A personalized exploration of your movement patterns.",
            "Through gentle touch, the practitioner supports your awareness and ease \u2014 helping you discover new possibilities in how you move and feel.",
          ],
          image: "/brands/forest-lighthouse/hands.png",
        },
        {
          title: "2 month access to our exclusive Neurosomatic App",
          paragraphs: [
            "A platform with 200+ guided lessons and educational content.",
            "Includes documentaries, talks, and refined self-image work to deepen your practice between sessions, at your own pace.",
          ],
          image: "/brands/forest-lighthouse/headphones.png",
        },
      ],
    },

    schedule: {
      heading: "I. Weekly Classes",
      subtitle: "Design your practice",
      days: [
        {
          day: "Monday",
          entries: applyClassMeta([
            { time: "8:00\u20139:15", className: "Ashtanga Yoga", instructor: "Gaspard", languages: ["FR", "EN"] },
            { time: "17:30\u201318:30", className: "Pilates", instructor: "Joy", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Vinyasa to Yin Yoga", instructor: "Joy", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Feldenkrais", instructor: "Juan", languages: ["FR"] },
            { time: "19:30\u201320:30", className: "Yoga Vinyasa Gentle Flow", instructor: "Sabine", languages: ["EN"] },
          ]),
        },
        {
          day: "Tuesday",
          entries: applyClassMeta([
            { time: "17:30\u201318:30", className: "Pilates", instructor: "Ana", languages: ["FR", "EN"] },
            { time: "19:30\u201320:30", className: "Yoga Vinyasa", instructor: "Ana", languages: ["EN"] },
          ]),
        },
        {
          day: "Wednesday",
          entries: applyClassMeta([
            { time: "8:00\u20139:15", className: "Ashtanga Yoga", instructor: "Gaspard", languages: ["FR", "EN"] },
            { time: "18:00\u201319:00", className: "Hatha Yoga", instructor: "Jelila", languages: ["FR", "EN"] },
          ]),
        },
        {
          day: "Thursday",
          entries: applyClassMeta([
            { time: "17:30\u201318:30", className: "Pilates", instructor: "Joy", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Vinyasa to Yin Yoga", instructor: "Joy", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Feldenkrais", instructor: "Betzabel", languages: ["FR"] },
            { time: "19:30\u201320:45", className: "Chant Polyphonique", instructor: "Maria & Betzabel", languages: ["FR", "ES"] },
          ]),
        },
        {
          day: "Friday",
          entries: applyClassMeta([
            { time: "8:00\u20139:15", className: "Ashtanga Yoga", instructor: "Gaspard", languages: ["FR", "EN"] },
            { time: "17:30\u201318:30", className: "Pilates", instructor: "Orazio", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Yoga Vinyasa Space&Flow", instructor: "Sacha", languages: ["EN", "FR"] },
          ]),
        },
      ],
    },

    individualSession: {
      heading: "II. Individual Session",
      subtitle: "Tailored support",
      subheading: "10 key strategies of a personalized session:",
      strategies: [
        { title: "Move with attention", description: "Awareness improves coordination." },
        { title: "Flexible body, flexible mind", description: "Variety supports adaptability." },
        { title: "Variation drives learning", description: "The nervous system learns through differences." },
        { title: "Effort as information", description: "Effort signals precision opportunities." },
        { title: "Slow down to learn", description: "Slowing sharpens perception." },
        { title: "Organisation before strength", description: "Coordination precedes power." },
        { title: "From sensation to choice", description: "Sensation enables freedom." },
        { title: "Learning with gravity", description: "Gravity transforms balance and confidence." },
        { title: "Integrate rather than correct", description: "Coherence through relationships." },
        { title: "Pleasure as a learning signal", description: "Enjoyable learning keeps the nervous system engaged." },
      ],
    },

    platform: {
      heading: "III. The Neurosomatic Platform",
      subtitle: "Between sessions, at your own pace",
      features: [
        { title: "200+ lessons", description: "Organized by application: sports, rehabilitation, chronic pain, wellness." },
        { title: "Live classes every Monday", description: "In French and English, with real-time guidance." },
        { title: "26 thematic documentaries", description: "Exploring Feldenkrais principles and neuroscience." },
        { title: "Supplementary resources", description: "Conferences, interviews, and educational content." },
      ],
    },

    benefits: {
      heading: "Included in the packages:",
      overview: [
        {
          tier: "Discovery",
          highlights: [
            "Unlimited classes (8 weeks)",
            "All disciplines included",
            "No commitment after the 8 weeks",
          ],
        },
        {
          tier: "Guided",
          highlights: [
            "Everything in Discovery",
            "1 individual Feldenkrais session",
            "2-month platform access",
          ],
        },
        {
          tier: "Immersive",
          highlights: [
            "Everything in Guided",
            "3 private sessions (yoga/pilates)",
            "3 individual Feldenkrais sessions",
          ],
        },
      ],
      cta: "Book",
      contactCta: "Contact",
    },

    faq: {
      heading: "Frequently Asked Questions",
      categories: [
        {
          category: "Practical",
          items: [
            {
              question: "What amenities does Forest Lighthouse offer?",
              answer: "Calm studio environment with relaxation area, equipped kitchen, changing rooms, bicycle parking, library and patio. Welcoming atmosphere supporting learning and warm hospitality.",
            },
            {
              question: "How do I get to Forest Lighthouse centre?",
              answer: "Buses: 48, 52, 49, 50. Trams: 82, 97. Tram 97 connects Louise and Saint-Gilles almost to our doorstep. Gare du Midi is approximately 10 minutes away.",
            },
            {
              question: "How do I access the centre?",
              answer: "Located at 274 Rue des Alli\u00e9s, 1190 Brussels. Green gate with doorbell; ring if closed. Our team will welcome you upon arrival.",
            },
          ],
        },
        {
          category: "General",
          items: [
            {
              question: "What is Forest Lighthouse?",
              answer: "A somatic education centre in Brussels offering classes, workshops and professional training in neurosomatic education focusing on the Feldenkrais method. Our mission helps people explore untapped potential through body-mind connection awareness.",
            },
            {
              question: "What types of classes and training do you offer?",
              answer: "A wide range of somatic classes and training tailored to different needs. We bridge arts and sciences from dance to neuroscience: Feldenkrais, yoga, Pilates, voice, practitioner training, specialized workshops, and emerging somatic approaches.",
            },
            {
              question: "Who are events and activities for?",
              answer: "Most events are open to everyone. Unless specifying prerequisites, we welcome anyone interested in exploring somatic education and personal development.",
            },
          ],
        },
        {
          category: "Payment",
          items: [
            {
              question: "What payment options do you offer?",
              answer: "Payments via Stripe. Options: \u20ac17 per drop-in class, class passes (5\u201330 sessions) valid 3\u20136 months, memberships \u20ac60/month (5 classes) or \u20ac120/month (unlimited), and 8-week programmes.",
            },
            {
              question: "Are there additional fees and what is the cancellation policy?",
              answer: "Transparent pricing with no hidden fees. All taxes included. Bookings are non-refundable once made; please book only when certain of attendance.",
            },
            {
              question: "Is subscription automatic?",
              answer: "Subscriptions are flexible; stop anytime by email or profile. An initial 3-month commitment is requested to fully discover the class benefits.",
            },
            {
              question: "Special discounts offered?",
              answer: "Reductions are possible on request for students or those currently unemployed. Contact us for more information.",
            },
          ],
        },
      ],
    },
  },

  fr: {
    hero: {
      title: "Apprendre, Bouger Et Vivre Pleinement",
      subtitle:
        "Chaque ann\u00e9e, nous accompagnons des centaines de personnes dans leur cheminement vers une plus grande conscience, aisance et vitalit\u00e9 par l\u2019\u00e9ducation somatique.",
      journeySteps: [
        { label: "Essayez un", boldPart: "cours gratuit", highlighted: true, href: BOOKING.book },
        { label: "Prenez votre", boldPart: "pass ou abonnement" },
        { label: "Pratiquez r\u00e9guli\u00e8rement et", boldPart: "reconnectez-vous \u00e0 votre corps" },
        { label: "Optionnellement, une", boldPart: "s\u00e9ance personnalis\u00e9e" },
        { label: "", boldPart: "Approfondissez votre pratique" },
      ],
    },

    packages: {
      heading: "Programmes de 8 semaines",
      cta: "R\u00e9server",
      contactCta: "Contact",
      cards: [
        {
          tier: "D\u00e9couverte",
          cardVariant: "lite",
          badgeText: "Simple",
          badgeVariant: "mint",
          price: "120\u00a0\u20ac",
          period: "8 semaines",
          description: "L\u2019option la plus simple : vous venez, vous essayez, vous construisez votre propre rythme.",
          features: [
            { main: "Cours illimit\u00e9s", sub: "pendant 8 semaines" },
            { main: "Id\u00e9al si vous venez 2\u20133\u00d7 / semaine", sub: "" },
            { main: "Vous choisissez :", sub: "Feldenkrais, yoga, pilates, voix\u2026" },
          ],
          cta: "R\u00e9server",
          ctaUrl: BOOKING.book,
        },
        {
          tier: "Programme Guid\u00e9",
          cardVariant: "featured",
          recommended: true,
          badgeText: "Recommand\u00e9 \u2013 places limit\u00e9es",
          badgeVariant: "gold",
          price: "210\u00a0\u20ac",
          strikePrice: "370\u00a0\u20ac",
          period: "8 semaines",
          description: "La meilleure fa\u00e7on de commencer : avancez avec une strat\u00e9gie claire et un accompagnement simple.",
          features: [
            { main: "Cours illimit\u00e9s", sub: "pendant 8 semaines" },
            { main: "1 s\u00e9ance individuelle Feldenkrais", sub: "pour am\u00e9liorer douleur, performance ou confort" },
            { main: "Acc\u00e8s plateforme (2 mois)", sub: "pour continuer entre les cours" },
          ],
          cta: "R\u00e9server",
          ctaUrl: BOOKING.book,
        },
        {
          tier: "Programme Immersif",
          cardVariant: "premium",
          badgeText: "Premium \u2013 places limit\u00e9es",
          badgeVariant: "coral",
          price: "620\u00a0\u20ac",
          period: "8 semaines",
          description: "Pour aller plus vite et plus loin : cours plus s\u00e9ances priv\u00e9es, dans un cadre cibl\u00e9.",
          features: [
            { main: "Cours illimit\u00e9s", sub: "pendant 8 semaines" },
            { main: "3 s\u00e9ances priv\u00e9es", sub: "(yoga ou pilates\u2026) pour progresser rapidement" },
            { main: "3 s\u00e9ances individuelles Feldenkrais", sub: "pour am\u00e9liorer douleur, performance ou confort" },
            { main: "Acc\u00e8s plateforme (2 mois)", sub: "pour continuer entre les cours" },
          ],
          cta: "R\u00e9server",
          ctaUrl: BOOKING.book,
        },
      ],
    },

    passes: {
      heading: "Pass & Abonnements",
      cta: "Voir tous les pass",
      contactCta: "Contact",
      cards: [
        {
          name: "Cours \u00e0 l\u2019unit\u00e9",
          cardVariant: "lite",
          price: "17\u00a0\u20ac",
          perClass: "/ cours",
          description: "Venez une fois, sans engagement. Id\u00e9al pour d\u00e9couvrir un cours, une pratique ou l\u2019atmosph\u00e8re du lieu.",
          features: [
            "Paiement par cours, sans inscription requise.",
            "Utile pour essayer diff\u00e9rentes pratiques.",
            "Si vous venez souvent, les pass ou abonnements deviennent plus avantageux.",
          ],
          cta: "R\u00e9server",
          ctaUrl: BOOKING.dropIn,
        },
        {
          name: "Abonnements",
          cardVariant: "featured",
          price: "60\u2013120\u00a0\u20ac",
          perClass: "/ mois",
          description: "Pour une pratique r\u00e9guli\u00e8re et stable. L\u2019option la plus \u00e9conomique si vous venez chaque semaine.",
          features: [
            { main: "60\u00a0\u20ac / mois", sub: "\u2014 5 cours par mois." },
            { main: "120\u00a0\u20ac / mois", sub: "\u2014 acc\u00e8s illimit\u00e9." },
            "Pour ceux qui aiment \u00e9tablir un rythme r\u00e9gulier.",
          ],
          cta: "S\u2019abonner",
          ctaUrl: BOOKING.memberships,
        },
        {
          name: "Carnets de cours",
          cardVariant: "premium",
          price: "75\u2013300\u00a0\u20ac",
          perClass: "15\u00a0\u20ac / cours",
          description: "Une option flexible, sans abonnement. Achetez plusieurs cours \u00e0 l\u2019avance et venez quand vous le souhaitez.",
          features: [
            "Carnets de 5, 10, 20 ou 30 cours, valables 3 \u00e0 6 mois",
            "Plus avantageux que le cours \u00e0 l\u2019unit\u00e9.",
            "Id\u00e9al si votre rythme hebdomadaire varie.",
          ],
          cta: "R\u00e9server",
          ctaUrl: BOOKING.classPasses,
        },
      ],
    },

    commitment: {
      heading: "Pourquoi recommandons-nous les programmes ?",
      subheading: "Vous vous engagez \u2014 et nous aussi.",
      paragraphs: [
        "Huit semaines offrent les conditions pour que quelque chose de r\u00e9el se passe. C\u2019est assez de temps pour sortir de la logique du \u00ab bien faire \u00bb, permettre \u00e0 votre corps d\u2019apprendre \u00e0 son propre rythme, et vivre des changements durables.",
        "Quand vous choisissez un programme, vous optez pour la r\u00e9gularit\u00e9 \u2014 et nous y r\u00e9pondons par un accompagnement personnalis\u00e9 \u00e0 chaque s\u00e9ance.",
      ],
      bullets: [
        "Sortir de la logique du \u00ab bien faire \u00bb",
        "Laisser le corps apprendre \u00e0 son propre rythme",
        "Ressentir des changements stables et durables \u2014 pas seulement temporaires",
      ],
    },

    features: {
      columns: [
        {
          title: "8 semaines de cours collectifs",
          paragraphs: [
            "Explorez librement, sur 8 semaines, une diversit\u00e9 de pratiques : Pilates, Feldenkrais, divers styles de yoga et chant polyphonique.",
            "D\u00e9veloppez une mobilit\u00e9 fonctionnelle, une coordination plus fine et une force mieux r\u00e9partie. Tous les enseignants sont hautement qualifi\u00e9s et en formation continue.",
          ],
          image: "/brands/forest-lighthouse/yoga-lines.png",
        },
        {
          title: "1 s\u00e9ance individuelle avec guidance Neurosomatique",
          paragraphs: [
            "Une exploration personnalis\u00e9e de vos sch\u00e9mas de mouvement.",
            "Par un toucher d\u00e9licat, le praticien soutient votre conscience et votre aisance \u2014 vous aidant \u00e0 d\u00e9couvrir de nouvelles possibilit\u00e9s dans votre fa\u00e7on de bouger et de ressentir.",
          ],
          image: "/brands/forest-lighthouse/hands.png",
        },
        {
          title: "2 mois d\u2019acc\u00e8s \u00e0 notre App Neurosomatique exclusive",
          paragraphs: [
            "Une plateforme avec plus de 200 le\u00e7ons guid\u00e9es et du contenu \u00e9ducatif.",
            "Inclut documentaires, conf\u00e9rences et travail d\u2019image de soi raffin\u00e9 pour approfondir votre pratique entre les s\u00e9ances, \u00e0 votre rythme.",
          ],
          image: "/brands/forest-lighthouse/headphones.png",
        },
      ],
    },

    schedule: {
      heading: "I. Cours Hebdomadaires",
      subtitle: "Concevez votre pratique",
      days: [
        {
          day: "Lundi",
          entries: applyClassMetaFr([
            { time: "8:00\u20139:15", className: "Ashtanga Yoga", instructor: "Gaspard", languages: ["FR", "EN"] },
            { time: "17:30\u201318:30", className: "Pilates", instructor: "Joy", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Vinyasa to Yin Yoga", instructor: "Joy", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Feldenkrais", instructor: "Juan", languages: ["FR"] },
            { time: "19:30\u201320:30", className: "Yoga Vinyasa Gentle Flow", instructor: "Sabine", languages: ["EN"] },
          ]),
        },
        {
          day: "Mardi",
          entries: applyClassMetaFr([
            { time: "17:30\u201318:30", className: "Pilates", instructor: "Ana", languages: ["FR", "EN"] },
            { time: "19:30\u201320:30", className: "Yoga Vinyasa", instructor: "Ana", languages: ["EN"] },
          ]),
        },
        {
          day: "Mercredi",
          entries: applyClassMetaFr([
            { time: "8:00\u20139:15", className: "Ashtanga Yoga", instructor: "Gaspard", languages: ["FR", "EN"] },
            { time: "18:00\u201319:00", className: "Hatha Yoga", instructor: "Jelila", languages: ["FR", "EN"] },
          ]),
        },
        {
          day: "Jeudi",
          entries: applyClassMetaFr([
            { time: "17:30\u201318:30", className: "Pilates", instructor: "Joy", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Vinyasa to Yin Yoga", instructor: "Joy", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Feldenkrais", instructor: "Betzabel", languages: ["FR"] },
            { time: "19:30\u201320:45", className: "Chant Polyphonique", instructor: "Maria & Betzabel", languages: ["FR", "ES"] },
          ]),
        },
        {
          day: "Vendredi",
          entries: applyClassMetaFr([
            { time: "8:00\u20139:15", className: "Ashtanga Yoga", instructor: "Gaspard", languages: ["FR", "EN"] },
            { time: "17:30\u201318:30", className: "Pilates", instructor: "Orazio", languages: ["FR", "EN"] },
            { time: "18:30\u201319:30", className: "Yoga Vinyasa Space&Flow", instructor: "Sacha", languages: ["EN", "FR"] },
          ]),
        },
      ],
    },

    individualSession: {
      heading: "II. S\u00e9ance Individuelle",
      subtitle: "Accompagnement personnalis\u00e9",
      subheading: "10 strat\u00e9gies cl\u00e9s d\u2019une s\u00e9ance personnalis\u00e9e :",
      strategies: [
        { title: "Bouger avec attention", description: "La conscience am\u00e9liore la coordination." },
        { title: "Corps flexible, esprit flexible", description: "La vari\u00e9t\u00e9 soutient l\u2019adaptabilit\u00e9." },
        { title: "La variation stimule l\u2019apprentissage", description: "Le syst\u00e8me nerveux apprend par les diff\u00e9rences." },
        { title: "L\u2019effort comme information", description: "L\u2019effort signale des opportunit\u00e9s de pr\u00e9cision." },
        { title: "Ralentir pour apprendre", description: "Ralentir aiguise la perception." },
        { title: "Organisation avant force", description: "La coordination pr\u00e9c\u00e8de la puissance." },
        { title: "De la sensation au choix", description: "La sensation permet la libert\u00e9." },
        { title: "Apprendre avec la gravit\u00e9", description: "La gravit\u00e9 transforme l\u2019\u00e9quilibre et la confiance." },
        { title: "Int\u00e9grer plut\u00f4t que corriger", description: "La coh\u00e9rence par les relations." },
        { title: "Le plaisir comme signal d\u2019apprentissage", description: "L\u2019apprentissage agr\u00e9able garde le syst\u00e8me nerveux engag\u00e9." },
      ],
    },

    platform: {
      heading: "III. La Plateforme Neurosomatique",
      subtitle: "Entre les s\u00e9ances, \u00e0 votre rythme",
      features: [
        { title: "200+ le\u00e7ons", description: "Organis\u00e9es par application : sport, r\u00e9habilitation, douleur chronique, bien-\u00eatre." },
        { title: "Cours en direct chaque lundi", description: "En fran\u00e7ais et en anglais, avec guidance en temps r\u00e9el." },
        { title: "26 documentaires th\u00e9matiques", description: "Explorant les principes Feldenkrais et les neurosciences." },
        { title: "Ressources compl\u00e9mentaires", description: "Conf\u00e9rences, interviews et contenu \u00e9ducatif." },
      ],
    },

    benefits: {
      heading: "Inclus dans les programmes :",
      overview: [
        {
          tier: "D\u00e9couverte",
          highlights: [
            "Cours illimit\u00e9s (8 semaines)",
            "Toutes les disciplines incluses",
            "Sans engagement apr\u00e8s les 8 semaines",
          ],
        },
        {
          tier: "Guid\u00e9",
          highlights: [
            "Tout ce qui est dans D\u00e9couverte",
            "1 s\u00e9ance individuelle Feldenkrais",
            "Acc\u00e8s plateforme 2 mois",
          ],
        },
        {
          tier: "Immersif",
          highlights: [
            "Tout ce qui est dans Guid\u00e9",
            "3 s\u00e9ances priv\u00e9es (yoga/pilates)",
            "3 s\u00e9ances individuelles Feldenkrais",
          ],
        },
      ],
      cta: "R\u00e9server",
      contactCta: "Contact",
    },

    faq: {
      heading: "Questions Fr\u00e9quentes",
      categories: [
        {
          category: "Pratique",
          items: [
            {
              question: "Quels \u00e9quipements propose Forest Lighthouse ?",
              answer: "Un studio calme avec espace d\u00e9tente, cuisine \u00e9quip\u00e9e, vestiaires, parking v\u00e9los, biblioth\u00e8que et patio. Une atmosph\u00e8re accueillante soutenant l\u2019apprentissage et l\u2019hospitalit\u00e9.",
            },
            {
              question: "Comment se rendre au centre Forest Lighthouse ?",
              answer: "Bus : 48, 52, 49, 50. Trams : 82, 97. Le tram 97 relie Louise et Saint-Gilles presque \u00e0 notre porte. La Gare du Midi est \u00e0 environ 10 minutes.",
            },
            {
              question: "Comment acc\u00e9der au centre ?",
              answer: "Situ\u00e9 au 274 Rue des Alli\u00e9s, 1190 Bruxelles. Portail vert avec sonnette ; sonnez si ferm\u00e9. Notre \u00e9quipe vous accueillera \u00e0 votre arriv\u00e9e.",
            },
          ],
        },
        {
          category: "G\u00e9n\u00e9ral",
          items: [
            {
              question: "Qu\u2019est-ce que Forest Lighthouse ?",
              answer: "Un centre d\u2019\u00e9ducation somatique \u00e0 Bruxelles proposant cours, ateliers et formations professionnelles en \u00e9ducation neurosomatique centr\u00e9s sur la m\u00e9thode Feldenkrais.",
            },
            {
              question: "Quels types de cours et formations proposez-vous ?",
              answer: "Un large \u00e9ventail de cours somatiques et formations adapt\u00e9s \u00e0 diff\u00e9rents besoins : Feldenkrais, yoga, Pilates, voix, formation de praticiens, ateliers sp\u00e9cialis\u00e9s et approches somatiques \u00e9mergentes.",
            },
            {
              question: "\u00c0 qui s\u2019adressent les \u00e9v\u00e9nements et activit\u00e9s ?",
              answer: "La plupart des \u00e9v\u00e9nements sont ouverts \u00e0 tous. Sauf mention de pr\u00e9requis, nous accueillons toute personne int\u00e9ress\u00e9e par l\u2019exploration de l\u2019\u00e9ducation somatique et le d\u00e9veloppement personnel.",
            },
          ],
        },
        {
          category: "Paiement",
          items: [
            {
              question: "Quelles options de paiement proposez-vous ?",
              answer: "Paiements via Stripe. Options : 17\u20ac par cours \u00e0 l\u2019unit\u00e9, carnets de cours (5\u201330 s\u00e9ances) valables 3\u20136 mois, abonnements 60\u20ac/mois (5 cours) ou 120\u20ac/mois (illimit\u00e9), et programmes de 8 semaines.",
            },
            {
              question: "Y a-t-il des frais suppl\u00e9mentaires et quelle est la politique d\u2019annulation ?",
              answer: "Tarification transparente sans frais cach\u00e9s. Toutes taxes incluses. Les r\u00e9servations ne sont pas remboursables une fois effectu\u00e9es.",
            },
            {
              question: "L\u2019abonnement est-il automatique ?",
              answer: "Les abonnements sont flexibles ; arr\u00eatez \u00e0 tout moment par email ou profil. Un engagement initial de 3 mois est demand\u00e9 pour d\u00e9couvrir pleinement les b\u00e9n\u00e9fices des cours.",
            },
            {
              question: "Des r\u00e9ductions sont-elles propos\u00e9es ?",
              answer: "Des r\u00e9ductions sont possibles sur demande pour les \u00e9tudiants ou les personnes sans emploi. Contactez-nous pour plus d\u2019informations.",
            },
          ],
        },
      ],
    },
  },
};

export function getPricingContent(locale: string): PricingContent {
  const code = locale.toLowerCase().startsWith("fr") ? "fr" : "en";
  return CONTENT[code];
}
