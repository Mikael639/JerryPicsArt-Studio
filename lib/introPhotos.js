import { getPublicPhotos } from "./photoRepository";
import { getVitrine } from "./vitrineContent";

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
// Une photo choisie dans l'administration (Vitrine du site › Pages du site) remplace la sélection automatique ;
// `ignoreChoices` donne la sélection automatique seule (pour l'afficher dans l'administration).
export async function getIntroPhotos({ forMenu = false, ignoreChoices = false } = {}) {
  try {
    const [photos, vitrine] = await Promise.all([
      getPublicPhotos({ limit: 500 }),
      ignoreChoices ? { pages: {} } : getVitrine(),
    ]);
    const result = {};
    for (const [href, entry] of Object.entries(INTRO_PHOTOS)) {
      const chosen = vitrine.pages[`${href.slice(1)}:${forMenu ? "menu" : "intro"}`];
      if (chosen) {
        result[href] = { src: chosen.src, alt: chosen.alt || entry.alt, objectPosition: "center center" };
        continue;
      }
      const { match, alt } = forMenu && entry.menu ? entry.menu : entry;
      const photo = photos.find((item) => item.src.toLowerCase().includes(match));
      if (photo) result[href] = { src: photo.src, alt, objectPosition: photo.objectPosition || "center center" };
    }
    return result;
  } catch {
    return {};
  }
}
