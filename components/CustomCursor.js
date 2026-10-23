"use client";

import { useEffect, useRef, useState, useSyncExternalStore, useCallback } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const interactiveSelector = [
  "a[href]",
  "button",
  "[role='button']",
  "summary",
  "label[for]",
  "input[type='submit']",
  "input[type='button']",
  "input[type='checkbox']",
  "input[type='radio']",
].join(", ");

const textInputSelector = [
  "input:not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio'])",
  "textarea",
  "[contenteditable='true']",
].join(", ");

const galleryItemSelector = "[data-cursor='gallery-item']";
const darkSurfaceSelector = "[data-cursor-surface='dark'], [data-theme-section='dark'], .dark-chapter, footer";

let colorProbeContext = null;
let darkCache = { target: null, result: false, time: 0 };

// Normalise n'importe quelle couleur CSS (rgb, oklab...) en [r, g, b, a] via un canvas 1x1.
function parseCssColor(value) {
  if (!colorProbeContext) {
    colorProbeContext = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    colorProbeContext.canvas.width = 1;
    colorProbeContext.canvas.height = 1;
  }

  colorProbeContext.clearRect(0, 0, 1, 1);
  colorProbeContext.fillStyle = "#000";
  colorProbeContext.fillStyle = value;
  colorProbeContext.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = colorProbeContext.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

// Remonte les parents jusqu'au premier fond assez opaque et dit s'il est sombre.
function isDarkBackground(target) {
  const now = performance.now();
  if (darkCache.target === target && now - darkCache.time < 250) {
    return darkCache.result;
  }

  let result = false;
  for (let node = target; node instanceof Element; node = node.parentElement) {
    const color = getComputedStyle(node).backgroundColor;
    if (!color || color === "transparent") continue;

    const [r, g, b, a] = parseCssColor(color);
    if (a < 0.5) continue;

    result = (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
    break;
  }

  darkCache = { target, result, time: now };
  return result;
}

function isOnDarkSurface(target) {
  if (target.closest(".theme-default")) {
    return isDarkBackground(target);
  }
  return Boolean(target.closest(darkSurfaceSelector)) || isDarkBackground(target);
}

function getCursorMode(target) {
  if (!(target instanceof Element)) {
    return "default";
  }

  if (target.closest(textInputSelector)) {
    return "hidden";
  }

  if (target.closest(galleryItemSelector)) {
    return "gallery-item";
  }

  if (isOnDarkSurface(target)) {
    return target.closest(interactiveSelector) ? "dark-interactive" : "dark-default";
  }

  if (target.closest(interactiveSelector)) {
    return "interactive";
  }

  return "default";
}

function subscribeToFinePointerQuery(onStoreChange) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getFinePointerSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function useEvent(handler) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });
  return useCallback((...args) => {
    return handlerRef.current?.(...args);
  }, []);
}

export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [cursorMode, setCursorMode] = useState("default");
  const [isTemporarilyPaused, setIsTemporarilyPaused] = useState(false);

  const stateRef = useRef(cursorMode);
  const resizeTimeoutRef = useRef(null);
  const pointerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const supportsFinePointer = useSyncExternalStore(subscribeToFinePointerQuery, getFinePointerSnapshot, () => false);
  const isEnabled = supportsFinePointer && !reduceMotion;
  const isCursorActive = isEnabled && !isTemporarilyPaused;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Ressort ultra-réactif et léger
  const springX = useSpring(x, { stiffness: 800, damping: 40, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 800, damping: 40, mass: 0.1 });

  const syncCursorState = useEvent((target) => {
    const nextState = getCursorMode(target);
    const currentState = stateRef.current;

    if (currentState === nextState) {
      return;
    }

    stateRef.current = nextState;
    setCursorMode(nextState);
  });

  const handlePointerMove = useEvent((event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;

    if (isTemporarilyPaused) {
      setIsTemporarilyPaused(false);
    }

    x.set(event.clientX);
    y.set(event.clientY);
    pointerRef.current = { x: event.clientX, y: event.clientY };

    if (!isVisible) {
      setIsVisible(true);
    }
    syncCursorState(event.target);
  });

  const handlePointerDown = useEvent((event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    setIsPressed(true);
    syncCursorState(event.target);
  });

  const handlePointerUp = useEvent((event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    setIsPressed(false);
    syncCursorState(event.target);
  });

  const handlePointerLeave = useEvent(() => {
    setIsVisible(false);
    setIsPressed(false);
    stateRef.current = "default";
    setCursorMode("default");
  });

  const pauseCursorAfterViewportChange = useEvent(() => {
    setIsTemporarilyPaused(true);
    setIsVisible(false);
    setIsPressed(false);
    stateRef.current = "default";
    setCursorMode("default");

    if (resizeTimeoutRef.current) {
      window.clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = window.setTimeout(() => {
      setIsTemporarilyPaused(false);
    }, 450);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("has-custom-cursor", isCursorActive);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [isCursorActive]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleWindowMouseOut = (event) => {
      if (!event.relatedTarget && !event.toElement) {
        handlePointerLeave();
      }
    };

    // Le fond peut changer sous une souris immobile (défilement, transition de couleur du body).
    const resyncUnderPointer = () => {
      const pointer = pointerRef.current;
      if (!pointer) return;
      darkCache.target = null;
      syncCursorState(document.elementFromPoint(pointer.x, pointer.y));
    };

    const handleScroll = () => {
      resyncUnderPointer();
      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(resyncUnderPointer, 1200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("blur", handlePointerLeave);
    window.addEventListener("mouseout", handleWindowMouseOut);
    window.addEventListener("resize", pauseCursorAfterViewportChange);
    window.addEventListener("orientationchange", pauseCursorAfterViewportChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("resize", pauseCursorAfterViewportChange);
      window.removeEventListener("orientationchange", pauseCursorAfterViewportChange);
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isEnabled]);

  if (!isCursorActive) return null;

  const isDarkSurface = cursorMode.startsWith("dark-");
  const isInteractive = cursorMode === "interactive" || cursorMode === "dark-interactive";
  const isGalleryItem = cursorMode === "gallery-item";
  const shouldHide = !isVisible || cursorMode === "hidden";

  const cursorSize = isGalleryItem ? 84 : isInteractive ? 48 : 24;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        opacity: shouldHide ? 0 : 1,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.2,
        ease: "easeOut",
      }}
    >
      <motion.div
        className={`flex items-center justify-center rounded-full border shadow-sm backdrop-blur-[6px] ${
          isDarkSurface
            ? "border-white/70 bg-white/15 shadow-white/10"
            : "border-ink/40 bg-ink/8"
        }`}
        animate={{
          width: cursorSize,
          height: cursorSize,
          scale: isPressed ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 24,
          mass: 0.15,
        }}
      >
        {isGalleryItem && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={`font-bold text-[10px] tracking-[0.2em] leading-none uppercase ${
              isDarkSurface ? "text-white" : "text-ink"
            }`}
          >
            VOIR
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
