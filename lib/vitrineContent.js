import { readSetting, writeSetting } from "./siteSettings";

// Photos de la vitrine choisies depuis l'administration (Photothèque › Vitrine du site) : la photo de chaque carte
// « Ce que je photographie » et la couverture de chaque univers sur l'accueil. Chaque choix garde seulement
// l'adresse de l'image et son texte alternatif : la photo peut venir de la photothèque comme des univers.
// Sans choix, le site garde la sélection automatique.
const KEY = "vitrine_photos";

export const VITRINE_DOORS = ["evenements", "signature", "mariage", "entreprises"];
// Pages à photo d'en-tête : « intro » (à droite du titre) et « menu » (aperçu du menu). Clé enregistrée : « page:emplacement ».
export const VITRINE_PAGES = ["signature", "evenements", "mariage", "entreprises"];
export const VITRINE_PAGE_SLOTS = ["intro", "menu"];

function sanitizePhoto(value) {
  const src = typeof value?.src === "string" ? value.src.trim() : "";
  if (!src || src.length > 500 || !(src.startsWith("https://") || src.startsWith("/"))) return null;
  const alt = typeof value?.alt === "string" ? value.alt.trim().slice(0, 200) : "";
  return { src, alt };
}

function sanitizeGroup(value, isValidKey) {
  const out = {};
  for (const [key, photo] of Object.entries(value && typeof value === "object" ? value : {})) {
    const clean = isValidKey(key) ? sanitizePhoto(photo) : null;
    if (clean) out[key] = clean;
  }
  return out;
}

export function sanitizeVitrine(input) {
  return {
    doors: sanitizeGroup(input?.doors, (key) => VITRINE_DOORS.includes(key)),
    covers: sanitizeGroup(input?.covers, (key) => /^[a-z0-9-]{1,80}$/.test(key)),
    pages: sanitizeGroup(input?.pages, (key) => {
      const [page, slot, extra] = key.split(":");
      return !extra && VITRINE_PAGES.includes(page) && VITRINE_PAGE_SLOTS.includes(slot);
    }),
  };
}

// Choix enregistrés, ou aucun choix si rien n'est réglé ou si la base est indisponible.
export async function getVitrine() {
  try {
    return sanitizeVitrine(await readSetting(KEY));
  } catch {
    return sanitizeVitrine(null);
  }
}

// kind : "doors", "covers" ou "pages" ; photo null = retour à la sélection automatique.
export async function setVitrinePhoto(kind, key, photo) {
  if (kind !== "doors" && kind !== "covers" && kind !== "pages") throw new Error("Emplacement inconnu.");
  const current = await getVitrine();
  const next = { ...current, [kind]: { ...current[kind] } };

  if (photo) next[kind][key] = photo;
  else delete next[kind][key];

  const clean = sanitizeVitrine(next);
  if (photo && !clean[kind][key]) throw new Error("Photo invalide.");
  await writeSetting(KEY, clean);
  return clean;
}
