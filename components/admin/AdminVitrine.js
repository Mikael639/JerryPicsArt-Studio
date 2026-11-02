"use client";

import { useMemo, useState } from "react";
import { setVitrinePhotoAction } from "../../app/admin/photos/actions";
import AdminLayoutEditor from "./AdminLayoutEditor";
import AdminSelect from "./AdminSelect";

// Vitrine du site : la photo de chaque carte « Ce que je photographie » et la couverture de chaque univers sur
// l'accueil. Jerry choisit n'importe quelle photo du site (photothèque ou univers) ; sans choix, le site
// garde sa sélection automatique. Pensé pour le téléphone d'abord : cartes empilées, sélecteur plein écran.

const DOORS = [
  { id: "evenements", label: "Événements", hint: "Carte « Événements » de l'accueil" },
  { id: "signature", label: "Mode et Fashion Week", hint: "Carte qui mène à Signature" },
  { id: "mariage", label: "Mariage", hint: "Carte « Mariage » de l'accueil" },
  { id: "entreprises", label: "Entreprises & lieux", hint: "Carte masquée par défaut (réglable dans Mise en page)" },
];

const PAGE_LABELS = { signature: "Signature", evenements: "Événements", entreprises: "Entreprises & lieux" };
const PAGE_SIZE = 48;

const buttonClass = "rounded-full border border-line/25 px-4 py-2 text-sm hover:border-ink disabled:opacity-50";

function Thumb({ src, label }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
  ) : (
    <span className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] leading-tight text-ink/45">
      {label}
    </span>
  );
}

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

function Picker({ target, photos, universList, onPick, onClose }) {
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
            Fermer
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

export default function AdminVitrine({
  photos,
  universList,
  vitrine,
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
