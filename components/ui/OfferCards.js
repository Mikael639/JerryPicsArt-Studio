import Reveal from "./Reveal";

// Cartes de formules et de tarifs, toujours affichés « à partir de ».
export default function OfferCards({ offers, columns = "md:grid-cols-3" }) {
  return (
    <div className={`grid gap-5 ${columns}`}>
      {offers.map((offer, index) => {
        const featured = Boolean(offer.miseEnAvant);
        return (
          <Reveal
            key={offer.titre}
            delay={index * 0.08}
            className={`flex h-full flex-col rounded-card border p-7 md:p-8 ${
              featured
                ? "border-ink bg-ink text-paper shadow-[0_32px_96px_rgba(12,10,8,0.18)]"
                : "border-line/15 bg-white/60 text-ink"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif text-3xl tracking-tight">{offer.titre}</h3>
              {featured ? (
                <span className="rounded-full border border-paper/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-paper/80">
                  Recommandée
                </span>
              ) : null}
            </div>
            <p className="mt-6">
              <span className={`block text-[11px] font-bold uppercase tracking-[0.24em] ${featured ? "text-paper/50" : "text-ink/45"}`}>
                À partir de
              </span>
              <span className="font-serif text-5xl tracking-tight">{offer.prix}</span>
            </p>
            {offer.description ? (
              <p className={`mt-4 text-base leading-relaxed ${featured ? "text-paper/70" : "text-ink/65"}`}>{offer.description}</p>
            ) : null}
            {offer.inclus?.length ? (
              <ul className={`mt-6 space-y-2.5 text-[15px] leading-relaxed ${featured ? "text-paper/80" : "text-ink/75"}`}>
                {offer.inclus.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>
        );
      })}
    </div>
  );
}
