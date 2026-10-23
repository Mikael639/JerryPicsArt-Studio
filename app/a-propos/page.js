import AboutExperience from "../../components/about/AboutExperience";
import { getAboutCopy } from "../../lib/siteSettings";
import { getStats } from "../../lib/siteContent";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "À propos | JerryPicsArt, photographe éditorial à Paris",
    description: "Le parcours de JerryPicsArt, de la Fashion Week aux mariages et aux événements d'entreprise.",
    path: "/a-propos",
  });
}

export default async function AboutPage() {
  const [aboutCopy, stats] = await Promise.all([getAboutCopy(), getStats()]);
  return <AboutExperience aboutCopy={aboutCopy} stats={stats} />;
}
