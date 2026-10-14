#!/usr/bin/env bash
# PreToolUse(Bash): select the personal SSH key + gh account before git commit/push.
# `use-personal` is a zsh alias, invisible to hook shells, so its body is inlined here.

input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // empty')

if echo "$cmd" | grep -qE '(^|[;&|[:space:]])git([[:space:]]+-C[[:space:]]+[^[:space:]]+)?[[:space:]]+(commit|push)([[:space:]]|$)'; then
  ssh-add -D >/dev/null 2>&1
  ssh-add ~/.ssh/id_rsa_github >/dev/null 2>&1
  gh auth switch --user VictorHugoBN >/dev/null 2>&1
fi

exit 0
