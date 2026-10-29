"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  isAdminConfigured,
  validateAdminCredentials,
  verifyAdminSessionToken,
} from "../../../lib/adminAuth";
import sharp from "sharp";
import { defaultPortfolioCategory } from "../../../lib/categories";
import {
  downloadDriveFile,
  extractDriveFolderId,
  isDriveConfigured,
  isValidDriveFileId,
  listDriveImages,
} from "../../../lib/googleDrive";
import { getAdminContent } from "../../../lib/adminContent";
import { updateSiteContent } from "../../../lib/siteContent";
import { updateUniversOverride } from "../../../lib/universContent";
import { deleteContactMessage, listContactMessages, updateContactMessageStatus } from "../../../lib/contactStore";
import {
  createAdminPhotos,
  deleteAdminPhoto,
  getAdminPhotos,
  isAdminStorageConfigured,
  MAX_BULK_UPLOAD_COUNT,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  reorderAdminPhotos,
  updateAdminPhoto,
} from "../../../lib/photoRepository";
import {
  getAboutCopy,
  getCategories,
  getHomeCopy,
  getMaintenanceMode,
  updateAboutCopy,
  updateCategories,
  updateHomeCopy,
  updateMaintenanceMode,
} from "../../../lib/siteSettings";

function unauthorizedResult(message = "Session expirée ou non autorisée.") {
  return createActionResult({ ok: false, message });
}

function createActionResult({ ok, message, data = null }) {
  return {
    ok,
    message,
    data,
  };
}

function revalidatePublicPhotoViews() {
  revalidateTag("public-photos");
  revalidatePath("/");
  revalidatePath("/signature");
  revalidatePath("/evenements");
  revalidatePath("/mariage");
  revalidatePath("/entreprises");
  revalidatePath("/a-propos");
  revalidatePath("/contact");
}

function revalidateAdminViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/photos");
}

async function getAuthorizedCookieStore() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value || "";
  if (!verifyAdminSessionToken(token)) {
    return null;
  }

  return cookieStore;
}

function toStringValue(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toBooleanValue(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return fallback;
}

export async function loginAdminAction(credentials) {
  if (!isAdminConfigured()) {
    return createActionResult({
      ok: false,
      message: "L'authentification admin n'est pas configurée (ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET).",
    });
  }

  const username = typeof credentials?.username === "string" ? credentials.username : "";
  const password = typeof credentials?.password === "string" ? credentials.password : "";

  if (!validateAdminCredentials(username, password)) {
    return createActionResult({ ok: false, message: "Identifiants invalides." });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createAdminSessionToken(username), getAdminCookieOptions());
  const [photos, messages, categories, homeCopy, aboutCopy, maintenanceMode, content] = await Promise.all([
    getAdminPhotos(),
    listContactMessages(),
    getCategories(),
    getHomeCopy(),
    getAboutCopy(),
    getMaintenanceMode(),
    getAdminContent(),
  ]);

  return createActionResult({
    ok: true,
    message: "Connexion à l'espace d'administration réussie.",
    data: { photos, messages, categories, homeCopy, aboutCopy, maintenanceMode, content },
  });
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });

  return createActionResult({ ok: true, message: "Déconnecté." });
}

export async function uploadAdminPhotosAction(formData) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  if (!isAdminStorageConfigured()) {
    return createActionResult({ ok: false, message: "Le stockage Supabase / R2 n'est pas encore configuré." });
  }

  const filesFromForm = formData.getAll("files");
  const fallbackSingleFile = formData.get("file");
  const files = [...filesFromForm, fallbackSingleFile]
    .filter(Boolean)
    .filter((value) => typeof value !== "string");

  if (files.length === 0) {
    return createActionResult({ ok: false, message: "Veuillez sélectionner au moins une image." });
  }

  if (files.length > MAX_BULK_UPLOAD_COUNT) {
    return createActionResult({ ok: false, message: `Maximum ${MAX_BULK_UPLOAD_COUNT} photos par envoi.` });
  }

  const invalidFile = files.find((file) => !file.type?.startsWith("image/"));
  if (invalidFile) {
    return createActionResult({ ok: false, message: "Seuls les fichiers image sont acceptés." });
  }

  const oversizedFile = files.find((file) => file.size > MAX_UPLOAD_FILE_SIZE_BYTES);
  if (oversizedFile) {
    return createActionResult({ ok: false, message: "Un fichier dépasse la limite de 15 Mo." });
  }

  try {
    const created = await createAdminPhotos({
      files,
      title: toStringValue(formData.get("title")),
      alt: toStringValue(formData.get("alt")),
      category: toStringValue(formData.get("category"), defaultPortfolioCategory),
      roles: toStringValue(formData.get("roles"), "[]"),
      isPublished: toBooleanValue(formData.get("isPublished"), true),
      isPinned: toBooleanValue(formData.get("isPinned"), false),
    });

    revalidatePublicPhotoViews();
    revalidateAdminViews();
    const photos = await getAdminPhotos();
    return createActionResult({
      ok: true,
      message: `${created.length || files.length} photo(s) ajoutée(s).`,
      data: photos,
    });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible d'ajouter la photo." });
  }
}

