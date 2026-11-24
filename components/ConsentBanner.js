"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, setAnalyticsConsent } from "../lib/consent";
import { CONSENT_OPEN_EVENT } from "../lib/tracking";
import { useLanguage } from "./LanguageProvider";

const COPY = {
  fr: {
    title: "Mesurer les visites ?",
    text: "J'utilise Google Analytics et Microsoft Clarity pour comprendre comment le site est utilisé, avec votre accord.",
    showDetail: "Voir le détail",
    detailTitle: "Ce qui est mesuré, et pourquoi",
    close: "Fermer",
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
    text: "I use Google Analytics and Microsoft Clarity to understand how the site is used, with your consent.",
    showDetail: "Show details",
    detailTitle: "What is measured, and why",
    close: "Close",
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

function ChoiceButtons({ copy, onChoose, className = "" }) {
  return (
    <div className={`grid grid-cols-2 gap-2 sm:flex ${className}`}>
      <button
        type="button"
        onClick={() => onChoose(true)}
        className="rounded-full bg-ink px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-accent"
      >
        {copy.accept}
      </button>
      <button
        type="button"
        onClick={() => onChoose(false)}
        className="rounded-full border border-ink px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-paper"
      >
        {copy.refuse}
      </button>
    </div>
  );
}

// Bandeau de consentement en deux niveaux : un message court en bas de l'écran, et le détail dans une fenêtre
// centrée (« Voir le détail »). « Refuser » a le même poids visuel qu'« Accepter ». Le pied de page
// (« Gérer mes cookies ») permet de rouvrir le bandeau.
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

  // Échap ferme la fenêtre de détail.
  useEffect(() => {
    if (!showDetail) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setShowDetail(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDetail]);

  if (!visible) return null;

  function choose(granted) {
    setAnalyticsConsent(granted, lang);
    setVisible(false);
    setShowDetail(false);
  }

  return (
    <>
      <div
        role="dialog"
        aria-label={copy.label}
        className="fixed inset-x-0 bottom-0 z-[150] rounded-t-2xl border-t border-line/15 bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-ink shadow-[0_-8px_30px_rgba(12,10,8,0.14)] md:inset-x-auto md:bottom-4 md:right-4 md:w-[24rem] md:rounded-2xl md:border md:pb-4"
      >
        <p className="font-serif text-lg leading-tight">{copy.title}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">
          {copy.text}{" "}
          <button
            type="button"
            onClick={() => setShowDetail(true)}
            className="font-semibold text-accent underline underline-offset-4 hover:text-ink"
          >
            {copy.showDetail}
          </button>
        </p>
        <ChoiceButtons copy={copy} onChoose={choose} className="mt-3" />
      </div>

      {showDetail ? (
        <div
          className="fixed inset-0 z-[160] flex items-end justify-center bg-ink/45 p-3 sm:items-center sm:p-6"
          onClick={() => setShowDetail(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={copy.detailTitle}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[88svh] w-full max-w-lg flex-col rounded-2xl border border-line/15 bg-paper text-ink shadow-[0_24px_80px_rgba(12,10,8,0.3)]"
          >
            <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
              <p className="font-serif text-2xl leading-tight">{copy.detailTitle}</p>
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="shrink-0 rounded-full border border-line/25 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
              >
                {copy.close}
              </button>
            </div>

            <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto px-5 text-[13px] leading-relaxed text-ink/75 sm:px-6">
              {copy.detail.map((item) => (
                <div key={item.name} className="rounded-xl border border-line/12 bg-white/60 p-3.5">
                  <p className="font-bold text-ink">{item.name}</p>
                  <p className="mt-1">
                    <span className="font-semibold text-ink">{copy.whatLabel} : </span>
                    {item.what}
                  </p>
                  <p className="mt-1">
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

            <div className="border-t border-line/12 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
              <ChoiceButtons copy={copy} onChoose={choose} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
