"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import {
  deleteAdminPhotoAction,
  deleteContactMessageAction,
  loginAdminAction,
  logoutAdminAction,
  reorderAdminPhotosAction,
  updateAboutCopyAction,
  updateAdminPhotoAction,
  updateCategoriesAction,
  updateContactStatusAction,
  updateHomeCopyAction,
  updateMaintenanceModeAction,
  uploadAdminPhotosAction,
} from "../../app/admin/photos/actions";
import { compressImageFiles, formatFileSize } from "../../lib/imageCompression";
import AdminAboutEditor from "./AdminAboutEditor";
import AdminContentEditor from "./AdminContentEditor";
import AdminCategoryManager from "./AdminCategoryManager";
import AdminDashboard from "./AdminDashboard";
import AdminFeedback from "./AdminFeedback";
import AdminLoginForm from "./AdminLoginForm";
import AdminMessagesPanel from "./AdminMessagesPanel";
import AdminPhotosTable from "./AdminPhotosTable";
import AdminSiteTextEditor from "./AdminSiteTextEditor";
import AdminThemeGuide from "./AdminThemeGuide";
import AdminUploadForm from "./AdminUploadForm";
import {
  categories as staticCategories,
  initialUploadForm,
  maxBulkUploadCount,
  maxHeroPhotoCount,
  roleOptions,
} from "./constants";

const settingsSubTabs = [
  { id: "accueil", label: "Page d'accueil", description: "Titre et sous-titre du hero" },
  { id: "a-propos", label: "Page À propos", description: "Biographie, histoire, valeurs et manifeste" },
  { id: "avis", label: "Avis clients", description: "Témoignages affichés sur le site" },
  { id: "chiffres", label: "Chiffres", description: "Séries livrées, événements, marques" },
  { id: "references", label: "Références", description: "Personnalités, maisons, médias et lieux" },
  { id: "series", label: "Textes des séries", description: "Phrase de contexte sous chaque série" },
  { id: "themes", label: "Catégories & guide", description: "Ajouter une catégorie, pages du site" },
];

