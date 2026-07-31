# Project Context — Onur & Marina Engagement Invitation

> Read this first if you are a new session / different AI picking up this project.
> It explains **what the project is, how it is built, where everything lives,
> and what is open/in-progress**. Keep it in sync when the architecture changes.

`AGENTS.md` holds the hard rules (Next.js version caveat, do-not-run policy).
`CLAUDE.md` holds the **task workflow** (read → plan → implement → build+lint →
commit/push → update this file). This file holds the **soft context** (domain,
structure, history, goals).

> Note: the repo/folder is still named `Marina_Engagement`, but the couple is now
> displayed as **Onur & Marina** (order flipped intentionally; monogram **O&M**).

---

## 1. What this is

A bilingual (English / Arabic) **digital engagement invitation** website for
**Onur & Marina**, an engagement party in Cairo. It is a single marketing-style
landing page plus a private admin dashboard. The aesthetic is a warm
**"Midnight & Gold" dark luxe** mode (the only theme — light mode was removed).
Serif typography,
a four-panel paper letter that unfolds on scroll, drifting sparkles, film grain, smooth
Lenis scroll, and motion (Framer Motion) throughout.

- **Event:** Sunday, September 13, 2026 · 7:00 PM
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
| Theming        | **CSS-variable dark theme only** ("Midnight & Gold") — no light mode (see §10) |
| Language       | TypeScript (strict), ESM                                     |
| Fonts          | `next/font/google`: Cinzel (Latin display), Cormorant Garamond (Latin serif), **Aref Ruqaa** (Arabic display), **Markazi Text** (Arabic body) |
| State / data   | **Client-only.** No database. RSVP attendance and wishes are collected via **Google Forms** (button links in the sections); legacy guestbook wishes persist to `localStorage`. Lang preference in `localStorage`. |

No backend, no API routes, no server actions today. Everything is static
(`/`, `/_not-found`, `/admin` all prerender).

---

## 3. Directory map

```
src/
├── app/
│   ├── layout.tsx        # Root layout: fonts, metadata, providers, global fx
│   ├── globals.css       # Tailwind v4 @theme (dark) + surfaces + CSS (no light mode)
│   ├── page.tsx          # Home — composes the landing sections in order
│   └── admin/page.tsx    # Private RSVP dashboard (password-gated, client-side)
├── components/
│   ├── LangProvider.tsx  # EN/AR context (useSyncExternalStore + localStorage)
│   ├── SmoothScroll.tsx  # Lenis wrapper
│   ├── Cursor.tsx        # Custom cursor (z-[10001], above preloader)
│   ├── FilmGrain.tsx     # Full-screen grain overlay (.film-grain uses --grain-blend)
│   ├── Preloader.tsx     # Loader gate → "Open the invitation" button (click unlocks audio)
│   ├── Envelope.tsx      # ★ Four-panel paper letter unfold + full-screen letter
│   │                     #   (copy + couple.jpeg); fires "mo:invite-opened"
│   ├── Navbar.tsx        # Section nav + language toggle
│   ├── Hero.tsx          # Couple names + CTA
│   ├── Story.tsx         # Narrative copy block
│   ├── Details.tsx       # When/where + Google Maps links
│   ├── DressCode.tsx     # Color swatch palette (tap-to-copy hex)
│   ├── RSVP.tsx          # ★ "Will You Join Us?" — button → Google Form (no local form)
│   ├── Guestbook.tsx     # ★ "Leave a Wish" — button → Google Form + legacy local wish list
│   ├── Calendar.tsx      # Add-to-calendar (Google / Apple .ics) — 2-up grid
│   ├── CountdownStrip.tsx# Sticky countdown to the event ISO
│   ├── Sparkles.tsx      # Drifting glowing sparkles (respects reduced-motion)
│   ├── MusicPlayer.tsx   # Ambient music: starts on "mo:invite-opened"; toggle mutes
│   └── Footer.tsx
└── lib/
    ├── content.ts        # ★ Single source of truth for ALL copy, EN + AR (couple = Onur & Marina)
    ├── rsvp.ts           # RSVPStore: localStorage CRUD + CSV export for RSVPs
    └── guestbook.ts      # GuestbookStore: localStorage CRUD for wishes
```

