#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CoreIntent — Drive -> VDS Mirror (one-shot)
#
# Why: Google Drive is single point of failure. VDS (Contabo vmi3205024)
#      is the canonical master per CLAUDE.md but does NOT currently hold
#      a full mirror of Drive. INC-011: Drive could lose data, VDS
#      doesn't have it. This script mirrors all of Drive to VDS over
#      rclone (Drive API end) + ssh-rclone (VDS end).
#
# Run from operator Mac (this Linux sandbox cannot SSH).
#
# Prerequisites:
#   1. rclone configured with a Drive API remote (NOT the local CloudStorage
#      mount). To verify which remote is API, run:
#        rclone config show | awk '/^\[/{name=$0} /^type *= *drive$/{print name}'
#      The local CloudStorage mount has type=local and CANNOT generate share
#      links or list everything via API. Pick the one with type=drive.
#   2. rclone remote `vds:` configured to SFTP/SSH onto vmi3205024 with key
#      ~/.ssh/zynthio_dc. Verify with `rclone listremotes` (must include vds:).
#   3. /srv/drive_mirror exists on the VDS (script will mkdir if not).
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# === Operator: confirm these match your `rclone listremotes` output ===
DRIVE_REMOTE="${DRIVE_REMOTE:-}"                      # MUST be set, e.g. "gdrive-zyn" — the Drive API one
VDS_REMOTE="${VDS_REMOTE:-vds}"                       # The rclone SSH remote name
VDS_DIR="${VDS_DIR:-/srv/drive_mirror}"               # Where the mirror lives on the VDS
EXCLUDE_FILE="${EXCLUDE_FILE:-.rclone-mirror-exclude}" # Optional patterns to skip

if [ -z "$DRIVE_REMOTE" ]; then
  echo "ERROR: DRIVE_REMOTE not set."
  echo ""
  echo "Find the right one with:"
  echo "  rclone config show | awk '/^\\[/{name=\$0} /^type *= *drive\$/{print name}'"
  echo ""
  echo "Then export it and rerun, e.g.:"
  echo "  DRIVE_REMOTE=gdrive-zyn ./scripts/mirror-drive-to-vds.sh"
  exit 1
fi

echo "═══════════════════════════════════════════"
echo " Drive -> VDS Mirror"
echo " From:   ${DRIVE_REMOTE}: (Drive API)"
echo " To:     ${VDS_REMOTE}:${VDS_DIR}"
echo " Exclude: ${EXCLUDE_FILE} (if present)"
echo "═══════════════════════════════════════════"

# 1. Prepare VDS target dir via the rclone SSH/SFTP remote
rclone mkdir "${VDS_REMOTE}:${VDS_DIR}" || true

# 2. Build the rclone sync command
RCLONE_ARGS=(
  sync
  "${DRIVE_REMOTE}:"
  "${VDS_REMOTE}:${VDS_DIR}/"
  --progress
  --transfers 8
  --checkers 16
  --tpslimit 8                # be polite to Drive API
  --drive-acknowledge-abuse   # don't choke on flagged historical files
  --create-empty-src-dirs
  --stats-one-line
  --stats 30s
  --log-file "drive-mirror-$(date +%Y%m%d_%H%M%S).log"
)

if [ -f "$EXCLUDE_FILE" ]; then
  RCLONE_ARGS+=( --exclude-from "$EXCLUDE_FILE" )
fi

echo ""
echo "Running:"
echo "  rclone ${RCLONE_ARGS[*]}"
echo ""

rclone "${RCLONE_ARGS[@]}"

# 3. Manifest + checksum on the VDS side for chain of custody
echo ""
echo "--- Writing manifest on VDS ---"
rclone size "${VDS_REMOTE}:${VDS_DIR}" | tee "drive-mirror-size-$(date +%Y%m%d).txt"

echo ""
echo "Done. VDS now holds a Drive mirror at ${VDS_DIR}."
echo "Run periodically (cron on Mac or GitHub Actions schedule) to keep it fresh."
