"use client";

import { useEffect, useRef } from "react";

// Apparition douce d'une photo quand elle entre à l'écran (même en défilant) : léger fondu et glissement de 18 px.
// Un seul observateur partagé par toutes les photos, et seulement opacity/transform (CSS) : aucun coût de mise en page,
// pas de bibliothèque d'animation. Voir .reveal-photo dans globals.css (désactivé si « réduire les animations »).
//
// Filet de sécurité : si l'observateur rate une photo (défilement très rapide, colonnes CSS), un contrôle après
// chaque défilement révèle toute photo déjà visible à l'écran. Une photo ne reste jamais invisible.
let sharedObserver = null;
const pending = new Set();
let checkTimer = 0;
let listening = false;

function reveal(node) {
  node.setAttribute("data-visible", "");
  pending.delete(node);
  sharedObserver?.unobserve(node);
}

function revealVisibleNow() {
  const viewportHeight = window.innerHeight;
  for (const node of pending) {
    const rect = node.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < viewportHeight * 0.96) reveal(node);
  }
}

function scheduleCheck() {
  window.clearTimeout(checkTimer);
  checkTimer = window.setTimeout(revealVisibleNow, 250);
}

function getObserver() {
  if (sharedObserver || typeof IntersectionObserver === "undefined") return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );
  return sharedObserver;
}

export default function RevealOnView({ as = "div", delay = 0, className = "", children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const observer = getObserver();
    if (!node) return undefined;
    if (!observer) {
      node.setAttribute("data-visible", "");
      return undefined;
    }

    pending.add(node);
    observer.observe(node);
    if (!listening) {
      listening = true;
      window.addEventListener("scroll", scheduleCheck, { passive: true });
    }
    scheduleCheck();

    return () => {
      pending.delete(node);
      observer.unobserve(node);
    };
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={`reveal-photo ${className}`}
      style={delay ? { "--reveal-delay": `${delay}s` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
