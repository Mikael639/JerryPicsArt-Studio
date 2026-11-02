import { readSetting, writeSetting } from "./siteSettings";

// Photos de la vitrine choisies depuis l'administration (Photothèque › Vitrine du site) : la photo de chaque carte
// « Ce que je photographie » et la couverture de chaque univers sur l'accueil. Chaque choix garde seulement
// l'adresse de l'image et son texte alternatif : la photo peut venir de la photothèque comme des univers.
// Sans choix, le site garde la sélection automatique.
const KEY = "vitrine_photos";

export const VITRINE_DOORS = ["evenements", "signature", "mariage", "entreprises"];

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

// kind : "doors" ou "covers" ; photo null = retour à la sélection automatique.
export async function setVitrinePhoto(kind, key, photo) {
  if (kind !== "doors" && kind !== "covers") throw new Error("Emplacement inconnu.");
  const current = await getVitrine();
  const next = { ...current, [kind]: { ...current[kind] } };

  if (photo) next[kind][key] = photo;
  else delete next[kind][key];

  const clean = sanitizeVitrine(next);
  if (photo && !clean[kind][key]) throw new Error("Photo invalide.");
  await writeSetting(KEY, clean);
  return clean;
}
