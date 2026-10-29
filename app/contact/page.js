import ContactExperience from "../../components/contact/ContactExperience";
import { buildPageMetadata } from "../../lib/seo";
import { METADATA_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  const lang = await getServerLang();
  const copy = METADATA_COPY.contact[lang] || METADATA_COPY.contact.fr;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/contact",
    lang,
  });
}

export default async function ContactPage({ searchParams }) {
  const params = (await searchParams) || {};
  const type = typeof params.type === "string" ? params.type : "";
  return <ContactExperience type={type} />;
}
