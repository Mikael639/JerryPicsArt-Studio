// Import de photos depuis un dossier Google Drive partagé « avec le lien » (lecture seule, clé d'API).
const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const MAX_LISTED_FILES = 300;

export function isDriveConfigured() {
  return Boolean(process.env.GOOGLE_DRIVE_API_KEY);
}

// Accepte l'adresse du dossier (…/folders/ID ou …?id=ID) ou l'identifiant seul.
export function extractDriveFolderId(input) {
  const value = String(input || "").trim();
  const match = value.match(/\/folders\/([\w-]{10,})/) || value.match(/[?&]id=([\w-]{10,})/);
  if (match) return match[1];
  return /^[\w-]{10,}$/.test(value) ? value : "";
}

export function isValidDriveFileId(id) {
  return /^[\w-]{10,}$/.test(String(id || ""));
}

function driveError(status) {
  if (status === 404) return "Dossier introuvable. Vérifiez le lien et que le partage est réglé sur « Toute personne disposant du lien ».";
  if (status === 403) return "Accès refusé par Google. Vérifiez que le dossier est partagé avec le lien et que la clé d'API Drive est valide.";
  return `Google Drive a répondu avec une erreur (${status}).`;
}

export async function listDriveImages(folderId) {
  const key = process.env.GOOGLE_DRIVE_API_KEY;
  const files = [];
  let pageToken = "";

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "nextPageToken,files(id,name,mimeType,size)",
      orderBy: "name",
      pageSize: "100",
      key,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const response = await fetch(`${DRIVE_API}?${params}`, { cache: "no-store" });
    if (!response.ok) throw new Error(driveError(response.status));

    const data = await response.json();
    files.push(...(data.files || []));
    pageToken = data.nextPageToken || "";
  } while (pageToken && files.length < MAX_LISTED_FILES);

  return files.slice(0, MAX_LISTED_FILES);
}

export async function downloadDriveFile(fileId) {
  const params = new URLSearchParams({ alt: "media", key: process.env.GOOGLE_DRIVE_API_KEY });
  const response = await fetch(`${DRIVE_API}/${encodeURIComponent(fileId)}?${params}`, { cache: "no-store" });
  if (!response.ok) throw new Error(driveError(response.status));
  return Buffer.from(await response.arrayBuffer());
}
