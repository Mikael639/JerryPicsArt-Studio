import { UNIVERS_PHOTOS } from "./universPhotos";

// Accueil, « Devant l'objectif » : six portraits, nom en légende. Photos tirées des univers (identifiant Drive).
const PORTRAITS = [
  { nom: "Michael Rainey Jr", driveId: "1w6vIu9BfXIVSWQt6OuhJnNHCKAh3h_Pb", alt: "Michael Rainey Jr. interviewé pendant la Paris Fashion Week" },
  { nom: "Davido", driveId: "15cdjHPLzWiPPs51gFUtWsZtgwJT9pf_V", alt: "Davido dans une rue de Paris pendant la Fashion Week" },
  { nom: "Djany", driveId: "1ktyfuSMHhTBzbwcNBa_KP5VAlbZNXoLn", alt: "Djany sur le tapis rouge de la cérémonie Les Flammes 2026" },
  { nom: "Denzel Ward", driveId: "1iE1HUOZyf9DrdHzV5FhpsxB6opX-GErW", alt: "Denzel Ward au défilé Amiri, Paris" },
  {
    nom: "Thierry Henry, Samuel Eto'o, Robert Pirès",
    driveId: "1IYzmwOZXjtW4KodPqeu2BX87AI94soGF",
    alt: "Thierry Henry, Samuel Eto'o et Robert Pirès sur la pelouse, Jubilé Robert Pirès",
    objectPosition: "50% center",
  },
  { nom: "Kristy Sarah", driveId: "184XPapIAUOeU8Sryu2P7587M-fqE4Gbv", alt: "Kristy Sarah en robe noire, Paris Fashion Week" },
];

export const PORTRAITS_ALSO = [
  "Jennifer Lopez",
  "Fally Ipupa",
  "Tems",
  "Dadju",
  "Doechii",
  "Tayc",
  "Olivia Yacé",
  "Russell Westbrook",
  "Elie Saab",
  "Amiri",
  "Georges Chakra",
];

export function getPortraits() {
  return PORTRAITS.map((item) => ({ ...item, ...UNIVERS_PHOTOS[item.driveId] })).filter((item) => item.src);
}
