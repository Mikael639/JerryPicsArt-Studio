import { enhancePhotoPresentation } from "../lib/photoPresentation";

// Regroupement des photos existantes en séries, à partir du titre des fichiers.
// HCW = Haute Couture Week, PFW = Paris Fashion Week, le nombre qui suit est une date AAMMJJ.
// `contexte` vide = [À FOURNIR : une phrase de contexte par série].

const UNIVERS_BY_CATEGORY = {
  "Fashion Week & Celebrities": "signature",
  Events: "evenement",
  "Fashion Wedding": "mariage",
  Studio: "entreprise",
};

const SERIES_META = [
  { match: /^hcw 260128 elie saab/, slug: "elie-saab-haute-couture", titre: "Défilé Elie Saab, Haute Couture", saison: "Haute Couture, 28 janvier 2026", lieu: "Paris", date: 20260128, priority: true, alt: "Invités au défilé Elie Saab, Semaine de la Haute Couture, Paris" },
  { match: /^imane ayissi hcw 260126/, slug: "imane-ayissi-haute-couture", titre: "Défilé Imane Ayissi, Haute Couture", saison: "Haute Couture, 26 janvier 2026", lieu: "Paris", date: 20260126, alt: "Invités au défilé Imane Ayissi, Semaine de la Haute Couture, Paris" },
  { match: /^hcw 260127/, slug: "haute-couture-27-janvier-2026", titre: "Semaine de la Haute Couture", saison: "27 janvier 2026", lieu: "Paris", date: 20260127, alt: "Invités de la Semaine de la Haute Couture, Paris" },
  { match: /^hcw 260126/, slug: "haute-couture-26-janvier-2026", titre: "Semaine de la Haute Couture", saison: "26 janvier 2026", lieu: "Paris", date: 20260126, alt: "Invités de la Semaine de la Haute Couture, Paris" },
  { match: /^pfw 260306/, slug: "pfw-mars-2026", titre: "Paris Fashion Week, mars 2026", saison: "6 mars 2026", lieu: "Paris", date: 20260306, alt: "Invités de la Paris Fashion Week, mars 2026" },
  { match: /^pfw 290925/, slug: "pfw-septembre-2025", titre: "Paris Fashion Week, septembre 2025", saison: "29 septembre 2025", lieu: "Paris", date: 20250929, alt: "Invités de la Paris Fashion Week, septembre 2025" },
  { match: /^pfw 011025/, slug: "pfw-octobre-2025", titre: "Paris Fashion Week, octobre 2025", saison: "1er octobre 2025", lieu: "Paris", date: 20251001, alt: "Invités de la Paris Fashion Week, octobre 2025" },
  { match: /^pfw 061025/, slug: "pfw-6-octobre-2025", titre: "Paris Fashion Week, octobre 2025", saison: "6 octobre 2025", lieu: "Paris", date: 20251006, alt: "Invités de la Paris Fashion Week, octobre 2025" },
  { match: /^pfw 060325/, slug: "pfw-mars-2025", titre: "Paris Fashion Week, mars 2025", saison: "6 mars 2025", lieu: "Paris", date: 20250306, alt: "Invités de la Paris Fashion Week, mars 2025" },
  { match: /^pfw lemaire/, slug: "lemaire", titre: "Défilé Lemaire, Paris Fashion Week", lieu: "Paris", alt: "Invités au défilé Lemaire, Paris Fashion Week" },
  { match: /^pfw celebrites/, slug: "pfw-celebrites", titre: "Paris Fashion Week, célébrités", lieu: "Paris", alt: "Personnalité photographiée pendant la Paris Fashion Week" },
  { match: /^amiri guest/, slug: "amiri", titre: "Invités du défilé Amiri", lieu: "Paris", priority: true, alt: "Invités au défilé Amiri, Paris" },
  { match: /^michael rainey jr/, slug: "michael-rainey-jr", titre: "Michael Rainey Jr.", lieu: "Paris", priority: true, alt: "Michael Rainey Jr. photographié à Paris" },
  { match: /^djany flammes 2026/, slug: "les-flammes-2026", titre: "Les Flammes 2026", saison: "2026", priority: true, alt: "Invités de la cérémonie Les Flammes 2026" },
  { match: /^flammes 2025/, slug: "les-flammes-2025", titre: "Les Flammes 2025", saison: "2025", priority: true, alt: "Invités de la cérémonie Les Flammes 2025" },
  { match: /^joya l avant premiere/, slug: "joya-l-avant-premiere", titre: "Avant-première Joya L", priority: true, alt: "Invités de l'avant-première Joya L, Paris" },
  { match: /^djany lawson paris/, slug: "djany-lawson-paris", titre: "Djany Lawson à Paris", lieu: "Paris", alt: "Invités d'une soirée Djany Lawson, Paris" },
  { match: /^d in paris/, slug: "d-in-paris", titre: "D in Paris", lieu: "Paris", alt: "Invités de l'événement D in Paris" },
  { match: /^event$/, slug: "soirees-a-paris", titre: "Soirées à Paris", lieu: "Paris", alt: "Invités lors d'une soirée privée à Paris" },
];

const IGNORED_KEYS = /^(whatsapp image|image|img|test|$)/;

