import { getPublicPhotos } from "./photoRepository";

// Photo mise en avant pour chaque page (en-tête de page et aperçu du menu), repérée par un morceau de son nom de fichier.
const INTRO_PHOTOS = {
  "/signature": { match: "imane-ayissi-hcw-260126-jpa-45", alt: "Défilé Imane Ayissi, Semaine de la Haute Couture, Paris" },
  "/evenements": { match: "fin-de-passage", alt: "Détail d'une robe blanche brodée de paillettes, Fashion Week de Paris" },
  "/mariage": {
    match: "etreinte-en-mouvement",
    alt: "Silhouette d'une mariée devant une fenêtre, en noir et blanc",
    // Dans le menu, une autre photo est affichée.
    menu: { match: "detail-bijoux", alt: "Détail d'une robe de mariée, mains et alliance" },
  },
  "/entreprises": { match: "shooting-little-africa-jpa-40", alt: "Portrait dans une boutique, contenu de marque" },
};

// Retourne { "/signature": { src, alt, objectPosition }, ... } ; une page sans photo trouvée est simplement absente.
// `forMenu` renvoie la photo prévue pour l'aperçu du menu quand elle diffère de celle de la page.
export async function getIntroPhotos({ forMenu = false } = {}) {
  try {
    const photos = await getPublicPhotos({ limit: 500 });
    const result = {};
    for (const [href, entry] of Object.entries(INTRO_PHOTOS)) {
      const { match, alt } = forMenu && entry.menu ? entry.menu : entry;
      const photo = photos.find((item) => item.src.toLowerCase().includes(match));
      if (photo) result[href] = { src: photo.src, alt, objectPosition: photo.objectPosition || "center center" };
    }
    return result;
  } catch {
    return {};
  }
}
