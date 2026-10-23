"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { siteConfig } from "../lib/siteConfig";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
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
    function handleScroll() {
      setIsScrolled(window.scrollY > 80);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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

        <div className="hidden items-center gap-1 rounded-full border border-line/20 bg-white/70 p-1 xl:flex">
          {siteConfig.navigation.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                  isActive ? "text-paper" : "text-ink/75 hover:text-ink"
                }`}
              >
                {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink" />}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <div className="hidden items-center gap-2 xl:flex">
            {siteConfig.socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${link.name} ${link.handle}`}
                title={`${link.name} ${link.handle}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line/20 bg-white/65 text-ink/65 shadow-sm backdrop-blur-md transition hover:border-ink/20 hover:bg-white hover:text-ink"
              >
                {link.name === "LinkedIn" ? <LinkedInIcon className="h-4.5 w-4.5" /> : <InstagramIcon className="h-4.5 w-4.5" />}
              </a>
            ))}
          </div>

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
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full border border-line/20 bg-white/80 px-3 py-2 text-sm font-medium text-ink shadow-sm transition-all active:scale-95 sm:gap-3 sm:px-4 xl:hidden"
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
  );
}

function InstagramIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5v5.5M8 8v.01M11.5 16v-5.5m0 2.5c0-1.5 1-2.5 2.4-2.5 1.3 0 2.1.9 2.1 2.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
