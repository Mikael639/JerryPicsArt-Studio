"use client";

import { useEffect } from "react";
import { readConsent } from "../lib/consent";
import { CLARITY_ID, CONSENT_EVENT } from "../lib/tracking";

// Microsoft Clarity enregistre la navigation (cartes de chaleur, rejeu de sessions) : il ne se charge donc
// qu'avec l'accord du visiteur. Tant que le choix n'est pas « granted », rien n'est téléchargé ni enregistré.
function loadClarity() {
  if (window.clarity || document.getElementById("clarity-script")) return;
  window.clarity = function clarity(...args) {
    (window.clarity.q = window.clarity.q || []).push(args);
  };
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
        // Retrait de l'accord : on demande à Clarity d'arrêter ; la page se recharge sans lui.
        try {
          window.clarity("consent", false);
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
