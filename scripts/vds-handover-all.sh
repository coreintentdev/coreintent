#!/bin/bash
# ONE command: push workspace to VDS git + checkout + run jobs on VDS.
# Run from Mac (vds-public) or anywhere with ~/.ssh/zynthio_dc.
#
#   ./scripts/vds-handover-all.sh
#   VDS_REMOTE=root@5.189.143.170 ./scripts/vds-handover-all.sh main
#
set -euo pipefail

BRANCH="${1:-$(git branch --show-current)}"
VDS_REMOTE="${VDS_REMOTE:-vds-public}"
VDS_GIT="${VDS_GIT:-/root/git/zyn.git}"
VDS_HOST="${VDS_HOST:-vmi3205024}"
VDS_USER="${VDS_USER:-root}"
WORK_TREE="${WORK_TREE:-/root/zynthio/coreintent}"
SSH_KEY="${VDS_SSH_KEY_FILE:-${HOME}/.ssh/zynthio_dc}"

SSH_OPTS=(-o BatchMode=yes -o ConnectTimeout=15 -o StrictHostKeyChecking=accept-new)
[ -f "$SSH_KEY" ] && SSH_OPTS+=(-i "$SSH_KEY")
SSH=(ssh "${SSH_OPTS[@]}")
SCP=(scp "${SSH_OPTS[@]}")

echo "═══════════════════════════════════════════"
echo " VDS HANDOVER ALL"
echo " Branch: $BRANCH"
echo " Git:    ${VDS_REMOTE}:${VDS_GIT}"
echo " Host:   ${VDS_USER}@${VDS_HOST}"
echo "═══════════════════════════════════════════"

# 1. Push to bare repo
echo "[1/4] git push ${BRANCH}..."
VDS_REMOTE="$VDS_REMOTE" VDS_GIT="$VDS_GIT" ./scripts/push-to-vds-git.sh "$BRANCH"

# 2. Ensure bare repo + install post-receive from this repo
echo "[2/4] post-receive hook..."
"${SCP[@]}" scripts/vds-git-post-receive.sh "${VDS_USER}@${VDS_HOST}:/tmp/vds-git-post-receive.sh"
"${SSH[@]}" "${VDS_USER}@${VDS_HOST}" bash <<REMOTE
set -euo pipefail
GIT_DIR=/root/git/zyn.git
mkdir -p "\$GIT_DIR/hooks" "$WORK_TREE"
[ -d "\$GIT_DIR/objects" ] || git init --bare "\$GIT_DIR"
install -m 755 /tmp/vds-git-post-receive.sh "\$GIT_DIR/hooks/post-receive"
REMOTE

# 3. Checkout branch + run jobs
echo "[3/4] checkout + install jobs..."
"${SSH[@]}" "${VDS_USER}@${VDS_HOST}" bash <<REMOTE
set -euo pipefail
GIT_DIR=/root/git/zyn.git
WORK_TREE=$WORK_TREE
BRANCH=$BRANCH
mkdir -p "\$WORK_TREE"
git --work-tree="\$WORK_TREE" --git-dir="\$GIT_DIR" checkout -f "\$BRANCH"
export REPO_ROOT="\$WORK_TREE"
bash "\$WORK_TREE/scripts/vds-install-jobs.sh"
REMOTE

# 4. Verify
echo "[4/4] verify..."
"${SSH[@]}" "${VDS_USER}@${VDS_HOST}" bash <<'VERIFY'
set -euo pipefail
echo "--- SESSION_STATE (head) ---"
head -12 /root/zynthio/SESSION_STATE.md 2>/dev/null || echo "MISSING"
echo "--- handover count ---"
ls /root/zynthio/state/handover/ 2>/dev/null | wc -l
echo "--- services ---"
for u in coreintent-risk coreintent-signals coreintent-gtrade; do
  systemctl is-active "$u" 2>/dev/null || echo "$u: inactive"
done
VERIFY

echo ""
echo "Done. VDS state: /root/zynthio/SESSION_STATE.md"
echo "Claude-on-VDS: ssh ${VDS_USER}@${VDS_HOST} 'cd ${WORK_TREE} && claude'"
