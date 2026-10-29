"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import Lightbox from "../Lightbox";
import { UI_COPY } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

const MAX_GRID_PHOTOS = 12;
// Dimensions de repli pour les photos dont on ne connaît pas le format : la hauteur réelle
// est reprise par le navigateur dès le chargement (h-auto), la photo n'est jamais recadrée.
const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 1500;

function GridPhoto({ photo, index, onOpen, priority, openLabel }) {
  const [loaded, setLoaded] = useState(false);
  // Sur téléphone (2 colonnes), une photo horizontale occupe toute la largeur, une verticale une colonne.
  const isLandscape = (photo.width || FALLBACK_WIDTH) > (photo.height || FALLBACK_HEIGHT);

  return (
    <figure className={`break-inside-avoid sm:mb-4 ${isLandscape ? "col-span-2 sm:col-span-1" : ""}`}>
      <button
        type="button"
        onClick={() => onOpen(index)}
        data-cursor="gallery-item"
        aria-label={openLabel}
        className="group relative block w-full overflow-hidden rounded-[0.8rem] bg-ink/5 text-left"
      >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width || FALLBACK_WIDTH}
        height={photo.height || FALLBACK_HEIGHT}
        priority={priority && index < 2}
        sizes={
          isLandscape
            ? "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 420px"
            : "(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 420px"
        }
        quality={85}
        onLoad={() => setLoaded(true)}
        data-loaded={loaded ? "" : undefined}
        className="photo-fade block h-auto w-full"
      />
      <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
      </button>
      {/* Légende : visible dans la grille dès la tablette ; sur téléphone elle est dans la visionneuse. */}
      {photo.caption ? (
        <figcaption className="mt-1.5 hidden text-[12px] italic leading-snug text-ink/55 sm:block">{photo.caption}</figcaption>
      ) : null}
    </figure>
  );
}

// Grille éditoriale fixe : 3 colonnes sur ordinateur, 2 sur tablette et sur téléphone, format d'origine
// de chaque photo. Aucune animation au défilement ; seul un fondu de 200 ms à l'arrivée de chaque photo.
// Au-delà de 12 photos, les suivantes ne sont visibles que dans la visionneuse.
export default function PhotoGrid({ images, priority = false, limit = MAX_GRID_PHOTOS }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;
  const [activeIndex, setActiveIndex] = useState(null);
  const visible = images.slice(0, limit);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () => setActiveIndex((index) => (index === null ? null : index === 0 ? images.length - 1 : index - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIndex((index) => (index === null ? null : index === images.length - 1 ? 0 : index + 1)),
    [images.length]
  );

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-1.5 sm:-mb-4 sm:block sm:columns-2 sm:gap-4 lg:columns-3">
        {visible.map((photo, index) => (
          <GridPhoto
            key={photo.id || photo.src}
            photo={photo}
            index={index}
            onOpen={setActiveIndex}
            priority={priority}
            openLabel={copy.openPhoto(photo.alt)}
          />
        ))}
      </div>

      {images.length > visible.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setActiveIndex(0)}
            className="-my-2.5 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink/70 underline decoration-ink/25 underline-offset-[6px] transition-colors hover:text-ink hover:decoration-ink"
          >
            {copy.expandAll(images.length)}
          </button>
        </div>
      ) : null}

      <Lightbox photos={images} activeIndex={activeIndex} onClose={close} onPrev={prev} onNext={next} onSelect={setActiveIndex} />
    </>
  );
}
