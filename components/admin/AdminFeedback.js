"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SUCCESS_DURATION_MS = 4500;
const ERROR_DURATION_MS = 9000;

export default function AdminFeedback({ errorMessage, statusMessage }) {
  const message = errorMessage || statusMessage;
  const isError = Boolean(errorMessage);
  const [dismissed, setDismissed] = useState("");

  // Le message disparaît tout seul (il restait à l'écran pendant le défilement) ; un clic le ferme aussi.
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setDismissed(message), isError ? ERROR_DURATION_MS : SUCCESS_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [message, isError]);

  const isVisible = Boolean(message) && message !== dismissed;

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed left-4 right-4 top-4 z-[120] rounded-2xl border px-4 py-3 text-sm shadow-[0_18px_60px_rgba(12,10,8,0.16)] backdrop-blur-xl sm:left-auto sm:max-w-sm md:right-8 ${
            isError
              ? "border-red-200 bg-red-50/92 text-red-800"
              : "border-emerald-200 bg-emerald-50/92 text-emerald-800"
          }`}
          role="status"
        >
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${isError ? "bg-red-600" : "bg-emerald-600"}`} />
            <p className="flex-1">{message}</p>
            <button
              type="button"
              onClick={() => setDismissed(message)}
              aria-label="Fermer le message"
              className="-mr-1 text-base leading-none opacity-60 transition hover:opacity-100"
            >
              ×
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
