---
name: adversarial-review
description: Cross-model adversarial review. Codex reviews the target through one to three lenses in parallel from packets Claude writes; Claude does not review — it verifies every finding against real code before it counts and reconciles one verdict. Two modes — `plan` (PRD + plan, before any code is written) and `code` (branch diff, before the PR). Read-only and advisory. Use when the user says "/adversarial-review", "adversarial review", "second opinion", "have codex review this", or asks to stress-test a plan or a diff with another model.
disable-model-invocation: true
---

# Adversarial Review

Codex reviews the target independently through one or more lenses; you verify what it found and reconcile it into one verdict. **You do not review.** No Claude reviewer sub-agents — your job is the packet, the verification, and the report.

## Non-negotiables

- **Read-only.** Never edit, commit, push, or open a PR from this skill.
- **Advisory.** The verdict goes to Victor. This is never a stop gate and never auto-fixes.
- **Codex is the only reviewer.** Never spawn a Claude sub-agent to review, and never substitute one when Codex fails — a sub-agent shares your weights and therefore your blind spots. A Codex failure is recorded as a failure, not papered over.
- **Codex lenses are one model, not several.** Two lenses agreeing is corroboration, not cross-model consensus.
- **A reviewer that produced no output is a reviewer FAILURE, recorded in the verdict.** Never silently drop it, never let a clean exit code stand in for a PASS.
- **Every finding is verified before it counts** (step 6). Skipping this turns cross-model review into a machine for laundering one model's hallucination through the other.

## Mode

`plan` — target is the PRD + plan pair. Run after `/prd-to-plan-generic`, before any code.
`code` — target is the branch diff. Run after `/verify-before-done`, before `/code-review` and `/pr`.

If the user didn't say which, infer from what's in context and state your choice in one line.

## 1. Pin the target

**plan:** `plans/<YYYY-MM-DD>/<topic>-design.md` and `plans/<YYYY-MM-DD>/<topic>-plan.md`. Ask if not in context.

**code:** the fixed point, default `main` — or `--uncommitted` for a working tree that isn't committed yet. The script fails fast on an unresolvable ref and on an empty diff (`status=emptydiff`), so a bad target dies before any quota is spent. It also folds untracked files into the diff as `/dev/null` → file hunks, and warns when `--base` is used against a dirty tree. Sanity-check the target yourself first anyway:

```bash
git rev-parse <fixed-point> && git diff --stat <fixed-point>...HEAD
```

## 2. State the intent

