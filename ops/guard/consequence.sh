#!/usr/bin/env bash
set -euo pipefail

# Consequence Engine (Layer 6)
# Record outcomes and score roles
# Usage:
#   ./consequence.sh record --task-id abc123 --result success --notes "..." [--verifier correct|wrong] [--investigator hit|miss] [--executor success|fail]
#   ./consequence.sh score
#   ./consequence.sh report --role verifier
#   ./consequence.sh report --task-type git_operations

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LEDGER_DIR="$SCRIPT_DIR/output/ledger"
WEIGHTS_FILE="$LEDGER_DIR/weights.json"
TRUTH_LEDGER="$LEDGER_DIR/truth.jsonl"

mkdir -p "$LEDGER_DIR"

# Initialize weights if not present
if [[ ! -f "$WEIGHTS_FILE" ]]; then
  cat > "$WEIGHTS_FILE" << 'EOF'
{
  "executor": 1.0,
  "verifier": 1.0,
  "investigator": 1.0,
  "security_auditor": 1.0,
  "performance_analyst": 1.0,
  "business_impact": 1.0,
  "last_updated": "2026-10-06T00:00:00Z"
}
EOF
fi

usage() {
  cat <<'EOF'
Usage:
  ./consequence.sh record --task-id ID --result success|failure|partial|unknown --notes "..." [options]
  ./consequence.sh score
  ./consequence.sh report [--role verifier] [--task-type git_operations]
  ./consequence.sh weights
  ./consequence.sh ledger [--last N]

Record options:
  --task-id ID              unique task identifier
  --result RESULT           success | failure | partial | unknown
  --notes TEXT              details about outcome
  --verifier correct|wrong  did verifier's decision match reality?
  --investigator hit|miss   did investigator's blind spot manifest?
  --executor success|fail   did executor's proposal work first-try?
  --custom-role-name hit|miss  score any custom role

Examples:
  ./consequence.sh record --task-id abc123 --result success --notes "Mirror created" --verifier correct --investigator miss
  ./consequence.sh score
  ./consequence.sh report --role verifier
  ./consequence.sh ledger --last 10
EOF
}

# Record an outcome
record_outcome() {
  local task_id=""
  local result=""
  local notes=""
  local verifier=""
  local investigator=""
  local executor=""
  local timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --task-id)
        task_id="$2"
        shift 2
        ;;
      --result)
        result="$2"
        shift 2
        ;;
      --notes)
        notes="$2"
        shift 2
        ;;
      --verifier)
        verifier="$2"
        shift 2
        ;;
      --investigator)
        investigator="$2"
        shift 2
        ;;
      --executor)
        executor="$2"
        shift 2
        ;;
      *)
        shift
        ;;
    esac
  done

  if [[ -z "$task_id" ]] || [[ -z "$result" ]]; then
    echo "Error: --task-id and --result are required" >&2
    return 1
  fi

  # Build JSON record
  local json
  json=$(cat <<EOF
{
  "task_id": "$task_id",
  "timestamp": "$timestamp",
  "result": "$result",
  "notes": "$notes",
  "verifier": "$verifier",
  "investigator": "$investigator",
  "executor": "$executor"
}
EOF
)

  echo "$json" >> "$TRUTH_LEDGER"
  echo "Outcome recorded: $task_id ($result)"
}

