"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";

/* Fixed design size (px). The whole scene is responsively scaled by a
   CSS transform on the outer wrapper, keeping the scroll math consistent. */
const ENVELOPE_W = 360;
const ENVELOPE_H = 250;
const CARD_W = 320;
const CARD_H = 324;
const RISE = -((ENVELOPE_H + CARD_H) / 2) + 12; // distance the card travels up

export default function Envelope() {
  const { t, lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Weighted, cinematic scrubbing.
  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.6,
  });

  /* ---- Wax seal: cracks, scales, fades ---- */
  const sealScale = useTransform(p, [0, 0.1, 0.2], [1, 1.22, 0.55]);
  const sealOpacity = useTransform(p, [0, 0.1, 0.2], [1, 1, 0]);
  const sealRotate = useTransform(p, [0, 0.2], [0, 16]);
  const crackOpacity = useTransform(p, [0.04, 0.14, 0.2], [0, 1, 0]);

  /* ---- Flap: swings open, recedes behind the card ---- */
  const flapRotate = useTransform(p, [0.16, 0.46], [0, -166]);
  const flapZ = useTransform(p, [0.16, 0.46], [12, -16]);

  /* ---- Card: rises out of the throat ---- */
  const cardY = useTransform(p, [0.4, 0.84], [0, RISE]);
  const cardScale = useTransform(p, [0.4, 0.84], [1, 1.04]);
  const cardOpacity = useTransform(p, [0.36, 0.42], [0, 1]);

  /* ---- Envelope body: dissolves away once the card is out ---- */
  const bodyOpacity = useTransform(p, [0.82, 0.99], [1, 0]);

  /* ---- UI ---- */
  const hintOpacity = useTransform(p, [0, 0.05, 0.12], [0.95, 0.95, 0]);
  const hintY = useTransform(p, [0, 0.12], [0, 12]);

  const couple = lang === "ar" ? EVENT.couple.ar : EVENT.couple.en;

  return (
    <section
      ref={sectionRef}
      id="envelope"
      aria-label={t.preloader.enter}
      className="relative h-[340vh]"
    >
      <div className="sticky top-0 grid h-dvh place-items-center overflow-hidden">
        {/* ambient champagne glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 55%, color-mix(in oklab, var(--color-warm-taupe) 50%, transparent), transparent 70%)",
          }}
        />

        {/* responsive scale wrapper (separate from the entrance transform) */}
        <div className="relative scale-[0.72] sm:scale-90 lg:scale-100">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="perspective-near">
            <div
              className="preserve-3d relative"
              style={{ width: ENVELOPE_W, height: ENVELOPE_H }}
            >
              {/* ---- Back panel (champagne) ---- */}
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-[6px]"
                style={{
                  z: -8,
                  opacity: bodyOpacity,
                  background:
                    "linear-gradient(160deg, #241a2a, #14101b)",
                  boxShadow:
                    "0 45px 90px -35px rgba(0,0,0,0.7), inset 0 0 0 1px color-mix(in oklab, var(--color-old-gold) 45%, transparent)",
                }}
              />

              {/* ---- Invitation card ---- */}
              <motion.div
                className="absolute"
                style={{
                  z: 0,
                  width: CARD_W,
                  height: CARD_H,
                  left: "50%",
                  bottom: 0,
                  marginLeft: -CARD_W / 2,
                  y: cardY,
                  scale: cardScale,
                  opacity: cardOpacity,
                }}
              >
                <CardFace couple={couple} />
              </motion.div>

              {/* ---- Front pocket (throat) ---- */}
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-[6px]"
                style={{
                  z: 8,
                  opacity: bodyOpacity,
                  background:
                    "linear-gradient(200deg, #1b1424, #241a2a)",
                  clipPath:
                    "polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)",
                  WebkitClipPath:
                    "polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)",
                  boxShadow:
                    "inset 0 0 0 1px color-mix(in oklab, var(--color-old-gold) 30%, transparent)",
                }}
              />
              {/* throat shadow line */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  z: 9,
                  opacity: bodyOpacity,
                  background:
                    "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--color-jet) 55%, transparent) 58%, transparent 62%)",
                  clipPath:
                    "polygon(0 0, 50% 58%, 100% 0, 100% 64%, 50% 70%, 0 64%)",
                  WebkitClipPath:
                    "polygon(0 0, 50% 58%, 100% 0, 100% 64%, 50% 70%, 0 64%)",
                }}
              />

              {/* ---- Closing flap (rotates open) ---- */}
              <motion.div
                aria-hidden
                className="absolute left-0 top-0 origin-top preserve-3d"
                style={{
                  width: ENVELOPE_W,
                  height: ENVELOPE_H * 0.56,
                  rotateX: flapRotate,
                  z: flapZ,
                  opacity: bodyOpacity,
                }}
              >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(160deg, #241a2a, #14101b)",
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      WebkitClipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      boxShadow:
                        "inset 0 0 0 1px color-mix(in oklab, var(--color-old-gold) 32%, transparent)",
                    }}
                  />

                {/* Wax seal (deep mocha, gold ring) */}
                <motion.div
                  className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[58%]"
                  style={{ scale: sealScale, opacity: sealOpacity, rotate: sealRotate }}
                >
                  <div
                    className="grid place-items-center rounded-full"
                    style={{
                      width: 96,
                      height: 96,
                      background:
                        "radial-gradient(circle at 35% 30%, var(--color-wine), #2a0c16 75%)",
                      boxShadow:
                        "0 10px 26px -8px rgba(0,0,0,0.75), inset 0 0 0 2px color-mix(in oklab, var(--color-gold-shimmer) 60%, transparent), inset 0 -6px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    <span className="font-display text-base tracking-[0.14em] text-cream/90">
                      {t.envelope.sealLabel}
                    </span>
                    {/* crack lines */}
                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      style={{ opacity: crackOpacity }}
                    >
                      <span className="absolute left-1/2 top-1/2 h-[2px] w-[88px] origin-center -translate-x-1/2 -translate-y-1/2 rotate-[24deg] bg-cream/55" />
                      <span className="absolute left-1/2 top-1/2 h-[2px] w-[78px] origin-center -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] bg-cream/55" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity, y: hintY }}
          className="absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-3"
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

        <span className="sr-only">
          {couple} — {t.envelope.cardHeadline}
        </span>
      </div>
    </section>
  );
}

