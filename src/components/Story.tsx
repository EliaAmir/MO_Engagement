"use client";

import { motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";

const easeLuxe = [0.16, 1, 0.3, 1] as const;

export default function Story() {
  const { t, lang } = useLang();
  const closing = lang === "ar" ? EVENT.couple.ar : EVENT.couple.en;

  return (
    <section
      id="story"
      className="relative mx-auto max-w-4xl px-6 py-32 sm:py-40"
    >
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.9, ease: easeLuxe }}
          className="eyebrow mb-6"
        >
          {t.story.eyebrow}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: easeLuxe }}
          className="text-gradient-gold font-display text-3xl font-semibold leading-tight tracking-wide sm:text-4xl lg:text-5xl"
        >
          {t.story.title}
        </motion.h2>

        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1, ease: easeLuxe, delay: 0.2 }}
          className="hairline mt-10 h-px w-40 origin-center"
        />
      </div>

      <div className="mt-16 flex flex-col gap-14 sm:gap-20 lg:gap-24">
        {t.story.lines.map((line, i) => (
          <motion.p
            key={i}
            dir={lang === "ar" ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 1.1, ease: easeLuxe }}
            className={`text-balance font-serif text-mocha/85 ${
              i === t.story.lines.length - 1
                ? "text-2xl italic text-old-gold sm:text-3xl"
                : "text-2xl leading-relaxed sm:text-3xl lg:text-[2.1rem]"
            }`}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: easeLuxe }}
        className="mt-24 flex flex-col items-center gap-4"
      >
        <span className="font-display text-5xl text-old-gold">&amp;</span>
        <p className="text-gradient-gold text-shimmer font-display text-2xl font-semibold tracking-[0.12em] sm:text-3xl">
          {closing}
        </p>
      </motion.div>
    </section>
  );
}