export async function refreshAdminPhotosAction() {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();
  return createActionResult({ ok: true, message: "", data: await getAdminPhotos() });
}

export async function listDriveFolderAction(link) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  if (!isDriveConfigured()) {
    return createActionResult({ ok: false, message: "L'import Google Drive n'est pas encore configuré (clé GOOGLE_DRIVE_API_KEY manquante)." });
  }

  const folderId = extractDriveFolderId(link);
  if (!folderId) {
    return createActionResult({ ok: false, message: "Ce lien ne ressemble pas à un dossier Google Drive." });
  }

  try {
    const files = await listDriveImages(folderId);
    if (files.length === 0) {
      return createActionResult({ ok: false, message: "Aucune image trouvée dans ce dossier." });
    }
    return createActionResult({
      ok: true,
      message: `${files.length} image(s) trouvée(s).`,
      data: files.map((file) => ({ id: file.id, name: file.name, size: Number(file.size) || 0 })),
    });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible de lire le dossier." });
  }
}

// Importe un petit lot de fichiers Drive (le client enchaîne les lots) : téléchargement, allègement, puis ajout au portfolio.
export async function importDrivePhotosAction(input) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  if (!isDriveConfigured() || !isAdminStorageConfigured()) {
    return createActionResult({ ok: false, message: "L'import Google Drive ou le stockage n'est pas configuré." });
  }

  const items = (Array.isArray(input?.files) ? input.files : []).filter((item) => isValidDriveFileId(item?.id));
  if (items.length === 0 || items.length > 4) {
    return createActionResult({ ok: false, message: "Lot de fichiers invalide." });
  }

  const files = [];
  const failed = [];

  for (const item of items) {
    const name = toStringValue(item.name, "photo").replace(/\.[^/.]+$/, "") || "photo";
    try {
      const original = await downloadDriveFile(item.id);
      const output = await sharp(original)
        .rotate()
        .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();

      if (output.length > MAX_UPLOAD_FILE_SIZE_BYTES) throw new Error("trop lourd");
      files.push(new File([output], `${name}.jpg`, { type: "image/jpeg" }));
    } catch {
      failed.push(item.name || item.id);
    }
  }

  if (files.length === 0) {
    return createActionResult({ ok: false, message: `Impossible de traiter : ${failed.join(", ")}.` });
  }

  try {
    await createAdminPhotos({
      files,
      title: toStringValue(input.title),
      alt: toStringValue(input.alt),
      category: toStringValue(input.category, defaultPortfolioCategory),
      roles: toStringValue(input.roles, "[]"),
      isPublished: toBooleanValue(input.isPublished, true),
      isPinned: toBooleanValue(input.isPinned, false),
    });

    revalidatePublicPhotoViews();
    revalidateAdminViews();
    return createActionResult({
      ok: true,
      message: failed.length ? `${files.length} ajoutée(s), ${failed.length} ignorée(s) : ${failed.join(", ")}.` : `${files.length} photo(s) ajoutée(s).`,
      data: { added: files.length, failed },
    });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible d'ajouter les photos." });
  }
}

export async function updateAdminPhotoAction(input) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  const id = toStringValue(input?.id);
  if (!id) {
    return createActionResult({ ok: false, message: "Identifiant de photo manquant." });
  }

  try {
    await updateAdminPhoto(id, {
      title: input?.title,
      alt: input?.alt,
      category: input?.category,
      roles: input?.roles,
      isPublished: input?.isPublished,
      isPinned: input?.isPinned,
      mobileObjectPosition: input?.mobileObjectPosition,
    });

    revalidatePublicPhotoViews();
    revalidateAdminViews();
    const photos = await getAdminPhotos();
    return createActionResult({ ok: true, message: "Photo mise à jour.", data: photos });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible de mettre à jour la photo." });
  }
}

