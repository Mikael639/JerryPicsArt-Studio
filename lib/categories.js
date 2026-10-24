export const portfolioCategories = [
  "Events",
  "Fashion Week & Celebrities",
  "Studio",
  "Fashion Wedding",
];

export const defaultPortfolioCategory = portfolioCategories[0];

const legacyCategoryMap = {
  Concert: "Events",
  Eglise: "Events",
  "Fashion Week": "Fashion Week & Celebrities",
  Celebrities: "Fashion Week & Celebrities",
  Mariage: "Fashion Wedding",
  Wedding: "Fashion Wedding",
  "Shooting photo": "Studio",
};

export function normalizePortfolioCategory(category) {
  if (!category || typeof category !== "string") return defaultPortfolioCategory;

  const trimmedCategory = category.trim();
  return legacyCategoryMap[trimmedCategory] || trimmedCategory;
}

// Les quatre catégories d'origine ont une page dédiée (Signature, Événements, Mariage, Entreprises).
// Toute autre catégorie ajoutée dans l'administration obtient sa propre page : /collections/<nom>.
export function isBuiltInCategory(category) {
  return portfolioCategories.includes(category);
}

export function slugifyCategory(category) {
  return String(category || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCustomCollections(categories = []) {
  return categories
    .filter((name) => typeof name === "string" && name.trim() && !isBuiltInCategory(name))
    .map((name) => ({ name, slug: slugifyCategory(name) }))
    .filter((collection) => collection.slug);
}
