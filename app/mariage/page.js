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
import { loadSeries } from "../../lib/loadSeries";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Photographe de mariage haut de gamme à Paris | JerryPicsArt",
    description:
      "Votre mariage photographié comme un éditorial. Formules à partir de 1 500 €. Vérifiez la disponibilité de votre date.",
    path: "/mariage",
    imageFrom: (photo) => photo.category === "Fashion Wedding",
  });
}

const steps = [
  {
    titre: "Rencontre",
    texte: "Rendez-vous en visio ou en présentiel pour faire connaissance et comprendre votre histoire.",
  },
  {
    titre: "Préparation",
    texte: "Questionnaire, moodboard de vos envies, planning photo construit ensemble.",
  },
  {
    titre: "Jour J",
    texte: "Présence discrète, direction de pose naturelle, aucune image figée.",
  },
  {
    titre: "Livraison",
    texte: "Galerie en ligne privée, images retouchées une à une.",
  },
];

const offers = [
  {
    titre: "Essentiel",
    prix: "1 500 €",
    inclus: [
      "Rendez-vous découverte en visio ou en présentiel",
      "Questionnaire de préparation",
      "6 h de couverture (cérémonie, cocktail, photos de groupe)",
      "Environ 300 images retouchées",
      "Galerie en ligne livrée sous 4 semaines",
    ],
  },
  {
    titre: "Signature",
    prix: "2 400 €",
    miseEnAvant: true,
    inclus: [
      "Tout l'Essentiel",
      "Rendez-vous de préparation",
      "Moodboard personnalisé",
      "Planning photo construit ensemble",
      "10 h de couverture (des préparatifs à l'ouverture de bal)",
      "Séance couple éditoriale le jour J",
      "Environ 500 images",
      "Galerie sous 3 semaines",
    ],
  },
  {
    titre: "Prestige",
    prix: "3 500 €",
    inclus: [
      "Tout le Signature",
      "Repérage du lieu",
      "Séance avant le mariage",
      "Second photographe",
      "Journée complète",
      "Environ 800 images",
      "Sélection express pour les réseaux le soir même",
      "Galerie sous 3 semaines",
    ],
  },
];

const faq = [
  {
    question: "Comment se passe le versement de l'acompte ?",
    reponse: "Un acompte de 30 % est demandé à la réservation pour bloquer votre date.",
  },
  {
    question: "Comment se déroulent les rendez-vous ?",
    reponse:
      "Nous nous rencontrons d'abord en visio ou en présentiel. Avec les formules Signature et Prestige, un rendez-vous de préparation permet de construire ensemble le moodboard et le planning photo.",
  },
  {
    question: "Vous déplacez-vous en dehors de Paris ?",
    reponse:
      "Oui. Paris est ma base, mais je me déplace régulièrement en France et à l'international. Les déplacements font l'objet d'une ligne séparée sur le devis.",
  },
  {
    question: "Un second photographe est-il possible ?",
    reponse: "Oui. Il est inclus dans la formule Prestige.",
  },
  {
    question: "Combien d'images recevrons-nous ?",
    reponse: "Environ 300 images avec l'Essentiel, 500 avec le Signature et 800 avec le Prestige.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    reponse:
      "La galerie en ligne est livrée sous 4 semaines avec l'Essentiel et sous 3 semaines avec les formules Signature et Prestige. La formule Prestige inclut une sélection express le soir même.",
  },
];

export default async function MariagePage() {
  const series = pickSeries(await loadSeries(), "mariage", 3);

  return (
    <div className="page-shell space-y-16 md:space-y-24">
      <PageIntro
        eyebrow="Mariage"
        title="Photographe de mariage haut de gamme à Paris"
        lead="Votre mariage, photographié comme un éditorial."
        bridge="Le regard de la Fashion Week, pour votre mariage : lumière éditoriale, direction de pose naturelle, aucune image figée."
        cta={{ href: "/contact?type=mariage", label: "Vérifier ma date", event: "verifier_ma_date" }}
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
              L&apos;expérience, du premier rendez-vous à la livraison
            </h2>
            <p className="text-base leading-relaxed text-ink/65 md:text-lg">
              Vous êtes accompagnés du début à la fin, pour vous projeter sereinement.
            </p>
          </Reveal>
          <Steps steps={steps} />
        </section>

        <section className="mx-auto max-w-7xl space-y-8 px-4 md:px-8">
          <Reveal>
            <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">Trois formules</h2>
          </Reveal>
          <OfferCards offers={offers} />
        </section>

        <Faq items={faq} />

        <Testimonials prestation="mariage" title="Ce que disent les mariés" />

        <ContactBlock
          title="Votre date est-elle disponible ?"
          text="Indiquez la date et le lieu de votre mariage. Réponse sous 24 à 48 h."
          label="Vérifier ma date"
          href="/contact?type=mariage"
          event="verifier_ma_date_final"
        />
      </DarkChapter>
    </div>
  );
}
