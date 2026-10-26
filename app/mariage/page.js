import PageIntro from "../../components/ui/PageIntro";
import Series from "../../components/ui/Series";
import Steps from "../../components/ui/Steps";
import OfferCards from "../../components/ui/OfferCards";
import Faq from "../../components/ui/Faq";
import Testimonials from "../../components/ui/Testimonials";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import Reveal from "../../components/ui/Reveal";
import { pickSeries } from "../../data/series";
import { showPlaceholders } from "../../data/placeholders";
import { getIntroPhotos } from "../../lib/introPhotos";
import { loadSeries } from "../../lib/loadSeries";
import { getTestimonials } from "../../lib/siteContent";
import { buildPageMetadata } from "../../lib/seo";
import { PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Photographe de mariage haut de gamme à Paris | JerryPicsArt",
    description:
      "Votre mariage photographié comme un éditorial. Formules à partir de 1 500 €. Vérifiez la disponibilité de votre date.",
    path: "/mariage",
    imageFrom: (photo) => photo.category === "Fashion Wedding",
  });
}

export default async function MariagePage() {
  const [allSeries, testimonials, lang] = await Promise.all([loadSeries(), getTestimonials(), getServerLang()]);
  const copy = PAGES_COPY.mariage[lang] || PAGES_COPY.mariage.fr;
  const series = pickSeries(allSeries, "mariage", 3);
  const introPhoto = (await getIntroPhotos())["/mariage"] || series[0]?.images?.[0] || null;

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        bridge={copy.bridge}
        cta={{ href: "/contact?type=mariage", label: copy.ctaLabel, event: "verifier_ma_date" }}
        image={introPhoto}
      />

      <div className="space-y-20 md:space-y-28">
        {series.map((serie, index) => (
          <Series key={serie.slug} serie={serie} priority={index === 0} />
        ))}
        {showPlaceholders ? (
          <p className="mx-auto max-w-7xl px-4 text-sm text-accent md:px-8">
            [À FOURNIR : regroupement des photos en 2 à 3 mariages complets, dont un au Sofitel Le Scribe]
          </p>
        ) : null}
      </div>

      <DarkChapter>
        <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
          <Reveal className="max-w-3xl space-y-3">
            <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">
              {copy.experienceTitle}
            </h2>
            <p className="text-base leading-relaxed text-ink/65 md:text-lg">
              {copy.experienceLead}
            </p>
          </Reveal>
          <Steps steps={copy.steps} />
        </section>

        <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">{copy.packagesTitle}</h2>
          </Reveal>
          <OfferCards offers={copy.offers} />
        </section>

        <Faq items={copy.faq} title={copy.faqTitle} />

        <Testimonials items={testimonials} prestation="mariage" title={copy.testimonialsTitle} />

        <ContactBlock
          title={copy.contactTitle}
          text={copy.contactText}
          label={copy.contactLabel}
          href="/contact?type=mariage"
          event="verifier_ma_date_final"
        />
      </DarkChapter>
    </div>
  );
}
