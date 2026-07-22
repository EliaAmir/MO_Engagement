@AGENTS.md

# Task workflow

Follow this for every task in this repo.

1. **Read first** — `CONTEXT.md`, `AGENTS.md`, `CLAUDE.md`, then the specific
   files the task touches. Verify current behavior in the code; never assume it.
2. **Plan** — restate the change as a short plan against the actual code before
   editing. Before touching any Next.js API, read `node_modules/next/dist/docs/`.
3. **Implement** the smallest coherent change. Preserve the invariants:
   - all user-facing copy lives in `src/lib/content.ts`, in **both** `en` and `ar`
   - every change works in **both** light and dark themes
   - RTL stays correct
   - reference design tokens by **value, not name** (the names are historical)
4. **Test** — run `npm run build` and `npm run lint` until both pass. Do **not**
   run the dev server (see `AGENTS.md`); instead output a short manual-QA
   checklist for the user to run under `npm run dev`.
5. **Commit & push** — one atomic commit per task, conventional-commit message,
   then `git push`. If no git remote is configured, stop and say so rather than
   guessing.
6. **Update `CONTEXT.md`** in the same commit so it stays the accurate source of
   truth.
