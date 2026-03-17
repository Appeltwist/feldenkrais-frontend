import type { LocaleCode } from "@/lib/types";

export type ForestVisitLink = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export type ForestVisitImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ForestVisitIconKey =
  | "tea"
  | "kitchen"
  | "changing"
  | "studio"
  | "stairs"
  | "seat"
  | "ground"
  | "toilet";

export type ForestVisitIconItem = {
  icon: ForestVisitIconKey;
  title: string;
  body: string;
};

export type ForestVisitTextGroup = {
  title: string;
  body?: string;
  items?: string[];
};

export type ForestVisitFaqItem = {
  question: string;
  answer: string;
};

export type ForestVisitTravelTab = {
  key: "brussels" | "abroad";
  label: string;
  title: string;
  intro: string;
  checklistLabel?: string;
  checklistItems?: string[];
  sections: ForestVisitTextGroup[];
  supportLink?: ForestVisitLink;
};

export type ForestVisitContent = {
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    addressName: string;
    addressLines: string[];
    mapsLink: ForestVisitLink;
    primaryCta: ForestVisitLink;
    image: ForestVisitImage;
    supportingImage: ForestVisitImage;
  };
  travelTabs: {
    eyebrow: string;
    title: string;
    intro: string;
    tabs: ForestVisitTravelTab[];
  };
  entrance: {
    eyebrow: string;
    title: string;
    intro: string;
    arrivalNote: string;
    images: ForestVisitImage[];
  };
  whatYouWillFind: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ForestVisitIconItem[];
    bringTitle: string;
    bringItems: string[];
    note: string;
  };
  accessibility: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ForestVisitIconItem[];
    note: string;
    contactLink: ForestVisitLink;
  };
  around: {
    eyebrow: string;
    title: string;
    intro: string;
    leadTitle: string;
    leadBody: string;
    groups: Array<{ title: string; items: string[] }>;
    note: string;
    contactLink: ForestVisitLink;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: ForestVisitFaqItem[];
  };
  finalContact: {
    eyebrow: string;
    title: string;
    body: string;
    actions: ForestVisitLink[];
  };
};

const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=274%20Rue%20des%20Alli%C3%A9s%2C%201190%20Forest%2C%20Belgium";

