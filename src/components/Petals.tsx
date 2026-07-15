"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
  kind: "sparkle" | "petal";
};

const COUNT = 22;

function buildParticles(): Particle[] {
  const arr: Particle[] = [];
  for (let i = 0; i < COUNT; i++) {
    const kind: Particle["kind"] = Math.random() > 0.55 ? "petal" : "sparkle";
    arr.push({
      id: i,
      left: Math.random() * 100,
      size: kind === "petal" ? 8 + Math.random() * 10 : 3 + Math.random() * 4,
      duration: 13 + Math.random() * 14,
      delay: -Math.random() * 26,
      drift: (Math.random() - 0.5) * 26,
      spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540),
      opacity: kind === "petal" ? 0.32 + Math.random() * 0.22 : 0.5 + Math.random() * 0.35,
      kind,
    });
  }
  return arr;
}

export default function Petals() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Feature-detect + randomize after mount (browser-only, SSR-safe).
    /* eslint-disable react-hooks/set-state-in-effect */
    setEnabled(true);
    setParticles(buildParticles());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 will-change-transform"
          style={
            {
              left: `${p.left}vw`,
              animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
              "--petal-drift": `${p.drift}vw`,
              "--petal-spin": `${p.spin}deg`,
              "--petal-opacity": p.opacity,
            } as React.CSSProperties
          }
        >
          {p.kind === "sparkle" ? (
            <Sparkle size={p.size} />
          ) : (
            <Petal size={p.size} />
          )}
        </span>
      ))}
    </div>
  );
}

function Sparkle({ size }: { size: number }) {
  return (
    <span
      className="block rounded-full"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle, var(--color-gold-shimmer), color-mix(in oklab, var(--color-old-gold) 40%, transparent) 70%, transparent)",
        boxShadow: "0 0 8px color-mix(in oklab, var(--color-gold-shimmer) 60%, transparent)",
      }}
    />
  );
}

function Petal({ size }: { size: number }) {
  return (
    <span
      className="block"
      style={{
        width: size,
        height: size * 1.35,
        borderRadius: "60% 60% 55% 55% / 70% 70% 40% 40%",
        background:
          "linear-gradient(140deg, color-mix(in oklab, var(--color-gold-light) 70%, transparent), color-mix(in oklab, var(--color-old-gold) 35%, transparent))",
        border: "1px solid color-mix(in oklab, var(--color-old-gold) 22%, transparent)",
      }}
    />
  );
}
