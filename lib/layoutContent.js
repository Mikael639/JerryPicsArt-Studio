import { readSetting, writeSetting } from "./siteSettings";

// Disposition du site choisie depuis l'administration : ordre des cartes de l'accueil (et celles qui
// s'affichent) et ordre des univers sur Signature, Événements et Entreprises. Stockée à part des contenus
// (content_univers) : enregistrer une mise en page ne touche jamais aux textes ni aux photos.
const KEY = "layout_order";
const MAX_SLUGS = 40;

export const LAYOUT_PAGES = ["signature", "evenements", "entreprises"];

// Cartes « Ce que je photographie » de l'accueil, dans l'ordre et la visibilité par défaut.
export const DEFAULT_DOORS = [
  { id: "evenements", visible: true },
  { id: "signature", visible: true },
  { id: "mariage", visible: true },
  { id: "entreprises", visible: false },
];

// Ordre des univers tant que l'administration n'en a pas enregistré un autre pour la page. Signature : Éditorial,
// puis Défilés & haute couture, puis Personnalités ; les autres univers suivent dans leur ordre d'origine.
const DEFAULT_UNIVERS_ORDER = { signature: ["editorial", "defiles", "personnalites"] };

// Réordonne `items` (déjà dans l'ordre par défaut) selon `savedOrder`, la liste des identifiants enregistrée
// par l'administration. `getKey(item)` donne l'identifiant d'un élément.
// Cas à traiter : un identifiant enregistré qui n'existe plus (univers supprimé), et un élément absent de
// la liste enregistrée (univers ajouté depuis l'enregistrement). Ne modifie pas `items`.
export function applyOrder(items, savedOrder, getKey) {
  if (!Array.isArray(savedOrder) || !savedOrder.length) return items;

  // Identifiant enregistré qui n'existe plus : sans effet (il n'a pas d'élément à placer).
  // Élément absent de la liste enregistrée : placé à la fin, dans son ordre par défaut (le tri est stable).
  const position = new Map(savedOrder.map((key, index) => [key, index]));
  const unknown = savedOrder.length;
  return [...items].sort((a, b) => (position.get(getKey(a)) ?? unknown) - (position.get(getKey(b)) ?? unknown));
}

function sanitizeDoors(value) {
  const known = new Map(DEFAULT_DOORS.map((door) => [door.id, door]));
  const seen = new Set();
  const doors = [];

  for (const item of Array.isArray(value) ? value : []) {
    if (!known.has(item?.id) || seen.has(item.id)) continue;
    seen.add(item.id);
    doors.push({ id: item.id, visible: item.visible !== false });
  }

  // Une carte absente de l'enregistrement garde sa visibilité par défaut, à la suite des autres.
  for (const door of DEFAULT_DOORS) {
    if (!seen.has(door.id)) doors.push({ ...door });
  }

  return doors;
}

function sanitizeUnivers(value) {
  const out = {};
  for (const page of LAYOUT_PAGES) {
    const list = Array.isArray(value?.[page]) ? value[page] : [];
    const slugs = list.filter((slug) => typeof slug === "string" && /^[a-z0-9-]{1,80}$/.test(slug));
    if (slugs.length) out[page] = [...new Set(slugs)].slice(0, MAX_SLUGS);
  }
  return out;
}

export function sanitizeLayout(input) {
  return { doors: sanitizeDoors(input?.doors), univers: { ...DEFAULT_UNIVERS_ORDER, ...sanitizeUnivers(input?.univers) } };
}

// Disposition enregistrée, ou celle par défaut si rien n'est réglé ou si la base est indisponible.
export async function getLayout() {
  try {
    return sanitizeLayout(await readSetting(KEY));
  } catch {
    return sanitizeLayout(null);
  }
}

// Les parties absentes du patch restent inchangées.
export async function updateLayout(patch) {
  const current = await getLayout();
  const next = sanitizeLayout({
    doors: patch?.doors ?? current.doors,
    univers: { ...current.univers, ...(patch?.univers || {}) },
  });
  await writeSetting(KEY, next);
  return next;
}
