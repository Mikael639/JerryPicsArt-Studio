import { budgetOptions, getQuoteType, resolveServiceType, sourceOptions } from "./quoteTypes";

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

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactInput(input) {
  const type = getQuoteType(text(input?.type));
  const errors = {};

  if (!type) {
    return { isValid: false, errors: { type: "Veuillez choisir votre type de projet." }, sanitized: null };
  }

  const audience = text(input?.audience);
  const name = text(input?.name);
  const email = text(input?.email);
  const phone = text(input?.phone);
  const eventDate = text(input?.eventDate);
  const budget = text(input?.budget);
  const source = text(input?.source);
  const project = text(input?.project);
  const consent = input?.consent === "on" || input?.consent === "true" || input?.consent === true;

  // Réponses propres au type de devis : seuls les champs de la configuration sont retenus.
  const extra = {};
  const details = [];
  for (const field of type.fields) {
    const value = text(input?.extra?.[field.name]);
    extra[field.name] = value;

    if (!value) {
      if (field.required) errors[field.name] = "Ce champ est obligatoire.";
      continue;
    }
    if (field.kind === "select" && !field.options.includes(value)) {
      errors[field.name] = "Valeur invalide.";
      continue;
    }
    if (field.kind === "text" && value.length > 120) {
      errors[field.name] = "120 caractères maximum.";
      continue;
    }
    details.push([field.label, value]);
  }

  // Pour le contenu de marque, le lieu est choisi dans la liste « Lieu du shooting ».
  const location = type.id === "contenu" ? extra.place || "" : text(input?.location);

  if (!type.audiences.includes(audience)) errors.audience = "Veuillez indiquer qui vous êtes.";
  if (name.length < 2 || name.length > 80) errors.name = "Le nom doit contenir entre 2 et 80 caractères.";
  if (!isEmailValid(email)) errors.email = "Adresse e-mail invalide.";
  if (phone.length > 40) errors.phone = "Le téléphone doit contenir au maximum 40 caractères.";

  if (eventDate ? !isDateValid(eventDate) : type.dateRequired) {
    errors.eventDate = "Veuillez indiquer une date valide.";
  }
  if (type.locationRequired && (location.length < 2 || location.length > 120)) {
    errors.location = "Veuillez indiquer le lieu (120 caractères maximum).";
  }
  if (!budgetOptions.includes(budget)) errors.budget = "Veuillez indiquer un budget indicatif.";
  if (!sourceOptions.includes(source)) errors.source = "Veuillez indiquer comment vous m'avez connu.";
  if (project.length < 10 || project.length > 2000) errors.project = "Le message doit contenir entre 10 et 2 000 caractères.";
  if (!consent) errors.consent = "Votre consentement est nécessaire pour traiter votre demande.";

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitized: {
      type: type.id,
      typeLabel: type.label,
      serviceType: resolveServiceType(type, extra),
      audience,
      name,
      email,
      phone,
      eventDate,
      location,
      budget,
      source,
      project,
      extra,
      details,
    },
  };
}
