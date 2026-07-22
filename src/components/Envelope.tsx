"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";

const easeLuxe = [0.16, 1, 0.3, 1] as const;
const PHOTO_SRC = "/couple.jpeg";
const OPEN_AT = 0.6;

export default function Envelope() {
  const { t, lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    // Browser-only media query; resolved after mount so SSR output stays stable.
    /* eslint-disable react-hooks/set-state-in-effect */
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.6,
  });

  /* Side flaps part first, then the top/bottom caps — a letter folded in
     quarters, opening outward from the centre crease. */
  const sideRotate = useTransform(p, [0.08, 0.44], [0, 104]);
  const sideRotateNeg = useTransform(p, [0.08, 0.44], [0, -104]);
  const sideFade = useTransform(p, [0.3, 0.48], [1, 0]);
  const capRotate = useTransform(p, [0.36, 0.7], [0, 104]);
  const capRotateNeg = useTransform(p, [0.36, 0.7], [0, -104]);
  const capFade = useTransform(p, [0.58, 0.74], [1, 0]);

  const sealScale = useTransform(p, [0, 0.1, 0.2], [1, 1.18, 0.4]);
  const sealOpacity = useTransform(p, [0, 0.08, 0.18], [1, 1, 0]);

  const letterOpacity = useTransform(p, [0.42, 0.62], [0, 1]);
  const letterScale = useTransform(p, [0.42, 0.86], [0.94, 1]);

  const hintOpacity = useTransform(p, [0, 0.05, 0.12], [0.95, 0.95, 0]);
  const hintY = useTransform(p, [0, 0.12], [0, 12]);

  /* ---- Signal the MusicPlayer once the letter is open (exactly once) ---- */
  const openedRef = useRef(false);
  const fireOpened = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    window.dispatchEvent(new Event("mo:invite-opened"));
  }, []);

  useMotionValueEvent(p, "change", (v) => {
    if (!reduce && v >= OPEN_AT) fireOpened();
  });

  useEffect(() => {
    if (reduce) fireOpened();
  }, [reduce, fireOpened]);

  const couple = lang === "ar" ? EVENT.couple.ar : EVENT.couple.en;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <section
      ref={sectionRef}
      id="envelope"
      aria-label={t.preloader.enter}
      className={reduce ? "relative" : "relative h-[320vh]"}
    >
      <div
        className={
          reduce
            ? "relative grid min-h-dvh place-items-center overflow-hidden px-6 py-24"
            : "sticky top-0 grid h-dvh place-items-center overflow-hidden"
        }
      >
        {/* ambient champagne glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in oklab, var(--color-warm-taupe) 42%, transparent), transparent 70%)",
          }}
        />

        {/* ---- The letter ---- */}
        <motion.div
          style={reduce ? undefined : { opacity: letterOpacity, scale: letterScale }}
          initial={reduce ? { opacity: 0 } : undefined}
          animate={reduce ? { opacity: 1 } : undefined}
          transition={reduce ? { duration: 0.8, ease: easeLuxe } : undefined}
          className="relative z-10 w-full px-5 sm:px-8"
        >
          <div
            dir={dir}
            className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-14"
          >
            {/* photo */}
            <figure className="relative mx-auto aspect-[4/5] h-[26dvh] w-auto lg:h-auto lg:w-full">
              <div
                className="relative h-full w-full overflow-hidden rounded-[3px]"
                style={{ boxShadow: "var(--surface-card-edge)" }}
              >
                <Image
                  src={PHOTO_SRC}
                  alt={t.envelope.photoAlt}
                  fill
                  sizes="(max-width: 1024px) 60vw, 32vw"
                  className="object-cover"
                  loading="eager"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(170deg, color-mix(in oklab, var(--color-old-gold) 14%, transparent), transparent 45%, color-mix(in oklab, var(--color-jet) 40%, transparent))",
                  }}
                />
              </div>
            </figure>

            {/* copy */}
            <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:gap-4 lg:text-start">
              <p className="font-serif text-[0.9rem] italic leading-snug text-mocha/75">
                {t.envelope.cardEyebrow}
              </p>
              <p className="font-display text-[0.72rem] uppercase tracking-[0.3em] text-old-gold sm:text-[0.78rem]">
                {t.envelope.cardHeadline}
              </p>

              <span className="font-display text-[0.68rem] uppercase tracking-[0.26em] text-mocha/65 sm:text-xs">
                {t.envelope.cardTo}
              </span>
              <h2
                className="text-balance font-display text-[2.4rem] font-semibold leading-[1.05] tracking-[0.03em] sm:text-[3.2rem] lg:text-[3.8rem]"
                style={{
                  background:
                    "linear-gradient(100deg, var(--color-gold-shimmer), var(--color-old-gold) 50%, var(--color-gold-shimmer))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {couple}
              </h2>

              <span className="flex w-full items-center gap-3 py-1">
                <span className="hairline flex-1" />
                <span className="font-display text-base text-old-gold">&amp;</span>
                <span className="hairline flex-1" />
              </span>

              <p className="text-balance font-serif text-[1rem] leading-relaxed text-mocha/90 sm:text-[1.1rem]">
                {t.envelope.cardBody}
              </p>
              <p className="font-display text-[0.66rem] uppercase tracking-[0.2em] text-mocha/70 sm:text-[0.7rem]">
                {t.envelope.cardSignoff}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---- Folding paper panels ---- */}
        {!reduce && (
          <div aria-hidden className="perspective-far pointer-events-none absolute inset-0 z-20">
            <div className="preserve-3d relative h-full w-full">
              {/* top cap */}
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2 origin-top"
                style={{
                  rotateX: capRotateNeg,
                  opacity: capFade,
                  background: "var(--surface-envelope)",
                  boxShadow:
                    "inset 0 -1px 0 color-mix(in oklab, var(--color-old-gold) 45%, transparent)",
                }}
              />
              {/* bottom cap */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom"
                style={{
                  rotateX: capRotate,
                  opacity: capFade,
                  background: "var(--surface-envelope)",
                  boxShadow:
                    "inset 0 1px 0 color-mix(in oklab, var(--color-old-gold) 45%, transparent)",
                }}
              />
              {/* left flap */}
              <motion.div
                className="absolute inset-y-0 left-0 z-10 w-1/2 origin-left"
                style={{
                  rotateY: sideRotate,
                  opacity: sideFade,
                  background: "var(--surface-envelope-2)",
                  boxShadow:
                    "inset -1px 0 0 color-mix(in oklab, var(--color-old-gold) 45%, transparent)",
                }}
              />
              {/* right flap */}
              <motion.div
                className="absolute inset-y-0 right-0 z-10 w-1/2 origin-right"
                style={{
                  rotateY: sideRotateNeg,
                  opacity: sideFade,
                  background: "var(--surface-envelope-2)",
                  boxShadow:
                    "inset 1px 0 0 color-mix(in oklab, var(--color-old-gold) 45%, transparent)",
                }}
              />

              {/* monogram seal at the meeting point of the four folds */}
              <motion.div
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ scale: sealScale, opacity: sealOpacity }}
              >
                <div
                  className="grid place-items-center rounded-full"
                  style={{
                    width: 92,
                    height: 92,
                    background: "var(--surface-seal)",
                    boxShadow:
                      "0 10px 26px -8px rgba(0,0,0,0.6), inset 0 0 0 2px color-mix(in oklab, var(--color-gold-shimmer) 60%, transparent)",
                  }}
                >
                  <span className="font-display text-base tracking-[0.14em] text-cream/90">
                    {t.envelope.sealLabel}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* scroll hint */}
        {!reduce && (
          <motion.div
            style={{ opacity: hintOpacity, y: hintY }}
            className="pointer-events-none absolute inset-x-0 bottom-[10%] z-30 flex flex-col items-center gap-3"
          >
            <span className="eyebrow">{t.envelope.hint}</span>
            <motion.span
              aria-hidden
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-old-gold"
            >
              <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
                <path
                  d="M9 1v25M9 26l-7-7M9 26l7-7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
