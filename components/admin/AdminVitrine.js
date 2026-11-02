"use client";

import { useState } from "react";
import { setVitrinePhotoAction } from "../../app/admin/photos/actions";
import AdminLayoutEditor from "./AdminLayoutEditor";
import AdminWeddingDay from "./AdminWeddingDay";
import Picker, { buttonClass, Thumb } from "./AdminPhotoPicker";

// Vitrine du site : la photo de chaque carte « Ce que je photographie » et la couverture de chaque univers sur
// l'accueil. Jerry choisit n'importe quelle photo du site (photothèque ou univers) ; sans choix, le site
// garde sa sélection automatique. Pensé pour le téléphone d'abord : cartes empilées, sélecteur plein écran.

const DOORS = [
  { id: "evenements", label: "Événements", hint: "Carte « Événements » de l'accueil" },
  { id: "signature", label: "Mode et Fashion Week", hint: "Carte qui mène à Signature" },
  { id: "mariage", label: "Mariage", hint: "Carte « Mariage » de l'accueil" },
  { id: "entreprises", label: "Entreprises & lieux", hint: "Carte masquée par défaut (réglable dans Mise en page)" },
];

// Pages à photo d'en-tête : « intro » = grande photo à droite du titre, « menu » = aperçu au survol du menu.
const PAGES = [
  { id: "signature", label: "Signature", href: "/signature" },
  { id: "evenements", label: "Événements", href: "/evenements" },
  { id: "mariage", label: "Mariage", href: "/mariage" },
  { id: "entreprises", label: "Entreprises & lieux", href: "/entreprises" },
];
const PAGE_SLOTS = [
  { id: "intro", label: "Photo d'en-tête", hint: "À droite du titre, en haut de la page" },
  { id: "menu", label: "Photo du menu", hint: "Aperçu quand on survole le menu" },
];

