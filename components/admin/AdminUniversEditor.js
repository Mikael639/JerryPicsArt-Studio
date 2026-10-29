"use client";

import Image from "next/image";
import { useState } from "react";
import { addUniversPhotosAction, removeUniversPhotoAction, updateUniversAction } from "../../app/admin/photos/actions";

const PAGE_LABELS = {
  signature: "Signature",
  evenements: "Événements",
  entreprises: "Entreprises & lieux",
};

function inputClass() {
  return "w-full rounded-xl border border-line/25 bg-paper px-3 py-2 text-sm outline-none focus:border-accent";
}

function UniversCard({ univers, onSaved, onStatus, onError }) {
  const [titre, setTitre] = useState(univers.titre);
  const [credits, setCredits] = useState(univers.credits);
  const [contexte, setContexte] = useState(univers.contexte);
  const [images, setImages] = useState(univers.images);
  const [cover, setCover] = useState(univers.cover);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const visibleCount = images.filter((image) => !image.hidden).length;

  function moveImage(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    setImages((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggleHidden(id) {
    setImages((current) => current.map((image) => (image.id === id ? { ...image, hidden: !image.hidden } : image)));
  }

  function updateAlt(id, value) {
    setImages((current) => current.map((image) => (image.id === id ? { ...image, alt: value } : image)));
  }

  // Envoi direct de nouvelles photos : elles s'ajoutent à la suite, sans toucher aux modifications en cours.
  async function upload(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    setIsUploading(true);
    onError("");
    onStatus("");

    const formData = new FormData();
    formData.append("slug", univers.slug);
    files.forEach((file) => formData.append("files", file));
    const result = await addUniversPhotosAction(formData);
    setIsUploading(false);

    if (!result.ok) {
      onError(result.message || "Impossible d'ajouter les photos.");
      return;
    }

    onStatus(result.message || "Photos ajoutées.");
    const updated = Array.isArray(result.data) ? result.data.find((item) => item.slug === univers.slug) : null;
    if (updated) {
      setImages((current) => [...current, ...updated.images.filter((image) => !current.some((item) => item.id === image.id))]);
      onSaved(updated, { silent: true });
    }
  }

  async function removeAdded(id) {
    if (!window.confirm("Supprimer définitivement cette photo ?")) return;
    onError("");
    const result = await removeUniversPhotoAction(univers.slug, id);
    if (!result.ok) {
      onError(result.message || "Impossible de supprimer la photo.");
      return;
    }
    setImages((current) => current.filter((image) => image.id !== id));
    if (cover === id) setCover(images.find((image) => image.id !== id && !image.hidden)?.id || "");
    onStatus(result.message || "Photo supprimée.");
  }

  async function save() {
    setIsSaving(true);
    onError("");
    onStatus("");

    const result = await updateUniversAction(univers.slug, {
      titre,
      credits,
      contexte,
      order: images.map((image) => image.id),
      hidden: images.filter((image) => image.hidden).map((image) => image.id),
      cover,
      alt: Object.fromEntries(images.map((image) => [image.id, image.alt])),
    });

    setIsSaving(false);

    if (!result.ok) {
      onError(result.message || "Impossible d'enregistrer.");
      return;
    }

    onStatus(result.message || "Enregistré.");
    const updated = Array.isArray(result.data) ? result.data.find((item) => item.slug === univers.slug) : null;
    if (updated) onSaved(updated);
  }

  return (
    <details
      className="group rounded-2xl border border-line/15 bg-paper/50 open:bg-white"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.target.open)}
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 p-4">
        <div className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-ink/10">
          {images.find((image) => image.id === cover) ? (
            <Image
              src={images.find((image) => image.id === cover).src}
              alt=""
              fill
              sizes="52px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg leading-tight">{titre}</p>
          <p className="mt-0.5 text-xs text-ink/50">
            {visibleCount}/{images.length} photo(s) visible(s)
          </p>
        </div>
        <span className="text-xs text-ink/40 transition group-open:rotate-180">▾</span>
      </summary>

      <div className="space-y-5 border-t border-line/10 p-4 pt-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs uppercase tracking-[0.18em] text-ink/50">Titre</span>
            <input value={titre} maxLength={100} onChange={(event) => setTitre(event.target.value)} className={inputClass()} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs uppercase tracking-[0.18em] text-ink/50">Crédits</span>
            <input value={credits} maxLength={160} onChange={(event) => setCredits(event.target.value)} className={inputClass()} />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs uppercase tracking-[0.18em] text-ink/50">Phrase de contexte</span>
            <textarea
              rows={2}
              maxLength={320}
              value={contexte}
              onChange={(event) => setContexte(event.target.value)}
              className={inputClass()}
            />
          </label>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/50">
            Photos, dans l&rsquo;ordre d&rsquo;affichage · une photo masquée reste ici mais n&rsquo;apparaît plus sur le site
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`space-y-2 rounded-xl border p-2.5 ${image.hidden ? "border-line/15 bg-ink/4 opacity-60" : "border-line/20 bg-white"}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink/10">
                  <Image src={image.src} alt="" fill sizes="220px" className="object-cover" />
                  {image.id === cover ? (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
                      Couverture
                    </span>
                  ) : null}
                </div>
                <textarea
                  rows={2}
                  maxLength={160}
                  value={image.alt}
                  onChange={(event) => updateAlt(image.id, event.target.value)}
                  placeholder="Texte alternatif"
                  className="w-full rounded-lg border border-line/20 bg-paper px-2 py-1.5 text-xs outline-none focus:border-accent"
                />
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="rounded-full border border-line/25 px-2.5 py-1 text-[11px] hover:border-ink disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    className="rounded-full border border-line/25 px-2.5 py-1 text-[11px] hover:border-ink disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleHidden(image.id)}
                    className="rounded-full border border-line/25 px-2.5 py-1 text-[11px] hover:border-ink"
                  >
                    {image.hidden ? "Afficher" : "Masquer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCover(image.id)}
                    disabled={image.id === cover || image.hidden}
                    className="rounded-full border border-line/25 px-2.5 py-1 text-[11px] hover:border-ink disabled:opacity-30"
                  >
                    Couverture
                  </button>
                  {image.added ? (
                    <button
                      type="button"
                      onClick={() => removeAdded(image.id)}
                      className="rounded-full border border-red-200 px-2.5 py-1 text-[11px] text-red-700 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/10 pt-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-ink hover:text-paper">
            {isUploading ? "Envoi en cours..." : "Ajouter des photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              onChange={upload}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="rounded-full bg-ink px-7 py-3 text-sm font-bold uppercase tracking-widest text-paper transition hover:bg-accent disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer cet univers"}
          </button>
        </div>
      </div>
    </details>
  );
}

// Univers de Signature, Événements et Entreprises & lieux : textes, ordre des photos, photos
// masquées, couverture et textes alternatifs. Les photos elles-mêmes s'ajoutent via
// scripts/import-univers.mjs (voir data/univers.js) ; cet écran ne fait que les organiser.
export default function AdminUniversEditor({ initialUniversList = [], onStatus, onError }) {
  const [universList, setUniversList] = useState(initialUniversList);

  const grouped = ["signature", "evenements", "entreprises"]
    .map((page) => ({ page, items: universList.filter((item) => item.page === page) }))
    .filter((group) => group.items.length);

  function handleSaved(updated) {
    setUniversList((current) => current.map((item) => (item.slug === updated.slug ? updated : item)));
  }

  if (universList.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-line/20 bg-white/65 p-5 md:p-6">
        <h2 className="font-serif text-3xl">Univers</h2>
        <p className="text-sm text-ink/60">Aucun univers trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line/20 bg-white/65 p-5 md:p-6">
        <h2 className="font-serif text-3xl">Univers</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          Les univers affichés sur Signature, Événements et Entreprises & lieux. Réordonnez les photos, masquez-en
          une sans la supprimer, choisissez la couverture et corrigez un texte alternatif. Pour ajouter de nouvelles
          photos, utilisez « Ajouter des photos » dans l&rsquo;univers voulu (sélection multiple, redimensionnement automatique) :
          pensez ensuite à corriger leur texte alternatif.
        </p>
      </div>

      {grouped.map((group) => (
        <div key={group.page} className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/45">{PAGE_LABELS[group.page]}</p>
          <div className="space-y-3">
            {group.items.map((univers) => (
              <UniversCard key={univers.slug} univers={univers} onSaved={handleSaved} onStatus={onStatus} onError={onError} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
