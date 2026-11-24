"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, setAnalyticsConsent } from "../lib/consent";
import { CONSENT_OPEN_EVENT } from "../lib/tracking";
import { useLanguage } from "./LanguageProvider";

const COPY = {
  fr: {
    title: "Mesurer les visites ?",
    text: "Avec votre accord, j'utilise des outils de mesure (Google, Clarity) pour améliorer le site.",
    more: "En savoir plus",
    accept: "Accepter",
    refuse: "Refuser",
    label: "Choix de mesure d'audience",
  },
  en: {
    title: "Measure visits?",
    text: "With your consent, I use measurement tools (Google, Clarity) to improve the site.",
    more: "Learn more",
    accept: "Accept",
    refuse: "Decline",
    label: "Analytics choice",
  },
};

// Bandeau de consentement : visible tant que le visiteur n'a pas choisi. « Refuser » a le même poids visuel
// qu'« Accepter ». Le pied de page (« Gérer mes cookies ») permet de le rouvrir.
export default function ConsentBanner() {
  const { lang } = useLanguage();
  const copy = COPY[lang] || COPY.fr;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Lecture après le premier affichage : le serveur ne connaît pas le choix du visiteur.
    const frame = requestAnimationFrame(() => setVisible(readConsent() === ""));
    function reopen() {
      setVisible(true);
    }
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  if (!visible) return null;

  function choose(granted) {
    setAnalyticsConsent(granted);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label={copy.label}
      className="fixed inset-x-0 bottom-0 z-[150] rounded-t-2xl border-t border-line/15 bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-ink shadow-[0_-8px_30px_rgba(12,10,8,0.14)] md:inset-x-auto md:bottom-4 md:right-4 md:w-[22rem] md:rounded-2xl md:border md:pb-4"
    >
      <p className="font-serif text-lg leading-tight">{copy.title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">
        {copy.text}{" "}
        <Link href="/confidentialite" className="text-accent underline underline-offset-4 hover:text-ink">
          {copy.more}
        </Link>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 md:flex">
        <button
          type="button"
          onClick={() => choose(true)}
          className="rounded-full bg-ink px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent"
        >
          {copy.accept}
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="rounded-full border border-ink px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {copy.refuse}
        </button>
      </div>
    </div>
  );
}
