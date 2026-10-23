"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import Lightbox from "../Lightbox";
import Reveal from "./Reveal";
import BridgeCta from "./BridgeCta";
import { showPlaceholders } from "../../data/placeholders";

const INITIAL_COUNT = 8;

// Bloc série : titre, saison, lieu, contexte, grille d'images, ouverture en visionneuse.
export default function Series({ serie, withBridge = false, priority = false }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const images = serie.images;
  const visible = expanded ? images : images.slice(0, INITIAL_COUNT);
  const meta = [serie.saison, serie.lieu].filter(Boolean).join(" · ");

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () => setActiveIndex((index) => (index === null ? null : index === 0 ? images.length - 1 : index - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIndex((index) => (index === null ? null : index === images.length - 1 ? 0 : index + 1)),
    [images.length]
  );

  return (
    <article id={serie.slug} className="mx-auto max-w-7xl scroll-mt-28 px-4 md:px-8">
      <Reveal className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          {meta ? <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/45">{meta}</p> : null}
          <h3 className="font-serif text-3xl leading-[1] tracking-[-0.03em] md:text-5xl">{serie.titre}</h3>
          {serie.contexte ? (
            <p className="max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">{serie.contexte}</p>
          ) : showPlaceholders ? (
            <p className="text-sm text-accent">[À FOURNIR : une phrase de contexte pour cette série]</p>
          ) : null}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ink/40">{images.length} photos</p>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {visible.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            data-cursor="gallery-item"
            aria-label={`Ouvrir la photo : ${photo.alt}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-[0.8rem] bg-ink text-left"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading={priority && index < 4 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
              style={{ objectPosition: photo.objectPosition || "center center" }}
              quality={85}
            />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(12,10,8,0.3))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {images.length > INITIAL_COUNT ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-full border border-line/25 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:border-ink hover:bg-white"
          >
            {expanded ? "Réduire la série" : `Voir les ${images.length} photos`}
          </button>
        </div>
      ) : null}

      {withBridge ? <BridgeCta serie={serie.slug} /> : null}

      <Lightbox photos={images} activeIndex={activeIndex} onClose={close} onPrev={prev} onNext={next} onSelect={setActiveIndex} />
    </article>
  );
}
