export const SUPPORTED_LANGS = ["fr", "en"];
export const DEFAULT_LANG = "fr";
export const LANG_COOKIE = "jp_lang";

export function normalizeLang(value) {
  if (typeof value === "string" && value.toLowerCase().startsWith("en")) {
    return "en";
  }
  return "fr";
}

export const NAV_LABELS = {
  fr: {
    "/": "Accueil",
    "/signature": "Signature",
    "/evenements": "Événements",
    "/mariage": "Mariage",
    "/entreprises": "Entreprises & lieux",
    "/a-propos": "À propos",
    "/contact": "Contact",
  },
  en: {
    "/": "Home",
    "/signature": "Signature",
    "/evenements": "Events",
    "/mariage": "Weddings",
    "/entreprises": "Corporate & Venues",
    "/a-propos": "About",
    "/contact": "Contact",
  },
};

export const UI_COPY = {
  fr: {
    nav: {
      ctaShort: "Devis",
      ctaLong: "Demander un devis",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      servicesEyebrow: "Prestations",
      langLabel: "Langue",
    },
    footer: {
      tagline: "Le rendu d'un éditorial, la discrétion d'un invité.",
      availability: "Disponible en France et à l'international. Réponse sous 24 à 48 h.",
      pagesLabel: "Pages",
      pagesAria: "Pages du site",
      followLabel: "Suivre et écrire",
      legal: "Mentions légales",
      privacy: "Confidentialité",
      backToTop: "Retour en haut",
    },
    references: {
      title: "Ils sont passés devant mon objectif",
      columns: {
        artistes: "Artistes",
        personnalites: "Personnalités",
        mode: "Maisons, médias et lieux",
      },
    },
    offerCards: {
      recommended: "Recommandée",
      from: "À partir de",
    },
    faq: {
      defaultTitle: "Questions fréquentes",
    },
    testimonials: {
      defaultTitle: "Ce que disent mes clients",
    },
    contactBlock: {
      defaultTitle: "Parlons de votre projet",
      defaultText: "Quelques lignes suffisent pour démarrer. Réponse sous 24 à 48 h.",
      defaultLabel: "Demander un devis",
    },
    bridgeCta: {
      text: "Vous organisez un lancement ou une soirée ? Le même regard pour votre événement.",
      primary: "Pour votre événement",
      secondary: "… ou pour votre mariage",
    },
    series: {
      photosUnit: "photos",
      gridView: "Voir en grille",
      carouselView: "Voir en défilé",
      collapse: "Réduire la série",
      expandAll: (count) => `Voir les ${count} photos`,
      openPhoto: (alt) => `Ouvrir la photo : ${alt}`,
      prevPhotos: "Photos précédentes",
      nextPhotos: "Photos suivantes",
      placeholderContext: "[À FOURNIR : une phrase de contexte pour cette série]",
    },
    lightbox: {
      dialogLabel: "Visionneuse d'images",
      share: "Partager",
      shareAria: "Partager cette photo",
      sharing: "Partage en cours...",
      copied: "Lien copié !",
      shareUnavailable: "Partage indisponible",
      shareCancelled: "Partage annulé",
      close: "Fermer",
      prev: "Image précédente",
      next: "Image suivante",
      showPhoto: (title) => `Afficher ${title}`,
    },
    splash: {
      loading: "Chargement",
    },
  },
  en: {
    nav: {
      ctaShort: "Quote",
      ctaLong: "Request a quote",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      servicesEyebrow: "Services",
      langLabel: "Language",
    },
    footer: {
      tagline: "Editorial craft, the discretion of a guest.",
      availability: "Available in France and worldwide. Reply within 24 to 48h.",
      pagesLabel: "Pages",
      pagesAria: "Site pages",
      followLabel: "Follow & contact",
      legal: "Legal notice",
      privacy: "Privacy policy",
      backToTop: "Back to top",
    },
    references: {
      title: "Seen through my lens",
      columns: {
        artistes: "Artists",
        personnalites: "Public Figures",
        mode: "Houses, Media & Venues",
      },
    },
    offerCards: {
      recommended: "Recommended",
      from: "From",
    },
    faq: {
      defaultTitle: "Frequently asked questions",
    },
    testimonials: {
      defaultTitle: "What my clients say",
    },
    contactBlock: {
      defaultTitle: "Let's talk about your project",
      defaultText: "A few lines are enough to get started. Reply within 24 to 48h.",
      defaultLabel: "Request a quote",
    },
    bridgeCta: {
      text: "Planning a launch or a private party? The same editorial eye for your event.",
      primary: "For your event",
      secondary: "… or for your wedding",
    },
    series: {
      photosUnit: "photos",
      gridView: "Grid view",
      carouselView: "Carousel view",
      collapse: "Show fewer photos",
      expandAll: (count) => `View all ${count} photos`,
      openPhoto: (alt) => `Open photo: ${alt}`,
      prevPhotos: "Previous photos",
      nextPhotos: "Next photos",
      placeholderContext: "[TO PROVIDE: a context sentence for this series]",
    },
    lightbox: {
      dialogLabel: "Image viewer",
      share: "Share",
      shareAria: "Share this photo",
      sharing: "Sharing...",
      copied: "Link copied!",
      shareUnavailable: "Sharing unavailable",
      shareCancelled: "Share cancelled",
      close: "Close",
      prev: "Previous image",
      next: "Next image",
      showPhoto: (title) => `Show ${title}`,
    },
    splash: {
      loading: "Loading",
    },
  },
};

