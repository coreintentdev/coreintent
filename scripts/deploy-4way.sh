#!/bin/bash
# ============================================================
# 4-Way Deploy Protocol — CoreIntent / Zynthio v3.0
# Pushes critical state to ALL four destinations.
# Usage: ./scripts/deploy-4way.sh [--skip-drive] [--skip-notion]
# ============================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONTABO_PRIMARY="161.97.89.49"
CONTABO_KEY="/root/.ssh/zynthio_deploy"
GITHUB_REPO="coreintentdev/zyn"
GITHUB_BRANCH="data-backup"
DRIVE_DEST="gdrive:/alpha-backup"
NOTION_SCRIPT="scripts/push_state_to_notion.py"

SKIP_DRIVE=false
SKIP_NOTION=false

for arg in "$@"; do
  case $arg in
    --skip-drive) SKIP_DRIVE=true ;;
    --skip-notion) SKIP_NOTION=true ;;
  esac
done

echo -e "${BLUE}━━━ 4-WAY DEPLOY PROTOCOL ━━━${NC}"
echo -e "${BLUE}Signal 336 — $(date '+%Y-%m-%d %H:%M:%S %Z')${NC}"
echo ""

# ── 1. rsync to Contabo via Tailscale ──
echo -e "${YELLOW}[1/4] rsync → Contabo ($CONTABO_PRIMARY)${NC}"
if command -v rsync &>/dev/null && [ -f "$CONTABO_KEY" ]; then
  rsync -avzP \
    -e "ssh -i $CONTABO_KEY" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    ./ "root@$CONTABO_PRIMARY:/root/coreintent/" \
    && echo -e "${GREEN}  ✓ rsync complete${NC}" \
    || echo -e "${RED}  ✗ rsync failed${NC}"
else
  echo -e "${RED}  ✗ skipped — rsync or deploy key not available${NC}"
fi

# ── 2. Git push to data-backup branch ──
echo -e "${YELLOW}[2/4] git → $GITHUB_REPO ($GITHUB_BRANCH)${NC}"
if git remote get-url origin &>/dev/null; then
  git add -A
  git diff --cached --quiet || git commit -m "4-way deploy: $(date '+%Y-%m-%d %H:%M')"
  git push origin "HEAD:refs/heads/$GITHUB_BRANCH" --force \
    && echo -e "${GREEN}  ✓ git push complete${NC}" \
    || echo -e "${RED}  ✗ git push failed${NC}"
else
  echo -e "${RED}  ✗ skipped — no git remote${NC}"
fi

# ── 3. rclone to Google Drive ──
echo -e "${YELLOW}[3/4] rclone → Google Drive ($DRIVE_DEST)${NC}"
if [ "$SKIP_DRIVE" = true ]; then
  echo -e "${YELLOW}  ⊘ skipped (--skip-drive)${NC}"
elif command -v rclone &>/dev/null; then
  rclone sync ./ "$DRIVE_DEST" \
    --exclude 'node_modules/**' \
    --exclude '.next/**' \
    --exclude '.git/**' \
    --transfers 4 \
    --checkers 8 \
    -v \
    && echo -e "${GREEN}  ✓ rclone complete${NC}" \
    || echo -e "${RED}  ✗ rclone failed${NC}"
else
  echo -e "${RED}  ✗ skipped — rclone not installed${NC}"
fi

# ── 4. Notion Hub push ──
echo -e "${YELLOW}[4/4] python → Notion Hub${NC}"
if [ "$SKIP_NOTION" = true ]; then
  echo -e "${YELLOW}  ⊘ skipped (--skip-notion)${NC}"
elif [ -f "$NOTION_SCRIPT" ]; then
  python3 "$NOTION_SCRIPT" \
    && echo -e "${GREEN}  ✓ notion push complete${NC}" \
    || echo -e "${RED}  ✗ notion push failed${NC}"
else
  echo -e "${RED}  ✗ skipped — $NOTION_SCRIPT not found${NC}"
fi

echo ""
echo -e "${GREEN}━━━ backup is done ━━━${NC}"
echo -e "${BLUE}Signal 336 — deploy complete${NC}"
