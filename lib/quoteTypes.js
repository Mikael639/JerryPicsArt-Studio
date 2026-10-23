// Les quatre types de devis. Cette configuration est partagée par le formulaire (affichage)
// et par la validation côté serveur : un seul endroit à modifier pour ajuster les champs.
//
// Champ : { name, label, kind: "select" | "text", options?, required?, placeholder? }

export const guestOptions = ["Moins de 50", "50 à 150", "150 à 300", "Plus de 300"];

export const budgetOptions = [
  "Moins de 650 €",
  "650 à 1 500 €",
  "1 500 à 2 500 €",
  "2 500 à 3 500 €",
  "Plus de 3 500 €",
  "Je ne sais pas encore",
];

export const sourceOptions = [
  "Instagram",
  "LinkedIn",
  "Google",
  "Recommandation d'un lieu",
  "Recommandation d'une agence",
  "Bouche-à-oreille",
  "Autre",
];

const guestsField = { name: "guests", label: "Nombre d'invités", kind: "select", options: guestOptions, required: true };

const usageOptions = ["Réseaux sociaux", "Site internet", "Presse", "Publicité", "Plusieurs usages"];

export const quoteTypes = {
  mariage: {
    id: "mariage",
    label: "Mariage",
    description: "Votre mariage, du premier rendez-vous à la galerie finale.",
    serviceType: "Mariage",
    audiences: ["Particulier (mariage)"],
    dateLabel: "Date du mariage",
    dateRequired: true,
    locationLabel: "Lieu de la réception",
    locationRequired: true,
    fields: [
      guestsField,
      {
        name: "formule",
        label: "Formule qui vous intéresse",
        kind: "select",
        options: ["Essentiel", "Signature", "Prestige", "Je ne sais pas encore"],
        required: true,
      },
      {
        name: "secondPhotographer",
        label: "Second photographe",
        kind: "select",
        options: ["Oui", "Non", "À discuter"],
      },
    ],
  },
  evenement: {
    id: "evenement",
    label: "Événement",
    description: "Soirée, lancement, gala ou avant-première.",
    serviceType: "Événement",
    audiences: ["Particulier (autre)", "Lieu ou hôtel", "Agence événementielle", "Marque"],
    dateLabel: "Date de l'événement",
    dateRequired: true,
    locationLabel: "Lieu",
    locationRequired: true,
    fields: [
      {
        name: "eventKind",
        label: "Type d'événement",
        kind: "select",
        options: ["Soirée privée", "Lancement de produit", "Gala", "Avant-première", "Fashion Week", "Autre"],
        required: true,
      },
      guestsField,
      {
        name: "duration",
        label: "Durée de couverture",
        kind: "select",
        options: ["Demi-journée", "Journée", "Je ne sais pas encore"],
        required: true,
      },
      {
        name: "express",
        label: "Sélection express le soir même",
        kind: "select",
        options: ["Oui", "Non", "À discuter"],
      },
    ],
  },
  entreprise: {
    id: "entreprise",
    label: "Événement d'entreprise",
    description: "Hôtels, lieux de réception, agences et entreprises.",
    serviceType: "Événement d'entreprise",
    audiences: ["Entreprise", "Lieu ou hôtel", "Agence événementielle"],
    dateLabel: "Date de l'événement",
    dateRequired: true,
    locationLabel: "Lieu",
    locationRequired: true,
    fields: [
      { name: "company", label: "Société", kind: "text", required: true, placeholder: "Nom de la société" },
      { name: "role", label: "Fonction", kind: "text", placeholder: "Facultatif" },
      guestsField,
      { name: "usage", label: "Usage des images", kind: "select", options: usageOptions, required: true },
    ],
  },
  contenu: {
    id: "contenu",
    label: "Contenu de marque / shooting",
    description: "Portrait, shooting mode, contenu pour votre marque.",
    // serviceType dépend du champ « contentKind » (voir resolveServiceType).
    serviceType: "Contenu de marque",
    audiences: ["Marque", "Entreprise", "Particulier (autre)"],
    dateLabel: "Date souhaitée",
    dateRequired: false,
    locationLabel: "",
    locationRequired: false,
    fields: [
      { name: "brand", label: "Marque ou projet", kind: "text", required: true, placeholder: "Nom de la marque ou du projet" },
      {
        name: "contentKind",
        label: "Type de prestation",
        kind: "select",
        options: ["Portrait", "Contenu de marque", "Shooting mode"],
        required: true,
      },
      {
        name: "volume",
        label: "Nombre de photos souhaité",
        kind: "select",
        options: ["Moins de 10", "10 à 30", "Plus de 30"],
        required: true,
      },
      {
        name: "place",
        label: "Lieu du shooting",
        kind: "select",
        options: ["Studio", "Extérieur", "Chez le client", "Je ne sais pas encore"],
        required: true,
      },
      { name: "usage", label: "Usage des images", kind: "select", options: usageOptions, required: true },
    ],
  },
};

export const quoteTypeList = Object.values(quoteTypes);

export function getQuoteType(id) {
  return quoteTypes[id] || null;
}

// Type de prestation enregistré (liste historique du site) selon le type de devis.
export function resolveServiceType(type, extra = {}) {
  if (type.id === "contenu") {
    return extra.contentKind === "Portrait" ? "Portrait" : "Contenu de marque";
  }
  return type.serviceType;
}