All client data lives in versioned `localStorage` keys (admin auth uses
`sessionStorage`): `mo_rsvp_v1`, `mo_guestbook_v1`, `mo_lang_v1`,
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

⚠️ The **weekday is not derived** — it is baked into six display strings
(`EVENT.dateLong` en/ar, `meta.description` en/ar, `envelope.cardBody` en/ar).
`2026-09-13` is a **Sunday / الأحد**; the site shipped "Saturday/السبت" until it
was corrected. If `iso` ever moves, update those six strings by hand to match.

---

## 5b. The intro letter (`Envelope.tsx`)

Scroll-driven, `h-[260vh]` with a `sticky top-0` viewport. Four panels cover the
screen and **all four part together** as you scroll — left, right, top and
bottom open over one unified range (`0.05→0.5`, rotating to ±104°) so the letter
unfolds outward from the centre cross in a single continuous motion (it is no
longer a two-stage left/right-then-top/bottom sequence). The panels fade out at
the tail of their rotation (`0.4→0.52`) as they pass edge-on. A gold heart seal
sits where the four folds meet and fades early (`0.05→0.15`) as they part. The
panels reveal a full-bleed letter: `couple.jpeg` fills the whole viewport as a
`next/image` `fill` cover (`sizes="100vw"`, `loading="eager"`; **`priority` is
deprecated in Next 16**) under a theme-agnostic dark scrim (layered radial vignette
+ vertical gradient, ~rgba(6,5,10,.5→.9)) for legibility, with the invitation copy
(eyebrow / "are getting engaged" / **Onur & Marina** gold-foil / date / venue)
overlaid and centered on top in cream + gold tones.

