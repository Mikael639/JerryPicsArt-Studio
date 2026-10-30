"use client";

import { useEffect, useRef } from "react";

// Apparition douce d'une photo quand elle entre à l'écran (même en défilant) : léger fondu et glissement de 18 px.
// Un seul observateur partagé par toutes les photos, et seulement opacity/transform (CSS) : aucun coût de mise en page,
// pas de bibliothèque d'animation. Voir .reveal-photo dans globals.css (désactivé si « réduire les animations »).
let sharedObserver = null;

function getObserver() {
  if (sharedObserver || typeof IntersectionObserver === "undefined") return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-visible", "");
        sharedObserver.unobserve(entry.target);
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
    observer.observe(node);
    return () => observer.unobserve(node);
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
