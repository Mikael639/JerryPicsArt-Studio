import { siteConfig } from "./siteConfig";
import {
  buildReference,
  formatDate,
  formatFrenchDate,
  getClientCopy,
  renderClientEmail,
  renderOwnerEmail,
  translateValue,
} from "./emailTemplates";

const RESEND_API_URL = "https://api.resend.com/emails";
// Sans variable CONTACT_TO_EMAIL, les demandes vont à Jerry (jamais à une adresse personnelle écrite dans le code).
const DEFAULT_TO = siteConfig.email;
const DEFAULT_FROM = "JerryPicsArt <onboarding@resend.dev>";
const DEFAULT_REPLY_SUBJECT = "Merci pour votre demande | JerryPicsArt";
const DEFAULT_REPLY_SUBJECT_EN = "Thank you for your request | JerryPicsArt";

function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY || "",
    to: process.env.CONTACT_TO_EMAIL || DEFAULT_TO,
    from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
    autoReplySubject: process.env.CONTACT_AUTO_REPLY_SUBJECT || DEFAULT_REPLY_SUBJECT,
  };
}

function buildOwnerEmailPayload(message, extras = {}) {
  const status = extras.qualification ? `[${extras.qualification}] ` : "";
  const subject = `${status}[Nouveau devis] ${message.serviceType || "Prestation"} - ${message.name}`;

  const rows = [
    ["Statut", extras.qualification ? `[${extras.qualification}]` : "Non qualifié"],
    ["Type de devis", extras.typeLabel || "Non précisé"],
    ["Vous êtes", extras.audience || "Non précisé"],
    ...(extras.lang === "en" ? [["Langue du client", "Anglais (répondre en anglais)"]] : []),
    ["Nom", message.name],
    ["E-mail", message.email],
    ["Téléphone", message.phone || "Non précisé"],
    ["Prestation", message.serviceType || ""],
    ["Date de l'événement", message.eventDate || "Non précisée"],
    ["Lieu", message.location || "Non précisé"],
    ...(extras.details || []),
    ["Budget indicatif", message.budget || "Non précisé"],
    ["Comment m'a connu", extras.source || "Non précisé"],
  ];

  const text = [
    "Nouvelle demande de devis",
    "",
    ...rows.map(([label, value]) => `${label} : ${value}`),
    "",
    "Message :",
    extras.project || message.project || "",
    "",
    `Date d'envoi : ${message.createdAt || ""}`,
  ].join("\n");

  // Le nom, l'e-mail, le téléphone et le statut figurent déjà en tête de la fiche.
  const header = new Set(["Statut", "Nom", "E-mail", "Téléphone"]);
  const html = renderOwnerEmail({
    name: message.name,
    email: message.email,
    phone: message.phone,
    reference: buildReference(message),
    sentOn: formatFrenchDate(message.createdAt),
    qualification: extras.qualification,
    rows: rows.filter(([label]) => !header.has(label)),
    project: extras.project || message.project || "",
  });

  return { subject, text, html };
}

function buildClientAutoReplyPayload(message, autoReplySubject, lang = "fr") {
  const copy = getClientCopy(lang);
  const en = lang === "en";
  const none = en ? "Not specified" : "Non précisé";
  const service = translateValue(message.serviceType, lang);
  const date = formatDate(message.eventDate, lang);
  const budget = translateValue(message.budget, lang);

  const text = [
    `${copy.hello} ${message.name},`,
    "",
    en ? "Thank you for your request." : "Merci pour votre demande.",
    en ? "I have received it and I will reply within 24 to 48 hours." : "Je l'ai bien reçue et je vous réponds sous 24 à 48 h.",
    "",
    en ? "Summary of your request:" : "Récapitulatif de votre demande :",
    `- ${copy.labels.service} : ${service || ""}`,
    `- ${copy.labels.date} : ${date || none}`,
    `- ${copy.labels.place} : ${message.location || none}`,
    `- ${copy.labels.budget} : ${budget || none}`,
    "",
    en ? "Best regards," : "À bientôt,",
    "Jerry - JerryPicsArt",
  ].join("\n");

  const html = renderClientEmail({
    lang,
    name: message.name,
    reference: buildReference(message),
    sentOn: formatDate(message.createdAt, lang),
    rows: [
      [copy.labels.service, service],
      [copy.labels.date, date],
      [copy.labels.place, message.location],
      [copy.labels.budget, budget],
    ],
  });

  return {
    subject: en ? DEFAULT_REPLY_SUBJECT_EN : autoReplySubject,
    text,
    html,
  };
}

async function sendResendEmail({ apiKey, from, to, replyTo, subject, text, html }) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(payload || "Unable to send email.");
  }
}

export async function sendContactEmails(message, extras = {}) {
  const config = getEmailConfig();
  if (!config.apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  const ownerMail = buildOwnerEmailPayload(message, extras);
  await sendResendEmail({
    apiKey: config.apiKey,
    from: config.from,
    to: config.to,
    replyTo: message.email,
    subject: ownerMail.subject,
    text: ownerMail.text,
    html: ownerMail.html,
  });

  const result = {
    ownerSent: true,
    autoReplySent: false,
    autoReplyError: "",
  };

  const clientMail = buildClientAutoReplyPayload(message, config.autoReplySubject, extras.lang === "en" ? "en" : "fr");
  try {
    await sendResendEmail({
      apiKey: config.apiKey,
      from: config.from,
      to: message.email,
      // L'adresse d'envoi (contact@…) n'a pas de boîte : si le client répond, sa réponse va chez Jerry.
      replyTo: config.to,
      subject: clientMail.subject,
      text: clientMail.text,
      html: clientMail.html,
    });
    result.autoReplySent = true;
  } catch (error) {
    result.autoReplyError = error.message || "auto-reply failed";
  }

  return result;
}
