import PageIntro from "../../components/ui/PageIntro";
import ClientsBand from "../../components/ui/ClientsBand";
import Universe, { UniverseNav } from "../../components/ui/Universe";
import PullQuote from "../../components/ui/PullQuote";
import ArticleEnd from "../../components/ui/ArticleEnd";
import OfferCards from "../../components/ui/OfferCards";
import Faq from "../../components/ui/Faq";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import Reveal from "../../components/ui/Reveal";
import { loadUniversForPage } from "../../lib/loadUnivers";
import { showPlaceholders } from "../../data/placeholders";
import { getIntroPhotos } from "../../lib/introPhotos";
import { getClients } from "../../lib/siteContent";
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
  const [lang, clients] = await Promise.all([getServerLang(), getClients()]);
  const copy = PAGES_COPY.evenements[lang] || PAGES_COPY.evenements.fr;
  const univers = await loadUniversForPage("evenements");
  const introPhoto = (await getIntroPhotos())["/evenements"] || univers[0]?.images?.[0] || null;

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        bridge={copy.bridge}
        image={introPhoto}
      />

      <ClientsBand title={copy.clientsTitle} items={clients} />

      <ContactBlock
        title={copy.contactTitle}
        text={copy.contactText}
        label={copy.contactLabel}
        href="/contact?type=evenement"
        event="devis_evenement_final"
        tone="light"
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="space-y-6">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">{copy.coveredTitle}</h2>
          {/* Grille rangée : 2 colonnes sur téléphone (le dernier élément, seul, prend toute la largeur),
              3 puis 2 cartes sur tablette, les 5 en ligne seulement sur grand écran. */}
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4 xl:grid-cols-5">
            {copy.covered.map((item, index) => (
              <li
                key={item}
                className="flex min-h-24 flex-col justify-between gap-4 rounded-inset border border-line/20 bg-white/60 p-4 last:odd:col-span-2 md:col-span-2 md:min-h-32 md:p-5 md:nth-[n+4]:col-span-3 md:last:odd:col-span-3 xl:col-span-1 xl:nth-[n+4]:col-span-1 xl:last:odd:col-span-1"
              >
                <span className="text-[11px] font-bold tracking-[0.24em] text-accent">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-serif text-xl leading-tight md:text-2xl">{item}</span>
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
            <Universe key={item.slug} univers={item} number={index + 1} priority={index === 0} />
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
        </DarkChapter>
      </div>
    </div>
  );
}
