"use client";

import { motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";
import { directionsUrl, mapsUrl } from "@/lib/utils";

const easeLuxe = [0.16, 1, 0.3, 1] as const;

export default function Details() {
  const { t, lang } = useLang();
  const isAr = lang === "ar";

  const rows = [
    { label: t.details.venueLabel, value: EVENT.venue[lang], icon: "venue" },
    { label: t.details.hallLabel, value: EVENT.hall[lang], icon: "hall" },
    { label: t.details.dateLabel, value: EVENT.dateLong[lang], icon: "date" },
    { label: t.details.timeLabel, value: EVENT.time[lang], icon: "time" },
  ] as const;

  return (
    <section id="details" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            className="eyebrow mb-5"
          >
            {t.details.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: easeLuxe }}
            className="text-gradient-gold font-display text-4xl font-semibold tracking-wide sm:text-5xl"
          >
            {t.details.title}
          </motion.h2>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: easeLuxe }}
            className="panel relative overflow-hidden rounded-sm p-8 sm:p-10"
          >
            <div className="gold-divider absolute inset-y-8 start-1/2 hidden lg:block" />
            <ul className="grid gap-8 sm:grid-cols-2 sm:gap-10">
              {rows.map((row) => (
                <li key={row.label} className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-old-gold">
                    <DetailIcon name={row.icon} />
                    <span className="eyebrow text-[0.6rem] tracking-[0.3em]">
                      {row.label}
                    </span>
                  </span>
                  <p
                    dir={isAr ? "rtl" : "ltr"}
                    className="font-serif text-lg leading-snug text-mocha/90 sm:text-xl"
                  >
                    {row.value}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-gold-light/15 pt-8">
              <span className="eyebrow text-[0.6rem] tracking-[0.3em]">
                {t.details.addressLabel}
              </span>
              <p
                dir={isAr ? "rtl" : "ltr"}
                className={`mt-3 font-serif leading-relaxed text-mocha/80 ${
                  isAr ? "text-lg" : "text-base"
                }`}
              >
                {EVENT.address[lang]}
              </p>
            </div>
          </motion.div>

          {/* Map + actions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: easeLuxe, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div className="panel group relative flex-1 overflow-hidden rounded-sm">
              <iframe
                title={EVENT.venue[lang]}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  EVENT.mapsQuery,
                )}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[260px] w-full transition-all duration-700"
                style={{ border: 0, filter: "sepia(0.22) saturate(0.92) contrast(0.96)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold-light/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={mapsUrl(EVENT.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center justify-center gap-2 text-center"
              >
                {t.details.maps}
              </a>
              <a
                href={directionsUrl(EVENT.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost flex items-center justify-center gap-2 text-center"
              >
                {t.details.directions}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DetailIcon({ name }: { name: string }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "venue":
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
        </svg>
      );
    case "hall":
      return (
        <svg {...common}>
          <path d="M12 3l2.5 5 5.5.8-4 3.9 1 5.5L12 16.6 7 18.2l1-5.5-4-3.9 5.5-.8L12 3z" />
        </svg>
      );
    case "date":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </svg>
      );
    case "time":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
}