const PAGE_LABELS = { signature: "Signature", evenements: "Événements", entreprises: "Entreprises & lieux" };
function Slot({ title, hint, currentSrc, isChosen, autoLabel, busy, onChange, onReset }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-line/20 bg-white/65 p-3 sm:p-4">
      <div className="aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl bg-ink/5 sm:w-24">
        <Thumb src={currentSrc} label={autoLabel} />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <p className="font-serif text-lg leading-tight">{title}</p>
          <p className="text-xs leading-snug text-ink/55">
            {isChosen ? "Photo choisie par vous" : hint || "Sélection automatique"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={buttonClass} disabled={busy} onClick={onChange}>
            Changer la photo
          </button>
          {isChosen ? (
            <button type="button" className={buttonClass} disabled={busy} onClick={onReset}>
              Automatique
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default function AdminVitrine({
  photos,
  universList,
  vitrine,
  pageDefaults,
  layout,
  onLayoutSaved,
  onVitrineChange,
  onOpenHero,
  onStatus,
  onError,
}) {
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  async function save(kind, key, photo) {
    setBusy(true);
    onError?.("");
    const result = await setVitrinePhotoAction(kind, key, photo);
    setBusy(false);

    if (!result.ok) {
      onError?.(result.message || "Impossible d'enregistrer cette photo.");
      return;
    }
    onVitrineChange?.(result.data);
    onStatus?.(result.message);
  }

  function pick(photo) {
    const { kind, key } = target;
    setTarget(null);
    save(kind, key, photo);
  }

  const groups = Object.entries(PAGE_LABELS)
    .map(([page, label]) => ({ page, label, items: universList.filter((univers) => univers.page === page) }))
    .filter((group) => group.items.length);

  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed text-ink/65">
        Choisissez ici les photos mises en avant sur l&apos;accueil. Toutes les photos du site sont proposées. Sans choix,
        le site garde sa sélection automatique.
      </p>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Cartes « Ce que je photographie »</h2>
        <ul className="grid gap-3 lg:grid-cols-2">
          {DOORS.map((door) => (
            <Slot
              key={door.id}
              title={door.label}
              hint={door.hint}
              currentSrc={vitrine.doors[door.id]?.src}
              isChosen={Boolean(vitrine.doors[door.id])}
              autoLabel="Automatique"
              busy={busy}
              onChange={() => setTarget({ kind: "doors", key: door.id, label: door.label })}
              onReset={() => save("doors", door.id, null)}
            />
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Pages du site</h2>
        <p className="text-sm leading-relaxed text-ink/65">
          La grande photo en haut de chaque page et celle qui s&apos;affiche dans le menu.
        </p>
        <ul className="grid gap-3 lg:grid-cols-2">
          {PAGES.flatMap((page) =>
            PAGE_SLOTS.map((slot) => {
              const key = `${page.id}:${slot.id}`;
              const chosen = vitrine.pages?.[key];
              return (
                <Slot
                  key={key}
                  title={`${page.label} · ${slot.label}`}
                  hint={slot.hint}
                  currentSrc={chosen?.src || pageDefaults?.[slot.id]?.[page.href]?.src}
                  isChosen={Boolean(chosen)}
                  autoLabel="Automatique"
                  busy={busy}
                  onChange={() => setTarget({ kind: "pages", key, label: `${page.label} · ${slot.label}` })}
                  onReset={() => save("pages", key, null)}
                />
              );
            })
          )}
        </ul>
      </section>

      {groups.map((group) => (
        <section key={group.page} className="space-y-3">
          <h2 className="font-serif text-2xl">Couvertures · {group.label}</h2>
          <ul className="grid gap-3 lg:grid-cols-2">
            {group.items.map((univers) => {
              const chosen = vitrine.covers[univers.slug];
              const cover = univers.images.find((image) => image.id === univers.cover) || univers.images[0];
              return (
                <Slot
                  key={univers.slug}
                  title={univers.titre}
                  hint="Couverture actuelle de l'univers"
                  currentSrc={chosen?.src || cover?.src}
                  isChosen={Boolean(chosen)}
                  autoLabel="Aucune photo"
                  busy={busy}
                  onChange={() => setTarget({ kind: "covers", key: univers.slug, label: univers.titre })}
                  onReset={() => save("covers", univers.slug, null)}
                />
              );
            })}
          </ul>
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Diaporama de l&apos;accueil</h2>
        <p className="text-sm leading-relaxed text-ink/65">
          Les 10 photos du diaporama se choisissent avec la case « Diaporama accueil » de chaque photo.
        </p>
        <button type="button" className={buttonClass} onClick={onOpenHero}>
          Gérer le diaporama
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Journée de mariage</h2>
        <p className="text-sm leading-relaxed text-ink/65">
          Les photos de chaque moment de la page Mariage, de 9 h à 22 h. Ajoutez, retirez et réordonnez, puis enregistrez
          l&apos;étape. « Photos d&apos;origine » revient à la sélection actuelle du site.
        </p>
        <AdminWeddingDay
          photos={photos}
          universList={universList}
          vitrine={vitrine}
          onVitrineChange={onVitrineChange}
          onStatus={onStatus}
          onError={onError}
        />
      </section>

      {layout ? (
        <section className="space-y-3">
          <h2 className="font-serif text-2xl">Ordre et affichage</h2>
          <p className="text-sm leading-relaxed text-ink/65">
            L&apos;ordre des cartes de l&apos;accueil, celles qui s&apos;affichent, et l&apos;ordre des univers de chaque page.
          </p>
          <AdminLayoutEditor
            key={JSON.stringify(layout)}
            initialLayout={layout}
            initialUniversList={universList}
            onStatus={onStatus}
            onError={onError}
            onSaved={onLayoutSaved}
          />
        </section>
      ) : null}

      {target ? (
        <Picker target={target} photos={photos} universList={universList} onPick={pick} onClose={() => setTarget(null)} />
      ) : null}
    </div>
  );
}
