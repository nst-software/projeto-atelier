---
name: verify-before-done
description: Evidence gate before claiming work is complete. Run the feedback loops, paste the actual output, only then mark done. Use when the user says "verify", "is it done?", or before any /do-work commit.
---

# Verify Before Done

No "should work". Run the commands, paste the output, then declare done.

## Commands
```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"   # compare with the count recorded before editing
yarn build
```
`yarn lint` is broken — skip it and say so.

**UI changed:** `yarn dev`, exercise the golden path + one edge case (mobile width included — layout uses `theme.breakpoints.down("sm")`). Report what you did and saw. "I can't test the UI" is valid; "it should work" is not. Don't open screenshots to check visuals — Victor does that.

## What to paste
- Exact command run
- Result: error count / PASS / exit code
- Failures: first 20 lines of the error

## Failure policy
Don't mark done, don't `--no-verify`, don't comment out the check. Fix the root cause and re-run everything.

## Done template
```
Verification:
- tsc errors   → N (baseline N)
- yarn build   → PASS
- UI           → <what was exercised> | not tested (why)
Status: ready to commit / ready for review
```
