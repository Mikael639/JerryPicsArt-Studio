export const audienceOptions = [
  "Particulier (mariage)",
  "Particulier (autre)",
  "Lieu ou hôtel",
  "Agence événementielle",
  "Entreprise",
  "Marque",
];

export const serviceOptions = ["Mariage", "Événement", "Événement d'entreprise", "Portrait", "Contenu de marque", "Autre"];

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

// Plafond de chaque tranche de budget (null = inconnu, Infinity = sans limite).
const BUDGET_CEILING = {
  "Moins de 650 €": 649,
  "650 à 1 500 €": 1500,
  "1 500 à 2 500 €": 2500,
  "2 500 à 3 500 €": 3500,
  "Plus de 3 500 €": Infinity,
  "Je ne sais pas encore": null,
};

// Prix d'entrée de chaque prestation, en euros.
const ENTRY_PRICE = {
  Mariage: 1500,
  Portrait: 400,
  "Contenu de marque": 750,
};
const DEFAULT_ENTRY_PRICE = 650;

export const QUALIFICATION = {
  priority: "PRIORITAIRE",
  toQualify: "À QUALIFIER",
  outOfBudget: "HORS BUDGET",
};

// Statut de la demande : [PRIORITAIRE], [À QUALIFIER] ou [HORS BUDGET].
export function qualifyRequest({ serviceType, budget, eventDate }) {
  const ceiling = BUDGET_CEILING[budget];
  if (ceiling === null || ceiling === undefined) return QUALIFICATION.toQualify;

  const entryPrice = ENTRY_PRICE[serviceType] ?? DEFAULT_ENTRY_PRICE;
  if (ceiling < entryPrice) return QUALIFICATION.outOfBudget;

  return eventDate ? QUALIFICATION.priority : QUALIFICATION.toQualify;
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isDateValid(dateString) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

function text(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export function validateContactInput(input) {
  const audience = text(input?.audience);
  const name = text(input?.name);
  const email = text(input?.email);
  const phone = text(input?.phone);
  const serviceType = text(input?.serviceType);
  const eventDate = text(input?.eventDate);
  const location = text(input?.location);
  const guests = text(input?.guests);
  const budget = text(input?.budget);
  const source = text(input?.source);
  const project = text(input?.project);
  const consent = input?.consent === "on" || input?.consent === "true" || input?.consent === true;

  const errors = {};

  if (!audienceOptions.includes(audience)) errors.audience = "Veuillez indiquer qui vous êtes.";
  if (name.length < 2 || name.length > 80) errors.name = "Le nom doit contenir entre 2 et 80 caractères.";
  if (!isEmailValid(email)) errors.email = "Adresse e-mail invalide.";
  if (phone.length > 40) errors.phone = "Le téléphone doit contenir au maximum 40 caractères.";
  if (!serviceOptions.includes(serviceType)) errors.serviceType = "Veuillez choisir un type de prestation.";
  if (!isDateValid(eventDate)) errors.eventDate = "Veuillez indiquer la date de l'événement.";
  if (location.length < 2 || location.length > 120) errors.location = "Veuillez indiquer le lieu (120 caractères maximum).";
  if (!guestOptions.includes(guests)) errors.guests = "Veuillez indiquer le nombre d'invités.";
  if (!budgetOptions.includes(budget)) errors.budget = "Veuillez indiquer un budget indicatif.";
  if (!sourceOptions.includes(source)) errors.source = "Veuillez indiquer comment vous m'avez connu.";
  if (project.length < 10 || project.length > 2000) errors.project = "Le message doit contenir entre 10 et 2 000 caractères.";
  if (!consent) errors.consent = "Votre consentement est nécessaire pour traiter votre demande.";

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitized: {
      audience,
      name,
      email,
      phone,
      serviceType,
      eventDate,
      location,
      guests,
      budget,
      source,
      project,
    },
  };
}
