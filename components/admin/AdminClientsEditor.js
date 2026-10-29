"use client";

import Image from "next/image";
import { useState } from "react";
import { updateSiteContentAction, uploadClientLogoAction } from "../../app/admin/photos/actions";

function inputClass() {
  return "w-full rounded-xl border border-line/25 bg-paper px-3 py-2 text-sm outline-none focus:border-accent";
}

// Bande « Ils nous ont fait confiance » : nom, logo (facultatif), ordre. Sans logo, le nom s'affiche en texte.
export default function AdminClientsEditor({ initialItems = [], onStatus, onError }) {
  const [items, setItems] = useState(initialItems);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(-1);

  function update(index, patch) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    setIsDirty(true);
  }

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    setItems((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setIsDirty(true);
  }

  function remove(index) {
    if (!window.confirm("Retirer ce client de la bande ?")) return;
    setItems((current) => current.filter((_, i) => i !== index));
    setIsDirty(true);
  }

  function add() {
    setItems((current) => [...current, { name: "", logo: "", width: 0, height: 0 }]);
    setIsDirty(true);
  }

  async function uploadLogo(index, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadingIndex(index);
    onError("");
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadClientLogoAction(formData);
    setUploadingIndex(-1);

    if (!result.ok) {
      onError(result.message || "Impossible d'envoyer ce logo.");
      return;
    }
    update(index, result.data);
    onStatus("Logo envoyé : pensez à enregistrer.");
  }

  async function save() {
    setIsSaving(true);
    onError("");
    onStatus("");
    const result = await updateSiteContentAction("clients", items);
    setIsSaving(false);

    if (!result.ok) {
      onError(result.message || "Impossible d'enregistrer.");
      return;
    }
    if (Array.isArray(result.data)) setItems(result.data);
    setIsDirty(false);
    onStatus(result.message || "Enregistré.");
  }

  return (
    <div className="space-y-6 rounded-2xl border border-line/20 bg-white/65 p-5 md:p-6">
      <div className="border-b border-line/10 pb-4">
        <h2 className="font-serif text-3xl">Logos clients</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          La bande « Ils nous ont fait confiance » de la page Entreprises &amp; lieux. Utilisez uniquement des logos
          officiels (PNG, WebP ou JPEG), de préférence sombres ou en couleur sur fond blanc ou transparent : ils
          s&rsquo;affichent en gris, le fond blanc disparaît. Sans logo, le nom s&rsquo;affiche en texte.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex flex-wrap items-center gap-3 rounded-xl border border-line/15 bg-paper/50 p-3">
            <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-ink/5 p-2">
              {item.logo && item.width && item.height ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={item.width}
                  height={item.height}
                  className="max-h-full w-auto object-contain"
                />
              ) : (
                <span className="text-center text-[10px] uppercase tracking-wide text-ink/40">Texte</span>
              )}
            </div>
            <input
              value={item.name}
              maxLength={80}
              onChange={(event) => update(index, { name: event.target.value })}
              placeholder="Nom du client"
              className={`${inputClass()} min-w-[12rem] flex-1`}
            />
            <label className="cursor-pointer rounded-full border border-line/25 px-3 py-1.5 text-xs hover:border-ink">
              {uploadingIndex === index ? "Envoi..." : item.logo ? "Changer le logo" : "Ajouter un logo"}
              <input
                type="file"
                accept="image/png,image/webp,image/jpeg"
                disabled={uploadingIndex === index}
                onChange={(event) => uploadLogo(index, event)}
                className="sr-only"
              />
            </label>
            {item.logo ? (
              <button
                type="button"
                onClick={() => update(index, { logo: "", width: 0, height: 0 })}
                className="rounded-full border border-line/25 px-3 py-1.5 text-xs hover:border-ink"
              >
                Retirer le logo
              </button>
            ) : null}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded-full border border-line/25 px-2.5 py-1.5 text-xs hover:border-ink disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="rounded-full border border-line/25 px-2.5 py-1.5 text-xs hover:border-ink disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-ink px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-paper"
        >
          Ajouter un client
        </button>
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
