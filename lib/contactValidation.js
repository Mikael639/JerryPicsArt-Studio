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

const VALIDATION_MESSAGES = {
  fr: {
    type: "Veuillez choisir votre type de projet.",
    required: "Ce champ est obligatoire.",
    invalidValue: "Valeur invalide.",
    max120: "120 caractères maximum.",
    audience: "Veuillez indiquer qui vous êtes.",
    name: "Le nom doit contenir entre 2 et 80 caractères.",
    email: "Adresse e-mail invalide.",
    phone: "Le téléphone doit contenir au maximum 40 caractères.",
    eventDate: "Veuillez indiquer une date valide.",
    location: "Veuillez indiquer le lieu (120 caractères maximum).",
    budget: "Veuillez indiquer un budget indicatif.",
    source: "Veuillez indiquer comment vous m'avez connu.",
    project: "Le message doit contenir entre 10 et 2 000 caractères.",
    consent: "Votre consentement est nécessaire pour traiter votre demande.",
  },
  en: {
    type: "Please select your project type.",
    required: "This field is required.",
    invalidValue: "Invalid selection.",
    max120: "120 characters maximum.",
    audience: "Please indicate who you are.",
    name: "Name must be between 2 and 80 characters.",
    email: "Please enter a valid email address.",
    phone: "Phone number must be 40 characters or fewer.",
    eventDate: "Please enter a valid date.",
    location: "Please enter the venue or location (120 characters maximum).",
    budget: "Please select an indicative budget.",
    source: "Please indicate how you heard about me.",
    project: "Your message must be between 10 and 2,000 characters.",
    consent: "Your consent is required to process your inquiry.",
  },
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
  const lang = input?.lang === "en" ? "en" : "fr";
  const msg = VALIDATION_MESSAGES[lang];
  const type = getQuoteType(text(input?.type));
  const errors = {};

  if (!type) {
    return { isValid: false, errors: { type: msg.type }, sanitized: null };
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
      if (field.required) errors[field.name] = msg.required;
      continue;
    }
    if (field.kind === "select" && !field.options.includes(value)) {
      errors[field.name] = msg.invalidValue;
      continue;
    }
    if (field.kind === "text" && value.length > 120) {
      errors[field.name] = msg.max120;
      continue;
    }
    details.push([field.label, value]);
  }

  // Pour le contenu de marque, le lieu est choisi dans la liste « Lieu du shooting ».
  const location = type.id === "contenu" ? extra.place || "" : text(input?.location);

  if (!type.audiences.includes(audience)) errors.audience = msg.audience;
  if (name.length < 2 || name.length > 80) errors.name = msg.name;
  if (!isEmailValid(email)) errors.email = msg.email;
  if (phone.length > 40) errors.phone = msg.phone;

  if (eventDate ? !isDateValid(eventDate) : type.dateRequired) {
    errors.eventDate = msg.eventDate;
  }
  if (type.locationRequired && (location.length < 2 || location.length > 120)) {
    errors.location = msg.location;
  }
  if (!budgetOptions.includes(budget)) errors.budget = msg.budget;
  if (!sourceOptions.includes(source)) errors.source = msg.source;
  if (project.length < 10 || project.length > 2000) errors.project = msg.project;
  if (!consent) errors.consent = msg.consent;

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
