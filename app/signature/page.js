import PageIntro from "../../components/ui/PageIntro";
import ReferencesBand from "../../components/ui/ReferencesBand";
import Series from "../../components/ui/Series";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import { findSeriesBySlugs, pickSeries } from "../../data/series";
import { loadSeries } from "../../lib/loadSeries";
import { getPublicPhotos } from "../../lib/photoRepository";
import { getReferences } from "../../lib/siteContent";
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

// Photo d'en-tête choisie dans toutes les photos publiées (elle n'appartient pas forcément à une série affichée).
async function getIntroPhoto(fallback) {
  try {
    const photos = await getPublicPhotos({ limit: 500 });
    const photo = photos.find((item) => item.src.toLowerCase().includes("imane-ayissi-hcw-260126-jpa-45"));
    if (photo) return { src: photo.src, alt: "Défilé Imane Ayissi, Semaine de la Haute Couture, Paris", objectPosition: photo.objectPosition };
  } catch {}
  return fallback || null;
}

export default async function SignaturePage() {
  const [all, references] = await Promise.all([loadSeries(), getReferences()]);
  // Amiri est un défilé : il figure aussi ici, même si ses photos sont classées en événements.
  const series = [...pickSeries(all, "signature"), ...findSeriesBySlugs(all, ["amiri"])]
    .filter((serie, index, list) => list.findIndex((other) => other.slug === serie.slug) === index)
    .sort((a, b) => Number(b.priority) - Number(a.priority) || b.date - a.date || b.images.length - a.images.length)
    .slice(0, 10);
  const introPhoto = await getIntroPhoto(series[0]?.images?.[0]);

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow="Signature"
        title="Fashion Week de Paris : défilés, maisons et personnalités"
        lead="Depuis plusieurs saisons, je photographie les défilés, les invités et les personnalités de la Fashion Week de Paris."
        bridge="La même exigence guide chacun de mes mariages et de mes événements."
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