export const HOME_PAGE_COPY = {
  fr: {
    heroTitle: "Photographe éditorial à Paris, de la Fashion Week à vos événements",
    heroSubtitle:
      "Le regard des défilés pour vos mariages, vos soirées et vos événements d'entreprise. Un accompagnement du premier rendez-vous à la livraison.",
    ctaPrimary: "Demander un devis",
    ctaSecondary: "Voir les séries Fashion Week",
    prevSlide: "Photo précédente",
    nextSlide: "Photo suivante",
    resumeSlide: "Relancer le diaporama",
    pauseSlide: "Mettre le diaporama en pause",
    showSlide: (title) => `Afficher ${title}`,
    heroLabels: {
      "Fashion Week & Celebrities": "Fashion Week",
      "Fashion Week": "Fashion Week",
      Events: "Événements",
      "Fashion Wedding": "Mariage",
      Mariage: "Mariage",
      Studio: "Studio",
      default: "Portfolio",
    },
    doorsEyebrow: "Prestations",
    doorsTitle: "Ce que je photographie.",
    doors: {
      evenements: {
        titre: "Événements",
        texte: "La même exigence que sur les défilés, pour vos lancements et vos soirées.",
        lien: "Voir les événements",
      },
      mariage: {
        titre: "Mariage",
        texte: "Le regard de la Fashion Week, pour votre mariage.",
        lien: "Voir le mariage",
      },
      entreprises: {
        titre: "Entreprises & lieux",
        texte: "Un photographe fiable à recommander à vos clients.",
        lien: "Voir l'offre entreprises",
      },
    },
    methodEyebrow: "Méthode",
    methodTitle: "Comment je travaille.",
    method: [
      {
        titre: "Repérage et brief",
        texte: "Nous définissons ensemble vos attentes, le lieu, le déroulé et l'usage des images.",
      },
      {
        titre: "Présence discrète le jour J",
        texte: "Je m'efface au milieu de vos invités pour garder des scènes naturelles.",
      },
      {
        titre: "Livraison soignée, dans les délais annoncés",
        texte: "Des images retouchées une à une, livrées dans une galerie privée.",
      },
    ],
    partnersEyebrow: "Partenaires",
    partnersTitle: "Ils nous font confiance.",
    statsEyebrow: "Repères",
    statsTitle: "Mon travail en quelques chiffres.",
    testimonialsTitle: "Ce que disent mes clients",
    contactTitle: "Parlons de votre projet",
    contactText: "Mariage, soirée ou événement d'entreprise : quelques lignes suffisent. Réponse sous 24 à 48 h.",
  },
  en: {
    heroTitle: "Editorial Photographer in Paris, from Fashion Week to Your Events",
    heroSubtitle:
      "A runway eye for your weddings, private parties and corporate events. Personal guidance from our first meeting to final delivery.",
    ctaPrimary: "Request a quote",
    ctaSecondary: "View Fashion Week series",
    prevSlide: "Previous photo",
    nextSlide: "Next photo",
    resumeSlide: "Resume slideshow",
    pauseSlide: "Pause slideshow",
    showSlide: (title) => `Show ${title}`,
    heroLabels: {
      "Fashion Week & Celebrities": "Fashion Week",
      "Fashion Week": "Fashion Week",
      Events: "Events",
      "Fashion Wedding": "Weddings",
      Mariage: "Weddings",
      Studio: "Studio",
      default: "Portfolio",
    },
    doorsEyebrow: "Services",
    doorsTitle: "What I photograph.",
    doors: {
      evenements: {
        titre: "Events",
        texte: "The same standards as the runways, for your launches and private parties.",
        lien: "Explore events",
      },
      mariage: {
        titre: "Weddings",
        texte: "A Fashion Week eye for your wedding.",
        lien: "Explore weddings",
      },
      entreprises: {
        titre: "Corporate & Venues",
        texte: "A reliable photographer to recommend to your clients.",
        lien: "Explore corporate offer",
      },
    },
    methodEyebrow: "Method",
    methodTitle: "How I work.",
    method: [
      {
        titre: "Scouting & brief",
        texte: "We define your expectations, the venue, the schedule and image usage together.",
      },
      {
        titre: "Discreet presence on the day",
        texte: "I blend in among your guests to capture natural, unscripted moments.",
      },
      {
        titre: "Careful delivery, on schedule",
        texte: "Individually retouched images, delivered in a private online gallery.",
      },
    ],
    partnersEyebrow: "Partners",
    partnersTitle: "They trust us.",
    statsEyebrow: "Key figures",
    statsTitle: "My work in a few numbers.",
    testimonialsTitle: "What my clients say",
    contactTitle: "Let's talk about your project",
    contactText: "Wedding, private party or corporate event: a few lines are enough. Reply within 24 to 48h.",
  },
};

const STAT_TRANSLATIONS = {
  "Séries livrées": "Series delivered",
  "depuis 2020": "since 2020",
  "Événements couverts": "Events covered",
  "France et international": "France & worldwide",
  "Marques accompagnées": "Brands supported",
  "mode, mariage, lifestyle": "fashion, wedding, lifestyle",
};

export function translateStat(item, lang) {
  if (lang !== "en" || !item) return item;
  return {
    ...item,
    libelle: STAT_TRANSLATIONS[item.libelle] || item.libelle,
    precision: item.precision ? STAT_TRANSLATIONS[item.precision] || item.precision : item.precision,
  };
}

const SERIES_TITLE_EN = {
  "elie-saab-haute-couture": "Elie Saab Show, Haute Couture",
  "imane-ayissi-haute-couture": "Imane Ayissi Show, Haute Couture",
  "haute-couture-27-janvier-2026": "Haute Couture, January 27, 2026",
  "haute-couture-26-janvier-2026": "Haute Couture, January 26, 2026",
  "pfw-mars-2026": "Paris Fashion Week, March 6, 2026",
  "pfw-septembre-2025": "Paris Fashion Week, September 29, 2025",
  "pfw-octobre-2025": "Paris Fashion Week, October 1, 2025",
  "pfw-6-octobre-2025": "Paris Fashion Week, October 6, 2025",
  "pfw-mars-2025": "Paris Fashion Week, March 6, 2025",
  lemaire: "Lemaire Show, Paris Fashion Week",
  "pfw-celebrites": "Paris Fashion Week, Celebrities",
  amiri: "Amiri Show Guests",
  "michael-rainey-jr": "Michael Rainey Jr.",
  "les-flammes-2026": "Les Flammes 2026",
  "les-flammes-2025": "Les Flammes 2025",
  "joya-l-avant-premiere": "Joya L Premiere",
  "djany-lawson-paris": "Djany Lawson in Paris",
  "d-in-paris": "D in Paris",
  "soirees-a-paris": "Private Parties in Paris",
  mariages: "Wedding Selection",
  studio: "Portraits & Brand Content",
};

