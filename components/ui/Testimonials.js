"use client";

import Reveal from "./Reveal";
import { testimonials as defaultTestimonials } from "../../data/testimonials";
import { UI_COPY } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

// Avis réels uniquement. Rien n'est affiché si la liste est vide.
export default function Testimonials({ items: source = defaultTestimonials, prestation, limit, title, tone = "light" }) {
  const { lang } = useLanguage();
  const resolvedTitle = title || UI_COPY[lang]?.testimonials?.defaultTitle || UI_COPY.fr.testimonials.defaultTitle;
  const dark = tone === "dark";
  let items = prestation ? source.filter((item) => item.prestation === prestation) : source;
  if (limit) items = items.slice(0, limit);
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <Reveal className="space-y-8">
        <h2 className={`font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl ${dark ? "text-paper" : "text-ink"}`}>
          {resolvedTitle}
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <figure
              key={`${item.auteur}-${item.texte.slice(0, 20)}`}
              className={`flex h-full flex-col justify-between gap-8 rounded-card border p-7 ${
                dark ? "border-white/10 bg-white/5" : "border-line/12 bg-white/70"
              }`}
            >
              <blockquote className={`font-serif text-xl leading-snug md:text-2xl ${dark ? "text-paper" : "text-ink"}`}>
                {item.texte}
              </blockquote>
              <figcaption className={`border-t pt-4 text-[11px] font-bold uppercase tracking-[0.22em] ${dark ? "border-white/10 text-paper/70" : "border-line/12 text-ink/70"}`}>
                {item.auteur}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
