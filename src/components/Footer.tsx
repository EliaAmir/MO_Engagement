"use client";

import { motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";
import { scrollToTarget } from "@/components/SmoothScroll";

const easeLuxe = [0.16, 1, 0.3, 1] as const;

export default function Footer() {
  const { t, lang } = useLang();
  const couple = lang === "ar" ? EVENT.couple.ar : EVENT.couple.en;

  return (
    <footer className="relative overflow-hidden px-6 pb-32 pt-24 sm:pb-36">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: easeLuxe }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center"
      >
        <span className="font-display text-4xl text-old-gold">&amp;</span>

        <h2
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="text-gradient-gold text-shimmer font-display text-3xl font-semibold tracking-[0.08em] sm:text-4xl"
        >
          {couple}
        </h2>

        <div className="flex items-center gap-4">
          <span className="hairline w-16" />
          <span className="font-display text-xs uppercase tracking-[0.3em] text-mocha/60">
            {EVENT.dateLong[lang]}
          </span>
          <span className="hairline w-16" />
        </div>

        <p className="font-serif text-base italic text-mocha/60">{t.footer.madeWith}</p>

        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="group mt-2 inline-flex items-center gap-2 font-display text-[0.66rem] uppercase tracking-[0.26em] text-mocha/50 transition-colors hover:text-old-gold"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-500 group-hover:-translate-y-1"
          >
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.footer.backToTop}
        </button>

        <p className="mt-2 font-serif text-[0.7rem] uppercase tracking-[0.24em] text-mocha/30">
          {t.footer.rights}
        </p>
      </motion.div>
    </footer>
  );
}
