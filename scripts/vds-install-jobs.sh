#!/bin/bash
# Run ON VDS after git checkout — installs jobs, syncs handover state.
# Called by post-receive hook or vds-handover-all.sh. Not for cloud sandbox.
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
STATE_DIR="${VDS_STATE:-/root/zynthio/state/handover}"
ZYNTHIO_ROOT="${ZYNTHIO_ROOT:-/root/zynthio}"
LOG_DIR="/var/log/coreintent"
COREINTENT_DIR="${COREINTENT_DIR:-/root/coreintent}"

mkdir -p "$STATE_DIR" "$LOG_DIR" "$ZYNTHIO_ROOT/state" "$COREINTENT_DIR"

echo "[vds-install-jobs] repo=$REPO_ROOT state=$STATE_DIR"

# ── 1. Handover docs → VDS state (all threads in workspace) ──
HANDOVER_FILES=(
  MASTER_HANDOVER.md
  TODO_MASTER_LIVE.md
  CLAUDE.md
  docs/SESSION-HANDOVER-2026-03-23.md
  docs/HANDOVER_HUMAN_SUPPORT_2026-04-20.md
  docs/HANDOVER_ACCOUNTABILITY_2026-04-21.md
  docs/HANDOVER_VDS_GIT_2026-05-14.md
  docs/HANDOVER_TO_NEXT_2026-05-13.md
  docs/DEPLOY_INCIDENTS_SUMMARY.md
  docs/CLAUDE_ON_VDS_BOOTSTRAP.md
  docs/CLAUDE_OPERATOR_LANGUAGE_POINTER.md
  docs/VISION-NOTES.md
)

for f in "${HANDOVER_FILES[@]}"; do
  if [ -f "$REPO_ROOT/$f" ]; then
    cp "$REPO_ROOT/$f" "$STATE_DIR/$(basename "$f")"
  fi
done

# Incident snapshot for Commander / offline read
if [ -f "$REPO_ROOT/app/api/incidents/route.ts" ]; then
  cp "$REPO_ROOT/app/api/incidents/route.ts" "$STATE_DIR/incidents-route.ts"
fi

# ── 2. SESSION_STATE.md (VDS canonical pointer) ──
cat > "$ZYNTHIO_ROOT/SESSION_STATE.md" << EOF
# SESSION_STATE — auto-written by vds-install-jobs.sh
Updated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: $(git -C "$REPO_ROOT" branch --show-current 2>/dev/null || echo unknown)
Commit: $(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)

## Read first
- $STATE_DIR/MASTER_HANDOVER.md
- $STATE_DIR/DEPLOY_INCIDENTS_SUMMARY.md
- $STATE_DIR/incidents-route.ts

## Work tree
- $REPO_ROOT
- $COREINTENT_DIR (trading scripts deploy target)

## Jobs
- systemd: coreintent-risk, coreintent-signals, coreintent-gtrade
- cron: coreintent-handover-check (daily)
EOF

# ── 3. Symlink repo into zynthio layout if missing ──
if [ ! -e "$ZYNTHIO_ROOT/coreintent" ]; then
  ln -sfn "$REPO_ROOT" "$ZYNTHIO_ROOT/coreintent"
fi

# ── 4. Node deps + build (if package.json present) ──
if [ -f "$REPO_ROOT/package.json" ]; then
  cd "$REPO_ROOT"
  command -v node >/dev/null || (curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs)
  npm ci --omit=dev 2>/dev/null || npm install --omit=dev 2>/dev/null || true
  npm run build 2>/dev/null || echo "[warn] build failed — check logs"
fi

# ── 5. Trading scripts → /root/coreintent + systemd (local, no SSH loop) ──
COREINTENT_DIR="/root/coreintent"
mkdir -p "$COREINTENT_DIR/scripts" "$COREINTENT_DIR/lib"
for f in risk_monitor.ts signal_listener.ts gtrade_listener.ts; do
  [ -f "$REPO_ROOT/scripts/$f" ] && cp "$REPO_ROOT/scripts/$f" "$COREINTENT_DIR/scripts/"
done
[ -f "$REPO_ROOT/lib/ai.ts" ] && cp "$REPO_ROOT/lib/ai.ts" "$COREINTENT_DIR/lib/"
[ -f "$REPO_ROOT/package.json" ] && cp "$REPO_ROOT/package.json" "$COREINTENT_DIR/"
[ -f "$REPO_ROOT/tsconfig.json" ] && cp "$REPO_ROOT/tsconfig.json" "$COREINTENT_DIR/"
[ -f "$REPO_ROOT/.env" ] && cp "$REPO_ROOT/.env" "$COREINTENT_DIR/" || true

if command -v systemctl >/dev/null 2>&1; then
  for svc in risk signals gtrade; do
    script="risk_monitor.ts"; [ "$svc" = "signals" ] && script="signal_listener.ts"; [ "$svc" = "gtrade" ] && script="gtrade_listener.ts"
    cat > "/etc/systemd/system/coreintent-${svc}.service" << UNIT
[Unit]
Description=CoreIntent ${svc}
After=network.target
[Service]
Type=simple
WorkingDirectory=${COREINTENT_DIR}
ExecStart=/usr/bin/npx tsx scripts/${script}
Restart=always
RestartSec=10
EnvironmentFile=-${COREINTENT_DIR}/.env
[Install]
WantedBy=multi-user.target
UNIT
  done
  systemctl daemon-reload
  systemctl enable coreintent-risk coreintent-signals coreintent-gtrade 2>/dev/null || true
  systemctl restart coreintent-risk coreintent-signals coreintent-gtrade 2>/dev/null || echo "[warn] services need .env keys"
fi

# ── 6. Cron: daily handover check ──
CRON_LINE="0 6 * * * cd $REPO_ROOT && ./scripts/handover-check.sh >> $LOG_DIR/handover-check.log 2>&1"
( crontab -l 2>/dev/null | grep -v 'handover-check.sh' ; echo "$CRON_LINE" ) | crontab -

echo "[vds-install-jobs] done — handover in $STATE_DIR"
