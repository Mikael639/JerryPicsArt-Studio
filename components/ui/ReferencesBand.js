"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { references as defaultReferences } from "../../data/references";
import { UI_COPY } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

const COLUMN_KEYS = ["artistes", "personnalites", "mode"];

const LENS_META_BY_TYPE = {
  personnalite: "85MM F/1.4",
  maison: "50MM F/1.2",
  media: "50MM F/1.4",
  lieu: "35MM F/1.4",
};

const FOCUS_INTERVAL_MS = 2800;
const AUTO_TRAVEL_MS = 620;
const HOVER_TRAVEL_MS = 240;
const FLASH_MS = 600;

// Références en trois colonnes : artistes, personnalités, puis maisons, médias et lieux.
// Effet « Mise au point optique » (profondeur de champ f/1.4) :
// les noms hors champ prennent un léger flou de bokeh tandis que le sujet visé devient ultra-net.
export default function ReferencesBand({ items = defaultReferences, tone = "light", className = "" }) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.references || UI_COPY.fr.references;
  const dark = tone === "dark";
  const reduceMotion = useReducedMotion();
  const animated = !reduceMotion;

  const gridRef = useRef(null);
  const frameRef = useRef(null);
  const nameRefs = useRef(new Map());
  const targetRef = useRef(null);
  const hoverRef = useRef(false);
  const timersRef = useRef([]);
  const [target, setTarget] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [flashCount, setFlashCount] = useState(0);

  const itemByName = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      map.set(item.nom, item);
    }
    return map;
  }, [items]);

  const groups = useMemo(
    () =>
      COLUMN_KEYS.map((groupe) => ({
        groupe,
        titre: copy.columns[groupe] || groupe,
        names: items.filter((item) => item.groupe === groupe).map((item) => item.nom),
      })),
    [items, copy.columns]
  );

  const allNames = useMemo(() => groups.flatMap((group) => group.names), [groups]);
  const namesKey = allNames.join("|");

  // Place le cadre exactement sur le nom (coordonnées relatives à la grille).
  const placeFrame = useCallback((name) => {
    const grid = gridRef.current;
    const frame = frameRef.current;
    const element = nameRefs.current.get(name);
    if (!grid || !frame || !element) return;

    const gridBox = grid.getBoundingClientRect();
    const box = element.getBoundingClientRect();
    frame.style.width = `${box.width}px`;
    frame.style.height = `${box.height}px`;
    frame.style.transform = `translate3d(${box.left - gridBox.left}px, ${box.top - gridBox.top}px, 0)`;
    frame.style.opacity = "1";
  }, []);

  const focusName = useCallback(
    (name, { immediate = false } = {}) => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      targetRef.current = name;
      setTarget(name);
      setPhase("moving");
      placeFrame(name);

      const travelMs = immediate ? HOVER_TRAVEL_MS : AUTO_TRAVEL_MS;

      timersRef.current = [
        window.setTimeout(() => {
          placeFrame(name);
          setPhase("flash");
          setFlashCount((count) => count + 1);
        }, travelMs),
        window.setTimeout(() => setPhase("hold"), travelMs + FLASH_MS),
      ];
    },
    [placeFrame]
  );

  // Cycle automatique, seulement quand la section est à l'écran et l'onglet visible.
  useEffect(() => {
    const grid = gridRef.current;
    const names = namesKey ? namesKey.split("|") : [];
    if (!animated || !grid || names.length < 2) return undefined;

    let interval = 0;
    let startTimeout = 0;

    const step = () => {
      if (document.hidden || hoverRef.current) return;
      let next;
      do {
        next = names[Math.floor(Math.random() * names.length)];
      } while (next === targetRef.current);
      focusName(next, { immediate: false });
    };

    const start = () => {
      if (interval) return;
      startTimeout = window.setTimeout(step, 1400);
      interval = window.setInterval(step, FOCUS_INTERVAL_MS);
    };

    const stop = () => {
      window.clearTimeout(startTimeout);
      window.clearInterval(interval);
      interval = 0;
    };

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0.25,
    });
    observer.observe(grid);

    const resizeObserver = new ResizeObserver(() => {
      if (targetRef.current) placeFrame(targetRef.current);
    });
    resizeObserver.observe(grid);

    const timers = timersRef.current;
    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [animated, namesKey, focusName, placeFrame]);

  function getOpticalClasses(name) {
    const baseTone = dark ? "text-paper" : "text-ink";
    if (!animated || !target) {
      return `${baseTone} opacity-90 blur-0 scale-100`;
    }

    if (name !== target) {
      // Hors mise au point : léger bokeh optique sur écran moyen/grand et retrait en opacité
      return `${dark ? "text-paper/45" : "text-ink/45"} scale-100 md:blur-[0.95px]`;
    }

    // Sujet visé : mise au point nette + léger grossissement optique
    if (phase === "moving") {
      return `${baseTone} scale-[1.02] blur-[0.3px]`;
    }
    if (phase === "flash") {
      return "text-accent scale-[1.045] blur-0";
    }
    return `${baseTone} scale-[1.04] blur-0`;
  }

  const activeItem = target ? itemByName.get(target) : null;
  const lensLabel = activeItem ? LENS_META_BY_TYPE[activeItem.type] || "85MM F/1.4" : "85MM F/1.4";
  const isLocked = phase === "flash" || phase === "hold";

  return (
    <section aria-labelledby="references-titre" className={`mx-auto max-w-7xl px-4 md:px-8 ${className}`}>
      <div className={`border-y py-12 md:py-16 ${dark ? "border-white/10 text-paper" : "border-line/12 text-ink"}`}>
        <h2
          id="references-titre"
          className="mx-auto max-w-3xl text-center font-serif text-3xl leading-tight tracking-[-0.03em] md:text-5xl"
        >
          {copy.title}
        </h2>

        <div ref={gridRef} className="relative mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {groups.map((group) => (
            <div key={group.groupe} className="space-y-5 text-center">
              <p className={`text-[11px] font-bold uppercase tracking-[0.32em] ${dark ? "text-paper/45" : "text-ink/45"}`}>
                {group.titre}
              </p>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 md:block md:space-y-2.5">
                {group.names.map((name, index) => (
                  <motion.li
                    key={name}
                    className="font-serif text-xl leading-snug tracking-tight md:text-[1.7rem]"
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.9, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span
                      ref={(element) => {
                        if (element) nameRefs.current.set(name, element);
                        else nameRefs.current.delete(name);
                      }}
                      onMouseEnter={
                        animated
                          ? () => {
                              hoverRef.current = true;
                              focusName(name, { immediate: true });
                            }
                          : undefined
                      }
                      onMouseLeave={animated ? () => (hoverRef.current = false) : undefined}
                      className={`inline-block origin-center px-2 py-0.5 transition-[color,opacity,transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${getOpticalClasses(
                        name
                      )}`}
                    >
                      {name}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}

          {animated ? (
            <div
              ref={frameRef}
              aria-hidden="true"
              className="viewfinder-frame pointer-events-none absolute left-0 top-0 opacity-0"
            >
              {flashCount > 0 ? <span key={flashCount} className="viewfinder-flash" /> : null}

              {/* Micro-indicateur optique de viseur (AF + focale) */}
              <span
                className={`absolute -top-5 left-0 flex items-center gap-1.5 whitespace-nowrap font-sans text-[9px] font-bold uppercase tracking-[0.22em] transition-opacity duration-300 ${
                  isLocked ? "text-accent opacity-95" : dark ? "text-paper/50 opacity-70" : "text-ink/45 opacity-70"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-transform duration-300 ${
                    isLocked ? "scale-100 bg-accent" : "scale-75 bg-current"
                  }`}
                />
                <span>{isLocked ? `AF · ${lensLabel}` : "FOCUS…"}</span>
              </span>

              {/* 4 équerres de mise au point optique */}
              {[
                "left-0 top-0 border-l-[1.5px] border-t-[1.5px]",
                "right-0 top-0 border-r-[1.5px] border-t-[1.5px]",
                "bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]",
                "bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]",
              ].map((corner) => (
                <span
                  key={corner}
                  className={`absolute h-3 w-3 transition-[margin,border-color,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${corner} ${
                    phase === "moving"
                      ? `-m-3 ${dark ? "border-paper/45" : "border-ink/35"}`
                      : "-m-1.5 border-accent"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
