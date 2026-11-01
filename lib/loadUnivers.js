import { getUniversList, PAGE_PATHS, withUniversOverrides } from "../data/univers";
import { applyOrder, getLayout } from "./layoutContent";
import { getUniversOverrides } from "./universContent";

// Univers d'une page, modifications de l'administration appliquées (textes, ordre, photos
// masquées, couverture, textes alternatifs). Retourne [] si Supabase est indisponible :
// les univers s'affichent alors tels qu'importés du Drive (data/univers.js).
export async function loadUniversForPage(page) {
  let overrides = {};
  try {
    overrides = await getUniversOverrides();
  } catch {
    overrides = {};
  }

  const layout = await getLayout();
  const univers = withUniversOverrides(getUniversList(), overrides).filter(
    (item) => item.page === page && item.images.length
  );

  return applyOrder(univers, layout.univers[page], (item) => item.slug);
}

// Accueil : une couverture par univers, modifications de l'administration appliquées.
export async function loadUniversCovers() {
  let overrides = {};
  try {
    overrides = await getUniversOverrides();
  } catch {
    overrides = {};
  }

  return withUniversOverrides(getUniversList(), overrides)
    .filter((univers) => univers.couverture)
    .map((univers) => ({
      slug: univers.slug,
      href: `${PAGE_PATHS[univers.page]}#${univers.slug}`,
      titre: univers.titre,
      cover: univers.couverture,
    }));
}
