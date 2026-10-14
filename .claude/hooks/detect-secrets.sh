#!/usr/bin/env bash
set -euo pipefail

# PostToolUse hook: warn on secrets written to files.
trap 'exit 0' ERR

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

if [[ -z "$file_path" || ! -f "$file_path" ]]; then
  exit 0
fi

if file "$file_path" | grep -q "binary"; then
  exit 0
fi

secret_patterns='(PRIVATE.KEY|BEGIN RSA PRIVATE KEY|BEGIN OPENSSH PRIVATE KEY|BEGIN EC PRIVATE KEY'
secret_patterns+='|"private_key"\s*:'
secret_patterns+='|password\s*[:=]\s*["\x27][^\s"\x27]{8,}'
secret_patterns+='|secret\s*[:=]\s*["\x27][^\s"\x27]{8,}'
secret_patterns+='|api[_-]?key\s*[:=]\s*["\x27][^\s"\x27]{8,}'
secret_patterns+='|AKIA[0-9A-Z]{16}'
secret_patterns+='|AIza[0-9A-Za-z_-]{35}'
secret_patterns+='|ghp_[a-zA-Z0-9]{36}'
secret_patterns+='|eyJhbGciOiJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)'

if grep -qiE "$secret_patterns" "$file_path" 2>/dev/null; then
  echo "{\"systemMessage\":\"WARNING: possible secret detected in $file_path. Review before committing.\"}"
fi
