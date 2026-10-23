"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildSeries, sortSeries } from "../../data/series";

function roleLabel(role) {
  if (role === "hero") return "Diaporama accueil";
  if (role === "featured") return "Mise en avant";
  if (role === "servicesBackground") return "Fond";
  if (role === "approachImage") return "Image approche";
  return role;
}

const mobilePositionOptions = [
  { label: "Auto / centre", value: "" },
  { label: "Visage plus haut", value: "center 28%" },
  { label: "Sujet au centre", value: "center center" },
  { label: "Sujet plus bas", value: "center 72%" },
  { label: "Sujet à gauche", value: "35% center" },
  { label: "Sujet à droite", value: "65% center" },
];

const universeTabs = [
  { id: "all", label: "Toutes" },
  { id: "hero", label: "Diaporama accueil" },
  { id: "Fashion Week & Celebrities", label: "Signature · Fashion Week" },
  { id: "Events", label: "Événements" },
  { id: "Fashion Wedding", label: "Mariage" },
  { id: "Studio", label: "Studio & Entreprises" },
  { id: "drafts", label: "Brouillons" },
];

export default function AdminPhotosTable({
  busyId,
  categories,
  deletePhoto,
  photos,
  heroPhotoCount,
  maxHeroPhotoCount,
  onHeroLimit,
  roleOptions,
  updatePhoto,
  onReorder,
  selectedUniverse = "all",
  setSelectedUniverse,
}) {
  const [editingId, setEditingId] = useState("");
  const [draggedId, setDraggedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [publishFilter, setPublishFilter] = useState("all");
  const [selectedSerie, setSelectedSerie] = useState("all");
  const [gridDensity, setGridDensity] = useState("comfortable"); // "comfortable" | "compact"
  const [currentPage, setCurrentPage] = useState(1);

  // Associe chaque photo à sa série officielle (calculée via buildSeries du site)
  const { serieByPhotoId, officialSeries } = useMemo(() => {
    const built = sortSeries(buildSeries(photos, { minImages: 3 }));
    const byPhotoId = new Map();

    for (const serie of built) {
      for (const img of serie.images) {
        byPhotoId.set(img.id, { slug: serie.slug, titre: serie.titre, univers: serie.univers });
      }
    }

    return { serieByPhotoId: byPhotoId, officialSeries: built };
  }, [photos]);

  // Compteurs par onglet de catégorie
  const universeCounts = useMemo(() => {
    const counts = {
      all: photos.length,
      hero: 0,
      drafts: 0,
      "Fashion Week & Celebrities": 0,
      Events: 0,
      "Fashion Wedding": 0,
      Studio: 0,
    };

    for (const photo of photos) {
      if ((photo.roles || []).includes("hero")) counts.hero += 1;
      if (!photo.isPublished) counts.drafts += 1;
      if (counts[photo.category] !== undefined) counts[photo.category] += 1;
    }

    return counts;
  }, [photos]);

  // Photos de l'onglet actif
  const photosInUniverse = useMemo(() => {
    return photos.filter((photo) => {
      if (selectedUniverse === "all") return true;
      if (selectedUniverse === "hero") return (photo.roles || []).includes("hero");
      if (selectedUniverse === "drafts") return !photo.isPublished;
      return photo.category === selectedUniverse;
    });
  }, [photos, selectedUniverse]);

  // Séries officielles disponibles dans l'onglet actif (pour le menu déroulant propre)
  const seriesOptions = useMemo(() => {
    const counts = new Map();
    for (const photo of photosInUniverse) {
      const info = serieByPhotoId.get(photo.id);
      if (!info) continue;
      counts.set(info.slug, (counts.get(info.slug) || 0) + 1);
    }

    return officialSeries
      .filter((s) => counts.has(s.slug))
      .map((s) => ({
        slug: s.slug,
        titre: s.titre,
        count: counts.get(s.slug) || 0,
      }));
  }, [officialSeries, photosInUniverse, serieByPhotoId]);

  // Filtrage final
  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return photosInUniverse.filter((photo) => {
      const serieInfo = serieByPhotoId.get(photo.id);
      if (selectedSerie !== "all" && serieInfo?.slug !== selectedSerie) return false;
      if (publishFilter === "published" && !photo.isPublished) return false;
      if (publishFilter === "draft" && photo.isPublished) return false;
      if (!query) return true;

      const haystack = [
        photo.title,
        photo.alt,
        photo.category,
        serieInfo?.titre,
        ...(photo.roles || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [photosInUniverse, publishFilter, searchQuery, selectedSerie, serieByPhotoId]);

  const pageSize = gridDensity === "compact" ? 40 : 24;
  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPhotos = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredPhotos.slice(start, start + pageSize);
  }, [filteredPhotos, pageSize, safePage]);

  function handleSelectUniverse(universeId) {
    setSelectedUniverse(universeId);
    setSelectedSerie("all");
    setCurrentPage(1);
  }

  function toggleRole(photo, role) {
    const currentRoles = photo.roles || [];
    const isAddingHero = role === "hero" && !currentRoles.includes("hero");
    if (isAddingHero && heroPhotoCount >= maxHeroPhotoCount) {
      onHeroLimit?.();
      return;
    }

    const nextRoles = currentRoles.includes(role)
      ? currentRoles.filter((item) => item !== role)
      : [...currentRoles, role];
    updatePhoto(photo.id, { roles: nextRoles });
  }

  function handleDrop(targetId) {
    if (!draggedId || draggedId === targetId) return;

    const nextPhotos = [...filteredPhotos];
    const fromIndex = nextPhotos.findIndex((photo) => photo.id === draggedId);
    const toIndex = nextPhotos.findIndex((photo) => photo.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const [movedPhoto] = nextPhotos.splice(fromIndex, 1);
    nextPhotos.splice(toIndex, 0, movedPhoto);
    setDraggedId("");
    onReorder(nextPhotos.map((photo, index) => ({ id: photo.id, sortOrder: index + 1 })));
  }

  const isCompact = gridDensity === "compact";

  return (
    <section className="space-y-4">
      {/* BARRE D'ONGLETS PAR CATÉGORIE / PAGE */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-2xl border border-line/20 bg-white/65 p-2">
        {universeTabs.map((tab) => {
          const active = selectedUniverse === tab.id;
          const count = universeCounts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectUniverse(tab.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                active ? "bg-ink text-paper" : "text-ink/65 hover:bg-white hover:text-ink"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  active ? "bg-white/20 text-paper" : "bg-ink/8 text-ink/60"
                }`}
              >
                {tab.id === "hero" ? `${count}/${maxHeroPhotoCount}` : count}
              </span>
            </button>
          );
        })}
      </div>

      {/* BARRE DE FILTRES ALIGNÉE EN 4 COLONNES PROPRES */}
      <div className="grid gap-4 rounded-2xl border border-line/20 bg-white/65 p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_180px_190px]">
        <label className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Recherche</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Titre, description, série..."
            className="w-full rounded-xl border border-line/20 bg-paper px-3.5 py-2 text-sm outline-none focus:border-accent focus:bg-white"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Série / événement</span>
          <select
            value={selectedSerie}
            onChange={(event) => {
              setSelectedSerie(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-line/20 bg-paper px-3.5 py-2 text-sm outline-none focus:border-accent focus:bg-white"
          >
            <option value="all">Toutes les séries ({photosInUniverse.length})</option>
            {seriesOptions.map((serie) => (
              <option key={serie.slug} value={serie.slug}>
                {serie.titre} ({serie.count})
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">État</span>
          <select
            value={publishFilter}
            onChange={(event) => {
              setPublishFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-line/20 bg-paper px-3.5 py-2 text-sm outline-none focus:border-accent focus:bg-white"
          >
            <option value="all">Toutes ({filteredPhotos.length})</option>
            <option value="published">Publiées</option>
            <option value="draft">Brouillons</option>
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Taille de grille</span>
          <select
            value={gridDensity}
            onChange={(event) => {
              setGridDensity(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-line/20 bg-paper px-3.5 py-2 text-sm outline-none focus:border-accent focus:bg-white"
          >
            <option value="comfortable">Confortable (3 col.)</option>
            <option value="compact">Compacte (5 col.)</option>
          </select>
        </label>
      </div>

      {heroPhotoCount >= maxHeroPhotoCount ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Limite atteinte : le diaporama d&apos;accueil contient déjà {maxHeroPhotoCount} photos. Décochez
          « Diaporama accueil » sur une photo avant d&apos;en choisir une nouvelle.
        </div>
      ) : null}

      {/* GRILLE DE PHOTOS */}
      {filteredPhotos.length === 0 ? (
        <div className="rounded-2xl border border-line/20 bg-white/55 p-10 text-center text-sm text-ink/60">
          <p>Aucune photo ne correspond aux filtres sélectionnés.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedUniverse("all");
              setSelectedSerie("all");
              setPublishFilter("all");
              setSearchQuery("");
            }}
            className="mt-4 rounded-full border border-line/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink hover:border-ink"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <motion.div
            layout
            className={
              isCompact
                ? "grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            }
          >
            {paginatedPhotos.map((photo) => {
              const isEditing = editingId === photo.id;
              const isHeroPhoto = (photo.roles || []).includes("hero");
              const serieInfo = serieByPhotoId.get(photo.id);

              return (
                <motion.article
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24 }}
                  draggable
                  onDragStart={() => setDraggedId(photo.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(photo.id)}
                  className={`overflow-hidden rounded-2xl border bg-white/75 shadow-[0_18px_70px_rgba(12,10,8,0.04)] transition ${
                    draggedId === photo.id ? "border-accent opacity-70 ring-4 ring-accent/10" : "border-line/20"
                  }`}
                >
                  <div className={`relative bg-ink ${isCompact ? "aspect-square" : "aspect-[4/3]"}`}>
                    <Image
                      src={photo.src}
                      alt={photo.alt || photo.title}
                      fill
                      className="object-cover"
                      sizes={isCompact ? "(max-width: 768px) 50vw, 20vw" : "(max-width: 1280px) 50vw, 33vw"}
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white">
                      {serieInfo?.titre || photo.category}
                    </div>
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs text-ink">
                        {photo.isPublished ? "Publiée" : "Brouillon"}
                      </span>
                      {isHeroPhoto ? (
                        <span className="rounded-full bg-ink px-3 py-1 text-xs text-paper">Accueil</span>
                      ) : null}
                      {photo.isPinned ? (
                        <span className="rounded-full bg-ink px-3 py-1 text-xs text-paper">En haut</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-serif text-2xl leading-tight">{photo.title || "Photo sans titre"}</h3>
                        {!isCompact ? (
                          <p className="mt-1 line-clamp-2 text-sm text-ink/55">
                            {photo.alt || "Description automatique par série"}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingId(isEditing ? "" : photo.id)}
                        className="shrink-0 rounded-full border border-line/25 px-3 py-1 text-sm hover:border-ink"
                      >
                        {isEditing ? "Fermer" : "Modifier"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <button
                        type="button"
                        disabled={busyId === photo.id}
                        onClick={() => updatePhoto(photo.id, { isPublished: !photo.isPublished })}
                        className="relative overflow-hidden rounded-full border border-line/25 px-3 py-2 hover:border-ink disabled:opacity-50"
                      >
                        {busyId === photo.id ? <span className="absolute inset-0 animate-pulse bg-ink/5" /> : null}
                        {photo.isPublished ? "Masquer" : "Publier"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === photo.id}
                        onClick={() => updatePhoto(photo.id, { isPinned: !photo.isPinned })}
                        className="rounded-full border border-line/25 px-3 py-2 hover:border-ink disabled:opacity-50"
                      >
                        {photo.isPinned ? "Retirer du haut" : "Mettre en haut"}
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isEditing ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="space-y-3 overflow-hidden rounded-xl border border-line/15 bg-paper/70 p-3"
                        >
                          <label className="block space-y-1">
                            <span className="text-xs uppercase tracking-[0.18em] text-ink/45">Titre</span>
                            <input
                              defaultValue={photo.title}
                              onBlur={(event) => {
                                const nextTitle = event.target.value.trim();
                                if (nextTitle && nextTitle !== photo.title) updatePhoto(photo.id, { title: nextTitle });
                              }}
                              className="w-full rounded-lg border border-line/25 bg-white px-3 py-2"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-xs uppercase tracking-[0.18em] text-ink/45">Description</span>
                            <textarea
                              defaultValue={photo.alt}
                              rows={3}
                              onBlur={(event) => {
                                const nextAlt = event.target.value.trim();
                                if (nextAlt !== photo.alt) updatePhoto(photo.id, { alt: nextAlt });
                              }}
                              className="w-full rounded-lg border border-line/25 bg-white px-3 py-2"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-xs uppercase tracking-[0.18em] text-ink/45">Thème</span>
                            <select
                              value={photo.category}
                              onChange={(event) => updatePhoto(photo.id, { category: event.target.value })}
                              className="w-full rounded-lg border border-line/25 bg-white px-3 py-2"
                            >
                              {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="flex flex-wrap gap-2">
                            <p className="basis-full text-xs leading-relaxed text-ink/55">
                              Pour le diaporama de la page d&apos;accueil, cochez « Diaporama accueil ». Maximum{" "}
                              {maxHeroPhotoCount} photos.
                            </p>
                            {roleOptions.map((role) => {
                              const currentRoles = photo.roles || [];
                              const wouldExceedHeroLimit =
                                role === "hero" && !currentRoles.includes("hero") && heroPhotoCount >= maxHeroPhotoCount;

                              return (
                                <label
                                  key={role}
                                  className={`flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs ${
                                    wouldExceedHeroLimit ? "cursor-not-allowed opacity-45" : ""
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={currentRoles.includes(role)}
                                    disabled={wouldExceedHeroLimit}
                                    onChange={() => toggleRole(photo, role)}
                                  />
                                  {roleLabel(role)}
                                </label>
                              );
                            })}
                          </div>

                          {isHeroPhoto ? (
                            <label className="block space-y-1">
                              <span className="text-xs uppercase tracking-[0.18em] text-ink/45">Position mobile</span>
                              <select
                                value={photo.mobileObjectPosition || ""}
                                onChange={(event) =>
                                  updatePhoto(photo.id, { mobileObjectPosition: event.target.value })
                                }
                                className="w-full rounded-lg border border-line/25 bg-white px-3 py-2"
                              >
                                {mobilePositionOptions.map((option) => (
                                  <option key={option.value || "auto"} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <span className="block text-xs leading-relaxed text-ink/50">
                                Ajustez le cadrage de cette photo dans le diaporama sur téléphone.
                              </span>
                            </label>
                          ) : null}

                          <div className="flex flex-wrap gap-2">
                            <a
                              href={photo.src}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-line/25 px-3 py-2 text-sm hover:border-ink"
                            >
                              Ouvrir l&apos;image
                            </a>
                            <button
                              type="button"
                              onClick={() => deletePhoto(photo.id)}
                              className="rounded-full border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                              disabled={busyId === photo.id}
                            >
                              Supprimer
                            </button>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {/* BARRE DE PAGINATION */}
          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line/20 bg-white/65 px-5 py-3.5">
              <p className="text-xs text-ink/60">
                Page <strong>{safePage}</strong> sur <strong>{totalPages}</strong> ({filteredPhotos.length} photos)
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 220, behavior: "smooth" });
                  }}
                  className="rounded-full border border-line/20 px-3.5 py-1.5 text-xs font-semibold hover:border-ink disabled:opacity-40"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      window.scrollTo({ top: 220, behavior: "smooth" });
                    }}
                    className={`h-8 w-8 rounded-full text-xs font-semibold transition ${
                      pageNumber === safePage
                        ? "bg-ink text-paper"
                        : "border border-line/15 bg-paper/70 text-ink/70 hover:border-ink"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 220, behavior: "smooth" });
                  }}
                  className="rounded-full border border-line/20 px-3.5 py-1.5 text-xs font-semibold hover:border-ink disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
