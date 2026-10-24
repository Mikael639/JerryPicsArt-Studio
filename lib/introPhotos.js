import { getPublicPhotos } from "./photoRepository";

// Photo mise en avant pour chaque page (en-tête de page et aperçu du menu), repérée par un morceau de son nom de fichier.
const INTRO_PHOTOS = {
  "/signature": { match: "imane-ayissi-hcw-260126-jpa-45", alt: "Défilé Imane Ayissi, Semaine de la Haute Couture, Paris" },
  "/evenements": { match: "fin-de-passage", alt: "Détail d'une robe blanche brodée de paillettes, Fashion Week de Paris" },
  "/mariage": { match: "detail-bijoux", alt: "Détail d'une robe de mariée, mains et alliance" },
  "/entreprises": { match: "shooting-little-africa-jpa-40", alt: "Portrait dans une boutique, contenu de marque" },
};

// Retourne { "/signature": { src, alt, objectPosition }, ... } ; une page sans photo trouvée est simplement absente.
export async function getIntroPhotos() {
  try {
    const photos = await getPublicPhotos({ limit: 500 });
    const result = {};
    for (const [href, { match, alt }] of Object.entries(INTRO_PHOTOS)) {
      const photo = photos.find((item) => item.src.toLowerCase().includes(match));
      if (photo) result[href] = { src: photo.src, alt, objectPosition: photo.objectPosition || "center center" };
    }
    return result;
  } catch {
    return {};
  }
}
