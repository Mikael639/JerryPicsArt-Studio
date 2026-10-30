"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useMarqueeSlowdown } from "../home/homeShared";

// Bande « Ils nous ont fait confiance » (Événements, Entreprises & lieux) : logos monochromes (gris) qui défilent
// doucement, comme sur l'accueil (le défilement ralentit au survol). Sans défilement si « réduire les animations ».
// Quand le logo officiel n'est pas encore fourni, le nom s'affiche en texte, jamais un logo redessiné.
// Liste et logos : modifiables dans l'administration (Logos clients), valeurs par défaut dans data/clients.js.

// Hauteur de chaque logo livré avec le site, réglée pour équilibrer leur poids visuel (certains sont très larges).
const LOGO_HEIGHT = {
  Printemps: "h-4 md:h-5",
  Decathlon: "h-4 md:h-5",
  UNESCO: "h-6 md:h-7",
  "Rolling Stone Africa": "h-6 md:h-7",
  "Kering Eyewear": "h-7 md:h-8",
  "Galeries Lafayette": "h-8 md:h-10",
  "Sofitel Le Scribe": "h-8 md:h-9",
  "Espace Grand Paris": "h-8 md:h-9",
  Valéo: "h-8 md:h-9",
  Valeo: "h-8 md:h-9",
  "Taptap Send": "h-10 md:h-12",
  "Les Flammes": "h-9 md:h-11",
  NWE: "h-10 md:h-12",
};

function Logo({ client }) {
  if (client.logo && client.width && client.height) {
    return (
      <Image
        src={client.logo}
        alt={client.name}
        width={client.width}
        height={client.height}
        // Logos très légers : chargés tout de suite (en différé, certains restaient vides).
        loading="eager"
        // Logos livrés avec le site : déjà petits, servis tels quels (pas besoin de l'optimiseur d'images).
        unoptimized={client.logo.startsWith("/")}
        className={`${LOGO_HEIGHT[client.name] || "h-10 md:h-12"} w-auto object-contain ${
          // Logos envoyés depuis l'administration (en couleur, souvent sur fond blanc) : passés en gris,
          // le fond blanc disparaît. Logos livrés avec le site (blancs sur transparent) : passés en gris foncé.
          client.logo.startsWith("http") ? "opacity-70 grayscale mix-blend-multiply" : "opacity-55 brightness-0"
        }`}
      />
    );
  }

  return (
    <span className="whitespace-nowrap font-serif text-xl leading-none tracking-tight text-ink/55 md:text-2xl">
      {client.name}
    </span>
  );
}

export default function ClientsBand({ title, items = [] }) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  useMarqueeSlowdown(trackRef, containerRef);

  if (!items.length) return null;

  // Défilement : la liste est doublée et la piste glisse d'une moitié (voir .partners-track). Chaque logo porte une
  // marge de chaque côté (et non un « gap ») pour que la boucle retombe exactement au point de départ.
  const loop = reduceMotion ? items : [...items, ...items];

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8" aria-labelledby="clients-titre">
      <p id="clients-titre" className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-ink/45 md:mb-6">
        {title}
      </p>
      <div ref={containerRef} className={reduceMotion ? "overflow-x-auto" : "partners-mask overflow-hidden"}>
        <ul
          ref={trackRef}
          className={`flex items-center py-2 ${reduceMotion ? "w-max min-w-full justify-center" : "partners-track w-max"}`}
        >
          {loop.map((client, index) => (
            <li
              key={`${client.name}-${index}`}
              aria-hidden={index >= items.length ? "true" : undefined}
              className="mx-6 flex h-12 shrink-0 items-center md:mx-8 md:h-14"
            >
              <Logo client={client} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
