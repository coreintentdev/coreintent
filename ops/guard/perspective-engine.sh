#!/usr/bin/env bash
set -euo pipefail

# Perspective Engine
# Layer 1–5 runner
# Usage:
#   ./perspective-engine.sh --problem "..." --roles all --output report.md
#   ./perspective-engine.sh --problem "..." --config my-roles.yaml --output report.md

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/output/reports"
mkdir -p "$OUT_DIR"

PROBLEM=""
ROLES="all"
CONFIG=""
OUTPUT=""

usage() {
  cat <<'EOF'
Usage:
  ./perspective-engine.sh --problem "..." [--roles executor,verifier,investigator] [--config my-roles.yaml] [--output report.md]

Modes:
  --roles all
  --roles executor,verifier,investigator
  --roles executor,verifier,investigator,security_auditor

Examples:
  ./perspective-engine.sh --problem "Push to VDS" --roles all --output report.md
  ./perspective-engine.sh --problem "Deploy to VDS" --config my-roles.yaml --output report.md
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --problem)
      PROBLEM="$2"
      shift 2
      ;;
    --roles)
      ROLES="$2"
      shift 2
      ;;
    --config)
      CONFIG="$2"
      shift 2
      ;;
    --output)
      OUTPUT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ -z "$PROBLEM" ]]; then
  echo "Error: --problem is required" >&2
  usage >&2
  exit 1
fi

if [[ -z "$OUTPUT" ]]; then
  OUTPUT="$OUT_DIR/default-report.md"
fi

# default role set
if [[ "$ROLES" == "all" ]]; then
  ROLES="executor,verifier,investigator,security_auditor,performance_analyst,business_impact"
fi

IFS=',' read -r -a ROLE_ARRAY <<< "$ROLES"

# define a little synthetic engine
# this is minimal but real enough to be used from the repo as a runner

REPORT_PATH="$OUTPUT"
mkdir -p "$(dirname "$REPORT_PATH")"

{
  echo "# Perspective Report"
  echo
  echo "Problem: $PROBLEM"
  echo
  echo "Roles: $(printf '%s ' "${ROLE_ARRAY[@]}")"
  echo
  echo "---"
  echo

  # Layer 1: Executor
  if [[ " ${ROLE_ARRAY[*]} " =~ " executor " ]]; then
    echo "## Layer 1 — Executor"
    echo
    echo "Proposed action:"
    echo
    echo "- Define the actual end state"
    echo "- Break it into concrete steps"
    echo "- Propose the minimal safe commands"
    echo "- Do not assume host, repo, or path exists without checking"
    echo
    echo "Example proposal for this task:"
    echo
    echo "1. Verify the VDS is reachable via ssh vds"
    echo "2. Check whether /srv/git exists and whether the target repo is present"
    echo "3. If repo does not exist, initialize it safely"
    echo "4. Add a bare git remote for the mirror"
    echo "5. Push only after the verifier accepts the plan"
    echo
    echo "---"
    echo
  fi

  # Layer 2: Verifier
  if [[ " ${ROLE_ARRAY[*]} " =~ " verifier " ]]; then
    echo "## Layer 2 — Verifier"
    echo
    echo "Verification checklist:"
    echo
    echo "- Confirm VDS address is 100.64.0.2, not 100.121.107.112"
    echo "- Confirm SSH login method: ssh vds"
    echo "- Confirm repo path exists: /srv/git"
    echo "- Confirm target repo path exists or is initialized safely"
    echo "- Confirm no destructive flags such as --delete-during or rm -rf"
    echo "- Confirm all package claims are verified with npm view before use"
    echo "- Confirm no git rewrite or force push"
    echo
    echo "Decision: APPROVED only after live verification"
    echo
    echo "---"
    echo
  fi

  # Layer 3: Investigator
  if [[ " ${ROLE_ARRAY[*]} " =~ " investigator " ]]; then
    echo "## Layer 3 — Investigator"
    echo
    echo "Blind spots to inspect:"
    echo
    echo "- Is the repo intended as a bare mirror or a working checkout?"
    echo "- Does the user understand the difference between /srv/git and /root/coreintent-clean?"
    echo "- Are we making assumptions from documentation instead of checking the live system?"
    echo "- Is the task solving the right problem, or just doing the first obvious action?"
    echo
    echo "This is the pattern layer: it reads the execution logic and asks what both the executor and verifier may be overlooking."
    echo
    echo "---"
    echo
  fi

  # Layer 4: custom roles
  if [[ " ${ROLE_ARRAY[*]} " =~ " security_auditor " ]]; then
    echo "## Layer 4 — Security Auditor"
    echo
    echo "Security read:"
    echo
    echo "- Verify the SSH method and keys before acting"
    echo "- Reject destructive workflows unless ALLOW_DESTRUCTIVE=1 is explicit"
    echo "- Require confirmation before any git rewrite, repo deletion, or overwrite"
    echo "- Check for wrong host addresses and stale docs"
    echo
    echo "---"
    echo
  fi

  if [[ " ${ROLE_ARRAY[*]} " =~ " performance_analyst " ]]; then
    echo "## Layer 4 — Performance Analyst"
    echo
    echo "Performance read:"
    echo
    echo "- A bare mirror is cheap and stable"
    echo "- A working copy is a separate operational concern"
    echo "- Do not mix mirror operations and working-copy cleanup in the same task"
    echo "- Keep the process simple: setup mirror, push, audit"
    echo
    echo "---"
    echo
  fi

  if [[ " ${ROLE_ARRAY[*]} " =~ " business_impact " ]]; then
    echo "## Layer 4 — Business Impact"
    echo
    echo "Business read:"
    echo
    echo "- The real value is not pretending a system is deployed; it is having a safe, auditable git mirror and known working copy"
    echo "- This reduces operational risk and avoids destructive mistakes"
    echo "- The engine helps a user think before they run commands"
    echo
    echo "---"
    echo
  fi

  echo "## Final synthesis"
  echo
  echo "The minimal safe pattern is:"
  echo
  echo "1. Verify the VDS and SSH method"
  echo "2. Verify the repo path and target"
  echo "3. Decide if the task is a mirror, a working copy, or a deploy"
  echo "4. Reject destructive flags until explicitly authorized"
  echo "5. Run the smallest safe action"
  echo "6. Record the outcome"
  echo
  echo "This prevents common issues: wrong VDS address, fake package claims, bad repo assumptions, destructive syncs, and path confusion."
  echo
} > "$REPORT_PATH"

echo "Perspective report written to $REPORT_PATH"