const SERIES_SEASON_EN = {
  "Haute Couture, 28 janvier 2026": "Haute Couture, January 28, 2026",
  "Haute Couture, 26 janvier 2026": "Haute Couture, January 26, 2026",
};

export function translateSerie(serie, lang) {
  if (lang !== "en" || !serie) return serie;
  return {
    ...serie,
    titre: SERIES_TITLE_EN[serie.slug] || serie.titre,
    saison: serie.saison ? SERIES_SEASON_EN[serie.saison] || serie.saison : serie.saison,
  };
}

export const PAGES_COPY = {
  signature: {
    fr: {
      eyebrow: "Signature",
      title: "Fashion Week de Paris : défilés, maisons et personnalités",
      lead: "Depuis plusieurs saisons, je photographie les défilés, les invités et les personnalités de la Fashion Week de Paris.",
      bridge: "La même exigence guide chacun de mes mariages et de mes événements.",
      contactTitle: "Le même regard pour votre événement",
      contactText: "Lancement, soirée, gala ou mariage : parlons de votre projet.",
      contactLabel: "Le même regard pour votre événement",
      contactSecondary: "ou pour votre mariage",
    },
    en: {
      eyebrow: "Signature",
      title: "Paris Fashion Week: Runways, Houses & Public Figures",
      lead: "Over several seasons, I have photographed the shows, guests and public figures of Paris Fashion Week.",
      bridge: "The same high standards guide every wedding and event I cover.",
      contactTitle: "The same editorial eye for your event",
      contactText: "Launch, private party, gala or wedding: let's talk about your project.",
      contactLabel: "For your event",
      contactSecondary: "or for your wedding",
    },
  },
  evenements: {
    fr: {
      eyebrow: "Événements",
      title: "Photographe événementiel à Paris : soirées, lancements, galas",
      lead: "L'énergie de vos événements, livrée à temps pour vos réseaux.",
      bridge: "La même exigence que sur les défilés de la Fashion Week, pour votre lancement ou votre soirée.",
      ctaLabel: "Demander un devis",
      coveredTitle: "Événements couverts",
      covered: ["Soirées privées", "Lancements de produit", "Galas", "Avant-premières", "Fashion Week"],
      offerTitle: "Offre",
      offers: [
        {
          titre: "Demi-journée",
          prix: "650 € HT",
          description: "Pour une soirée, un lancement ou une avant-première.",
        },
        {
          titre: "Journée",
          prix: "1 100 € HT",
          description: "Pour un gala, un événement de grande ampleur ou plusieurs temps forts.",
          miseEnAvant: true,
        },
      ],
      optionPrefix: "Option :",
      options: [
        { titre: "sélection express le soir même", prix: "+ 200 € HT" },
        { titre: "second photographe", prix: "+ 450 € HT" },
      ],
      deliveryNote: "Sélection express le soir même en option. Galerie complète sous 7 jours.",
      faqTitle: "Questions fréquentes",
      faq: [
        {
          question: "Quels sont les droits d'usage des images ?",
          reponse: "Les droits d'usage sont précisés par écrit dans le contrat de chaque prestation.",
        },
        {
          question: "Quels sont les délais de livraison ?",
          reponse: "Une sélection express le soir même est possible en option. La galerie complète est livrée sous 7 jours.",
        },
        {
          question: "Vous déplacez-vous en dehors de Paris ?",
          reponse:
            "Oui. Paris est ma base, mais je me déplace régulièrement en France et à l'international. Les déplacements font l'objet d'une ligne séparée sur le devis.",
        },
        {
          question: "Combien d'images sont livrées ?",
          reponse: "Le nombre d'images dépend de la durée de couverture et du type d'événement. Il est précisé dans le devis.",
        },
        {
          question: "Comment se passe la facturation ?",
          reponse: "Une facture est émise pour chaque prestation. TVA non applicable, article 293 B du CGI.",
        },
      ],
      contactTitle: "Parlons de votre événement",
      contactText: "Date, lieu et format suffisent pour recevoir un devis. Réponse sous 24 à 48 h.",
      contactLabel: "Demander un devis",
    },
    en: {
      eyebrow: "Events",
      title: "Event Photographer in Paris: Parties, Launches & Galas",
      lead: "The energy of your events, delivered on time for your channels.",
      bridge: "The same standards as on Paris Fashion Week runways, for your brand launch or private party.",
      ctaLabel: "Request a quote",
      coveredTitle: "Events covered",
      covered: ["Private parties", "Product launches", "Galas", "Premieres", "Fashion Week"],
      offerTitle: "Packages",
      offers: [
        {
          titre: "Half-day",
          prix: "650 € excl. VAT",
          description: "For an evening event, product launch or premiere.",
        },
        {
          titre: "Full day",
          prix: "1,100 € excl. VAT",
          description: "For a gala, large-scale event or multiple highlights.",
          miseEnAvant: true,
        },
      ],
      optionPrefix: "Add-on:",
      options: [
        { titre: "same-night express selection", prix: "+ 200 € excl. VAT" },
        { titre: "second photographer", prix: "+ 450 € excl. VAT" },
      ],
      deliveryNote: "Same-night express selection available as an option. Full gallery delivered within 7 days.",
      faqTitle: "Frequently asked questions",
      faq: [
        {
          question: "What are the image usage rights?",
          reponse: "Usage rights are specified in writing in the contract for each assignment.",
        },
        {
          question: "What are the delivery timelines?",
          reponse: "A same-night express selection is available as an add-on. The full gallery is delivered within 7 days.",
        },
        {
          question: "Do you travel outside Paris?",
          reponse:
            "Yes. Paris is my base, and I regularly travel across France and internationally. Travel expenses are listed as a separate line on the quote.",
        },
        {
          question: "How many images are delivered?",
          reponse: "The number of images depends on coverage duration and event format. It is specified in your quote.",
        },
        {
          question: "How does invoicing work?",
          reponse: "An official invoice is issued for each assignment. VAT not applicable under Article 293 B of the French Tax Code.",
        },
      ],
      contactTitle: "Let's talk about your event",
      contactText: "Date, venue and format are enough to receive a quote. Reply within 24 to 48h.",
      contactLabel: "Request a quote",
    },
  },
  mariage: {
    fr: {
      eyebrow: "Mariage",
      title: "Photographe de mariage haut de gamme à Paris",
      lead: "Votre mariage, photographié comme un éditorial.",
      bridge: "Le regard de la Fashion Week, pour votre mariage : lumière éditoriale, direction de pose naturelle, aucune image figée.",
      ctaLabel: "Vérifier ma date",
      experienceTitle: "L'expérience, du premier rendez-vous à la livraison",
      experienceLead: "Vous êtes accompagnés du début à la fin, pour vous projeter sereinement.",
      steps: [
        {
          titre: "Rencontre",
          texte: "Rendez-vous en visio ou en présentiel pour faire connaissance et comprendre votre histoire.",
        },
        {
          titre: "Préparation",
          texte: "Questionnaire, moodboard de vos envies, planning photo construit ensemble.",
        },
        {
          titre: "Jour J",
          texte: "Présence discrète, direction de pose naturelle, aucune image figée.",
        },
        {
          titre: "Livraison",
          texte: "Galerie en ligne privée, images retouchées une à une.",
        },
      ],
      packagesTitle: "Trois formules",
      offers: [
        {
          titre: "Essentiel",
          prix: "1 500 €",
          inclus: [
            "Rendez-vous découverte en visio ou en présentiel",
            "Questionnaire de préparation",
            "6 h de couverture (cérémonie, cocktail, photos de groupe)",
            "Environ 300 images retouchées",
            "Galerie en ligne livrée sous 4 semaines",
          ],
        },
        {
          titre: "Signature",
          prix: "2 400 €",
          miseEnAvant: true,
          inclus: [
            "Tout l'Essentiel",
            "Rendez-vous de préparation",
            "Moodboard personnalisé",
            "Planning photo construit ensemble",
            "10 h de couverture (des préparatifs à l'ouverture de bal)",
            "Séance couple éditoriale le jour J",
            "Environ 500 images",
            "Galerie sous 3 semaines",
          ],
        },
        {
          titre: "Prestige",
          prix: "3 500 €",
          inclus: [
            "Tout le Signature",
            "Repérage du lieu",
            "Séance avant le mariage",
            "Second photographe",
            "Journée complète",
            "Environ 800 images",
            "Sélection express pour les réseaux le soir même",
            "Galerie sous 3 semaines",
          ],
        },
      ],
      faqTitle: "Questions fréquentes",
      faq: [
        {
          question: "Comment se passe le versement de l'acompte ?",
          reponse: "Un acompte de 30 % est demandé à la réservation pour bloquer votre date.",
        },
        {
          question: "Comment se déroulent les rendez-vous ?",
          reponse:
            "Nous nous rencontrons d'abord en visio ou en présentiel. Avec les formules Signature et Prestige, un rendez-vous de préparation permet de construire ensemble le moodboard et le planning photo.",
        },
        {
          question: "Vous déplacez-vous en dehors de Paris ?",
          reponse:
            "Oui. Paris est ma base, mais je me déplace régulièrement en France et à l'international. Les déplacements font l'objet d'une ligne séparée sur le devis.",
        },
        {
          question: "Un second photographe est-il possible ?",
          reponse: "Oui. Il est inclus dans la formule Prestige.",
        },
        {
          question: "Combien d'images recevrons-nous ?",
          reponse: "Environ 300 images avec l'Essentiel, 500 avec le Signature et 800 avec le Prestige.",
        },
        {
          question: "Quels sont les délais de livraison ?",
          reponse:
            "La galerie en ligne est livrée sous 4 semaines avec l'Essentiel et sous 3 semaines avec les formules Signature et Prestige. La formule Prestige inclut une sélection express le soir même.",
        },
      ],
      testimonialsTitle: "Ce que disent les mariés",
      contactTitle: "Votre date est-elle disponible ?",
      contactText: "Indiquez la date et le lieu de votre mariage. Réponse sous 24 à 48 h.",
      contactLabel: "Vérifier ma date",
    },
    en: {
      eyebrow: "Weddings",
      title: "Luxury & Editorial Wedding Photographer in Paris",
      lead: "Your wedding, photographed like an editorial.",
      bridge: "A Fashion Week eye for your wedding: editorial lighting, natural direction, never stiff or posed.",
      ctaLabel: "Check my date",
      experienceTitle: "The experience, from first meeting to final delivery",
      experienceLead: "You are guided from start to finish so you can enjoy every moment with peace of mind.",
      steps: [
        {
          titre: "First meeting",
          texte: "Video call or in-person meeting in Paris to get to know each other and understand your story.",
        },
        {
          titre: "Preparation",
          texte: "Questionnaire, bespoke moodboard and photo timeline built together.",
        },
        {
          titre: "Wedding day",
          texte: "Discreet presence, natural direction, no stiff poses.",
        },
        {
          titre: "Delivery",
          texte: "Private online gallery with individually retouched images.",
        },
      ],
      packagesTitle: "Three packages",
      offers: [
        {
          titre: "Essentiel",
          prix: "1,500 €",
          inclus: [
            "Discovery meeting via video call or in person",
            "Preparation questionnaire",
            "6 hours of coverage (ceremony, cocktail, group portraits)",
            "Around 300 retouched images",
            "Online gallery delivered within 4 weeks",
          ],
        },
        {
          titre: "Signature",
          prix: "2,400 €",
          miseEnAvant: true,
          inclus: [
            "Everything in Essentiel",
            "Dedicated preparation meeting",
            "Custom moodboard",
            "Photo timeline built together",
            "10 hours of coverage (from bridal prep to first dance)",
            "Editorial couple session on the wedding day",
            "Around 500 images",
            "Online gallery within 3 weeks",
          ],
        },
        {
          titre: "Prestige",
          prix: "3,500 €",
          inclus: [
            "Everything in Signature",
            "Venue scouting",
            "Pre-wedding couple session",
            "Second photographer",
            "Full-day coverage",
            "Around 800 images",
            "Same-night express selection for social media",
            "Online gallery within 3 weeks",
          ],
        },
      ],
      faqTitle: "Frequently asked questions",
      faq: [
        {
          question: "How does the booking deposit work?",
          reponse: "A 30% deposit is required upon booking to secure your date.",
        },
        {
          question: "How do the preparation meetings work?",
          reponse:
            "We first meet via video call or in person. With the Signature and Prestige packages, a dedicated preparation meeting lets us build your moodboard and photo timeline together.",
        },
        {
          question: "Do you travel outside Paris for destination weddings?",
          reponse:
            "Yes. Paris is my base, and I regularly travel across France and internationally. Travel expenses are listed as a separate line on the quote.",
        },
        {
          question: "Is a second photographer available?",
          reponse: "Yes. A second photographer is included in the Prestige package.",
        },
        {
          question: "How many images will we receive?",
          reponse: "Around 300 images with Essentiel, 500 with Signature and 800 with Prestige.",
        },
        {
          question: "What are the delivery timelines?",
          reponse:
            "The online gallery is delivered within 4 weeks with Essentiel and within 3 weeks with Signature and Prestige. The Prestige package also includes a same-night express selection.",
        },
      ],
      testimonialsTitle: "What couples say",
      contactTitle: "Is your date available?",
      contactText: "Share your wedding date and venue. Reply within 24 to 48h.",
      contactLabel: "Check my date",
    },
  },
  entreprises: {
    fr: {
      eyebrow: "Entreprises & lieux",
      title: "Photographe pour événements d'entreprise et lieux de réception à Paris",
      lead: "Un photographe fiable pour vos événements et vos clients.",
      ctaLabel: "Réserver un appel de 15 minutes",
      venuesTitle: "Pour les lieux et hôtels",
      venuesText:
        "Un photographe que vous recommandez à vos clients sans risque : il connaît votre établissement et respecte vos équipes.",
      agenciesTitle: "Pour les agences et entreprises",
      agenciesText: "Brief, couverture, livraison, droits d'usage écrits, facture HT.",
      processTitle: "Comment ça se passe",
      steps: [
        { titre: "Brief", texte: "Objectifs, public, déroulé et usages prévus des images." },
        { titre: "Couverture", texte: "Une présence discrète, au service de vos équipes et de vos invités." },
        { titre: "Livraison", texte: "Images retouchées, livrées dans les délais annoncés." },
        { titre: "Facture", texte: "Facture HT, droits d'usage écrits dans le contrat." },
      ],
      pricingTitle: "Tarifs",
      pricing: [
        { titre: "Demi-journée", prix: "650 € HT" },
        { titre: "Journée", prix: "1 100 € HT", miseEnAvant: true },
      ],
      partnerRate: "Tarif partenaire : −10 % dès 5 prestations par an.",
      guaranteesTitle: "Garanties",
      guarantees: [
        "Assurance responsabilité civile professionnelle",
        "Contrat pour chaque prestation",
        "Second photographe sur les grands formats",
      ],
      brandTitle: "Portrait et contenu de marque",
      brandTextPrefix: "Portrait à partir de 400 €. Contenu de marque à partir de 750 € HT.",
      brandLinkLabel: "Demander un devis shooting",
      b2bBadge: "Dossier B2B",
      b2bEyebrow: "Document à partager",
      b2bTitle: "Le dossier B2B de JerryPicsArt",
      b2bText:
        "Un document à transmettre à vos équipes, à votre direction ou à vos clients. Format PDF, lisible sur téléphone.",
      b2bButton: "Télécharger le PDF",
      contactTitle: "Parlons de vos événements",
      contactText: "Un appel de 15 minutes suffit pour cadrer votre besoin.",
      contactLabel: "Réserver un appel de 15 minutes",
    },
    en: {
      eyebrow: "Corporate & Venues",
      title: "Photographer for Corporate Events & Luxury Venues in Paris",
      lead: "A reliable photographer for your events and your clients.",
      ctaLabel: "Book a 15-minute call",
      venuesTitle: "For venues & luxury hotels",
      venuesText:
        "A photographer you can recommend to your clients with confidence: familiar with your property and respectful of your teams.",
      agenciesTitle: "For agencies & companies",
      agenciesText: "Brief, coverage, delivery, written usage rights, invoice excl. VAT.",
      processTitle: "How it works",
      steps: [
        { titre: "Brief", texte: "Objectives, audience, schedule and planned image usage." },
        { titre: "Coverage", texte: "A discreet presence supporting your teams and guests." },
        { titre: "Delivery", texte: "Retouched images delivered within the agreed timeframe." },
        { titre: "Invoicing", texte: "Invoice excl. VAT, written usage rights in the contract." },
      ],
      pricingTitle: "Rates",
      pricing: [
        { titre: "Half-day", prix: "650 € excl. VAT" },
        { titre: "Full day", prix: "1,100 € excl. VAT", miseEnAvant: true },
      ],
      partnerRate: "Partner rate: −10% from 5 assignments per year.",
      guaranteesTitle: "Guarantees",
      guarantees: [
        "Professional liability insurance",
        "Written contract for every assignment",
        "Second photographer for large-scale events",
      ],
      brandTitle: "Portraits & brand content",
      brandTextPrefix: "Portraits from 400 €. Brand content from 750 € excl. VAT.",
      brandLinkLabel: "Request a shoot quote",
      b2bBadge: "B2B Deck",
      b2bEyebrow: "Shareable document",
      b2bTitle: "The JerryPicsArt B2B Deck",
      b2bText:
        "A concise PDF overview to share with your teams, management or clients. Mobile-friendly format.",
      b2bButton: "Download PDF",
      contactTitle: "Let's talk about your events",
      contactText: "A 15-minute call is enough to scope your needs.",
      contactLabel: "Book a 15-minute call",
    },
  },
  about: {
    fr: {
      eyebrowPrefix: "Derrière l'objectif,",
      ctaPrimary: "Parler d'un projet",
      ctaSecondary: "Voir les séries Fashion Week",
      storyEyebrow: "Parcours",
      fwEyebrow: "De la Fashion Week à votre événement",
      fwTitle:
        "La Fashion Week impose trois réflexes : travailler vite, composer avec une lumière difficile, rester discret au milieu des personnalités.",
      fwText:
        "Ces réflexes servent chaque mariage et chaque événement d'entreprise : une image juste dès le premier déclenchement, sans jamais gêner vos invités.",
      manifestoEyebrow: "Manifeste",
      manifestoSecondary: "Voir les séries",
    },
    en: {
      eyebrowPrefix: "Behind the lens,",
      ctaPrimary: "Discuss a project",
      ctaSecondary: "View Fashion Week series",
      storyEyebrow: "Background",
      fwEyebrow: "From Fashion Week to your event",
      fwTitle:
        "Fashion Week demands three reflexes: working fast, mastering challenging light, and staying discreet around public figures.",
      fwText:
        "Those reflexes serve every wedding and corporate event: capturing the right frame on the first shutter click, without ever intruding on your guests.",
      manifestoEyebrow: "Manifesto",
      manifestoSecondary: "View series",
      defaultAboutCopy: {
        headline: "I photograph the people and moments that matter.",
        subheadline:
          "An unexpected path and a distinct eye. JerryPicsArt builds photography at the crossroads of fashion, high-end weddings, events and public figures. Composed, precise imagery that never feels cold.",
        storyTitle: "Before the image, there was already attention to people.",
        storyParagraphs: [
          "Nothing predestined me for this. I worked in marketing and growth hacking. I learned to understand people, to read what moves them and what makes them choose. Without knowing it, I was already preparing.",
          "And then came that fire. Not a sudden revelation, but something that grew from within, like an obvious truth I had long ignored. Photography was not a backup plan. It was what I kept coming back to.",
          "Like on a basketball court, I gave it everything. I trained with discipline, sharpened my eye, and built a world at the border of fashion and luxury weddings, where aesthetics never sacrifice emotion.",
          "Today, my lens focuses on couples, public figures, intimate moments and larger stages. Behind every session, my conviction remains the same: everyone deserves to be seen with the same care, precision and humanity.",
        ],
        values: [
          {
            label: "Presence",
            text: "Seeing the person before the status, the attitude before the pose, the presence before the setting.",
          },
          {
            label: "Composure",
            text: "Crafting clean, controlled, editorial images without taking the life out of the moment.",
          },
          {
            label: "Emotion",
            text: "Preserving an honest trace, even when the frame takes on an editorial dimension.",
          },
        ],
        manifestoTitle: "Every person deserves to be seen with care.",
        manifestoText:
          "Couples, public figures, entrepreneurs, families or guests at an event: the setting changes, but the intention stays the same. Making an image that respects the person and elevates the moment.",
        convictionTitle: "Conviction",
        convictionText: "Status changes. Attention never does.",
      },
    },
  },
  contact: {
    fr: {
      eyebrow: "Contact",
      headline: "Parlons de votre projet.",
      lead: "Quelques lignes claires suffisent pour poser la bonne direction. Le formulaire ci-dessous reste la façon la plus simple d'ouvrir la conversation.",
      jumpToForm: "Aller au formulaire",
      requestEyebrow: "Demande",
      requestLead: "Plus le brief est précis, plus le retour peut être utile dès le premier message.",
      pricingPrefix:
        "Nos prestations démarrent à partir de 650 € pour les événements et de 1 500 € pour les mariages. Vous préférez écrire directement ?",
      faqEyebrow: "Questions fréquentes",
      faq: [
        {
          q: "Quels sont vos délais de livraison ?",
          a: "Pour un mariage, la galerie est livrée sous 3 à 4 semaines selon la formule. Pour un événement, une sélection express le soir même est possible en option, et la galerie complète est livrée sous 7 jours.",
        },
        {
          q: "Shootez-vous à l'étranger ?",
          a: "Oui. Paris est ma base, mais je me déplace régulièrement en France et à l'international. Les déplacements font l'objet d'une ligne séparée sur le devis.",
        },
        {
          q: "Comment est gérée la retouche ?",
          a: "Ma retouche se concentre sur la lumière, la colorimétrie et la force de l'image. Je ne dénature jamais les personnes.",
        },
      ],
      socialEyebrow: "Besoin d'une autre voie ?",
      socialTitle: "Suivre le travail au quotidien.",
    },
    en: {
      eyebrow: "Contact",
      headline: "Let's talk about your project.",
      lead: "A few clear lines are enough to set the right direction. The form below is the simplest way to start the conversation.",
      jumpToForm: "Go to form",
      requestEyebrow: "Inquiry",
      requestLead: "The more specific your brief, the more tailored my first reply will be.",
      pricingPrefix:
        "Our packages start from 650 € for events and 1,500 € for weddings. Prefer to write directly?",
      faqEyebrow: "Frequently asked questions",
      faq: [
        {
          q: "What are your delivery timelines?",
          a: "For a wedding, the gallery is delivered within 3 to 4 weeks depending on the package. For an event, a same-night express selection is available as an add-on, and the full gallery is delivered within 7 days.",
        },
        {
          q: "Do you shoot abroad?",
          a: "Yes. Paris is my base, and I regularly travel across France and internationally. Travel expenses are listed as a separate line on the quote.",
        },
        {
          q: "How do you approach retouching?",
          a: "My retouching focuses on light, color grading and visual impact. I never over-process or alter how people naturally look.",
        },
      ],
      socialEyebrow: "Another way to connect?",
      socialTitle: "Follow the daily work.",
    },
  },
  legal: {
    fr: {
      title: "Mentions légales",
      sections: (siteConfig) => [
        {
          titre: "Éditeur du site",
          paragraphes: [
            `${siteConfig.legalName} (nom commercial : ${siteConfig.name}).`,
            "Statut : entrepreneur individuel (micro-entreprise).",
            "SIRET : 978 685 006 00014.",
            "TVA non applicable, article 293 B du CGI.",
            "Adresse : 3 allée de Dordogne, 91300 Massy.",
            `E-mail : ${siteConfig.email}.`,
          ],
        },
        {
          titre: "Hébergeur",
          paragraphes: [
            "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (https://vercel.com).",
          ],
        },
        {
          titre: "Propriété intellectuelle",
          paragraphes: [
            "Toutes les photographies présentes sur ce site sont protégées par le droit d'auteur.",
            "Toute reproduction, représentation ou diffusion, même partielle, est interdite sans autorisation écrite préalable.",
          ],
        },
      ],
    },
    en: {
      title: "Legal Notice",
      sections: (siteConfig) => [
        {
          titre: "Site Publisher",
          paragraphes: [
            `${siteConfig.legalName} (trade name: ${siteConfig.name}).`,
            "Legal status: Sole proprietorship (French micro-entreprise).",
            "SIRET: 978 685 006 00014.",
            "VAT not applicable, Article 293 B of the French General Tax Code (CGI).",
            "Address: 3 allée de Dordogne, 91300 Massy, France.",
            `Email: ${siteConfig.email}.`,
          ],
        },
        {
          titre: "Hosting Provider",
          paragraphes: [
            "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (https://vercel.com).",
          ],
        },
        {
          titre: "Intellectual Property",
          paragraphes: [
            "All photographs displayed on this website are protected by copyright law.",
            "Any reproduction, representation or distribution, in whole or in part, is prohibited without prior written permission.",
          ],
        },
      ],
    },
  },
  privacy: {
    fr: {
      title: "Politique de confidentialité",
      intro:
        "Cette page explique quelles données sont recueillies par le formulaire de contact, pourquoi, et comment exercer vos droits.",
      sections: (siteConfig) => [
        {
          titre: "Données collectées",
          paragraphes: [
            "Le formulaire de contact recueille : votre profil (particulier, lieu, agence, entreprise ou marque), votre nom et prénom, votre adresse e-mail, votre téléphone si vous le renseignez, le type de prestation, la date, le lieu, le nombre d'invités, votre budget indicatif, la manière dont vous m'avez connu et votre message.",
          ],
        },
        {
          titre: "Finalité",
          paragraphes: [
            "Ces données servent uniquement à répondre à votre demande et à vous adresser un devis. Elles ne sont jamais revendues.",
          ],
        },
        {
          titre: "Durée de conservation",
          paragraphes: [
            "Vos données sont conservées le temps nécessaire au traitement de votre demande, et au maximum 3 ans à compter de notre dernier échange.",
          ],
        },
        {
          titre: "Vos droits",
          paragraphes: [
            "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
            `Pour l'exercer, écrivez à ${siteConfig.email}.`,
          ],
        },
        {
          titre: "Mesure d'audience",
          paragraphes: [
            "Ce site utilise Vercel Analytics pour mesurer la fréquentation et certains clics (formulaire, dossier B2B). Cet outil ne dépose pas de cookie et ne permet pas de vous identifier.",
          ],
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      intro:
        "This page explains what personal data is collected through the contact form, why it is collected, and how to exercise your rights.",
      sections: (siteConfig) => [
        {
          titre: "Data Collected",
          paragraphes: [
            "The contact form collects: your profile (individual, venue, agency, company or brand), your full name, your email address, your phone number (if provided), the type of assignment, the date, the location, the number of guests, your indicative budget, how you heard about me, and your message.",
          ],
        },
        {
          titre: "Purpose",
          paragraphes: [
            "This data is used solely to reply to your inquiry and prepare a quote. It is never sold or shared with third parties.",
          ],
        },
        {
          titre: "Retention Period",
          paragraphes: [
            "Your data is kept for the time necessary to process your inquiry, and for a maximum of 3 years from our last exchange.",
          ],
        },
        {
          titre: "Your Rights",
          paragraphes: [
            "Under GDPR, you have the right to access, rectify and delete your personal data.",
            `To exercise these rights, write to ${siteConfig.email}.`,
          ],
        },
        {
          titre: "Analytics",
          paragraphes: [
            "This website uses Vercel Analytics to measure traffic and key interactions (quote form, B2B PDF). This tool does not set tracking cookies and does not identify individual visitors.",
          ],
        },
      ],
    },
  },
};

export const CONTACT_FORM_COPY = {
  fr: {
    placeholder: "Choisir…",
    successBadge: "Demande envoyée",
    sendAnother: "Envoyer une autre demande",
    viewFashionWeek: "Voir les séries Fashion Week",
    projectQuestion: "Quel est votre projet ?",
    quoteTypeAria: "Type de devis",
    choosePrompt: "Choisissez votre projet pour afficher le formulaire adapté.",
    quoteRequestPrefix: "Demande de devis :",
    tellMeMore: "Parlez-moi de votre projet.",
    youAre: "Vous êtes",
    fullName: "Nom et prénom",
    email: "E-mail",
    phone: "Téléphone",
    optional: "Facultatif",
    locationPlaceholder: "Ville, salle, lieu…",
    budgetLabel: "Budget indicatif",
    sourceLabel: "Comment m'avez-vous connu ?",
    messageLabel: "Message",
    messagePlaceholder: "Ambiance recherchée, contraintes utiles, références…",
    consentPrefix: "J'accepte que mes données soient utilisées pour répondre à ma demande.",
    privacyLink: "Politique de confidentialité",
    submitIdle: "Envoyer la demande",
    submitPending: "Envoi…",
    replyTime: "Réponse sous 24 à 48 h.",
    typeLabels: {
      mariage: {
        label: "Mariage",
        description: "Votre mariage, du premier rendez-vous à la galerie finale.",
        dateLabel: "Date du mariage",
        locationLabel: "Lieu de la réception",
      },
      evenement: {
        label: "Événement",
        description: "Soirée, lancement, gala ou avant-première.",
        dateLabel: "Date de l'événement",
        locationLabel: "Lieu",
      },
      entreprise: {
        label: "Événement d'entreprise",
        description: "Hôtels, lieux de réception, agences et entreprises.",
        dateLabel: "Date de l'événement",
        locationLabel: "Lieu",
      },
      contenu: {
        label: "Contenu de marque / shooting",
        description: "Portrait, shooting mode, contenu pour votre marque.",
        dateLabel: "Date souhaitée",
        locationLabel: "",
      },
    },
    fieldLabels: {
      guests: "Nombre d'invités",
      formule: "Formule qui vous intéresse",
      secondPhotographer: "Second photographe",
      eventKind: "Type d'événement",
      duration: "Durée de couverture",
      express: "Sélection express le soir même",
      company: "Société",
      role: "Fonction",
      usage: "Usage des images",
      brand: "Marque ou projet",
      contentKind: "Type de prestation",
      volume: "Nombre de photos souhaité",
      place: "Lieu du shooting",
    },
    fieldPlaceholders: {
      company: "Nom de la société",
      role: "Facultatif",
      brand: "Nom de la marque ou du projet",
    },
    optionTranslations: {},
  },
  en: {
    placeholder: "Select…",
    successBadge: "Inquiry sent",
    sendAnother: "Send another inquiry",
    viewFashionWeek: "View Fashion Week series",
    projectQuestion: "What is your project?",
    quoteTypeAria: "Quote type",
    choosePrompt: "Select your project type above to display the tailored form.",
    quoteRequestPrefix: "Quote request:",
    tellMeMore: "Tell me about your project.",
    youAre: "You are",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    optional: "Optional",
    locationPlaceholder: "City, hotel, venue…",
    budgetLabel: "Indicative budget",
    sourceLabel: "How did you hear about me?",
    messageLabel: "Message",
    messagePlaceholder: "Desired mood, schedule details, visual references…",
    consentPrefix: "I agree that my data will be used to reply to my inquiry.",
    privacyLink: "Privacy policy",
    submitIdle: "Send inquiry",
    submitPending: "Sending…",
    replyTime: "Reply within 24 to 48h.",
    typeLabels: {
      mariage: {
        label: "Wedding",
        description: "Your wedding, from our first meeting to the final gallery.",
        dateLabel: "Wedding date",
        locationLabel: "Reception venue",
      },
      evenement: {
        label: "Event",
        description: "Private party, brand launch, gala or premiere.",
        dateLabel: "Event date",
        locationLabel: "Venue / Location",
      },
      entreprise: {
        label: "Corporate Event",
        description: "Luxury hotels, reception venues, agencies and companies.",
        dateLabel: "Event date",
        locationLabel: "Venue / Location",
      },
      contenu: {
        label: "Brand Content / Shoot",
        description: "Editorial portrait, fashion shoot, content for your brand.",
        dateLabel: "Preferred date",
        locationLabel: "",
      },
    },
    fieldLabels: {
      guests: "Number of guests",
      formule: "Package of interest",
      secondPhotographer: "Second photographer",
      eventKind: "Event type",
      duration: "Coverage duration",
      express: "Same-night express selection",
      company: "Company",
      role: "Role / Title",
      usage: "Image usage",
      brand: "Brand or project",
      contentKind: "Type of shoot",
      volume: "Desired number of photos",
      place: "Shoot location",
    },
    fieldPlaceholders: {
      company: "Company name",
      role: "Optional",
      brand: "Brand or project name",
    },
    optionTranslations: {
      // Audiences
      "Particulier (mariage)": "Private client (wedding)",
      "Particulier (autre)": "Private client (other)",
      "Lieu ou hôtel": "Venue or hotel",
      "Agence événementielle": "Event agency",
      Entreprise: "Company",
      Marque: "Brand / Fashion house",
      // Guests
      "Moins de 50": "Under 50",
      "50 à 150": "50 to 150",
      "150 à 300": "150 to 300",
      "Plus de 300": "Over 300",
      // Formule
      Essentiel: "Essentiel",
      Signature: "Signature",
      Prestige: "Prestige",
      "Je ne sais pas encore": "Not sure yet",
      // Yes/No
      Oui: "Yes",
      Non: "No",
      "À discuter": "To be discussed",
      // Event kind
      "Soirée privée": "Private party",
      "Lancement de produit": "Product launch",
      Gala: "Gala",
      "Avant-première": "Premiere",
      "Fashion Week": "Fashion Week",
      Autre: "Other",
      // Duration
      "Demi-journée": "Half-day",
      Journée: "Full day",
      // Usage
      "Réseaux sociaux": "Social media",
      "Site internet": "Website",
      Presse: "Press / PR",
      Publicité: "Advertising",
      "Plusieurs usages": "Multiple usages",
      // Content kind
      Portrait: "Portrait",
      "Contenu de marque": "Brand content",
      "Shooting mode": "Fashion shoot",
      // Volume
      "Moins de 10": "Under 10",
      "10 à 30": "10 to 30",
      "Plus de 30": "Over 30",
      // Place
      Studio: "Studio",
      Extérieur: "Outdoor / On location",
      "Chez le client": "At client's premises",
      // Budget
      "Moins de 650 €": "Under 650 €",
      "650 à 1 500 €": "650 to 1,500 €",
      "1 500 à 2 500 €": "1,500 to 2,500 €",
      "2 500 à 3 500 €": "2,500 to 3,500 €",
      "Plus de 3 500 €": "Over 3,500 €",
      // Source
      Instagram: "Instagram",
      LinkedIn: "LinkedIn",
      Google: "Google",
      "Recommandation d'un lieu": "Venue recommendation",
      "Recommandation d'une agence": "Agency recommendation",
      "Bouche-à-oreille": "Word of mouth",
    },
  },
};
