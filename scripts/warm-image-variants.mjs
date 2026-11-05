// Fabrique à l'avance les tailles d'image (480 / 960 / 1600 / 2400 px, WebP) de toutes les photos du site et les range
// dans R2 sous « _v/ », depuis cet ordinateur. Sans cela, chaque taille serait fabriquée la première fois qu'un
// visiteur la demande (la page mettrait un instant de plus à s'afficher).
//
//   node scripts/warm-image-variants.mjs            fabrique ce qui manque
//   node scripts/warm-image-variants.mjs --dry-run  compte seulement les photos et les tailles à fabriquer
//
// Sans risque : n'ajoute que des fichiers sous « _v/ », ne touche ni aux photos d'origine ni à Supabase (lecture seule).
import { UNIVERS_PHOTOS } from "../data/universPhotos.js";

if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = "production";
process.loadEnvFile(".env.local");
const { IMAGE_BUCKETS, ensureVariant, isVariantSource } = await import("../lib/imageVariants.js");
const { isR2Configured, getR2PublicUrl } = await import("../lib/r2Storage.js");

const dryRun = process.argv.includes("--dry-run");
const CONCURRENCY = 4;
const R2_IMAGE = /^https:\/\/[^/]+\.r2\.dev\/(.+\.(?:jpe?g|png|webp))$/i;

if (!isR2Configured()) {
  console.error("R2 n'est pas configuré dans .env.local.");
  process.exit(1);
}

async function supabase(pathAndQuery) {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
    headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
  });
  if (!response.ok) throw new Error(`Supabase : ${response.status} ${await response.text()}`);
  return response.json();
}

const sources = new Set();
const add = (url) => {
  const match = typeof url === "string" ? R2_IMAGE.exec(url) : null;
  if (match) sources.add(decodeURIComponent(match[1]));
};

// Toutes les chaînes d'un réglage (à n'importe quelle profondeur).
const collectStrings = (value) =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(collectStrings) : [];

(await supabase("photos?select=image_url")).forEach((row) => add(row.image_url));
Object.values(UNIVERS_PHOTOS).forEach((photo) => add(photo.src));
// Photos ajoutées ou remplacées depuis l'administration (réglages), et choix de la vitrine : on lit toutes les adresses R2.
for (const row of await supabase("site_settings?select=value")) {
  collectStrings(row.value).forEach(add);
}

const paths = [...sources].filter(isVariantSource);
const jobs = paths.flatMap((storagePath) => IMAGE_BUCKETS.map((width) => ({ storagePath, width })));
console.log(`${paths.length} photos × ${IMAGE_BUCKETS.length} tailles = ${jobs.length} images. Public : ${getR2PublicUrl()}`);
if (dryRun) process.exit(0);

let done = 0;
let created = 0;
let missing = 0;
let failed = 0;
const queue = [...jobs];

async function worker() {
  while (queue.length) {
    const { storagePath, width } = queue.shift();
    try {
      const result = await ensureVariant(storagePath, width);
      if (!result) missing += 1;
      else if (result.created) created += 1;
    } catch (error) {
      failed += 1;
      console.error(`Échec ${width} px ${storagePath} : ${error.message}`);
    }
    done += 1;
    if (done % 100 === 0 || done === jobs.length) console.log(`${done}/${jobs.length} (fabriquées : ${created})`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Terminé : ${created} fabriquées, ${jobs.length - created - missing - failed} déjà présentes, ${missing} photos introuvables, ${failed} échecs.`);
