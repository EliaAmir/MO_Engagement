"use client";

import { motion } from "motion/react";
import { useLang } from "@/components/LangProvider";

const easeLuxe = [0.16, 1, 0.3, 1] as const;
const RSVP_FORM_URL = "https://forms.gle/3TE4zwnbXSHrD4C98";

export default function Rsvp() {
  const { t, lang } = useLang();

  return (
    <section id="rsvp" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.9, ease: easeLuxe }}
            className="eyebrow mb-5"
          >
            {t.rsvp.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.1, ease: easeLuxe }}
            className="text-gradient-gold font-display text-4xl font-semibold tracking-wide sm:text-5xl"
          >
            {t.rsvp.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: easeLuxe, delay: 0.1 }}
            className="mt-5 max-w-md font-serif text-lg italic text-mocha/70"
          >
            {t.rsvp.intro}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: easeLuxe }}
          className="panel mt-12 rounded-sm p-8 text-center sm:p-10"
        >
          <a
            href={RSVP_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="btn-gold inline-block w-full text-center"
          >
            {t.rsvp.formButton}
          </a>
          <p className="mt-4 font-serif text-sm text-mocha/50">
            {t.rsvp.formNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
