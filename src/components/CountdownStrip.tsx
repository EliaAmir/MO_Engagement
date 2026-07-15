"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";
import { pad } from "@/lib/utils";

const easeLuxe = [0.16, 1, 0.3, 1] as const;
const TARGET = new Date(EVENT.iso).getTime();

type Time = { days: number; hours: number; minutes: number; seconds: number };

function diff(): Time | null {
  const ms = TARGET - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export default function CountdownStrip() {
  const { t } = useLang();
  const [time, setTime] = useState<Time | null>(null);

  useEffect(() => {
    // Prime immediately so the first paint is correct; the interval keeps it live.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(diff());
    const id = window.setInterval(() => setTime(diff()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const happened = time === null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 1, ease: easeLuxe }}
      className="fixed inset-x-0 bottom-0 z-[150] border-t border-gold-light/20 bg-cream/85 backdrop-blur-xl"
      role="timer"
      aria-live="off"
      aria-label={`${t.countdown.label}: ${happened ? t.countdown.happened : ""}`}
    >
      <div className="mx-auto flex max-w-5xl items-stretch justify-center gap-1 px-3 py-2 sm:gap-2 sm:px-6 sm:py-2.5">
        {happened ? (
          <div className="flex w-full items-center justify-center py-2">
            <span className="text-gradient-gold text-shimmer font-display text-sm uppercase tracking-[0.3em]">
              {t.countdown.happened}
            </span>
          </div>
        ) : (
          <>
            <Unit value={pad(time!.days)} label={t.countdown.days} wide />
            <Unit value={pad(time!.hours)} label={t.countdown.hours} />
            <Unit value={pad(time!.minutes)} label={t.countdown.minutes} />
            <Unit value={pad(time!.seconds)} label={t.countdown.seconds} />

            <div className="hidden items-center ps-4 sm:flex">
              <span className="font-serif text-xs italic text-mocha/45">
                {t.countdown.label}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Unit({
  value,
  label,
  wide = false,
}: {
  value: string;
  label: string;
  wide?: boolean;
}) {
  const digits = value.split("");
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 py-1">
      <div
        className={`flex items-center ${wide ? "" : "justify-center"}`}
        style={{ perspective: 300 }}
      >
        {digits.map((d, i) => (
          <FlipDigit key={i} digit={d} />
        ))}
      </div>
      <span className="font-display text-[0.5rem] uppercase tracking-[0.24em] text-old-gold/80 sm:text-[0.58rem]">
        {label}
      </span>
    </div>
  );
}

function FlipDigit({ digit }: { digit: string }) {
  return (
    <span
      className="relative inline-block h-[1.5em] w-[0.62em] overflow-hidden text-center font-display text-xl font-semibold tabular-nums text-espresso sm:text-2xl"
      style={{ lineHeight: "1.5em" }}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: easeLuxe }}
          className="absolute inset-0 grid place-items-center"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
