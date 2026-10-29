"use client";

import Image from "next/image";
import { partners } from "../home/homeShared";

// Bande « Ils nous ont fait confiance » des Entreprises & lieux : logos monochromes (gris), hauteur identique.
// Quand le logo officiel n'est pas encore fourni, le nom s'affiche en texte (même typographie), jamais un logo redessiné.
// Statique : grille centrée sur ordinateur, défilement au doigt sur téléphone, aucune animation automatique.
const LOGO_FILES = Object.fromEntries(partners.map((partner) => [partner.name, partner]));

// Hauteur de chaque logo, réglée pour que leur poids visuel soit équilibré (certains sont très larges).
const LOGO_HEIGHT = {
  Printemps: "h-4 md:h-5",
  "Rolling Stone Africa": "h-6 md:h-7",
  "Galeries Lafayette": "h-8 md:h-10",
  "Sofitel Le Scribe": "h-8 md:h-9",
  "Taptap Send": "h-10 md:h-12",
  "Les Flammes": "h-9 md:h-11",
  NWE: "h-10 md:h-12",
};

const CLIENTS = [
  "Kering Eyewear",
  "Espace Grand Paris",
  "UNESCO",
  "Taptap Send",
  "Sofitel Le Scribe",
  "Galeries Lafayette",
  "Printemps",
  "Les Flammes",
  "Rolling Stone Africa",
  "NWE",
  "Decathlon",
  "Valéo",
];

export default function ClientsBand({ title }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8" aria-labelledby="clients-titre">
      <p id="clients-titre" className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-ink/45 md:mb-6">
        {title}
      </p>
      <ul className="no-scrollbar -mx-4 flex snap-x scroll-px-4 items-center gap-10 overflow-x-auto px-4 py-2 md:mx-0 md:flex-wrap md:justify-center md:gap-x-14 md:gap-y-8 md:overflow-visible md:px-0">
        {CLIENTS.map((name) => {
          const partner = LOGO_FILES[name];
          return (
            <li key={name} className="flex h-12 shrink-0 snap-start items-center md:h-14">
              {partner ? (
                <Image
                  src={partner.logo}
                  alt={name}
                  width={partner.width}
                  height={partner.height}
                  className={`${LOGO_HEIGHT[name] || "h-10 md:h-12"} w-auto object-contain opacity-55 brightness-0`}
                />
              ) : (
                <span className="whitespace-nowrap font-serif text-xl leading-none tracking-tight text-ink/55 md:text-2xl">
                  {name}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
