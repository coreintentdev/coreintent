#!/bin/bash
# Push to canonical VDS git — NOT GitHub (operator source of truth).
# Remote: vds-public:/root/git/zyn.git (Tailscale/SSH alias on operator Mac)
#
# Usage:
#   ./scripts/push-to-vds-git.sh                    # push current branch
#   ./scripts/push-to-vds-git.sh main               # push named branch
#   VDS_REMOTE=root@5.189.143.170 ./scripts/push-to-vds-git.sh
#
set -euo pipefail

VDS_REMOTE="${VDS_REMOTE:-vds-public}"
VDS_GIT="${VDS_GIT:-/root/git/zyn.git}"
BRANCH="${1:-$(git branch --show-current)}"
REMOTE_NAME="${REMOTE_NAME:-vds}"

if ! git remote get-url "$REMOTE_NAME" &>/dev/null; then
  git remote add "$REMOTE_NAME" "${VDS_REMOTE}:${VDS_GIT}"
  echo "Added remote ${REMOTE_NAME} -> ${VDS_REMOTE}:${VDS_GIT}"
fi

echo "Pushing ${BRANCH} -> ${REMOTE_NAME}:${BRANCH}"
git push "$REMOTE_NAME" "${BRANCH}:${BRANCH}"

echo "Done. VDS git updated at ${VDS_GIT}"
