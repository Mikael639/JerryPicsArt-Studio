"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const EXIT_DELAY_MS = 260;
const FILE_PATTERN = /\.(pdf|zip|png|jpe?g|webp|svg|xml|txt)$/i;

// Sortie en fondu : au clic sur un lien interne, la page s'estompe puis la navigation démarre.
// L'entrée de la page suivante est gérée par app/template.js.
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  // La nouvelle page est affichée : on retire l'état « sortie ».
  useEffect(() => {
    document.documentElement.classList.remove("page-leaving");
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let timer = 0;

    const handleClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (FILE_PATTERN.test(url.pathname) || url.pathname.startsWith("/admin")) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      document.documentElement.classList.add("page-leaving");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => router.push(url.pathname + url.search + url.hash), EXIT_DELAY_MS);
    };

    // Phase de capture : s'exécute avant le lien Next.js, qui ignore alors le clic (defaultPrevented).
    document.addEventListener("click", handleClick, true);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", handleClick, true);
    };
  }, [router]);

  return null;
}
