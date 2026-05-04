#!/usr/bin/env sh
set -eu

if [ "$#" -eq 0 ]; then
  echo "Usage: scripts/ask-claude.sh <question or task>" >&2
  exit 1
fi

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
echo "[rcs] wrapper deprecation: prefer 'rcs ask claude \"...\"'." >&2
if [ -x "$SCRIPT_DIR/../bin/rcs.js" ]; then
  if node "$SCRIPT_DIR/../bin/rcs.js" ask claude "$@"; then
    exit 0
  fi
  echo "[rcs] wrapper fallback: bin/rcs ask failed, using legacy advisor script." >&2
fi
exec node "$SCRIPT_DIR/run-provider-advisor.js" claude "$@"
