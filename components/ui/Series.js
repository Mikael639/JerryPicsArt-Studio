"use client";

import Reveal from "./Reveal";
import BridgeCta from "./BridgeCta";
import PhotoGrid from "./PhotoGrid";
import { showPlaceholders } from "../../data/placeholders";
import { translateSerie, UI_COPY } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

// Bloc série (Mariage, collections) : titre, saison, lieu, contexte, grille fixe de photos, visionneuse.
export default function Series({ serie, withBridge = false, priority = false }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.series || UI_COPY.fr.series;
  const localizedSerie = translateSerie(serie, lang);
  const meta = [localizedSerie.saison, localizedSerie.lieu].filter(Boolean).join(" · ");

  return (
    <article id={serie.slug} className="mx-auto max-w-7xl scroll-mt-28 px-4 md:px-8">
      <Reveal className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          {meta ? <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/45">{meta}</p> : null}
          <h3 className="font-serif text-3xl leading-[1] tracking-[-0.03em] md:text-5xl">{localizedSerie.titre}</h3>
          {localizedSerie.contexte ? (
            <p className="max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">{localizedSerie.contexte}</p>
          ) : showPlaceholders ? (
            <p className="text-sm text-accent">{copy.placeholderContext}</p>
          ) : null}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ink/40">
          {serie.images.length} {copy.photosUnit}
        </p>
      </Reveal>

      <PhotoGrid images={serie.images} priority={priority} />

      {withBridge ? <BridgeCta serie={serie.slug} /> : null}
    </article>
  );
}