# Score roles based on truth ledger
score_roles() {
  if [[ ! -f "$TRUTH_LEDGER" ]]; then
    echo "No truth ledger yet. Record some outcomes first."
    return 0
  fi

  local verifier_correct=0
  local verifier_total=0
  local investigator_hits=0
  local investigator_total=0
  local executor_success=0
  local executor_total=0

  # Count outcomes
  while IFS= read -r line; do
    if [[ -z "$line" ]]; then continue; fi

    verifier=$(echo "$line" | jq -r '.verifier // empty')
    investigator=$(echo "$line" | jq -r '.investigator // empty')
    executor=$(echo "$line" | jq -r '.executor // empty')

    if [[ -n "$verifier" ]]; then
      ((verifier_total++))
      [[ "$verifier" == "correct" ]] && ((verifier_correct++))
    fi

    if [[ -n "$investigator" ]]; then
      ((investigator_total++))
      [[ "$investigator" == "hit" ]] && ((investigator_hits++))
    fi

    if [[ -n "$executor" ]]; then
      ((executor_total++))
      [[ "$executor" == "success" ]] && ((executor_success++))
    fi

  done < "$TRUTH_LEDGER"

  # Calculate new weights
  local verifier_weight=1.0
  local investigator_weight=1.0
  local executor_weight=1.0

  if [[ $verifier_total -gt 0 ]]; then
    local verifier_accuracy
    verifier_accuracy=$(awk "BEGIN {printf \"%.2f\", ($verifier_correct / $verifier_total)}")
    verifier_weight=$(awk "BEGIN {printf \"%.2f\", 1.0 + ($verifier_accuracy - 0.5) * 0.2}")
  fi

  if [[ $investigator_total -gt 0 ]]; then
    local investigator_accuracy
    investigator_accuracy=$(awk "BEGIN {printf \"%.2f\", ($investigator_hits / $investigator_total)}")
    investigator_weight=$(awk "BEGIN {printf \"%.2f\", 1.0 + ($investigator_accuracy - 0.5) * 0.2}")
  fi

  if [[ $executor_total -gt 0 ]]; then
    local executor_accuracy
    executor_accuracy=$(awk "BEGIN {printf \"%.2f\", ($executor_success / $executor_total)}")
    executor_weight=$(awk "BEGIN {printf \"%.2f\", 1.0 + ($executor_accuracy - 0.5) * 0.2}")
  fi

  # Clamp weights to 0.2–2.0
  verifier_weight=$(awk "BEGIN {printf \"%.2f\", ($verifier_weight < 0.2 ? 0.2 : ($verifier_weight > 2.0 ? 2.0 : $verifier_weight))}")
  investigator_weight=$(awk "BEGIN {printf \"%.2f\", ($investigator_weight < 0.2 ? 0.2 : ($investigator_weight > 2.0 ? 2.0 : $investigator_weight))}")
  executor_weight=$(awk "BEGIN {printf \"%.2f\", ($executor_weight < 0.2 ? 0.2 : ($executor_weight > 2.0 ? 2.0 : $executor_weight))}")

  local timestamp
  timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  # Write weights
  local weights_json
  weights_json=$(cat <<EOF
{
  "executor": $executor_weight,
  "verifier": $verifier_weight,
  "investigator": $investigator_weight,
  "last_updated": "$timestamp",
  "stats": {
    "verifier_accuracy": "$verifier_correct / $verifier_total",
    "investigator_hit_rate": "$investigator_hits / $investigator_total",
    "executor_success_rate": "$executor_success / $executor_total"
  }
}
EOF
)

  echo "$weights_json" > "$WEIGHTS_FILE"
  echo "Weights updated:"
  echo "  executor:     $executor_weight"
  echo "  verifier:     $verifier_weight"
  echo "  investigator: $investigator_weight"
}

# Report on role accuracy
report() {
  local role=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --role)
        role="$2"
        shift 2
        ;;
      *)
        shift
        ;;
    esac
  done

  if [[ -z "$role" ]]; then
    echo "Showing all role weights:"
    cat "$WEIGHTS_FILE" | jq .
    return 0
  fi

  echo "Accuracy for role: $role"
  cat "$TRUTH_LEDGER" | jq "select(.$role != null) | {task_id, $role, result, notes}" 
}

# Show current weights
show_weights() {
  echo "Current role weights:"
  cat "$WEIGHTS_FILE" | jq '.'
}

# Show truth ledger
show_ledger() {
  local last=""

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --last)
        last="$2"
        shift 2
        ;;
      *)
        shift
        ;;
    esac
  done

  if [[ -z "$last" ]]; then
    cat "$TRUTH_LEDGER"
  else
    tail -n "$last" "$TRUTH_LEDGER"
  fi
}

# Main
case "${1:-}" in
  record)
    shift
    record_outcome "$@"
    ;;
  score)
    score_roles
    ;;
  report)
    shift
    report "$@"
    ;;
  weights)
    show_weights
    ;;
  ledger)
    shift
    show_ledger "$@"
    ;;
  -h|--help)
    usage
    ;;
  *)
    echo "Unknown command: ${1:-}" >&2
    usage >&2
    exit 1
    ;;
esac
