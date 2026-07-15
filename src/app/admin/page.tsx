"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import {
  ADMIN_PASSWORD,
  RSVPStore,
  type RsvpEntry,
} from "@/lib/rsvp";

const AUTH_KEY = "mo_admin_auth_v1";
const easeLuxe = [0.16, 1, 0.3, 1] as const;

export default function AdminPage() {
  const { t, lang } = useLang();

  return (
    <main className="relative min-h-dvh px-5 py-12 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in oklab, var(--color-warm-taupe) 40%, transparent), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-gold-light/15 pb-6">
          <div>
            <p className="eyebrow mb-2">{t.admin.subtitle}</p>
            <h1 className="text-gradient-gold font-display text-3xl font-semibold tracking-wide sm:text-4xl">
              {t.admin.title}
            </h1>
          </div>
          <Link
            href="/"
            className="btn-ghost"
          >
            {t.admin.backHome}
          </Link>
        </header>

        <Gate>
          <Dashboard lang={lang} />
        </Gate>
      </div>
    </main>
  );
}

/* ----------------------------- Auth gate ------------------------------- */
function Gate({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  const [authed, setAuthed] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      // One-shot read of sessionStorage after mount (browser-only, SSR-safe).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (sessionStorage.getItem(AUTH_KEY) === "1") setAuthed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        /* ignore */
      }
    } else {
      setError(true);
    }
  };

  if (authed) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeLuxe }}
      className="panel mx-auto mt-10 max-w-sm rounded-sm p-9 text-center"
    >
      <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-gold-light/40">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="10" width="16" height="11" rx="2" stroke="var(--color-gold-shimmer)" strokeWidth="1.4" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="var(--color-gold-shimmer)" strokeWidth="1.4" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-semibold text-espresso">{t.admin.lockedTitle}</h2>
      <p className="mt-2 font-serif text-sm text-mocha/60">{t.admin.lockedHint}</p>

      <form onSubmit={submit} className="mt-7 flex flex-col gap-3">
        <label htmlFor="admin-pass" className="sr-only">
          {t.admin.passwordLabel}
        </label>
        <input
          id="admin-pass"
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          placeholder={t.admin.passwordPlaceholder}
          aria-invalid={error}
          autoComplete="off"
          className="rounded-sm border border-gold-light/30 bg-white/5 px-4 py-3 text-center font-display text-sm tracking-[0.3em] text-espresso placeholder:tracking-normal placeholder:font-serif placeholder:text-mocha/30 focus:border-gold-shimmer focus:outline-none"
        />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="font-serif text-sm text-old-gold"
            >
              {t.admin.wrongPassword}
            </motion.p>
          )}
        </AnimatePresence>
        <button type="submit" className="btn-gold mt-1">
          {t.admin.enter}
        </button>
      </form>
    </motion.div>
  );
}

/* ----------------------------- Dashboard ------------------------------- */
function Dashboard({ lang }: { lang: "en" | "ar" }) {
  const { t } = useLang();
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState(false);

  const refresh = () => setEntries(RSVPStore.all());

  useEffect(() => {
    // Hydrate from localStorage after mount (browser-only, SSR-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [entries, query]);

  const stats = useMemo(
    () => ({
      count: entries.length,
      guests: entries.reduce((s, e) => s + e.totalGuests, 0),
    }),
    [entries],
  );

  const exportCsv = () => {
    const csv = RSVPStore.toCsv();
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvp-marina-onur.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteOne = (id: string) => {
    RSVPStore.remove(id);
    refresh();
  };

  const clearAll = () => {
    RSVPStore.clear();
    refresh();
    setConfirming(false);
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    if (typeof window !== "undefined") window.location.reload();
  };

  const locale = lang === "ar" ? "ar-EG" : "en-GB";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeLuxe }}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Stat value={stats.count} label={t.admin.statRsvp} />
        <Stat value={stats.guests} label={t.admin.statGuests} />
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[12rem] flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.admin.searchPlaceholder}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="w-full rounded-sm border border-gold-light/25 bg-white/5 px-4 py-2.5 font-serif text-sm text-espresso placeholder:text-mocha/30 focus:border-gold-shimmer focus:outline-none"
          />
        </div>
        <button type="button" onClick={exportCsv} className="btn-ghost py-2.5">
          {t.admin.exportCsv}
        </button>
        {confirming ? (
          <span className="flex items-center gap-2">
            <span className="hidden font-serif text-xs text-mocha/70 sm:inline">
              {t.admin.confirmClear}
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-sm border border-gold-shimmer/60 px-3 py-2 font-display text-[0.66rem] uppercase tracking-[0.18em] text-old-gold"
            >
              {t.admin.clearAll}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-sm border border-gold-light/25 px-3 py-2 font-display text-[0.66rem] uppercase tracking-[0.18em] text-mocha/70"
            >
              {t.admin.cancel}
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={entries.length === 0}
            className="btn-ghost py-2.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.admin.clearAll}
          </button>
        )}
        <button type="button" onClick={logout} className="btn-ghost py-2.5">
          {t.admin.logout}
        </button>
      </div>

      {/* Table */}
      <div className="panel mt-6 overflow-hidden rounded-sm">
        {filtered.length === 0 ? (
          <p className="px-6 py-16 text-center font-serif text-sm text-mocha/50">
            {t.admin.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="border-b border-gold-light/15 text-start">
                  <Th>{t.admin.colName}</Th>
                  <Th>{t.admin.colGuests}</Th>
                  <Th>{t.admin.colWhen}</Th>
                  <Th>{t.admin.colActions}</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-gold-light/8 transition-colors last:border-0 hover:bg-old-gold/10"
                  >
                    <td className="px-5 py-4 align-middle">
                      <span
                        dir={lang === "ar" ? "rtl" : "ltr"}
                        className="font-serif text-base text-espresso"
                      >
                        {e.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <span className="inline-grid h-7 min-w-7 place-items-center rounded-full border border-gold-light/30 px-2 font-display text-xs text-old-gold">
                        {e.totalGuests}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle font-serif text-xs text-mocha/55">
                      {new Date(e.timestamp).toLocaleString(locale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-5 py-4 text-end align-middle">
                      <button
                        type="button"
                        onClick={() => deleteOne(e.id)}
                        className="font-display text-[0.62rem] uppercase tracking-[0.18em] text-mocha/40 transition-colors hover:text-old-gold"
                      >
                        {t.admin.deleteOne}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="panel rounded-sm p-6 text-center">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeLuxe }}
        className="block text-gradient-gold font-display text-4xl font-semibold tabular-nums sm:text-5xl"
      >
        {value}
      </motion.span>
      <span className="mt-2 block font-display text-[0.62rem] uppercase tracking-[0.26em] text-mocha/60">
        {label}
      </span>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-start font-display text-[0.6rem] uppercase tracking-[0.24em] text-old-gold/80">
      {children}
    </th>
  );
}
