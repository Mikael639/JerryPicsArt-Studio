import { track } from "@vercel/analytics";

// Envoie un évènement à Vercel Analytics (mesure sans cookie). Ne bloque jamais l'interface.
export function trackEvent(name, data) {
  try {
    track(name, data);
  } catch {
    // La mesure est facultative.
  }
}
