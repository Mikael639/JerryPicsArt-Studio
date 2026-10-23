import PageIntro from "../../components/ui/PageIntro";
import ReferencesBand from "../../components/ui/ReferencesBand";
import Series from "../../components/ui/Series";
import Steps from "../../components/ui/Steps";
import Reveal from "../../components/ui/Reveal";
import OfferCards from "../../components/ui/OfferCards";
import ContactBlock from "../../components/ui/ContactBlock";
import DarkChapter from "../../components/ui/DarkChapter";
import TrackedLink from "../../components/ui/TrackedLink";
import { pickSeries } from "../../data/series";
import { loadSeries } from "../../lib/loadSeries";
import { getReferences } from "../../lib/siteContent";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Photographe pour événements d'entreprise et lieux à Paris",
    description:
      "Photographe pour hôtels, lieux de réception et entreprises à Paris : contrat, droits d'usage, facture HT, tarif partenaire.",
    path: "/entreprises",
    imageFrom: (photo) => photo.category === "Studio",
  });
}

const steps = [
  { titre: "Brief", texte: "Objectifs, public, déroulé et usages prévus des images." },
  { titre: "Couverture", texte: "Une présence discrète, au service de vos équipes et de vos invités." },
  { titre: "Livraison", texte: "Images retouchées, livrées dans les délais annoncés." },
  { titre: "Facture", texte: "Facture HT, droits d'usage écrits dans le contrat." },
];

const pricing = [
  { titre: "Demi-journée", prix: "650 € HT" },
  { titre: "Journée", prix: "1 100 € HT", miseEnAvant: true },
];

const guarantees = [
  "Assurance responsabilité civile professionnelle",
  "Contrat pour chaque prestation",
  "Second photographe sur les grands formats",
];

export default async function EntreprisesPage() {
  const [allSeries, references] = await Promise.all([loadSeries(), getReferences()]);
  const studio = pickSeries(allSeries, "entreprise", 1);

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow="Entreprises & lieux"
        title="Photographe pour événements d'entreprise et lieux de réception à Paris"
        lead="Un photographe fiable pour vos événements et vos clients."
        cta={{ href: "/contact?type=entreprise", label: "Réserver un appel de 15 minutes", event: "appel_15_minutes" }}
      />

      <ReferencesBand items={references} />

      <section className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-2 md:px-8">
        <Reveal className="rounded-card border border-line/15 bg-white/60 p-8">
          <h2 className="font-serif text-3xl tracking-tight">Pour les lieux et hôtels</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70 md:text-lg">
            Un photographe que vous recommandez à vos clients sans risque : il connaît votre établissement et respecte
            vos équipes.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="rounded-card border border-line/15 bg-white/60 p-8">
          <h2 className="font-serif text-3xl tracking-tight">Pour les agences et entreprises</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70 md:text-lg">
            Brief, couverture, livraison, droits d&apos;usage écrits, facture HT.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
        <Reveal>
          <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">Comment ça se passe</h2>
        </Reveal>
        <Steps steps={steps} />
      </section>

      <DarkChapter>
        <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">Tarifs</h2>
          </Reveal>
          <OfferCards offers={pricing} columns="md:grid-cols-2" />
          <p className="text-base text-ink/70">Tarif partenaire : −10 % dès 5 prestations par an.</p>
        </section>

        <section className="mx-auto max-w-7xl space-y-6 px-4 md:px-8">
          <Reveal>
            <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Garanties</h2>
          </Reveal>
          <ul className="grid gap-3 md:grid-cols-3">
            {guarantees.map((item) => (
              <li key={item} className="rounded-inset border border-line/15 bg-white/50 px-6 py-5 text-base text-ink/80">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-12">
          <section className="mx-auto max-w-7xl space-y-3 px-4 md:px-8">
            <Reveal>
              <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">
                Portrait et contenu de marque
              </h2>
              <p className="mt-4 text-base text-ink/70 md:text-lg">
                Portrait à partir de 400 €. Contenu de marque à partir de 750 € HT. <a href="/contact?type=contenu" className="underline underline-offset-4 hover:text-ink">Demander un devis shooting</a>.
              </p>
            </Reveal>
          </section>
          {studio.map((serie) => (
            <Series key={serie.slug} serie={serie} />
          ))}
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
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">Dossier B2B</span>
            </div>
            <div className="space-y-3 text-center md:text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/45">Document à partager</p>
              <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">Le dossier B2B de JerryPicsArt</h2>
              <p className="max-w-xl text-base leading-relaxed text-ink/70">
                Un document à transmettre à vos équipes, à votre direction ou à vos clients. Format PDF, lisible sur
                téléphone.
              </p>
            </div>
            <TrackedLink
              href="/dossier-b2b-jerrypicsart.pdf"
              event="telechargement_dossier_b2b"
              className="mx-auto inline-flex flex-col items-center rounded-full border border-ink px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper md:mx-0"
            >
              Télécharger le PDF
            </TrackedLink>
          </Reveal>
        </section>

        <ContactBlock
          title="Parlons de vos événements"
          text="Un appel de 15 minutes suffit pour cadrer votre besoin."
          label="Réserver un appel de 15 minutes"
          href="/contact?type=entreprise"
          event="appel_15_minutes"
        />
      </DarkChapter>
    </div>
  );
}
