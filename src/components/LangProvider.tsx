"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { CONTENT, type Dict, type Lang, langDir } from "@/lib/content";

const STORAGE_KEY = "mo_lang_v1";
const LANG_EVENT = "mo:lang-change";

/* Module-level store so every mounted LangProvider shares one source of
   truth and stays in sync with localStorage + cross-tab changes. */
let currentLang: Lang = "en";

function readBrowserLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") return stored;
  } catch {
    /* ignore */
  }
  const nav = window.navigator.language?.toLowerCase() ?? "";
  return nav.startsWith("ar") ? "ar" : "en";
}

function subscribe(callback: () => void): () => void {
  currentLang = readBrowserLang();
  const onChange = () => {
    currentLang = readBrowserLang();
    callback();
  };
  window.addEventListener(LANG_EVENT, callback);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LANG_EVENT, callback);
    window.removeEventListener("storage", onChange);
  };
}

const getSnapshot = (): Lang => currentLang;
const getServerSnapshot = (): Lang => "en";

type LangContextValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Reflect the active language onto <html lang/dir> and persist it.
  useEffect(() => {
    const dir = langDir(lang);
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    currentLang = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(LANG_EVENT));
  }, []);

  const toggle = useCallback(() => {
    setLang(currentLang === "en" ? "ar" : "en");
  }, [setLang]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      dir: langDir(lang),
      t: CONTENT[lang],
      setLang,
      toggle,
    }),
    [lang, setLang, toggle],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return ctx;
}
