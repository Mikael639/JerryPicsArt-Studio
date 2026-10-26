"use client";

import { useSyncExternalStore } from "react";

// Tablette tactile (pointeur principal = doigt, écran d'au moins 768 px), quelle que soit sa taille :
// les effets lourds (flous animés, masques qui s'ouvrent, parallaxe) y sont remplacés par de simples fondus.
// Une tablette de 13 pouces affiche des photos de plus de 2800 px de large : ces effets y saccadent.
const QUERY = "(pointer: coarse) and (min-width: 768px)";

function subscribe(onChange) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// Côté serveur : faux (le HTML est le même pour tous). Sur tablette, le navigateur bascule au premier rendu.
export function useCalmMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
