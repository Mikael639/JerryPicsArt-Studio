import LegalPage from "../../components/ui/LegalPage";
import { siteConfig } from "../../lib/siteConfig";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Mentions légales | JerryPicsArt",
    description: "Mentions légales du site JerryPicsArt, photographe éditorial à Paris.",
    path: "/mentions-legales",
  });
}

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      sections={[
        {
          titre: "Éditeur du site",
          paragraphes: [
            `${siteConfig.legalName} (nom commercial : ${siteConfig.name}).`,
            "Statut : entrepreneur individuel (micro-entreprise).",
            "SIRET : 978 685 006 00014.",
            "TVA non applicable, article 293 B du CGI.",
            "Adresse : 3 allée de Dordogne, 91300 Massy.",
            `E-mail : ${siteConfig.email}.`,
          ],
        },
        {
          titre: "Hébergeur",
          paragraphes: [
            "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (https://vercel.com).",
          ],
        },
        {
          titre: "Propriété intellectuelle",
          paragraphes: [
            "Toutes les photographies présentes sur ce site sont protégées par le droit d'auteur.",
            "Toute reproduction, représentation ou diffusion, même partielle, est interdite sans autorisation écrite préalable.",
          ],
        },
      ]}
    />
  );
}
