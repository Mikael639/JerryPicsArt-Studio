// Identifiants publics du suivi statistique (visibles dans le code de n'importe quel site).
export const GTM_ID = "GTM-WLHV4GGW";
export const CLARITY_ID = "ziojmi6xhk";

// Clé de stockage du choix du visiteur (« granted » ou « denied »). Sans choix, le consentement est refusé.
export const CONSENT_KEY = "jp_consent";
export const CONSENT_EVENT = "jp-consent";

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
