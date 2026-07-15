"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { clampExtraGuests, RSVPStore, type RsvpEntry } from "@/lib/rsvp";

const easeLuxe = [0.16, 1, 0.3, 1] as const;
const EXTRA_MAX = 3;

export default function Rsvp() {
  const { t, lang } = useLang();
  const [name, setName] = useState("");
  const [extra, setExtra] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState<RsvpEntry | null>(null);

  // Restore a previous response on mount.
  useEffect(() => {
    const entries = RSVPStore.all();
    if (entries.length > 0) {
      const latest = entries[0];
      // Restore a previous response after mount (browser-only, SSR-safe).
      /* eslint-disable react-hooks/set-state-in-effect */
      setSaved(latest);
      setName(latest.name);
      setExtra(clampExtraGuests(latest.totalGuests - 1));
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t.rsvp.requiredName);
      return;
    }
    setError(null);
    setSubmitting(true);
    // Brief delay for the tactile "saving" beat.
    window.setTimeout(() => {
      const entry = RSVPStore.add({ name: trimmed, extraGuests: extra });
      setSaved(entry);
      setSubmitting(false);
    }, 650);
  };

  const edit = () => setSaved(null);

  const total = 1 + extra;

  return (
    <section id="rsvp" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            className="eyebrow mb-5"
          >
            {t.rsvp.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: easeLuxe }}
            className="text-gradient-gold font-display text-4xl font-semibold tracking-wide sm:text-5xl"
          >
            {t.rsvp.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: easeLuxe, delay: 0.1 }}
            className="mt-5 max-w-md font-serif text-lg italic text-mocha/70"
          >
            {t.rsvp.intro}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease: easeLuxe }}
              className="panel mt-12 rounded-sm p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold-shimmer/60"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="var(--color-gold-shimmer)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <p
                dir={lang === "ar" ? "rtl" : "ltr"}
                className="mx-auto mt-6 max-w-md text-balance font-serif text-xl leading-relaxed text-espresso"
              >
                {t.rsvp.confirmation(saved.name, saved.totalGuests)}
              </p>
              <button type="button" onClick={edit} className="btn-ghost mt-8">
                {t.rsvp.edit}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease: easeLuxe }}
              onSubmit={handleSubmit}
              className="panel mt-12 rounded-sm p-8 sm:p-10"
              noValidate
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="rsvp-name"
                  className="eyebrow text-[0.62rem] tracking-[0.28em]"
                >
                  {t.rsvp.nameLabel}
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={t.rsvp.namePlaceholder}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  aria-invalid={!!error}
                  aria-describedby={error ? "rsvp-error" : undefined}
                  className="border-b border-gold-light/30 bg-transparent pb-3 pt-1 font-serif text-lg text-espresso placeholder:text-mocha/30 focus:border-gold-shimmer focus:outline-none"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    id="rsvp-error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 font-serif text-sm text-old-gold"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Guest counter */}
              <div className="mt-9">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="eyebrow text-[0.62rem] tracking-[0.28em]">
                      {t.rsvp.guestsLabel}
                    </span>
                    <span className="font-serif text-xs text-mocha/45">
                      {t.rsvp.guestsHint}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <CounterButton
                      direction="dec"
                      disabled={extra <= 0}
                      onClick={() => setExtra((v) => clampExtraGuests(v - 1))}
                      label={lang === "ar" ? "ØªÙ‚Ù„ÙŠÙ„" : "Decrease guests"}
                    />
                    <motion.span
                      key={extra}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-8 text-center font-display text-2xl text-old-gold"
                    >
                      {extra}
                    </motion.span>
                    <CounterButton
                      direction="inc"
                      disabled={extra >= EXTRA_MAX}
                      onClick={() => setExtra((v) => clampExtraGuests(v + 1))}
                      label={lang === "ar" ? "Ø²ÙŠØ§Ø¯Ø©" : "Increase guests"}
                    />
                  </div>
                </div>

                {/* total preview */}
                <p className="mt-4 font-serif text-sm text-mocha/50">
                  {total} {lang === "ar" ? "Ù…Ù‚Ø¹Ø¯" : "seat" + (total === 1 ? "" : "s")}
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold mt-10 w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? t.rsvp.submitting : t.rsvp.submit}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function CounterButton({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: "inc" | "dec";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-gold-light/40 text-espresso transition-all hover:border-gold-shimmer hover:text-old-gold disabled:cursor-not-allowed disabled:opacity-30"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d={direction === "inc" ? "M12 5v14M5 12h14" : "M5 12h14"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
