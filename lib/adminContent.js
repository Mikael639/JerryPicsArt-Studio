import { loadSeries } from "./loadSeries";
import { getReferences, getStats, getTestimonials } from "./siteContent";

// Contenus éditables affichés dans l'administration (avis, chiffres, références, séries).
export async function getAdminContent() {
  const [testimonials, stats, references, series] = await Promise.all([
    getTestimonials(),
    getStats(),
    getReferences(),
    loadSeries(),
  ]);

  return {
    testimonials,
    stats,
    references,
    seriesList: series.map((serie) => ({
      slug: serie.slug,
      titre: serie.titre,
      meta: [serie.saison, serie.lieu].filter(Boolean).join(" · "),
      count: serie.images.length,
      contexte: serie.contexte || "",
    })),
  };
}
