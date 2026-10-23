import LegalPage from "../../components/ui/LegalPage";
import { showPlaceholders } from "../../data/placeholders";
import { siteConfig } from "../../lib/siteConfig";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Politique de confidentialité — JerryPicsArt",
    description: "Comment JerryPicsArt utilise les données recueillies par le formulaire de contact.",
    path: "/confidentialite",
  });
}

export default function ConfidentialitePage() {
  const duree = showPlaceholders
    ? "[À FOURNIR : durée de conservation des données]"
    : "Elles sont conservées le temps nécessaire au traitement de votre demande, puis supprimées.";

  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Cette page explique quelles données sont recueillies par le formulaire de contact, pourquoi, et comment exercer vos droits."
      sections={[
        {
          titre: "Données collectées",
          paragraphes: [
            "Le formulaire de contact recueille : votre profil (particulier, lieu, agence, entreprise ou marque), votre nom et prénom, votre adresse e-mail, votre téléphone si vous le renseignez, le type de prestation, la date, le lieu, le nombre d'invités, votre budget indicatif, la manière dont vous m'avez connu et votre message.",
          ],
        },
        {
          titre: "Finalité",
          paragraphes: [
            "Ces données servent uniquement à répondre à votre demande et à vous adresser un devis. Elles ne sont jamais revendues.",
          ],
        },
        {
          titre: "Durée de conservation",
          paragraphes: [duree],
        },
        {
          titre: "Vos droits",
          paragraphes: [
            "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
            `Pour l'exercer, écrivez à ${siteConfig.email}.`,
          ],
        },
        {
          titre: "Mesure d'audience",
          paragraphes: [
            "Ce site utilise Vercel Analytics pour mesurer la fréquentation et certains clics (formulaire, dossier B2B). Cet outil ne dépose pas de cookie et ne permet pas de vous identifier.",
          ],
        },
      ]}
    />
  );
}
