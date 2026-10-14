---
name: do-work
description: Execute one phase of work end-to-end — understand, implement, validate, commit. Use when the user says "do work", "execute phase N", or is working off a plan in plans/.
---

# Do Work

One phase, one commit. Never mix phases.

## 1. Understand
- Read the PRD and plan from `plans/<YYYY-MM-DD>/` if there is one; identify the exact phase
- Read only the relevant code (Grep/Read) — not the whole repo
- Ambiguous, or a business fact is missing (copy, contacts, prices)? Stop and ask before writing code
- Record the `tsc` baseline: `npx tsc --noEmit 2>&1 | grep -c "error TS"`

## 2. Implement
- Invoke `fe-conventions` first — don't recall it from memory
- Follow existing patterns in `src/components/` and `src/routes/`. No speculative abstractions, no drive-by refactors

## 3. Validate
Invoke `verify-before-done`. Paste the actual output.

## 4. Commit
```bash
git status
git add <specific files>        # NEVER -A / .
git commit -m "<type>(<scope>): <summary>"
```
English, conventional (`feat`, `fix`, `refactor`, `chore`, `docs`), under 70 chars. Include plan/PRD files when they changed. No co-author tags, no `--amend`, no `--no-verify`. The hook runs `use-personal` automatically.

## 5. Handoff
Say which phase is done, what's left in the plan, and whether `/clear` makes sense before the next phase.
