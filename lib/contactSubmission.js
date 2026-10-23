import { qualifyRequest } from "./contactValidation";

// Les champs propres au type de devis sont regroupés en tête du message pour ne pas modifier la base existante.
function composeProject(fields, qualification) {
  return [
    `Statut : [${qualification}]`,
    `Type de devis : ${fields.typeLabel}`,
    `Vous êtes : ${fields.audience}`,
    ...fields.details.map(([label, value]) => `${label} : ${value}`),
    `Comment m'a connu : ${fields.source}`,
    "",
    "Message :",
    fields.project,
  ].join("\n");
}

// Partagé par le formulaire (server action) et l'API /api/contact :
// calcule le statut de la demande et prépare l'enregistrement.
export function prepareContactSubmission(fields) {
  const qualification = qualifyRequest(fields);

  const record = {
    name: fields.name,
    email: fields.email,
    company: "",
    phone: fields.phone,
    serviceType: fields.serviceType,
    preferredContact: "Email",
    budget: fields.budget,
    eventDate: fields.eventDate,
    location: fields.location,
    referenceLink: "",
    project: composeProject(fields, qualification),
  };

  return { qualification, record, emailExtras: { ...fields, qualification } };
}
