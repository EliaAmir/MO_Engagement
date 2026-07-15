# Project Context — Marina & Onur Engagement Invitation

> Read this first if you are a new session / different AI picking up this project.
> It explains **what the project is, how it is built, where everything lives,
> and what is open/in-progress**. Keep it in sync when the architecture changes.

`AGENTS.md` holds the hard rules (Next.js version caveat, do-not-run policy).
This file holds the **soft context** (domain, structure, history, goals).

---

## 1. What this is

A bilingual (English / Arabic) **digital engagement invitation** website for
**Marina & Onur**, an engagement party in Cairo. It is a single marketing-style
landing page plus a private admin dashboard. The aesthetic is luxe / editorial:
cream paper, espresso ink, gold accents, serif typography, falling petals,
film grain, smooth Lenis scroll, and motion (Framer Motion) throughout.

- **Event:** Saturday, September 13, 2026 · 7:00 PM
- **Venue:** Dar Gardenia Wedding Halls · Tulip Hall · Cairo, Egypt
- **Audience:** Guests receive a link; the experience is intentionally rich and
  animated, not a plain text invite.

---

## 2. Tech stack

| Concern        | Choice                                                        |
| -------------- | ------------------------------------------------------------ |
| Framework      | **Next.js 16.2.10** (App Router, Turbopack) — ⚠️ see AGENTS.md, this is NOT the Next.js in most training data; read `node_modules/next/dist/docs/` before touching framework APIs |
| React          | **19.2.4**                                                   |
| Animation      | **motion** v12 (`import { motion } from "motion/react"` — the new package name for Framer Motion) |
| Smooth scroll  | **@studio-freight/lenis** v1 (`SmoothScroll.tsx`)            |
| Styling        | **Tailwind CSS v4** (CSS-first config via `@tailwindcss/postcss`, no `tailwind.config.js` — tokens live as `@theme` in `globals.css`) |
| Language       | TypeScript (strict), ESM                                     |
| Fonts          | `next/font/google`: Cinzel (display), Cormorant Garamond (serif), Amiri (Arabic) |
| State / data   | **Client-only.** No database. RSVP + guestbook persist to `localStorage`. Lang preference in `localStorage`. |

No backend, no API routes, no server actions today. Everything is static
(`/`, `/_not-found`, `/admin` all prerender).

---

## 3. Directory map

```
src/
├── app/
│   ├── layout.tsx        # Root layout: fonts, metadata, providers, global fx
│   ├── globals.css       # Tailwind v4 @theme tokens + all custom CSS/animation
│   ├── page.tsx          # Home — composes the landing sections in order
│   └── admin/page.tsx    # Private RSVP dashboard (password-gated, client-side)
├── components/
│   ├── LangProvider.tsx  # EN/AR context (useSyncExternalStore + localStorage)
│   ├── SmoothScroll.tsx  # Lenis wrapper
│   ├── Cursor.tsx        # Custom cursor
│   ├── FilmGrain.tsx     # Full-screen grain overlay
│   ├── Preloader.tsx     # Intro/loader gate
│   ├── Envelope.tsx      # Animated wax-seal envelope "open the invitation"
│   ├── Navbar.tsx        # Section nav + language toggle
│   ├── Hero.tsx          # Couple names + CTA
│   ├── Story.tsx         # Narrative copy block
│   ├── Portrait.tsx      # Couple photo + quote
│   ├── Details.tsx       # When/where + Google Maps links
│   ├── DressCode.tsx     # Color swatch palette (tap-to-copy hex)
│   ├── RSVP.tsx          # Attendance form → localStorage
│   ├── Guestbook.tsx     # Wishes form + list → localStorage
│   ├── Calendar.tsx      # Add-to-calendar (Google / Apple .ics / Outlook)
│   ├── CountdownStrip.tsx# Sticky countdown to the event ISO
│   ├── Petals.tsx        # Falling petals + sparkles (respects reduced-motion)
│   ├── MusicPlayer.tsx   # Ambient music toggle (reads /public/music.mp3)
│   └── Footer.tsx
└── lib/
    ├── content.ts        # ★ Single source of truth for ALL copy, EN + AR
    ├── rsvp.ts           # RSVPStore: localStorage CRUD + CSV export for RSVPs
    └── guestbook.ts      # GuestbookStore: localStorage CRUD for wishes
```

All client data lives in versioned `localStorage` keys (admin auth uses
`sessionStorage`): `mo_rsvp_v1`, `mo_guestbook_v1`, `mo_lang_v1`,
`mo_admin_auth_v1` (session). Bump the `_v1` suffix to migrate schema.

---

## 4. The most important convention

**`src/lib/content.ts` is the single source of truth for every user-facing
string.** It exports `EVENT` (language-neutral event data), `DRESS_CODE`
(swatch rows), a `Dict` type, and `CONTENT: Record<Lang, Dict>` with full EN
and AR translations, including functions like
`confirmation(name, total)` and `countMany(n)`.

- **Never hardcode copy inside components.** Components consume it via
  `const { t, lang } = useLang()` and read e.g. `t.rsvp.title`, `EVENT.dateLong[lang]`.
- When you add a section/feature, add its copy to **both** `en` and `ar` in
  `content.ts` first, then wire the component to it.
- Arabic is RTL; `LangProvider` sets `<html dir>` automatically. Components
  flip direction with `dir={lang === "ar" ? "rtl" : "ltr"}` where needed.

---

## 5. Event data anchor