export default function AdminPhotosClient({
  initialAuthenticated = false,
  initialPhotos = [],
  initialMessages = [],
  initialCategories = [],
  initialHomeCopy = { heroTitle: "", heroSubtitle: "" },
  initialAboutCopy = {
    headline: "",
    subheadline: "",
    storyTitle: "",
    storyParagraphs: [],
    values: [],
    manifestoTitle: "",
    manifestoText: "",
    convictionTitle: "",
    convictionText: "",
  },
  initialMaintenanceMode = false,
  initialContent = { testimonials: [], stats: [], references: [], seriesList: [] },
}) {
  const [authForm, setAuthForm] = useState({ username: "admin", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [photos, setPhotos] = useState(initialPhotos);
  const [messages, setMessages] = useState(initialMessages);
  const [categories, setCategories] = useState(initialCategories?.length > 0 ? initialCategories : staticCategories);
  const [homeCopy, setHomeCopy] = useState(initialHomeCopy);
  const [aboutCopy, setAboutCopy] = useState(initialAboutCopy);
  const [maintenanceMode, setMaintenanceMode] = useState(initialMaintenanceMode);
  const [content, setContent] = useState(initialContent);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [uploadForm, setUploadForm] = useState(initialUploadForm);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedUniverse, setSelectedUniverse] = useState("all");
  const [settingsSubTab, setSettingsSubTab] = useState("accueil");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 520);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroPhotoCount = useMemo(
    () => photos.filter((photo) => (photo.roles || []).includes("hero")).length,
    [photos]
  );

  const pendingMessagesCount = useMemo(
    () => messages.filter((m) => m.status === "new" || m.status === "soon").length,
    [messages]
  );

  const mainTabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "photos", label: "Photothèque", badge: photos.length },
    { id: "upload", label: "Ajouter des photos" },
    { id: "messages", label: "Demandes de devis", badge: pendingMessagesCount || messages.length },
    { id: "settings", label: "Textes & réglages" },
  ];

  function openUniverseInPhototheque(universeId) {
    setSelectedUniverse(universeId);
    setActiveTab("photos");
  }

  function showHeroLimitMessage() {
    setStatusMessage("");
    setErrorMessage(
      `Le diaporama d'accueil est limité à ${maxHeroPhotoCount} photos. Retirez une image d'accueil avant d'en ajouter une autre.`
    );
  }

  function updateAuthField(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  function replacePhotoLocally(id, patch) {
    setPhotos((current) => current.map((photo) => (photo.id === id ? { ...photo, ...patch } : photo)));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    try {
      const result = await loginAdminAction(authForm);

      if (!result.ok) {
        setErrorMessage(result.message || "Échec de la connexion.");
        return;
      }

      setIsAuthenticated(true);
      setPhotos(result.data?.photos || result.data || []);
      setMessages(result.data?.messages || []);
      if (result.data?.categories?.length > 0) setCategories(result.data.categories);
      if (result.data?.homeCopy) setHomeCopy(result.data.homeCopy);
      if (result.data?.aboutCopy) setAboutCopy(result.data.aboutCopy);
      if (typeof result.data?.maintenanceMode === "boolean") setMaintenanceMode(result.data.maintenanceMode);
      if (result.data?.content) setContent(result.data.content);
      setStatusMessage(result.message || "Connexion à l'espace d'administration réussie.");
    } catch (error) {
      setIsAuthenticated(false);
      setErrorMessage(error?.message || "Impossible de charger l'espace d'administration.");
    }
  }

  async function handleLogout() {
    const result = await logoutAdminAction();
    setIsAuthenticated(false);
    setPhotos([]);
    setMessages([]);
    setErrorMessage("");
    setStatusMessage(result.message || "Déconnecté.");
  }

  function toggleUploadRole(role) {
    if (role === "hero" && !uploadForm.roles.includes("hero")) {
      const selectedFilesCount = Math.max(uploadForm.files.length, 1);
      if (heroPhotoCount + selectedFilesCount > maxHeroPhotoCount) {
        showHeroLimitMessage();
        return;
      }
    }

    setUploadForm((current) => {
      const hasRole = current.roles.includes(role);
      return {
        ...current,
        roles: hasRole ? current.roles.filter((item) => item !== role) : [...current.roles, role],
      };
    });
  }

  async function handleUpload(event) {
    event.preventDefault();
    if (!uploadForm.files.length) {
      setErrorMessage("Ajoutez au moins un fichier image avant de publier.");
      return;
    }

    if (uploadForm.roles.includes("hero") && heroPhotoCount + uploadForm.files.length > maxHeroPhotoCount) {
      showHeroLimitMessage();
      return;
    }

    if (uploadForm.files.length > maxBulkUploadCount) {
      setErrorMessage(`Vous pouvez envoyer au maximum ${maxBulkUploadCount} photos en même temps.`);
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setStatusMessage("Préparation et allègement des images...");

    let uploadFiles = uploadForm.files;
    try {
      const compression = await compressImageFiles(uploadForm.files);
      uploadFiles = compression.files;

      if (compression.compressedCount > 0) {
        setStatusMessage(
          `${compression.compressedCount} image(s) allégée(s) : ${formatFileSize(compression.originalSize)} -> ${formatFileSize(
            compression.compressedSize
          )}. Envoi en cours...`
        );
      } else {
        setStatusMessage("Images déjà légères. Envoi en cours...");
      }
    } catch (error) {
      setIsUploading(false);
      setErrorMessage(error?.message || "Impossible d'alléger les images avant l'envoi.");
      return;
    }

    const formData = new FormData();
    uploadFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("title", uploadForm.title);
    formData.append("alt", uploadForm.alt);
    formData.append("category", uploadForm.category);
    formData.append("roles", JSON.stringify(uploadForm.roles));
    formData.append("isPublished", String(uploadForm.isPublished));
    formData.append("isPinned", String(uploadForm.isPinned));

    const result = await uploadAdminPhotosAction(formData);

    if (!result.ok) {
      setErrorMessage(result.message || "Échec de l'envoi.");
      setIsUploading(false);
      return;
    }

    const uploadedCategory = uploadForm.category;
    setUploadForm(initialUploadForm);
    setFileInputKey((current) => current + 1);
    setPhotos(result.data || []);
    setSelectedUniverse(uploadedCategory || "all");
    setActiveTab("photos");
    setStatusMessage(result.message || `${uploadForm.files.length} photo(s) ajoutée(s).`);
    setIsUploading(false);
  }

  async function updatePhoto(id, patch) {
    const previousPhoto = photos.find((photo) => photo.id === id);
    if (!previousPhoto) return;

    setBusyId(id);
    setErrorMessage("");
    startTransition(() => {
      replacePhotoLocally(id, patch);
    });
    const result = await updateAdminPhotoAction({ id, ...patch });
    setBusyId("");

    if (!result.ok) {
      setPhotos((current) => current.map((photo) => (photo.id === id ? previousPhoto : photo)));
      setErrorMessage(result.message || "Impossible de mettre à jour la photo.");
      return;
    }

    setPhotos(result.data || []);
    setErrorMessage("");
    setStatusMessage(result.message || "Photo mise à jour.");
  }

  async function deletePhoto(id) {
    const confirmed = window.confirm("Supprimer cette photo ?");
    if (!confirmed) return;

    const previousPhotos = photos;
    setBusyId(id);
    setErrorMessage("");
    startTransition(() => {
      setPhotos((current) => current.filter((photo) => photo.id !== id));
    });
    const result = await deleteAdminPhotoAction(id);
    setBusyId("");

    if (!result.ok) {
      setPhotos(previousPhotos);
      setErrorMessage(result.message || "Impossible de supprimer la photo.");
      return;
    }

    setPhotos(result.data || []);
    setErrorMessage("");
    setStatusMessage(result.message || "Photo supprimée.");
  }

  async function reorderPhotos(items) {
    const previousPhotos = photos;
    const order = new Map(items.map((item) => [item.id, item.sortOrder]));
    setPhotos((current) =>
      [...current]
        .map((photo) => ({ ...photo, sortOrder: order.get(photo.id) || photo.sortOrder }))
        .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))
    );

    const result = await reorderAdminPhotosAction(items);
    if (!result.ok) {
      setPhotos(previousPhotos);
      setErrorMessage(result.message || "Impossible d'enregistrer l'ordre.");
      return;
    }

    setPhotos(result.data || []);
    setStatusMessage(result.message || "Ordre enregistré.");
  }

  async function updateMessageStatus(id, status) {
    const previousMessages = messages;
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, status } : message)));

    const result = await updateContactStatusAction(id, status);
    if (!result.ok) {
      setMessages(previousMessages);
      setErrorMessage(result.message || "Impossible de mettre à jour le message.");
      return;
    }

    setMessages(result.data || []);
    setStatusMessage(result.message || "Statut du message mis à jour.");
  }

  async function deleteMessage(id) {
    const previousMessages = messages;
    setMessages((current) => current.filter((message) => message.id !== id));

    const result = await deleteContactMessageAction(id);
    if (!result.ok) {
      setMessages(previousMessages);
      setErrorMessage(result.message || "Impossible de supprimer le message.");
      return;
    }

    setMessages(result.data || []);
    setStatusMessage(result.message || "Message supprimé.");
  }

  async function handleSaveHomeCopy(event) {
    event.preventDefault();
    setIsSavingSettings(true);
    setErrorMessage("");
    setStatusMessage("");

    const result = await updateHomeCopyAction(homeCopy);
    setIsSavingSettings(false);

    if (!result.ok) {
      setErrorMessage(result.message || "Impossible d'enregistrer les textes de l'accueil.");
      return;
    }

    setHomeCopy(result.data || homeCopy);
    setStatusMessage(result.message || "Textes de l'accueil enregistrés.");
  }

  async function handleSaveAboutCopy(nextAboutCopy) {
    setIsSavingSettings(true);
    setErrorMessage("");
    setStatusMessage("");

    const result = await updateAboutCopyAction(nextAboutCopy);
    setIsSavingSettings(false);

    if (!result.ok) {
      setErrorMessage(result.message || "Impossible d'enregistrer la page À propos.");
      return;
    }

    setAboutCopy(result.data || nextAboutCopy);
    setStatusMessage(result.message || "Textes de la page À propos enregistrés.");
  }

  async function handleSaveCategories(nextCategories) {
    setIsSavingSettings(true);
    setErrorMessage("");
    setStatusMessage("");

    const result = await updateCategoriesAction(nextCategories);
    setIsSavingSettings(false);

    if (!result.ok) {
      setErrorMessage(result.message || "Impossible d'enregistrer les thèmes.");
      return;
    }

    setCategories(result.data || nextCategories);
    setStatusMessage(result.message || "Thèmes enregistrés.");
  }

  async function handleToggleMaintenance() {
    const nextValue = !maintenanceMode;
    setIsSavingSettings(true);
    setErrorMessage("");
    setStatusMessage("");

    const result = await updateMaintenanceModeAction(nextValue);
    setIsSavingSettings(false);

    if (!result.ok) {
      setErrorMessage(result.message || "Impossible de modifier le mode maintenance.");
      return;
    }

    setMaintenanceMode(Boolean(result.data));
    setStatusMessage(result.message || `Mode maintenance ${nextValue ? "activé" : "désactivé"}.`);
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginForm authForm={authForm} errorMessage={errorMessage} onSubmit={handleLogin} onChange={updateAuthField} />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-20 pt-8 md:px-8 md:pt-12">
      {/* EN-TÊTE ÉDITORIAL DE L'ADMIN */}
      <header className="flex flex-wrap items-end justify-between gap-4 rounded-card border border-line/15 bg-white/80 p-6 shadow-[0_18px_60px_rgba(12,10,8,0.04)] backdrop-blur-sm md:p-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-ink/45">Espace photographe</p>
          <h1 className="mt-2 font-serif text-4xl leading-none tracking-[-0.03em] md:text-5xl">
            Administration JerryPicsArt
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Gérez vos {photos.length} photos classées par univers et par série, vos demandes de devis et vos textes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={isSavingSettings}
            onClick={handleToggleMaintenance}
            className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${
              maintenanceMode
                ? "border-amber-400 bg-amber-100 text-amber-900"
                : "border-line/20 bg-paper text-ink/70 hover:border-ink"
            }`}
          >
            {maintenanceMode ? "Maintenance : active" : "Maintenance : inactive"}
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line/20 bg-paper px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:border-ink hover:bg-white"
          >
            Voir le site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-line/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/70 transition hover:border-ink hover:text-ink"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* COMPTEURS CLÉS & VUE D'ENSEMBLE */}
      <AdminDashboard
        photos={photos}
        messages={messages}
        categories={categories}
        onSelectTab={setActiveTab}
        onOpenUniverse={openUniverseInPhototheque}
        showDetails={activeTab === "overview"}
      />

      <AdminFeedback errorMessage={errorMessage} statusMessage={statusMessage} />

      {/* NAVIGATION PRINCIPALE (ONGLETS DE NIVEAU 1) */}
      <nav
        aria-label="Sections de l'administration"
        className="no-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-line/15 bg-white/75 p-2 shadow-[0_8px_30px_rgba(12,10,8,0.03)]"
      >
        {mainTabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition ${
                active ? "bg-ink text-paper shadow-sm" : "text-ink/65 hover:bg-paper hover:text-ink"
              }`}
            >
              {tab.label}
              {typeof tab.badge === "number" ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    active ? "bg-white/20 text-paper" : "bg-ink/8 text-ink/70"
                  }`}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* ONGLET 2 : PHOTOTHÈQUE HIÉRARCHISÉE (UNIVERS -> SÉRIES -> VUES) */}
      {activeTab === "photos" ? (
        <AdminPhotosTable
          busyId={busyId}
          categories={categories}
          deletePhoto={deletePhoto}
          photos={photos}
          heroPhotoCount={heroPhotoCount}
          maxHeroPhotoCount={maxHeroPhotoCount}
          onHeroLimit={showHeroLimitMessage}
          onReorder={reorderPhotos}
          roleOptions={roleOptions}
          updatePhoto={updatePhoto}
          selectedUniverse={selectedUniverse}
          setSelectedUniverse={setSelectedUniverse}
        />
      ) : null}

      {/* ONGLET 3 : AJOUTER DES PHOTOS */}
      {activeTab === "upload" ? (
        <AdminUploadForm
          categories={categories}
          fileInputKey={fileInputKey}
          heroPhotoCount={heroPhotoCount}
          isUploading={isUploading}
          maxBulkUploadCount={maxBulkUploadCount}
          maxHeroPhotoCount={maxHeroPhotoCount}
          onSubmit={handleUpload}
          toggleUploadRole={toggleUploadRole}
          roleOptions={roleOptions}
          setUploadForm={setUploadForm}
          uploadForm={uploadForm}
        />
      ) : null}

      {/* ONGLET 4 : DEMANDES DE DEVIS */}
      {activeTab === "messages" ? (
        <AdminMessagesPanel
          messages={messages}
          onUpdateStatus={updateMessageStatus}
          onDeleteMessage={deleteMessage}
        />
      ) : null}

      {/* ONGLET 5 : TEXTES & RÉGLAGES (AVEC SOUS-ONGLETS) */}
      {activeTab === "settings" ? (
        <div className="space-y-6">
          <div className="grid gap-3 rounded-2xl border border-line/15 bg-white/75 p-4 md:grid-cols-3 xl:grid-cols-4">
            {settingsSubTabs.map((sub) => {
              const active = settingsSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSettingsSubTab(sub.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-ink bg-ink text-paper shadow-[0_12px_30px_rgba(12,10,8,0.14)]"
                      : "border-line/15 bg-paper/60 text-ink hover:border-ink/35 hover:bg-white"
                  }`}
                >
                  <p className="font-serif text-xl">{sub.label}</p>
                  <p className={`mt-1 text-xs ${active ? "text-paper/70" : "text-ink/55"}`}>{sub.description}</p>
                </button>
              );
            })}
          </div>

          {settingsSubTab === "accueil" ? (
            <AdminSiteTextEditor
              homeCopy={homeCopy}
              setHomeCopy={setHomeCopy}
              onSave={handleSaveHomeCopy}
              isSaving={isSavingSettings}
            />
          ) : null}

          {settingsSubTab === "a-propos" ? (
            <AdminAboutEditor
              aboutCopy={aboutCopy}
              onSave={handleSaveAboutCopy}
              isSaving={isSavingSettings}
            />
          ) : null}

          {settingsSubTab === "avis" ? (
            <AdminContentEditor
              kind="testimonials"
              initialItems={content.testimonials}
              onStatus={setStatusMessage}
              onError={setErrorMessage}
            />
          ) : null}

          {settingsSubTab === "chiffres" ? (
            <AdminContentEditor
              kind="stats"
              initialItems={content.stats}
              onStatus={setStatusMessage}
              onError={setErrorMessage}
            />
          ) : null}

          {settingsSubTab === "references" ? (
            <AdminContentEditor
              kind="references"
              initialItems={content.references}
              onStatus={setStatusMessage}
              onError={setErrorMessage}
            />
          ) : null}

          {settingsSubTab === "series" ? (
            <AdminContentEditor
              kind="seriesNotes"
              initialItems={content.seriesList}
              onStatus={setStatusMessage}
              onError={setErrorMessage}
            />
          ) : null}

          {settingsSubTab === "themes" ? (
            <div className="space-y-6">
              <AdminCategoryManager
                categories={categories}
                onSave={handleSaveCategories}
                isSaving={isSavingSettings}
              />
              <AdminThemeGuide categories={categories} />
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Remonter en haut de la page d'administration"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-line/15 bg-paper/90 text-ink shadow-[0_18px_52px_rgba(12,10,8,0.18)] backdrop-blur-xl transition duration-300 hover:bg-ink hover:text-paper md:bottom-8 md:right-8 ${
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
