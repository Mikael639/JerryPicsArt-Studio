"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, setAnalyticsConsent } from "../lib/consent";
import { CONSENT_OPEN_EVENT } from "../lib/tracking";
import { useLanguage } from "./LanguageProvider";

const COPY = {
  fr: {
    title: "Mesurer les visites ?",
    text: "Avec votre accord, j'utilise Google Analytics et Microsoft Clarity pour comprendre comment le site est utilisé : pages vues, type d'appareil, région approximative et parcours à l'écran.",
    showDetail: "Voir le détail",
    hideDetail: "Masquer le détail",
    more: "Politique de confidentialité",
    accept: "Accepter",
    refuse: "Refuser",
    label: "Choix de mesure d'audience",
    detail: [
      {
        name: "Google Analytics (via Google Tag Manager)",
        what: "Pages visitées, durée de visite, type d'appareil et de navigateur, région approximative, provenance (par exemple Instagram). Des cookies de mesure sont déposés.",
        why: "Mesurer l'audience et savoir quelles pages intéressent le plus.",
      },
      {
        name: "Microsoft Clarity",
        what: "Déplacements, clics et défilements à l'écran (cartes de chaleur, rejeu de sessions). Les champs du formulaire de contact sont masqués.",
        why: "Repérer ce qui gêne la navigation pour améliorer le site.",
      },
    ],
    footer: [
      "Sans votre accord, seules des mesures anonymes sont transmises, sans cookie.",
      "Votre choix est conservé (date, choix, version de ce texte) pour pouvoir le justifier. Vous pouvez le modifier à tout moment avec « Gérer mes cookies », en bas de page.",
    ],
    whatLabel: "Données",
    whyLabel: "Pourquoi",
  },
  en: {
    title: "Measure visits?",
    text: "With your consent, I use Google Analytics and Microsoft Clarity to understand how the site is used: pages viewed, device type, approximate region and on-screen behaviour.",
    showDetail: "Show details",
    hideDetail: "Hide details",
    more: "Privacy policy",
    accept: "Accept",
    refuse: "Decline",
    label: "Analytics choice",
    detail: [
      {
        name: "Google Analytics (via Google Tag Manager)",
        what: "Pages visited, visit duration, device and browser type, approximate region, source (for example Instagram). Measurement cookies are set.",
        why: "Measure audience and see which pages interest visitors most.",
      },
      {
        name: "Microsoft Clarity",
        what: "Movements, clicks and scrolling on screen (heatmaps, session replay). Contact form fields are masked.",
        why: "Spot what gets in the way of browsing, to improve the site.",
      },
    ],
    footer: [
      "Without your consent, only anonymous measurements are sent, with no cookie.",
      "Your choice is kept (date, choice, version of this text) so that it can be demonstrated. You can change it at any time with “Manage cookies”, at the bottom of the page.",
    ],
    whatLabel: "Data",
    whyLabel: "Why",
  },
};

// Bandeau de consentement : visible tant que le visiteur n'a pas choisi. « Refuser » a le même poids visuel
// qu'« Accepter ». Le pied de page (« Gérer mes cookies ») permet de le rouvrir.
export default function ConsentBanner() {
  const { lang } = useLanguage();
  const copy = COPY[lang] || COPY.fr;
  const [visible, setVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

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
    setAnalyticsConsent(granted, lang);
    setVisible(false);
    setShowDetail(false);
  }

  return (
    <div
      role="dialog"
      aria-label={copy.label}
      className="fixed inset-x-0 bottom-0 z-[150] max-h-[85svh] overflow-y-auto rounded-t-2xl border-t border-line/15 bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-ink shadow-[0_-8px_30px_rgba(12,10,8,0.14)] md:inset-x-auto md:bottom-4 md:right-4 md:w-[26rem] md:rounded-2xl md:border md:pb-4"
    >
      <p className="font-serif text-lg leading-tight">{copy.title}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">{copy.text}</p>

      <button
        type="button"
        onClick={() => setShowDetail((value) => !value)}
        aria-expanded={showDetail}
        className="mt-2 text-[13px] font-semibold text-accent underline underline-offset-4 hover:text-ink"
      >
        {showDetail ? copy.hideDetail : copy.showDetail}
      </button>

      {showDetail ? (
        <div className="mt-3 space-y-3 border-t border-line/12 pt-3 text-[12px] leading-relaxed text-ink/75">
          {copy.detail.map((item) => (
            <div key={item.name}>
              <p className="font-bold text-ink">{item.name}</p>
              <p>
                <span className="font-semibold text-ink">{copy.whatLabel} : </span>
                {item.what}
              </p>
              <p>
                <span className="font-semibold text-ink">{copy.whyLabel} : </span>
                {item.why}
              </p>
            </div>
          ))}
          {copy.footer.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <Link href="/confidentialite" className="inline-block text-accent underline underline-offset-4 hover:text-ink">
            {copy.more}
          </Link>
        </div>
      ) : null}

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
