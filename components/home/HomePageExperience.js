"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCalmMotion } from "../../lib/useCalmMotion";
import {
  MotionBlock,
  PartnersSection,
  StatsSection,
} from "./homeShared";
import ArticleEnd from "../ui/ArticleEnd";
import Steps from "../ui/Steps";
import Testimonials from "../ui/Testimonials";
import ContactBlock from "../ui/ContactBlock";
import { HOME_PAGE_COPY } from "../../lib/i18n";
import { localize } from "../../data/univers";
import { useLanguage } from "../LanguageProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const HERO_SLIDE_DURATION_MS = 5600;
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

// Rapport largeur/hauteur des photos du diaporama déjà chargées (pour ne pas les recadrer au changement de diapositive).
const heroRatios = new Map();
// En dessous de ce rapport, la photo est trop « verticale » pour un écran large : recadrée en plein écran,
// on n'en verrait que le milieu (un visage coupé à la bouche). Sur ordinateur, on la montre alors en entier.
const PORTRAIT_RATIO = 1.3;

function HeroImage({ photo, alt, priority = false, position, mobilePosition }) {
  const [ratio, setRatio] = useState(() => heroRatios.get(photo.src) || 0);
  const portrait = ratio > 0 && ratio < PORTRAIT_RATIO;

  return (
    <>
      {/* Fond : la même photo, minuscule et agrandie (donc floue), qui remplit les côtés (ordinateur seulement). */}
      {portrait ? (
        <Image
          src={photo.src}
          alt=""
          fill
          sizes="6vw"
          quality={75}
          aria-hidden="true"
          className="hidden scale-110 object-cover opacity-70 md:block"
        />
      ) : null}
      <Image
        src={photo.src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        data-portrait={portrait ? "" : undefined}
        aria-hidden={alt ? undefined : "true"}
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          if (!naturalWidth || !naturalHeight) return;
          const next = naturalWidth / naturalHeight;
          heroRatios.set(photo.src, next);
          setRatio(next);
        }}
        className="hero-main-image object-cover sharpen-img"
        style={{ "--hero-position": position, "--hero-mobile-position": mobilePosition }}
      />
    </>
  );
}

export default function HomePageExperience({
  heroPhoto,
  doorPhotos = {},
  universCovers = [],
  cinematicPool = [],
  stats,
  testimonials,
  siteText = {},
}) {
  const { lang } = useLanguage();
  const copy = HOME_PAGE_COPY[lang] || HOME_PAGE_COPY.fr;
  const reduceMotion = useReducedMotion();
  const calmDevice = useCalmMotion();

  const heroTitle =
    lang === "en" ? copy.heroTitle : siteText.heroTitle || copy.heroTitle;
  const heroSubtitle =
    lang === "en" ? copy.heroSubtitle : siteText.heroSubtitle || copy.heroSubtitle;

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
  const shouldCalmHeroMotion = reduceMotion || calmDevice;

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
                  <HeroImage
                    photo={outgoingHeroPhoto}
                    alt=""
                    position={outgoingHeroPhoto.objectPosition || DEFAULT_HERO_POSITION}
                    mobilePosition={outgoingHeroPhoto.mobileObjectPosition || DEFAULT_MOBILE_HERO_POSITION}
                  />
                </div>
              ) : null}
            <div key={activeHeroPhoto.id} className="hero-fade-in absolute inset-0 hero-image-container">
              <HeroImage
                photo={activeHeroPhoto}
                alt={activeHeroPhoto.alt}
                priority
                position={activeHeroPosition}
                mobilePosition={activeMobileHeroPosition}
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
                  <HeroImage
                    photo={activeHeroPhoto}
                    alt={activeHeroPhoto.alt}
                    priority
                    position={activeHeroPosition}
                    mobilePosition={activeMobileHeroPosition}
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

        {/* Ouverture : les photos parlent. Seuls éléments par-dessus : une phrase d'accroche discrète
            et les commandes du carrousel avec le compteur. Le H1 et les boutons suivent juste dessous. */}
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end gap-5 px-4 pb-10 pt-28 md:min-h-screen md:px-8 md:pb-16">
          <motion.p
            initial={false}
            animate={{ opacity: 1 }}
            className="max-w-xl font-serif text-2xl leading-[1.12] tracking-[-0.015em] text-paper [text-shadow:0_2px_24px_rgba(12,10,8,0.7)] sm:text-3xl md:text-4xl lg:text-[2.65rem]"
          >
            {copy.heroTagline}
          </motion.p>

          {shuffledPhotos.length > 1 ? (
            <div className="flex max-w-xl items-center gap-2 sm:gap-3">
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
            </div>
          ) : null}
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

          @media (min-width: 768px) {
            .hero-main-image[data-portrait] {
              object-fit: contain;
              object-position: center;
            }
          }
        `}</style>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8" aria-labelledby="accueil-titre">
        <MotionBlock reduceMotion={reduceMotion} className="max-w-4xl space-y-6">
          <h1
            id="accueil-titre"
            className="max-w-[20ch] font-serif text-4xl font-medium leading-[0.98] tracking-[-0.03em] text-ink [text-wrap:balance] sm:text-5xl md:text-6xl xl:text-[4.5rem]"
          >
            {heroTitle}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">{heroSubtitle}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-1">
            <Link
              href="/signature"
              className="-my-2.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline sm:text-[13px]"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </MotionBlock>
      </section>

      {/* « Parlez-moi de votre projet » : remonté juste sous l'accroche, à la place du bouton « Demander un devis ». */}
      <ContactBlock
        title={copy.contactTitle}
        text={copy.contactText}
        event="devis_accueil_final"
        themeSwitch={false}
        tone="light"
      />

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
                    quality={75}
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

      {universCovers.length ? (
        <section className="mx-auto max-w-7xl px-4 md:px-8" aria-labelledby="univers-titre">
          <MotionBlock reduceMotion={reduceMotion} className="mb-10 max-w-3xl space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-ink/45">{copy.universEyebrow}</p>
            <h2 id="univers-titre" className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
              {copy.universTitle}
            </h2>
          </MotionBlock>
          {/* Une couverture par univers, chacune mène à l'univers sur sa page. */}
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
            {universCovers.map((item, index) => (
              <li key={item.href}>
                <MotionBlock reduceMotion={reduceMotion} delay={(index % 5) * 0.05}>
                  <Link
                    href={item.href}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-[0.8rem] bg-ink text-paper"
                  >
                    <Image
                      src={item.cover.src}
                      alt={item.cover.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover transition duration-[1.4s] ease-out group-hover:scale-[1.05]"
                      quality={75}
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0)_45%,rgba(12,10,8,0.78))]" />
                    <span className="absolute inset-x-0 bottom-0 p-4 font-serif text-lg leading-tight md:text-xl">
                      {localize(item.titre, lang)}
                    </span>
                  </Link>
                </MotionBlock>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <PartnersSection reduceMotion={reduceMotion} />



      <section
        data-cursor-surface="dark"
        className="mx-auto max-w-7xl px-4 md:px-8"
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

      

      <StatsSection reduceMotion={reduceMotion} items={stats} />

      <Testimonials items={testimonials} limit={1} tone="dark" title={copy.testimonialsTitle} />

      <ArticleEnd />
    </div>
  );
}
