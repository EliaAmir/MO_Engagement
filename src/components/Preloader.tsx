"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useLang } from "@/components/LangProvider";

type LenisLike = { stop: () => void; start: () => void };

function getLenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

export default function Preloader() {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  const progress = useMotionValue(0);
  const bar = useSpring(progress, { stiffness: 80, damping: 22 });
  const completedRef = useRef(false);

  // Drive the counter to 100, then signal completion.
  useEffect(() => {
    let value = 0;
    const interval = window.setInterval(() => {
      const remaining = 100 - value;
      const step = Math.max(1, remaining * 0.08 + Math.random() * 2.6);
      value = Math.min(100, value + step);
      progress.set(value);
      setCount(Math.floor(value));
      if (value >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            setDone(true);
          }
        }, 460);
      }
    }, 85);
    return () => window.clearInterval(interval);
  }, [progress]);

  // Lock scrolling ONLY while the preloader is on screen. Releasing `done`
  // clears the stop-interval and resumes Lenis — guaranteed.
  useEffect(() => {
    if (done) {
      document.documentElement.classList.remove("lenis-stopped");
      getLenis()?.start();
      return;
    }
    document.documentElement.classList.add("lenis-stopped");
    const lockId = window.setInterval(() => getLenis()?.stop(), 150);
    return () => window.clearInterval(lockId);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{
            backgroundColor: "#f7f2ea",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* warm champagne glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 45% at 50% 50%, color-mix(in oklab, var(--color-warm-taupe) 38%, transparent), transparent 70%)",
            }}
          />

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow mb-7">{t.preloader.tagline}</span>

            {/* Monogram with drawing ring */}
            <div className="relative mb-10 grid h-28 w-28 place-items-center">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full -rotate-90"
                aria-hidden
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="color-mix(in oklab, var(--color-old-gold) 22%, transparent)"
                  strokeWidth="0.6"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="var(--color-old-gold)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeDasharray="1 1"
                  pathLength={1}
                  style={{ pathLength: bar }}
                />
              </svg>
              <motion.span
                className="text-gradient-gold font-display text-2xl tracking-[0.18em]"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                M&amp;O
              </motion.span>
            </div>

            {/* counter */}
            <div className="flex items-baseline gap-1 font-display text-espresso">
              <span className="text-5xl tabular-nums tracking-tight">{count}</span>
              <span className="text-xl text-old-gold">%</span>
            </div>

            {/* progress line */}
            <div className="mt-8 h-px w-56 overflow-hidden bg-warm-taupe/30">
              <motion.div
                className="h-full origin-left bg-linear-to-r from-old-gold via-gold-light to-camel"
                style={{ scaleX: bar, transformOrigin: "left" }}
              />
            </div>

            <span className="mt-5 font-serif text-xs uppercase tracking-[0.3em] text-mocha/50">
              {t.preloader.loading}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
