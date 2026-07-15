"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/LangProvider";
import { scrollToTarget } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

type NavItem = { id: string; label: string };

export default function Navbar() {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items: NavItem[] = [
    { id: "story", label: t.nav.story },
    { id: "details", label: t.nav.details },
    { id: "dress", label: t.nav.dressCode },
    { id: "rsvp", label: t.nav.rsvp },
    { id: "guestbook", label: t.nav.guestbook },
    { id: "calendar", label: t.nav.calendar },
  ];

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToTarget(`#${id}`);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-[200] transition-all duration-700",
        scrolled
          ? "border-b border-gold-light/15 bg-onyx/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-20">
        {/* Brand */}
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          aria-label="Onur & Marina â€” back to top"
          className="group flex items-center gap-3"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-light/40 font-display text-xs tracking-widest text-old-gold transition-colors group-hover:border-gold-shimmer">
            O&amp;M
          </span>
          <span className="hidden font-display text-[0.7rem] uppercase tracking-[0.3em] text-mocha/80 sm:block">
            {lang === "ar" ? "اونور ومارينا" : "Onur & Marina"}
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(item.id)}
                className="group relative font-display text-[0.72rem] uppercase tracking-[0.22em] text-mocha/70 transition-colors hover:text-old-gold"
              >
                {item.label}
                <span className="absolute -bottom-1.5 start-0 h-px w-0 bg-gold-shimmer transition-all duration-500 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={t.nav.langToggleLong}
            className="rounded-full border border-gold-light/40 px-3.5 py-1.5 font-display text-[0.68rem] uppercase tracking-[0.18em] text-mocha/80 transition-all hover:border-gold-shimmer hover:text-old-gold"
          >
            {t.nav.langToggle}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-gold-light/30 text-espresso lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-all duration-300",
                  menuOpen && "top-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-px w-full bg-current transition-all duration-300",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-3 h-px w-full bg-current transition-all duration-300",
                  menuOpen && "top-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-gold-light/10 bg-onyx/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    className="w-full rounded-md px-3 py-3 text-start font-display text-sm uppercase tracking-[0.22em] text-mocha/80 transition-colors hover:bg-old-gold/15 hover:text-old-gold"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
