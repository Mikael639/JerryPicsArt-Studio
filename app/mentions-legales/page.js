import LegalPage from "../../components/ui/LegalPage";
import { siteConfig } from "../../lib/siteConfig";
import { buildPageMetadata } from "../../lib/seo";
import { METADATA_COPY, PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  const lang = await getServerLang();
  const copy = METADATA_COPY.legal[lang] || METADATA_COPY.legal.fr;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/mentions-legales",
    lang,
  });
}

export default async function MentionsLegalesPage() {
  const lang = await getServerLang();
  const copy = PAGES_COPY.legal[lang] || PAGES_COPY.legal.fr;

  return <LegalPage title={copy.title} sections={copy.sections(siteConfig)} />;
}
