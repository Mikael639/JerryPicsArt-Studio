import { createHmac } from "node:crypto";
import { siteConfig } from "./siteConfig";
import { formatDate, getReviewInvitationCopy, renderReviewInvitationEmail } from "./emailTemplates";

const RESEND_API_URL = "https://api.resend.com/emails";
const TABLE_NAME = "review_invitations";
const DEFAULT_FROM = "JerryPicsArt <contact@jerrypicsart.com>";
const DEFAULT_TO = siteConfig.email;

const HOURLY_LIMIT = 20;
const HOUR_MS = 60 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

function getReviewConfig() {
  return {
    supabaseUrl: (process.env.SUPABASE_URL || "").trim(),
    supabaseServiceKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim(),
    hashSecret: (process.env.REVIEW_INVITATION_HASH_SECRET || process.env.ADMIN_SESSION_SECRET || "").trim(),
    resendApiKey: (process.env.RESEND_API_KEY || "").trim(),
    from: (process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM).trim(),
    replyTo: (process.env.CONTACT_TO_EMAIL || DEFAULT_TO).trim(),
    trustpilotBcc: (process.env.TRUSTPILOT_BCC_ADDRESS || "").trim(),
  };
}

function getSupabaseHeaders(serviceKey) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
}

// Empreinte HMAC-SHA256 irréversible de l'e-mail normalisé : permet de bloquer les doublons sans stocker l'e-mail en clair.
export function hashClientEmail(email, secret) {
  return createHmac("sha256", secret).update(email).digest("hex");
}

// Nettoie et valide les champs saisis dans l'administration.
export function validateReviewInvitationInput(input) {
  const rawName = typeof input?.name === "string" ? input.name : "";
  const rawEmail = typeof input?.email === "string" ? input.email : "";
  const rawReference = typeof input?.reference === "string" ? input.reference : "";
  const lang = input?.lang === "en" ? "en" : "fr";

  if (/[<>]/.test(rawName)) {
    return { ok: false, message: "Le nom du client ne doit pas contenir de chevrons ou de balises HTML." };
  }

  const name = rawName.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  if (name.length < 2 || name.length > 80) {
    return { ok: false, message: "Le nom du client est obligatoire (entre 2 et 80 caractères)." };
  }

  const email = rawEmail.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, message: "Veuillez saisir une adresse e-mail client valide." };
  }

  if (/[<>]/.test(rawReference)) {
    return { ok: false, message: "La référence ne doit pas contenir de chevrons ou de balises HTML." };
  }

  const reference = rawReference.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  if (reference.length > 120) {
    return { ok: false, message: "La référence ne doit pas dépasser 120 caractères." };
  }

  return {
    ok: true,
    data: { name, email, reference, lang },
  };
}

// Masque toute adresse ou secret dans les messages d'erreur avant stockage en base ou affichage.
function sanitizeErrorText(rawMessage, secretsToRedact = []) {
  let clean = String(rawMessage || "Erreur lors de l'envoi").slice(0, 400);
  for (const secret of secretsToRedact) {
    if (secret && typeof secret === "string") {
      clean = clean.split(secret).join("[masqué]");
    }
  }
  return clean;
}

function isMissingTableResponse(status, bodyText) {
  return (
    status === 404 ||
    bodyText.includes("PGRST205") ||
    bodyText.includes("review_invitations") && bodyText.includes("does not exist")
  );
}

async function checkProtectionsInDatabase({ emailHash, config, now }) {
  const since30Days = new Date(now - DUPLICATE_WINDOW_MS).toISOString();
  const duplicateUrl = new URL(`/rest/v1/${TABLE_NAME}`, config.supabaseUrl);
  duplicateUrl.searchParams.set("select", "id,created_at");
  duplicateUrl.searchParams.set("email_hash", `eq.${emailHash}`);
  duplicateUrl.searchParams.set("status", "eq.sent");
  duplicateUrl.searchParams.set("created_at", `gte.${since30Days}`);
  duplicateUrl.searchParams.set("limit", "1");

  const dupResponse = await fetch(duplicateUrl.toString(), {
    method: "GET",
    headers: getSupabaseHeaders(config.supabaseServiceKey),
    cache: "no-store",
  });

  if (!dupResponse.ok) {
    const bodyText = await dupResponse.text();
    if (isMissingTableResponse(dupResponse.status, bodyText)) {
      throw new Error(
        "La table review_invitations n'existe pas encore dans Supabase. Exécutez la migration SQL dans Supabase."
      );
    }
    throw new Error("Impossible de vérifier l'historique des invitations dans Supabase.");
  }

  const duplicates = await dupResponse.json();
  if (Array.isArray(duplicates) && duplicates.length > 0) {
    return {
      allowed: false,
      message: "Une invitation a déjà été envoyée à cette adresse e-mail au cours des 30 derniers jours.",
    };
  }

  const since1Hour = new Date(now - HOUR_MS).toISOString();
  const rateUrl = new URL(`/rest/v1/${TABLE_NAME}`, config.supabaseUrl);
  rateUrl.searchParams.set("select", "id");
  rateUrl.searchParams.set("created_at", `gte.${since1Hour}`);
  rateUrl.searchParams.set("limit", String(HOURLY_LIMIT + 1));

  const rateResponse = await fetch(rateUrl.toString(), {
    method: "GET",
    headers: getSupabaseHeaders(config.supabaseServiceKey),
    cache: "no-store",
  });

  if (!rateResponse.ok) {
    throw new Error("Impossible de vérifier la limite horaire d'envoi dans Supabase.");
  }

  const recentRows = await rateResponse.json();
  if (Array.isArray(recentRows) && recentRows.length >= HOURLY_LIMIT) {
    return {
      allowed: false,
      message: `Limite de ${HOURLY_LIMIT} invitations par heure atteinte. Veuillez réessayer un peu plus tard.`,
    };
  }

  return { allowed: true };
}

