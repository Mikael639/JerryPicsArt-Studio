import { existsSync } from "node:fs";
import path from "node:path";
import HomePageExperience from "../components/home/HomePageExperience";
import { getUniversCovers } from "../data/univers";
import { defaultPortfolioCategory } from "../lib/categories";
import { getPhotoObjectPosition } from "../lib/photoPresentation";
import { getPublicPhotos } from "../lib/photoRepository";
import { getSiteUrl, siteConfig, toAbsoluteUrl } from "../lib/siteConfig";
import { buildPageMetadata } from "../lib/seo";
import { getReferences, getStats, getTestimonials } from "../lib/siteContent";
import { getHomeCopy } from "../lib/siteSettings";

const FEATURED_ROTATION_INTERVAL_MS = 30 * 60 * 1000;

export async function generateMetadata() {
  return buildPageMetadata({
    title: "JerryPicsArt | Photographe éditorial à Paris, mariages et événements",
    description:
      "Photographe éditorial à Paris : Fashion Week, mariages haut de gamme et événements d'entreprise. Un accompagnement de A à Z.",
    path: "/",
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
  };
}

function collectPhotos(pool, count, excludeIds = [], fallbackPhoto = defaultFallbackPhoto) {
  const taken = [];
  const seen = new Set(excludeIds);

  for (const photo of pool) {
    if (!photo || seen.has(photo.id)) continue;
    seen.add(photo.id);
    taken.push(photo);
    if (taken.length === count) return taken;
  }

  while (taken.length < count) {
    const index = taken.length + 1;
    taken.push({
      ...fallbackPhoto,
      id: `${fallbackPhoto.id}-fallback-${index}`,
      src: getFallbackSrc(fallbackPhoto.category),
    });
  }

  return taken;
}

function rotatePhotosByTimeWindow(pool, intervalMs = FEATURED_ROTATION_INTERVAL_MS) {
  if (!pool.length) return pool;

  const rotationIndex = Math.floor(Date.now() / intervalMs) % pool.length;
  return [...pool.slice(rotationIndex), ...pool.slice(0, rotationIndex)];
}

function buildCategoryPriority(pool, preferredCategories = []) {
  const availableCategories = [];

  for (const photo of pool) {
    const category = photo?.category || defaultPortfolioCategory;
    if (!availableCategories.includes(category)) {
      availableCategories.push(category);
    }
  }

  const ordered = [];

  for (const category of preferredCategories) {
    if (availableCategories.includes(category) && !ordered.includes(category)) {
      ordered.push(category);
    }
  }

  for (const category of availableCategories) {
    if (!ordered.includes(category)) {
      ordered.push(category);
    }
  }

  return ordered;
}

function collectMixedPhotos(
  pool,
  count,
  { excludeIds = [], preferredCategories = [], fallbackPhoto = defaultFallbackPhoto } = {}
) {
  const taken = [];
  const seen = new Set(excludeIds);
  const grouped = new Map();

  for (const photo of pool) {
    if (!photo || seen.has(photo.id)) continue;

    const category = photo.category || defaultPortfolioCategory;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }

    grouped.get(category).push(photo);
  }

  const categoryPriority = buildCategoryPriority(pool, preferredCategories);
  let progressed = true;

  while (taken.length < count && progressed) {
    progressed = false;

    for (const category of categoryPriority) {
      const bucket = grouped.get(category) || [];
      const nextPhoto = bucket.shift();
      if (!nextPhoto || seen.has(nextPhoto.id)) continue;

      seen.add(nextPhoto.id);
      taken.push(nextPhoto);
      progressed = true;

      if (taken.length === count) break;
    }
  }

  if (taken.length < count) {
    for (const photo of pool) {
      if (!photo || seen.has(photo.id)) continue;
      seen.add(photo.id);
      taken.push(photo);
      if (taken.length === count) break;
    }
  }

  while (taken.length < count) {
    const index = taken.length + 1;
    taken.push({
      ...fallbackPhoto,
      id: `${fallbackPhoto.id}-mixed-fallback-${index}`,
      src: getFallbackSrc(fallbackPhoto.category),
    });
  }

  return taken;
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

  const [references, stats, testimonials] = await Promise.all([getReferences(), getStats(), getTestimonials()]);
  const photos = (sourcePhotos.length ? sourcePhotos : [defaultFallbackPhoto]).map(normalizePhoto);

  const heroPool = photos.filter((photo) => photo.category === "Fashion Week & Celebrities");
  const heroPhoto = normalizePhoto(
    getFirstPhotoByRole(heroPool, "hero") || getFirstPhotoByRole(photos, "hero") || heroPool[0] || defaultFallbackPhoto
  );
  const supportingPhotos = collectMixedPhotos(rotatePhotosByTimeWindow(photos.filter((photo) => photo.roles?.includes("featured"))), 2, {
    excludeIds: [heroPhoto.id],
    preferredCategories: ["Events", "Fashion Wedding"],
    fallbackPhoto: heroPhoto,
  });
  const usedIds = new Set([heroPhoto.id, ...supportingPhotos.map((photo) => photo.id)]);
  const doorPhotos = {
    evenements: pickDoorPhoto(photos, "Events", usedIds),
    mariage: pickDoorPhoto(photos, "Fashion Wedding", usedIds),
    entreprises: pickDoorPhoto(photos, "Studio", usedIds),
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: getSiteUrl(),
      inLanguage: "fr-FR",
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
        supportingPhotos={supportingPhotos}
        doorPhotos={doorPhotos}
        universCovers={getUniversCovers()}
        cinematicPool={photos}
        references={references}
        stats={stats}
        testimonials={testimonials}
        siteText={await getHomeCopy()}
      />
    </>
  );
}
