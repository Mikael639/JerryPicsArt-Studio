// Mise en page des pages légales : titre unique, sections lisibles.
export default function LegalPage({ title, intro, sections }) {
  return (
    <div className="page-shell mx-auto max-w-3xl space-y-10 px-4 pb-24 pt-12 md:px-8 md:pt-20">
      <header className="space-y-4">
        <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.04em] md:text-6xl">{title}</h1>
        {intro ? <p className="text-base leading-relaxed text-ink/65 md:text-lg">{intro}</p> : null}
      </header>
      {sections.map((section) => (
        <section key={section.titre} className="space-y-3 border-t border-line/12 pt-6">
          <h2 className="font-serif text-2xl tracking-tight md:text-3xl">{section.titre}</h2>
          {section.paragraphes.map((paragraphe) => (
            <p key={paragraphe} className="text-base leading-relaxed text-ink/75">
              {paragraphe}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