- **`mo:invite-opened`** fires exactly once (guarded by a ref) when scroll
  progress crosses `OPEN_AT = 0.05` — i.e. the moment the flaps begin parting,
  so music starts as the letter starts opening (not once it's fully open).
  `MusicPlayer` listens for it — do not rename or drop this event.
- **Reduced motion**: `prefers-reduced-motion` is resolved in an effect (not at
  render) so SSR output stays stable. When set, the panels are not rendered at
  all, the section collapses to `min-h-dvh`, the letter simply fades in, and
  `mo:invite-opened` fires on mount instead.
- The letter is a full-bleed photo background (absolute inset-0) with the
  invitation copy overlaid in a centered column (`max-w-2xl`, `text-center`,
  RTL-aware via `dir`). Text is cream + gold on the dark scrim so it reads in
  both light and dark themes; no 2-col photo/copy split anymore.
- `Portrait.tsx` was **deleted** — its photo now lives in the letter. Its copy
  block (`portrait.*`, incl. the "Two lives, one forever" quote) was removed from
  `content.ts`; `envelope.photoAlt` replaced `portrait.alt`. Nothing links to
  `#portrait`.

## 6. Admin / RSVP dashboard

`/admin` is a **client-side, password-gated** dashboard that reads the same
`localStorage` RSVP entries the public form used to write. (Attendance now goes
to Google Forms, so no fresh RSVP data lands here unless the form is ever
re-connected.) Features: stats, search, CSV export, per-row delete, clear-all.
Password is checked client-side (it is obfuscation, not real security —
acceptable for this use case). See `CONTENT.admin` for all its copy.

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

**Done recently:** **light mode removed** — the site is now single dark theme
("Midnight & Gold"); the `ThemeToggle`, pre-paint theme script, `mo_theme_v1`,
and `:root[data-theme="light"]` overrides are gone. Also done earlier:
RSVP ("Will You Join Us?") and guestbook ("Leave a Wish") inline
forms replaced with buttons that open **Google Forms** (RSVP → `forms.gle/3TE4zwnbXSHrD4C98`,
wishes → `forms.gle/mAHyjyQmh1PLxxT86`); Midnight & Gold redesign (dark),
couple order flipped to Onur & Marina, bigger/more-readable
invitation card, music auto-starts when the letter opens (click-to-enter unlocks
browser autoplay), cursor RTL fix, envelope card-in-frame/holder-sink fix.

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

## 10. Design system — dark-only theming

Design tokens live in `globals.css`. The **dark** ("Midnight & Gold") values are
the CSS base layer in `@theme` / `:root`. There is **no light mode** — light
mode was removed (the `:root[data-theme="light"]` block, `ThemeToggle.tsx`, the
pre-paint theme script, and `mo_theme_v1` are all gone). Tailwind v4 utilities
reference these vars directly, so every utility stays consistent.

- ⚠️ **Token NAMES are historical, not semantic** — read the values, not the names:
  - `--color-espresso #f2ead6`, `--color-mocha #d9cdb2` are **LIGHT** (text on dark);
    `--color-onyx #0c0a12`, `--color-jet #06050a`, `--color-dark-choc #15121c` are dark surfaces;
    `--color-old-gold #d4af37` etc. are luminous gold.
- **Component surfaces use dedicated vars** (NOT raw espresso/mocha, to avoid the
  text-vs-material dual-use trap): `--page-bg`, `--page-bg-image`, `--grain-blend`,
  `--surface-envelope`, `--surface-envelope-2`, `--surface-card`, `--surface-card-edge`,
  `--surface-seal`, `--panel-bg`, `--ghost-bg`, `--bar-bg`, `--bar-bg-strong`.
  `--sparkle-core`, `--sparkle-edge`, `--sparkle-halo`.
  Use these (or `bg-[var(--bar-bg)]`) for any new surface; avoid hardcoded hexes.
- `Sparkles.tsx` uses **two nested elements**: the outer one owns the fall + sway
  (`sparkle-drift`, transform + an opacity envelope), the inner one owns the
  continuous glint (`sparkle-shimmer`, opacity + scale). Nested opacity multiplies,
  so the sparkle shimmers the whole way down while still fading in/out at the edges.
  Animations are **transform/opacity only**; the glow is a static `box-shadow`.
- `.text-gradient-gold` = gold-foil heading; `.btn-gold` = gold bg + dark (`jet`) text;
  `.panel` = `--panel-bg` glass; `.btn-ghost` = ghost border button.
- `layout.tsx` metadata is **derived from `content.ts`** (`CONTENT.en.meta`, `EVENT`)
  rather than hardcoded, so date/venue/name edits propagate to SEO + OG tags.
  `viewport` = `themeColor: "#0c0a12"` (the dark `--page-bg`) + `colorScheme: "dark"`.
- Font variables: `--font-cinzel` (Latin display), `--font-cormorant` (Latin serif),
  `--font-aref` (Aref Ruqaa), `--font-markazi` (Markazi Text).
- **Arabic typography is switched by remapping the font *variables***, not by
  listing selectors: an unlayered `html[lang="ar"] { --font-display: var(--font-aref);
  --font-serif: var(--font-markazi); … }` block at the bottom of `globals.css`.
  Because the `font-*` utilities compile to `font-family: var(--font-…)`, and
  `.eyebrow` / `.btn-gold` / `.btn-ghost` reference those vars directly, one block
  switches every consumer. (The old selector-list approach missed the buttons and
  eyebrows, which fell back to Cinzel — a font with no Arabic glyphs.)
- Neither Arabic face has an italic, so `html[lang="ar"] *` forces
  `font-style: normal !important` alongside the existing `letter-spacing: 0 !important`,
  suppressing synthetic oblique. Arabic has no italic convention.
- Arabic weights loaded: Aref Ruqaa 400/700, Markazi Text 400 only — all 16
  `font-semibold` usages in the tree sit on display/heading elements, none on body serif.
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
5. **Single dark theme** — there is no light mode; colors live only in the
   dark `@theme`/`:root` values in `globals.css`.
