"use client";

import { useState } from "react";
import { importDrivePhotosAction, listDriveFolderAction } from "../../app/admin/photos/actions";

const BATCH_SIZE = 3;

// Import facultatif : lien d'un dossier Google Drive partagé « avec le lien ».
// Les réglages (catégorie, publication, rôles) sont ceux du formulaire d'envoi ci-dessus.
export default function AdminDriveImport({ uploadForm, heroPhotoCount, maxHeroPhotoCount, onImported }) {
  const [link, setLink] = useState("");
  const [files, setFiles] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const isImporting = progress !== null;

  async function readFolder() {
    setMessage({ type: "", text: "" });
    setFiles([]);
    setIsReading(true);
    const result = await listDriveFolderAction(link);
    setIsReading(false);

    if (!result.ok) {
      setMessage({ type: "error", text: result.message });
      return;
    }
    setFiles(result.data);
    setMessage({ type: "ok", text: result.message });
  }

  async function startImport() {
    if (uploadForm.roles.includes("hero") && heroPhotoCount + files.length > maxHeroPhotoCount) {
      setMessage({
        type: "error",
        text: `Le diaporama d'accueil est limité à ${maxHeroPhotoCount} photos. Décochez « Diaporama » ou importez moins de photos.`,
      });
      return;
    }

    setMessage({ type: "", text: "" });
    let added = 0;
    const failed = [];

    for (let index = 0; index < files.length; index += BATCH_SIZE) {
      const batch = files.slice(index, index + BATCH_SIZE);
      setProgress({ done: index, total: files.length });

      const result = await importDrivePhotosAction({
        files: batch.map(({ id, name }) => ({ id, name })),
        title: uploadForm.title,
        alt: uploadForm.alt,
        category: uploadForm.category,
        roles: JSON.stringify(uploadForm.roles),
        isPublished: uploadForm.isPublished,
        isPinned: uploadForm.isPinned,
      });

      if (result.ok) {
        added += result.data?.added || 0;
        failed.push(...(result.data?.failed || []));
      } else {
        failed.push(...batch.map((file) => file.name));
      }
    }

    setProgress(null);
    setFiles([]);
    setLink("");
    const text = failed.length
      ? `${added} photo(s) ajoutée(s). Non importées : ${failed.join(", ")}.`
      : `${added} photo(s) ajoutée(s) depuis Google Drive.`;
    setMessage({ type: failed.length ? "error" : "ok", text });
    if (added > 0) await onImported(text);
  }

  return (
    <section className="space-y-4 rounded-2xl border border-line/20 bg-white/65 p-6 shadow-sm">
      <div className="border-b border-line/10 pb-4">
        <h2 className="font-serif text-2xl">Ou depuis un dossier Google Drive (facultatif)</h2>
        <p className="mt-2 text-sm text-ink/65">
          Déposez vos photos dans un dossier Google Drive, partagez-le avec « Toute personne disposant du lien », puis
          collez son adresse ici. Les réglages choisis plus haut (catégorie, publication, rôles) sont appliqués.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://drive.google.com/drive/folders/..."
          disabled={isImporting}
          className="min-w-0 flex-1 rounded-xl border border-line/25 bg-paper px-4 py-2 outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={readFolder}
          disabled={!link.trim() || isReading || isImporting}
          className="rounded-full border border-ink px-6 py-2 text-xs font-bold uppercase tracking-widest text-ink transition hover:bg-ink hover:text-paper disabled:opacity-40"
        >
          {isReading ? "Lecture..." : "Lire le dossier"}
        </button>
      </div>

      {files.length > 0 ? (
        <div className="space-y-3">
          <ul className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-line/15 bg-paper/60 p-3 text-sm text-ink/70">
            {files.map((file) => (
              <li key={file.id} className="truncate">
                {file.name}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={startImport}
            disabled={isImporting}
            className="rounded-full bg-ink px-8 py-3 text-xs font-bold uppercase tracking-widest text-paper transition hover:bg-accent disabled:opacity-40"
          >
            {isImporting ? `Import en cours : ${progress.done} / ${progress.total}` : `Importer ces ${files.length} photos`}
          </button>
        </div>
      ) : null}

      {isImporting ? (
        <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full bg-accent transition-[width] duration-500"
            style={{ width: `${Math.max(4, (progress.done / progress.total) * 100)}%` }}
          />
        </div>
      ) : null}

      {message.text ? (
        <p className={`text-sm ${message.type === "error" ? "text-red-700" : "text-ink/70"}`}>{message.text}</p>
      ) : null}
    </section>
  );
}
