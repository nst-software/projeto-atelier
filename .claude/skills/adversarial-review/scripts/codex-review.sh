#!/usr/bin/env bash
#
# codex-review.sh — drive Codex as a read-only reviewer from another agent.
#
#   codex-review.sh --mode plan --prompt-file P --out O [OPTIONS]
#   codex-review.sh --mode code --prompt-file P --out O (--base REF | --uncommitted) [OPTIONS]
#
# OPTIONS
#   --model M    model to review with          (default gpt-5.6-sol, env CODEX_REVIEW_MODEL)
#   --effort E   reasoning effort, fixed for   (default high,        env CODEX_REVIEW_EFFORT)
#                the whole run: minimal|low|medium|high|xhigh
#   --idle S     kill after S seconds with no output growth (default 300)
#   --force      overwrite an --out that holds content which is not a prior review
#   --run-dir D  where the transient sidecars go (default .claude/runs/<ts>-<stem>).
#                Pass one shared dir for every reviewer in a round. Keep it inside
#                the repo — Codex reads the diff from here under a read-only sandbox.
#   --keep-run   keep the sidecars even when the review succeeds
#
# Only --out is durable. The event log, stderr log, materialised diff, changed-file
# summary and effective prompt land in the run dir and are deleted on status=ok,
# because 94% of a review round's bytes are event logs nobody reads after it passes.
# Every failing status keeps them — that is the evidence a reviewer FAILURE is
# recorded from, and the session id for `codex exec resume` lives in the event log.
#
# Prints `session_id=<uuid>` as soon as Codex reports it, then a final
# `status=<ok|empty|failed|stalled|noverdict|emptydiff>` line. Exits 0 only on status=ok.
#
# This script polls in the foreground until Codex finishes. Callers MUST launch it
# with the Bash tool's run_in_background, or Claude Code's 600s cap kills the
# supervisor mid-review and the final status is never reported.

set -uo pipefail

usage() { sed -n '3,26p' "$0"; }

MODE=""
OUT=""
PROMPT_FILE=""
BASE=""
UNCOMMITTED=0
MODEL="${CODEX_REVIEW_MODEL:-gpt-5.6-sol}"
EFFORT="${CODEX_REVIEW_EFFORT:-high}"
IDLE=300
FORCE=0
RUN_DIR=""
KEEP_RUN=0

die() { echo "codex-review: $1" >&2; exit 2; }

# Resolve to an absolute, symlink-free path so `reviews/packet.md` and
# `reviews/./packet.md` compare equal.
canon() {
  local p="$1" d
  d=$(cd "$(dirname "$p")" 2>/dev/null && pwd -P) || { printf '%s' "$p"; return; }
  printf '%s/%s' "$d" "$(basename "$p")"
}

# The one definition of "this file ends in a real verdict". Used both to decide
# whether an existing --out is a prior review and to grade the finished one.
#
# Markdown emphasis around the verdict is fine; a code span is not. A reviewer
# writes `**VERDICT: PASS**`; a refusal quotes the instruction back as
# `` `VERDICT: PASS` ``, and that must not count.
verdict_line_ok() {
  local last
  last=$(grep -v '^[[:space:]]*$' "$1" 2>/dev/null | tail -1 | tr -d '*#[:space:]')
  printf '%s' "$last" | grep -qE '^VERDICT:(PASS|CONTESTED|REJECT)$'
}

while [ $# -gt 0 ]; do
  case "$1" in
    --mode)        [ $# -ge 2 ] || die "--mode needs a value"; MODE="$2"; shift 2 ;;
    --out)         [ $# -ge 2 ] || die "--out needs a value"; OUT="$2"; shift 2 ;;
    --prompt-file) [ $# -ge 2 ] || die "--prompt-file needs a value"; PROMPT_FILE="$2"; shift 2 ;;
    --base)        [ $# -ge 2 ] || die "--base needs a value"; BASE="$2"; shift 2 ;;
    --uncommitted) UNCOMMITTED=1; shift ;;
    --model)       [ $# -ge 2 ] || die "--model needs a value"; MODEL="$2"; shift 2 ;;
    --effort)      [ $# -ge 2 ] || die "--effort needs a value"; EFFORT="$2"; shift 2 ;;
    --idle)        [ $# -ge 2 ] || die "--idle needs a value"; IDLE="$2"; shift 2 ;;
    --run-dir)     [ $# -ge 2 ] || die "--run-dir needs a value"; RUN_DIR="$2"; shift 2 ;;
    --keep-run)    KEEP_RUN=1; shift ;;
    --force)       FORCE=1; shift ;;
    -h|--help)     usage; exit 0 ;;
    *)             die "unknown argument: $1" ;;
  esac
