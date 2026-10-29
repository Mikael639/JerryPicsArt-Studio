// Import des photos des univers (annexe A du brief) : Google Drive → 2 400 px → Cloudflare R2.
//
//   node scripts/import-univers.mjs              télécharge, redimensionne et envoie sur R2
//   node scripts/import-univers.mjs --no-upload  télécharge et redimensionne seulement (vérification)
//
// Source : scripts/univers.json (fichiers partagés « avec le lien » dans le Drive de Jerry).
// Les versions redimensionnées sont gardées dans .cache/univers (relancer le script ne retélécharge rien).
// Résultat : data/universPhotos.js (adresse publique et dimensions de chaque photo, par identifiant Drive).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "scripts/univers.json";
const OUTPUT = "data/universPhotos.js";
const CACHE_DIR = ".cache/univers";
const MAX_SIDE = 2400;
const CONCURRENCY = 4;
const upload = !process.argv.includes("--no-upload");

if (fs.existsSync(".env.local")) process.loadEnvFile(".env.local");
const { isR2Configured, uploadR2Object } = await import("../lib/r2Storage.js");

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\.[a-z]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readManifest() {
  if (!fs.existsSync(OUTPUT)) return {};
  const match = fs.readFileSync(OUTPUT, "utf8").match(/=\s*(\{[\s\S]*\});/);
  return match ? JSON.parse(match[1]) : {};
}

function writeManifest(manifest) {
  const body = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(
    OUTPUT,
    `// Fichier généré par scripts/import-univers.mjs : ne pas modifier à la main.\n` +
      `// Identifiant Drive → adresse publique R2 et dimensions de la photo redimensionnée.\n` +
      `export const UNIVERS_PHOTOS = ${body};\n`
  );
}

async function downloadResized(driveId) {
  const cached = path.join(CACHE_DIR, `${driveId}.jpg`);
  if (fs.existsSync(cached)) return fs.readFileSync(cached);

  const response = await fetch(`https://drive.usercontent.google.com/download?id=${driveId}&export=download`);
  const type = response.headers.get("content-type") || "";
  if (!response.ok || !type.startsWith("image/")) {
    throw new Error(`Drive a répondu ${response.status} (${type}) : fichier non partagé avec le lien ?`);
  }

  const original = Buffer.from(await response.arrayBuffer());
  const resized = await sharp(original)
    .rotate()
    .resize(MAX_SIDE, MAX_SIDE, { fit: "inside", withoutEnlargement: true })
    .withIccProfile("srgb")
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  fs.writeFileSync(cached, resized);
  return resized;
}

async function main() {
  if (upload && !isR2Configured()) throw new Error("R2 n'est pas configuré (.env.local).");
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const univers = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const jobs = univers.flatMap((item) =>
    item.photos.map((photo, index) => ({
      ...photo,
      storagePath: `univers/${item.slug}/${String(index + 1).padStart(2, "0")}-${slugify(photo.fichier)}.jpg`,
    }))
  );

  const manifest = readManifest();
  let done = 0;
  const failures = [];

  async function run(job) {
    try {
      const buffer = await downloadResized(job.driveId);
      const { width, height } = await sharp(buffer).metadata();
      const entry = { ...manifest[job.driveId], width, height };

      if (upload && entry.storagePath !== job.storagePath) {
        const { publicUrl } = await uploadR2Object({ storagePath: job.storagePath, buffer, contentType: "image/jpeg" });
        entry.src = publicUrl;
        entry.storagePath = job.storagePath;
      }

      manifest[job.driveId] = entry;
      done += 1;
      console.log(`${done}/${jobs.length}  ${width}×${height}  ${(buffer.length / 1024).toFixed(0)} Ko  ${job.fichier}`);
    } catch (error) {
      failures.push(`${job.fichier} (${job.driveId}) : ${error.message}`);
      console.error(`ÉCHEC  ${job.fichier} : ${error.message}`);
    }
  }

  const queue = [...jobs];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) await run(queue.shift());
    })
  );

  writeManifest(manifest);
  console.log(`\n${done} photo(s) traitée(s), ${failures.length} échec(s). Manifeste : ${OUTPUT}`);
  if (failures.length) {
    console.log(failures.join("\n"));
    process.exitCode = 1;
  }
}

await main();
