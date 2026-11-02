"use client";

import { useMemo, useState } from "react";
import { setWeddingChapterAction } from "../../app/admin/photos/actions";
import { MARIAGE_CHAPITRES } from "../../data/mariageJournee";
import Picker, { buttonClass, Thumb } from "./AdminPhotoPicker";

// Journée de mariage (page Mariage) : les photos de chaque moment, de 9 h à 22 h. Sans modification, le site garde
// les photos d'origine (data/mariageJournee.js) ; une étape enregistrée ici les remplace.

const CHAPTERS = [
  { key: "preparatifs", heure: "9 h", titre: "Les préparatifs" },
  { key: "ceremonie", heure: "14 h", titre: "La cérémonie" },
  { key: "portrait", heure: "16 h", titre: "Le portrait" },
  { key: "cocktail", heure: "18 h", titre: "Le cocktail" },
  { key: "soiree", heure: "22 h", titre: "La soirée" },
];

// Taille réelle de l'image (pour bien disposer les photos sur la page) ; sans réponse, le site utilise une taille par défaut.
function measure(src) {
  return new Promise((resolve) => {
    const image = new window.Image();
    const timer = window.setTimeout(() => resolve({}), 5000);
    image.onload = () => {
      window.clearTimeout(timer);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      resolve({});
    };
    image.src = src;
  });
}

function Chapter({ chapter, defaults, saved, photos, universList, onSaved, onStatus, onError }) {
  const initial = saved?.length ? saved : defaults;
  const [draft, setDraft] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState(false);

  function change(next) {
    setDraft(next);
    setDirty(true);
  }

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    const next = [...draft];
    [next[index], next[target]] = [next[target], next[index]];
    change(next);
  }

  async function add(photo) {
    const size = await measure(photo.src);
    change([...draft, { ...photo, ...size }]);
  }

  async function persist(list) {
    setBusy(true);
    onError?.("");
    const result = await setWeddingChapterAction(chapter.key, list);
    setBusy(false);

    if (!result.ok) {
      onError?.(result.message || "Impossible d'enregistrer ces photos.");
      return false;
    }
    onSaved(result.data);
    onStatus?.(result.message);
    return true;
  }

  async function save() {
    if (!draft.length) {
      onError?.("Gardez au moins une photo, ou revenez aux photos d'origine.");
      return;
    }
    if (await persist(draft)) setDirty(false);
  }

  async function reset() {
    if (await persist([])) {
      setDraft(defaults);
      setDirty(false);
    }
  }

  return (
    <li className="space-y-3 rounded-2xl border border-line/20 bg-white/65 p-3 sm:p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-serif text-lg leading-tight">
          <span className="italic text-accent">{chapter.heure}</span> · {chapter.titre}
        </p>
        <p className="text-xs text-ink/55">
          {draft.length} photo{draft.length > 1 ? "s" : ""} · {saved?.length ? "choisies par vous" : "photos d'origine"}
        </p>
      </div>

      {draft.length ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {draft.map((photo, index) => (
            <li key={`${photo.src}-${index}`} className="space-y-1.5">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-ink/5">
                <Thumb src={photo.src} label="" />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Avancer cette photo"
                  className="flex-1 rounded-full border border-line/25 py-1 text-xs hover:border-ink disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === draft.length - 1}
                  aria-label="Reculer cette photo"
                  className="flex-1 rounded-full border border-line/25 py-1 text-xs hover:border-ink disabled:opacity-30"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => change(draft.filter((_, position) => position !== index))}
                  aria-label="Retirer cette photo"
                  className="flex-1 rounded-full border border-red-200 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink/55">Aucune photo pour cette étape.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} disabled={busy} onClick={() => setPicking(true)}>
          Ajouter des photos
        </button>
        <button
          type="button"
          disabled={busy || !dirty}
          onClick={save}
          className="rounded-full bg-ink px-5 py-2 text-sm text-paper transition hover:bg-accent disabled:opacity-40"
        >
          {busy ? "Enregistrement..." : "Enregistrer l'étape"}
        </button>
        {saved?.length || dirty ? (
          <button type="button" className={buttonClass} disabled={busy} onClick={reset}>
            Photos d&apos;origine
          </button>
        ) : null}
      </div>

      {picking ? (
        <Picker
          target={{ label: `${chapter.heure} · ${chapter.titre}` }}
          photos={photos}
          universList={universList}
          onPick={add}
          onClose={() => setPicking(false)}
          closeLabel="Terminé"
        />
      ) : null}
    </li>
  );
}

export default function AdminWeddingDay({ photos, universList, vitrine, onVitrineChange, onStatus, onError }) {
  // Photos d'origine de chaque étape : celles de data/mariageJournee.js encore présentes dans la photothèque.
  const defaults = useMemo(() => {
    const byId = new Map(photos.map((photo) => [photo.id, photo]));
    return Object.fromEntries(
      CHAPTERS.map(({ key }) => [
        key,
        (MARIAGE_CHAPITRES[key] || [])
          .filter((item) => byId.has(item.id))
          .map((item) => ({ src: byId.get(item.id).src, alt: item.alt, width: item.width, height: item.height })),
      ])
    );
  }, [photos]);

  return (
    <ul className="space-y-3">
      {CHAPTERS.map((chapter) => (
        <Chapter
          // La clé change quand l'enregistrement change (retour aux photos d'origine, autre appareil) : brouillon remis à jour.
          key={`${chapter.key}-${JSON.stringify(vitrine.wedding?.[chapter.key] || null)}`}
          chapter={chapter}
          defaults={defaults[chapter.key]}
          saved={vitrine.wedding?.[chapter.key]}
          photos={photos}
          universList={universList}
          onSaved={onVitrineChange}
          onStatus={onStatus}
          onError={onError}
        />
      ))}
    </ul>
  );
}
