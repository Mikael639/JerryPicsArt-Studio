import { pickSeries } from "../data/series";
import { loadSeries } from "./loadSeries";

const UNIVERS_BY_HREF = {
  "/signature": "signature",
  "/evenements": "evenement",
  "/mariage": "mariage",
  "/entreprises": "entreprise",
};

// Une photo par univers pour l'aperçu du menu (page → { src, alt, objectPosition }).
export async function getMenuPreviews() {
  const all = await loadSeries();
  const previews = {};

  for (const [href, univers] of Object.entries(UNIVERS_BY_HREF)) {
    const photo = pickSeries(all, univers)[0]?.images?.[0];
    if (photo) previews[href] = { src: photo.src, alt: photo.alt || "", objectPosition: photo.objectPosition || "center center" };
  }

  return previews;
}
