"use client";

import { useState } from "react";
import { updateSiteContentAction } from "../../app/admin/photos/actions";
import { PRESTATION_OPTIONS, REFERENCE_GROUPS } from "../../lib/contentOptions";

// Éditeur générique des contenus du site : avis, chiffres, références, textes des séries.
const CONFIGS = {
  testimonials: {
    title: "Avis clients",
    help: "Publiez uniquement de vrais avis, avec l'accord de la personne. Tant qu'il n'y en a aucun, la section reste masquée sur le site.",
    itemLabel: "Avis",
    addLabel: "Ajouter un avis",
    empty: { texte: "", auteur: "", prestation: "mariage" },
    fields: [
      { key: "texte", label: "Avis", kind: "textarea", max: 600 },
      { key: "auteur", label: "Nom ou prénom et fonction", kind: "text", max: 120 },
      { key: "prestation", label: "Type de prestation", kind: "select", options: PRESTATION_OPTIONS },
    ],
  },
  stats: {
    title: "Chiffres",
    help: "Affichés sur l'accueil et la page À propos. Un chiffre à 0 n'est pas affiché.",
    itemLabel: "Chiffre",
    addLabel: "Ajouter un chiffre",
    empty: { valeur: 0, suffixe: "+", libelle: "", precision: "" },
    fields: [
      { key: "valeur", label: "Valeur", kind: "number" },
      { key: "suffixe", label: "Suffixe (ex. +)", kind: "text", max: 4 },
      { key: "libelle", label: "Libellé", kind: "text", max: 60 },
      { key: "precision", label: "Précision (facultatif)", kind: "text", max: 80 },
    ],
  },
  references: {
    title: "Références",
    help: "Personnalités, maisons, médias et lieux affichés dans « Ils sont passés devant mon objectif ».",
    itemLabel: "Référence",
    addLabel: "Ajouter une référence",
    empty: { nom: "", groupe: "personnalites" },
    fields: [
      { key: "nom", label: "Nom", kind: "text", max: 80 },
      { key: "groupe", label: "Colonne", kind: "select", options: REFERENCE_GROUPS },
    ],
  },
  seriesNotes: {
    title: "Textes des séries",
    help: "Une phrase de contexte sous le titre de chaque série (lieu, ambiance, maison). Laissez vide pour ne rien afficher.",
    fixed: true,
    fields: [{ key: "contexte", label: "Phrase de contexte", kind: "textarea", max: 240 }],
  },
};

function inputClass() {
  return "w-full rounded-xl border border-line/25 bg-paper px-3 py-2 outline-none focus:border-accent";
}

export default function AdminContentEditor({ kind, initialItems, onStatus, onError }) {
  const config = CONFIGS[kind];
  const [items, setItems] = useState(initialItems || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  function updateItem(index, key, value) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
    setIsDirty(true);
  }

  function moveItem(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    setItems((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setIsDirty(true);
  }

  function removeItem(index) {
    if (!window.confirm("Supprimer cet élément ?")) return;
    setItems((current) => current.filter((_, i) => i !== index));
    setIsDirty(true);
  }

  function addItem() {
    setItems((current) => [...current, { ...config.empty }]);
    setIsDirty(true);
  }

  async function save() {
    setIsSaving(true);
    onError("");
    onStatus("");

    const payload = config.fixed
      ? Object.fromEntries(items.filter((item) => item.contexte?.trim()).map((item) => [item.slug, { contexte: item.contexte }]))
      : items;

    const result = await updateSiteContentAction(kind, payload);
    setIsSaving(false);

    if (!result.ok) {
      onError(result.message || "Impossible d'enregistrer.");
      return;
    }

    if (!config.fixed && Array.isArray(result.data)) setItems(result.data);
    setIsDirty(false);
    onStatus(result.message || "Enregistré.");
  }

  return (
    <div className="space-y-6 rounded-2xl border border-line/20 bg-white/65 p-5 md:p-6">
      <div className="border-b border-line/10 pb-4">
        <h2 className="font-serif text-3xl">{config.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">{config.help}</p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line/25 p-6 text-center text-sm text-ink/55">
          Aucun élément pour le moment.
        </p>
      ) : null}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.slug || index} className="space-y-3 rounded-xl border border-line/15 bg-paper/50 p-4">
            {config.fixed ? (
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-serif text-xl">{item.titre}</p>
                <p className="text-xs text-ink/50">
                  {[item.meta, `${item.count} photos`].filter(Boolean).join(" · ")}
                </p>
              </div>
            ) : (
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">
                {config.itemLabel} {index + 1}
              </p>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              {config.fields.map((field) => (
                <label key={field.key} className={`space-y-1.5 ${field.kind === "textarea" ? "md:col-span-2" : ""}`}>
                  <span className="text-xs uppercase tracking-[0.18em] text-ink/50">{field.label}</span>
                  {field.kind === "textarea" ? (
                    <textarea
                      rows={3}
                      maxLength={field.max}
                      value={item[field.key] ?? ""}
                      onChange={(event) => updateItem(index, field.key, event.target.value)}
                      className={inputClass()}
                    />
                  ) : field.kind === "select" ? (
                    <select
                      value={item[field.key] ?? ""}
                      onChange={(event) => updateItem(index, field.key, event.target.value)}
                      className={inputClass()}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.kind === "number" ? "number" : "text"}
                      min={field.kind === "number" ? 0 : undefined}
                      maxLength={field.max}
                      value={item[field.key] ?? ""}
                      onChange={(event) => updateItem(index, field.key, event.target.value)}
                      className={inputClass()}
                    />
                  )}
                </label>
              ))}
            </div>

            {!config.fixed ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="rounded-full border border-line/25 px-3 py-1.5 text-xs hover:border-ink disabled:opacity-40"
                >
                  Monter
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="rounded-full border border-line/25 px-3 py-1.5 text-xs hover:border-ink disabled:opacity-40"
                >
                  Descendre
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {!config.fixed ? (
          <button
            type="button"
            onClick={addItem}
            className="rounded-full border border-ink px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-paper"
          >
            {config.addLabel}
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          {isDirty ? <span className="text-xs text-ink/55">Modifications non enregistrées</span> : null}
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="rounded-full bg-ink px-7 py-3 text-sm font-bold uppercase tracking-widest text-paper transition hover:bg-accent disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