`EVENT.iso = "2026-09-13T19:00:00"` (local Cairo time, no offset) drives the
`CountdownStrip` and the `.ics`/Google-calendar builders. Change it in one
place (`content.ts`) if the date ever moves.

---

## 6. Admin / RSVP dashboard

`/admin` is a **client-side, password-gated** dashboard that reads the same
`localStorage` RSVP entries the public form writes. Features: stats, search,
CSV export, per-row delete, clear-all. Password is checked client-side (it is
obfuscation, not real security — acceptable for this use case). See
`CONTENT.admin` for all its copy.

---

## 7. Git state & history (as of last session)

- Single branch: `master`.
- **1 commit exists:** `2aceb4b feat: Marina & Onur engagement invitation site`.
- **Uncommitted work on top of it** (modified + untracked files):
  - `src/app/globals.css`       (+27 lines — extra animation/utility CSS)
  - `src/app/page.tsx`          (+6 — new sections wired in)
  - `src/components/Navbar.tsx` (+3 — nav entries)
  - `src/lib/content.ts`        (+66 — guestbook + other new copy)
  - `src/components/Guestbook.tsx`  (new)
  - `src/components/MusicPlayer.tsx`(new)
  - `src/components/Petals.tsx`     (new)
  - `src/lib/guestbook.ts`          (new)
- **Goal:** commit this WIP so there is a real history before refactoring.
- No remote push has been confirmed yet — verify `git remote -v` before any push.

> The user wants to **commit the current working state** (and ideally push to
> GitHub) to establish history **before** doing the "make it more advanced"
> pass, so the basic version is preserved.

---

## 8. Verification commands (safe — they terminate)

```bash
npm run build   # full type-check + static build. PASSES cleanly today.
npm run lint    # eslint (flat config: eslint.config.mjs)
```

**Do NOT run `npm run dev` / `next dev` / `next start` from the agent** — see
`AGENTS.md → Project workflow rules`. Ask the user to run it and report back.

If a stray dev server is suspected, before finishing run:
`Get-Process node | Stop-Process -Force`.

### Known environment gotchas
- Shell is **Windows PowerShell 5.1**. `npm` is a `.cmd` shim, so
  `Start-Process -FilePath "npm"` fails with "%1 is not a valid Win32 application".
  Don't try to background-launch the dev server that way.
- Build is verified healthy: `/`, `/_not-found`, `/admin` all prerender.

---

## 9. Current goal — "make it less basic / more advanced"

The current site works but feels **basic** to the user. Reference material
already gathered from `https://github.com/topics/digital-invitation` — most
relevant repos (similar stacks):

| Repo | Stack | Worth borrowing |
| ---- | ----- | --------------- |
| **Holymaiden/wedding-app** | Next 15 + TS + Framer Motion + Tailwind | Letter-opening animation, realtime countdown, music, i18n — closest match |
| **AtsukoAditia/adaundangan-msr** | Next + Vercel + Google Sheets | Real RSVP backend (sheets) — could replace localStorage |
| **aliyaaramli/digital-invitation-template** | Next | Countdown + Maps + contact toggles |
| **DanangRds26/eunola** | Next + TS + Tailwind | Storytelling/Indonesian-cultural polish |
| **Miftahussalam/wedding** | JS (59 stars) | Mature feature set, gift/wallet, comments |
| **cybertiwari/WeddingInvitation** | CSS | Media integration, animations |
| **lucianofedericopereira/my-wedding** | Vanilla JS | Pure-CSS falling petals (we already have `Petals.tsx`) |

Candidate next-step ideas (discuss with user before building):
- Photo **gallery / lightbox** section
- **Real backend** for RSVP + guestbook (Google Sheets via Apps Script, or a
  Vercel serverless/Route Handler + DB) so hosts actually see responses
- **Streaming / countdown-to-live** + "event has begun" state
- Share-to-WhatsApp + "add to wallet" pass
- Per-guest named invitation URLs (`/?to=Name`) auto-filling RSVP
- More cinematic section transitions / scroll-driven storytelling

---

## 10. Style / code conventions

- TypeScript, strict. `"use client"` at the top of every interactive component.
- Animation easing reused project-wide: `const easeLuxe = [0.16, 1, 0.3, 1] as const;`
- Design tokens are CSS custom properties under Tailwind v4 `@theme` in
  `globals.css` (e.g. `--color-old-gold`, `--color-espresso`, `--color-cream`).
  Tailwind utilities like `text-mocha`, `bg-cream`, `border-old-gold` derive
  from them.
- Font variables: `--font-cinzel` (display), `--font-cormorant` (serif),
  `--font-amiri` (Arabic). Utility classes `font-display`, `font-serif`.
- Bilingual-safe: any user text comes from `content.ts`; numeric/date
  formatting uses `toLocaleDateString(locale, …)` with `locale = lang === "ar" ? "ar-EG" : "en-GB"`.
- localStorage keys are versioned (`mo_*_v1`) to allow future migrations.
- **Do not add code comments** unless the user asks (per global agent rules).

---

## 11. Quick orientation checklist for a fresh session

1. Read this file + `AGENTS.md`.
2. `npm run build` to confirm the tree is healthy.
3. Skim `src/lib/content.ts` (all copy) + `src/app/page.tsx` (section order).
4. `git status` / `git log --oneline` to see the WIP vs the single commit.
5. Only then: ask the user which goal to pursue (commit history vs. advanced pass).
