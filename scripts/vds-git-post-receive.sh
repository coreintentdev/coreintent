#!/bin/bash
# Install to: /root/git/zyn.git/hooks/post-receive
# Bare repo push → checkout worktree → run jobs on VDS.
set -euo pipefail

GIT_DIR="${GIT_DIR:-/root/git/zyn.git}"
WORK_TREE="${WORK_TREE:-/root/zynthio/coreintent}"
BRANCH="${VDS_DEFAULT_BRANCH:-cursor/handover-update-0fbd}"

while read -r oldrev newrev refname; do
  branch="${refname#refs/heads/}"
  echo "[post-receive] $refname $oldrev -> $newrev"
  mkdir -p "$WORK_TREE"
  git --work-tree="$WORK_TREE" --git-dir="$GIT_DIR" checkout -f "$branch"
  export REPO_ROOT="$WORK_TREE"
  bash "$WORK_TREE/scripts/vds-install-jobs.sh"
done
