"use client";

import { motion, useReducedMotion } from "framer-motion";
import { references as defaultReferences } from "../../data/references";

const COLUMNS = [
  { groupe: "artistes", titre: "Artistes" },
  { groupe: "personnalites", titre: "Personnalités" },
  { groupe: "mode", titre: "Maisons, médias et lieux" },
];

// Éclairs d'appareil photo : position (%), taille (px), décalage et durée propres à chacun.
const FLASHES = [
  { left: "8%", top: "22%", size: 170, delay: "0s", duration: "7s" },
  { left: "34%", top: "68%", size: 130, delay: "2.4s", duration: "8s" },
  { left: "58%", top: "14%", size: 210, delay: "4.6s", duration: "6.5s" },
  { left: "82%", top: "58%", size: 150, delay: "1.2s", duration: "9s" },
  { left: "92%", top: "12%", size: 110, delay: "5.8s", duration: "7.5s" },
];

// Références en trois colonnes : artistes, personnalités, puis maisons, médias et lieux.
// Derrière, des éclairs discrets et des halos lents rappellent les flashs d'un photographe.
// tone="dark" pour un fond sombre, tone="light" pour un fond clair.
export default function ReferencesBand({ items = defaultReferences, tone = "light", className = "" }) {
  const dark = tone === "dark";
  const reduceMotion = useReducedMotion();
  const flashColor = dark ? "rgba(255,244,225,0.30)" : "rgba(176,127,90,0.38)";
  const orbColor = dark ? "rgba(176,127,90,0.20)" : "rgba(176,127,90,0.16)";

  return (
    <section aria-labelledby="references-titre" className={`mx-auto max-w-7xl px-4 md:px-8 ${className}`}>
      <div className={`relative isolate overflow-hidden border-y py-12 md:py-16 ${dark ? "border-white/10 text-paper" : "border-line/12 text-ink"}`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <span className="flash-orb left-[-8%] top-[-20%] h-80 w-80" style={{ background: `radial-gradient(circle, ${orbColor} 0%, transparent 70%)` }} />
          <span className="flash-orb bottom-[-25%] right-[-6%] h-96 w-96" style={{ background: `radial-gradient(circle, ${orbColor} 0%, transparent 70%)`, animationDelay: "-9s" }} />
          {FLASHES.map((flash) => (
            <span
              key={flash.left}
              className="flash-dot"
              style={{
                left: flash.left,
                top: flash.top,
                width: flash.size,
                height: flash.size,
                background: `radial-gradient(circle, ${flashColor} 0%, transparent 68%)`,
                animationDelay: flash.delay,
                animationDuration: flash.duration,
              }}
            />
          ))}
        </div>

        <h2
          id="references-titre"
          className="mx-auto max-w-3xl text-center font-serif text-3xl leading-tight tracking-[-0.03em] md:text-5xl"
        >
          Ils sont passés devant mon objectif
        </h2>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {COLUMNS.map((column) => (
            <div key={column.groupe} className="space-y-5 text-center">
              <p className={`text-[11px] font-bold uppercase tracking-[0.32em] ${dark ? "text-paper/45" : "text-ink/45"}`}>
                {column.titre}
              </p>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 md:block md:space-y-2.5">
                {items
                  .filter((item) => item.groupe === column.groupe)
                  .map((item, index) => (
                    <motion.li
                      key={item.nom}
                      className="font-serif text-xl leading-snug tracking-tight md:text-[1.7rem]"
                      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.9, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {item.nom}
                    </motion.li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
