// Gabarits HTML des e-mails du formulaire de contact : le « bon de commande » de la charte JerryPicsArt.
// Les messageries lisent mal le CSS moderne : tout est en tableaux, styles en ligne, polices de repli (Georgia, Arial),
// et le message reste complet sans image.

const COLORS = {
  page: "#ece7de",
  card: "#f6f2ea",
  ink: "#111111",
  text: "#3a3a3a",
  muted: "#7a7268",
  accent: "#8f5730",
  line: "#b9b0a3",
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

const STATUS_COLORS = {
  PRIORITAIRE: "#2f6b3f",
  "À QUALIFIER": "#8f5730",
  "HORS BUDGET": "#8a2d2d",
};

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const MONTHS = {
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

// 12 juin 2027 / 12 June 2027 (la date arrive au format 2027-06-12 ; toute autre valeur est reprise telle quelle).
export function formatDate(value, lang = "fr") {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ""));
  if (!match) return String(value || "");
  const [, year, month, day] = match;
  const months = MONTHS[lang] || MONTHS.fr;
  const dayLabel = lang === "fr" && Number(day) === 1 ? "1er" : String(Number(day));
  return `${dayLabel} ${months[Number(month) - 1]} ${year}`;
}

export const formatFrenchDate = (value) => formatDate(value, "fr");

// Les valeurs des listes du formulaire sont enregistrées en français : on les traduit pour le client anglophone.
const EN_VALUES = {
  Mariage: "Wedding",
  Événement: "Event",
  "Événement d'entreprise": "Corporate event",
  "Contenu de marque": "Brand content",
  "Moins de 650 €": "Under €650",
  "650 à 1 500 €": "€650 to €1,500",
  "1 500 à 2 500 €": "€1,500 to €2,500",
  "2 500 à 3 500 €": "€2,500 to €3,500",
  "Plus de 3 500 €": "Over €3,500",
  "Je ne sais pas encore": "Not sure yet",
};

export function translateValue(value, lang) {
  return lang === "en" ? EN_VALUES[value] || value : value;
}

const CLIENT_COPY = {
  fr: {
    htmlLang: "fr",
    request: "Demande n°",
    hello: "Bonjour",
    received: "Votre demande est bien reçue. Voici ce que j'ai noté :",
    replyPrefix: "Je vous réponds personnellement sous",
    replyDelay: "24 à 48 h",
    replySuffix: "Vous pouvez répondre directement à cet e-mail pour ajouter une précision.",
    footer: "JerryPicsArt · Photographe à Paris · jerrypicsart.com",
    preheader: "Bien reçu. Je vous réponds personnellement sous 24 à 48 h.",
    labels: { service: "Prestation", date: "Date de l'événement", place: "Lieu", budget: "Budget indicatif" },
  },
  en: {
    htmlLang: "en",
    request: "Request no.",
    hello: "Hello",
    received: "Your request has been received. Here is what I noted:",
    replyPrefix: "I will reply to you personally within",
    replyDelay: "24 to 48 hours",
    replySuffix: "You can reply directly to this email to add any detail.",
    footer: "JerryPicsArt · Photographer in Paris · jerrypicsart.com",
    preheader: "Received. I will reply to you personally within 24 to 48 hours.",
    labels: { service: "Service", date: "Event date", place: "Location", budget: "Indicative budget" },
  },
};

export function getClientCopy(lang) {
  return CLIENT_COPY[lang] || CLIENT_COPY.fr;
}

