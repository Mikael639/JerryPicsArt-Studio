import { buildSeries } from "../data/series";
import { getPublicPhotos } from "./photoRepository";

// Charge toutes les photos publiées et les regroupe en séries. Retourne [] si la base est indisponible.
export async function loadSeries() {
  try {
    const photos = await getPublicPhotos({ limit: 500 });
    return buildSeries(photos);
  } catch {
    return [];
  }
}