async function writeInvitationLog({ config, emailHash, name, reference, lang, status, errorMessage = null }) {
  const endpoint = new URL(`/rest/v1/${TABLE_NAME}`, config.supabaseUrl);
  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(config.supabaseServiceKey),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      email_hash: emailHash,
      client_name: name,
      reference: reference || null,
      lang,
      status,
      error_message: errorMessage || null,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossible d'enregistrer le journal d'invitation dans Supabase.");
  }

  const rows = await response.json();
  const row = Array.isArray(rows) ? rows[0] : null;
  return row ? normalizeLogRow(row) : null;
}

function normalizeLogRow(row) {
  return {
    id: row.id,
    createdAt: row.created_at || "",
    clientName: row.client_name || "",
    reference: row.reference || "",
    lang: row.lang === "en" ? "en" : "fr",
    status: row.status === "sent" ? "sent" : "failed",
    errorMessage: row.error_message || "",
  };
}

function buildInvitationEmailPayload({ name, lang, nowIso }) {
  const copy = getReviewInvitationCopy(lang);
  const sentOn = formatDate(nowIso.slice(0, 10), lang);

  const text = [
    `${copy.hello} ${name},`,
    "",
    copy.thanks,
    "",
    copy.followUp,
    "",
    copy.replyHint,
    "",
    copy.closing,
    "Jerry - JerryPicsArt",
  ].join("\n");

  const html = renderReviewInvitationEmail({
    name,
    sentOn,
    lang,
  });

  return {
    subject: copy.subject,
    text,
    html,
  };
}

async function sendResendWithBcc({ apiKey, from, to, bcc, replyTo, subject, text, html }) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      bcc: [bcc],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(payload || `Erreur Resend (${response.status})`);
  }
}

export async function sendTrustpilotReviewInvitation(rawInput) {
  const validation = validateReviewInvitationInput(rawInput);
  if (!validation.ok) {
    return { ok: false, message: validation.message };
  }

  const { name, email, reference, lang } = validation.data;
  const config = getReviewConfig();

  if (!config.trustpilotBcc) {
    return {
      ok: false,
      message: "Envoi refusé : la variable serveur TRUSTPILOT_BCC_ADDRESS n'est pas configurée.",
    };
  }

  if (!EMAIL_PATTERN.test(config.trustpilotBcc)) {
    return {
      ok: false,
      message: "Envoi refusé : la variable serveur TRUSTPILOT_BCC_ADDRESS n'est pas une adresse e-mail valide.",
    };
  }

  if (!config.resendApiKey) {
    return {
      ok: false,
      message: "Envoi refusé : la clé RESEND_API_KEY n'est pas configurée sur le serveur.",
    };
  }

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    return {
      ok: false,
      message: "Envoi refusé : la base Supabase n'est pas configurée pour contrôler l'anti-doublon et la limite horaire.",
    };
  }

  if (!config.hashSecret) {
    return {
      ok: false,
      message: "Envoi refusé : le secret serveur ADMIN_SESSION_SECRET est manquant pour le hachage.",
    };
  }

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const emailHash = hashClientEmail(email, config.hashSecret);

  const protection = await checkProtectionsInDatabase({ emailHash, config, now });
  if (!protection.allowed) {
    return { ok: false, message: protection.message };
  }

  const mail = buildInvitationEmailPayload({ name, lang, nowIso });
  const secretsToRedact = [config.trustpilotBcc, config.resendApiKey, email];

  try {
    await sendResendWithBcc({
      apiKey: config.resendApiKey,
      from: config.from,
      to: email,
      bcc: config.trustpilotBcc,
      replyTo: config.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
  } catch (sendError) {
    const safeError = sanitizeErrorText(sendError?.message, secretsToRedact);
    await writeInvitationLog({
      config,
      emailHash,
      name,
      reference,
      lang,
      status: "failed",
      errorMessage: safeError,
    }).catch(() => {});

    return {
      ok: false,
      message: "L'envoi de l'e-mail via Resend a échoué. Vérifiez que votre domaine d'expédition est bien validé dans Resend.",
    };
  }

  const logEntry = await writeInvitationLog({
    config,
    emailHash,
    name,
    reference,
    lang,
    status: "sent",
    errorMessage: null,
  });

  return {
    ok: true,
    message: `E-mail de remerciement envoyé à ${name} (${lang.toUpperCase()}). Trustpilot se chargera d'envoyer l'invitation d'avis.`,
    data: logEntry,
  };
}

export async function listRecentReviewInvitations(limit = 15) {
  const config = getReviewConfig();
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    return [];
  }

  try {
    const url = new URL(`/rest/v1/${TABLE_NAME}`, config.supabaseUrl);
    url.searchParams.set("select", "id,created_at,client_name,reference,lang,status,error_message");
    url.searchParams.append("order", "created_at.desc");
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getSupabaseHeaders(config.supabaseServiceKey),
      cache: "no-store",
    });

    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? rows.map(normalizeLogRow) : [];
  } catch {
    return [];
  }
}
