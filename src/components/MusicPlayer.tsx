"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/LangProvider";

const easeLuxe = [0.16, 1, 0.3, 1] as const;
/* Drop an ambient track at public/music.mp3 (or change MUSIC_SRC). */
const MUSIC_SRC = "/music.mp3";
const FADE_MS = 1400;
const TARGET_VOLUME = 0.5;

export default function MusicPlayer() {
  const { t } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRaf = useRef<number>(0);
  const openedRef = useRef(false);
  const autoStartedRef = useRef(false);

  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);

  const fadeTo = useCallback((target: number, after?: () => void) => {
    cancelAnimationFrame(fadeRaf.current);
    const audio = audioRef.current;
    if (!audio) return after?.();
    const start = performance.now();
    const from = audio.volume;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (target - from) * k;
      if (k < 1) {
        fadeRaf.current = requestAnimationFrame(step);
      } else {
        after?.();
      }
    };
    fadeRaf.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(TARGET_VOLUME);
      })
      .catch(() => {
        /* autoplay still blocked — wait for an explicit tap */
      });
  }, [fadeTo]);

  const stop = useCallback(() => {
    fadeTo(0, () => {
      audioRef.current?.pause();
      setPlaying(false);
    });
  }, [fadeTo]);

  // Mark the letter as opened + try to start. Browsers block autoplay until a
  // real gesture, so this may silently fail — the gesture effect below retries.
  useEffect(() => {
    if (!available) return;
    const onOpen = () => {
      openedRef.current = true;
      start();
    };
    window.addEventListener("mo:invite-opened", onOpen, { once: true });
    return () => window.removeEventListener("mo:invite-opened", onOpen);
  }, [available, start]);

  // Autoplay fallback: if the letter opened but the track is still paused
  // (autoplay was blocked), start it on the first click / tap / keypress
  // anywhere on the page. Fires only once so the button still controls after.
  useEffect(() => {
    if (!available) return;
    const onGesture = () => {
      if (autoStartedRef.current) return;
      if (!openedRef.current) return;
      const audio = audioRef.current;
      if (audio && audio.paused) {
        autoStartedRef.current = true;
        start();
      }
    };
    const gestures = ["pointerdown", "keydown", "touchstart"];
    gestures.forEach((g) =>
      window.addEventListener(g, onGesture, { passive: true }),
    );
    return () =>
      gestures.forEach((g) => window.removeEventListener(g, onGesture));
  }, [available, start]);

  const toggle = () => (playing ? stop() : start());

  return (
    <AnimatePresence>
      {available && (
        <motion.button
          key="music-toggle"
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? t.music.ariaOn : t.music.ariaOff}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ delay: 0.4, duration: 0.8, ease: easeLuxe }}
          className="group fixed bottom-24 left-4 z-[170] grid h-12 w-12 place-items-center rounded-full border border-old-gold/45 bg-onyx/70 backdrop-blur-md transition-colors hover:border-old-gold sm:bottom-28 sm:left-6"
        >
          {/* soft pulse ring when idle */}
          {!playing && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border border-old-gold/40"
              animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          {playing ? (
            <Equalizer />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-old-gold">
              <path
                d="M11 5L6 9H3v6h3l5 4V5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="currentColor"
              />
              <path
                d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </motion.button>
      )}

      <audio
        key="music-audio"
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="auto"
        onError={() => setAvailable(false)}
      />
    </AnimatePresence>
  );
}

function Equalizer() {
  return (
    <span className="flex h-4 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[2.5px] origin-bottom rounded-full bg-old-gold"
          style={{
            height: "100%",
            animation: `eq-bounce ${0.7 + i * 0.12}s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