export async function deleteAdminPhotoAction(id) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  const photoId = toStringValue(id);
  if (!photoId) {
    return createActionResult({ ok: false, message: "Identifiant de photo manquant." });
  }

  try {
    await deleteAdminPhoto(photoId);
    revalidatePublicPhotoViews();
    revalidateAdminViews();
    const photos = await getAdminPhotos();
    return createActionResult({ ok: true, message: "Photo supprimée.", data: photos });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible de supprimer la photo." });
  }
}

export async function reorderAdminPhotosAction(items) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    const photos = await reorderAdminPhotos(items);
    revalidatePublicPhotoViews();
    revalidateAdminViews();
    return createActionResult({ ok: true, message: "Ordre des photos enregistré.", data: photos });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible d'enregistrer l'ordre des photos." });
  }
}

export async function updateContactStatusAction(id, status) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    const messages = await updateContactMessageStatus(id, status);
    revalidateAdminViews();
    return createActionResult({ ok: true, message: "Statut du message mis à jour.", data: messages });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible de mettre à jour le message." });
  }
}

export async function updateHomeCopyAction(input) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    const copy = await updateHomeCopy(input);
    revalidateTag("site-settings");
    revalidatePath("/");
    revalidateAdminViews();
    return createActionResult({ ok: true, message: "Textes de l'accueil enregistrés.", data: copy });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible d'enregistrer les textes de l'accueil." });
  }
}

export async function updateAboutCopyAction(input) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    const copy = await updateAboutCopy(input);
    revalidateTag("site-settings");
    revalidatePath("/a-propos");
    revalidateAdminViews();
    return createActionResult({ ok: true, message: "Textes de la page À propos enregistrés.", data: copy });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible d'enregistrer la page À propos." });
  }
}

export async function updateCategoriesAction(input) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    const categories = await updateCategories(input);
    revalidateTag("site-settings");
    revalidatePublicPhotoViews();
    revalidateAdminViews();
    return createActionResult({ ok: true, message: "Thèmes enregistrés.", data: categories });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible d'enregistrer les thèmes." });
  }
}

export async function updateMaintenanceModeAction(isEnabled) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    const status = await updateMaintenanceMode(isEnabled);
    revalidateTag("site-settings");
    revalidatePath("/", "layout");
    revalidateAdminViews();
    return createActionResult({
      ok: true,
      message: `Mode maintenance ${status ? "activé" : "désactivé"}.`,
      data: status,
    });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible de modifier le mode maintenance." });
  }
}

export async function deleteContactMessageAction(id) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    const messages = await deleteContactMessage(id);
    revalidateAdminViews();
    return createActionResult({ ok: true, message: "Message supprimé définitivement.", data: messages });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible de supprimer le message." });
  }
}

// Un univers : titre, crédits, contexte, ordre des photos, photos masquées, couverture, textes
// alternatifs. Un champ texte vide efface la modification et revient à data/univers.js (import du Drive).
export async function updateUniversAction(slug, patch) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    await updateUniversOverride(slug, {
      titre: toStringValue(patch?.titre),
      credits: toStringValue(patch?.credits),
      contexte: toStringValue(patch?.contexte),
      order: Array.isArray(patch?.order) ? patch.order : [],
      hidden: Array.isArray(patch?.hidden) ? patch.hidden : [],
      cover: toStringValue(patch?.cover),
      alt: patch?.alt && typeof patch.alt === "object" ? patch.alt : {},
    });

    revalidateTag("site-settings");
    revalidatePath("/", "layout");
    revalidateAdminViews();
    const content = await getAdminContent();
    return createActionResult({ ok: true, message: "Univers enregistré.", data: content.universList });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible d'enregistrer cet univers." });
  }
}

const CONTENT_LABELS = {
  testimonials: "Avis clients enregistrés.",
  stats: "Chiffres enregistrés.",
  references: "Références enregistrées.",
  seriesNotes: "Textes des séries enregistrés.",
};

// kind : "testimonials" | "stats" | "references" | "seriesNotes"
export async function updateSiteContentAction(kind, input) {
  const cookieStore = await getAuthorizedCookieStore();
  if (!cookieStore) return unauthorizedResult();

  try {
    const content = await updateSiteContent(kind, input);
    revalidateTag("site-settings");
    revalidatePath("/", "layout");
    revalidateAdminViews();
    return createActionResult({ ok: true, message: CONTENT_LABELS[kind] || "Contenu enregistré.", data: content });
  } catch (error) {
    return createActionResult({ ok: false, message: error.message || "Impossible d'enregistrer ce contenu." });
  }
}
