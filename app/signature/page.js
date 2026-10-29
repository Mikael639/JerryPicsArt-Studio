import PageIntro from "../../components/ui/PageIntro";
import ReferencesBand from "../../components/ui/ReferencesBand";
import Universe, { UniverseNav } from "../../components/ui/Universe";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import { getUniversForPage } from "../../data/univers";
import { getIntroPhotos } from "../../lib/introPhotos";
import { getReferences } from "../../lib/siteContent";
import { buildPageMetadata } from "../../lib/seo";
import { PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Photographe Fashion Week Paris : défilés, maisons et célébrités",
    description:
      "Séries photo de la Fashion Week de Paris : défilés, invités et personnalités. Le regard éditorial de JerryPicsArt.",
    path: "/signature",
  });
}

export default async function SignaturePage() {
  const [references, lang] = await Promise.all([getReferences(), getServerLang()]);
  const copy = PAGES_COPY.signature[lang] || PAGES_COPY.signature.fr;
  const univers = getUniversForPage("signature");
  const introPhoto = (await getIntroPhotos())["/signature"] || univers[0]?.images?.[0] || null;

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        bridge={copy.bridge}
        image={introPhoto}
      />

      <ReferencesBand items={references} />

      <div className="space-y-12 md:space-y-16">
        <UniverseNav items={univers} />
        <div className="space-y-20 md:space-y-28">
          {univers.map((item, index) => (
            <Universe key={item.slug} univers={item} priority={index === 0} />
          ))}
        </div>
      </div>

      <DarkChapter>
        <ContactBlock
          title={copy.contactTitle}
          text={copy.contactText}
          label={copy.contactLabel}
          href="/evenements"
          event="bridge_cta_signature_final"
          secondary={{ href: "/mariage", label: copy.contactSecondary }}
        />
      </DarkChapter>
    </div>
  );
}
