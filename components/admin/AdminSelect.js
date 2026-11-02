"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Liste déroulante de l'administration, dans le même esprit que celle du formulaire de contact :
// bouton arrondi, panneau qui se déplie en douceur, choix actif en foncé, nombre de photos à droite.
// options : [{ value, label, count? }]. Le panneau défile seul (data-lenis-prevent : le défilement fluide
// du site ne lui vole pas la molette).
export default function AdminSelect({ value, onChange, options, label, className = "", inline = false, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const active = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label ? (
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">{label}</span>
      ) : null}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 border text-left outline-none transition-all duration-300 ${
          compact ? "rounded-full px-4 py-2" : "rounded-2xl px-4 py-3.5"
        } ${
          isOpen
            ? "border-accent bg-white shadow-sm ring-1 ring-accent/20"
            : "border-line/20 bg-white/80 hover:border-line/40"
        }`}
      >
        <span className="min-w-0 truncate text-sm font-medium text-ink">{active?.label}</span>
        <span className="flex shrink-0 items-center gap-2">
          {active?.count !== undefined ? (
            <span className="rounded-full bg-ink/8 px-2 py-0.5 text-xs text-ink/60">{active.count}</span>
          ) : null}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-ink/40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.span>
        </span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.ul
            data-lenis-prevent
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: inline ? 0 : 6, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`${inline ? "relative mt-2" : "absolute z-50"} max-h-[min(22rem,60svh)] w-full overflow-y-auto overscroll-contain rounded-2xl border border-line/15 bg-white/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl`}
          >
            {options.map((option) => {
              const selected = option.value === active?.value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors ${
                    selected ? "bg-ink text-paper" : "text-ink/80 hover:bg-ink/5"
                  }`}
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                  {option.count !== undefined ? (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${selected ? "bg-white/20" : "bg-ink/8 text-ink/60"}`}>
                      {option.count}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
