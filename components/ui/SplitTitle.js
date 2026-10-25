"use client";

import { motion, useReducedMotion } from "framer-motion";

// Titre qui apparaît mot par mot, chaque mot montant depuis un masque.
export default function SplitTitle({ text, as = "h1", className = "", delay = 0.1 }) {
  const reduceMotion = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span className="-mb-[0.28em] inline-block overflow-hidden pb-[0.28em] align-bottom">
            <motion.span
              className="inline-block"
              initial={reduceMotion ? false : { y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: delay + index * 0.055, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          </span>
        </span>
      ))}
    </Tag>
  );
}
