// Petit séparateur entre deux univers : un filet, une étoile, un filet. Purement décoratif.
export default function Ornament() {
  return (
    <div aria-hidden="true" className="mb-10 flex items-center gap-4 md:mb-14">
      <span className="h-px flex-1 bg-ink/15" />
      <span className="text-sm leading-none text-ink/40">✦</span>
      <span className="h-px flex-1 bg-ink/15" />
    </div>
  );
}
