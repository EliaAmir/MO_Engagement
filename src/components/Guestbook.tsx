"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { GuestbookStore, WISH_MAX, type WishEntry } from "@/lib/guestbook";

const easeLuxe = [0.16, 1, 0.3, 1] as const;

export default function Guestbook() {
  const { t, lang } = useLang();
  const [entries, setEntries] = useState<WishEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hydrate from localStorage after mount (browser-only, SSR-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(GuestbookStore.all());
  }, []);

  const remaining = WISH_MAX - message.length;
  const countLabel = useMemo(() => {
    const n = entries.length;
    if (n === 0) return null;
    return n === 1 ? t.guestbook.countOne : t.guestbook.countMany(n);
  }, [entries, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError(t.guestbook.requiredName);
    if (!message.trim()) return setError(t.guestbook.requiredMessage);
    setError(null);
    setSubmitting(true);
    window.setTimeout(() => {
      const entry = GuestbookStore.add({ name, message });
      setEntries((prev) => [entry, ...prev.filter((p) => p.id !== entry.id)]);
      setName("");
      setMessage("");
      setSubmitting(false);
    }, 550);
  };

  const locale = lang === "ar" ? "ar-EG" : "en-GB";

  return (
    <section id="guestbook" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            className="eyebrow mb-5"
          >
            {t.guestbook.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: easeLuxe }}
            className="text-gradient-gold font-display text-4xl font-semibold tracking-wide sm:text-5xl"
          >
            {t.guestbook.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: easeLuxe, delay: 0.1 }}
            className="mt-5 max-w-md font-serif text-lg italic text-mocha/70"
          >
            {t.guestbook.intro}
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: easeLuxe }}
          onSubmit={handleSubmit}
          noValidate
          className="panel mt-12 rounded-sm p-7 sm:p-9"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="gb-name" className="eyebrow text-[0.62rem] tracking-[0.28em]">
              {t.guestbook.nameLabel}
            </label>
            <input
              id="gb-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.guestbook.namePlaceholder}
              dir={lang === "ar" ? "rtl" : "ltr"}
              maxLength={60}
              className="border-b border-mocha/20 bg-transparent pb-3 pt-1 font-serif text-lg text-espresso placeholder:text-mocha/30 focus:border-old-gold focus:outline-none"
            />
          </div>

          <div className="mt-7 flex flex-col gap-2">
            <label htmlFor="gb-message" className="eyebrow text-[0.62rem] tracking-[0.28em]">
              {t.guestbook.messageLabel}
            </label>
            <textarea
              id="gb-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value.slice(0, WISH_MAX));
                if (error) setError(null);
              }}
              placeholder={t.guestbook.messagePlaceholder}
              dir={lang === "ar" ? "rtl" : "ltr"}
              rows={3}
              maxLength={WISH_MAX}
              className="resize-none border-b border-mocha/20 bg-transparent pb-3 pt-1 font-serif text-lg leading-relaxed text-espresso placeholder:text-mocha/30 focus:border-old-gold focus:outline-none"
            />
            <div className="flex items-center justify-between gap-3">
              <AnimatePresence>
                {error && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-serif text-sm text-old-gold"
                  >
                    {error}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="ms-auto font-serif text-xs text-mocha/40">
                {t.guestbook.charsLeft(remaining)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t.guestbook.submitting : t.guestbook.submit}
          </button>
        </motion.form>

        {/* Entries */}
        {countLabel && (
          <p className="mt-10 text-center font-display text-[0.66rem] uppercase tracking-[0.26em] text-mocha/50">
            {countLabel}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {entries.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 text-center font-serif text-base italic text-mocha/45"
              >
                {t.guestbook.empty}
              </motion.p>
            ) : (
              entries.map((e) => (
                <motion.article
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease: easeLuxe }}
                  className="panel rounded-sm p-6"
                >
                  <p
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    className="text-balance font-serif text-lg leading-relaxed text-espresso"
                  >
                    “{e.message}”
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-old-gold/40 font-display text-[0.6rem] uppercase tracking-widest text-old-gold">
                      {e.name.trim().charAt(0) || "·"}
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span
                        dir={lang === "ar" ? "rtl" : "ltr"}
                        className="font-display text-[0.66rem] uppercase tracking-[0.2em] text-espresso"
                      >
                        {e.name}
                      </span>
                      <time className="font-serif text-[0.7rem] text-mocha/45">
                        {new Date(e.timestamp).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
