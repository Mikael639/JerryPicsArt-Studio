import { CONSENT_EVENT, CONSENT_KEY } from "./tracking";

// Lit le choix du visiteur : « granted », « denied », ou « » s'il n'a encore rien choisi.
export function readConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY) || "";
  } catch {
    return "";
  }
}

// À appeler par le futur bandeau de consentement : enregistre le choix, prévient Google (Consent Mode)
// et les autres outils (Clarity) du changement.
export function setAnalyticsConsent(granted) {
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    // Le choix ne sera pas mémorisé, mais il s'applique pour la visite en cours.
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["consent", "update", { analytics_storage: granted ? "granted" : "denied" }]);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: granted }));
}
