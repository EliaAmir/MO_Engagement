"use client";

import { useMemo } from "react";

/**
 * Fixed full-viewport film-grain overlay rendered above the background but
 * below content. Uses an inline SVG turbulence texture animated via the
 * `grain` keyframes defined in globals.css.
 */
export default function FilmGrain() {
  const noise = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
          <filter id='n'>
            <feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/>
            <feColorMatrix type='saturate' values='0'/>
          </filter>
          <rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/>
        </svg>`,
      )}`,
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] film-grain"
      style={{
        backgroundImage: `url("${noise}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
        animation: "grain 8s steps(8) infinite",
      }}
    />
  );
}
