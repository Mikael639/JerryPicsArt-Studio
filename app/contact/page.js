import ContactExperience from "../../components/contact/ContactExperience";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Contact et devis — JerryPicsArt",
    description:
      "Demandez un devis pour votre mariage, votre événement ou votre événement d'entreprise à Paris. Réponse sous 24 à 48 h.",
    path: "/contact",
  });
}

export default async function ContactPage({ searchParams }) {
  const params = (await searchParams) || {};
  const type = typeof params.type === "string" ? params.type : "";
  return <ContactExperience type={type} />;
}
