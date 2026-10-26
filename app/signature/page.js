import PageIntro from "../../components/ui/PageIntro";
import ReferencesBand from "../../components/ui/ReferencesBand";
import Series from "../../components/ui/Series";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import { findSeriesBySlugs, pickSeries } from "../../data/series";
import { loadSeries } from "../../lib/loadSeries";
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
  const [all, references, lang] = await Promise.all([loadSeries(), getReferences(), getServerLang()]);
  const copy = PAGES_COPY.signature[lang] || PAGES_COPY.signature.fr;
  // Amiri est un défilé : il figure aussi ici, même si ses photos sont classées en événements.
  const series = [...pickSeries(all, "signature"), ...findSeriesBySlugs(all, ["amiri"])]
    .filter((serie, index, list) => list.findIndex((other) => other.slug === serie.slug) === index)
    .sort((a, b) => Number(b.priority) - Number(a.priority) || b.date - a.date || b.images.length - a.images.length)
    .slice(0, 10);
  const introPhoto = (await getIntroPhotos())["/signature"] || series[0]?.images?.[0] || null;

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

      <div className="space-y-20 md:space-y-28">
        {series.slice(0, 5).map((serie, index) => (
          <Series key={serie.slug} serie={serie} withBridge priority={index === 0} />
        ))}
      </div>

      <DarkChapter>
        <div className="space-y-20 md:space-y-28">
          {series.slice(5).map((serie) => (
            <Series key={serie.slug} serie={serie} withBridge />
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
  );
}
