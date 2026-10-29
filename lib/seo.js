import { getPublicPhotos } from "./photoRepository";
import { siteConfig, toAbsoluteUrl } from "./siteConfig";

// Image d'aperçu de lien : par défaut le triptyque de /opengraph-image ; `imageFrom` (facultatif) choisit une photo précise.
// Métadonnées propres à une page : titre, description, URL canonique, Open Graph et Twitter.
export async function buildPageMetadata({ title, description, path, imageFrom, lang = "fr" }) {
  let image = toAbsoluteUrl("/opengraph-image");

  if (imageFrom) {
    try {
      const photos = await getPublicPhotos({ limit: 500 });
      const match = photos.find(imageFrom);
      if (match?.src) image = match.src;
    } catch {
      // Image Open Graph par défaut.
    }
  }

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_US" : siteConfig.locale,
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
