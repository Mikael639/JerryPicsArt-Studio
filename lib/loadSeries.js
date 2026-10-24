import { buildSeries } from "../data/series";
import { getPublicPhotos } from "./photoRepository";
import { getSeriesNotes } from "./siteContent";

// Charge toutes les photos publiées, les regroupe en séries et y ajoute les phrases de contexte
// saisies dans l'administration. Retourne [] si la base est indisponible.
export async function loadSeries() {
  try {
    const [photos, notes] = await Promise.all([getPublicPhotos({ limit: 500 }), getSeriesNotes()]);
    return buildSeries(photos).map((serie) => ({
      ...serie,
      contexte: notes[serie.slug]?.contexte || serie.contexte,
    }));
  } catch {
    return [];
  }
}