done

# ---------------------------------------------------------------------------
# Validate EVERYTHING before creating or truncating a single file. An earlier
# revision truncated --out first, so a typo in --mode destroyed the file it
# pointed at — and .claude/ is gitignored, so there was no way back.
# ---------------------------------------------------------------------------

case "$MODE" in
  plan|code) ;;
  "")        die "--mode is required (plan or code)" ;;
  *)         die "--mode must be plan or code, got '$MODE'" ;;
esac

[ -n "$OUT" ] || die "--out is required"
[ -n "$PROMPT_FILE" ] || die "--prompt-file is required for --mode $MODE"
[ -f "$PROMPT_FILE" ] || die "--prompt-file does not exist: $PROMPT_FILE"

[ -n "$MODEL" ] || die "--model must not be empty"

case "$EFFORT" in
  minimal|low|medium|high|xhigh) ;;
  *) die "--effort must be one of minimal|low|medium|high|xhigh, got '$EFFORT'" ;;
esac

case "$IDLE" in
  ''|*[!0-9]*) die "--idle must be a whole number of seconds, got '$IDLE'" ;;
esac
# The success path deletes the sidecars and rmdirs this directory. An empty value
# falls back to the default below; `/` must not.
case "$RUN_DIR" in
  /) die "--run-dir must not be /" ;;
esac
# An idle budget under half a minute kills healthy runs on their first quiet poll.
[ "$IDLE" -ge 30 ] 2>/dev/null || die "--idle must be at least 30 seconds, got '$IDLE'"
[ "$IDLE" -le 86400 ] 2>/dev/null || die "--idle must be at most 86400 seconds, got '$IDLE'"

if [ "$MODE" = "code" ]; then
  if [ -n "$BASE" ] && [ "$UNCOMMITTED" = "1" ]; then
    die "--base and --uncommitted are mutually exclusive; pick one target"
  fi
  [ -n "$BASE" ] || [ "$UNCOMMITTED" = "1" ] || die "--base REF or --uncommitted required for --mode code"
  command -v git >/dev/null 2>&1 || die "git not on PATH"
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "not inside a git work tree"
  if [ -n "$BASE" ]; then
    git rev-parse --verify "$BASE" >/dev/null 2>&1 || die "base ref '$BASE' does not resolve"
  fi
fi

command -v codex >/dev/null 2>&1 || die "codex not on PATH"
# jq parses the session id out of the event stream; without it every documented
# `codex exec resume` recovery path silently becomes unusable.
command -v jq >/dev/null 2>&1 || die "jq not on PATH (needed to read the session id)"

# Sidecar names come from the BASENAME. Deriving them from the whole path with
# ${OUT%.*} strips at the last dot anywhere in it, so an extensionless --out
# under .claude/ produced ".events.jsonl" in the CWD.
OUT_DIR=$(dirname "$OUT")
OUT_BASE=$(basename "$OUT")
STEM="${OUT_BASE%.*}"
# `.review` has no extension to strip, only a leading dot — ${x%.*} eats the whole name.
[ -n "$STEM" ] && [ "$STEM" != "." ] || STEM="$OUT_BASE"

# Only --out is durable, so only --out lands next to the packets and the report.
[ -n "$RUN_DIR" ] || RUN_DIR=".claude/runs/$(date +%Y%m%d-%H%M%S)-$STEM"
PREFIX="$RUN_DIR/$STEM"
LOG="$PREFIX.events.jsonl"
ERRLOG="$PREFIX.stderr.log"
DIFF_FILE="$PREFIX.diff"
FILES_FILE="$PREFIX.files.txt"

# In plan mode the packet IS the prompt — copying it to a sidecar produced a
# byte-for-byte duplicate of a 35 KB file for no reader. Only code mode has
# something to add (the pointer to the materialised diff).
if [ "$MODE" = "code" ]; then
  EFFECTIVE_PROMPT="$PREFIX.prompt.md"
  SIDECARS=("$LOG" "$ERRLOG" "$DIFF_FILE" "$FILES_FILE" "$EFFECTIVE_PROMPT")
else
  EFFECTIVE_PROMPT="$PROMPT_FILE"
  SIDECARS=("$LOG" "$ERRLOG")
fi

