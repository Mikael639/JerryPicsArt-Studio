"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { references as defaultReferences } from "../../data/references";

const COLUMNS = [
  { groupe: "artistes", titre: "Artistes" },
  { groupe: "personnalites", titre: "Personnalités" },
  { groupe: "mode", titre: "Maisons, médias et lieux" },
];

const FOCUS_INTERVAL_MS = 2600;
const FRAME_TRAVEL_MS = 650;
const FLASH_MS = 650;

// Références en trois colonnes : artistes, personnalités, puis maisons, médias et lieux.
// Un cadre de viseur passe de nom en nom et fait la mise au point, suivie d'un bref flash.
// Au survol d'un nom, le viseur s'y pose. Animation coupée hors de l'écran et si les animations sont réduites.
// tone="dark" pour un fond sombre, tone="light" pour un fond clair.
export default function ReferencesBand({ items = defaultReferences, tone = "light", className = "" }) {
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

  const groups = COLUMNS.map((column) => ({
    ...column,
    names: items.filter((item) => item.groupe === column.groupe).map((item) => item.nom),
  }));
  const allNames = groups.flatMap((group) => group.names);
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
    (name) => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      targetRef.current = name;
      setTarget(name);
      setPhase("moving");
      placeFrame(name);

      timersRef.current = [
        window.setTimeout(() => {
          // Recale le cadre : le nom a pu bouger pendant le trajet (fin de son apparition, retour à la ligne).
          placeFrame(name);
          setPhase("flash");
          setFlashCount((count) => count + 1);
        }, FRAME_TRAVEL_MS),
        window.setTimeout(() => setPhase("hold"), FRAME_TRAVEL_MS + FLASH_MS),
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
      focusName(next);
    };

    const start = () => {
      if (interval) return;
      // Laisse les noms finir leur apparition avant le premier déplacement du viseur.
      startTimeout = window.setTimeout(step, 1800);
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

    // Les noms passent à la ligne autrement si la largeur change : on recale le cadre.
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

  function nameClass(name) {
    if (!animated) return dark ? "text-paper" : "text-ink";
    if (name !== target) return dark ? "text-paper/60" : "text-ink/60";
    if (phase === "flash") return "text-accent";
    return dark ? "text-paper" : "text-ink";
  }

  return (
    <section aria-labelledby="references-titre" className={`mx-auto max-w-7xl px-4 md:px-8 ${className}`}>
      <div className={`border-y py-12 md:py-16 ${dark ? "border-white/10 text-paper" : "border-line/12 text-ink"}`}>
        <h2
          id="references-titre"
          className="mx-auto max-w-3xl text-center font-serif text-3xl leading-tight tracking-[-0.03em] md:text-5xl"
        >
          Ils sont passés devant mon objectif
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
                              focusName(name);
                            }
                          : undefined
                      }
                      onMouseLeave={animated ? () => (hoverRef.current = false) : undefined}
                      className={`inline-block px-1 transition-colors duration-500 ${nameClass(name)}`}
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
              {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
                (corner) => (
                  <span
                    key={corner}
                    className={`absolute h-2.5 w-2.5 border-accent transition-[margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${corner} ${
                      phase === "moving" ? "-m-2.5" : "-m-1.5"
                    }`}
                  />
                )
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
