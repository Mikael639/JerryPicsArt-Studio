import { references } from "../../data/references";

function NameList({ items }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:gap-x-7">
      {items.map((item, index) => (
        <li key={item.nom} className="flex items-center gap-x-5 md:gap-x-7">
          <span className="whitespace-nowrap font-serif text-xl tracking-tight md:text-2xl">{item.nom}</span>
          {index < items.length - 1 ? (
            <span aria-hidden="true" className="opacity-25">
              ·
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

// Bande de références : personnalités, puis maisons, médias et lieux.
// tone="dark" pour un fond sombre, tone="light" pour un fond clair.
export default function ReferencesBand({ tone = "light", className = "" }) {
  const people = references.filter((item) => item.type === "personnalite");
  const houses = references.filter((item) => item.type !== "personnalite");
  const dark = tone === "dark";

  return (
    <section aria-label="Références" className={`mx-auto max-w-7xl px-4 md:px-8 ${className}`}>
      <div className={`space-y-6 border-y py-10 text-center ${dark ? "border-white/10 text-paper" : "border-line/12 text-ink"}`}>
        <p className={`text-[11px] font-bold uppercase tracking-[0.32em] ${dark ? "text-paper/50" : "text-ink/50"}`}>
          Ils sont passés devant mon objectif
        </p>
        <div className="space-y-4 opacity-90">
          <NameList items={people} />
          <div className={`mx-auto h-px w-16 ${dark ? "bg-white/15" : "bg-line/15"}`} />
          <NameList items={houses} />
        </div>
      </div>
    </section>
  );
}
