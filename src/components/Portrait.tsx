"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";

const easeLuxe = [0.16, 1, 0.3, 1] as const;

/* Drop the couple's photo at public/couple.jpg (any aspect ratio; it is
   cropped to a 4:5 portrait). Change PHOTO_SRC if you use a different path. */
const PHOTO_SRC = "/couple.jpeg";

export default function Portrait() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Living, subtle parallax on the photo as the section travels through view.
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.18, 1.06]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const couple = lang === "ar" ? EVENT.couple.ar : EVENT.couple.en;

  return (
    <section ref={ref} id="portrait" className="relative px-6 py-24 sm:py-32">
      {/* faint watermark monogram */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[28vw] font-semibold leading-none text-old-gold/[0.05]"
      >
        &amp;
      </span>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.9, ease: easeLuxe }}
          className="eyebrow mb-8"
        >
          {t.portrait.eyebrow}
        </motion.span>

        {/* Framed portrait */}
        <motion.figure
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.3, ease: easeLuxe }}
          style={{ y: frameY }}
          className="relative w-full max-w-[20rem] sm:max-w-[24rem]"
        >
          <div
            className="relative rounded-[3px] p-3 sm:p-4"
            style={{
              background:
                "linear-gradient(160deg, var(--color-dark-choc), var(--color-onyx))",
              boxShadow:
                "0 50px 90px -40px rgba(0,0,0,0.65), 0 0 0 1px color-mix(in oklab, var(--color-old-gold) 45%, transparent)",
            }}
          >
            {/* inner mat + gold hairline */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-2 z-20 rounded-[2px] ring-1 ring-old-gold/40"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(170deg, color-mix(in oklab, var(--color-old-gold) 16%, transparent), transparent 45%, color-mix(in oklab, var(--color-jet) 55%, transparent))",
                }}
              />
              <motion.div
                style={{ scale: imgScale, y: imgY }}
                className="absolute inset-0"
              >
                <Image
                  src={PHOTO_SRC}
                  alt={t.portrait.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, 24rem"
                  className="object-cover"
                  priority={false}
                />
              </motion.div>

              {/* ornamental corners */}
              <FrameCorner className="left-1 top-1 z-30" />
              <FrameCorner className="right-1 top-1 z-30 rotate-90" />
              <FrameCorner className="bottom-1 left-1 z-30 -rotate-90" />
              <FrameCorner className="bottom-1 right-1 z-30 rotate-180" />
            </div>

            {/* monogram badge */}
            <div className="absolute -bottom-5 left-1/2 z-30 -translate-x-1/2">
              <span
                className="grid h-12 w-12 place-items-center rounded-full font-display text-xs tracking-[0.16em]"
                style={{
                  color: "var(--color-gold-light)",
                  background:
                    "linear-gradient(180deg, var(--color-dark-choc), var(--color-onyx))",
                  boxShadow:
                    "0 8px 20px -8px rgba(0,0,0,0.7), inset 0 0 0 1px color-mix(in oklab, var(--color-gold-shimmer) 60%, transparent)",
                }}
              >
                M&amp;O
              </span>
            </div>
          </div>
        </motion.figure>

        {/* quote + caption */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: easeLuxe, delay: 0.1 }}
          className="mt-12 flex flex-col items-center gap-4 text-center"
        >
          <span className="flex items-center gap-4">
            <span className="hairline w-10" />
            <span className="font-display text-lg text-old-gold">&amp;</span>
            <span className="hairline w-10" />
          </span>
          <p
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="text-balance max-w-xl font-serif text-xl italic leading-relaxed text-espresso sm:text-2xl"
          >
            {t.portrait.quote}
          </p>
          <p
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="font-display text-[0.66rem] uppercase tracking-[0.3em] text-mocha/60"
          >
            {couple} · {EVENT.dateShort[lang]}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FrameCorner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-4 w-4 ${className ?? ""}`}
      style={{
        borderTop: "1.5px solid color-mix(in oklab, var(--color-old-gold) 70%, transparent)",
        borderLeft: "1.5px solid color-mix(in oklab, var(--color-old-gold) 70%, transparent)",
      }}
    />
  );
}
