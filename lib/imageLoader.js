// Chargeur d'images du site (next.config.mjs › images.loaderFile) : à la place de l'optimiseur de Vercel (limité à
// 5 000 transformations par mois), les photos de R2 sont servies en quelques tailles fixes, fabriquées une fois
// puis gardées dans R2 (voir lib/imageVariants.js et app/media). Ce fichier tourne aussi dans le navigateur :
// rien d'autre qu'un calcul d'adresse.
export const IMAGE_BUCKETS = [480, 960, 1600, 2400];

const R2_IMAGE = /^https:\/\/[^/]+\.r2\.dev\/(.+\.(?:jpe?g|png|webp))$/i;

// Plus petite taille fabriquée qui couvre la largeur demandée (la plus grande au-delà).
export function pickBucket(width) {
  return IMAGE_BUCKETS.find((bucket) => bucket >= width) || IMAGE_BUCKETS[IMAGE_BUCKETS.length - 1];
}

export default function imageLoader({ src, width }) {
  const match = R2_IMAGE.exec(src);
  // Images locales (public/) et autres adresses : servies telles quelles.
  if (!match) return src;
  return `/media/${pickBucket(width)}/${match[1]}`;
}
