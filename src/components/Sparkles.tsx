"use client";

import { useEffect, useState } from "react";

type Sparkle = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  shimmer: number;
  shimmerDelay: number;
  opacity: number;
};

const COUNT = 26;

function buildSparkles(): Sparkle[] {
  const arr: Sparkle[] = [];
  for (let i = 0; i < COUNT; i++) {
    arr.push({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 5,
      duration: 15 + Math.random() * 13,
      delay: -Math.random() * 28,
      sway: 1.4 + Math.random() * 3.6,
      shimmer: 1.5 + Math.random() * 2.4,
      shimmerDelay: -Math.random() * 3,
      opacity: 0.55 + Math.random() * 0.4,
    });
  }
  return arr;
}

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Feature-detect + randomize after mount (browser-only, SSR-safe).
    /* eslint-disable react-hooks/set-state-in-effect */
    setEnabled(true);
    setSparkles(buildSparkles());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute top-0 will-change-transform"
          style={
            {
              left: `${s.left}vw`,
              animation: `sparkle-drift ${s.duration}s linear ${s.delay}s infinite`,
              "--sparkle-sway": `${s.sway}vw`,
              "--sparkle-opacity": s.opacity,
            } as React.CSSProperties
          }
        >
          <span
            className="block rounded-full"
            style={{
              width: s.size,
              height: s.size,
              animation: `sparkle-shimmer ${s.shimmer}s ease-in-out ${s.shimmerDelay}s infinite`,
              background:
                "radial-gradient(circle, var(--sparkle-core), var(--sparkle-edge) 45%, transparent 72%)",
              boxShadow: "0 0 6px 1px var(--sparkle-halo)",
            }}
          />
        </span>
      ))}
    </div>
  );
}
