# Project Context — Onur & Marina Engagement Invitation

> Read this first if you are a new session / different AI picking up this project.
> It explains **what the project is, how it is built, where everything lives,
> and what is open/in-progress**. Keep it in sync when the architecture changes.

`AGENTS.md` holds the hard rules (Next.js version caveat, do-not-run policy).
This file holds the **soft context** (domain, structure, history, goals).

> Note: the repo/folder is still named `Marina_Engagement`, but the couple is now
> displayed as **Onur & Marina** (order flipped intentionally; monogram **O&M**).

---

## 1. What this is

A bilingual (English / Arabic) **digital engagement invitation** website for
**Onur & Marina**, an engagement party in Cairo. It is a single marketing-style
landing page plus a private admin dashboard. The aesthetic is **"Midnight &
Gold" dark luxe** (default) with a **light mode** that restores the original
cream/espresso/gold look — toggleable via a sun/moon button. Serif typography,
a wax-seal envelope that opens on scroll, falling petals, film grain, smooth
Lenis scroll, and motion (Framer Motion) throughout.

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
| Theming        | **CSS-variable light/dark** via `data-theme` on `<html>` (see §10) |
| Language       | TypeScript (strict), ESM                                     |
| Fonts          | `next/font/google`: Cinzel (display), Cormorant Garamond (serif), Amiri (Arabic) |
| State / data   | **Client-only.** No database. RSVP + guestbook persist to `localStorage`. Lang + theme preferences in `localStorage`. |

No backend, no API routes, no server actions today. Everything is static
(`/`, `/_not-found`, `/admin` all prerender).

---

## 3. Directory map

```
src/
├── app/
│   ├── layout.tsx        # Root layout: fonts, metadata, providers, global fx, pre-paint theme script
│   ├── globals.css       # Tailwind v4 @theme (dark) + [data-theme=light] overrides + surfaces + CSS
│   ├── page.tsx          # Home — composes the landing sections in order
│   └── admin/page.tsx    # Private RSVP dashboard (password-gated, client-side)
├── components/
│   ├── LangProvider.tsx  # EN/AR context (useSyncExternalStore + localStorage)
│   ├── SmoothScroll.tsx  # Lenis wrapper
│   ├── ThemeToggle.tsx   # ★ Light/dark sun-moon button (sets <html data-theme>, persists)
│   ├── Cursor.tsx        # Custom cursor (z-[10001], above preloader)
│   ├── FilmGrain.tsx     # Full-screen grain overlay (.film-grain uses --grain-blend)
│   ├── Preloader.tsx     # Loader gate → "Open the invitation" button (click unlocks audio)
│   ├── Envelope.tsx      # Wax-seal envelope scroll-open + invitation card; fires "mo:invite-opened"
│   ├── Navbar.tsx        # Section nav + ThemeToggle + language toggle
│   ├── Hero.tsx          # Couple names + CTA
│   ├── Story.tsx         # Narrative copy block
│   ├── Portrait.tsx      # Couple photo + quote (frame uses --surface-card)
│   ├── Details.tsx       # When/where + Google Maps links
│   ├── DressCode.tsx     # Color swatch palette (tap-to-copy hex)
│   ├── RSVP.tsx          # Attendance form → localStorage
│   ├── Guestbook.tsx     # Wishes form + list → localStorage
│   ├── Calendar.tsx      # Add-to-calendar (Google / Apple .ics / Outlook)
│   ├── CountdownStrip.tsx# Sticky countdown to the event ISO
│   ├── Petals.tsx        # Falling petals + sparkles (respects reduced-motion)
│   ├── MusicPlayer.tsx   # Ambient music: starts on "mo:invite-opened"; toggle mutes
│   └── Footer.tsx
└── lib/
    ├── content.ts        # ★ Single source of truth for ALL copy, EN + AR (couple = Onur & Marina)
    ├── rsvp.ts           # RSVPStore: localStorage CRUD + CSV export for RSVPs
    └── guestbook.ts      # GuestbookStore: localStorage CRUD for wishes
```

All client data lives in versioned `localStorage` keys (admin auth uses
`sessionStorage`): `mo_rsvp_v1`, `mo_guestbook_v1`, `mo_lang_v1`, `mo_theme_v1`,
`mo_admin_auth_v1` (session). Bump the `_v1` suffix to migrate schema.

---

## 4. The most important convention

**`src/lib/content.ts` is the single source of truth for every user-facing
string.** It exports `EVENT` (language-neutral event data, couple order
Onur-first), `DRESS_CODE` (swatch rows), a `Dict` type, and
`CONTENT: Record<Lang, Dict>` with full EN and AR translations, including
functions like `confirmation(name, total)` and `countMany(n)`.

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

## 7. Git state & history

- Single branch: `master`, tracking `origin/master`.
- **Remote:** `origin` = https://github.com/EliaAmir/MO_Engagement.git (HTTPS,
  auth cached via Git Credential Manager).
- Commit history (newest first):
  - `e8dd059 feat: light/dark mode toggle (Midnight & Gold <-> original light)`
  - `5c027a9 feat: music starts when letter opens (click-to-enter) + cursor above preloader`
  - `17cb412 fix: music starts on first gesture after letter opens (autoplay policy)`
  - `f4eb945 feat: bigger invitation card, Onur-first name order, music on letter open`
  - `d011859 fix: custom cursor invisible in Arabic (RTL)`
  - `b3c0065 fix: invitation card in frame + holder sinks; MusicPlayer key warning`
  - `7cd224c feat: redesign visual system to 'Midnight & Gold' dark luxe`
  - `295f0d5 docs: add project context and agent workflow rules`
  - `dcb3a83 feat: add guestbook, ambient music player, and falling petals`
  - `2aceb4b feat: Marina & Onur engagement invitation site`
