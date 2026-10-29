// Fin d'article : une ligne fine et un petit symbole, comme à la fin d'un article de magazine.
export default function ArticleEnd() {
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-7xl items-center gap-4 px-4 md:px-8">
      <span className="h-px flex-1 bg-ink/15" />
      <span className="text-[9px] leading-none text-ink/55">■</span>
    </div>
  );
}
