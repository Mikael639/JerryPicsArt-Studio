"use client";

import { useState } from "react";
import { isBuiltInCategory, slugifyCategory } from "../../lib/categories";

const BUILT_IN_PAGES = {
  "Fashion Week & Celebrities": "Page Signature",
  Events: "Page Événements",
  "Fashion Wedding": "Page Mariage",
  Studio: "Page Entreprises & lieux",
};

export default function AdminCategoryManager({ categories, onSave, isSaving }) {
  const [localCategories, setLocalCategories] = useState(categories);
  const [newCategory, setNewCategory] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const handleAdd = (event) => {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return;

    if (localCategories.some((category) => category.toLowerCase() === name.toLowerCase())) {
      alert("Cette catégorie existe déjà.");
      return;
    }
    if (!slugifyCategory(name)) {
      alert("Le nom doit contenir au moins une lettre ou un chiffre.");
      return;
    }

    setLocalCategories([...localCategories, name]);
    setNewCategory("");
    setIsDirty(true);
  };

  const handleRemove = (category) => {
    if (
      window.confirm(
        `Supprimer la catégorie « ${category} » ? Sa page disparaît du site. Les photos ne sont pas supprimées : elles gardent cette étiquette et réapparaissent si vous recréez la catégorie.`
      )
    ) {
      setLocalCategories(localCategories.filter((item) => item !== category));
      setIsDirty(true);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-line/20 bg-white/65 p-6">
      <div className="border-b border-line/10 pb-4">
        <h2 className="font-serif text-3xl">Catégories du portfolio</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          Les quatre catégories d&apos;origine alimentent les pages Signature, Événements, Mariage et Entreprises. Une
          catégorie ajoutée ici obtient sa propre page, accessible depuis le pied de page du site. Ensuite, choisissez-la
          en ajoutant ou en modifiant des photos.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Nouvelle catégorie (ex. Portraits, Backstage…)"
          value={newCategory}
          maxLength={60}
          onChange={(event) => setNewCategory(event.target.value)}
          className="flex-1 rounded-xl border border-line/25 bg-paper px-4 py-2 outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="rounded-xl bg-ink px-6 py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-accent"
        >
          Ajouter
        </button>
      </form>

      <div className="grid gap-3">
        {localCategories.map((category) => {
          const builtIn = isBuiltInCategory(category);
          return (
            <div
              key={category}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line/15 bg-paper/50 p-4"
            >
              <div>
                <p className="font-serif text-xl">{category}</p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {builtIn ? BUILT_IN_PAGES[category] : `Page /collections/${slugifyCategory(category)}`}
                </p>
              </div>
              {builtIn ? (
                <span className="rounded-full border border-line/20 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-ink/50">
                  Catégorie d&apos;origine
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRemove(category)}
                  className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        {isDirty ? <span className="text-xs text-ink/55">Modifications non enregistrées</span> : null}
        <button
          type="button"
          onClick={() => {
            onSave(localCategories);
            setIsDirty(false);
          }}
          disabled={isSaving}
          className="rounded-full bg-ink px-8 py-3 text-sm font-bold uppercase tracking-widest text-paper transition-all hover:bg-accent disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer les catégories"}
        </button>
      </div>
    </div>
  );
}
