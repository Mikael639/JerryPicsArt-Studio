import sharp from "sharp";
import { IMAGE_BUCKETS } from "./imageLoader.js";
import { getR2PublicUrl, uploadR2Object } from "./r2Storage.js";

// Tailles d'image fabriquées à la demande, en WebP, et rangées dans R2 sous « _v/<largeur>/<chemin d'origine>.webp ».
// Elles remplacent l'optimiseur d'images de Vercel : la même taille n'est fabriquée qu'une seule fois, pour toujours.
export { IMAGE_BUCKETS };

const SOURCE = /\.(?:jpe?g|png|webp)$/i;

export function isVariantSource(storagePath) {
  const segments = storagePath.split("/");
  return (
    SOURCE.test(storagePath) &&
    segments.every((segment) => segment && segment !== "." && segment !== "..") &&
    segments[0] !== "_v"
  );
}

export function variantPath(storagePath, width) {
  return `_v/${width}/${storagePath}.webp`;
}

function publicUrl(storagePath) {
  return `${getR2PublicUrl()}/${storagePath.split("/").map(encodeURIComponent).join("/")}`;
}

async function download(storagePath) {
  const response = await fetch(publicUrl(storagePath), { cache: "no-store" });
  return response.ok ? Buffer.from(await response.arrayBuffer()) : null;
}

// Renvoie { buffer, created } ; null si la photo d'origine n'existe pas.
export async function ensureVariant(storagePath, width) {
  const existing = await download(variantPath(storagePath, width));
  if (existing) return { buffer: existing, created: false };

  const original = await download(storagePath);
  if (!original) return null;

  const buffer = await sharp(original)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: width <= 960 ? 76 : 80 })
    .toBuffer();

  // Si l'enregistrement échoue, la photo est tout de même servie (elle sera refabriquée à la prochaine demande).
  await uploadR2Object({ storagePath: variantPath(storagePath, width), buffer, contentType: "image/webp" }).catch(() => {});
  return { buffer, created: true };
}
