"use server";

import { headers } from "next/headers";
import { createContactMessage } from "../../lib/contactStore";
import { sendContactEmails } from "../../lib/contactEmail";
import { QUALIFICATION, qualifyRequest, validateContactInput } from "../../lib/contactValidation";
import { consumeRateLimit } from "../../lib/rateLimit";

const CONTACT_SEND_ERROR_MESSAGE =
  "Votre message est enregistré, mais l'envoi de l'e-mail est temporairement indisponible. Je traite votre demande rapidement.";

const OUT_OF_BUDGET_MESSAGE =
  "Merci pour votre demande. Nos prestations démarrent à partir de 650 € (événements) et 1 500 € (mariages). Si votre budget évolue, je serai ravi d'en parler.";

const SUCCESS_MESSAGE = "Merci, votre demande est bien reçue. Réponse sous 24 à 48 h.";

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

// Les nouveaux champs sont regroupés en tête du message pour ne pas modifier la base existante.
function composeProject(fields, qualification) {
  return [
    `Statut : [${qualification}]`,
    `Vous êtes : ${fields.audience}`,
    `Nombre d'invités : ${fields.guests}`,
    `Comment m'a connu : ${fields.source}`,
    "",
    "Message :",
    fields.project,
  ].join("\n");
}

export async function submitContactForm(_previousState, formData) {
  const ip = await getClientIp();
  const limiter = consumeRateLimit(ip, { limit: 5, windowMs: 10 * 60 * 1000 });

  if (!limiter.allowed) {
    return {
      status: "error",
      message: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
      errors: {},
    };
  }

  const validation = validateContactInput({
    audience: getStringValue(formData, "audience"),
    name: getStringValue(formData, "name"),
    email: getStringValue(formData, "email"),
    phone: getStringValue(formData, "phone"),
    serviceType: getStringValue(formData, "serviceType"),
    eventDate: getStringValue(formData, "eventDate"),
    location: getStringValue(formData, "location"),
    guests: getStringValue(formData, "guests"),
    budget: getStringValue(formData, "budget"),
    source: getStringValue(formData, "source"),
    project: getStringValue(formData, "project"),
    consent: getStringValue(formData, "consent"),
  });

  if (!validation.isValid) {
    return {
      status: "error",
      message: "Veuillez corriger les champs signalés.",
      errors: validation.errors,
    };
  }

  const fields = validation.sanitized;
  const qualification = qualifyRequest(fields);

  const created = await createContactMessage({
    name: fields.name,
    email: fields.email,
    company: "",
    phone: fields.phone,
    serviceType: fields.serviceType,
    preferredContact: "Email",
    budget: fields.budget,
    eventDate: fields.eventDate,
    location: fields.location,
    referenceLink: "",
    project: composeProject(fields, qualification),
  });

  const outOfBudget = qualification === QUALIFICATION.outOfBudget;
  const resultMessage = outOfBudget ? OUT_OF_BUDGET_MESSAGE : SUCCESS_MESSAGE;

  try {
    await sendContactEmails(created, { ...fields, qualification });
    return { status: "success", message: resultMessage, qualification, errors: {} };
  } catch (error) {
    console.error("Contact email delivery failed", error);
    return {
      status: "error",
      message: CONTACT_SEND_ERROR_MESSAGE,
      errors: {},
    };
  }
}
