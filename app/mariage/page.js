import Image from "next/image";
import Steps from "../../components/ui/Steps";
import OfferCards from "../../components/ui/OfferCards";
import Faq from "../../components/ui/Faq";
import Testimonials from "../../components/ui/Testimonials";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import Reveal from "../../components/ui/Reveal";
import TrackedLink from "../../components/ui/TrackedLink";
import WeddingDay from "../../components/ui/WeddingDay";
import ArticleEnd from "../../components/ui/ArticleEnd";
import { MARIAGE_CHAPITRES } from "../../data/mariageJournee";
import { showPlaceholders } from "../../data/placeholders";
import { getPublicPhotos } from "../../lib/photoRepository";
import { getTestimonials } from "../../lib/siteContent";
import { buildPageMetadata } from "../../lib/seo";
import { METADATA_COPY, PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  const lang = await getServerLang();
  const copy = METADATA_COPY.mariage[lang] || METADATA_COPY.mariage.fr;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/mariage",
    lang,
  });
}

// Photo d'ouverture : couple dans un jardin, voile en mouvement (identifiant d'une photo « Fashion Wedding »).
const OPENING_PHOTO_ID = "a3c1892b-45b9-44ff-a99f-ee47b609ad03";

export default async function MariagePage() {
  const [photos, testimonials, lang] = await Promise.all([
    getPublicPhotos({ category: "Fashion Wedding" }).catch(() => []),
    getTestimonials(),
    getServerLang(),
  ]);
  const copy = PAGES_COPY.mariage[lang] || PAGES_COPY.mariage.fr;

  // Les photos du récit : celles de data/mariageJournee.js encore publiées, avec leur source actuelle.
  const byId = new Map(photos.map((photo) => [photo.id, photo]));
  const chapters = Object.keys(MARIAGE_CHAPITRES).map((key, index) => ({
    key,
    ...copy.chapters[index],
    photos: MARIAGE_CHAPITRES[key]
      .filter((item) => byId.has(item.id))
      .map((item) => ({ ...item, src: byId.get(item.id).src })),
  }));
  const opening = byId.get(OPENING_PHOTO_ID) || photos[0] || null;

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      {/* Ouverture : une photo, une phrase, un bouton, le tout visible sans défiler sur téléphone. */}
      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-10">
        <h1 className="sr-only">{copy.title}</h1>
        {opening ? (
          <div className="relative h-[56svh] overflow-hidden rounded-[0.8rem] bg-ink/5 md:h-[72svh]">
            <Image
              src={opening.src}
              alt="Mariés enlacés dans un jardin, voile en mouvement"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              quality={85}
              className="object-cover object-[50%_32%]"
            />
          </div>
        ) : null}
        <div className="mt-6 flex flex-col gap-5 md:mt-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-3xl font-serif text-3xl leading-[1.05] tracking-[-0.03em] md:text-5xl">{copy.lead}</p>
          <TrackedLink
            href="/contact?type=mariage"
            event="verifier_ma_date"
            className="inline-block self-start rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent"
          >
            {copy.ctaLabel}
          </TrackedLink>
        </div>
      </section>

      <WeddingDay chapters={chapters.slice(0, 3)} quote={copy.quote} priority />

      {/* Le mode sombre commence au milieu de la page, avec le cocktail et la soirée. */}
      <DarkChapter>
        <WeddingDay chapters={chapters.slice(3)} quote={copy.quote} quoteBefore />

        <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
          <Reveal className="max-w-3xl space-y-3">
            <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">{copy.experienceTitle}</h2>
            <p className="text-base leading-relaxed text-ink/65 md:text-lg">{copy.experienceLead}</p>
          </Reveal>
          <Steps steps={copy.steps} />
        </section>

        {showPlaceholders ? (
          <section className="mx-auto max-w-7xl px-4 md:px-8">
            <Reveal className="rounded-card border border-line/15 bg-white/50 p-6 md:p-8">
              <h2 className="font-serif text-2xl tracking-tight md:text-3xl">{copy.fullWeddingTitle}</h2>
              <p className="mt-3 text-base text-ink/70 md:text-lg">{copy.fullWeddingText}</p>
              <p className="mt-3 text-sm text-accent">
                [À FOURNIR : accord des mariés du Sofitel Le Scribe pour publier le reportage complet]
              </p>
            </Reveal>
          </section>
        ) : null}

        <Testimonials items={testimonials} prestation="mariage" title={copy.testimonialsTitle} />

        <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">{copy.packagesTitle}</h2>
          </Reveal>
          <OfferCards offers={copy.offers} />
        </section>

        <Faq items={copy.faq} title={copy.faqTitle} />

        <ArticleEnd />
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
