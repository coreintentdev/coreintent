#!/usr/bin/env bash
set -euo pipefail

# Consequence Engine (Layer 6)
# Record outcomes and score roles.
# Usage:
#   ./consequence.sh record --task-id ID --result success|failure|partial|unknown --notes "..."
#   ./consequence.sh score
#   ./consequence.sh report --role verifier
#   ./consequence.sh weights
#   ./consequence.sh ledger [--last N]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POLICY="$SCRIPT_DIR/policy.yaml"
LEDGER_DIR="$SCRIPT_DIR/output/ledger"
WEIGHTS_FILE="$LEDGER_DIR/weights.json"
TRUTH_LEDGER="$LEDGER_DIR/truth.jsonl"
mkdir -p "$LEDGER_DIR"

# Load a policy value
read_policy() {
  python3 -c "import yaml; print(yaml.safe_load(open('$POLICY'))['policy'].get('$1',''))" 2>/dev/null || true
}

MIN_WEIGHT=$(python3 -c "import yaml; print(yaml.safe_load(open('$POLICY'))['policy']['weight_bounds'][0])")
MAX_WEIGHT=$(python3 -c "import yaml; print(yaml.safe_load(open('$POLICY'))['policy']['weight_bounds'][1])")
WEIGHT_DELTA=$(read_policy weight_delta || echo 0.1)
DEFAULT_WEIGHT=$(read_policy default_weight || echo 1.0)

init_weights() {
  if [[ ! -f "$WEIGHTS_FILE" ]]; then
    cat > "$WEIGHTS_FILE" <<EOF
{
  "executor": $DEFAULT_WEIGHT,
  "verifier": $DEFAULT_WEIGHT,
  "investigator": $DEFAULT_WEIGHT,
  "security_auditor": $DEFAULT_WEIGHT,
  "performance_analyst": $DEFAULT_WEIGHT,
  "business_impact": $DEFAULT_WEIGHT,
  "last_updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
  fi
}

usage() {
  cat <<'EOF'
Usage:
  ./consequence.sh record --task-id ID --result success|failure|partial|unknown --notes "..." [options]
  ./consequence.sh score
  ./consequence.sh report [--role verifier]
  ./consequence.sh weights
  ./consequence.sh ledger [--last N]

Record options:
  --task-id ID              unique task identifier
  --result RESULT           success | failure | partial | unknown
  --notes TEXT              details about outcome
  --verifier correct|wrong  did verifier's decision match reality?
  --investigator hit|miss   did investigator's blind spot manifest?
  --executor success|fail   did executor's proposal work first-try?

Examples:
  ./consequence.sh record --task-id abc123 --result success --notes "Mirror created" --verifier correct --investigator miss
  ./consequence.sh score
  ./consequence.sh report --role verifier
  ./consequence.sh ledger --last 10
EOF
}

record_outcome() {
  local task_id="" result="" notes="" verifier="" investigator="" executor=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --task-id) task_id="$2"; shift 2 ;;
      --result) result="$2"; shift 2 ;;
      --notes) notes="$2"; shift 2 ;;
      --verifier) verifier="$2"; shift 2 ;;
      --investigator) investigator="$2"; shift 2 ;;
      --executor) executor="$2"; shift 2 ;;
      *) shift ;;
    esac
  done

  if [[ -z "$task_id" || -z "$result" ]]; then
    echo "Error: --task-id and --result are required" >&2
    usage >&2
    exit 1
  fi

  case "$result" in
    success|failure|partial|unknown) ;;
    *) echo "Error: result must be success, failure, partial, or unknown" >&2; exit 1 ;;
  esac

  python3 - <<'PY' "$task_id" "$result" "$notes" "$verifier" "$investigator" "$executor" >> "$TRUTH_LEDGER"
