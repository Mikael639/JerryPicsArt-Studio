import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, normalizeLang } from "./i18n";

export async function getServerLang() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(LANG_COOKIE)?.value;
    return normalizeLang(raw || DEFAULT_LANG);
  } catch {
    return DEFAULT_LANG;
  }
}
