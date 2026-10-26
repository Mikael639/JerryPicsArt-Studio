"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticElement from "../MagneticElement";
import {
  MotionBlock,
  PartnersSection,
  StatsSection,
  wordRevealVariant,
} from "./homeShared";
import ReferencesBand from "../ui/ReferencesBand";
import Steps from "../ui/Steps";
import Testimonials from "../ui/Testimonials";
import ContactBlock from "../ui/ContactBlock";
import TrackedLink from "../ui/TrackedLink";
import { HOME_PAGE_COPY } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const HERO_SLIDE_DURATION_MS = 8400;
const HOME_SLIDESHOW_LIMIT = 10;
const DEFAULT_HERO_POSITION = "center 16%";
const DEFAULT_MOBILE_HERO_POSITION = "center center";

function getHeroPriority(photo) {
  const roles = new Set(photo?.roles || []);
  return (
    (roles.has("hero") ? 8 : 0) +
    (roles.has("featured") ? 4 : 0) +
    (roles.has("servicesBackground") ? 1 : 0) +
    (photo?.isPinned ? 1 : 0)
  );
}

export default function HomePageExperience({
  heroPhoto,
  supportingPhotos,
  doorPhotos = {},
  cinematicPool = [],
  references,
  stats,
  testimonials,
  siteText = {},
}) {
  const { lang } = useLanguage();
  const copy = HOME_PAGE_COPY[lang] || HOME_PAGE_COPY.fr;
  const reduceMotion = useReducedMotion();
  const [useCalmHeroMotion, setUseCalmHeroMotion] = useState(false);

  const heroTitle =
    lang === "en" ? copy.heroTitle : siteText.heroTitle || copy.heroTitle;
  const heroSubtitle =
    lang === "en" ? copy.heroSubtitle : siteText.heroSubtitle || copy.heroSubtitle;

  function getHeroLabel(category) {
    return copy.heroLabels[category] || copy.heroLabels.default;
  }

  const doors = [
    {
      href: "/evenements",
      titre: copy.doors.evenements.titre,
      texte: copy.doors.evenements.texte,
      lien: copy.doors.evenements.lien,
      photo: doorPhotos.evenements,
    },
    {
      href: "/mariage",
      titre: copy.doors.mariage.titre,
      texte: copy.doors.mariage.texte,
      lien: copy.doors.mariage.lien,
      photo: doorPhotos.mariage,
    },
    {
      href: "/entreprises",
      titre: copy.doors.entreprises.titre,
      texte: copy.doors.entreprises.texte,
      lien: copy.doors.entreprises.lien,
      photo: doorPhotos.entreprises,
    },
  ];
  const cinematicPhotos = useMemo(() => {
    const seen = new Set();
    const heroPool = cinematicPool.filter((photo) => photo?.roles?.includes("hero"));
    const prioritizedPool = [...heroPool].sort((left, right) => {
      const priorityDiff = getHeroPriority(right) - getHeroPriority(left);
      if (priorityDiff !== 0) return priorityDiff;
      return (left.sortOrder || 0) - (right.sortOrder || 0);
    });

    return prioritizedPool
      .filter((photo) => {
        if (!photo?.id || seen.has(photo.id)) return false;
        seen.add(photo.id);
        return true;
      })
      .slice(0, HOME_SLIDESHOW_LIMIT);
  }, [cinematicPool]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const shuffledPhotos = cinematicPhotos;
  const activeHeroPhoto = shuffledPhotos[activeHeroIndex] || heroPhoto;
  const activeHeroPosition = activeHeroPhoto.objectPosition || DEFAULT_HERO_POSITION;
  const activeMobileHeroPosition = activeHeroPhoto.mobileObjectPosition || DEFAULT_MOBILE_HERO_POSITION;
  const nextHeroPhoto =
    shuffledPhotos.length > 1 ? shuffledPhotos[(activeHeroIndex + 1) % shuffledPhotos.length] : null;
  const containerRef = useRef(null);
  const swipeStartRef = useRef(null);
  const visibleHeroDots = shuffledPhotos.slice(0, 5);
  const shouldCalmHeroMotion = reduceMotion || useCalmHeroMotion;

  // Photo qui vient de quitter l'écran : elle reste affichée dessous le temps du fondu de la suivante (mode tablette).
  const [outgoingHeroPhoto, setOutgoingHeroPhoto] = useState(null);
  const lastHeroPhotoRef = useRef(activeHeroPhoto);
  useEffect(() => {
    const last = lastHeroPhotoRef.current;
    lastHeroPhotoRef.current = activeHeroPhoto;
    if (!last || last.id === activeHeroPhoto.id) return undefined;
    setOutgoingHeroPhoto(last);
    const timer = window.setTimeout(() => setOutgoingHeroPhoto(null), 1400);
    return () => window.clearTimeout(timer);
  }, [activeHeroPhoto]);

  function showPreviousHeroPhoto() {
    setActiveHeroIndex((currentIndex) => (currentIndex === 0 ? shuffledPhotos.length - 1 : currentIndex - 1));
  }

  function showNextHeroPhoto() {
    setActiveHeroIndex((currentIndex) => (currentIndex + 1) % shuffledPhotos.length);
  }

  useEffect(() => {
    // Toute tablette tactile, quelle que soit sa taille : une grande tablette (ex. 13 pouces, ~1440 px de large)
    // ne supporte pas mieux les flous animés sur une photo plein écran, au contraire.
    const query = window.matchMedia("(pointer: coarse) and (min-width: 768px)");
    const updateMotionMode = () => setUseCalmHeroMotion(query.matches);

    updateMotionMode();
    query.addEventListener("change", updateMotionMode);
    return () => query.removeEventListener("change", updateMotionMode);
  }, []);

  useGSAP(() => {
    if (shouldCalmHeroMotion) return;

    const heroImages = gsap.utils.toArray(".hero-image-container");
    if (heroImages.length) {
      gsap.fromTo(
        heroImages,
        { scale: 1.2, filter: "blur(10px)" },
        { scale: 1, filter: "blur(0px)", duration: 2.4, ease: "expo.out", delay: 0.5 }
      );
    }

    const sections = gsap.utils.toArray("section.color-transition-section");
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          document.documentElement.dataset.theme = "dark";
          gsap.to(document.body, { backgroundColor: "#0c0a08", duration: 1 });
        },
        onLeaveBack: () => {
          delete document.documentElement.dataset.theme;
          gsap.to(document.body, { backgroundColor: "#fefdfa", duration: 1 });
        },
      });
    });

    const parallaxImages = gsap.utils.toArray(".parallax-img");
    parallaxImages.forEach((img) => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, { scope: containerRef, dependencies: [shouldCalmHeroMotion] });

  useEffect(() => {
    if (reduceMotion || isHeroPaused || shuffledPhotos.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveHeroIndex((currentIndex) => (currentIndex + 1) % shuffledPhotos.length);
    }, HERO_SLIDE_DURATION_MS);

    return () => window.clearInterval(interval);
  }, [isHeroPaused, shuffledPhotos.length, reduceMotion]);

  return (
    <div ref={containerRef} data-page="home" className="page-shell -mt-20 space-y-20 pb-16 md:space-y-28 xl:space-y-32">
      <section
        className="relative isolate min-h-screen overflow-hidden bg-[#0c0a08]"
        onTouchStart={(event) => {
          swipeStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }}
        onTouchEnd={(event) => {
          const start = swipeStartRef.current;
          swipeStartRef.current = null;
          if (!start || shuffledPhotos.length < 2) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          // Balayage horizontal net : photo suivante ou précédente, comme dans un carrousel.
          if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) showNextHeroPhoto();
            else showPreviousHeroPhoto();
          }
        }}
      >
        <div className="absolute inset-0">
          {shouldCalmHeroMotion ? (
            <>
              {outgoingHeroPhoto ? (
                <div key={`out-${outgoingHeroPhoto.id}`} className="absolute inset-0">
                  <Image
                    src={outgoingHeroPhoto.src}
                    alt=""
                    fill
                    sizes="100vw"
                    aria-hidden="true"
                    className="hero-main-image object-cover sharpen-img"
                    style={{
                      "--hero-position": outgoingHeroPhoto.objectPosition || DEFAULT_HERO_POSITION,
                      "--hero-mobile-position": outgoingHeroPhoto.mobileObjectPosition || DEFAULT_MOBILE_HERO_POSITION,
                    }}
                  />
                </div>
              ) : null}
            <div key={activeHeroPhoto.id} className="hero-fade-in absolute inset-0 hero-image-container">
              <Image
                src={activeHeroPhoto.src}
                alt={activeHeroPhoto.alt}
                fill
                priority
                sizes="100vw"
                className="hero-main-image object-cover sharpen-img"
                style={{
                  "--hero-position": activeHeroPosition,
                  "--hero-mobile-position": activeMobileHeroPosition,
                }}
              />
            </div>
            </>
          ) : (
            // Fondu enchaîné : la nouvelle photo apparaît par-dessus l'ancienne, sans jamais laisser l'écran vide.
            <AnimatePresence>
              <motion.div
                key={activeHeroPhoto.id}
                className="absolute inset-0 hero-image-container"
                initial={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1.04, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  animate={isHeroPaused ? { scale: 1 } : { scale: 1.08 }}
                  transition={{ duration: HERO_SLIDE_DURATION_MS / 1000, ease: "linear" }}
                >
                  <Image
                    src={activeHeroPhoto.src}
                    alt={activeHeroPhoto.alt}
                    fill
                    priority
                    sizes="100vw"
                    className="hero-main-image object-cover sharpen-img"
                    style={{
                      "--hero-position": activeHeroPosition,
                      "--hero-mobile-position": activeMobileHeroPosition,
                    }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
          {nextHeroPhoto ? (
            <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
              <Image
                src={nextHeroPhoto.src}
                alt=""
                width={1}
                height={1}
                sizes="100vw"
                loading="eager"
                aria-hidden="true"
              />
            </div>
          ) : null}
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0.30)_0%,rgba(12,10,8,0.08)_32%,rgba(12,10,8,0.40)_70%,rgba(12,10,8,0.88)_100%)] md:bg-[linear-gradient(180deg,rgba(12,10,8,0.46)_0%,rgba(12,10,8,0.16)_32%,rgba(12,10,8,0.42)_68%,rgba(12,10,8,0.90)_100%)]" />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.035)_42%,transparent_58%)]"
          animate={shouldCalmHeroMotion ? undefined : { x: ["-12%", "12%", "-12%"] }}
          transition={shouldCalmHeroMotion ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_60%)]"
          animate={shouldCalmHeroMotion ? undefined : { opacity: [0.05, 0.12, 0.05] }}
          transition={shouldCalmHeroMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-paper/20 to-paper" />

        <div className="relative mx-auto grid min-h-[100svh] max-w-7xl content-end gap-8 px-4 pb-10 pt-28 md:min-h-screen md:gap-12 md:px-8 md:pb-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <motion.div
            initial={false}
            animate={{
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.3 },
            }}
            className="max-w-4xl text-paper"
          >
            <motion.h1
              variants={wordRevealVariant}
              className="max-w-[18ch] font-serif text-4xl font-medium leading-[0.98] tracking-[-0.03em] text-paper [text-wrap:balance] [text-shadow:0_2px_30px_rgba(12,10,8,0.45)] sm:text-5xl md:text-6xl xl:text-[4.5rem]"
            >
              {heroTitle}
            </motion.h1>

            <motion.p
              variants={wordRevealVariant}
              className="mt-5 max-w-2xl text-base leading-relaxed text-paper/80 [text-shadow:0_1px_18px_rgba(12,10,8,0.5)] md:text-lg"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div variants={wordRevealVariant} className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 hero-content-reveal">
              <MagneticElement strength={0.25}>
                <TrackedLink
                  href="/contact"
                  event="devis_accueil_hero"
                  className="inline-block rounded-full bg-paper px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink shadow-2xl transition-colors hover:bg-accent hover:text-paper sm:px-8 sm:py-4 sm:text-[13px] sm:tracking-[0.22em]"
                >
                  {copy.ctaPrimary}
                </TrackedLink>
              </MagneticElement>
              <Link
                href="/signature"
                className="-my-2.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper/80 underline-offset-4 transition-colors hover:text-paper hover:underline sm:text-[13px]"
              >
                {copy.ctaSecondary}
              </Link>
            </motion.div>

            {shuffledPhotos.length > 1 ? (
              <motion.div variants={wordRevealVariant} className="mt-5 flex max-w-xl items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={showPreviousHeroPhoto}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/18 bg-black/18 text-paper/70 transition hover:border-paper/45 hover:text-paper sm:h-9 sm:w-9"
                  aria-label={copy.prevSlide}
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsHeroPaused((current) => !current)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/18 bg-black/18 text-paper/70 transition hover:border-paper/45 hover:text-paper sm:h-9 sm:w-9"
                  aria-label={isHeroPaused ? copy.resumeSlide : copy.pauseSlide}
                >
                  <span aria-hidden="true">{isHeroPaused ? "▶" : "Ⅱ"}</span>
                </button>
                <button
                  type="button"
                  onClick={showNextHeroPhoto}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/18 bg-black/18 text-paper/70 transition hover:border-paper/45 hover:text-paper sm:h-9 sm:w-9"
                  aria-label={copy.nextSlide}
                >
                  <span aria-hidden="true">›</span>
                </button>
                <div className="relative h-px flex-1 overflow-hidden bg-paper/14">
                  <motion.div
                    key={`${activeHeroPhoto.id}-${isHeroPaused ? "paused" : "playing"}`}
                    className="absolute inset-y-0 left-0 bg-paper/70"
                    initial={{ width: "0%" }}
                    animate={{ width: isHeroPaused || reduceMotion ? "0%" : "100%" }}
                    transition={reduceMotion ? undefined : { duration: HERO_SLIDE_DURATION_MS / 1000, ease: "linear" }}
                  />
                </div>
                <span className="min-w-14 text-right font-serif text-xl leading-none text-paper/75">
                  {String(activeHeroIndex + 1).padStart(2, "0")}
                  <span className="mx-1 text-paper/25">/</span>
                  <span className="text-sm text-paper/45">{String(shuffledPhotos.length).padStart(2, "0")}</span>
                </span>
              </motion.div>
            ) : null}
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reduceMotion ? undefined : { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 hidden gap-4 hero-content-reveal lg:grid"
          >
            {supportingPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative min-h-[15rem] overflow-hidden rounded-card border border-white/10 bg-black/20 backdrop-blur-sm"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="parallax-img object-cover sharpen-img transition-transform duration-1000 hover:scale-110 scale-[1.08]"
                  style={{ objectPosition: photo.objectPosition || "center center" }}
                  quality={90}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0),rgba(12,10,8,0.22))]" />
              </div>
            ))}

            <div className="rounded-card border border-white/10 bg-black/40 p-6 text-paper/90 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/50">{getHeroLabel(activeHeroPhoto.category)}</p>
                {shuffledPhotos.length > 1 ? (
                  <div className="flex items-center gap-2">
                    {visibleHeroDots.map((photo, index) => (
                      <button
                        key={photo.id}
                        type="button"
                        aria-label={copy.showSlide(photo.title)}
                        onClick={() => {
                          setActiveHeroIndex(index);
                          setIsHeroPaused(true);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          activeHeroIndex === index ? "w-6 bg-paper/90" : "w-1.5 bg-paper/20 hover:bg-paper/40"
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
        <style jsx global>{`
          .hero-main-image {
            object-position: var(--hero-position);
          }

          @media (max-width: 767px) {
            .hero-main-image {
              object-position: var(--hero-mobile-position);
            }
          }
        `}</style>
      </section>

      <ReferencesBand items={references} />

      <section className="mx-auto max-w-7xl px-4 md:px-8" aria-labelledby="portes-titre">
        <MotionBlock reduceMotion={reduceMotion} className="mb-10 max-w-3xl space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-ink/45">{copy.doorsEyebrow}</p>
          <h2 id="portes-titre" className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
            {copy.doorsTitle}
          </h2>
        </MotionBlock>
        <div className="grid gap-5 md:grid-cols-3">
          {doors.map((door, index) => (
            <MotionBlock key={door.href} reduceMotion={reduceMotion} delay={index * 0.08} className="h-full">
              <Link
                href={door.href}
                className="group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-card border border-line/12 bg-ink text-paper md:min-h-[32rem]"
              >
                {door.photo ? (
                  <Image
                    src={door.photo.src}
                    alt={door.photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.05]"
                    style={{ objectPosition: door.photo.objectPosition || "center center" }}
                    quality={85}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0.05),rgba(12,10,8,0.82))]" />
                <div className="relative space-y-3 p-7">
                  <h3 className="font-serif text-3xl tracking-tight">{door.titre}</h3>
                  <p className="text-base leading-relaxed text-paper/80">{door.texte}</p>
                  <span className="inline-flex items-center gap-3 pt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-paper/80">
                    {door.lien}
                    <span className="h-px w-8 bg-paper/50 transition-all duration-300 group-hover:w-14" />
                  </span>
                </div>
              </Link>
            </MotionBlock>
          ))}
        </div>
      </section>

      <section
        data-cursor-surface="dark"
        className="color-transition-section mx-auto max-w-7xl px-4 md:px-8"
        aria-labelledby="methode-titre"
      >
        <MotionBlock reduceMotion={reduceMotion} className="mb-10 max-w-3xl space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-paper/55">{copy.methodEyebrow}</p>
          <h2 id="methode-titre" className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] text-paper md:text-6xl">
            {copy.methodTitle}
          </h2>
        </MotionBlock>
        <Steps tone="dark" columns="md:grid-cols-3" steps={copy.method} />
      </section>

      <PartnersSection reduceMotion={reduceMotion} />

      <StatsSection reduceMotion={reduceMotion} items={stats} />

      <Testimonials items={testimonials} limit={1} tone="dark" title={copy.testimonialsTitle} />

      <ContactBlock
        title={copy.contactTitle}
        text={copy.contactText}
        event="devis_accueil_final"
        themeSwitch={false}
      />
    </div>
  );
}
