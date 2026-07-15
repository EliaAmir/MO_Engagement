"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { DRESS_CODE } from "@/lib/content";

const easeLuxe = [0.16, 1, 0.3, 1] as const;

export default function DressCode() {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section id="dress" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            className="eyebrow mb-5"
          >
            {t.dress.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: easeLuxe }}
            className="text-gradient-gold font-display text-4xl font-semibold tracking-wide sm:text-5xl"
          >
            {t.dress.title}
          </motion.h2>
          <motion.p
            dir={lang === "ar" ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: easeLuxe, delay: 0.1 }}
            className="text-balance mt-6 max-w-2xl font-serif text-lg italic leading-relaxed text-mocha/75"
          >
            {t.dress.note}
          </motion.p>
        </div>

        <div className="mt-16 flex flex-col gap-12">
          {DRESS_CODE.map((row, ri) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: easeLuxe, delay: ri * 0.05 }}
              className="flex flex-col gap-5"
            >
              <div className="flex items-center gap-4">
                <h3 className="font-display text-sm uppercase tracking-[0.28em] text-old-gold">
                  {row.label[lang]}
                </h3>
                <span className="hairline flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {row.colors.map((hex) => {
                  const isCopied = copied === hex;
                  return (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => copy(hex)}
                      aria-label={`${row.label[lang]} ${hex}`}
                      className="group relative aspect-[5/4] overflow-hidden rounded-sm border border-gold-light/20 transition-transform duration-500 hover:scale-[1.03] focus-visible:scale-[1.03]"
                      style={{ background: hex }}
                    >
                      <span className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between px-3 py-2 font-display text-[0.6rem] uppercase tracking-[0.2em] text-espresso opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <span>{isCopied ? "âœ“" : hex}</span>
                      </span>
                      {isCopied && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 grid place-items-center font-display text-xs uppercase tracking-[0.2em] text-espresso"
                          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
                        >
                          âœ“
                        </motion.span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center font-serif text-xs uppercase tracking-[0.24em] text-mocha/40">
          {t.dress.swatchLabel}
        </p>
      </div>
    </section>
  );
}
