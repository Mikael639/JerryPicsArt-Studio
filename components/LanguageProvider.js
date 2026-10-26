"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LANG, LANG_COOKIE, normalizeLang } from "../lib/i18n";

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  isPending: false,
});

export function LanguageProvider({ initialLang = DEFAULT_LANG, children }) {
  const router = useRouter();
  const [lang, setLangState] = useState(() => normalizeLang(initialLang));
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback(
    (nextValue) => {
      const next = normalizeLang(nextValue);
      setLangState(next);
      try {
        window.localStorage.setItem(LANG_COOKIE, next);
      } catch {
        // Ignore storage errors
      }
      if (typeof document !== "undefined") {
        document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = next;
      }
      startTransition(() => {
        router.refresh();
      });
    },
    [router]
  );

  const value = useMemo(() => ({ lang, setLang, isPending }), [lang, setLang, isPending]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
