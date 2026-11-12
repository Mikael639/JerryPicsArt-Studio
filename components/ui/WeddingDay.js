"use client";

import { Fragment } from "react";
import { FeaturedPhoto, isLandscapePhoto, PhotoTiles, usePhotoViewer } from "./PhotoGrid";
import PullQuote from "./PullQuote";
import { showPlaceholders } from "../../data/placeholders";

// Une étape de la journée : heure, titre, phrase à la deuxième personne, grande image puis le reste en grille.
// Sur ordinateur, quand la grande image est verticale, le texte se place à gauche et l'image à droite.
function Chapter({ chapter, priority }) {
  const { open, viewer } = usePhotoViewer(chapter.photos);
  const [lead, ...others] = chapter.photos;
  const sideBySide = lead ? !isLandscapePhoto(lead) : false;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8" aria-labelledby={`jour-${chapter.key}`}>
      <div className={sideBySide ? "grid lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-x-14" : ""}>
        <header className={`mb-6 max-w-3xl space-y-3 md:mb-8 ${sideBySide ? "lg:mb-0" : ""}`}>
          <p className="font-serif text-[15px] italic text-accent md:text-lg">{chapter.heure}</p>
          <h2 id={`jour-${chapter.key}`} className="font-serif text-3xl leading-[1] tracking-[-0.03em] md:text-5xl">
            {chapter.titre}
          </h2>
          <p className="max-w-[60ch] text-[17px] leading-relaxed text-ink/75 md:text-[21px] md:leading-[1.55]">{chapter.phrase}</p>
        </header>

        {lead ? <FeaturedPhoto photo={lead} index={0} onOpen={open} priority={priority} /> : null}
      </div>

      {others.length ? (
        // Deux photos seules seraient plus hautes que l'écran sur ordinateur : on limite leur largeur.
        <div className={`mt-4 md:mt-8 ${others.length === 2 ? "lg:mx-auto lg:max-w-4xl" : ""}`}>
          <PhotoTiles
            items={others.map((photo, index) => ({ photo, index: index + 1 }))}
            onOpen={open}
            tripleRow
          />
        </div>
      ) : null}

      {chapter.photos.length < 3 && showPlaceholders ? (
        <p className="mt-4 text-sm text-accent">[À FOURNIR : 3 à 6 photos pour « {chapter.titre} »]</p>
      ) : null}
      {viewer}
    </section>
  );
}

// Le récit d'une journée de mariage, dans l'ordre. `quoteBefore` place la citation en tête de ce bloc
// (entre le portrait et le cocktail, quand le récit est coupé en deux par le passage au mode sombre).
export default function WeddingDay({ chapters, quote, quoteBefore = false, priority = false }) {
  return (
    <div className="space-y-20 md:space-y-28">
      {quoteBefore ? <PullQuote text={quote} /> : null}
      {chapters.map((chapter, index) => (
        <Fragment key={chapter.key}>
          <Chapter chapter={chapter} priority={priority && index === 0} />
        </Fragment>
      ))}
    </div>
  );
}
