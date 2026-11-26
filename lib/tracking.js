// Identifiants publics du suivi statistique (visibles dans le code de n'importe quel site).
export const GTM_ID = "GTM-WLHV4GGW";
export const CLARITY_ID = "ziojmi6xhk";

// Clé de stockage du choix du visiteur (« granted » ou « denied »). Sans choix, le consentement est refusé.
export const CONSENT_KEY = "jp_consent";
export const CONSENT_EVENT = "jp-consent";
// Date du choix : passé 6 mois, le choix n'est plus valable et le bandeau réapparaît.
export const CONSENT_AT_KEY = "jp_consent_at";
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
// Version du texte du bandeau : à changer à chaque modification du texte, pour savoir à quoi le visiteur a consenti.
export const CONSENT_TEXT_VERSION = "2026-11-26.1";
export const CONSENT_ID_KEY = "jp_consent_id";
// Demande de réouverture du bandeau (lien « Gérer mes cookies » du pied de page).
export const CONSENT_OPEN_EVENT = "jp-consent-open";

// Exécuté dans la page AVANT le chargement de Google Tag Manager : déclare « aucun consentement » par défaut
// (Consent Mode v2). Tant que le visiteur n'a pas accepté, Google ne dépose pas de cookie de mesure.
// Si le visiteur a accepté il y a moins de 6 mois, le choix est rétabli tout de suite.
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
  var chosenAt = Number(localStorage.getItem('${CONSENT_AT_KEY}'));
  if (localStorage.getItem('${CONSENT_KEY}') === 'granted' && Date.now() - chosenAt < ${CONSENT_MAX_AGE_MS}) {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (e) {}
`;
