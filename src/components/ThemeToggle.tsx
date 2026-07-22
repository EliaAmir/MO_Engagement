"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";

type Theme = "light" | "dark";

const KEY = "mo_theme_v1";

export default function ThemeToggle() {
  const { lang } = useLang();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current =
      (document.documentElement.dataset.theme as Theme | undefined) ?? "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  const isDark = theme === "dark";
  const label = isDark
    ? lang === "ar"
      ? "الوضع الفاتح"
      : "Light mode"
    : lang === "ar"
      ? "الوضع الداكن"
      : "Dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-gold-light/40 text-gold-light transition-all hover:border-gold-shimmer hover:text-gold-shimmer"
    >
      {isDark ? (
        // sun — click to go light
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
          <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
          </g>
        </svg>
      ) : (
        // moon — click to go dark
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20 13.2A8 8 0 1 1 10.8 4a6.3 6.3 0 0 0 9.2 9.2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
