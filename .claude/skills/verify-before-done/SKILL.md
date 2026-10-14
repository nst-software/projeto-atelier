---
name: verify-before-done
description: Evidence gate before claiming work is complete. Run the feedback loops, paste the actual output, only then mark done. Use when the user says "verify", "is it done?", or before any /do-work commit.
---

# Verify Before Done

No "should work". Run the commands, paste the output, then declare done.

## Commands (Node 22)
```bash
yarn build                        # astro check → vitest run → astro build → audit:dist (head/sitemap/robots audit of dist), stops at the first failure
find dist -type f -size +500k     # must print nothing
grep -rnE "98442|3294|tecidosatelier@|instagram\.com|wa\.me|Av\. São Paulo|11 de Janeiro" src --exclude-dir=config   # must print nothing
```
For a quicker loop: `yarn run check` (types), `yarn test` (unit tests), `yarn build:only`, `yarn audit:dist`. The final evidence is always a full `yarn build`. There is no linter — say so, don't invent one.

**UI changed:** `yarn dev`, exercise the golden path + one edge case (phone width below `sm` 600px included; keyboard path for anything interactive, e.g. the header drawer: open, Tab cycle, Escape, focus back on the trigger). Report what you did and saw. "I can't test the UI" is valid; "it should work" is not. Don't open screenshots to check visuals — Victor does that.

**Catalog data changed:** `yarn check:urls` must print `ok <n>/<n>`.

**Redirects changed:** check the generated `dist/_redirects`, and test with `netlify dev` (applies `_redirects`), never `astro preview`.

## What to paste
- Exact command run
- Result: `astro check` error count / tests passed / build Complete / exit code
- Failures: first 20 lines of the error

## Failure policy
Don't mark done, don't `--no-verify`, don't skip or comment out a test or check. Fix the root cause and re-run everything.

## Done template
```
Verification:
- astro check  → 0 errors
- vitest       → N passed
- astro build  → Complete
- audit:dist   → head audit passed
- dist >500KB  → none
- UI           → <what was exercised> | not tested (why)
Status: ready to commit / ready for review
```
