"use client";

import Image from "next/image";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Lightbox from "../Lightbox";
import RevealOnView from "./RevealOnView";
import { UI_COPY } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

const MAX_GRID_PHOTOS = 6;
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
      quality={75}
      onLoad={() => setLoaded(true)}
      data-loaded={loaded ? "" : undefined}
      className={`photo-fade ${className}`}
      style={style}
    />
  );
}

function GridPhoto({ photo, index, onOpen, priority, openLabel, alone = false, flush = false }) {
  // Sur téléphone (2 colonnes), une photo horizontale occupe toute la largeur, une verticale une colonne.
  const isLandscape = isLandscapePhoto(photo);

  return (
    <RevealOnView
      as="figure"
      delay={(index % 3) * 0.08}
      className={`break-inside-avoid ${flush ? "" : "sm:mb-4"} ${isLandscape || alone ? "col-span-2 sm:col-span-1" : ""}`}
    >
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
      {/* Les légendes ne sont plus sous les photos : elles s'affichent dans la visionneuse (clic sur la photo). */}
    </RevealOnView>
  );
}

// Vrai sur ordinateur (écran large). Faux au premier affichage, puis mis à jour : la page se charge d'abord avec la
// grille de téléphone et de tablette, puis passe aux colonnes de l'ordinateur.
const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(DESKTOP_QUERY);
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

// Meilleure répartition de photos (rapports hauteur/largeur) en `count` colonnes : celle où la colonne la plus haute
// et la plus basse sont le plus proches. Essaie toutes les répartitions (la première photo reste en colonne 1, les
// colonnes étant interchangeables) ; au-delà de 12 photos, place chaque photo dans la colonne la moins haute.
function bestAssignment(ratios, count) {
  const heights = new Array(count).fill(0);
  const assignment = new Array(ratios.length).fill(0);

  if (ratios.length > 12) {
    ratios.forEach((ratio, position) => {
      const column = heights.indexOf(Math.min(...heights));
      assignment[position] = column;
      heights[column] += ratio;
    });
    return { assignment, spread: Math.max(...heights) - Math.min(...heights), tallest: Math.max(...heights) };
  }

  let best = { assignment, spread: Infinity, tallest: 0 };
  const current = new Array(ratios.length).fill(0);
  const search = (position) => {
    if (position === ratios.length) {
      const spread = Math.max(...heights) - Math.min(...heights);
      if (spread < best.spread - 1e-9) best = { assignment: [...current], spread, tallest: Math.max(...heights) };
      return;
    }
    const limit = position === 0 ? 1 : count;
    for (let column = 0; column < limit; column += 1) {
      heights[column] += ratios[position];
      current[position] = column;
      search(position + 1);
      heights[column] -= ratios[position];
    }
  };
  search(0);
  return best;
}

// Répartit les photos en colonnes sur ordinateur. Les photos gardent leur hauteur naturelle (rien n'est recadré),
// mais les colonnes finissent à peu près à la même hauteur : plus de grand vide à droite en bas de la grille.
// 2 photos : 2 colonnes, 3 : 3, 4 : 4. Au-delà, 3 colonnes ; si elles ne peuvent pas se remplir (10 photos
// verticales : 4 + 3 + 3), on passe à 2 colonnes quand le vide en bas devient moitié moindre.
function buildColumns(items) {
  const ratios = items.map(({ photo }) => (photo.height || FALLBACK_HEIGHT) / (photo.width || FALLBACK_WIDTH));
  let count = items.length <= 4 ? items.length : 3;
  let { assignment, spread } = bestAssignment(ratios, count);

  // Le vide en bas se mesure en largeur de colonne : un écart de hauteur pèse plus en 2 colonnes (larges) qu'en 3.
  if (items.length > 4 && spread / count > 0.15) {
    const alternative = bestAssignment(ratios, 2);
    if (alternative.spread / 2 < (spread / count) * 0.5) {
      count = 2;
      ({ assignment } = alternative);
    }
  }

  const columns = Array.from({ length: count }, () => []);
  items.forEach((item, position) => columns[assignment[position]].push(item));
  return columns.filter((column) => column.length);
}

