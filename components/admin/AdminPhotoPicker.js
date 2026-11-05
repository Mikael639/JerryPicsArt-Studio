"use client";

import { useMemo, useState } from "react";
import imageLoader from "../../lib/imageLoader";
import AdminSelect from "./AdminSelect";

// Sélecteur de photo plein écran : toutes les photos du site (photothèque et univers), filtre par provenance et
// recherche. Utilisé par la Vitrine du site et par la journée de mariage.
const PAGE_SIZE = 48;

export const buttonClass = "rounded-full border border-line/25 px-4 py-2 text-sm hover:border-ink disabled:opacity-50";

// Vignette : la petite taille (480 px) de la photo plutôt que l'original (voir lib/imageLoader.js).
export function Thumb({ src, label }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageLoader({ src, width: 480 })} alt="" loading="lazy" className="h-full w-full object-cover" />
  ) : (
    <span className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] leading-tight text-ink/45">
      {label}
    </span>
  );
}

export default function Picker({ target, photos, universList, onPick, onClose, closeLabel = "Fermer" }) {
  const [source, setSource] = useState("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const candidates = useMemo(() => {
    const fromLibrary = photos
      .filter((photo) => photo.isPublished && photo.src)
      .map((photo) => ({
        key: `p-${photo.id}`,
        src: photo.src,
        alt: photo.alt || photo.title || "",
        group: photo.category,
        text: `${photo.title || ""} ${photo.alt || ""} ${photo.category}`,
      }));
    const fromUnivers = universList.flatMap((univers) =>
      univers.images
        .filter((image) => !image.hidden && image.src)
        .map((image) => ({
          key: `u-${univers.slug}-${image.id}`,
          src: image.src,
          alt: image.alt || univers.titre,
          group: `Univers · ${univers.titre}`,
          text: `${image.alt || ""} ${univers.titre}`,
        }))
    );
    return [...fromLibrary, ...fromUnivers];
  }, [photos, universList]);

  const groups = useMemo(() => [...new Set(candidates.map((item) => item.group))], [candidates]);
  const needle = query.trim().toLowerCase();
  const visible = candidates.filter(
    (item) => (source === "all" || item.group === source) && (!needle || item.text.toLowerCase().includes(needle))
  );

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-paper" role="dialog" aria-modal="true" aria-label="Choisir une photo">
      <div className="space-y-3 border-b border-line/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-serif text-xl">Photo pour « {target.label} »</p>
          <button type="button" className={buttonClass} onClick={onClose}>
            {closeLabel}
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <AdminSelect
            value={source}
            onChange={(next) => {
              setSource(next);
              setLimit(PAGE_SIZE);
            }}
            options={[
              { value: "all", label: "Toutes les photos", count: candidates.length },
              ...groups.map((group) => ({
                value: group,
                label: group,
                count: candidates.filter((item) => item.group === group).length,
              })),
            ]}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder="Rechercher"
            className="rounded-2xl border border-line/20 bg-white/80 px-4 py-3.5 text-sm"
          />
        </div>
      </div>

      <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {visible.length ? (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {visible.slice(0, limit).map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onPick({ src: item.src, alt: item.alt })}
                  className="block aspect-[4/5] w-full overflow-hidden rounded-lg bg-ink/5 ring-ink focus:outline-none focus-visible:ring-2"
                  aria-label={item.alt || "Choisir cette photo"}
                >
                  <Thumb src={item.src} label="" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-ink/55">Aucune photo ne correspond.</p>
        )}
        {visible.length > limit ? (
          <div className="pt-4 text-center">
            <button type="button" className={buttonClass} onClick={() => setLimit((current) => current + PAGE_SIZE)}>
              Voir plus ({visible.length - limit} restantes)
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

