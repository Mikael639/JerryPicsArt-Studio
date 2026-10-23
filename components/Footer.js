"use client";

import Link from "next/link";
import { siteConfig } from "../lib/siteConfig";

function scrollToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(176,127,90,0.16),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 md:px-8 md:pb-14 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div className="space-y-6">
            <p className="font-serif text-5xl leading-[0.95] tracking-[-0.03em] md:text-6xl">{siteConfig.name}</p>
            <p className="max-w-sm font-serif text-xl leading-snug text-paper/70">
              Le rendu d&apos;un éditorial, la discrétion d&apos;un invité.
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-paper/50">
              Disponible en France et à l&apos;international. Réponse sous 24 à 48 h.
            </p>
          </div>

          <nav aria-label="Pages du site" className="space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-paper/40">Pages</p>
            <ul className="space-y-3">
              {siteConfig.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-lg text-paper/70 transition-colors hover:text-accent-soft"
                  >
                    <span className="h-px w-0 bg-accent-soft transition-all duration-300 group-hover:w-5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-paper/40">Suivre et écrire</p>
            <ul className="space-y-3 text-lg text-paper/70">
              {siteConfig.socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-accent-soft"
                  >
                    {link.name}
                    <span className="ml-2 text-sm text-paper/40">{link.handle}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-accent-soft">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-[12px] uppercase tracking-[0.18em] text-paper/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/mentions-legales" className="transition-colors hover:text-paper">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="transition-colors hover:text-paper">
              Confidentialité
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 text-paper/55 transition-colors hover:text-paper"
            >
              Retour en haut
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
