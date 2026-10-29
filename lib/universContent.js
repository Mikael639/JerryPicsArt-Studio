import { readSetting, writeSetting } from "./siteSettings";

// Modifications des univers faites depuis l'administration : textes, ordre des photos,
// photos masquées, couverture choisie, textes alternatifs. Stockées à part de data/univers.js,
// qui reste la base importée depuis le Drive (scripts/import-univers.mjs).
const KEY = "content_univers";
const MAX_UNIVERS = 40;
const MAX_PHOTOS = 200;

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function textList(value, max) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string").slice(0, max) : [];
}

// Photos ajoutées depuis l'administration (envoi direct) : adresse publique R2, dimensions, texte alternatif.
function sanitizeAdded(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      id: text(item?.id, 80),
      src: text(item?.src, 500),
      storagePath: text(item?.storagePath, 300),
      width: Math.max(0, Math.min(10000, Math.round(Number(item?.width) || 0))),
      height: Math.max(0, Math.min(10000, Math.round(Number(item?.height) || 0))),
      alt: text(item?.alt, 160),
      caption: text(item?.caption, 120),
    }))
    .filter((item) => /^up-[a-z0-9-]{6,60}$/.test(item.id) && /^https:\/\//.test(item.src))
    .slice(0, MAX_PHOTOS);
}

function sanitizeOverride(value) {
  const titre = text(value?.titre, 100);
  const credits = text(value?.credits, 160);
  const contexte = text(value?.contexte, 320);
  const cover = text(value?.cover, 80);
  const hidden = textList(value?.hidden, MAX_PHOTOS);
  const order = textList(value?.order, MAX_PHOTOS);

  const alt = {};
  if (value?.alt && typeof value.alt === "object" && !Array.isArray(value.alt)) {
    for (const [id, altText] of Object.entries(value.alt).slice(0, MAX_PHOTOS)) {
      const clean = text(altText, 160);
      if (typeof id === "string" && clean) alt[id] = clean;
    }
  }

  const added = sanitizeAdded(value?.added);

  const out = {};
  if (added.length) out.added = added;
  if (titre) out.titre = titre;
  if (credits) out.credits = credits;
  if (contexte) out.contexte = contexte;
  if (cover) out.cover = cover;
  if (hidden.length) out.hidden = hidden;
  if (order.length) out.order = order;
  if (Object.keys(alt).length) out.alt = alt;
  return out;
}

function sanitizeOverrides(input) {
  const overrides = {};
  if (input && typeof input === "object" && !Array.isArray(input)) {
    for (const [slug, value] of Object.entries(input).slice(0, MAX_UNIVERS)) {
      if (!/^[a-z0-9-]{1,80}$/.test(slug)) continue;
      const clean = sanitizeOverride(value);
      if (Object.keys(clean).length) overrides[slug] = clean;
    }
  }
  return overrides;
}

// Toutes les modifications, par identifiant d'univers.
export async function getUniversOverrides() {
  const stored = await readSetting(KEY);
  return sanitizeOverrides(stored);
}

// Modifie un univers : les champs absents du patch restent inchangés, un champ vide l'efface
// (revient à la valeur de data/univers.js). Les patches successifs ne s'écrasent jamais entre eux
// (un enregistrement des textes ne touche pas l'ordre des photos, et inversement).
export async function updateUniversOverride(slug, patch) {
  if (!/^[a-z0-9-]{1,80}$/.test(String(slug || ""))) {
    throw new Error("Univers inconnu.");
  }

  const overrides = await getUniversOverrides();
  const merged = sanitizeOverride({ ...overrides[slug], ...patch });
  const next = { ...overrides };

  if (Object.keys(merged).length) {
    next[slug] = merged;
  } else {
    delete next[slug];
  }

  await writeSetting(KEY, next);
  return next[slug] || {};
}
