import { notFound } from "next/navigation";
import PageIntro from "../../../components/ui/PageIntro";
import Series from "../../../components/ui/Series";
import ContactBlock from "../../../components/ui/ContactBlock";
import { getCustomCollections } from "../../../lib/categories";
import { enhancePhotoPresentation } from "../../../lib/photoPresentation";
import { getPublicPhotos } from "../../../lib/photoRepository";
import { buildPageMetadata } from "../../../lib/seo";
import { getCategories } from "../../../lib/siteSettings";

async function findCollection(slug) {
  const categories = await getCategories();
  return getCustomCollections(categories).find((collection) => collection.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = await findCollection(slug);
  if (!collection) return {};

  return buildPageMetadata({
    title: `${collection.name} | JerryPicsArt`,
    description: `Photographies de la collection ${collection.name} par JerryPicsArt, photographe éditorial à Paris.`,
    path: `/collections/${collection.slug}`,
    imageFrom: (photo) => photo.category === collection.name,
  });
}

// Page d'une catégorie ajoutée depuis l'administration : toutes ses photos publiées, en une série.
export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const collection = await findCollection(slug);
  if (!collection) notFound();

  let photos = [];
  try {
    photos = (await getPublicPhotos({ category: collection.name })).map(enhancePhotoPresentation);
  } catch {
    photos = [];
  }

  const serie = {
    slug: collection.slug,
    titre: collection.name,
    contexte: "",
    images: photos.map((photo) => ({
      id: photo.id,
      src: photo.src,
      alt: photo.alt || `${collection.name}, photographie de JerryPicsArt`,
      title: collection.name,
      objectPosition: photo.objectPosition,
    })),
  };

  return (
    <div className="page-shell space-y-16 pb-20 md:space-y-24">
      <PageIntro eyebrow="Collection" title={collection.name} />
      {serie.images.length ? <Series serie={serie} priority /> : null}
      <ContactBlock />
    </div>
  );
}
