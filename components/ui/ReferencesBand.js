import { references } from "../../data/references";

const COLUMNS = [
  { groupe: "artistes", titre: "Artistes" },
  { groupe: "personnalites", titre: "Personnalités" },
  { groupe: "mode", titre: "Maisons, médias et lieux" },
];

// Références en trois colonnes : artistes, personnalités, puis maisons, médias et lieux.
// tone="dark" pour un fond sombre, tone="light" pour un fond clair.
export default function ReferencesBand({ tone = "light", className = "" }) {
  const dark = tone === "dark";

  return (
    <section aria-labelledby="references-titre" className={`mx-auto max-w-7xl px-4 md:px-8 ${className}`}>
      <div className={`border-y py-12 md:py-16 ${dark ? "border-white/10 text-paper" : "border-line/12 text-ink"}`}>
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
                {references
                  .filter((item) => item.groupe === column.groupe)
                  .map((item) => (
                    <li
                      key={item.nom}
                      className="font-serif text-xl leading-snug tracking-tight md:text-[1.7rem]"
                    >
                      {item.nom}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
