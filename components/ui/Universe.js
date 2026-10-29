"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FeaturedPhoto, isLandscapePhoto, PhotoPair, PhotoTiles, SeeAllButton, usePhotoViewer } from "./PhotoGrid";
import { localize } from "../../data/univers";
import { useLanguage } from "../LanguageProvider";

const MAX_PREVIEW_PHOTOS = 6;
const PAIR_MIN_PHOTOS = 6;

function pad(number) {
  return String(number).padStart(2, "0");
}

// Sommaire numéroté des univers de la page, collant sur téléphone (sous l'en-tête). L'univers lu est souligné.
export function UniverseNav({ items }) {
  const { lang } = useLanguage();
  const [activeSlug, setActiveSlug] = useState("");

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.slug)).filter(Boolean);
    if (!sections.length || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActiveSlug(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-label={lang === "en" ? "Contents" : "Sommaire"}
      className="universe-nav sticky top-[73px] z-30 border-b transition-colors duration-700 border-line/12 bg-paper/92 backdrop-blur-md md:static md:border-b-0 md:bg-transparent md:backdrop-blur-none"
    >
      <ul className="no-scrollbar mx-auto flex max-w-7xl items-stretch gap-2 overflow-x-auto px-4 py-2 md:grid md:grid-flow-col md:auto-cols-fr md:gap-4 md:overflow-visible md:px-8 md:py-0">
        {items.map((item, index) => {
          const active = activeSlug === item.slug;
          const cover = item.couverture || item.images?.[0];
          return (
            <li key={item.slug} className="shrink-0 md:shrink">
              <Link
                href={`#${item.slug}`}
                aria-current={active ? "true" : undefined}
                className={`flex h-full items-center gap-3 rounded-[0.7rem] border p-1.5 pr-3 transition-colors md:p-2 md:pr-4 ${
                  active ? "border-accent bg-white/60" : "border-line/15 hover:border-ink/35"
                }`}
              >
                {cover ? (
                  <span className="relative h-10 w-8 shrink-0 overflow-hidden rounded-[0.4rem] bg-ink/10 md:h-16 md:w-12">
                    <Image src={cover.src} alt="" fill sizes="48px" quality={75} className="object-cover" />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block font-serif text-[13px] leading-none text-ink/45 md:text-[15px]">{pad(index + 1)}</span>
                  <span
                    className={`mt-1 block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] md:whitespace-normal md:text-[11px] md:leading-tight ${
                      active ? "text-ink" : "text-ink/65"
                    }`}
                  >
                    {localize(item.court, lang)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Univers, à la manière d'un article de magazine : surtitre numéroté, titre, chapô, crédits, photo d'ouverture,
// paire de photos verticales (10 photos et plus), puis la grille des photos restantes (12 au plus) et la visionneuse.
export default function Universe({ univers, number = 1, priority = false, excludeIds = [] }) {
  const { lang } = useLanguage();
  const titre = localize(univers.titre, lang);
  const images = univers.images.filter((image) => !excludeIds.includes(image.id));
  const { open, viewer } = usePhotoViewer(images);
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);

  if (!images.length) return null;

  const cover = images[0];
  const verticalCover = !isLandscapePhoto(cover);
  const indexed = images.map((photo, index) => ({ photo, index }));

  const pair =
    images.length >= PAIR_MIN_PHOTOS
      ? indexed.slice(1).filter(({ photo }) => !isLandscapePhoto(photo)).slice(0, 2)
      : [];
  const pairComplete = pair.length === 2 ? pair : [];
  const usedIndexes = new Set([0, ...pairComplete.map((item) => item.index)]);
  const remainingSlots = Math.max(0, MAX_PREVIEW_PHOTOS - usedIndexes.size);
  const restItems = indexed.filter((item) => !usedIndexes.has(item.index));
  // Au départ, quelques photos seulement ; « Voir les N photos » déplie le reste, « Réduire » le replie.
  const gridItems = expanded ? restItems : restItems.slice(0, remainingSlots);
  const shownCount = usedIndexes.size + restItems.slice(0, remainingSlots).length;

  function toggleExpanded() {
    // En repliant, on revient en haut de l'univers pour ne pas laisser le visiteur perdu au milieu de la page.
    if (expanded) sectionRef.current?.scrollIntoView({ block: "start" });
    setExpanded((value) => !value);
  }
  const label = lang === "en" ? "With" : "Avec";

  return (
    <section
      ref={sectionRef}
      id={univers.slug}
      aria-labelledby={`${univers.slug}-titre`}
      className="mx-auto max-w-7xl scroll-mt-36 px-4 md:scroll-mt-28 md:px-8"
    >
      <div className={`grid gap-y-6 ${verticalCover ? "md:grid-cols-2 md:gap-x-14 md:gap-y-0" : "md:gap-y-8"}`}>
        <header
          className={`order-1 space-y-3 ${verticalCover ? "md:col-start-1 md:row-start-1 md:self-end md:pb-6" : "md:order-1"}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-ink/45 md:text-[12px]">
            {pad(number)} — {localize(univers.court, lang)}
          </p>
          <h2 id={`${univers.slug}-titre`} className="font-serif text-3xl leading-[1] tracking-[-0.03em] md:text-5xl">
            {titre}
          </h2>
        </header>

        <div
          className={`order-3 space-y-3 ${
            verticalCover ? "md:col-start-1 md:row-start-2 md:self-start" : "md:order-2"
          }`}
        >
          <p className="max-w-[60ch] text-[17px] leading-relaxed text-ink/75 md:text-[21px] md:leading-[1.55]">
            {localize(univers.contexte, lang)}
          </p>
          <p className="line-clamp-2 max-w-[60ch] text-[12px] leading-relaxed text-ink/50">
            {label} {univers.credits}
          </p>
        </div>

        <div className={`order-2 ${verticalCover ? "md:col-start-2 md:row-span-2 md:row-start-1" : "md:order-3"}`}>
          <FeaturedPhoto photo={cover} index={0} onOpen={open} priority={priority} />
        </div>
      </div>

      {pairComplete.length ? (
        <div className="mt-4 md:mt-8">
          <PhotoPair items={pairComplete} onOpen={open} />
        </div>
      ) : null}

      {gridItems.length ? (
        <div className="mt-4 md:mt-8">
          <PhotoTiles items={gridItems} onOpen={open} />
        </div>
      ) : null}

      {images.length > shownCount ? (
        <SeeAllButton count={images.length} expanded={expanded} onClick={toggleExpanded} />
      ) : null}
      {viewer}
    </section>
  );
}
