"use client";

import { useEffect, useState } from "react";

type Kind = "star" | "bokeh" | "dust";

type Sparkle = {
  id: number;
  kind: Kind;
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  shimmer: number;
  shimmerDelay: number;
  spin: number;
  spinDelay: number;
  opacity: number;
};

const STAR_COUNT = 16;
const BOKEH_COUNT = 7;
const DUST_COUNT = 16;

const STAR_PATH =
  "M50 1 C57 28, 72 43, 99 50 C72 57, 57 72, 50 99 C43 72, 28 57, 1 50 C28 43, 43 28, 50 1 Z";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildSparkles(): Sparkle[] {
  const arr: Sparkle[] = [];
  let id = 0;

  for (let i = 0; i < STAR_COUNT; i++) {
    arr.push({
      id: id++,
      kind: "star",
      left: Math.random() * 100,
      size: rand(14, 30),
      duration: rand(15, 27),
      delay: -Math.random() * 28,
      sway: rand(2.4, 5.5),
      shimmer: rand(1.8, 3.2),
      shimmerDelay: -Math.random() * 3,
      spin: rand(7, 16) * (Math.random() < 0.5 ? -1 : 1),
      spinDelay: -Math.random() * 8,
      opacity: rand(0.6, 1),
    });
  }

  for (let i = 0; i < BOKEH_COUNT; i++) {
    arr.push({
      id: id++,
      kind: "bokeh",
      left: Math.random() * 100,
      size: rand(55, 120),
      duration: rand(26, 42),
      delay: -Math.random() * 40,
      sway: rand(0.6, 2),
      shimmer: rand(4, 7),
      shimmerDelay: -Math.random() * 5,
      spin: 0,
      spinDelay: 0,
      opacity: rand(0.1, 0.22),
    });
  }

  for (let i = 0; i < DUST_COUNT; i++) {
    arr.push({
      id: id++,
      kind: "dust",
      left: Math.random() * 100,
      size: rand(2, 4.5),
      duration: rand(10, 20),
      delay: -Math.random() * 20,
      sway: rand(1.6, 4),
      shimmer: rand(1, 2.2),
      shimmerDelay: -Math.random() * 3,
      spin: 0,
      spinDelay: 0,
      opacity: rand(0.5, 0.95),
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
    /* eslint-disable react-hooks/set-state-in-effect */
    setEnabled(true);
    setSparkles(buildSparkles());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
      {sparkles.map((s) => {
        const outerStyle = {
          left: `${s.left}vw`,
          animation: `sparkle-drift ${s.duration}s linear ${s.delay}s infinite`,
          "--sparkle-sway": `${s.sway}vw`,
          "--sparkle-opacity": s.opacity,
        } as React.CSSProperties;

        if (s.kind === "star") {
          return (
            <span key={s.id} className="absolute top-0 will-change-transform" style={outerStyle}>
              <span
                className="block"
                style={
                  {
                    width: s.size,
                    height: s.size,
                    animation: `sparkle-shimmer ${s.shimmer}s ease-in-out ${s.shimmerDelay}s infinite`,
                    "--shimmer-from": "0.45",
                    "--shimmer-to": "1.12",
                  } as React.CSSProperties
                }
              >
                <svg
                  viewBox="0 0 100 100"
                  width={s.size}
                  height={s.size}
                  style={{
                    display: "block",
                    filter: `drop-shadow(0 0 ${s.size * 0.4}px var(--sparkle-halo))`,
                    animation: `sparkle-spin ${Math.abs(s.spin)}s linear ${s.spinDelay}s infinite`,
                    animationDirection: s.spin < 0 ? "reverse" : "normal",
                  }}
                >
                  <defs>
                    <radialGradient id={`sg-${s.id}`}>
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="32%" stopColor="var(--sparkle-core)" />
                      <stop offset="100%" stopColor="var(--sparkle-edge)" stopOpacity="0.9" />
                    </radialGradient>
                  </defs>
                  <path d={STAR_PATH} fill={`url(#sg-${s.id})`} />
                </svg>
              </span>
            </span>
          );
        }

        if (s.kind === "bokeh") {
          return (
            <span key={s.id} className="absolute top-0 will-change-transform" style={outerStyle}>
              <span
                className="block rounded-full"
                style={
                  {
                    width: s.size,
                    height: s.size,
                    animation: `sparkle-shimmer ${s.shimmer}s ease-in-out ${s.shimmerDelay}s infinite`,
                    "--shimmer-from": "0.82",
                    "--shimmer-to": "1.06",
                    background:
                      "radial-gradient(circle, var(--sparkle-core) 0%, var(--sparkle-halo) 38%, transparent 72%)",
                    filter: "blur(6px)",
                  } as React.CSSProperties
                }
              />
            </span>
          );
        }

        return (
          <span key={s.id} className="absolute top-0 will-change-transform" style={outerStyle}>
            <span
              className="block rounded-full"
              style={{
                width: s.size,
                height: s.size,
                animation: `sparkle-shimmer ${s.shimmer}s ease-in-out ${s.shimmerDelay}s infinite`,
                background: "var(--sparkle-core)",
                boxShadow: "0 0 5px 1px var(--sparkle-halo)",
              }}
            />
          </span>
        );
      })}
    </div>
  );
}