import sys, json, datetime
obj = {
    "task_id": sys.argv[1],
    "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
    "result": sys.argv[2],
    "notes": sys.argv[3],
    "verifier": sys.argv[4] if sys.argv[4] else "",
    "investigator": sys.argv[5] if sys.argv[5] else "",
    "executor": sys.argv[6] if sys.argv[6] else ""
}
print(json.dumps(obj))
PY
  echo "Outcome recorded: $task_id ($result)"
}

score_roles() {
  init_weights
  if [[ ! -s "$TRUTH_LEDGER" ]]; then
    echo "No truth ledger yet. Record some outcomes first." >&2
    cat "$WEIGHTS_FILE"
    return 0
  fi

  python3 - <<'PY' "$WEIGHTS_FILE" "$TRUTH_LEDGER" "$MIN_WEIGHT" "$MAX_WEIGHT" "$WEIGHT_DELTA"
import sys, json, datetime
weights = json.load(open(sys.argv[1]))
ledger = [json.loads(l) for l in open(sys.argv[2]) if l.strip()]
min_w, max_w, delta = float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])

# Ensure stats keys exist
for r in ["executor", "verifier", "investigator", "security_auditor", "performance_analyst", "business_impact"]:
    if r not in weights:
        weights[r] = 1.0
    # counters
    weights.setdefault(f"{r}_correct", 0)
    weights.setdefault(f"{r}_total", 0)

for e in ledger:
    # score verifier
    v = e.get("verifier", "")
    if v:
        weights["verifier_total"] = weights.get("verifier_total", 0) + 1
        if v == "correct":
            weights["verifier_correct"] = weights.get("verifier_correct", 0) + 1
            weights["verifier"] = min(max_w, weights["verifier"] + delta)
        elif v == "wrong":
            weights["verifier"] = max(min_w, weights["verifier"] - delta)
    # score investigator
    i = e.get("investigator", "")
    if i:
        weights["investigator_total"] = weights.get("investigator_total", 0) + 1
        if i == "hit":
            weights["investigator_correct"] = weights.get("investigator_correct", 0) + 1
            weights["investigator"] = min(max_w, weights["investigator"] + delta)
        elif i == "miss":
            weights["investigator"] = max(min_w, weights["investigator"] - delta)
    # score executor
    x = e.get("executor", "")
    if x:
        weights["executor_total"] = weights.get("executor_total", 0) + 1
        if x == "success":
            weights["executor_correct"] = weights.get("executor_correct", 0) + 1
            weights["executor"] = min(max_w, weights["executor"] + delta)
        elif x == "fail":
            weights["executor"] = max(min_w, weights["executor"] - delta)

weights["last_updated"] = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
json.dump(weights, open(sys.argv[1], "w"), indent=2)
print(json.dumps(weights, indent=2))
PY
  echo "Weights updated in: $WEIGHTS_FILE"
}

report() {
  local role=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --role) role="$2"; shift 2 ;;
      *) shift ;;
    esac
  done

  init_weights
  if [[ -z "$role" ]]; then
    echo "Current role weights:"
    cat "$WEIGHTS_FILE" | jq .
    return 0
  fi

  echo "Accuracy for role: $role"
  if [[ -s "$TRUTH_LEDGER" ]]; then
    cat "$TRUTH_LEDGER" | jq "select(.$role != null and .$role != \"\") | {task_id, $role, result, notes}"
  else
    echo "No ledger entries yet."
  fi
}

show_weights() {
  init_weights
  cat "$WEIGHTS_FILE" | jq .
}

show_ledger() {
  local last=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --last) last="$2"; shift 2 ;;
      *) shift ;;
    esac
  done

  if [[ -z "$last" ]]; then
    cat "$TRUTH_LEDGER"
  else
    tail -n "$last" "$TRUTH_LEDGER"
  fi
}

case "${1:-}" in
  record) shift; record_outcome "$@" ;;
  score) shift; score_roles ;;
  report) shift; report "$@" ;;
  weights) shift; show_weights ;;
  ledger) shift; show_ledger "$@" ;;
  -h|--help) usage; exit 0 ;;
  *) echo "Unknown command: ${1:-}" >&2; usage >&2; exit 1 ;;
esac
