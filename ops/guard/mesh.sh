#!/usr/bin/env bash
set -euo pipefail

# Perspective Mesh (Layer 7)
# Run the same problem through multiple independent model instances and compare outputs.
#
# Purpose:
#   - consensus detection
#   - dissent detection
#   - meta blind spot detection
#   - confidence scoring
#
# Usage:
#   ./mesh.sh --problem "..." --instances 3 --models "claude,grok,local-llama"
#   ./mesh.sh --task "push to vds:/srv/git/coreintent.git"
#
# Environment variables:
#   MESH_CMD_CLAUDE="..."
#   MESH_CMD_GROK="..."
#   MESH_CMD_LOCAL_LLAMA="..."
#
# The scripts are intentionally simple: they run the same problem through multiple independent commands.
# Your actual model provider remains in environment variables, so no keys need to live in the repo.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/output/reports"
mkdir -p "$OUT_DIR"

PROBLEM=""
TASK=""
INSTANCES="3"
MODELS="claude,grok,local-llama"
OUTPUT="$OUT_DIR/mesh-report.md"

usage() {
  cat <<'EOF'
Usage:
  ./mesh.sh --problem "..." [--instances 3] [--models "claude,grok,local-llama"] [--output report.md]
  ./mesh.sh --task "push to vds:/srv/git/coreintent.git"

Examples:
  ./mesh.sh --problem "Deploy to VDS" --instances 3 --models "claude,grok,local-llama"
  ./mesh.sh --task "sync to VDS" --instances 5 --output output/reports/mesh.md
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --problem)
      PROBLEM="$2"
      shift 2
      ;;
    --task)
      TASK="$2"
      shift 2
      ;;
    --instances)
      INSTANCES="$2"
      shift 2
      ;;
    --models)
      MODELS="$2"
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

if [[ -n "$TASK" && -z "$PROBLEM" ]]; then
  PROBLEM="$TASK"
fi

if [[ -z "$PROBLEM" ]]; then
  echo "Error: --problem or --task is required" >&2
  usage >&2
  exit 1
fi

IFS=',' read -r -a MODEL_ARRAY <<< "$MODELS"

mkdir -p "$(dirname "$OUTPUT")"

{
  echo "# Perspective Mesh Report"
  echo
  echo "Problem: $PROBLEM"
  echo
  echo "Instances: $INSTANCES"
  echo "Models: ${MODEL_ARRAY[*]}"
  echo
  echo "---"
  echo

  # Model run placeholder.
  # This is intentionally not a real provider execution; it is the system skeleton.
  # Replace these with your actual model invocations via env variables.
  for model in "${MODEL_ARRAY[@]}"; do
    model_name="${model,,}"
    echo "## Instance: $model_name"
    echo
    echo "- Executor: propose the smallest viable plan"
    echo "- Verifier: ensure no wrong address, no destructive flags, no false repo assumptions"
    echo "- Investigator: flag any blind spots that could break this task"
    echo "- Verdict: APPROVE | REJECT | FLAG_FOR_HUMAN_REVIEW"
    echo
    echo "Example output for $model_name:"
    echo "- Executor: initialize bare repo on /srv/git if missing"
    echo "- Verifier: CHECK host is 100.64.0.2; confirm SSH is via ssh vds"
    echo "- Investigator: bare repo is fine for mirror, but separate working copy may still be required"
    echo "- Verdict: APPROVE with a note about the working-copy distinction"
    echo
    echo "---"
    echo
  done

  echo "## Consensus / Dissent"
  echo
  echo "Consensus check:"
  echo "- Most instances should agree on the safe path"
  echo "- If there is disagreement, flag it as DISSENT"
  echo "- If all agree on a weak assumption, flag it as META BLIND SPOT"
  echo
  echo "Example:"
  echo "- Consensus: VDS address is 100.64.0.2, not 100.121.107.112"
  echo "- Dissent: one instance suggests a working copy without clarifying that /root/coreintent-clean is not a git repo"
  echo "- Meta blind spot: all instances assume SSH is correctly configured without checking the exact key path"
  echo
  echo "---"
  echo

  echo "## Confidence scoring"
  echo
  echo "- 4/5 agree: high confidence"
  echo "- 2/5 agree: flag for human review"
  echo "- 0/5 agree: no path is trusted without fresh evidence"
  echo
  echo "---"
  echo

  echo "## Shared assumptions to test"
  echo
  echo "- Does the VDS exist at 100.64.0.2?"
  echo "- Is ssh vds the live login flow?"
  echo "- Is the goal a bare mirror or a working checkout?"
  echo "- Is the path /srv/git/project.git or /srv/git/coreintent.git?"
  echo "- Are we assuming recorded docs are still current?"
  echo "- Is there a real key file and is it mounted on the Mac?"
  echo
} > "$OUTPUT"

echo "Mesh report written to $OUTPUT"