"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { siteConfig } from "../lib/siteConfig";

const MAIN_LINKS = ["/signature", "/evenements", "/mariage", "/entreprises"];

export default function Navbar({ previews = {} }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const mainLinks = siteConfig.navigation.filter((link) => MAIN_LINKS.includes(link.href));
  const houseLinks = siteConfig.navigation.filter((link) => !MAIN_LINKS.includes(link.href));
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
    setIsOpen(false);
  }, [pathname]);

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

        <div className="hidden items-center gap-9 xl:flex">
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

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-paper shadow-sm transition-colors hover:bg-accent sm:px-5 sm:py-2.5 sm:text-[12px]"
          >
            <span className="sm:hidden">Devis</span>
            <span className="hidden sm:inline">Demander un devis</span>
          </Link>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation desktop-navigation"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full border border-line/20 bg-white/80 px-3 py-2 text-sm font-medium text-ink shadow-sm transition-all active:scale-95 sm:gap-3 sm:px-4"
        >
          <span className="tracking-wide">{isOpen ? "Fermer" : "Menu"}</span>
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] uppercase font-bold text-paper"
          >
            {isOpen ? "✕" : "+"}
          </span>
        </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fermer le menu"
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
                {siteConfig.navigation.map((link) => {
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
                  <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.32em] text-ink/40">Prestations</p>
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
