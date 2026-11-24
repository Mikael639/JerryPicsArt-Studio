// Identifiants publics du suivi statistique (visibles dans le code de n'importe quel site).
export const GTM_ID = "GTM-WLHV4GGW";
export const CLARITY_ID = "ziojmi6xhk";

// Clé de stockage du choix du visiteur (« granted » ou « denied »). Sans choix, le consentement est refusé.
export const CONSENT_KEY = "jp_consent";
export const CONSENT_EVENT = "jp-consent";
// Version du texte du bandeau : à changer à chaque modification du texte, pour savoir à quoi le visiteur a consenti.
export const CONSENT_TEXT_VERSION = "2026-11-24";
export const CONSENT_ID_KEY = "jp_consent_id";
// Demande de réouverture du bandeau (lien « Gérer mes cookies » du pied de page).
export const CONSENT_OPEN_EVENT = "jp-consent-open";

// Exécuté dans la page AVANT le chargement de Google Tag Manager : déclare « aucun consentement » par défaut
// (Consent Mode v2). Tant que le visiteur n'a pas accepté, Google ne dépose pas de cookie de mesure.
// Si le visiteur a déjà accepté lors d'une visite précédente, le choix est rétabli tout de suite.
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
try {
  if (localStorage.getItem('${CONSENT_KEY}') === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (e) {}
`;
