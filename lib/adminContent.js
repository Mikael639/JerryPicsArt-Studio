import { loadSeries } from "./loadSeries";
import { getClients, getReferences, getStats, getTestimonials } from "./siteContent";
import { getUniversList } from "../data/univers";
import { applyOrder, getLayout, LAYOUT_PAGES } from "./layoutContent";
import { getUniversOverrides } from "./universContent";

// Contrairement à applyUniversOverride (lib/loadUnivers.js, pages du site), l'administration doit
// voir les photos masquées pour pouvoir les réafficher : elles restent dans la liste, marquées `hidden`.
function toAdminImage(item) {
  return { id: item.id, src: item.src, alt: item.alt || "", caption: item.caption || "", added: true };
}

function buildAdminUnivers(univers, override) {
  const hiddenIds = new Set(override?.hidden || []);
  const orderIndex = new Map((override?.order || []).map((id, index) => [id, index]));

  const removedIds = new Set(override?.removed || []);
  const replaced = override?.replaced || {};
  const imported = univers.images
    .filter((image) => !removedIds.has(image.id))
    .map((image) => {
      const replacement = replaced[image.id];
      return replacement ? { ...image, src: replacement.src, imported: true } : { ...image, imported: true };
    });

  const images = [...imported, ...(override?.added || []).map(toAdminImage)]
    .sort((a, b) => {
      const indexA = orderIndex.has(a.id) ? orderIndex.get(a.id) : Infinity;
      const indexB = orderIndex.has(b.id) ? orderIndex.get(b.id) : Infinity;
      return indexA - indexB;
    })
    .map((image) => ({
      ...image,
      alt: override?.alt?.[image.id] || image.alt,
      hidden: hiddenIds.has(image.id),
    }));

  const cover =
    override?.cover || univers.couverture?.id || images.find((image) => !image.hidden)?.id || images[0]?.id || "";

  return {
    slug: univers.slug,
    page: univers.page,
    titre: override?.titre || univers.titre.fr,
    credits: override?.credits || univers.credits,
    contexte: override?.contexte || univers.contexte.fr,
    cover,
    images,
  };
}

// Contenus éditables affichés dans l'administration (avis, chiffres, références, séries, univers).
export async function getAdminContent() {
  const [testimonials, stats, references, series, universOverrides, clients, layout] = await Promise.all([
    getTestimonials(),
    getStats(),
    getReferences(),
    loadSeries(),
    getUniversOverrides(),
    getClients(),
    getLayout(),
  ]);

  const allUnivers = getUniversList().map((univers) => buildAdminUnivers(univers, universOverrides[univers.slug]));
  // Chaque page dans l'ordre choisi par l'administration, les autres univers à la suite.
  const universList = [
    ...LAYOUT_PAGES.flatMap((page) =>
      applyOrder(
        allUnivers.filter((univers) => univers.page === page),
        layout.univers[page],
        (univers) => univers.slug
      )
    ),
    ...allUnivers.filter((univers) => !LAYOUT_PAGES.includes(univers.page)),
  ];

  return {
    testimonials,
    stats,
    references,
    clients,
    // Signature, Événements et Entreprises reposent sur les univers : seules les séries de Mariage et des collections restent à décrire.
    seriesList: series
      .filter((serie) => serie.univers === "mariage" || serie.univers === "collection")
      .map((serie) => ({
      slug: serie.slug,
      titre: serie.titre,
      meta: [serie.saison, serie.lieu].filter(Boolean).join(" · "),
      count: serie.images.length,
      contexte: serie.contexte || "",
    })),
    universList,
    layout,
  };
}
