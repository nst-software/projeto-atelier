---
name: pr
description: |-
  Open a pull request for the current feature branch following repo conventions.
  Use when the user says "/pr", "create pr", "open a PR", "ship it", "let's PR this",
  or asks to push the current branch up for review.
---

# Create a PR

## 1. Gather context (parallel)
- `git status`
- `git diff main...HEAD`
- `git log main..HEAD --oneline`
- `git rev-parse --abbrev-ref HEAD`

On `main`? STOP — tell the user to create a feature branch.

## 2. Commit leftovers
Atomic commits, specific files only (never `-A`/`.`), English conventional messages. Skip secrets and large media. Never amend, never `--no-verify`.

## 3. Push
`git push -u origin HEAD`. Never force-push. The hook switches to the personal identity (`use-personal`).

## 4. Title + body
**Title**: `<type>(<scope>): <summary>`, English, under 70 chars.

**Body** (no template in repo):
```
## Summary
- 1–3 bullets: what changed and why, covering all commits on the branch

## Plan
plans/<date>/<topic>-plan.md, phase N — or "none: <one-line reason>"

## Test plan
- [x] only checks actually performed (tsc count, yarn build, UI paths exercised)

## Screenshots
<!-- UI PRs only; delete otherwise -->

## Out of scope / follow-ups
- none
```
Never tick a box for a check that wasn't run. UI PR → tell the user to paste screenshots.

## 5. Create
```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
<body>
EOF
)"
```

## 6. Return the URL and stop
Don't merge, don't comment, don't watch CI. Merge only on an explicit "merge".

## Hard rules
No co-author tags or "Generated with" footers. No mention of `.claude/`, skills or plan tooling beyond the plan file link.
