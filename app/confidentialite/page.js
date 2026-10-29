import LegalPage from "../../components/ui/LegalPage";
import { siteConfig } from "../../lib/siteConfig";
import { buildPageMetadata } from "../../lib/seo";
import { METADATA_COPY, PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  const lang = await getServerLang();
  const copy = METADATA_COPY.privacy[lang] || METADATA_COPY.privacy.fr;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/confidentialite",
    lang,
  });
}

export default async function ConfidentialitePage() {
  const lang = await getServerLang();
  const copy = PAGES_COPY.privacy[lang] || PAGES_COPY.privacy.fr;

  return <LegalPage title={copy.title} intro={copy.intro} sections={copy.sections(siteConfig)} />;
}
