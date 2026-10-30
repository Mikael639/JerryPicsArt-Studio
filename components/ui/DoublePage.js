"use client";

import Image from "next/image";
import { useState } from "react";
import { isLandscapePhoto } from "./PhotoGrid";
import RevealOnView from "./RevealOnView";

// « Double page » : une photo très forte, sans aucun texte, entre deux univers, sur toute la largeur.
// Une photo horizontale reste horizontale ; une photo verticale occupe toute la hauteur de l'écran, sur fond sombre.
export default function DoublePage({ photo }) {
  const [loaded, setLoaded] = useState(false);
  if (!photo) return null;

  const landscape = isLandscapePhoto(photo);

  return (
    <RevealOnView className={landscape ? "w-full" : "w-full bg-[#0c0a08]"}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="100vw"
        quality={75}
        onLoad={() => setLoaded(true)}
        data-loaded={loaded ? "" : undefined}
        className={`photo-fade mx-auto block ${landscape ? "h-auto w-full" : "h-auto max-h-[100svh] w-auto max-w-full"}`}
      />
    </RevealOnView>
  );
}
