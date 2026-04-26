#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CoreIntent — Multi-VPS Migration Script
# Pulls data from all existing VPS instances into a local mirror,
# then pushes consolidated data to the new VDS.
#
# Phase 1: Mirror all 3 VPS → local
# Phase 2: Deduplicate and organize
# Phase 3: Push to new VDS
#
# Usage:
#   VDS_HOST=new.vds.ip ./scripts/migrate-to-vds.sh
# ═══════════════════════════════════════════════════════════════

set -e

VDS_HOST="${ZYN_VDS_HOST:-${VDS_HOST:-5.189.143.170}}"
VDS_USER="${VDS_USER:-root}"

# All existing VPS instances to migrate FROM (via Tailscale)
# ZYN_SOURCES override or defaults below
if [ -n "$ZYN_SOURCES" ]; then
  IFS=' ' read -ra SOURCES <<< "$ZYN_SOURCES"
else
  SOURCES=(
    "root@161.97.89.49"      # Contabo VPS 20 NVMe (kept, $7/mo)
    "root@84.247.137.105"    # Contabo VPS 30 NVMe (cancelled Apr 2027)
  )
fi

MIRROR="migration_$(date +%Y%m%d_%H%M%S)"
REPORT="${MIRROR}/MIGRATION_REPORT.md"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN} VPS → VDS Migration${NC}"
echo -e "${CYAN} Sources: ${#SOURCES[@]} VPS instances${NC}"
echo -e "${CYAN} Target:  ${VDS_USER}@${VDS_HOST}${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo ""

mkdir -p "$MIRROR"

cat > "$REPORT" << HEADER
# Migration Report
**Date:** $(date)
**Target VDS:** ${VDS_USER}@${VDS_HOST}
**Sources:** ${SOURCES[*]}

HEADER

# ═══════════════════════════════════════════
# PHASE 1: Mirror from each VPS
# ═══════════════════════════════════════════
echo -e "${CYAN}[PHASE 1] Mirroring from ${#SOURCES[@]} VPS instances...${NC}"

for SRC in "${SOURCES[@]}"; do
  HOST=$(echo "$SRC" | cut -d@ -f2)
  DIR="${MIRROR}/from_${HOST}"
  mkdir -p "${DIR}"

  echo ""
  echo -e "${CYAN}── Connecting to ${SRC} ──${NC}"

  if ssh -o ConnectTimeout=10 "$SRC" "echo ok" 2>/dev/null; then
    echo -e "${GREEN}Connected.${NC}"

    # Pull zynthio state files
    echo "  Pulling /root/zynthio/..."
    mkdir -p "${DIR}/zynthio"
    scp -r -o ConnectTimeout=10 "${SRC}:/root/zynthio/*.md" "${DIR}/zynthio/" 2>/dev/null || true
    scp -r -o ConnectTimeout=10 "${SRC}:/root/zynthio/*.json" "${DIR}/zynthio/" 2>/dev/null || true
    scp -r -o ConnectTimeout=10 "${SRC}:/root/zynthio/*.txt" "${DIR}/zynthio/" 2>/dev/null || true

    # Pull .env files
    echo "  Pulling .env files..."
    mkdir -p "${DIR}/env"
    ssh -o ConnectTimeout=10 "$SRC" 'find /root -maxdepth 3 -name ".env" -o -name ".env.*" 2>/dev/null' | while read -r f; do
      SAFE=$(echo "$f" | tr '/' '_')
      scp -o ConnectTimeout=10 "${SRC}:${f}" "${DIR}/env/${SAFE}" 2>/dev/null || true
    done

    # Pull running service configs
    echo "  Pulling service configs..."
    mkdir -p "${DIR}/services"
    ssh -o ConnectTimeout=10 "$SRC" 'ls /etc/systemd/system/coreintent-*.service 2>/dev/null' | while read -r f; do
      scp -o ConnectTimeout=10 "${SRC}:${f}" "${DIR}/services/" 2>/dev/null || true
    done

    # Get service status
    echo "  Checking services..."
    ssh -o ConnectTimeout=10 "$SRC" "pm2 list 2>/dev/null; systemctl list-units --type=service --state=active 2>/dev/null | grep -i coreintent" > "${DIR}/services/status.txt" 2>/dev/null || true

    # Get disk + file count
    DISK=$(ssh -o ConnectTimeout=10 "$SRC" "du -sh /root/ 2>/dev/null | cut -f1" 2>/dev/null || echo "?")
    FILES=$(ssh -o ConnectTimeout=10 "$SRC" "find /root -type f 2>/dev/null | wc -l" 2>/dev/null || echo "?")

    LOCAL_COUNT=$(find "${DIR}" -type f | wc -l | tr -d ' ')
    echo -e "${GREEN}  Mirrored ${LOCAL_COUNT} files from ${HOST} (${DISK}, ${FILES} files on server)${NC}"

    echo "## ${HOST}" >> "$REPORT"
    echo "- Files on server: ${FILES}" >> "$REPORT"
    echo "- Disk usage: ${DISK}" >> "$REPORT"
    echo "- Files mirrored: ${LOCAL_COUNT}" >> "$REPORT"
    echo "" >> "$REPORT"
  else
    echo -e "${YELLOW}Cannot connect to ${SRC} — skipping${NC}"
    echo "## ${HOST}" >> "$REPORT"
    echo "- **UNREACHABLE** — skipped" >> "$REPORT"
    echo "" >> "$REPORT"
  fi
done

# ═══════════════════════════════════════════
# PHASE 2: Summary
# ═══════════════════════════════════════════
TOTAL=$(find "$MIRROR" -type f | wc -l | tr -d ' ')
SIZE=$(du -sh "$MIRROR" 2>/dev/null | cut -f1)

echo "" >> "$REPORT"
echo "## Summary" >> "$REPORT"
echo "- Total files mirrored: ${TOTAL}" >> "$REPORT"
echo "- Mirror size: ${SIZE}" >> "$REPORT"
echo "- Mirror location: ${MIRROR}/" >> "$REPORT"
echo "" >> "$REPORT"
echo "## Next Steps" >> "$REPORT"
echo "1. Review mirrored data in ${MIRROR}/" >> "$REPORT"
echo "2. Run \`VDS_HOST=${VDS_HOST} ./scripts/deploy-vds.sh\` to deploy the app" >> "$REPORT"
echo "3. Copy state files to VDS: \`scp -r ${MIRROR}/*/zynthio/ ${VDS_USER}@${VDS_HOST}:/root/zynthio/\`" >> "$REPORT"
echo "4. Verify everything works on VDS" >> "$REPORT"
echo "5. Close old VPS accounts" >> "$REPORT"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN} MIGRATION MIRROR COMPLETE${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo ""
echo "  Mirror: ${MIRROR}/ (${TOTAL} files, ${SIZE})"
echo "  Report: ${REPORT}"
echo ""
echo "  Next:"
echo "    1. Review: ls ${MIRROR}/"
echo "    2. Deploy app: VDS_HOST=${VDS_HOST} ./scripts/deploy-vds.sh"
echo "    3. Push state: scp -r ${MIRROR}/*/zynthio/ ${VDS_USER}@${VDS_HOST}:/root/zynthio/"
echo "    4. Verify, then close old VPS accounts"
echo ""
echo "  336 — migration ready."
echo ""
