const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_TO = "coulibaly@et.esiea.fr";
const DEFAULT_FROM = "JerryPicsArt <onboarding@resend.dev>";
const DEFAULT_REPLY_SUBJECT = "Merci pour votre demande — JerryPicsArt";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
    ["Vous êtes", extras.audience || "Non précisé"],
    ["Nom", message.name],
    ["E-mail", message.email],
    ["Téléphone", message.phone || "Non précisé"],
    ["Prestation", message.serviceType || ""],
    ["Date de l'événement", message.eventDate || "Non précisée"],
    ["Lieu", message.location || "Non précisé"],
    ["Nombre d'invités", extras.guests || "Non précisé"],
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

  const html = `
    <h2>Nouvelle demande de devis</h2>
    ${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)} :</strong> ${escapeHtml(value)}</p>`).join("\n")}
    <p><strong>Message :</strong></p>
    <p>${escapeHtml(extras.project || message.project || "").replace(/\n/g, "<br/>")}</p>
    <hr />
    <p><small>Envoyé le ${escapeHtml(message.createdAt || "")}</small></p>
  `;

  return { subject, text, html };
}

function buildClientAutoReplyPayload(message, autoReplySubject) {
  const text = [
    `Bonjour ${message.name},`,
    "",
    "Merci pour votre demande.",
    "Je l'ai bien reçue et je vous réponds sous 24 à 48 h.",
    "",
    "Récapitulatif de votre demande :",
    `- Prestation : ${message.serviceType || ""}`,
    `- Date de l'événement : ${message.eventDate || "Non précisée"}`,
    `- Lieu : ${message.location || "Non précisé"}`,
    `- Budget indicatif : ${message.budget || "Non précisé"}`,
    "",
    "À bientôt,",
    "JerryPicsArt",
  ].join("\n");

  const html = `
    <p>Bonjour ${escapeHtml(message.name)},</p>
    <p>Merci pour votre demande.</p>
    <p>Je l'ai bien reçue et je vous réponds sous 24 à 48 h.</p>
    <p><strong>Récapitulatif :</strong></p>
    <ul>
      <li>Prestation : ${escapeHtml(message.serviceType || "")}</li>
      <li>Date de l'événement : ${escapeHtml(message.eventDate || "Non précisée")}</li>
      <li>Lieu : ${escapeHtml(message.location || "Non précisé")}</li>
      <li>Budget indicatif : ${escapeHtml(message.budget || "Non précisé")}</li>
    </ul>
    <p>À bientôt,<br/>JerryPicsArt</p>
  `;

  return {
    subject: autoReplySubject,
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

  const clientMail = buildClientAutoReplyPayload(message, config.autoReplySubject);
  try {
    await sendResendEmail({
      apiKey: config.apiKey,
      from: config.from,
      to: message.email,
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
