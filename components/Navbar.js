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
  // Menu mobile : la photo affichée est celle de la page courante, sinon de la première page ; les vignettes la changent.
  const [mobileHref, setMobileHref] = useState(null);
  const mobileSelected =
    (previews[mobileHref] && mobileHref) ||
    (previews[pathname] && MAIN_LINKS.includes(pathname) && pathname) ||
    MAIN_LINKS.find((href) => previews[href]) ||
    MAIN_LINKS[0];
  const mobilePreview = previews[mobileSelected] || null;
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

      </motion.header>

      {/* Menu mobile et tablette : plein écran, grande photo de la page choisie, titres en serif numérotés. */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="mobile-menu"
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 overflow-y-auto bg-paper pt-[calc(73px+env(safe-area-inset-top))] xl:hidden"
          >
            <div className="mx-auto flex min-h-full max-w-xl flex-col gap-4 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 md:px-8">
              {mobilePreview ? (
                <div className="relative aspect-[4/3] max-h-[27svh] w-full shrink-0 overflow-hidden rounded-card bg-neutral-900 shadow-[0_24px_64px_rgba(12,10,8,0.14)] md:max-h-[34svh]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={mobilePreview.src}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Image
                        src={mobilePreview.src}
                        alt={mobilePreview.alt}
                        fill
                        sizes="(max-width: 576px) 100vw, 576px"
                        className="object-cover"
                        style={{ objectPosition: mobilePreview.objectPosition }}
                        quality={75}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0),rgba(12,10,8,0.45))]" />
                  <Link
                    href={mobileSelected}
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-x-5 bottom-4 flex items-center justify-between font-serif text-2xl text-paper"
                  >
                    <span>{mainLinks.find((link) => link.href === mobileSelected)?.label}</span>
                    <span aria-hidden="true" className="text-base">
                      →
                    </span>
                  </Link>
                </div>
              ) : null}

              {Object.keys(previews).length > 1 ? (
                <div className="flex items-center gap-3" aria-hidden="true">
                  {mainLinks.map((link) =>
                    previews[link.href] ? (
                      <button
                        key={link.href}
                        type="button"
                        tabIndex={-1}
                        onClick={() => setMobileHref(link.href)}
                        className={`relative h-11 w-11 overflow-hidden rounded-full border-2 transition-all ${
                          mobileSelected === link.href ? "border-accent" : "border-transparent opacity-60"
                        }`}
                      >
                        <Image src={previews[link.href].src} alt="" fill sizes="44px" className="object-cover" quality={60} />
                      </button>
                    ) : null
                  )}
                </div>
              ) : null}

              <ul className="divide-y divide-line/15 border-y border-line/15">
                {mainLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.08 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        onFocus={() => setMobileHref(link.href)}
                        className={`flex items-baseline gap-4 py-2 font-serif text-[1.85rem] leading-tight tracking-[-0.02em] transition-colors ${
                          isActive ? "text-accent" : "text-ink"
                        }`}
                      >
                        <span className="w-7 font-sans text-[11px] font-bold tracking-[0.2em] text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {houseLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`py-1.5 text-[12px] font-bold uppercase tracking-[0.2em] ${
                      pathname === link.href ? "text-ink" : "text-ink/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-4 pt-2">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-accent px-6 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-paper transition-colors hover:bg-ink"
                >
                  {copy.projectLabel}
                </Link>
                <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] font-bold uppercase tracking-[0.18em]">
                  <div role="group" aria-label={copy.langLabel} className="inline-flex items-center gap-2">
                    {["fr", "en"].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setLang(code);
                          setIsOpen(false);
                        }}
                        aria-pressed={lang === code}
                        className={`rounded-full px-3 py-1.5 transition-colors ${
                          lang === code ? "bg-ink text-paper" : "text-ink/55 hover:text-ink"
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    {siteConfig.socialLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 text-ink/60 transition-colors hover:text-ink"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
