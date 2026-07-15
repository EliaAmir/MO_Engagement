# Project context
Read **`CONTEXT.md`** first — it explains what this project is, the stack,
directory map, conventions, current WIP, and goals. Keep it in sync when the
architecture changes.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-workflow-rules -->
# Project workflow rules

## Do NOT run the dev server / project
Never run `npm run dev`, `next dev`, or otherwise start the app yourself. The
shell tool reliably times out on long-running processes and leaves stray `node`
processes holding port 3000. Instead, **tell the user what to check** (e.g.
"run `npm run dev` and open http://localhost:3000") and let them verify.

The same applies to `next start`. Static verification via `npm run build`,
`npm run lint`, and reading the code is fine — those terminate on their own.

If you ever leave a stray dev server running by mistake, kill `node` before
finishing (`Get-Process node | Stop-Process -Force`).
<!-- END:project-workflow-rules -->