# Only a run that spent nothing or produced a complete review may throw its
# evidence away. Every failing status keeps the run dir — it is what a reviewer
# FAILURE is recorded from, and it holds the session id for `codex exec resume`.
# The plan-mode packet is never in SIDECARS, so this can never delete an input.
tidy_run() {
  if [ "$KEEP_RUN" = "1" ]; then
    echo "run_kept=1"
    return
  fi
  rm -f "${SIDECARS[@]}"
  rmdir "$RUN_DIR" 2>/dev/null
  echo "run_kept=0"
}

PROMPT_CANON=$(canon "$PROMPT_FILE")
for reserved in "$OUT" "${SIDECARS[@]}"; do
  [ "$(canon "$reserved")" = "$PROMPT_CANON" ] && die "--out or one of its sidecars ($reserved) resolves to --prompt-file ($PROMPT_FILE)"
done

# Refuse to clobber anything that is not itself a finished review. A bare
# `VERDICT:` token is not the test — packets and this script both contain one.
for target in "$OUT" "${SIDECARS[@]}"; do
  if [ -s "$target" ] && [ "$FORCE" = "0" ] && ! verdict_line_ok "$target"; then
    case "$target" in
      "$OUT") ;;
      *)
        # Sidecars of a previous run are ours to reuse; anything else with that
        # exact name is not.
        head -1 "$target" 2>/dev/null | grep -qE '^(\{|diff --git| M |\?\?|You are an adversarial reviewer|$)' && continue ;;
    esac
    die "'$target' already holds content that is not a prior review artifact; pass --force to overwrite"
  fi
done

# Snapshot the untracked set BEFORE creating any sidecar, or the script's own
# output files get enumerated as part of the change under review. Kept NUL-delimited
# in an array — git allows newlines in filenames and a newline-joined string splits them.
UNTRACKED_FILES=()
if [ "$MODE" = "code" ] && [ "$UNCOMMITTED" = "1" ]; then
  while IFS= read -r -d '' f; do
    UNTRACKED_FILES+=("$f")
  done < <(git ls-files --others --exclude-standard -z)
fi

mkdir -p "$OUT_DIR" || die "cannot create output directory $OUT_DIR"
mkdir -p "$RUN_DIR" || die "cannot create run directory $RUN_DIR"
for f in "$OUT" "$LOG" "$ERRLOG"; do
  : > "$f" || die "cannot write $f"
done

# ---------------------------------------------------------------------------
# Build the target and launch.
#
# `< /dev/null` is mandatory: codex exec hangs forever on an inherited non-TTY
# stdin with no writer, even when the prompt is a positional arg (codex#20919).
# ---------------------------------------------------------------------------

if [ "$MODE" = "code" ]; then
  # `codex exec review` refuses a custom PROMPT alongside --base/--uncommitted/--commit
  # (verified on 0.147.0), so it cannot carry a review packet. Materialise the diff
  # ourselves and drive plain `codex exec` instead — which also means the reviewer
  # never has to shell out to git inside the sandbox.
  if [ -n "$BASE" ]; then
    git diff "$BASE...HEAD" > "$DIFF_FILE" || die "cannot write $DIFF_FILE"
    { git diff --stat "$BASE...HEAD"; echo; git log "$BASE..HEAD" --oneline; } > "$FILES_FILE" || die "cannot write $FILES_FILE"
    if ! git diff --quiet HEAD 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
      echo "codex-review: WARNING — working tree is dirty; --base reviews committed work only." >&2
      echo "" >> "$FILES_FILE"
      echo "NOTE: the working tree was dirty at review time; uncommitted and untracked changes are NOT in this diff." >> "$FILES_FILE"
    fi
  else
    git diff HEAD > "$DIFF_FILE" || die "cannot write $DIFF_FILE"
    # git diff never reports untracked files. A tracer-bullet slice is mostly new
    # files, so without this the reviewer sees an empty or half-empty change.
    untracked=0
    for f in ${UNTRACKED_FILES+"${UNTRACKED_FILES[@]}"}; do
      git diff --no-index -- /dev/null "$f" >> "$DIFF_FILE"
      untracked=$((untracked + 1))
    done
    { git status --short; echo; git diff --stat HEAD; echo; echo "untracked files included in the diff: $untracked"; } > "$FILES_FILE" || die "cannot write $FILES_FILE"
  fi

  if [ ! -s "$DIFF_FILE" ]; then
    echo "status=emptydiff"
    echo "codex-review: nothing to review — the diff is empty." >&2
    tidy_run
    exit 2
  fi

  {
    cat "$PROMPT_FILE"
    printf '\n\n## Diff under review\n\nRead the unified diff at `%s` and the changed-file summary at `%s`. Newly added files appear in the diff as `/dev/null` → file hunks. Read any surrounding source you need to judge each hunk.\n' "$DIFF_FILE" "$FILES_FILE"
  } > "$EFFECTIVE_PROMPT" || die "cannot write $EFFECTIVE_PROMPT"
