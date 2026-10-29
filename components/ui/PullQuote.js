// Citation de Jerry entre deux univers : une seule par page, en grand dans la typographie des titres.
// Aucune animation, texte aligné à gauche sur téléphone, centré dès la tablette.
export default function PullQuote({ text }) {
  return (
    <figure className="mx-auto max-w-5xl px-4 text-left md:px-8 md:text-center">
      <blockquote className="font-serif text-[25px] leading-[1.2] tracking-[-0.01em] md:text-[38px] md:leading-[1.15]">
        « {text} »
      </blockquote>
      <figcaption className="mt-5 text-[11px] font-bold uppercase tracking-[0.26em] text-ink/50">
        — Jerry, JerryPicsArt
      </figcaption>
    </figure>
  );
}
