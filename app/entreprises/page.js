import PageIntro from "../../components/ui/PageIntro";
import ClientsBand from "../../components/ui/ClientsBand";
import Universe, { UniverseNav } from "../../components/ui/Universe";
import PullQuote from "../../components/ui/PullQuote";
import ArticleEnd from "../../components/ui/ArticleEnd";
import Steps from "../../components/ui/Steps";
import Reveal from "../../components/ui/Reveal";
import OfferCards from "../../components/ui/OfferCards";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import TrackedLink from "../../components/ui/TrackedLink";
import { loadUniversForPage } from "../../lib/loadUnivers";
import { getIntroPhotos } from "../../lib/introPhotos";
import { getClients } from "../../lib/siteContent";
import { buildPageMetadata } from "../../lib/seo";
import { METADATA_COPY, PAGES_COPY } from "../../lib/i18n";
import { getServerLang } from "../../lib/serverLang";

export async function generateMetadata() {
  const lang = await getServerLang();
  const copy = METADATA_COPY.entreprises[lang] || METADATA_COPY.entreprises.fr;

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/entreprises",
    lang,
  });
}

export default async function EntreprisesPage() {
  const [lang, clients] = await Promise.all([getServerLang(), getClients()]);
  const copy = PAGES_COPY.entreprises[lang] || PAGES_COPY.entreprises.fr;
  const univers = await loadUniversForPage("entreprises");
  const introPhoto = (await getIntroPhotos())["/entreprises"] || univers[0]?.images?.[0] || null;

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow={copy.eyebrow}
        title={copy.title}
        lead={copy.lead}
        image={introPhoto}
      />

      <ClientsBand title={copy.clientsTitle} items={clients} />

      <section className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-2 md:px-8">
        <Reveal className="rounded-card border border-line/15 bg-white/60 p-8">
          <h2 className="font-serif text-3xl tracking-tight">{copy.venuesTitle}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70 md:text-lg">{copy.venuesText}</p>
        </Reveal>
        <Reveal delay={0.08} className="rounded-card border border-line/15 bg-white/60 p-8">
          <h2 className="font-serif text-3xl tracking-tight">{copy.agenciesTitle}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70 md:text-lg">{copy.agenciesText}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
        <Reveal>
          <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">{copy.processTitle}</h2>
        </Reveal>
        <Steps steps={copy.steps} />
      </section>

      {/* Appel à l'action remonté juste sous « Comment ça se passe » (Brief, Couverture, Livraison, Facture), en version claire. */}
      <ContactBlock
        title={copy.contactTitle}
        text={copy.contactText}
        label={copy.contactLabel}
        href="/contact?type=entreprise"
        event="appel_15_minutes"
        tone="light"
      />

      {/* La barre d'ancres et tous les univers partagent ce bloc : sur téléphone, la barre reste collée
          jusqu'au dernier univers, y compris dans la partie sombre. */}
      <div>
        <UniverseNav items={univers} />
        <div className="mt-12 space-y-20 md:mt-16 md:space-y-28">
          {univers.slice(0, 1).map((item, index) => (
            <Universe key={item.slug} univers={item} number={index + 1} priority={index === 0} />
          ))}
          <PullQuote text={copy.quote} />
        </div>

        {/* Passage en mode sombre plus tard sur cette page, plus courte : tarifs, garanties,
            dernier univers, offre de marque et contact. */}
        <DarkChapter className="mt-16 md:mt-24">
          <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
            <Reveal>
              <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">{copy.pricingTitle}</h2>
            </Reveal>
            <OfferCards offers={copy.pricing} columns="md:grid-cols-2" />
            <p className="text-base text-ink/70">{copy.partnerRate}</p>
          </section>

          <section className="mx-auto max-w-7xl space-y-6 px-4 md:px-8">
            <Reveal>
              <h2 className="font-serif text-3xl tracking-tight md:text-4xl">{copy.guaranteesTitle}</h2>
            </Reveal>
            <ul className="grid gap-3 md:grid-cols-3">
              {copy.guarantees.map((item) => (
                <li key={item} className="rounded-inset border border-line/15 bg-white/50 px-6 py-5 text-base text-ink/80">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-12 md:space-y-16">
            <div className="space-y-20 md:space-y-28">
              {univers.slice(1).map((item, index) => (
                <Universe key={item.slug} univers={item} number={index + 2} />
              ))}
            </div>
            <section className="mx-auto max-w-7xl px-4 md:px-8">
              <Reveal className="rounded-card border border-line/15 bg-white/50 p-6 md:p-8">
                <h2 className="font-serif text-2xl tracking-tight md:text-3xl">{copy.brandTitle}</h2>
                <p className="mt-3 text-base text-ink/70 md:text-lg">
                  {copy.brandTextPrefix}{" "}
                  <a href="/contact?type=contenu" className="underline underline-offset-4 hover:text-ink">
                    {copy.brandLinkLabel}
                  </a>
                  .
                </p>
              </Reveal>
            </section>
          </div>

          <section className="mx-auto max-w-7xl px-4 md:px-8">
            <Reveal className="grid items-center gap-8 overflow-hidden rounded-panel border border-line/15 bg-white/60 p-8 md:grid-cols-[auto_1fr_auto] md:gap-12 md:p-12">
              <div
                aria-hidden="true"
                className="theme-default relative mx-auto flex h-48 w-36 flex-col justify-between rounded-[0.9rem] border border-line/20 bg-paper p-4 shadow-[0_24px_60px_rgba(12,10,8,0.14)] md:mx-0 md:h-56 md:w-40"
              >
                <span className="font-serif text-lg leading-tight text-ink">JerryPicsArt</span>
                <span className="space-y-1.5">
                  <span className="block h-px w-full bg-ink/20" />
                  <span className="block h-px w-4/5 bg-ink/20" />
                  <span className="block h-px w-3/5 bg-ink/20" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">{copy.b2bBadge}</span>
              </div>
              <div className="space-y-3 text-center md:text-left">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/45">{copy.b2bEyebrow}</p>
                <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">{copy.b2bTitle}</h2>
                <p className="max-w-xl text-base leading-relaxed text-ink/70">{copy.b2bText}</p>
              </div>
              <TrackedLink
                href="/dossier-b2b-jerrypicsart.pdf"
                event="telechargement_dossier_b2b"
                className="mx-auto inline-flex flex-col items-center rounded-full border border-ink px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper md:mx-0"
              >
                {copy.b2bButton}
              </TrackedLink>
            </Reveal>
          </section>

          <ArticleEnd />
        </DarkChapter>
      </div>
    </div>
  );
}
