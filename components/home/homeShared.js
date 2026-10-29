import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { stats as defaultStats } from "../../data/stats";
import CountUp from "../ui/CountUp";
import { HOME_PAGE_COPY, translateStat } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

export function getRevealProps(reduceMotion, delay = 0, amount = 0.24) {
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

export function MotionBlock({ children, className = "", delay = 0, amount = 0.24, reduceMotion }) {
  return (
    <motion.div className={className} {...getRevealProps(reduceMotion, delay, amount)}>
      {children}
    </motion.div>
  );
}

export const wordRevealVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

// Chiffres affichés en dur (jamais « 0+ ») ; un chiffre à 0 est masqué. Source : data/stats.js
export function StatsSection({ reduceMotion, items = defaultStats }) {
  const { lang } = useLanguage();
  const copy = HOME_PAGE_COPY[lang] || HOME_PAGE_COPY.fr;
  const visibleItems = items.filter((item) => item.valeur > 0).map((item) => translateStat(item, lang));
  if (!visibleItems.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <MotionBlock
        reduceMotion={reduceMotion}
        className="rounded-panel border border-line/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.62))] p-8 shadow-[0_24px_80px_rgba(12,10,8,0.06)] backdrop-blur-md md:p-12"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-ink/40">{copy.statsEyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight tracking-[-0.03em] md:text-5xl">
              {copy.statsTitle}
            </h2>
          </div>
        </div>

        <dl className={`mt-10 grid gap-6 sm:grid-cols-2 ${visibleItems.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.libelle}
              {...getRevealProps(reduceMotion, index * 0.08, 0.3)}
              className="border-t border-line/16 pt-5"
            >
              <dd className="font-serif text-5xl leading-none tracking-[-0.04em] text-ink md:text-6xl">
                <CountUp value={item.valeur} suffix={item.suffixe} delay={index * 0.12} />
              </dd>
              <dt className="mt-4 text-[11px] font-bold uppercase tracking-[0.24em] text-ink/55">{item.libelle}</dt>
              {item.precision ? <p className="mt-1 text-sm text-ink/45">{item.precision}</p> : null}
            </motion.div>
          ))}
        </dl>
      </MotionBlock>
    </section>
  );
}

// Logos blancs sur fond transparent, déposés dans public/images/partners/.
// `size` règle la hauteur (classes Tailwind) pour équilibrer les logos entre eux.
export const partners = [
  { name: "Kering Eyewear", logo: "/images/partners/kering-eyewear.png", size: "h-14 md:h-16", width: 689, height: 299 },
  { name: "Espace Grand Paris", logo: "/images/partners/espace-grand-paris.png", size: "h-14 md:h-16", width: 247, height: 172 },
  { name: "Taptap Send", logo: "/images/partners/taptap-send.png", size: "h-20 md:h-24", width: 191, height: 169 },
  { name: "Sofitel Le Scribe", logo: "/images/partners/le-scribe.png", size: "h-16 md:h-20", width: 332, height: 124 },
  { name: "Galeries Lafayette", logo: "/images/partners/galeries-lafayette.png", size: "h-16 md:h-20", width: 900, height: 472 },
  { name: "Printemps", logo: "/images/partners/printemps.png", size: "h-10 md:h-11", width: 342, height: 49 },
  { name: "Decathlon", logo: "/images/partners/decathlon.png", size: "h-10 md:h-12", width: 1011, height: 152 },
  { name: "UNESCO", logo: "/images/partners/unesco.png", size: "h-12 md:h-14", width: 3648, height: 774 },
  { name: "Les Flammes", logo: "/images/partners/les-flammes.png", size: "h-16 md:h-20", width: 486, height: 220 },
  { name: "Valeo", logo: "/images/partners/valeo.png", size: "h-14 md:h-16", width: 950, height: 412 },
  { name: "Rolling Stone Africa", logo: "/images/partners/rolling-stone-africa.png", size: "h-12 md:h-14", width: 900, height: 179 },
  { name: "NWE", logo: "/images/partners/nwe.png", size: "h-20 md:h-24", width: 524, height: 545 },
];

// Au survol, le défilement ralentit sans jamais s'arrêter ; hors survol il reprend son allure.
function useMarqueeSlowdown(trackRef, containerRef, slowRate = 0.3) {
  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return undefined;

    let rate = 1;
    let target = 1;
    let frame = 0;
    let last = 0;

    // Lissage dépendant du temps : même ressenti quelle que soit la fréquence d'affichage.
    const tick = (now) => {
      const delta = last ? Math.min(now - last, 100) : 16;
      last = now;
      rate += (target - rate) * (1 - Math.exp(-delta / 220));
      if (Math.abs(target - rate) < 0.005) rate = target;
      track.getAnimations().forEach((animation) => {
        animation.playbackRate = rate;
      });
      if (rate !== target) {
        frame = window.requestAnimationFrame(tick);
      } else {
        last = 0;
      }
    };

    const setTarget = (value) => {
      target = value;
      window.cancelAnimationFrame(frame);
      last = 0;
      frame = window.requestAnimationFrame(tick);
    };

    const slow = () => setTarget(slowRate);
    const fast = () => setTarget(1);

    container.addEventListener("mouseenter", slow);
    container.addEventListener("mouseleave", fast);
    return () => {
      window.cancelAnimationFrame(frame);
      container.removeEventListener("mouseenter", slow);
      container.removeEventListener("mouseleave", fast);
    };
  }, [trackRef, containerRef, slowRate]);
}

export function PartnersSection({ reduceMotion, items = partners }) {
  const { lang } = useLanguage();
  const copy = HOME_PAGE_COPY[lang] || HOME_PAGE_COPY.fr;
  const loop = [...items, ...items];
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  useMarqueeSlowdown(trackRef, containerRef);

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <MotionBlock reduceMotion={reduceMotion} className="space-y-10">
        <div className="max-w-2xl space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-paper/55">{copy.partnersEyebrow}</p>
          <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] text-paper md:text-6xl">
            {copy.partnersTitle}
          </h2>
        </div>

        <div ref={containerRef} className="partners-mask relative overflow-hidden rounded-panel border border-white/10 bg-white/[0.03] py-12 backdrop-blur-sm">
          <ul ref={trackRef} className={`flex w-max items-center gap-16 px-8 md:gap-24 ${reduceMotion ? "" : "partners-track"}`}>
            {loop.map((partner, index) => (
              <li
                key={`${partner.name}-${index}`}
                aria-hidden={index >= items.length ? "true" : undefined}
                className="flex h-24 shrink-0 items-center opacity-65 transition duration-500 hover:opacity-100"
              >
                <Image
                  src={partner.logo}
                  alt={index >= items.length ? "" : partner.name}
                  width={partner.width}
                  height={partner.height}
                  className={`${partner.size} w-auto object-contain`}
                />
              </li>
            ))}
          </ul>
        </div>
      </MotionBlock>
    </section>
  );
}
