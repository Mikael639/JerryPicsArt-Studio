"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

function normalizeOption(option) {
  if (option && typeof option === "object" && "value" in option) {
    return { value: String(option.value), label: String(option.label ?? option.value) };
  }
  return { value: String(option ?? ""), label: String(option ?? "") };
}

export default function CustomSelect({
  name,
  options,
  defaultValue,
  label,
  error,
  className = "",
}) {
  const normalizedOptions = useMemo(() => (options || []).map(normalizeOption), [options]);
  const initialVal = defaultValue !== undefined ? String(defaultValue) : normalizedOptions[0]?.value || "";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialVal);
  const containerRef = useRef(null);

  // Si la liste change (ex: bascule FR/EN sur le placeholder), garder une valeur valide.
  const activeOption =
    normalizedOptions.find((opt) => opt.value === selectedValue) || normalizedOptions[0] || { value: "", label: "" };

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  // Ferme la liste si la page défile vraiment (son ancre bouge à l'écran). Un simple événement
  // "scroll" ne suffit pas : GSAP (ScrollTrigger) et le défilement doux en déclenchent parfois sans
  // que la position ait réellement changé, ce qui refermait la liste juste après son ouverture.
  useEffect(() => {
    if (!isOpen) return;
    const startY = window.scrollY;
    function handleScroll() {
      if (Math.abs(window.scrollY - startY) > 4) close();
    }
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [isOpen, close]);

  const handleSelect = (optionValue) => {
    setSelectedValue(optionValue);
    close();
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen) {
        close();
      } else {
        setIsOpen(true);
      }
    } else if (isOpen && normalizedOptions.length > 0) {
      const currentIndex = Math.max(
        0,
        normalizedOptions.findIndex((opt) => opt.value === activeOption.value)
      );
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedValue(normalizedOptions[(currentIndex + 1) % normalizedOptions.length].value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedValue(
          normalizedOptions[(currentIndex - 1 + normalizedOptions.length) % normalizedOptions.length].value
        );
      }
    }
  };

  return (
    <div className={`relative space-y-2 ${className}`} ref={containerRef}>
      {label && (
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58 block">
          {label}
        </span>
      )}

      <input type="hidden" name={name} value={activeOption.value} />

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 outline-none transition-all duration-300 ${
          isOpen
            ? "border-accent bg-white shadow-sm ring-1 ring-accent/20"
            : "border-line/18 bg-paper/88 hover:border-line/40"
        } ${error ? "border-red-400" : ""}`}
      >
        <span className="text-sm font-medium text-ink">{activeOption.label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-ink/40"
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            className="absolute z-50 w-full overflow-hidden rounded-xl border border-line/15 bg-white/95 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl"
          >
            {normalizedOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={activeOption.value === option.value}
                onClick={() => handleSelect(option.value)}
                className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  activeOption.value === option.value
                    ? "bg-ink text-paper"
                    : "text-ink/80 hover:bg-ink/5"
                }`}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <span className="text-xs text-red-700 block">{error}</span>}
    </div>
  );
}

function ChevronDownIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}
