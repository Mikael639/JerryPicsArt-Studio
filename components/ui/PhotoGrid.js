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

export function isLandscapePhoto(photo) {
  return (photo.width || FALLBACK_WIDTH) > (photo.height || FALLBACK_HEIGHT);
}

// Visionneuse partagée par une série de photos : `open(index)` l'ouvre, `viewer` est à placer dans la page.
export function usePhotoViewer(images) {
  const [activeIndex, setActiveIndex] = useState(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () => setActiveIndex((index) => (index === null ? null : index === 0 ? images.length - 1 : index - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIndex((index) => (index === null ? null : index === images.length - 1 ? 0 : index + 1)),
    [images.length]
  );

  const viewer = (
    <Lightbox photos={images} activeIndex={activeIndex} onClose={close} onPrev={prev} onNext={next} onSelect={setActiveIndex} />
  );

  return { open: setActiveIndex, viewer };
}

// Fondu de 200 ms à l'arrivée de la photo : le seul effet autorisé hors accueil (voir .photo-fade).
function FadeImage({ photo, priority, sizes, className = "", style }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width || FALLBACK_WIDTH}
      height={photo.height || FALLBACK_HEIGHT}
      priority={priority}
      sizes={sizes}
      quality={85}
      onLoad={() => setLoaded(true)}
      data-loaded={loaded ? "" : undefined}
      className={`photo-fade ${className}`}
      style={style}
    />
  );
}

function GridPhoto({ photo, index, onOpen, priority, openLabel }) {
  // Sur téléphone (2 colonnes), une photo horizontale occupe toute la largeur, une verticale une colonne.
  const isLandscape = isLandscapePhoto(photo);

  return (
    <figure className={`break-inside-avoid sm:mb-4 ${isLandscape ? "col-span-2 sm:col-span-1" : ""}`}>
      <button
        type="button"
        onClick={() => onOpen(index)}
        data-cursor="gallery-item"
        aria-label={openLabel}
        className="group relative block w-full overflow-hidden rounded-[0.8rem] bg-ink/5 text-left"
      >
        <FadeImage
          photo={photo}
          priority={priority}
          sizes={
            isLandscape
              ? "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 420px"
              : "(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 420px"
          }
          className="block h-auto w-full"
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

// Grille de photos déjà choisies : `items` = [{ photo, index }] où `index` est la position dans la visionneuse.
export function PhotoTiles({ items, onOpen, priority = false }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:-mb-4 sm:block sm:columns-2 sm:gap-4 lg:columns-3">
      {items.map(({ photo, index }, position) => (
        <GridPhoto
          key={photo.id || photo.src}
          photo={photo}
          index={index}
          onOpen={onOpen}
          priority={priority && position < 2}
          openLabel={copy.openPhoto(photo.alt)}
        />
      ))}
    </div>
  );
}

// Photo mise en avant (ouverture d'un univers) : format d'origine, hauteur limitée à 70 % de l'écran.
export function FeaturedPhoto({ photo, index, onOpen, priority = false }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;
  const isLandscape = isLandscapePhoto(photo);

  return (
    <figure>
      <button
        type="button"
        onClick={() => onOpen(index)}
        data-cursor="gallery-item"
        aria-label={copy.openPhoto(photo.alt)}
        className="group relative mx-auto block w-fit max-w-full overflow-hidden rounded-[0.8rem] bg-ink/5"
      >
        <FadeImage
          photo={photo}
          priority={priority}
          sizes={isLandscape ? "(max-width: 1280px) 100vw, 1200px" : "(max-width: 767px) 90vw, 560px"}
          className="block h-auto w-auto max-h-[70svh] max-w-full"
        />
        <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
      </button>
      {photo.caption ? (
        <figcaption className="mt-1.5 hidden text-center text-[12px] italic leading-snug text-ink/55 sm:block">{photo.caption}</figcaption>
      ) : null}
    </figure>
  );
}

// Deux photos verticales côte à côte, en grand (reste sur deux colonnes sur téléphone).
export function PhotoPair({ items, onOpen }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:gap-4">
      {items.map(({ photo, index }) => (
        <figure key={photo.id || photo.src}>
          <button
            type="button"
            onClick={() => onOpen(index)}
            data-cursor="gallery-item"
            aria-label={copy.openPhoto(photo.alt)}
            className="group relative block w-full overflow-hidden rounded-[0.8rem] bg-ink/5"
          >
            <FadeImage photo={photo} sizes="(max-width: 767px) 50vw, 620px" className="block h-auto w-full" />
            <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
          </button>
          {photo.caption ? (
            <figcaption className="mt-1.5 hidden text-[12px] italic leading-snug text-ink/55 sm:block">{photo.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

// Bouton texte « Voir les N photos » : ouvre la visionneuse sur la première photo.
export function SeeAllButton({ count, onClick }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;

  return (
    <div className="mt-8 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="-my-2.5 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink/70 underline decoration-ink/25 underline-offset-[6px] transition-colors hover:text-ink hover:decoration-ink"
      >
        {copy.expandAll(count)}
      </button>
    </div>
  );
}

// Grille éditoriale fixe : 3 colonnes sur ordinateur, 2 sur tablette et sur téléphone, format d'origine
// de chaque photo. Aucune animation au défilement ; seul un fondu de 200 ms à l'arrivée de chaque photo.
// Au-delà de 12 photos, les suivantes ne sont visibles que dans la visionneuse.
export default function PhotoGrid({ images, priority = false, limit = MAX_GRID_PHOTOS }) {
  const { open, viewer } = usePhotoViewer(images);
  const items = images.slice(0, limit).map((photo, index) => ({ photo, index }));

  if (!images.length) return null;

  return (
    <>
      <PhotoTiles items={items} onOpen={open} priority={priority} />
      {images.length > items.length ? <SeeAllButton count={images.length} onClick={() => open(0)} /> : null}
      {viewer}
    </>
  );
}
