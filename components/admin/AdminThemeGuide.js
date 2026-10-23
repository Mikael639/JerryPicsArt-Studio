const categoryRoutes = {
  "Fashion Week & Celebrities": "/signature",
  Events: "/evenements",
  "Fashion Wedding": "/mariage",
  Studio: "/entreprises",
};

export default function AdminThemeGuide({ categories }) {
  const notes = {
    Events: "Soirées, concerts, lancements, coulisses et moments publics (page Événements).",
    "Fashion Week & Celebrities": "Défilés, backstage, street style, personnalités et tapis rouge (page Signature).",
    Studio: "Portraits, tests, séries dirigées, images de marque et books (page Entreprises & lieux).",
    "Fashion Wedding": "Mariages traités avec une intention mode et éditoriale (page Mariage).",
  };

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {categories.map((category) => (
        <article key={category} className="rounded-2xl border border-line/20 bg-white/65 p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink/45">Thème</p>
          <h2 className="mt-2 font-serif text-3xl">{category}</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">{notes[category] || "Collection du portfolio."}</p>
          <a
            href={categoryRoutes[category] || "/signature"}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full border border-line/25 px-4 py-2 text-sm hover:border-ink"
          >
            Voir cette page
          </a>
        </article>
      ))}

      <article className="rounded-2xl border border-line/20 bg-ink p-5 text-paper md:col-span-2">
        <h2 className="font-serif text-3xl">Petit guide</h2>
        <div className="mt-4 grid gap-3 text-sm leading-relaxed text-paper/75 md:grid-cols-3">
          <p>
            <strong className="text-paper">Publiée</strong> signifie visible sur le site.
          </p>
          <p>
            <strong className="text-paper">Brouillon</strong> garde la photo dans l&apos;administration sans l&apos;afficher.
          </p>
          <p>
            <strong className="text-paper">Mise en avant</strong> donne plus de chances d&apos;apparaître en premier.
          </p>
        </div>
      </article>
    </section>
  );
}
