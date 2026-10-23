import { getCustomCollections } from "../lib/categories";
import { sitePages, toAbsoluteUrl } from "../lib/siteConfig";
import { getCategories } from "../lib/siteSettings";

export default async function sitemap() {
  const currentDate = new Date();
  const collections = getCustomCollections(await getCategories());

  const pages = [
    ...sitePages,
    ...collections.map((collection) => ({
      href: `/collections/${collection.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];

  return pages.map((page) => ({
    url: toAbsoluteUrl(page.href),
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
