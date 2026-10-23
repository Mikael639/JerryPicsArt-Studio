import PageIntro from "../../components/ui/PageIntro";
import ReferencesBand from "../../components/ui/ReferencesBand";
import Series from "../../components/ui/Series";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import { findSeriesBySlugs, pickSeries } from "../../data/series";
import { loadSeries } from "../../lib/loadSeries";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Photographe Fashion Week Paris : défilés, maisons et célébrités",
    description:
      "Séries photo de la Fashion Week de Paris : défilés, invités et personnalités. Le regard éditorial de JerryPicsArt.",
    path: "/signature",
    imageFrom: (photo) => photo.category === "Fashion Week & Celebrities",
  });
}

export default async function SignaturePage() {
  const all = await loadSeries();
  // Amiri est un défilé : il figure aussi ici, même si ses photos sont classées en événements.
  const series = [...pickSeries(all, "signature"), ...findSeriesBySlugs(all, ["amiri"])]
    .filter((serie, index, list) => list.findIndex((other) => other.slug === serie.slug) === index)
    .sort((a, b) => Number(b.priority) - Number(a.priority) || b.date - a.date || b.images.length - a.images.length)
    .slice(0, 10);

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow="Signature"
        title="Fashion Week de Paris : défilés, maisons et personnalités"
        lead="Depuis plusieurs saisons, je photographie les défilés, les invités et les personnalités de la Fashion Week de Paris."
        bridge="La même exigence guide chacun de mes mariages et de mes événements."
      />

      <ReferencesBand />

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
          title="Le même regard pour votre événement"
          text="Lancement, soirée, gala ou mariage : parlons de votre projet."
          label="Le même regard pour votre événement"
          href="/evenements"
          event="bridge_cta_signature_final"
          secondary={{ href: "/mariage", label: "ou pour votre mariage" }}
        />
      </DarkChapter>
    </div>
  );
}
