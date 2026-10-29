"use client";

import Link from "next/link";
import PhotoGrid from "./PhotoGrid";
import { localize } from "../../data/univers";
import { useLanguage } from "../LanguageProvider";

// Barre d'ancres vers les univers de la page (collante sur téléphone, sous l'en-tête).
export function UniverseNav({ items }) {
  const { lang } = useLanguage();
  if (items.length < 2) return null;

  return (
    <nav
      aria-label={lang === "en" ? "Collections on this page" : "Univers de la page"}
      className="sticky top-[73px] z-30 border-b border-line/12 bg-paper/92 backdrop-blur-md md:static md:border-b-0 md:bg-transparent md:backdrop-blur-none"
    >
      <ul className="no-scrollbar mx-auto flex max-w-7xl items-center gap-x-6 overflow-x-auto px-4 py-3.5 md:flex-wrap md:gap-y-2 md:overflow-visible md:px-8 md:py-0">
        {items.map((item, index) => (
          <li key={item.slug} className="flex shrink-0 items-center gap-6">
            {index > 0 ? <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-ink/25 md:block" /> : null}
            <Link
              href={`#${item.slug}`}
              className="-my-2 block py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-ink/60 transition-colors hover:text-ink"
            >
              {localize(item.court, lang)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Univers : titre, crédits, phrase de contexte, puis la grille de photos (12 au plus, toutes dans la visionneuse).
export default function Universe({ univers, priority = false }) {
  const { lang } = useLanguage();
  const titre = localize(univers.titre, lang);

  return (
    <section
      id={univers.slug}
      aria-labelledby={`${univers.slug}-titre`}
      className="mx-auto max-w-7xl scroll-mt-36 px-4 md:scroll-mt-28 md:px-8"
    >
      <header className="mb-8 max-w-3xl space-y-3">
        <h2 id={`${univers.slug}-titre`} className="font-serif text-3xl leading-[1] tracking-[-0.03em] md:text-5xl">
          {titre}
        </h2>
        <p className="text-[11px] font-bold uppercase leading-relaxed tracking-[0.22em] text-ink/45">{univers.credits}</p>
        <p className="max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">{localize(univers.contexte, lang)}</p>
      </header>

      <PhotoGrid images={univers.images} priority={priority} />
    </section>
  );
}
