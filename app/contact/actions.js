"use server";

import { headers } from "next/headers";
import { createContactMessage } from "../../lib/contactStore";
import { sendContactEmails } from "../../lib/contactEmail";
import { QUALIFICATION, validateContactInput } from "../../lib/contactValidation";
import { prepareContactSubmission } from "../../lib/contactSubmission";
import { getQuoteType } from "../../lib/quoteTypes";
import { consumeRateLimit } from "../../lib/rateLimit";

const MESSAGES = {
  fr: {
    rateLimit: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
    invalidFields: "Veuillez corriger les champs signalés.",
    sendError:
      "Votre message est enregistré, mais l'envoi de l'e-mail est temporairement indisponible. Je traite votre demande rapidement.",
    outOfBudget:
      "Merci pour votre demande. Nos prestations démarrent à partir de 650 € (événements) et 1 500 € (mariages). Si votre budget évolue, je serai ravi d'en parler.",
    success: "Merci, votre demande est bien reçue. Réponse sous 24 à 48 h.",
  },
  en: {
    rateLimit: "Too many attempts. Please try again in a few minutes.",
    invalidFields: "Please check the highlighted fields.",
    sendError:
      "Your inquiry has been saved, though email notification is temporarily unavailable. I will review your request shortly.",
    outOfBudget:
      "Thank you for your inquiry. Our packages start from 650 € (events) and 1,500 € (weddings). If your budget evolves, I would be glad to discuss your project.",
    success: "Thank you, your inquiry has been received. Reply within 24 to 48h.",
  },
};

function getHeaderValue(headersList, key) {
  const value = headersList.get(key);
  return typeof value === "string" ? value : "";
}

async function getClientIp() {
  const requestHeaders = await headers();
  const forwarded = getHeaderValue(requestHeaders, "x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = getHeaderValue(requestHeaders, "x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

function getStringValue(formData, key, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" ? value : fallback;
}

export async function submitContactForm(_previousState, formData) {
  const lang = getStringValue(formData, "lang") === "en" ? "en" : "fr";
  const msg = MESSAGES[lang];

  const ip = await getClientIp();
  const limiter = consumeRateLimit(ip, { limit: 5, windowMs: 10 * 60 * 1000 });

  if (!limiter.allowed) {
    return {
      status: "error",
      message: msg.rateLimit,
      errors: {},
    };
  }

  const quoteType = getQuoteType(getStringValue(formData, "type"));
  const extra = {};
  for (const field of quoteType?.fields || []) {
    extra[field.name] = getStringValue(formData, `extra_${field.name}`);
  }

  const validation = validateContactInput({
    lang,
    type: getStringValue(formData, "type"),
    extra,
    audience: getStringValue(formData, "audience"),
    name: getStringValue(formData, "name"),
    email: getStringValue(formData, "email"),
    phone: getStringValue(formData, "phone"),
    eventDate: getStringValue(formData, "eventDate"),
    location: getStringValue(formData, "location"),
    budget: getStringValue(formData, "budget"),
    source: getStringValue(formData, "source"),
    fiveWords: getStringValue(formData, "fiveWords"),
    project: getStringValue(formData, "project"),
    consent: getStringValue(formData, "consent"),
  });

  if (!validation.isValid) {
    return {
      status: "error",
      message: msg.invalidFields,
      errors: validation.errors,
    };
  }

  const { qualification, record, emailExtras } = prepareContactSubmission(validation.sanitized);
  const created = await createContactMessage(record);

  const outOfBudget = qualification === QUALIFICATION.outOfBudget;
  const resultMessage = outOfBudget ? msg.outOfBudget : msg.success;

  try {
    await sendContactEmails(created, emailExtras);
    return { status: "success", message: resultMessage, qualification, errors: {} };
  } catch (error) {
    console.error("Contact email delivery failed", error);
    return {
      status: "error",
      message: msg.sendError,
      errors: {},
    };
  }
}
