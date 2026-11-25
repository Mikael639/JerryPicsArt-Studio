import { existsSync } from "node:fs";
import path from "node:path";
import HomePageExperience from "../components/home/HomePageExperience";
import { loadUniversCovers } from "../lib/loadUnivers";
import { getPhotoObjectPosition } from "../lib/photoPresentation";
import { getPublicPhotos } from "../lib/photoRepository";
import { getSiteUrl, siteConfig, toAbsoluteUrl } from "../lib/siteConfig";
import { buildPageMetadata } from "../lib/seo";
import { getStats, getTestimonials } from "../lib/siteContent";
import { getLayout } from "../lib/layoutContent";
import { getVitrine } from "../lib/vitrineContent";
import { getHomeCopy } from "../lib/siteSettings";
import { METADATA_COPY } from "../lib/i18n";
import { getServerLang } from "../lib/serverLang";

export async function generateMetadata() {
  const lang = await getServerLang();
  const copy = METADATA_COPY.home[lang] || METADATA_COPY.home.fr;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/",
    lang,
  });
}

const fallbackByCategory = {
  Events: "/images/mariage/5.jpg",
  "Fashion Week & Celebrities": "/images/mariage/5.jpg",
  Studio: "/images/mariage/5.jpg",
  "Fashion Wedding": "/images/mariage/4.jpg",
  Portfolio: "/images/mariage/5.jpg",
};

const defaultFallbackPhoto = {
  id: "fallback-photo",
  src: "/images/mariage/5.jpg",
  alt: "Photographie JerryPicsArt",
  title: "Sélection JerryPicsArt",
  category: "Portfolio",
  roles: [],
  objectPosition: "center center",
};

function getFirstPhotoByRole(list, role) {
  for (const photo of list) {
    if (photo.roles?.includes(role)) return photo;
  }

  return null;
}

function hasRenderableSource(src) {
  if (!src || typeof src !== "string") return false;
  if (/^https?:\/\//.test(src)) return true;
  if (!src.startsWith("/")) return false;

  const relativePath = src.replace(/^\/+/, "").split("/").join(path.sep);
  return existsSync(path.join(process.cwd(), "public", relativePath));
}

function getFallbackSrc(category) {
  return fallbackByCategory[category] || defaultFallbackPhoto.src;
}

function normalizePhoto(photo) {
  const category = photo?.category || "Portfolio";
  const title = photo?.title || "Sélection JerryPicsArt";
  const src = hasRenderableSource(photo?.src) ? photo.src : getFallbackSrc(category);

  return {
    id: photo?.id || `${category}-${title}-${src}`,
    src,
    alt: photo?.alt || title || defaultFallbackPhoto.alt,
    title,
    category,
    roles: Array.isArray(photo?.roles) ? photo.roles : [],
    objectPosition: getPhotoObjectPosition({ ...photo, title }),
    mobileObjectPosition: photo?.mobileObjectPosition || "",
  };
}

function pickDoorPhoto(photos, category, excludeIds) {
  const candidates = photos.filter((photo) => photo.category === category && !excludeIds.has(photo.id));
  const featured = candidates.find((photo) => photo.roles?.includes("featured"));
  return featured || candidates[0] || null;
}

export default async function HomePage() {
  let sourcePhotos = [];

  try {
    sourcePhotos = await getPublicPhotos({ limit: 500 });
  } catch {
    sourcePhotos = [];
  }

  const [stats, testimonials, lang, layout, vitrine] = await Promise.all([
    getStats(),
    getTestimonials(),
    getServerLang(),
    getLayout(),
    getVitrine(),
  ]);
  const photos = (sourcePhotos.length ? sourcePhotos : [defaultFallbackPhoto]).map(normalizePhoto);

  const heroPool = photos.filter((photo) => photo.category === "Fashion Week & Celebrities");
  const heroPhoto = normalizePhoto(
    getFirstPhotoByRole(heroPool, "hero") || getFirstPhotoByRole(photos, "hero") || heroPool[0] || defaultFallbackPhoto
  );
  // La photo d'ouverture n'est pas reprise sur les cartes ; chaque carte prend d'abord une photo « mise en avant ».
  const usedIds = new Set([heroPhoto.id]);
  const doorPhotos = {
    evenements: pickDoorPhoto(photos, "Events", usedIds),
    mariage: pickDoorPhoto(photos, "Fashion Wedding", usedIds),
    signature: pickDoorPhoto(photos, "Fashion Week & Celebrities", usedIds),
    entreprises: pickDoorPhoto(photos, "Studio", usedIds),
  };
  // Photo choisie dans l'administration (Vitrine du site) : elle remplace la sélection automatique.
  for (const [door, chosen] of Object.entries(vitrine.doors)) {
    doorPhotos[door] = { id: `vitrine-${door}`, src: chosen.src, alt: chosen.alt || doorPhotos[door]?.alt || "", objectPosition: "center center" };
  }

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: getSiteUrl(),
      inLanguage: lang === "en" ? "en-US" : "fr-FR",
      description: siteConfig.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${getSiteUrl()}/#studio`,
      name: siteConfig.name,
      url: getSiteUrl(),
      description: siteConfig.description,
      image: heroPhoto?.src?.startsWith("http") ? heroPhoto.src : toAbsoluteUrl(heroPhoto?.src || "/images/shot-01.svg"),
      areaServed: ["Paris", "Île-de-France", "France"],
      sameAs: siteConfig.socialLinks.map((link) => link.href),
      knowsAbout: ["Photographie de mode", "Photographie de mariage", "Photographie d'événement"],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <HomePageExperience
        heroPhoto={heroPhoto}
        doorPhotos={doorPhotos}
        doorsLayout={layout.doors}
        universCovers={await loadUniversCovers()}
        // Seules les photos du diaporama d'ouverture partent au navigateur (pas les centaines du catalogue).
        cinematicPool={photos.filter((photo) => photo.roles?.includes("hero"))}
        stats={stats}
        testimonials={testimonials}
        siteText={await getHomeCopy()}
      />
    </>
  );
}
