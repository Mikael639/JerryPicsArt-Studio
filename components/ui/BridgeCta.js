import Link from "next/link";
import TrackedLink from "./TrackedLink";

// Phrase-pont placée sous une série Fashion Week : relie la preuve à une offre.
export default function BridgeCta({ serie }) {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-card border border-line/12 bg-white/50 p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <p className="max-w-xl font-serif text-xl leading-snug text-ink md:text-2xl">
        Vous organisez un lancement ou une soirée ? Le même regard pour votre événement.
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <TrackedLink
          href="/evenements"
          event="bridge_cta_evenements"
          eventData={{ serie }}
          className="inline-block rounded-full border border-ink px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Pour votre événement
        </TrackedLink>
        <Link
          href="/mariage"
          className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          … ou pour votre mariage
        </Link>
      </div>
    </div>
  );
}
