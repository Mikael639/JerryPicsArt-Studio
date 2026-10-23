import PageIntro from "../../components/ui/PageIntro";
import ReferencesBand from "../../components/ui/ReferencesBand";
import Series from "../../components/ui/Series";
import Steps from "../../components/ui/Steps";
import Reveal from "../../components/ui/Reveal";
import OfferCards from "../../components/ui/OfferCards";
import ContactBlock from "../../components/ui/ContactBlock";
import { pickSeries } from "../../data/series";
import { loadSeries } from "../../lib/loadSeries";
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
  const studio = pickSeries(await loadSeries(), "entreprise", 1);

  return (
    <div className="page-shell space-y-16 pb-20 md:space-y-24">
      <PageIntro
        eyebrow="Entreprises & lieux"
        title="Photographe pour événements d'entreprise et lieux de réception à Paris"
        lead="Un photographe fiable pour vos événements et vos clients."
        cta={{ href: "/dossier-b2b-jerrypicsart.pdf", label: "Télécharger le dossier B2B", event: "telechargement_dossier_b2b" }}
        secondary={{ href: "/contact?type=entreprise", label: "Réserver un appel de 15 minutes" }}
      />

      <ReferencesBand />

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
          <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">Un déroulé en quatre étapes</h2>
        </Reveal>
        <Steps steps={steps} />
      </section>

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
        <Reveal className="flex flex-col gap-6 rounded-card border border-line/15 bg-white/60 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl space-y-2">
            <h2 className="font-serif text-3xl tracking-tight">Le dossier B2B</h2>
            <p className="text-base leading-relaxed text-ink/70">
              Prestations, tarifs et conditions réunis dans un seul document.
            </p>
          </div>
          <a
            href="/dossier-b2b-jerrypicsart.pdf"
            download
            className="inline-block rounded-full border border-ink px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Télécharger le PDF
          </a>
        </Reveal>
      </section>

      <ContactBlock
        title="Parlons de vos événements"
        text="Un appel de 15 minutes suffit pour cadrer votre besoin."
        label="Réserver un appel de 15 minutes"
        href="/contact?type=entreprise"
        event="appel_15_minutes"
      />
    </div>
  );
}
