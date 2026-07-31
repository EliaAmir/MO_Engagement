"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { GuestbookStore, type WishEntry } from "@/lib/guestbook";

const easeLuxe = [0.16, 1, 0.3, 1] as const;
const WISH_FORM_URL = "https://forms.gle/mAHyjyQmh1PLxxT86";

export default function Guestbook() {
  const { t, lang } = useLang();
  const [entries, setEntries] = useState<WishEntry[]>([]);

  useEffect(() => {
    // Hydrate from localStorage after mount (browser-only, SSR-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(GuestbookStore.all());
  }, []);

  const countLabel = useMemo(() => {
    const n = entries.length;
    if (n === 0) return null;
    return n === 1 ? t.guestbook.countOne : t.guestbook.countMany(n);
  }, [entries, t]);

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

        {/* Form button */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: easeLuxe }}
          className="panel mt-12 rounded-sm p-7 text-center sm:p-9"
        >
          <a
            href={WISH_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="btn-gold inline-block w-full text-center"
          >
            {t.guestbook.formButton}
          </a>
          <p className="mt-4 font-serif text-sm text-mocha/50">
            {t.guestbook.formNote}
          </p>
        </motion.div>

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
