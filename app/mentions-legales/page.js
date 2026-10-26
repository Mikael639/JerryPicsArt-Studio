import LegalPage from "../../components/ui/LegalPage";
import { siteConfig } from "../../lib/siteConfig";
import { buildPageMetadata } from "../../lib/seo";
import { PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Mentions légales | JerryPicsArt",
    description: "Mentions légales du site JerryPicsArt, photographe éditorial à Paris.",
    path: "/mentions-legales",
  });
}

export default async function MentionsLegalesPage() {
  const lang = await getServerLang();
  const copy = PAGES_COPY.legal[lang] || PAGES_COPY.legal.fr;

  return <LegalPage title={copy.title} sections={copy.sections(siteConfig)} />;
}