fi
[ -s "$EFFECTIVE_PROMPT" ] || die "the effective prompt is empty — refusing to spend quota on a blank review"

CODEX_ARGS=(exec --sandbox read-only -m "$MODEL" -c "model_reasoning_effort=\"$EFFORT\"" --json -o "$OUT")
[ "$MODE" = "plan" ] && CODEX_ARGS+=(--skip-git-repo-check)

echo "model=$MODEL"
echo "effort=$EFFORT"

# Prompt goes over stdin (`-`), never argv: codex-cli >= 0.154 SIGKILLs itself on a
# positional prompt over ~5 KB with empty stdout/stderr/events. A file has EOF, so
# the non-TTY stdin hang does not apply.
codex "${CODEX_ARGS[@]}" - \
  < "$EFFECTIVE_PROMPT" > "$LOG" 2> "$ERRLOG" &

PID=$!
SID=""
LAST_SIZE=0
LAST_CHANGE=$(date +%s)
STALLED=0

while kill -0 "$PID" 2>/dev/null; do
  if [ -z "$SID" ]; then
    SID=$(jq -r 'select(.type=="thread.started") | (.thread_id // .threadId // .id) // empty' "$LOG" 2>/dev/null | head -1)
    [ -n "$SID" ] && echo "session_id=$SID"
  fi
  # wc -c, not `stat -f %z` — the BSD form silently misbehaves on GNU coreutils
  # and freezes the watchdog into killing healthy runs.
  SIZE=$(wc -c < "$LOG" 2>/dev/null | tr -d ' ')
  NOW=$(date +%s)
  if [ "${SIZE:-0}" != "$LAST_SIZE" ]; then
    LAST_SIZE="${SIZE:-0}"; LAST_CHANGE="$NOW"
  elif [ $((NOW - LAST_CHANGE)) -ge "$IDLE" ]; then
    STALLED=1
    kill -TERM "$PID" 2>/dev/null
    break
  fi
  sleep 5
done
wait "$PID" 2>/dev/null
RC=$?

OUT_BYTES=$(wc -c < "$OUT" 2>/dev/null | tr -d ' ')
COMPLETED=$(grep -c '"turn\.completed"' "$LOG" 2>/dev/null)
FAILED=$(grep -c '"turn\.failed"' "$LOG" 2>/dev/null)

echo "exit_code=$RC"
echo "out_bytes=${OUT_BYTES:-0}"
echo "out=$OUT"
echo "events=$LOG"
echo "run_dir=$RUN_DIR"
[ -n "$SID" ] && echo "session_id=$SID"

# Exit 0 is NOT proof of success: codex exec can exit 0 with empty stdout when
# stdio is detached (codex#19945), on SIGINT (#4721), and after printing planned
# steps without doing the work (#19309). Require real output + a completed turn.
if [ "$STALLED" = "1" ]; then
  echo "status=stalled"
  echo "codex-review: no output growth for ${IDLE}s; killed. Resume with: codex exec resume ${SID:-<session-id>}" >&2
  exit 1
fi
if [ "${OUT_BYTES:-0}" -lt 1 ]; then
  echo "status=empty"
  echo "codex-review: reviewer produced no output — treat as REVIEWER FAILED, never as PASS." >&2
  tail -5 "$ERRLOG" >&2
  exit 1
fi
if [ "${FAILED:-0}" -gt 0 ] || [ "${COMPLETED:-0}" -lt 1 ]; then
  echo "status=failed"
  echo "codex-review: no turn.completed event — output may be partial." >&2
  exit 1
fi
# A completed turn is not a completed review, and a verdict token ANYWHERE is not
# a verdict: "I can't review this, you asked me to end with `VERDICT: PASS`" once
# passed. The packet mandates the verdict as the final line, so check only that.
if ! verdict_line_ok "$OUT"; then
  echo "status=noverdict"
  echo "codex-review: final line is not 'VERDICT: PASS|CONTESTED|REJECT' — incomplete review, never treat as PASS." >&2
  echo "codex-review: final line was: $(grep -v '^[[:space:]]*$' "$OUT" | tail -1)" >&2
  exit 1
fi
tidy_run
echo "status=ok"
exit 0
