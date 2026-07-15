"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor: a small gold dot with a lagging ring that scales up on
 * interactive hover. Disabled on touch / coarse-pointer devices.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 1100, damping: 50 });
  const dotY = useSpring(y, { stiffness: 1100, damping: 50 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    // Enabled only after mount (matchMedia is browser-only) to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("cursor-ready");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const interactive = !!target?.closest(
        'a, button, input, textarea, select, label, [role="button"], [data-cursor="hover"]',
      );
      setHovering(interactive);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      document.documentElement.classList.remove("cursor-ready");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[10001]">
      {/* Lagging ring */}
      <motion.div
        style={{
          translateX: ringX,
          translateY: ringY,
          borderColor: "color-mix(in oklab, var(--color-gold-light) 75%, transparent)",
        }}
        animate={{
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          opacity: 1,
          scale: pressed ? 0.82 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border"
      />
      {/* Inner dot */}
      <motion.div
        style={{ translateX: dotX, translateY: dotY }}
        animate={{ scale: hovering ? 0 : 1 }}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <span
          className="block h-1.5 w-1.5 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-gold-shimmer), var(--color-old-gold))",
            boxShadow: "0 0 10px var(--color-gold-shimmer)",
          }}
        />
      </motion.div>
    </div>
  );
}