/* The face of the rising invitation card. */
function CardFace({ couple }: { couple: string }) {
  const { t, lang } = useLang();
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-[4px] px-7 py-8 text-center"
      style={{
        background:
          "linear-gradient(170deg, var(--color-dark-choc), #100c14 60%, var(--color-onyx))",
        boxShadow:
          "0 45px 90px -40px rgba(0,0,0,0.7), inset 0 0 0 1px color-mix(in oklab, var(--color-old-gold) 55%, transparent), inset 0 0 0 7px color-mix(in oklab, var(--color-old-gold) 8%, transparent)",
        color: "var(--color-espresso)",
      }}
    >
      {/* gilded corners */}
      <Corner className="left-2 top-2" />
      <Corner className="right-2 top-2 rotate-90" />
      <Corner className="bottom-2 left-2 -rotate-90" />
      <Corner className="bottom-2 right-2 rotate-180" />

      <p className="font-serif text-[0.72rem] italic leading-snug text-mocha/70">
        {t.envelope.cardEyebrow}
      </p>
      <p className="font-display text-[0.66rem] uppercase tracking-[0.34em] text-old-gold">
        {t.envelope.cardHeadline}
      </p>

      <div className="flex flex-col items-center gap-2">
        <span className="font-display text-xs uppercase tracking-[0.3em] text-mocha/60">
          {t.envelope.cardTo}
        </span>
        <h2
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="text-pretty font-display text-[2rem] font-semibold leading-tight tracking-[0.04em]"
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
      </div>

      <div className="flex w-full items-center gap-3">
        <span className="hairline flex-1" />
        <span className="font-display text-sm text-old-gold">&amp;</span>
        <span className="hairline flex-1" />
      </div>

      <p className="font-serif text-[0.82rem] leading-relaxed text-mocha/80">
        {t.envelope.cardBody}
      </p>
      <p className="font-display text-[0.6rem] uppercase tracking-[0.22em] text-mocha/55">
        {t.envelope.cardSignoff}
      </p>
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-5 w-5 ${className ?? ""}`}
      style={{
        borderTop: "1px solid color-mix(in oklab, var(--color-old-gold) 60%, transparent)",
        borderLeft: "1px solid color-mix(in oklab, var(--color-old-gold) 60%, transparent)",
      }}
    />
  );
}
