import PageIntro from "../../components/ui/PageIntro";
import Series from "../../components/ui/Series";
import OfferCards from "../../components/ui/OfferCards";
import Faq from "../../components/ui/Faq";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import Reveal from "../../components/ui/Reveal";
import { findSeriesBySlugs, pickSeries } from "../../data/series";
import { showPlaceholders } from "../../data/placeholders";
import { getIntroPhotos } from "../../lib/introPhotos";
import { loadSeries } from "../../lib/loadSeries";
import { buildPageMetadata } from "../../lib/seo";
import { PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Photographe événementiel à Paris : soirées, lancements, galas",
    description:
      "Photographe pour vos soirées, lancements et galas à Paris. Sélection express le soir même en option. Devis sous 48 h.",
    path: "/evenements",
  });
}

export default async function EvenementsPage() {
  const [all, lang] = await Promise.all([loadSeries(), getServerLang()]);
  const copy = PAGES_COPY.evenements[lang] || PAGES_COPY.evenements.fr;
  const proof = findSeriesBySlugs(all, ["amiri", "elie-saab-haute-couture", "joya-l-avant-premiere", "les-flammes-2026"]);
  const proofSlugs = new Set(proof.map((serie) => serie.slug));
  const others = pickSeries(all, "evenement").filter((serie) => !proofSlugs.has(serie.slug)).slice(0, 3);

  const introPhoto = (await getIntroPhotos())["/evenements"] || proof[0]?.images?.[0] || others[0]?.images?.[0] || null;

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        bridge={copy.bridge}
        cta={{ href: "/contact?type=evenement", label: copy.ctaLabel, event: "devis_evenement" }}
        image={introPhoto}
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="space-y-6">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">{copy.coveredTitle}</h2>
          <ul className="flex flex-wrap gap-3">
            {copy.covered.map((item) => (
              <li key={item} className="rounded-full border border-line/20 bg-white/60 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/75">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <div className="space-y-20 md:space-y-28">
        {proof.map((serie, index) => (
          <Series key={serie.slug} serie={serie} priority={index === 0} />
        ))}
        {others.map((serie) => (
          <Series key={serie.slug} serie={serie} />
        ))}
      </div>

      <DarkChapter>
        <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">{copy.offerTitle}</h2>
          </Reveal>
          <OfferCards offers={copy.offers} columns="md:grid-cols-2" />
          <div className="grid gap-3 md:grid-cols-2">
            {copy.options.map((option) => (
              <div key={option.titre} className="flex items-center justify-between gap-4 rounded-inset border border-line/15 bg-white/50 px-6 py-4">
                <span className="font-serif text-xl">
                  {copy.optionPrefix} {option.titre}
                </span>
                <span className="font-serif text-2xl">{option.prix}</span>
              </div>
            ))}
          </div>
          <p className="text-base text-ink/65">
            {copy.deliveryNote}
            {showPlaceholders ? <span className="ml-2 text-accent">[À FOURNIR : confirmer le délai de livraison complète]</span> : null}
          </p>
        </section>

        <Faq items={copy.faq} title={copy.faqTitle} />

        <ContactBlock
          title={copy.contactTitle}
          text={copy.contactText}
          label={copy.contactLabel}
          href="/contact?type=evenement"
          event="devis_evenement_final"
        />
      </DarkChapter>
    </div>
  );
}
