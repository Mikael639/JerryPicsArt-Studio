import LegalPage from "../../components/ui/LegalPage";
import { siteConfig } from "../../lib/siteConfig";
import { buildPageMetadata } from "../../lib/seo";
import { PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Politique de confidentialité | JerryPicsArt",
    description: "Comment JerryPicsArt utilise les données recueillies par le formulaire de contact.",
    path: "/confidentialite",
  });
}

export default async function ConfidentialitePage() {
  const lang = await getServerLang();
  const copy = PAGES_COPY.privacy[lang] || PAGES_COPY.privacy.fr;

  return <LegalPage title={copy.title} intro={copy.intro} sections={copy.sections(siteConfig)} />;
}