// Grille de photos déjà choisies : `items` = [{ photo, index }] où `index` est la position dans la visionneuse.
export function PhotoTiles({ items, onOpen, priority = false }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;
  const isDesktop = useIsDesktop();
  const itemsKey = items.map(({ photo }) => photo.id || photo.src).join("|");
  // Le calcul des colonnes ne se refait que si la liste de photos change (pas à chaque ouverture de la visionneuse).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => (isDesktop && items.length >= 2 ? buildColumns(items) : null), [isDesktop, itemsKey]);

  // Ordinateur, 2 photos ou plus : colonnes remplies sur toute la largeur, hauteurs naturelles.
  if (columns) {
    let position = 0;
    return (
      <div className="mx-auto flex items-start gap-4">
        {columns.map((column) => (
          <div key={column[0].photo.id || column[0].photo.src} className="flex min-w-0 flex-1 flex-col gap-4">
            {column.map(({ photo, index }) => (
              <GridPhoto
                flush
                key={photo.id || photo.src}
                photo={photo}
                index={index}
                onOpen={onOpen}
                priority={priority && position++ < 2}
                openLabel={copy.openPhoto(photo.alt)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Téléphone et tablette : deux colonnes ; une photo seule ne s'étire pas sur toute la largeur.
  const layout =
    {
      1: "max-w-[78%] sm:columns-1 sm:max-w-sm lg:columns-1",
    }[items.length] || "sm:columns-2";

  return (
    <div className={`mx-auto grid grid-cols-2 gap-1.5 sm:-mb-4 sm:block sm:gap-4 ${layout}`}>
      {items.map(({ photo, index }, position) => (
        <GridPhoto
          key={photo.id || photo.src}
          photo={photo}
          index={index}
          onOpen={onOpen}
          priority={priority && position < 2}
          openLabel={copy.openPhoto(photo.alt)}
          alone={items.length === 1}
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
    <RevealOnView as="figure">
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
    </RevealOnView>
  );
}

// Deux photos verticales côte à côte, en grand (reste sur deux colonnes sur téléphone).

export function PhotoPair({ items, onOpen }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:gap-4">
      {items.map(({ photo, index }, position) => (
        <RevealOnView as="figure" key={photo.id || photo.src} delay={position * 0.1}>
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
        </RevealOnView>
      ))}
    </div>
  );
}

// Bouton texte « Voir les N photos » / « Réduire » : déplie ou replie la suite de la grille, au choix du visiteur.
export function SeeAllButton({ count, expanded = false, onClick }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;

  return (
    <div className="mt-8 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="-my-2.5 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink/70 underline decoration-ink/25 underline-offset-[6px] transition-colors hover:text-ink hover:decoration-ink"
      >
        {expanded ? copy.collapse : copy.expandAll(count)}
      </button>
    </div>
  );
}

// Grille éditoriale fixe : 3 colonnes sur ordinateur, 2 sur tablette et sur téléphone, format d'origine
// de chaque photo. Aucune animation au défilement ; seul un fondu de 200 ms à l'arrivée de chaque photo.
// Au-delà de 12 photos, les suivantes ne sont visibles que dans la visionneuse.
export default function PhotoGrid({ images, priority = false, limit = MAX_GRID_PHOTOS }) {
  const { open, viewer } = usePhotoViewer(images);
  const [expanded, setExpanded] = useState(false);
  const items = (expanded ? images : images.slice(0, limit)).map((photo, index) => ({ photo, index }));

  if (!images.length) return null;

  return (
    <>
      <PhotoTiles items={items} onOpen={open} priority={priority} />
      {images.length > limit ? (
        <SeeAllButton count={images.length} expanded={expanded} onClick={() => setExpanded((value) => !value)} />
      ) : null}
      {viewer}
    </>
  );
}