- A "Terracotta & Garden" + "magazine snap-spreads" experiment was tried and
  **discarded** (reset back to `7cd224c`). It's recoverable via reflog if ever
  wanted (`git reset --hard 22343d3`).
- `public/music.mp3` is committed (the site's ambient track). A stray `Music/`
  folder (source/scratch audio, TikTok downloads) is intentionally **not** tracked.

---

## 8. Verification & workflow

```bash
npm run build   # full type-check + static build. PASSES cleanly today.
npm run lint    # eslint (flat config: eslint.config.mjs)
```

**Do NOT run `npm run dev` / `next dev` / `next start` from the agent** — see
`AGENTS.md → Project workflow rules`. Ask the user to run it and report back.
If a stray dev server is suspected, run `Get-Process node | Stop-Process -Force`.

**Commit & push practice:** the user wants the work mirrored on GitHub
continuously. After a change: `npm run build` → stage only intended files →
conventional commit → `git push origin master` → confirm clean. A formal
"push-after-every-change" rule once lived in `AGENTS.md` but was reverted; the
de-facto practice is still to push finished changes. Never force-push without
the user's OK. (HTTPS auth is cached, so normal pushes just work.)

### Known environment gotchas
- Shell is **Windows PowerShell 5.1**. `npm` is a `.cmd` shim, so
  `Start-Process -FilePath "npm"` fails with "%1 is not a valid Win32 application".
  Don't try to background-launch the dev server that way.
- Build is verified healthy: `/`, `/_not-found`, `/admin` all prerender.
- `mixBlendMode` in TS won't accept `var(...)` — use a CSS class
  (`.film-grain { mix-blend-mode: var(--grain-blend) }`) instead of an inline style.

---

## 9. Current status & open ideas

**Done recently:** Midnight & Gold redesign (dark), light/dark toggle, couple
order flipped to Onur & Marina, bigger/more-readable invitation card, music
auto-starts when the letter opens (click-to-enter unlocks browser autoplay),
cursor RTL fix, envelope card-in-frame/holder-sink fix.

Reference material gathered from `https://github.com/topics/digital-invitation`
(similar stacks): **Holymaiden/wedding-app** (Next+TS+Framer Motion — closest),
**AtsukoAditia/adaundangan-msr** (Next + Google Sheets RSVP), **Miftahussalam/wedding**
(most stars).

Candidate next steps (confirm with user before building):
- **Deploy** to Vercel (music.mp3 is now in the repo, so audio works in prod).
- **Real backend** for RSVP + guestbook (Google Sheets via Apps Script, or a
  Vercel Route Handler + DB) so hosts actually see responses.
- Photo **gallery / lightbox** section; per-guest named invite URLs (`/?to=Name`).
- The user previously wanted the invitation card to *emerge* from the envelope
  AND end centered — that geometry proved fiddly; revisit if requested.

---

## 10. Design system — light/dark theming

Design tokens live in `globals.css`. **Dark ("Midnight & Gold") is the default**
in `@theme`; **light mode** overrides the same variables under `:root[data-theme="light"]`.
Tailwind v4 utilities reference these vars, so flipping `<html data-theme>`
flips the whole site.

- ⚠️ **Token NAMES are historical, not semantic** — read the values, not the names:
  - Dark: `--color-espresso #f2ead6`, `--color-mocha #d9cdb2` are **LIGHT** (text on dark);
    `--color-onyx #0c0a12`, `--color-jet #06050a`, `--color-dark-choc #15121c` are dark surfaces;
    `--color-old-gold #d4af37` etc. are luminous gold.
  - Light: the same names get **dark** espresso/mocha, cream/ivory surfaces, warmer golds.
- **Component surfaces use dedicated vars** (NOT raw espresso/mocha, to avoid the
  text-vs-material dual-use trap): `--page-bg`, `--page-bg-image`, `--grain-blend`,
  `--surface-envelope`, `--surface-envelope-2`, `--surface-card`, `--surface-card-edge`,
  `--surface-seal`, `--panel-bg`, `--ghost-bg`, `--bar-bg`, `--bar-bg-strong`.
  Each has a dark and light value. Use these (or `bg-[var(--bar-bg)]`) for any new
  theme-aware surface; avoid hardcoded hexes.
- `.text-gradient-gold` = gold-foil heading; `.btn-gold` = gold bg + dark (`jet`) text;
  `.panel` = `--panel-bg` glass; `.btn-ghost` text = espresso (switches).
- `ThemeToggle.tsx` toggles `data-theme` + persists to `mo_theme_v1`; a pre-paint
  inline `<script>` in `layout.tsx` applies the stored theme before first paint (no FOUC).
- Font variables: `--font-cinzel` (display), `--font-cormorant` (serif), `--font-amiri` (Arabic).
- Animation easing reused project-wide: `const easeLuxe = [0.16, 1, 0.3, 1] as const;`
- Bilingual-safe: numeric/date formatting uses `toLocaleDateString(locale, …)` with
  `locale = lang === "ar" ? "ar-EG" : "en-GB"`.
- **Do not add code comments** unless the user asks (per global agent rules).

---

## 11. Quick orientation checklist for a fresh session

1. Read this file + `AGENTS.md`.
2. `npm run build` to confirm the tree is healthy.
3. Skim `src/lib/content.ts` (all copy) + `src/app/page.tsx` (section order).
4. `git status` / `git log --oneline` to see current state.
5. For any color change, remember it's a **two-theme** system — touch both the
   dark `@theme`/`:root` values and the `:root[data-theme="light"]` overrides.
