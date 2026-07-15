"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";
import { scrollToTarget } from "@/components/SmoothScroll";

const easeLuxe = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const couple = lang === "ar" ? EVENT.couple.ar : EVENT.couple.en;
  const [first, second] = couple.split(/\s*&\s*/);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.1, ease: easeLuxe },
    },
  };

  return (
    <section
      ref={ref}
      id="top"
      className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-28"
    >
      {/* parallax glow */}
      <motion.div
        aria-hidden
        style={{ y, scale }}
        className="pointer-events-none absolute inset-0"
      >
        <div
              className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--color-warm-taupe) 42%, transparent), transparent 60%)",
              }}
        />
      </motion.div>

      {/* floating gilded rings */}
      <motion.div
        aria-hidden
        style={{ opacity: fade }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="h-[78vmin] w-[78vmin] rounded-full border border-gold-light/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute inset-10 rounded-full border border-gold-light/[0.07]"
        />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        style={{ opacity: fade }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.span variants={item} className="eyebrow mb-8">
          {t.hero.eyebrow}
        </motion.span>

        <div className="flex flex-col items-center gap-3 sm:gap-5">
          <motion.h1
            variants={item}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="text-gradient-gold text-shimmer font-display text-[15vw] font-semibold leading-[0.92] tracking-[0.02em] sm:text-[12vw] lg:text-[8.5rem]"
          >
            {first}
          </motion.h1>

          <motion.div variants={item} className="my-1 flex items-center gap-5">
            <span className="hairline w-12 sm:w-20" />
            <span className="font-serif text-3xl italic text-old-gold sm:text-4xl">
              &amp;
            </span>
            <span className="hairline w-12 sm:w-20" />
          </motion.div>

          <motion.h1
            variants={item}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="text-gradient-gold text-shimmer font-display text-[15vw] font-semibold leading-[0.92] tracking-[0.02em] sm:text-[12vw] lg:text-[8.5rem]"
          >
            {second}
          </motion.h1>
        </div>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-3 sm:gap-4"
        >
          <p className="font-display text-xs uppercase tracking-[0.32em] text-mocha/75 sm:text-sm">
            {EVENT.type[lang]}
          </p>
          <p className="font-serif text-lg italic text-old-gold sm:text-xl">
            {EVENT.dateLong[lang]}
          </p>
          <p className="font-serif text-base text-mocha/70">
            {EVENT.time[lang]} Â· {EVENT.venue[lang]}
          </p>
        </motion.div>

        <motion.button
          variants={item}
          type="button"
          onClick={() => scrollToTarget("#rsvp")}
          className="btn-gold mt-12"
        >
          {t.nav.rsvp}
        </motion.button>
      </motion.div>
    </section>
  );
}
