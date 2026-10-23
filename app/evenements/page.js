import PageIntro from "../../components/ui/PageIntro";
import Series from "../../components/ui/Series";
import OfferCards from "../../components/ui/OfferCards";
import Faq from "../../components/ui/Faq";
import ContactBlock from "../../components/ui/ContactBlock";
import Reveal from "../../components/ui/Reveal";
import { findSeriesBySlugs, pickSeries } from "../../data/series";
import { showPlaceholders } from "../../data/placeholders";
import { loadSeries } from "../../lib/loadSeries";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Photographe événementiel à Paris : soirées, lancements, galas",
    description:
      "Photographe pour vos soirées, lancements et galas à Paris. Sélection express le soir même en option. Devis sous 48 h.",
    path: "/evenements",
    imageFrom: (photo) => photo.category === "Events",
  });
}

const covered = ["Soirées privées", "Lancements de produit", "Galas", "Avant-premières", "Fashion Week"];

const offers = [
  {
    titre: "Demi-journée",
    prix: "650 € HT",
    description: "Pour une soirée, un lancement ou une avant-première.",
  },
  {
    titre: "Journée",
    prix: "1 100 € HT",
    description: "Pour un gala, un événement de grande ampleur ou plusieurs temps forts.",
    miseEnAvant: true,
  },
];

const options = [
  { titre: "Sélection express le soir même", prix: "+ 200 € HT" },
  { titre: "Second photographe", prix: "+ 450 € HT" },
];

const faq = [
  {
    question: "Quels sont les droits d'usage des images ?",
    reponse: "Les droits d'usage sont précisés par écrit dans le contrat de chaque prestation.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    reponse: "Une sélection express le soir même est possible en option. La galerie complète est livrée sous 7 jours.",
  },
  {
    question: "Vous déplacez-vous en dehors de Paris ?",
    reponse:
      "Oui. Paris est ma base, mais je me déplace régulièrement en France et à l'international. Les déplacements font l'objet d'une ligne séparée sur le devis.",
  },
  {
    question: "Combien d'images sont livrées ?",
    reponse: "Le nombre d'images dépend de la durée de couverture et du type d'événement. Il est précisé dans le devis.",
  },
  {
    question: "Comment se passe la facturation ?",
    reponse: "Une facture est émise pour chaque prestation. TVA non applicable, article 293 B du CGI.",
  },
];

export default async function EvenementsPage() {
  const all = await loadSeries();
  const proof = findSeriesBySlugs(all, ["amiri", "elie-saab-haute-couture", "joya-l-avant-premiere", "les-flammes-2026"]);
  const proofSlugs = new Set(proof.map((serie) => serie.slug));
  const others = pickSeries(all, "evenement").filter((serie) => !proofSlugs.has(serie.slug)).slice(0, 3);

  return (
    <div className="page-shell space-y-16 pb-20 md:space-y-24">
      <PageIntro
        eyebrow="Événements"
        title="Photographe événementiel à Paris : soirées, lancements, galas"
        lead="L'énergie de vos événements, livrée à temps pour vos réseaux."
        bridge="La même exigence que sur les défilés de la Fashion Week, pour votre lancement ou votre soirée."
        cta={{ href: "/contact?type=evenement", label: "Demander un devis", event: "devis_evenement" }}
      />

      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <Reveal className="space-y-6">
          <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Événements couverts</h2>
          <ul className="flex flex-wrap gap-3">
            {covered.map((item) => (
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

      <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
        <Reveal>
          <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">Offre</h2>
        </Reveal>
        <OfferCards offers={offers} columns="md:grid-cols-2" />
        <div className="grid gap-3 md:grid-cols-2">
          {options.map((option) => (
            <div key={option.titre} className="flex items-center justify-between gap-4 rounded-inset border border-line/15 bg-white/50 px-6 py-4">
              <span className="font-serif text-xl">Option : {option.titre.toLowerCase()}</span>
              <span className="font-serif text-2xl">{option.prix}</span>
            </div>
          ))}
        </div>
        <p className="text-base text-ink/65">
          Sélection express le soir même en option. Galerie complète sous 7 jours.
          {showPlaceholders ? <span className="ml-2 text-accent">[À FOURNIR : confirmer le délai de livraison complète]</span> : null}
        </p>
      </section>

      <Faq items={faq} />

      <ContactBlock
        title="Parlons de votre événement"
        text="Date, lieu et format suffisent pour recevoir un devis. Réponse sous 24 à 48 h."
        href="/contact?type=evenement"
        event="devis_evenement_final"
      />
    </div>
  );
}
