"use client";

import Image from "next/image";

// Bande « Ils nous ont fait confiance » des Entreprises & lieux : logos monochromes (gris), hauteur équilibrée.
// Quand le logo officiel n'est pas encore fourni, le nom s'affiche en texte (même typographie), jamais un logo redessiné.
// Statique : grille centrée sur ordinateur, défilement au doigt sur téléphone, aucune animation automatique.
// Liste et logos : modifiables dans l'administration (Logos clients), valeurs par défaut dans data/clients.js.

// Hauteur de chaque logo livré avec le site, réglée pour équilibrer leur poids visuel (certains sont très larges).
const LOGO_HEIGHT = {
  Printemps: "h-4 md:h-5",
  "Rolling Stone Africa": "h-6 md:h-7",
  "Galeries Lafayette": "h-8 md:h-10",
  "Sofitel Le Scribe": "h-8 md:h-9",
  "Taptap Send": "h-10 md:h-12",
  "Les Flammes": "h-9 md:h-11",
  NWE: "h-10 md:h-12",
};

export default function ClientsBand({ title, items = [] }) {
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8" aria-labelledby="clients-titre">
      <p id="clients-titre" className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-ink/45 md:mb-6">
        {title}
      </p>
      <ul className="no-scrollbar -mx-4 flex snap-x scroll-px-4 items-center gap-10 overflow-x-auto px-4 py-2 md:mx-0 md:flex-wrap md:justify-center md:gap-x-14 md:gap-y-8 md:overflow-visible md:px-0">
        {items.map((client) => (
          <li key={client.name} className="flex h-12 shrink-0 snap-start items-center md:h-14">
            {client.logo && client.width && client.height ? (
              <Image
                src={client.logo}
                alt={client.name}
                width={client.width}
                height={client.height}
                className={`${LOGO_HEIGHT[client.name] || "h-10 md:h-12"} w-auto object-contain opacity-55 brightness-0`}
              />
            ) : (
              <span className="whitespace-nowrap font-serif text-xl leading-none tracking-tight text-ink/55 md:text-2xl">
                {client.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
