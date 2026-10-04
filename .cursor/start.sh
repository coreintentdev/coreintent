#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
HOST="0.0.0.0"

if ss -ltn 2>/dev/null | grep -qE ":${PORT}[[:space:]]"; then
  exit 0
fi

if curl -sf -o /dev/null --max-time 2 "http://127.0.0.1:${PORT}/" 2>/dev/null; then
  exit 0
fi

cd /workspace
exec npm run dev -- --hostname "$HOST" --port "$PORT"
