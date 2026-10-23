import { portfolioCategories } from "./categories";

// Domaine final à venir : jerrypicsart.vercel.app en attendant (surchargé par NEXT_PUBLIC_SITE_URL).
const DEFAULT_SITE_URL = "https://jerrypicsart.vercel.app";

function normalizeUrl(value) {
  if (!value || typeof value !== "string") return null;

  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  try {
    return new URL(trimmedValue).toString().replace(/\/$/, "");
  } catch {
    try {
      return new URL(`https://${trimmedValue}`).toString().replace(/\/$/, "");
    } catch {
      return null;
    }
  }
}

export function getSiteUrl() {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    DEFAULT_SITE_URL
  );
}

export function toAbsoluteUrl(pathname = "/") {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}

export const siteConfig = {
  name: "JerryPicsArt",
  shortName: "JerryPicsArt",
  defaultTitle: "JerryPicsArt | Photographe éditorial à Paris, mariages et événements",
  description:
    "Photographe éditorial à Paris : Fashion Week, mariages haut de gamme et événements d'entreprise. Un accompagnement de A à Z.",
  locale: "fr_FR",
  email: "jerrypicsart@gmail.com",
  legalName: "Luc Jerry Matat",
  navigation: [
    { href: "/", label: "Accueil" },
    { href: "/signature", label: "Signature" },
    { href: "/evenements", label: "Événements" },
    { href: "/mariage", label: "Mariage" },
    { href: "/entreprises", label: "Entreprises & lieux" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ],
  socialLinks: [
    {
      name: "Instagram",
      handle: "@jerrypicsart",
      href: "https://www.instagram.com/jerrypicsart/",
    },
    {
      name: "LinkedIn",
      handle: "Luc Jerry Matat",
      href: "https://www.linkedin.com/in/luc-jerry-matat",
    },
  ],
  categoryLabels: portfolioCategories,
};

export const sitePages = [
  { href: "/", changeFrequency: "weekly", priority: 1 },
  { href: "/signature", changeFrequency: "weekly", priority: 0.9 },
  { href: "/evenements", changeFrequency: "monthly", priority: 0.9 },
  { href: "/mariage", changeFrequency: "monthly", priority: 0.9 },
  { href: "/entreprises", changeFrequency: "monthly", priority: 0.8 },
  { href: "/a-propos", changeFrequency: "monthly", priority: 0.7 },
  { href: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { href: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
  { href: "/confidentialite", changeFrequency: "yearly", priority: 0.2 },
];
