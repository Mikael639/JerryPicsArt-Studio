import { references as defaultReferences } from "../data/references";
import { stats as defaultStats } from "../data/stats";
import { testimonials as defaultTestimonials } from "../data/testimonials";
import { PRESTATION_OPTIONS, REFERENCE_GROUPS } from "./contentOptions";
import { readSetting, writeSetting } from "./siteSettings";

// Contenus éditables depuis l'administration (avis, chiffres, références, contexte des séries).
// Tant que rien n'est enregistré, les valeurs par défaut du dossier data/ sont utilisées.

const KEYS = {
  testimonials: "content_testimonials",
  stats: "content_stats",
  references: "content_references",
  seriesNotes: "content_series_notes",
};

const MAX_ITEMS = 80;

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function list(value) {
  return Array.isArray(value) ? value.slice(0, MAX_ITEMS) : [];
}

function sanitizeTestimonials(input) {
  const allowed = PRESTATION_OPTIONS.map((option) => option.value);
  return list(input)
    .map((item) => ({
      texte: text(item?.texte, 600),
      auteur: text(item?.auteur, 120),
      prestation: allowed.includes(item?.prestation) ? item.prestation : "evenement",
    }))
    .filter((item) => item.texte && item.auteur);
}

function sanitizeStats(input) {
  return list(input)
    .map((item) => ({
      valeur: Math.max(0, Math.min(1_000_000, Math.round(Number(item?.valeur) || 0))),
      suffixe: text(item?.suffixe, 4),
      libelle: text(item?.libelle, 60),
      precision: text(item?.precision, 80),
    }))
    .filter((item) => item.libelle);
}

function sanitizeReferences(input) {
  const groups = REFERENCE_GROUPS.map((group) => group.value);
  return list(input)
    .map((item) => {
      const groupe = groups.includes(item?.groupe) ? item.groupe : "personnalites";
      return {
        nom: text(item?.nom, 80),
        groupe,
        type: groupe === "mode" ? "maison" : "personnalite",
      };
    })
    .filter((item) => item.nom);
}

function sanitizeSeriesNotes(input) {
  const notes = {};
  if (input && typeof input === "object" && !Array.isArray(input)) {
    for (const [slug, value] of Object.entries(input).slice(0, 200)) {
      const contexte = text(value?.contexte ?? value, 240);
      if (/^[a-z0-9-]{1,80}$/.test(slug) && contexte) notes[slug] = { contexte };
    }
  }
  return notes;
}

const SANITIZERS = {
  testimonials: sanitizeTestimonials,
  stats: sanitizeStats,
  references: sanitizeReferences,
  seriesNotes: sanitizeSeriesNotes,
};

export async function getTestimonials() {
  const stored = await readSetting(KEYS.testimonials);
  return stored === null ? defaultTestimonials : sanitizeTestimonials(stored);
}

export async function getStats() {
  const stored = await readSetting(KEYS.stats);
  return stored === null ? defaultStats : sanitizeStats(stored);
}

export async function getReferences() {
  const stored = await readSetting(KEYS.references);
  return stored === null ? defaultReferences : sanitizeReferences(stored);
}

export async function getSeriesNotes() {
  const stored = await readSetting(KEYS.seriesNotes);
  return sanitizeSeriesNotes(stored);
}

// kind : "testimonials" | "stats" | "references" | "seriesNotes"
export async function updateSiteContent(kind, input) {
  if (!SANITIZERS[kind]) throw new Error("Type de contenu inconnu.");
  const clean = SANITIZERS[kind](input);
  await writeSetting(KEYS[kind], clean);
  return clean;
}
