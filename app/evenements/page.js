import PageIntro from "../../components/ui/PageIntro";
import { Fragment } from "react";
import Universe, { UniverseNav } from "../../components/ui/Universe";
import PullQuote from "../../components/ui/PullQuote";
import DoublePage from "../../components/ui/DoublePage";
import ArticleEnd from "../../components/ui/ArticleEnd";
import OfferCards from "../../components/ui/OfferCards";
import Faq from "../../components/ui/Faq";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import Reveal from "../../components/ui/Reveal";
import { loadUniversForPage } from "../../lib/loadUnivers";
import { getUniversPhoto } from "../../data/univers";
import { showPlaceholders } from "../../data/placeholders";
import { getIntroPhotos } from "../../lib/introPhotos";
import { buildPageMetadata } from "../../lib/seo";
import { METADATA_COPY, PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  const lang = await getServerLang();
  const copy = METADATA_COPY.evenements[lang] || METADATA_COPY.evenements.fr;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/evenements",
    lang,
  });
}

export default async function EvenementsPage() {
  const lang = await getServerLang();
  const copy = PAGES_COPY.evenements[lang] || PAGES_COPY.evenements.fr;
  const univers = await loadUniversForPage("evenements");
  // Double page : le yacht à Monaco, retiré de son univers pour ne pas apparaître deux fois.
  const doublePage = getUniversPhoto("1pjp5Mqgr6kOHl1Kof7MgaFtAho7qsfY9");
  const introPhoto = (await getIntroPhotos())["/evenements"] || univers[0]?.images?.[0] || null;

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

      {/* La barre d'ancres et tous les univers partagent ce bloc : sur téléphone, la barre reste collée
          jusqu'au dernier univers, y compris dans la partie sombre. */}
      <div>
        <UniverseNav items={univers} />
        <div className="mt-12 space-y-20 md:mt-16 md:space-y-28">
          {univers.slice(0, 2).map((item, index) => (
            <Fragment key={item.slug}>
              <Universe
                univers={item}
                number={index + 1}
                priority={index === 0}
                excludeIds={item.slug === "monaco-culture" && doublePage ? [doublePage.id] : []}
              />
              {index === 0 ? <DoublePage photo={doublePage} /> : null}
            </Fragment>
          ))}
        </div>

        {/* Passage en mode sombre au milieu de la page : le dernier univers, l'offre et le contact. */}
        <DarkChapter className="mt-16 md:mt-24">
          <div className="space-y-20 md:space-y-28">
            <PullQuote text={copy.quote} />
            {univers.slice(2).map((item, index) => (
              <Universe key={item.slug} univers={item} number={index + 3} />
            ))}
          </div>

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

          <ArticleEnd />
          <ContactBlock
            title={copy.contactTitle}
            text={copy.contactText}
            label={copy.contactLabel}
            href="/contact?type=evenement"
            event="devis_evenement_final"
          />
        </DarkChapter>
      </div>
    </div>
  );
}