const ACCENT_FIXES = [
  [/\bModele\b/g, "Modèle"],
  [/\bmodele\b/g, "modèle"],
  [/\beditoriale\b/g, "éditoriale"],
  [/\beditorial\b/g, "éditorial"],
  [/\bmaries\b/g, "mariés"],
  [/\bmariee\b/g, "mariée"],
  [/\bceremonie\b/g, "cérémonie"],
  [/\bfacade\b/g, "façade"],
  [/\breception\b/g, "réception"],
  [/\bpreparation\b/g, "préparation"],
  [/\bdefile\b/g, "défilé"],
  [/\bcapturee\b/g, "capturée"],
  [/\bentree\b/g, "entrée"],
  [/\bcelebrites\b/gi, "célébrités"],
  [/\bd ensemble\b/g, "d'ensemble"],
  [/\bd un\b/g, "d'un"],
  [/\bd une\b/g, "d'une"],
];

function stripDiacritics(value) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function normalizeKey(title) {
  const base = stripDiacritics(String(title || ""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/original copy/, "");
  // Après « JPA », le nombre est un numéro de photo ; sinon un éventuel numéro final est retiré.
  const hasPhotoNumber = /jpa/.test(base);
  const key = hasPhotoNumber ? base.replace(/jpa.*$/, "") : base.replace(/\d+\s*$/, "");
  return key.replace(/\s+/g, " ").replace(/^(amiri guests?)$/, "amiri guest").trim();
}

function cleanTitle(title) {
  return String(title || "").replace(/\s*JPA.*$/i, "").replace(/\s+\d+$/, "").replace(/\s+/g, " ").trim();
}

function fixAccents(text) {
  return ACCENT_FIXES.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);
}

function looksLikeFilename(alt) {
  return !alt || /\bJPA\b/i.test(alt) || /\d{3,}/.test(alt) || /^(event|studio|image|img)\b/i.test(alt) || alt.length < 14;
}

function isGenericAlt(alt) {
  return /^photographie (editoriale|de mariage)/i.test(stripDiacritics(alt));
}

function getMeta(key) {
  return SERIES_META.find((meta) => meta.match.test(key));
}

// Texte alternatif : [sujet] + [contexte] + [lieu ou événement], en français, sans « JPA » ni numéro.
function buildAlt(photo, serie) {
  const existing = String(photo.alt || "");
  if (looksLikeFilename(existing) || isGenericAlt(existing)) return serie.altBase;
  return fixAccents(existing).replace(/\s+/g, " ").trim();
}

export function buildSeries(rawPhotos, { minImages = 3 } = {}) {
  const groups = new Map();

  for (const rawPhoto of rawPhotos) {
    const photo = enhancePhotoPresentation(rawPhoto);
    const univers = UNIVERS_BY_CATEGORY[photo.category] || "evenement";
    const key = normalizeKey(photo.title);
    if (IGNORED_KEYS.test(key) && univers !== "mariage" && univers !== "entreprise") continue;

    const meta = getMeta(key);
    const groupKey = univers === "mariage" ? "mariage" : univers === "entreprise" ? "studio" : meta?.slug || key;
    const group = groups.get(groupKey) || { key: groupKey, meta, photos: [], universCount: {} };
    group.photos.push(photo);
    group.universCount[univers] = (group.universCount[univers] || 0) + 1;
    groups.set(groupKey, group);
  }

  const series = [];
  for (const group of groups.values()) {
    if (group.photos.length < minImages) continue;

    const univers = Object.entries(group.universCount).sort((a, b) => b[1] - a[1])[0][0];
    const meta = group.meta;
    const isWedding = univers === "mariage";
    const isStudio = univers === "entreprise";
    const titre =
      meta?.titre ||
      (isWedding ? "Sélection de mariages" : isStudio ? "Portrait et contenu de marque" : cleanTitle(group.photos[0].title));
    const altBase =
      meta?.alt ||
      (isWedding
        ? "Mariés photographiés lors d'un mariage à Paris"
        : isStudio
        ? "Portrait en studio, contenu de marque"
        : `${cleanTitle(group.photos[0].title)}, Paris`);

    const base = {
      slug: meta?.slug || (isWedding ? "mariages" : isStudio ? "studio" : group.key.replace(/\s+/g, "-")),
      titre,
      univers,
      saison: meta?.saison,
      lieu: meta?.lieu,
      contexte: "",
      date: meta?.date || 0,
      priority: Boolean(meta?.priority),
      altBase,
    };

    series.push({
      ...base,
      images: group.photos.map((photo) => ({
        id: photo.id,
        src: photo.src,
        alt: buildAlt(photo, base),
        title: titre,
        objectPosition: photo.objectPosition,
      })),
    });
  }

  return series;
}

export function sortSeries(series) {
  return [...series].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority ? -1 : 1;
    if (a.date !== b.date) return b.date - a.date;
    return b.images.length - a.images.length;
  });
}

// Séries d'un ou plusieurs univers, dans l'ordre d'affichage.
export function pickSeries(allSeries, universes, limit) {
  const wanted = Array.isArray(universes) ? universes : [universes];
  const sorted = sortSeries(allSeries.filter((serie) => wanted.includes(serie.univers)));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function findSeriesBySlugs(allSeries, slugs) {
  return slugs.map((slug) => allSeries.find((serie) => serie.slug === slug)).filter(Boolean);
}