const CONTENT: Record<LocaleCode, ForestVisitContent> = {
  en: {
    hero: {
      eyebrow: "Visit",
      title: "Visit Forest Lighthouse",
      intro:
        "Practical information for finding your way to Forest Lighthouse, whether you are coming from Brussels or travelling from abroad for a workshop or training.",
      addressName: "Forest Lighthouse",
      addressLines: ["274 Rue des Alliés", "1190 Forest, Brussels"],
      mapsLink: { href: MAPS_HREF, label: "Open in Google Maps" },
      primaryCta: { href: "/contact", label: "Contact us" },
      image: {
        src: "/brands/forest-lighthouse/photos/FeldenkraisATM.jpg",
        alt: "Feldenkrais practice taking place in the main hall at Forest Lighthouse.",
      },
      supportingImage: {
        src: "/brands/forest-lighthouse/photos/portail.jpeg",
        alt: "The green gate at the entrance of Forest Lighthouse.",
        caption: "On a first visit, the green gate is the clearest landmark.",
      },
    },
    travelTabs: {
      eyebrow: "Choose your route",
      title: "Travel to Forest Lighthouse",
      intro:
        "The quickest guidance if you are already in Brussels, or a slightly fuller layer if you are arriving from abroad.",
      tabs: [
        {
          key: "brussels",
          label: "In Brussels",
          title: "Already in Brussels",
          intro:
            "Forest Lighthouse is easy to reach by public transport, bicycle, or taxi once you are in the city.",
          checklistLabel: "Useful landmarks",
          checklistItems: [
            "Nearest stops: Berthelot and Wiels",
            "Bicycle parking is available at the centre",
            "Gare du Midi is a simple nearby arrival point with a short onward trip",
          ],
          sections: [
            {
              title: "Getting there",
              body:
                "If you are crossing Brussels, leave a little margin for the last part of the journey, especially on a first visit.",
            },
            {
              title: "Need help on the day?",
              body:
                "During staffed class hours, you are also welcome to come by the desk if you need help with bookings or practical questions.",
            },
          ],
          supportLink: { href: "/contact", label: "Need help planning your route?" },
        },
        {
          key: "abroad",
          label: "Coming from abroad",
          title: "Arriving from abroad",
          intro:
            "Forest Lighthouse regularly welcomes people coming to Brussels for weekend workshops, five-day trainings, and professional programs.",
          checklistLabel: "Simplest arrival points",
          checklistItems: [
            "Brussels Airport (Zaventem)",
            "Charleroi Airport",
            "Gare du Midi / Bruxelles-Midi / Brussel-Zuid",
            "FlixBus or coach arrivals into Brussels",
          ],
          sections: [
            {
              title: "From Brussels Airport",
              body:
                "A taxi is often the most direct option. Train to Gare du Midi followed by a short onward trip also works well.",
            },
            {
              title: "From Charleroi or coach arrivals",
              body:
                "Taxi, shuttle, or coach connections into Brussels are all possible, depending on your itinerary. Gare du Midi is often the simplest transfer point.",
            },
            {
              title: "Where to stay",
              items: [
                "Louise, Châtelain, Saint-Gilles, Uccle, and Forest all give reasonably easy access to the centre.",
                "Airbnb, HomeExchange, and hotels can all work well depending on the length of your stay.",
                "If you are joining a longer training and want practical suggestions, please contact us.",
              ],
            },
          ],
          supportLink: { href: "/contact", label: "Need practical travel suggestions?" },
        },
      ],
    },
    entrance: {
      eyebrow: "Finding the entrance",
      title: "Look for the large green gate",
      intro:
        "When you arrive at 274 Rue des Alliés, the large green gate is the easiest landmark to recognise on a first visit.",
      arrivalNote:
        "We recommend keeping the arrival photo in mind and allowing a few extra minutes the first time you come.",
      images: [
        {
          src: "/brands/forest-lighthouse/photos/portail.jpeg",
          alt: "Large green gate at the entrance of Forest Lighthouse.",
          caption: "Look for the large green gate at number 274.",
        },
        {
          src: "/brands/forest-lighthouse/photos/patio.jpg",
          alt: "Patio passage just inside Forest Lighthouse.",
          caption: "Once through the gate, the patio brings you gently into the centre.",
        },
        {
          src: "/brands/forest-lighthouse/photos/forest-gathering-window.jpeg",
          alt: "Gathering area with large windows inside Forest Lighthouse.",
          caption: "Inside, the shared waiting and tea area confirms you are in the right place.",
        },
      ],
    },
    whatYouWillFind: {
      eyebrow: "On site",
      title: "What you will find here",
      intro:
        "Forest Lighthouse is set up for weekly practice, workshops, and longer training rhythms.",
      items: [
        {
          icon: "seat",
          title: "Waiting area",
          body: "A calm place to arrive, pause, and settle before your session begins.",
        },
        {
          icon: "tea",
          title: "Tea and coffee",
          body: "Tea and coffee are available, especially during events and longer formats.",
        },
        {
          icon: "kitchen",
          title: "Kitchen",
          body: "A shared kitchen supports breaks, longer days, and simple meals.",
        },
        {
          icon: "changing",
          title: "Changing rooms",
          body: "Two changing rooms make it easy to change before or after movement practice.",
        },
        {
          icon: "studio",
          title: "Ground-floor studios",
          body: "Two studios on the ground floor support classes, sessions, and workshops.",
        },
        {
          icon: "stairs",
          title: "Canopy Hall",
          body: "The Canopy Hall sits upstairs and is used for larger gatherings and trainings.",
        },
      ],
      bringTitle: "What to bring",
      bringItems: ["Comfortable clothes", "Water", "A notebook when relevant for the event"],
      note:
        "For workshops and trainings, mats, blankets, rollers, and props are available on site. For details specific to a class, workshop, or training, check the relevant page or contact us directly.",
    },
    accessibility: {
      eyebrow: "Accessibility",
      title: "Clear access information",
      intro:
        "The most helpful approach here is to be specific about what is on the ground floor and what requires stairs.",
      items: [
        {
          icon: "ground",
          title: "Ground floor access",
          body: "Two studios are available on the ground floor.",
        },
        {
          icon: "stairs",
          title: "Canopy Hall upstairs",
          body: "The Canopy Hall is upstairs and reached by stairs.",
        },
        {
          icon: "toilet",
          title: "Toilets on site",
          body: "There are three toilets on site.",
        },
      ],
      note:
        "If reduced mobility or access needs are relevant to your visit, please contact us in advance so we can help plan the most suitable access and room arrangement.",
      contactLink: { href: "/contact", label: "Contact us about accessibility" },
    },
    around: {
      eyebrow: "Around Forest Lighthouse",
      title: "Useful nearby rhythms",
      intro:
        "If you arrive early or stay nearby, a few simple neighbourhood landmarks make the day easier.",
      leadTitle: "Coffee, groceries, green space, and easy areas to stay",
      leadBody:
        "You do not need a full city guide here. Most visitors just need a few reliable options close to Forest Lighthouse for food, a walk, basic groceries, or a practical overnight base.",
      groups: [
        {
          title: "Cafes and food",
          items: ["Les Voisines", "WIELS", "Rocket's Café", "OB", "La Peruche", "La Table d'Hôte"],
        },
        {
          title: "Groceries nearby",
          items: ["Lidl", "Delhaize"],
        },
        {
          title: "Parks",
          items: ["Parc Duden", "Parc de Forest"],
        },
        {
          title: "Areas visitors often choose",
          items: ["Louise", "Châtelain", "Saint-Gilles", "Uccle", "Forest"],
        },
      ],
      note:
        "Need more local suggestions for food or accommodation? Contact us and we will be happy to point you in the right direction.",
      contactLink: { href: "/contact", label: "Ask for local suggestions" },
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        {
          question: "Is Forest Lighthouse open to beginners?",
          answer:
            "Many activities welcome beginners. If prior experience is needed, it will be mentioned on the relevant class, workshop, or training page.",
        },
        {
          question: "What should I wear?",
          answer: "Wear comfortable clothes that allow you to move easily.",
        },
        {
          question: "What should I bring?",
          answer:
            "Please bring water and, when useful for the event, a notebook. Mats, blankets, rollers, and other props are available on site.",
        },
        {
          question: "Can I arrive late?",
          answer:
            "Whenever possible, please arrive a little early, especially if it is your first visit. Late arrival can disturb a group session.",
        },
        {
          question: "Is there parking?",
          answer:
            "There is bicycle parking at the centre. If you are coming by car and want practical advice for that day, please contact us in advance.",
        },
        {
          question: "Which language is the class or training in?",
          answer:
            "This depends on the specific offer. Please check the relevant page or contact us if you are unsure.",
        },
        {
          question: "Can I speak with someone in person?",
          answer:
            "Yes. During staffed class hours, you are welcome to come to the desk for help with bookings or practical questions.",
        },
        {
          question: "Is the space accessible?",
          answer:
            "Partly. Some spaces are on the ground floor, while the Canopy Hall is upstairs and accessed by stairs. Please contact us in advance if access is important for your visit.",
        },
      ],
    },
    finalContact: {
      eyebrow: "Still unsure?",
      title: "We can help you prepare your visit",
      body:
        "If you are unsure about the route, your arrival, accessibility, or where to stay nearby, write to us and we will help you prepare.",
      actions: [
        { href: "/contact", label: "Contact us" },
        { href: MAPS_HREF, label: "Open in Google Maps", variant: "secondary" },
      ],
    },
  },
  fr: {
    hero: {
      eyebrow: "Visiter",
      title: "Visiter Forest Lighthouse",
      intro:
        "Informations pratiques pour trouver facilement Forest Lighthouse, que vous veniez de Bruxelles ou que vous arriviez de l'étranger pour un atelier ou une formation.",
      addressName: "Forest Lighthouse",
      addressLines: ["274 Rue des Alliés", "1190 Forest, Bruxelles"],
      mapsLink: { href: MAPS_HREF, label: "Ouvrir dans Google Maps" },
      primaryCta: { href: "/contact", label: "Nous contacter" },
      image: {
        src: "/brands/forest-lighthouse/photos/FeldenkraisATM.jpg",
        alt: "Pratique Feldenkrais en cours dans le hall principal de Forest Lighthouse.",
      },
      supportingImage: {
        src: "/brands/forest-lighthouse/photos/portail.jpeg",
        alt: "Le portail vert à l'entrée de Forest Lighthouse.",
        caption: "Lors d'une première venue, le portail vert reste le repère le plus simple.",
      },
    },
    travelTabs: {
      eyebrow: "Choisir votre route",
      title: "Venir à Forest Lighthouse",
      intro:
        "Le plus utile si vous êtes déjà à Bruxelles, ou une couche un peu plus complète si vous arrivez de l'étranger.",
      tabs: [
        {
          key: "brussels",
          label: "À Bruxelles",
          title: "Si vous êtes déjà à Bruxelles",
          intro:
            "Forest Lighthouse est facile d'accès en transport public, à vélo, ou en taxi une fois dans la ville.",
          checklistLabel: "Repères utiles",
          checklistItems: [
            "Arrêts proches : Berthelot et Wiels",
            "Un parking vélo est disponible au centre",
            "Gare du Midi reste un point d'arrivée simple, avec un court trajet jusqu'à Forest Lighthouse",
          ],
          sections: [
            {
              title: "Sur le trajet",
              body:
                "Prévoir quelques minutes de marge pour la dernière partie du trajet suffit en général, surtout lors d'une première venue.",
            },
            {
              title: "Besoin d'aide le jour même ?",
              body:
                "Pendant les heures de cours où l'accueil est ouvert, vous pouvez aussi passer au bureau pour une question pratique ou une aide de réservation.",
            },
          ],
          supportLink: { href: "/contact", label: "Besoin d'aide pour organiser le trajet ?" },
        },
        {
          key: "abroad",
          label: "Depuis l'étranger",
          title: "Si vous venez de l'étranger",
          intro:
            "Forest Lighthouse accueille régulièrement des personnes qui viennent à Bruxelles pour des ateliers de week-end, des formations de cinq jours, et des parcours professionnels.",
          checklistLabel: "Points d'arrivée les plus simples",
          checklistItems: [
            "Brussels Airport (Zaventem)",
            "Charleroi Airport",
            "Gare du Midi / Bruxelles-Midi / Brussel-Zuid",
            "FlixBus ou cars longue distance vers Bruxelles",
          ],
          sections: [
            {
              title: "Depuis Zaventem",
              body:
                "Le taxi est souvent l'option la plus directe. Le train jusqu'à Gare du Midi puis un court trajet vers Forest Lighthouse fonctionne aussi très bien.",
            },
            {
              title: "Depuis Charleroi ou les cars longue distance",
              body:
                "Taxi, navette, ou car vers Bruxelles restent les options les plus habituelles selon votre itinéraire. Gare du Midi est souvent le point de transfert le plus simple.",
            },
            {
              title: "Où loger",
              items: [
                "Louise, Châtelain, Saint-Gilles, Uccle, et Forest permettent en général un accès assez simple au lieu.",
                "Airbnb, HomeExchange, et hôtels peuvent tous bien fonctionner selon la durée du séjour.",
                "Si vous rejoignez une formation plus longue et souhaitez des suggestions pratiques, contactez-nous.",
              ],
            },
          ],
          supportLink: { href: "/contact", label: "Besoin de suggestions pratiques ?" },
        },
      ],
    },
    entrance: {
      eyebrow: "Trouver l'entrée",
      title: "Cherchez le grand portail vert",
      intro:
        "Quand vous arrivez au 274 Rue des Alliés, le grand portail vert reste le repère le plus simple à reconnaître lors d'une première venue.",
      arrivalNote:
        "Nous conseillons de garder cette image de repérage en tête et de prévoir quelques minutes de plus la première fois.",
      images: [
        {
          src: "/brands/forest-lighthouse/photos/portail.jpeg",
          alt: "Grand portail vert à l'entrée de Forest Lighthouse.",
          caption: "Cherchez le grand portail vert au 274.",
        },
        {
          src: "/brands/forest-lighthouse/photos/patio.jpg",
          alt: "Patio juste après l'entrée à Forest Lighthouse.",
          caption: "Une fois le portail franchi, le patio vous guide naturellement vers le lieu.",
        },
        {
          src: "/brands/forest-lighthouse/photos/forest-gathering-window.jpeg",
          alt: "Espace d'accueil et de pause avec de grandes fenêtres à Forest Lighthouse.",
          caption: "À l'intérieur, l'espace d'attente et de thé confirme rapidement que vous êtes au bon endroit.",
        },
      ],
    },
    whatYouWillFind: {
      eyebrow: "Sur place",
      title: "Ce que vous trouverez ici",
      intro:
        "Forest Lighthouse est organisé pour les rythmes de pratique hebdomadaire, les ateliers, et les temps de formation plus longs.",
      items: [
        {
          icon: "seat",
          title: "Espace d'attente",
          body: "Un endroit calme pour arriver, respirer, et vous poser avant le début.",
        },
        {
          icon: "tea",
          title: "Thé et café",
          body: "Thé et café sont disponibles, en particulier pendant les événements et les formats plus longs.",
        },
        {
          icon: "kitchen",
          title: "Cuisine",
          body: "Une cuisine partagée soutient les pauses, les repas simples, et les longues journées.",
        },
        {
          icon: "changing",
          title: "Vestiaires",
          body: "Deux vestiaires permettent de vous changer avant ou après une pratique en mouvement.",
        },
        {
          icon: "studio",
          title: "Studios au rez-de-chaussée",
          body: "Deux studios au rez-de-chaussée accueillent cours, séances, et ateliers.",
        },
        {
          icon: "stairs",
          title: "Canopy Hall",
          body: "Le Canopy Hall se trouve à l'étage et accueille les groupes plus larges et certaines formations.",
        },
      ],
      bringTitle: "À apporter",
      bringItems: ["Des vêtements confortables", "De l'eau", "Un carnet si cela est utile pour l'événement"],
      note:
        "Pour les ateliers et formations, tapis, couvertures, rollers, et autres supports sont disponibles sur place. Pour un détail spécifique à un cours, un atelier, ou une formation, consultez la page concernée ou contactez-nous directement.",
    },
    accessibility: {
      eyebrow: "Accessibilité",
      title: "Des informations d'accès claires",
      intro:
        "Ici, le plus utile est d'indiquer clairement ce qui se trouve au rez-de-chaussée et ce qui demande des escaliers.",
      items: [
        {
          icon: "ground",
          title: "Accès rez-de-chaussée",
          body: "Deux studios sont accessibles au rez-de-chaussée.",
        },
        {
          icon: "stairs",
          title: "Canopy Hall à l'étage",
          body: "Le Canopy Hall se situe à l'étage et s'atteint par des escaliers.",
        },
        {
          icon: "toilet",
          title: "Toilettes sur place",
          body: "Trois toilettes sont disponibles sur place.",
        },
      ],
      note:
        "Si la mobilité réduite ou d'autres besoins d'accès sont importants pour votre visite, contactez-nous à l'avance afin que nous puissions préparer l'accès et l'organisation les plus adaptés.",
      contactLink: { href: "/contact", label: "Nous contacter au sujet de l'accessibilité" },
    },
    around: {
      eyebrow: "Autour de Forest Lighthouse",
      title: "Des repères utiles dans le quartier",
      intro:
        "Si vous arrivez en avance ou restez à proximité, quelques repères simples suffisent pour rendre la journée plus fluide.",
      leadTitle: "Manger, faire quelques courses, marcher un peu, ou choisir un quartier où loger",
      leadBody:
        "L'idée ici n'est pas de faire un guide complet de Bruxelles, mais de donner quelques points fiables à portée de Forest Lighthouse quand vous avez besoin d'une pause, d'un repas, ou d'un lieu pratique où rester.",
      groups: [
        {
          title: "Cafés et repas",
          items: ["Les Voisines", "WIELS", "Rocket's Café", "OB", "La Peruche", "La Table d'Hôte"],
        },
        {
          title: "Courses à proximité",
          items: ["Lidl", "Delhaize"],
        },
        {
          title: "Parcs",
          items: ["Parc Duden", "Parc de Forest"],
        },
        {
          title: "Quartiers où loger",
          items: ["Louise", "Châtelain", "Saint-Gilles", "Uccle", "Forest"],
        },
      ],
      note:
        "Besoin de suggestions plus locales pour manger ou loger ? Écrivez-nous et nous vous orienterons volontiers.",
      contactLink: { href: "/contact", label: "Demander des suggestions locales" },
    },
    faq: {
      eyebrow: "FAQ",
      title: "Questions fréquentes",
      items: [
        {
          question: "Forest Lighthouse est-il ouvert aux débutants ?",
          answer:
            "De nombreuses activités accueillent les débutants. Si une expérience préalable est nécessaire, cela sera indiqué sur la page du cours, de l'atelier, ou de la formation.",
        },
        {
          question: "Que dois-je porter ?",
          answer: "Portez des vêtements confortables qui vous permettent de bouger facilement.",
        },
        {
          question: "Que dois-je apporter ?",
          answer:
            "Merci de prévoir de l'eau et, si cela est utile pour l'événement, un carnet. Tapis, couvertures, rollers, et autres supports sont disponibles sur place.",
        },
        {
          question: "Puis-je arriver en retard ?",
          answer:
            "Dans la mesure du possible, merci d'arriver un peu en avance, surtout lors d'une première venue. Une arrivée tardive peut perturber une séance de groupe.",
        },
        {
          question: "Y a-t-il du parking ?",
          answer:
            "Un parking vélo est disponible au centre. Si vous venez en voiture et souhaitez un conseil pratique pour ce jour-là, contactez-nous à l'avance.",
        },
        {
          question: "Dans quelle langue se déroule le cours ou la formation ?",
          answer:
            "Cela dépend de l'offre concernée. Consultez la page correspondante ou contactez-nous si vous avez un doute.",
        },
        {
          question: "Puis-je parler à quelqu'un sur place ?",
          answer:
            "Oui. Pendant les heures de cours où l'accueil est ouvert, vous pouvez passer au bureau pour une aide de réservation ou une question pratique.",
        },
        {
          question: "Le lieu est-il accessible ?",
          answer:
            "Partiellement. Certains espaces se trouvent au rez-de-chaussée, tandis que le Canopy Hall est à l'étage et s'atteint par des escaliers. Contactez-nous à l'avance si l'accès est important pour votre visite.",
        },
      ],
    },
    finalContact: {
      eyebrow: "Encore un doute ?",
      title: "Nous pouvons vous aider à préparer votre venue",
      body:
        "Si vous hésitez sur le trajet, l'arrivée, l'accessibilité, ou le quartier où loger, écrivez-nous et nous vous aiderons à préparer la visite.",
      actions: [
        { href: "/contact", label: "Nous contacter" },
        { href: MAPS_HREF, label: "Ouvrir dans Google Maps", variant: "secondary" },
      ],
    },
  },
};

export function getForestVisitContent(locale: LocaleCode) {
  return CONTENT[locale];
}
