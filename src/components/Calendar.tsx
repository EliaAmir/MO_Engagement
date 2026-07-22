"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { EVENT } from "@/lib/content";
import { escapeIcs, foldIcs, toIcsStamp } from "@/lib/utils";

const easeLuxe = [0.16, 1, 0.3, 1] as const;
const DURATION_HOURS = 4;

export default function Calendar() {
  const { t, lang } = useLang();
  const isAr = lang === "ar";

  const { googleUrl, icsContent } = useMemo(() => {
    const startDate = new Date(EVENT.iso);
    const endDate = new Date(startDate.getTime() + DURATION_HOURS * 3600_000);

    const startStamp = toIcsStamp(startDate);
    const endStamp = toIcsStamp(endDate);

    const title = EVENT.calendarTitle;
    const description = `${EVENT.type[lang]} · ${EVENT.dateLong[lang]} · ${EVENT.time[lang]}`;
    const location = `${EVENT.venue[lang]}, ${EVENT.address[lang]}`;

    const google = new URL("https://calendar.google.com/calendar/render");
    google.searchParams.set("action", "TEMPLATE");
    google.searchParams.set("text", title);
    google.searchParams.set("dates", `${startStamp}/${endStamp}`);
    google.searchParams.set("details", description);
    google.searchParams.set("location", location);

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Onur & Marina//Engagement//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:marina-onur-engagement-${startStamp}@marinaonur.engage`,
      `DTSTAMP:${startStamp}`,
      `DTSTART:${startStamp}`,
      `DTEND:${endStamp}`,
      `SUMMARY:${escapeIcs(title)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      `LOCATION:${escapeIcs(location)}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    return {
      googleUrl: google.toString(),
      icsContent: lines.map(foldIcs).join("\r\n"),
    };
  }, [lang]);

  const downloadIcs = () => {
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marina-onur-engagement.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const options = [
    {
      key: "google",
      label: t.calendar.google,
      href: googleUrl,
      external: true,
      icon: GoogleIcon,
    },
    {
      key: "apple",
      label: t.calendar.apple,
      onClick: downloadIcs,
      icon: AppleIcon,
    },
  ] as const;

  return (
    <section id="calendar" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            className="eyebrow mb-5"
          >
            {t.calendar.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: easeLuxe }}
            className="text-gradient-gold font-display text-4xl font-semibold tracking-wide sm:text-5xl"
          >
            {t.calendar.title}
          </motion.h2>
          <motion.p
            dir={isAr ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: easeLuxe, delay: 0.1 }}
            className="mt-5 max-w-md font-serif text-lg italic text-mocha/70"
          >
            {t.calendar.intro}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: easeLuxe }}
          className="mt-12 grid gap-4 sm:grid-cols-2"
        >
          {options.map((opt) => {
            const Icon = opt.icon;
            const className =
              "btn-ghost group flex h-full flex-col items-center justify-center gap-3 py-8";
            if ("href" in opt && opt.href) {
              return (
                <a
                  key={opt.key}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  <Icon />
                  <span>{opt.label}</span>
                </a>
              );
            }
            return (
              <button
                key={opt.key}
                type="button"
                onClick={"onClick" in opt ? opt.onClick : undefined}
                className={className}
              >
                <Icon />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </motion.div>

        <p className="mt-6 text-center font-serif text-xs uppercase tracking-[0.24em] text-mocha/40">
          {EVENT.dateLong[lang]} · {EVENT.time[lang]}
        </p>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="14" r="1.6" fill="currentColor" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="24" height="26" viewBox="0 0 24 26" fill="none">
      <path
        d="M17.5 13.6c0-3 2.4-4.4 2.5-4.5-1.4-2-3.5-2.3-4.3-2.3-1.8-.2-3.5 1.1-4.5 1.1-.9 0-2.3-1-3.8-1-2 0-3.8 1.1-4.8 2.9-2 3.6-.5 8.8 1.5 11.7 1 1.4 2.1 3 3.6 2.9 1.4-.1 2-.9 3.7-.9s2.2.9 3.7.9c1.5 0 2.5-1.4 3.5-2.8.7-1 1.3-2.2 1.7-3.4-3.6-1.4-3.8-5.4-.8-6.6z"
        fill="currentColor"
      />
    </svg>
  );
}
