"use client";

import Image from "next/image";
import { PORTRAITS_ALSO } from "../../data/portraits";
import { MotionBlock } from "./homeShared";

// « Devant l'objectif » : six portraits en légende nominative, puis une seule ligne de noms.
// Défilement au doigt sur téléphone (jamais automatique), trois par ligne sur ordinateur.
export default function Portraits({ items, title, alsoLabel, reduceMotion }) {
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8" aria-labelledby="portraits-titre">
      <MotionBlock reduceMotion={reduceMotion} className="mb-8 max-w-3xl">
        <h2 id="portraits-titre" className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
          {title}
        </h2>
      </MotionBlock>

      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0">
        {items.map((item) => (
          <li key={item.driveId} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-auto">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[0.8rem] bg-ink/5">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 639px) 44vw, (max-width: 767px) 30vw, 28vw"
                className="object-cover"
                style={{ objectPosition: item.objectPosition || "center 25%" }}
                quality={85}
              />
            </div>
            <p className="mt-2.5 text-[11px] font-bold uppercase leading-snug tracking-[0.18em] text-ink/65">{item.nom}</p>
          </li>
        ))}
      </ul>

      <p className="mt-7 max-w-4xl text-sm leading-relaxed text-ink/55">
        {alsoLabel} {PORTRAITS_ALSO.join(" · ")}…
      </p>
    </section>
  );
}
