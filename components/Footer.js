"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "../lib/siteConfig";
import { NAV_LABELS, UI_COPY } from "../lib/i18n";
import { useLanguage } from "./LanguageProvider";

function scrollToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer({ collections = [] }) {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  if (pathname?.startsWith("/admin")) return null;
  const year = new Date().getFullYear();
  const copy = UI_COPY[lang]?.footer || UI_COPY.fr.footer;
  const navLabels = NAV_LABELS[lang] || NAV_LABELS.fr;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(176,127,90,0.16),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 md:px-8 md:pb-14 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div className="space-y-6">
            <p className="font-serif text-5xl leading-[0.95] tracking-[-0.03em] md:text-6xl">{siteConfig.name}</p>
            <p className="max-w-sm font-serif text-xl leading-snug text-paper/70">{copy.tagline}</p>
            <p className="max-w-sm text-sm leading-relaxed text-paper/50">{copy.availability}</p>
          </div>

          <nav aria-label={copy.pagesAria} className="space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-paper/40">{copy.pagesLabel}</p>
            <ul className="space-y-3">
              {siteConfig.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-lg text-paper/70 transition-colors hover:text-accent-soft"
                  >
                    <span className="h-px w-0 bg-accent-soft transition-all duration-300 group-hover:w-5" />
                    {navLabels[link.href] || link.label}
                  </Link>
                </li>
              ))}
              {collections.map((collection) => (
                <li key={collection.slug}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="group inline-flex items-center gap-2 text-lg text-paper/70 transition-colors hover:text-accent-soft"
                  >
                    <span className="h-px w-0 bg-accent-soft transition-all duration-300 group-hover:w-5" />
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-paper/40">{copy.followLabel}</p>
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
            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLang("fr")}
                aria-pressed={lang === "fr"}
                className={`transition-colors ${lang === "fr" ? "font-bold text-paper" : "text-paper/40 hover:text-paper"}`}
              >
                FR
              </button>
              <span aria-hidden="true" className="text-paper/20">
                /
              </span>
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`transition-colors ${lang === "en" ? "font-bold text-paper" : "text-paper/40 hover:text-paper"}`}
              >
                EN
              </button>
            </div>
            <Link href="/mentions-legales" className="transition-colors hover:text-paper">
              {copy.legal}
            </Link>
            <Link href="/confidentialite" className="transition-colors hover:text-paper">
              {copy.privacy}
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 text-paper/55 transition-colors hover:text-paper"
            >
              {copy.backToTop}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">
                ↑
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