// Numéro de demande lisible : JPA-20261120-A3F9 (date d'envoi + début de l'identifiant).
export function buildReference(message) {
  const date = String(message.createdAt || "").slice(0, 10).replace(/-/g, "");
  const short = String(message.id || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  return ["JPA", date, short].filter(Boolean).join("-");
}

function shell({ preheader, inner, lang = "fr", footer = getClientCopy("fr").footer }) {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>JerryPicsArt</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${COLORS.page};">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.page};">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${COLORS.card};border-radius:10px;">
<tr><td style="padding:30px 32px 26px 32px;">
${inner}
</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
<tr><td align="center" style="padding:16px 0 0 0;font-family:${SANS};font-size:11px;line-height:1.6;color:${COLORS.muted};">
${escapeHtml(footer)}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function topLine(left, right) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="font-family:${SANS};font-size:11px;letter-spacing:1.5px;color:${COLORS.accent};text-transform:uppercase;">${left}</td>
<td align="right" style="font-family:${SANS};font-size:11px;letter-spacing:1px;color:${COLORS.muted};">${right}</td>
</tr>
</table>`;
}

function brandName() {
  return `<div style="font-family:${SERIF};font-size:28px;line-height:1.1;color:${COLORS.ink};margin:14px 0 14px 0;">JerryPicsArt</div>
<div style="height:1px;background:${COLORS.ink};line-height:1px;font-size:1px;">&nbsp;</div>`;
}

function recapTable(rows) {
  const lines = rows
    .filter(([, value]) => value)
    .map(
      ([label, value], index, all) => `<tr>
<td style="padding:9px 0;font-family:${SANS};font-size:13px;color:${COLORS.muted};border-bottom:${index === all.length - 1 ? "0" : `1px dotted ${COLORS.line}`};">${escapeHtml(label)}</td>
<td align="right" style="padding:9px 0;font-family:${SANS};font-size:13px;color:${COLORS.ink};font-weight:bold;border-bottom:${index === all.length - 1 ? "0" : `1px dotted ${COLORS.line}`};">${escapeHtml(value)}</td>
</tr>`
    )
    .join("\n");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 6px 0;">
${lines}
</table>`;
}

// E-mail au client : confirmation de réception, récapitulatif, promesse de réponse.
export function renderClientEmail({ name, reference, sentOn, rows, lang = "fr" }) {
  const copy = getClientCopy(lang);
  const inner = `${topLine(`${copy.request} ${escapeHtml(reference)}`, escapeHtml(sentOn))}
${brandName()}
<p style="font-family:${SERIF};font-size:20px;line-height:1.3;color:${COLORS.ink};margin:22px 0 8px 0;">${copy.hello} ${escapeHtml(name)},</p>
<p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${COLORS.text};margin:0;">${copy.received}</p>
${recapTable(rows)}
<p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${COLORS.text};margin:14px 0 0 0;">${copy.replyPrefix} <strong style="color:${COLORS.ink};">${copy.replyDelay}</strong>. ${copy.replySuffix}</p>
<p style="font-family:${SERIF};font-size:20px;font-style:italic;color:${COLORS.ink};margin:22px 0 0 0;">Jerry</p>`;

  return shell({ preheader: copy.preheader, inner, lang: copy.htmlLang, footer: copy.footer });
}

// E-mail à Jerry : même fiche, avec le statut de la demande bien visible et un bouton pour répondre.
export function renderOwnerEmail({ name, email, phone, reference, sentOn, qualification, rows, project }) {
  const color = STATUS_COLORS[qualification] || COLORS.muted;
  const badge = qualification
    ? `<span style="display:inline-block;background:${color};color:#ffffff;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:1.5px;padding:5px 10px;border-radius:4px;">${escapeHtml(qualification)}</span>`
    : "";
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Votre demande JerryPicsArt")}`;
  const inner = `${topLine(`Demande n° ${escapeHtml(reference)}`, escapeHtml(sentOn))}
${brandName()}
<p style="margin:18px 0 6px 0;">${badge}</p>
<p style="font-family:${SERIF};font-size:22px;line-height:1.25;color:${COLORS.ink};margin:6px 0 0 0;">${escapeHtml(name)}</p>
<p style="font-family:${SANS};font-size:13px;line-height:1.7;color:${COLORS.text};margin:2px 0 0 0;"><a href="mailto:${escapeHtml(email)}" style="color:${COLORS.accent};">${escapeHtml(email)}</a>${
    phone ? ` · <a href="tel:${escapeHtml(String(phone).replace(/\s+/g, ""))}" style="color:${COLORS.accent};">${escapeHtml(phone)}</a>` : ""
  }</p>
${recapTable(rows)}
<p style="font-family:${SANS};font-size:11px;letter-spacing:1.5px;color:${COLORS.accent};text-transform:uppercase;margin:20px 0 6px 0;">Message</p>
<p style="font-family:${SANS};font-size:14px;line-height:1.7;color:${COLORS.text};margin:0;">${escapeHtml(project).replace(/\n/g, "<br />")}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0 0;">
<tr><td style="background:${COLORS.ink};border-radius:999px;">
<a href="${mailto}" style="display:inline-block;padding:12px 24px;font-family:${SANS};font-size:12px;font-weight:bold;letter-spacing:1.5px;color:#ffffff;text-decoration:none;text-transform:uppercase;">Répondre à ${escapeHtml(String(name).split(" ")[0])}</a>
</td></tr>
</table>`;

  return shell({
    preheader: `${qualification ? `[${qualification}] ` : ""}Nouvelle demande de ${name}`,
    inner,
  });
}
