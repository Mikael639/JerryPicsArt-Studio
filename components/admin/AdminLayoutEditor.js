"use client";

import { useState } from "react";
import { updateLayoutAction } from "../../app/admin/photos/actions";

const DOOR_LABELS = {
  evenements: "Événements",
  signature: "Mode et Fashion Week (mène à Signature)",
  mariage: "Mariage",
  entreprises: "Entreprises & lieux",
};

const PAGE_LABELS = {
  signature: "Signature",
  evenements: "Événements",
  entreprises: "Entreprises & lieux",
};

const arrowClass =
  "rounded-full border border-line/25 px-3 py-1 text-xs hover:border-ink disabled:cursor-not-allowed disabled:opacity-30";

function move(list, index, direction) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function ArrowButtons({ index, length, onMove, label }) {
  return (
    <div className="flex gap-2">
      <button type="button" className={arrowClass} disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Monter ${label}`}>
        ↑
      </button>
      <button
        type="button"
        className={arrowClass}
        disabled={index === length - 1}
        onClick={() => onMove(1)}
        aria-label={`Descendre ${label}`}
      >
        ↓
      </button>
    </div>
  );
}

// Disposition du site : cartes de l'accueil (ordre et affichage) et ordre des univers de chaque page.
export default function AdminLayoutEditor({ initialLayout, initialUniversList = [], onStatus, onError, onSaved }) {
  const [doors, setDoors] = useState(initialLayout?.doors || []);
  const [universList, setUniversList] = useState(initialUniversList);
  const [isSaving, setIsSaving] = useState(false);

  const pages = Object.keys(PAGE_LABELS)
    .map((page) => ({ page, items: universList.filter((univers) => univers.page === page) }))
    .filter((group) => group.items.length);

  function moveUnivers(page, index, direction) {
    setUniversList((current) => {
      const group = current.filter((univers) => univers.page === page);
      const reordered = move(group, index, direction);
      let cursor = 0;
      return current.map((univers) => (univers.page === page ? reordered[cursor++] : univers));
    });
  }

  async function save() {
    setIsSaving(true);
    onError("");
    onStatus("");

    const result = await updateLayoutAction({
      doors,
      univers: Object.fromEntries(pages.map((group) => [group.page, group.items.map((univers) => univers.slug)])),
    });

    setIsSaving(false);

    if (!result.ok) {
      onError(result.message || "Impossible d'enregistrer la mise en page.");
      return;
    }

    onStatus(result.message || "Mise en page enregistrée.");
    onSaved?.(result.data);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line/20 bg-white/65 p-5 md:p-6">
        <h2 className="font-serif text-3xl">Mise en page</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          Choisissez ce qui passe en premier. Les flèches changent l&rsquo;ordre ; rien n&rsquo;est supprimé, et les
          photos et les textes ne bougent pas. Les modifications apparaissent sur le site après l&rsquo;enregistrement.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-line/20 bg-white/65 p-5 md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/45">Accueil : « Ce que je photographie »</p>
        <ul className="space-y-2">
          {doors.map((door, index) => (
            <li
              key={door.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                door.visible ? "border-line/20 bg-white" : "border-line/15 bg-ink/4 opacity-70"
              }`}
            >
              <span className="font-serif text-lg">
                {index + 1}. {DOOR_LABELS[door.id]}
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={door.visible}
                    onChange={() =>
                      setDoors((current) => current.map((item) => (item.id === door.id ? { ...item, visible: !item.visible } : item)))
                    }
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  Affichée
                </label>
                <ArrowButtons
                  index={index}
                  length={doors.length}
                  label={DOOR_LABELS[door.id]}
                  onMove={(direction) => setDoors((current) => move(current, index, direction))}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {pages.map((group) => (
        <div key={group.page} className="space-y-3 rounded-2xl border border-line/20 bg-white/65 p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/45">
            Page {PAGE_LABELS[group.page]} : ordre des univers
          </p>
          <ul className="space-y-2">
            {group.items.map((univers, index) => (
              <li key={univers.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line/20 bg-white px-4 py-3">
                <span className="font-serif text-lg">
                  {index + 1}. {univers.titre}
                </span>
                <ArrowButtons
                  index={index}
                  length={group.items.length}
                  label={univers.titre}
                  onMove={(direction) => moveUnivers(group.page, index, direction)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-paper transition hover:bg-accent disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer la mise en page"}
        </button>
      </div>
    </div>
  );
}
