"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { siteConfig } from "../lib/siteConfig";
import { NAV_LABELS, UI_COPY } from "../lib/i18n";
import { useLanguage } from "./LanguageProvider";

const MAIN_LINKS = ["/signature", "/evenements", "/mariage", "/entreprises"];

// Version typographique épurée pour la barre du haut (tablette/desktop) : aucun contour de bouton supplémentaire.
function HeaderLanguageSwitch({ lang, setLang, copy }) {
  return (
    <div
      role="group"
      aria-label={copy.langLabel}
      className=" mr-1 hidden items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] sm:inline-flex"
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        aria-pressed={lang === "fr"}
        className={`py-1 transition-colors ${
          lang === "fr" ? "text-ink underline decoration-ink/60 underline-offset-4" : "text-ink/40 hover:text-ink"
        }`}
      >
        FR
      </button>
      <span aria-hidden="true" className="text-ink/25">
        /
      </span>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`py-1 transition-colors ${
          lang === "en" ? "text-ink underline decoration-ink/60 underline-offset-4" : "text-ink/40 hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
}

export default function Navbar({ previews = {} }) {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const copy = UI_COPY[lang]?.nav || UI_COPY.fr.nav;
  const navLabels = NAV_LABELS[lang] || NAV_LABELS.fr;

  const [isOpen, setIsOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [hovered, setHovered] = useState(null);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (isOpen) {
      setIsOpen(false);
    }
  }

  const localizedNav = siteConfig.navigation.map((link) => ({
    ...link,
    label: navLabels[link.href] || link.label,
  }));
  const mainLinks = localizedNav.filter((link) => MAIN_LINKS.includes(link.href));
  const houseLinks = localizedNav.filter((link) => !MAIN_LINKS.includes(link.href));
  const preview = previews[hovered] || previews[MAIN_LINKS.find((href) => previews[href])] || null;
  const [isScrolled, setIsScrolled] = useState(false);
  // Le bouton « Demander un devis » doit rester visible : l'en-tête ne s'estompe plus.
  const shouldDimOnHome = false;

  const { scrollYProgress } = useScroll();
  const readingProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 80);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={shouldDimOnHome ? { y: -18, opacity: 0.08 } : { y: 0, opacity: 1 }}
        transition={{
          duration: shouldDimOnHome ? 0.7 : 0.45,
          ease: [0.16, 1, 0.3, 1],
          delay: pathname === "/" && !shouldDimOnHome ? 2.2 : 0.04,
        }}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-500 ${
          shouldDimOnHome
            ? "pointer-events-none border-transparent bg-paper/0 shadow-none"
            : isScrolled
            ? "border-line/15 bg-paper/90 shadow-[0_10px_40px_rgba(12,10,8,0.07)]"
            : "border-line/20 bg-paper/70 shadow-none"
        }`}
      >
        <motion.div
          aria-hidden="true"
          style={{ scaleX: readingProgress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent/70"
        />

        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-[padding] duration-500 md:px-8 ${
            isScrolled ? "py-3 md:py-2" : "py-3"
          }`}
        >
          <Link href="/" className="font-serif text-xl tracking-wide text-ink">
            JerryPicsArt
          </Link>

          <div className="hidden items-center gap-8 xl:flex">
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative py-2 text-[12px] font-bold uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-ink" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ink transition-transform duration-500 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2.5 xl:ml-0">
            <HeaderLanguageSwitch lang={lang} setLang={setLang} copy={copy} />

            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-paper shadow-sm transition-colors hover:bg-accent sm:px-5 sm:py-2.5 sm:text-[12px]"
            >
              <span className="sm:hidden">{copy.ctaShort}</span>
              <span className="hidden sm:inline">{copy.ctaLong}</span>
            </Link>

            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation desktop-navigation"
              aria-label={isOpen ? copy.closeMenu : copy.openMenu}
              onClick={() => setIsOpen((current) => !current)}
              className="group inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-accent/40 bg-white/80 px-[9px] text-accent shadow-sm transition-all duration-500 hover:bg-accent/10 active:scale-95 sm:hover:pr-4"
            >
              {/* Diaphragme d'objectif : il tourne et se referme en croix à l'ouverture du menu. */}
              <span aria-hidden="true" className="relative block h-6 w-6 shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className={`absolute inset-0 h-full w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[30deg] ${
                    isOpen ? "rotate-[120deg] scale-50 opacity-0" : "opacity-100"
                  }`}
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12.00 3.00L14.94 13.70M19.79 7.50L12.00 15.40M19.79 16.50L9.06 13.70M12.00 21.00L9.06 10.30M4.21 16.50L12.00 8.60M4.21 7.50L14.94 10.30" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className={`absolute inset-0 h-full w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "rotate-0 opacity-100" : "-rotate-90 scale-50 opacity-0"
                  }`}
                >
                  <path d="M6 6L18 18M18 6L6 18" />
                </svg>
              </span>
              <span
                className={`hidden max-w-0 overflow-hidden whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.18em] opacity-0 transition-all duration-500 sm:inline-block sm:group-hover:ml-2.5 sm:group-hover:max-w-[4.5rem] sm:group-hover:opacity-100 sm:group-focus-visible:ml-2.5 sm:group-focus-visible:max-w-[4.5rem] sm:group-focus-visible:opacity-100 ${
                  isOpen ? "sm:ml-2.5 sm:max-w-[4.5rem] sm:opacity-100" : ""
                }`}
              >
                {isOpen ? copy.closeLabel : copy.menuLabel}
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen ? (
            <>
              <motion.button
                type="button"
                aria-label={copy.closeMenu}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 top-[73px] bg-ink/16 xl:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                id="mobile-navigation"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-line/15 bg-paper/95 px-4 py-4 shadow-[0_24px_80px_rgba(12,10,8,0.08)] backdrop-blur-xl xl:hidden"
              >
                <div className="mx-auto flex max-h-[calc(100svh-8rem)] max-w-7xl flex-col gap-2 overflow-y-auto">
                  {/* Sélecteur de langue intégré dans le tiroir mobile pour ne pas surcharger la barre du haut */}
                  <div className="mb-1 flex items-center justify-between rounded-[1.2rem] border border-line/10 bg-white/55 px-6 py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-ink/50">
                      {copy.langLabel}
                    </span>
                    <div role="group" aria-label={copy.langLabel} className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]">
                      <button
                        type="button"
                        onClick={() => {
                          setLang("fr");
                          setIsOpen(false);
                        }}
                        aria-pressed={lang === "fr"}
                        className={`rounded-full px-3 py-1 transition-colors ${
                          lang === "fr" ? "bg-ink text-paper" : "text-ink/55 hover:text-ink"
                        }`}
                      >
                        FR
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLang("en");
                          setIsOpen(false);
                        }}
                        aria-pressed={lang === "en"}
                        className={`rounded-full px-3 py-1 transition-colors ${
                          lang === "en" ? "bg-ink text-paper" : "text-ink/55 hover:text-ink"
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  {localizedNav.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between rounded-[1.2rem] border px-6 py-3.5 text-lg transition-all duration-300 ${
                          isActive
                            ? "border-ink bg-ink text-paper"
                            : "border-line/10 bg-white/40 text-ink/80 hover:border-ink/20 hover:bg-white hover:text-ink"
                        }`}
                      >
                        <span className="font-serif tracking-tight">{link.label}</span>
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-1.5 w-1.5 rounded-full bg-paper"
                          />
                        )}
                      </Link>
                    );
                  })}
                  {siteConfig.socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between rounded-[1.2rem] border border-line/10 bg-white/40 px-6 py-3.5 text-lg text-ink/80 transition-all duration-300 hover:border-ink/20 hover:bg-white hover:text-ink"
                    >
                      <span className="font-serif tracking-tight">{link.name}</span>
                      <span className="text-sm font-semibold">{link.handle}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="desktop-menu"
            id="desktop-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 hidden bg-paper pt-[73px] xl:block"
          >
            <div className="mx-auto grid h-full max-w-7xl grid-cols-[minmax(0,1fr)_minmax(0,26rem)] items-center gap-20 px-8 pb-12">
              <div className="space-y-10" onMouseLeave={() => setHovered(null)}>
                <div>
                  <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.32em] text-ink/40">{copy.servicesEyebrow}</p>
                  <ul className="space-y-1">
                    {mainLinks.map((link, index) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          href={link.href}
                          onMouseEnter={() => setHovered(link.href)}
                          onFocus={() => setHovered(link.href)}
                          className={`group flex items-baseline gap-5 py-1 font-serif text-6xl leading-[1.05] tracking-[-0.03em] transition-colors duration-500 ${
                            pathname === link.href ? "text-accent" : hovered && hovered !== link.href ? "text-ink/30" : "text-ink"
                          }`}
                        >
                          <span className="w-8 -translate-y-[0.9em] font-sans text-[11px] font-bold tracking-[0.2em] text-ink/40">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="transition-transform duration-500 group-hover:translate-x-3">{link.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-line/15 pt-6"
                >
                  {houseLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-[12px] font-bold uppercase tracking-[0.22em] transition-colors hover:text-ink ${
                        pathname === link.href ? "text-ink" : "text-ink/55"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {siteConfig.socialLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-bold uppercase tracking-[0.22em] text-ink/55 transition-colors hover:text-ink"
                    >
                      {link.name}
                    </a>
                  ))}
                </motion.div>
              </div>

              {preview ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-neutral-900 shadow-[0_24px_80px_rgba(12,10,8,0.14)]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={preview.src}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Image
                        src={preview.src}
                        alt={preview.alt}
                        fill
                        sizes="416px"
                        className="object-cover"
                        style={{ objectPosition: preview.objectPosition }}
                        quality={80}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