One paragraph, **copied from the PRD (or, with no PRD, from the GitHub issue or the user's own request) — not improvised**. It goes verbatim into every packet.

Reviewers challenge whether the work **achieves the intent well**, never whether the intent is correct. Without this fence, an adversarial reviewer relitigates the request instead of reviewing the work. The cost of the fence is that whoever writes the intent controls the framing — which is exactly why it is copied, not written.

## 3. Size the review

**code mode** — scale Codex lenses to blast radius:

Take the **larger** of the two axes — a 40-line change across 6 files is a 3-lens review, and so is a 900-line change in one file. Boundaries are inclusive on the upper tier. Don't count `yarn.lock` or binary assets toward lines.

| Changed lines | Changed files | Lenses |
|---|---|---|
| < 50 | ≤ 2 | Skeptic |
| 50–199 | 3–4 | Skeptic + Architect |
| ≥ 200 | ≥ 5 | Skeptic + Architect + Minimalist |

**plan mode** — lines and files don't exist yet, so size by the plan itself:

Again take the larger axis — one phase that adds a route is a 2-lens review.

| Phases | Blast radius | Lenses |
|---|---|---|
| ≤ 2 | content/copy or a single section | Skeptic |
| 3–5 | a new route, a `Theme.ts` change, a catalog data-shape change, or a new third-party embed | Skeptic + Architect |
| ≥ 6 | a framework/build migration or a site-wide restructure | Skeptic + Architect + Minimalist |

- **Skeptic** — correctness and completeness. What inputs, states, or sequences break this? Where is "it works on my machine" standing in for verification? What error, empty, and edge states are unhandled — missing catalog category, broken GCS image URL, deep link to `/catalogo/:category_id` on Netlify, phone width?
- **Architect** — structural fitness. Does the design serve the stated goal, or a goal the author assumed? Where are the coupling points that hurt when requirements shift? Does it fit the existing `routes/` → `components/<Page>/` layout and the theme, or fight it?
- **Minimalist** — necessity. What can be deleted without losing the stated goal? Which abstractions exist for a single call site? Is this the simplest path, or the one that felt most thorough?

In `plan` mode the lenses apply to the design: Skeptic hunts unhandled cases and unverifiable acceptance criteria, Architect hunts wrong seams and phase ordering, Minimalist hunts scope that isn't in the request.

## Where the artifacts go

Durable artifacts sit next to the plan they review, in a per-topic folder — reuse it across days rather than opening a new one per date. A `code` review with no plan (bug-fix path) uses the branch name as `<topic>` under today's date.

```
plans/<YYYY-MM-DD>/                     <- dated by when the work STARTED
  <topic>-design.md  <topic>-plan.md
  <topic>-reviews/
    r1-skeptic-packet.md                <- what the reviewer was asked
    r1-codex-skeptic.md                 <- what it answered
    r1-report.md                        <- the reconciled verdict
    r2-…                                <- a second round never reuses r1 names

.claude/runs/<topic>-r<N>/              <- transient; never committed
  *.events.jsonl  *.stderr.log  *.diff  *.files.txt  *.prompt.md
```

`plans/` is committed, so `<topic>-reviews/` goes in with the plan — this skill never commits it itself.

Every artifact in a round carries its `r<N>` prefix. Rounds that invent their own naming leave a folder nobody can read six months later.

The run dir holds only what the helper needs mid-run. On `status=ok` the script deletes it — a passing review's event log is 1 MB of nothing. **Every failing status keeps it**, which is what the reviewer-failure entry in the verdict cites and where `codex exec resume <session-id>` reads from. Pass `--keep-run` to retain it on success too; never point `--run-dir` outside the repo, since Codex reads the diff from there under a read-only sandbox.

## 4. Build the packet

Write **one shared body**, then one packet per lens with that lens's text spliced into the role section.

Packets go to `plans/<YYYY-MM-DD>/<topic>-reviews/r<N>-<role>-packet.md` — see "Where the artifacts go" above. The reviewer gets a curated packet, not a pointer — it should need zero exploration turns to start.

```markdown
You are an adversarial reviewer. Your job is to find real problems, not to validate the work.

## Intent (fixed — do not challenge this)
<the paragraph from step 2>

## Your role
<the full lens text from step 3 — not a summary, one lens per packet>

## Conventions this must satisfy
<PASTE THE FILE CONTENTS of .claude/skills/fe-conventions/SKILL.md and the
 "Core Rules" + "Known debt" sections of CLAUDE.md —
 file contents, not summaries, not paths>

## Already known — do not re-report
<findings fixed in prior rounds, and anything the user has already ruled on.
 Omit this section on a first round.>

## Target
<plan mode: the full PRD + plan text>
<code mode: omit — the helper appends a pointer to the materialised diff and the
 changed-file summary.>

## Rules
- Cite file:line and a concrete failure scenario for every finding.
- Rate each finding: high (blocks ship) / medium (should fix) / low (worth noting).
- Say explicitly when you could not verify a claim against real code, a test, or command output.
- Flag pre-existing problems separately from problems this change introduces. Items under
  "Known debt" in the conventions are pre-existing by definition.
- Skip anything `yarn run check` (`astro check`) already reports. There is no linter, so
  lint-class bugs (e.g. an unused variable hiding a logic error) ARE in scope.
- Prose nits and wording preferences are not findings. A finding must name a scenario
  in which an agent or a human does the wrong thing. pt-BR UI copy is a business decision,
  not a finding.
- Write findings as a numbered markdown list.
- The LAST line of your output must be exactly `VERDICT: PASS`, `VERDICT: CONTESTED`,
  or `VERDICT: REJECT`. Write nothing after it — the helper checks that final line and
  reports `status=noverdict` if anything else is there.
```

## 5. Spawn the Codex lenses in parallel

One script run per lens, all launched in the same turn. **Launch each with the Bash tool's `run_in_background: true`.** The script polls in the foreground until Codex finishes; a foreground Bash call is SIGTERM'd at Claude Code's 600s cap, killing the supervisor before it can report a status. If that happens anyway, recover with `codex exec resume <session-id>` using the id the script printed on its first line.

```bash
R=plans/<YYYY-MM-DD>/<topic>-reviews   # durable
W=.claude/runs/<topic>-r<N>            # transient, shared by the whole round

.claude/skills/adversarial-review/scripts/codex-review.sh \
  --mode plan --prompt-file $R/r<N>-<lens>-packet.md --out $R/r<N>-codex-<lens>.md --run-dir $W

.claude/skills/adversarial-review/scripts/codex-review.sh \
  --mode code --base main --prompt-file $R/r<N>-<lens>-packet.md --out $R/r<N>-codex-<lens>.md --run-dir $W

.claude/skills/adversarial-review/scripts/codex-review.sh \
  --mode code --uncommitted --prompt-file $R/r<N>-<lens>-packet.md --out $R/r<N>-codex-<lens>.md --run-dir $W
```

Give every reviewer in a round the **same** `--run-dir` so one round's evidence stays together; omitting it scatters each reviewer into its own timestamped dir. `--prompt-file` is required in **both** modes. `--base <branch>` reviews the merge-base diff; `--uncommitted` reviews the working tree including untracked files; they are mutually exclusive. Either way the script materialises the diff to a file next to the output and points the reviewer at it, so Codex never has to run git inside its sandbox.

**Model and reasoning effort are fixed at launch** — chosen once per run, never renegotiated mid-review, and identical in an interactive session and a headless one:

| | Default | Override |
|---|---|---|
| Codex model | `gpt-5.6-sol` | `--model M` or `CODEX_REVIEW_MODEL` |
| Codex effort | `high` | `--effort minimal\|low\|medium\|high\|xhigh` or `CODEX_REVIEW_EFFORT` |

The script echoes `model=` and `effort=` on its first lines — put both in the report header so a review can be reproduced. Effort reaches Codex as `-c model_reasoning_effort="<E>"`, which overrides `~/.codex/config.toml` for that run only.

Do **not** reach for `codex exec review` directly: it refuses a custom `PROMPT` alongside `--base`, `--uncommitted`, or `--commit` (verified on 0.147.0), so it cannot carry a review packet and cannot be told to emit a verdict line.

The script handles the documented `codex exec` traps — the non-TTY stdin hang, exit-0-with-empty-output, a turn that completes without actually reviewing, and a verdict token quoted back inside a refusal — and prints `session_id=` plus a final `status=`. **Only `status=ok` counts as a completed review**; `empty`, `failed`, `stalled`, `noverdict` and `emptydiff` are all reviewer failures and go in the verdict as such — cite the surviving `run_dir=` path as the evidence. `status=stalled` is recoverable with `codex exec resume <session-id>`. There is no flag that turns the verdict check off.

Conventions are not a lens here — they go into the packet so every lens can cite them, and in `code` mode `/code-review` runs next in the pipeline.

## 6. Verify every finding

Before anything enters the report, check each claimed finding against reality — read the cited lines, run the cited command (`yarn run check`, `yarn test`, `yarn build`), reproduce the failure. A finding you cannot substantiate is **dropped**, not softened. A finding you *did* reproduce says so. A purely visual claim you can't settle from the code goes to Plausible for Victor — don't open images to check it.

This is the step that makes the whole thing worth running. It is also the step it is most tempting to skip.

## 7. Reconcile

| Bucket | Rule | Action |
|---|---|---|
| **Reproduced** | Survived verification and you reproduced the failure (ran it, or traced it line by line) | Fix list, ordered by severity |
| **Plausible** | Survived verification but you could not fully reproduce it | Adjudicate by reading the code; say what would settle it |
| **Rejected** | False positive, style-as-substance, out of scope, or unverifiable | List it **with a one-line reason** |

Note which lenses raised each finding. Several lenses agreeing is corroboration from one model, not proof. Order the fix list by **severity**, not by bucket.

Normalise the **remedy**, not just the symptom — two lenses agreeing on the bug while naming different fixes is how a real bug ships unfixed. One canonical instruction per finding.

Never average lens verdicts. A disagreement between lenses is signal: investigate the disputed gap.

## 8. Report

```
## Adversarial review: <target>

**Intent:** <one line>
**Reviewers:** codex/<model>@<effort>(<lenses>) — <status per lens>

### Reproduced
1. <file:line> — <what> · <why it breaks> · <the one canonical fix> · raised by <lenses> · [high|medium|low]

### Plausible (needs your call)
1. <file:line> — <what> · raised by <lenses> · <your adjudication> · [high|medium|low]

### Rejected
- <finding> — <one-line reason>

### What went well
- <1–3 things the reviewers found no issue with>

### Verdict
PASS | CONTESTED | REJECT   (+ reviewer failures, if any)
```

`PASS` = no high-severity findings. `CONTESTED` = high-severity findings only in Plausible. `REJECT` = at least one Reproduced high-severity finding.

Write the report to `plans/<YYYY-MM-DD>/<topic>-reviews/r<N>-report.md` **with the Write tool**, not `cat`/`>`, so the `detect-secrets` hook sees it. `.claude/runs/` is transient by design — a failed reviewer's evidence must be quoted into the report before the run dir is cleaned up.

## Round 2 — optional, at most one

Only after fixes land, and only re-checking unresolved **high** findings. Put everything already fixed into the packet's "Already known — do not re-report" section; without it, round 3 relitigates round 1. Compare blocking-finding counts: if the count is flat or rising *at constant coverage*, the loop is not converging — stop and escalate to Victor rather than spend another round. A round that adds lenses or starts executing what it previously only read will legitimately find more; say which it was. A round that ends on budget is "done trying", not "done".

## Cost

Codex auth here is ChatGPT-token based, so each run consumes plan quota, not API credits — and `gpt-5.6-sol` at `high` costs meaningfully more than the balanced tier. Every headless run also fires the hooks in `~/.codex/hooks.json`. Reserve this for plans and meaningful diffs — not for a one-file change or a copy tweak. Drop `--effort` to `medium` for a routine pass.
