import AboutExperience from "../../components/about/AboutExperience";
import { getAboutCopy } from "../../lib/siteSettings";
import { getStats } from "../../lib/siteContent";
import { buildPageMetadata } from "../../lib/seo";
import { METADATA_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  const lang = await getServerLang();
  const copy = METADATA_COPY.about[lang] || METADATA_COPY.about.fr;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/a-propos",
    lang,
  });
}

export default async function AboutPage() {
  const [aboutCopy, stats] = await Promise.all([getAboutCopy(), getStats()]);
  return <AboutExperience aboutCopy={aboutCopy} stats={stats} />;
}
