"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";

const easeLuxe = [0.16, 1, 0.3, 1] as const;
const PHOTO_SRC = "/couple.jpeg";
const OPEN_AT = 0.05;

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

  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.6,
  });

  /* All four panels part together as you scroll — the letter unfolds
      outward from the centre cross in a single continuous motion, not in
      two separate left/right then top/bottom stages. */
  const flapOpen: [number, number] = [0.05, 0.5];
  const rotate = useTransform(p, flapOpen, [0, 104]);
  const rotateNeg = useTransform(p, flapOpen, [0, -104]);
  const flapFade = useTransform(p, [0.4, 0.52], [1, 0]);

  const sealScale = useTransform(p, [0, 0.06, 0.16], [1, 1.2, 0.45]);
  const sealOpacity = useTransform(p, [0, 0.05, 0.15], [1, 1, 0]);

  const fadeIn = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const fadeOut = useTransform(exitProgress, [0.6, 1], [1, 0]);
  const letterOpacity = useTransform([fadeIn, fadeOut], (v: number[]) => Math.min(v[0], v[1]));
  const letterScale = useTransform(scrollYProgress, [0.2, 0.92], [0.94, 1]);
  const blurOpacity = useTransform(exitProgress, [0.6, 0.85], [0, 1]);

  const hintOpacity = useTransform(p, [0, 0.05, 0.1], [0.95, 0.95, 0]);
  const hintY = useTransform(p, [0, 0.1], [0, 12]);

  /* ---- Signal the MusicPlayer as soon as the letter starts opening (once) ---- */
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
      className={reduce ? "relative" : "relative h-[260vh]"}
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

        {/* ---- The letter: full-bleed photo + overlaid invitation copy ---- */}
        <motion.div
          style={reduce ? undefined : { opacity: letterOpacity, scale: letterScale }}
          initial={reduce ? { opacity: 0 } : undefined}
          animate={reduce ? { opacity: 1 } : undefined}
          transition={reduce ? { duration: 0.8, ease: easeLuxe } : undefined}
          className="absolute inset-0 z-10 overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src={PHOTO_SRC}
              alt={t.envelope.photoAlt}
              fill
              sizes="100vw"
              className="object-cover"
              loading="eager"
            />
          </div>
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{ opacity: reduce ? 0 : blurOpacity }}
          >
            <Image
              src={PHOTO_SRC}
              alt=""
              fill
              sizes="100vw"
              className="scale-105 object-cover blur-[8px]"
              loading="eager"
            />
          </motion.div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 95% 60% at 50% 28%, rgba(6,5,10,0.34), transparent 65%), linear-gradient(to bottom, rgba(6,5,10,0.6) 0%, rgba(6,5,10,0.46) 26%, rgba(6,5,10,0.28) 52%, rgba(6,5,10,0.14) 72%, rgba(6,5,10,0.34) 100%)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col items-center justify-start px-6 pt-[16vh] sm:pt-[20vh]">
            <div
              dir={dir}
              className="flex w-full max-w-2xl flex-col items-center gap-3 text-center"
            >
              <p className="text-halo font-serif text-[0.95rem] italic leading-snug text-cream/80 sm:text-[1.05rem]">
                {t.envelope.cardEyebrow}
              </p>
              <p className="text-halo font-display text-[0.72rem] uppercase tracking-[0.3em] text-old-gold sm:text-[0.8rem]">
                {t.envelope.cardHeadline}
              </p>

              <span className="text-halo font-display text-[0.68rem] uppercase tracking-[0.26em] text-cream/75 sm:text-xs">
                {t.envelope.cardTo}
              </span>
              <h2
                className="text-balance font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[0.03em] sm:text-[3.6rem] lg:text-[4.5rem]"
                style={{
                  background:
                    "linear-gradient(100deg, var(--color-gold-shimmer), var(--color-old-gold) 50%, var(--color-gold-shimmer))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter:
                    "drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 14px rgba(0,0,0,0.6))",
                }}
              >
                {couple}
              </h2>

              <span className="flex w-full max-w-xs items-center gap-3 py-1">
                <span className="hairline flex-1" />
                <span className="text-halo font-display text-base text-old-gold">&amp;</span>
                <span className="hairline flex-1" />
              </span>

              <p className="text-halo text-balance font-serif text-[1.05rem] leading-relaxed text-cream sm:text-[1.2rem]">
                {t.envelope.cardBody}
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
                  rotateX: rotateNeg,
                  opacity: flapFade,
                  background: "var(--surface-envelope)",
                }}
              />
              {/* bottom cap */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom"
                style={{
                  rotateX: rotate,
                  opacity: flapFade,
                  background: "var(--surface-envelope)",
                }}
              />
              {/* left flap */}
              <motion.div
                className="absolute inset-y-0 left-0 z-10 w-1/2 origin-left"
                style={{
                  rotateY: rotate,
                  opacity: flapFade,
                  background: "var(--surface-envelope-2)",
                }}
              />
              {/* right flap */}
              <motion.div
                className="absolute inset-y-0 right-0 z-10 w-1/2 origin-right"
                style={{
                  rotateY: rotateNeg,
                  opacity: flapFade,
                  background: "var(--surface-envelope-2)",
                }}
              />

              {/* heart seal at the meeting point of the four folds */}
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
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                    className="text-gold-shimmer drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
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
