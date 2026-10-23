"use client";

import { motion } from "framer-motion";

const universeShortcuts = [
  {
    id: "hero",
    title: "Diaporama d'accueil",
    route: "/",
    description: "Les photos plein écran qui ouvrent le site (maximum 10).",
    match: (photo) => (photo.roles || []).includes("hero"),
  },
  {
    id: "Fashion Week & Celebrities",
    title: "Signature · Fashion Week",
    route: "/signature",
    description: "Défilés, Haute Couture, célébrités et invités.",
    match: (photo) => photo.category === "Fashion Week & Celebrities",
  },
  {
    id: "Events",
    title: "Événements",
    route: "/evenements",
    description: "Cérémonies Les Flammes, avant-premières et soirées parisiennes.",
    match: (photo) => photo.category === "Events",
  },
  {
    id: "Fashion Wedding",
    title: "Mariage",
    route: "/mariage",
    description: "Reportages de mariage à l'écriture éditoriale.",
    match: (photo) => photo.category === "Fashion Wedding",
  },
  {
    id: "Studio",
    title: "Entreprises & Studio",
    route: "/entreprises",
    description: "Portraits dirigeants, équipes et contenus de marque.",
    match: (photo) => photo.category === "Studio",
  },
];

export default function AdminDashboard({
  photos,
  messages,
  categories,
  onSelectTab,
  onOpenUniverse,
  showDetails = false,
}) {
  const published = photos.filter((photo) => photo.isPublished).length;
  const drafts = photos.length - published;
  const heroCount = photos.filter((photo) => (photo.roles || []).includes("hero")).length;
  const needsReply = messages.filter((message) => message.status === "new" || message.status === "soon").length;

  const photoStats = categories
    .map((cat) => ({
      label: cat,
      count: photos.filter((p) => p.category === cat).length,
    }))
    .sort((a, b) => b.count - a.count);

  const serviceStats = Array.from(new Set(messages.map((m) => m.serviceType).filter(Boolean)))
    .map((type) => ({
      label: type,
      count: messages.filter((m) => m.serviceType === type).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const cards = [
    {
      label: "Photos en ligne",
      value: published,
      sub: drafts > 0 ? `${drafts} en brouillon` : "Toutes publiées",
      onClick: () => onOpenUniverse("all"),
      color: "text-ink",
    },
    {
      label: "Diaporama accueil",
      value: `${heroCount}/10`,
      sub: "Sélection d'ouverture",
      onClick: () => onOpenUniverse("hero"),
      color: "text-accent",
    },
    {
      label: "Demandes à traiter",
      value: needsReply,
      sub: `${messages.length} demande(s) au total`,
      onClick: () => onSelectTab("messages"),
      color: needsReply > 0 ? "text-amber-700" : "text-emerald-700",
    },
    {
      label: "Pages & textes",
      value: "Éditeur",
      sub: "Accueil, À propos & thèmes",
      onClick: () => onSelectTab("settings"),
      color: "text-ink",
    },
  ];

  return (
    <div className="space-y-6">
      {/* BARRE DE COMPTEURS RAPIDES */}
      <motion.section
        className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
      >
        {cards.map((card) => (
          <motion.button
            key={card.label}
            type="button"
            onClick={card.onClick}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="flex flex-col justify-between rounded-2xl border border-line/15 bg-white/75 p-5 text-left shadow-[0_12px_36px_rgba(12,10,8,0.03)] transition hover:border-ink/35 hover:bg-white"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink/45">{card.label}</p>
            <p className={`mt-2.5 font-serif text-4xl leading-none ${card.color}`}>{card.value}</p>
            <p className="mt-2 text-xs text-ink/55">{card.sub}</p>
          </motion.button>
        ))}
      </motion.section>

      {showDetails ? (
        <>
          {/* ACCÈS RAPIDE PAR UNIVERS DU SITE */}
          <section className="rounded-2xl border border-line/15 bg-white/75 p-6 shadow-[0_14px_44px_rgba(12,10,8,0.03)]">
            <div className="flex flex-wrap items-end justify-between gap-2 border-b border-line/10 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-ink/45">Organisation du site</p>
                <h2 className="mt-1 font-serif text-3xl">Accès rapide par page</h2>
              </div>
              <p className="text-xs text-ink/55">
                Cliquez sur une section pour gérer directement ses séries et ses photos.
              </p>
            </div>

            <div className="mt-5 grid gap-3.5 md:grid-cols-2 xl:grid-cols-5">
              {universeShortcuts.map((item) => {
                const count = photos.filter(item.match).length;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border border-line/15 bg-paper/60 p-4 transition hover:border-ink/30 hover:bg-white"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                          {item.route}
                        </span>
                        <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-paper">
                          {count}
                        </span>
                      </div>
                      <h3 className="mt-2 font-serif text-xl leading-snug">{item.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{item.description}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-line/10 pt-3">
                      <button
                        type="button"
                        onClick={() => onOpenUniverse(item.id)}
                        className="text-xs font-bold uppercase tracking-[0.16em] text-ink hover:text-accent"
                      >
                        Gérer les photos →
                      </button>
                      <a
                        href={item.route}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-ink/45 underline-offset-4 hover:text-ink hover:underline"
                      >
                        Voir
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Graphique Portfolio */}
            <section className="rounded-2xl border border-line/15 bg-white/75 p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink/45">Répartition du catalogue</h3>
              <div className="mt-5 space-y-4">
                {photoStats.map((stat) => (
                  <button
                    key={stat.label}
                    type="button"
                    onClick={() => onOpenUniverse(stat.label)}
                    className="block w-full space-y-1.5 text-left group"
                  >
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-ink/75 group-hover:text-accent transition-colors">{stat.label}</span>
                      <span className="text-ink">{stat.count} photos</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-ink/8">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${photos.length > 0 ? (stat.count / photos.length) * 100 : 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-ink/60 group-hover:bg-accent transition-colors"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Graphique Messages */}
            <section className="rounded-2xl border border-line/15 bg-white/75 p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink/45">Demandes par prestation</h3>
              <div className="mt-5 space-y-4">
                {serviceStats.length > 0 ? (
                  serviceStats.map((stat) => (
                    <div key={stat.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-ink/75">{stat.label}</span>
                        <span className="text-ink">{stat.count} demande(s)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-ink/8">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${messages.length > 0 ? (stat.count / messages.length) * 100 : 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-accent/65"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-10 text-center text-sm text-ink/45">Aucune demande reçue pour le moment.</p>
                )}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
