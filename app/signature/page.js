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

      {/* La barre d'ancres et tous les univers partagent ce bloc : sur téléphone, la barre reste collée
          jusqu'au dernier univers, y compris dans la partie sombre. */}
      <div>
        <UniverseNav items={univers} />
        <div className="mt-12 space-y-20 md:mt-16 md:space-y-28">
          {univers.slice(0, 3).map((item, index) => (
            <Universe key={item.slug} univers={item} priority={index === 0} />
          ))}
        </div>

        {/* Passage en mode sombre au milieu de la page : les derniers univers et le contact. */}
        <DarkChapter className="mt-16 md:mt-24">
          <div className="space-y-20 md:space-y-28">
            {univers.slice(3).map((item) => (
              <Universe key={item.slug} univers={item} />
            ))}
          </div>

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
    </div>
  );
}
