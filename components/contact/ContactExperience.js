"use client";

import { motion, useReducedMotion } from "framer-motion";
import ContactForm from "../ContactForm";
import MagneticElement from "../MagneticElement";
import { Fragment, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "../../lib/siteConfig";
import { PAGES_COPY } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

function getRevealProps(reduceMotion, delay = 0, amount = 0.22) {
  if (reduceMotion) {
    return {
      viewport: { once: true, amount },
    };
  }

  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount },
    transition: {
      duration: 0.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  };
}

export default function ContactExperience({ type = "" }) {
  const { lang } = useLanguage();
  const copy = PAGES_COPY.contact[lang] || PAGES_COPY.contact.fr;
  const reduceMotion = useReducedMotion();
  const headline = copy.headline;
  const headlineRef = useRef(null);

  useGSAP(() => {
    if (reduceMotion) return;

    gsap.fromTo(
      ".word-stagger",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.5,
      }
    );
  }, { scope: headlineRef, dependencies: [headline] });

  return (
    <div ref={headlineRef} data-page="contact" className="page-shell mx-auto max-w-7xl space-y-16 px-4 pb-20 pt-12 md:space-y-24 md:px-8">
      <section>
        <motion.div className="space-y-6" {...getRevealProps(reduceMotion)}>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-ink/50">{copy.eyebrow}</p>
          <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] tracking-[-0.05em] md:text-8xl flex flex-wrap gap-x-[0.2em] gap-y-2">
            {headline.split(" ").map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                {i > 0 ? " " : null}
                <span className="-mb-[0.28em] inline-flex overflow-hidden pb-[0.28em]">
                  <span className="word-stagger inline-block">{word}</span>
                </span>
              </Fragment>
            ))}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-ink/75 md:text-xl">
            {copy.lead}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <MagneticElement strength={0.2}>
              <a
                href="#contact-form"
                className="inline-block px-1 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {copy.jumpToForm}
              </a>
            </MagneticElement>
          </div>
        </motion.div>
      </section>

      <section className="space-y-8">
        <motion.div
          className="rounded-panel border border-line/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.68))] p-6 shadow-[0_32px_96px_rgba(12,10,8,0.08)] backdrop-blur-md md:p-10"
          {...getRevealProps(reduceMotion, 0.1)}
        >
          <div className="mb-6 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/45">{copy.requestEyebrow}</p>
            <p className="max-w-2xl text-sm leading-relaxed text-ink/62 md:text-base">
              {copy.requestLead}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-ink/75 md:text-base">
              {copy.pricingPrefix}{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4 hover:text-ink">
                {siteConfig.email}
              </a>
            </p>
          </div>
          <ContactForm type={type} />
        </motion.div>

        <motion.div
          className="rounded-card border border-line/12 bg-[var(--paper)] p-8 shadow-[0_24px_80px_rgba(12,10,8,0.04)] backdrop-blur-sm"
          {...getRevealProps(reduceMotion, 0.16)}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/40 mb-6">{copy.faqEyebrow}</p>
          <div className="space-y-4">
            {copy.faq.map((item, idx) => (
              <details
                key={item.q}
                className={`group cursor-pointer ${idx < copy.faq.length - 1 ? "border-b border-line/10 pb-4" : ""}`}
              >
                <summary className="font-serif text-xl font-medium tracking-tight text-ink flex justify-between items-center outline-none">
                  {item.q}
                  <span className="text-ink/40 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <p className="mt-3 text-sm text-ink/70 leading-relaxed opacity-0 group-open:opacity-100 transition-opacity duration-300">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-card border border-line/12 bg-white/40 p-8 text-center backdrop-blur-sm"
          {...getRevealProps(reduceMotion, 0.22)}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink/40 mb-4">{copy.socialEyebrow}</p>
          <h3 className="font-serif text-2xl tracking-tight text-ink mb-6">{copy.socialTitle}</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {siteConfig.socialLinks.map((link) => (
              <MagneticElement key={link.href} strength={0.15}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-line/20 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink hover:bg-white"
                >
                  {link.name}
                </a>
              </MagneticElement>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
