"use client";

import Link from "next/link";
import { trackEvent } from "../../lib/analytics";

const FILE_PATTERN = /\.(pdf|zip|docx?)$/i;

// Lien qui envoie un évènement de mesure au clic (sans cookie).
// Les fichiers (PDF…) sont servis par un lien classique, pas par la navigation Next.js.
export default function TrackedLink({ event, eventData, onClick, children, href, ...props }) {
  const handleClick = (clickEvent) => {
    if (event) trackEvent(event, eventData);
    onClick?.(clickEvent);
  };

  if (typeof href === "string" && FILE_PATTERN.test(href)) {
    return (
      <a {...props} href={href} download onClick={handleClick}>
        {children}
      </a>
    );
  }

  return (
    <Link {...props} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
