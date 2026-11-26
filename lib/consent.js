import {
  CONSENT_AT_KEY,
  CONSENT_EVENT,
  CONSENT_ID_KEY,
  CONSENT_KEY,
  CONSENT_MAX_AGE_MS,
  CONSENT_TEXT_VERSION,
} from "./tracking";

// Lit le choix du visiteur : « granted », « denied », ou « » s'il n'a rien choisi ou si son choix a plus de 6 mois.
export function readConsent() {
  try {
    const chosenAt = Number(window.localStorage.getItem(CONSENT_AT_KEY));
    if (Date.now() - chosenAt >= CONSENT_MAX_AGE_MS) return "";
    return window.localStorage.getItem(CONSENT_KEY) || "";
  } catch {
    return "";
  }
}

// Identifiant aléatoire propre à ce navigateur : il sert seulement à retrouver ses choix dans le journal.
// Il ne contient aucune information personnelle.
function getVisitorId() {
  try {
    let id = window.localStorage.getItem(CONSENT_ID_KEY);
    if (!id) {
      id = window.crypto.randomUUID();
      window.localStorage.setItem(CONSENT_ID_KEY, id);
    }
    return id;
  } catch {
    return window.crypto?.randomUUID?.() || "";
  }
}

// Conserve la preuve du choix dans le journal du site. Ne bloque jamais l'interface.
function logConsent(granted, lang) {
  const visitorId = getVisitorId();
  if (!visitorId) return;
  try {
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        choice: granted ? "granted" : "denied",
        version: CONSENT_TEXT_VERSION,
        lang,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Le journal est un complément : le choix reste appliqué dans le navigateur.
  }
}

// Google ne reconnaît une commande de consentement que sous la forme exacte produite par gtag() :
// l'objet « arguments » de la fonction. Un simple tableau poussé dans dataLayer est ignoré sans erreur.
function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

// Appelé par le bandeau : enregistre le choix (navigateur + journal), prévient Google (Consent Mode)
// et les autres outils (Clarity) du changement.
export function setAnalyticsConsent(granted, lang = "fr") {
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
    window.localStorage.setItem(CONSENT_AT_KEY, String(Date.now()));
  } catch {
    // Le choix ne sera pas mémorisé, mais il s'applique pour la visite en cours.
  }

  gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: granted }));
  logConsent(granted, lang);
}
