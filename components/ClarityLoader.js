"use client";

import { useEffect } from "react";
import { readConsent } from "../lib/consent";
import { CLARITY_ID, CONSENT_EVENT } from "../lib/tracking";

// Microsoft Clarity enregistre la navigation (cartes de chaleur, rejeu de sessions) : il ne se charge donc
// qu'avec l'accord du visiteur. Tant que le choix n'est pas « granted », rien n'est téléchargé ni enregistré.

// Signal d'accord exigé par Microsoft pour l'Europe : sans lui, Clarity ne dépose aucun cookie et ne relie pas
// les pages d'une même visite. La publicité reste toujours refusée (le site n'en fait pas).
function sendClarityConsent(granted) {
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: granted ? "granted" : "denied" });
}

function loadClarity() {
  if (!window.clarity) {
    // File d'attente officielle : les commandes sont exécutées dès que le script est arrivé.
    window.clarity = function clarity(...args) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };
  }
  sendClarityConsent(true);
  if (document.getElementById("clarity-script")) return;
  const script = document.createElement("script");
  script.id = "clarity-script";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(script);
}

export default function ClarityLoader() {
  useEffect(() => {
    if (readConsent() === "granted") loadClarity();

    function onConsent(event) {
      if (event.detail === true) {
        loadClarity();
      } else if (typeof window.clarity === "function") {
        // Retrait de l'accord : Clarity efface ses cookies et passe en mode sans cookie.
        try {
          sendClarityConsent(false);
        } catch {
          // Clarity facultatif.
        }
      }
    }

    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  return null;
}
