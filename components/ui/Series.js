"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Lightbox from "../Lightbox";
import Reveal from "./Reveal";
import BridgeCta from "./BridgeCta";
import { showPlaceholders } from "../../data/placeholders";

const INITIAL_GRID_COUNT = 8;

function PhotoTile({ photo, index, onOpen, priority, reduceMotion }) {
  const delay = Math.min(index % 4, 3) * 0.08;

  // Le bouton est observé (visible à l'écran) ; le masque et le zoom sont animés sur ses enfants,
  // car un élément entièrement masqué par clip-path ne déclenche pas l'observation.
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      data-cursor="gallery-item"
      aria-label={`Ouvrir la photo : ${photo.alt}`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[0.8rem] bg-neutral-900 text-left"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        className="absolute inset-0"
        variants={{
          hidden: { clipPath: "inset(0 0 100% 0)" },
          visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { scale: 1.18 },
            visible: { scale: 1, transition: { duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            loading={priority && index < 4 ? "eager" : "lazy"}
            sizes="(max-width: 768px) 72vw, (max-width: 1024px) 44vw, 28vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
            style={{ objectPosition: photo.objectPosition || "center center" }}
            quality={85}
          />
        </motion.div>
      </motion.div>
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(12,10,8,0.3))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.button>
  );
}

// Bloc série : titre, saison, lieu, contexte, carrousel (ou grille) d'images, visionneuse.
export default function Series({ serie, withBridge = false, priority = false }) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [mode, setMode] = useState("carousel");
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const images = serie.images;
  const gridImages = expanded ? images : images.slice(0, INITIAL_GRID_COUNT);
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

  const updateProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 1);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(frame);
  }, [mode, updateProgress]);

  function slide(direction) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  }

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
        <div className="flex items-center gap-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-ink/40">{images.length} photos</p>
          {images.length > 4 ? (
            <button
              type="button"
              onClick={() => setMode((current) => (current === "carousel" ? "grid" : "carousel"))}
              className="-my-2.5 hidden py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline md:inline-block"
            >
              {mode === "carousel" ? "Voir en grille" : "Voir en défilé"}
            </button>
          ) : null}
        </div>
      </Reveal>

      {/* Le défilé n'existe que sur grand écran : sur téléphone, les photos sont toujours en grille. */}
      {mode === "carousel" ? (
        <div className="relative hidden md:block">
          <div
            ref={trackRef}
            onScroll={updateProgress}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1 md:-mx-8 md:gap-4 md:px-8"
          >
            {images.map((photo, index) => (
              <div key={photo.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-[28%]">
                <PhotoTile photo={photo} index={index} onOpen={setActiveIndex} priority={priority} reduceMotion={reduceMotion} />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative h-px flex-1 bg-ink/15">
              <div
                className="absolute inset-y-0 left-0 bg-ink/70 transition-[width] duration-300"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => slide(-1)}
                aria-label="Photos précédentes"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line/25 text-ink/70 transition hover:border-ink hover:text-ink"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => slide(1)}
                aria-label="Photos suivantes"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line/25 text-ink/70 transition hover:border-ink hover:text-ink"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {mode === "grid" || mode === "carousel" ? (
        <div className={mode === "carousel" ? "md:hidden" : ""}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {gridImages.map((photo, index) => (
              <PhotoTile key={photo.id} photo={photo} index={index} onOpen={setActiveIndex} priority={priority} reduceMotion={reduceMotion} />
            ))}
          </div>

          {images.length > INITIAL_GRID_COUNT ? (
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
        </div>
      ) : null}

      {withBridge ? <BridgeCta serie={serie.slug} /> : null}

      <Lightbox photos={images} activeIndex={activeIndex} onClose={close} onPrev={prev} onNext={next} onSelect={setActiveIndex} />
    </article>
  );
}
