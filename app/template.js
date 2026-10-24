"use client";

import { motion, useReducedMotion } from "framer-motion";

// Entrée en fondu doux à chaque changement de page (le template est recréé à chaque navigation).
export default function Template({ children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
