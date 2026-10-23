"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LIGHT_BACKGROUND = "#fafafa";
const DARK_BACKGROUND = "#0c0a08";

// Passage fluide du mode clair au mode sombre sur toutes les pages : le fond du site s'assombrit
// quand une section marquée data-theme-section="dark" arrive à l'écran, et s'éclaircit en remontant.
// (L'accueil gère ses propres sections.)
export default function ThemeScroll() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const triggers = [];
    document.querySelectorAll('[data-theme-section="dark"]').forEach((section) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom top",
          onEnter: () => {
            document.documentElement.dataset.theme = "dark";
            gsap.to(document.body, { backgroundColor: DARK_BACKGROUND, duration: 0.9, overwrite: true });
          },
          onLeaveBack: () => {
            delete document.documentElement.dataset.theme;
            gsap.to(document.body, { backgroundColor: LIGHT_BACKGROUND, duration: 0.9, overwrite: true });
          },
        })
      );
    });

    // La hauteur de la page change quand les images se chargent : on recalcule les positions.
    let refreshTimer = 0;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(document.body);
    window.addEventListener("load", scheduleRefresh);
    scheduleRefresh();

    return () => {
      window.clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      window.removeEventListener("load", scheduleRefresh);
      triggers.forEach((trigger) => trigger.kill());
      gsap.killTweensOf(document.body);
      gsap.set(document.body, { clearProps: "backgroundColor" });
      delete document.documentElement.dataset.theme;
    };
  }, [pathname]);

  return null;
}
