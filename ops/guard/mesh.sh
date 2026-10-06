#!/usr/bin/env bash
set -euo pipefail

# Perspective Mesh (Layer 7)
# Run the same problem through multiple independent model commands in parallel
# and surface consensus, dissent, and shared assumptions (meta blind spots).
#
# Usage:
#   ./mesh.sh --problem "..." --models "claude,grok,local-llama" --output mesh-report.md
#
# Environment variables:
#   MESH_CMD_CLAUDE="..."
#   MESH_CMD_GROK="..."
#   MESH_CMD_LOCAL_LLAMA="..."
#
# No API keys live in this script. Commands come from env only.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/output/reports"
PROBLEM=""
MODELS="claude,grok,local-llama"
INSTANCES="3"
OUTPUT="$OUT_DIR/mesh-report.md"
JSON_OUT="$OUT_DIR/mesh-report.json"

usage() {
  cat <<'EOF'
Usage:
  ./mesh.sh --problem "..." [--models "claude,grok,local-llama"] [--instances N] [--output report.md]

Examples:
  ./mesh.sh --problem "Push coreintent to VDS" --models "claude,grok,local-llama"
  ./mesh.sh --problem "Rebuild nginx config for aisday.com" --models "qwen,hermes" --output output/reports/mesh.md

Env:
  MESH_CMD_CLAUDE="ollama run qwen3:8b-64k"
  MESH_CMD_GROK="ollama run hermes3:8b"
  MESH_CMD_LOCAL_LLAMA="ollama run llama3.1"
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --problem) PROBLEM="$2"; shift 2 ;;
    --models) MODELS="$2"; shift 2 ;;
    --instances) INSTANCES="$2"; shift 2 ;;
    --output) OUTPUT="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ -z "$PROBLEM" ]]; then
  echo "Error: --problem is required" >&2
  usage >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

IFS=',' read -r -a MODEL_ARRAY <<< "$MODELS"
PROMPT="You are a rigorous assistant. Answer the task below with a single verdict line first (YES / NO / NEEDS-EVIDENCE), then a short rationale. Keep the rationale under 120 words. Task: $PROBLEM"

RESULTS_DIR="$SCRIPT_DIR/output/mesh_results"
mkdir -p "$RESULTS_DIR"
rm -f "$RESULTS_DIR"/*.txt

PIDS=()
for model in "${MODEL_ARRAY[@]}"; do
  model_name="${model,,}"
  cmd_var="MESH_CMD_${model_name^^}"
  cmd="${!cmd_var:-}"

  (
    set +e
    tmp="$RESULTS_DIR/$model_name.txt"
    if [[ -n "$cmd" ]]; then
      MODEL_PROMPT="$PROMPT" bash -c "$cmd" > "$tmp" 2>&1
      rc=$?
      [[ $rc -ne 0 ]] && echo "[EXIT $rc]" >> "$tmp"
    else
      echo "NO MODEL_COMMAND_SET" > "$tmp"
      echo "Rationale: Set MESH_CMD_${model_name^^} to run this model." >> "$tmp"
    fi
  ) &
  PIDS+=("$!")
done

wait "${PIDS[@]}" 2>/dev/null || true

# Build JSON result
python3 - <<'PY' "$RESULTS_DIR" "$JSON_OUT" "$PROBLEM" "$MODELS" "$INSTANCES" "$OUTPUT"
import os, sys, json, re
src, json_out, problem, models_str, instances, md_out = sys.argv[1:]

model_list = [m.strip().lower() for m in models_str.split(",")]

verdicts = {}
for model in model_list:
    path = os.path.join(src, f"{model}.txt")
    if not os.path.exists(path):
        raw = "NO OUTPUT"
    else:
        raw = open(path).read().strip()
    lines = raw.splitlines()
    verdict = "UNKNOWN"
    for line in lines[:8]:
        m = re.search(r'\b(YES|NO|NEEDS-EVIDENCE)\b', line.upper())
        if m:
            verdict = m.group(1)
            break
    verdicts[model] = {"raw": raw, "verdict": verdict}

all_verdicts = [v["verdict"] for v in verdicts.values()]
counts = {}
for v in all_verdicts:
    counts[v] = counts.get(v, 0) + 1
consensus = max(counts, key=counts.get) if counts else "UNKNOWN"

# If all models say NO MODEL_COMMAND_SET, flag it clearly
if all("NO MODEL_COMMAND_SET" in verdicts[m]["raw"] for m in model_list):
    consensus = "NO_COMMANDS"

dissenters = [m for m in model_list if verdicts[m]["verdict"] != consensus and verdicts[m]["verdict"] != "UNKNOWN"]

line_sets = [set(verdicts[m]["raw"].splitlines()) for m in model_list]
shared = set.intersection(*line_sets) if line_sets else set()
shared = [l for l in shared if l.strip() and not l.startswith('[') and not l.startswith('NO ')]

if len(all_verdicts) > 0 and consensus != "NO_COMMANDS":
    confidence = counts.get(consensus, 0) / len(all_verdicts)
else:
    confidence = 0.0

result = {
    "task": problem,
    "requested_instances": int(instances),
    "models_run": model_list,
    "verdicts": {m: verdicts[m]["verdict"] for m in model_list},
    "consensus": consensus,
    "dissenters": dissenters,
    "shared_assumptions": list(shared)[:20],
    "confidence": round(confidence, 2),
    "raw_results": verdicts
}

with open(json_out, "w") as f:
    json.dump(result, f, indent=2)

# Markdown report
with open(md_out, "w") as f:
    f.write("# Perspective Mesh Report\n\n")
    f.write(f"Problem: {problem}\n\n")
    f.write(f"Models: {', '.join(model_list)}\n\n")
    f.write(f"Requested instances: {instances}\n\n")
    f.write("---\n\n")

    if consensus == "NO_COMMANDS":
        f.write("## Status\n\n")
        f.write("No model commands were set. Export env vars like:\n\n")
        for m in model_list:
            f.write(f"export MESH_CMD_{m.upper()}=\"ollama run {m}\"\n")
        f.write("\n")
    else:
        f.write("## Verdicts\n\n")
        for m in model_list:
            v = verdicts[m]["verdict"]
            f.write(f"- **{m}**: `{v}`\n")
        f.write("\n")

        f.write("## Consensus\n\n")
        f.write(f"**{consensus}** (confidence {result['confidence']})\n\n")

        if dissenters:
            f.write("## Dissent\n\n")
            for m in dissenters:
                f.write(f"- **{m}** disagreed (`{verdicts[m]['verdict']}`)\n")
            f.write("\n")
        else:
            f.write("## Dissent\n\nNo dissent detected.\n\n")

        if shared:
            f.write("## Shared assumptions (possible meta blind spots)\n\n")
            for line in shared[:10]:
                f.write(f"- {line}\n")
            f.write("\n")

    f.write("## Raw outputs\n\n")
    for m in model_list:
        f.write(f"### {m}\n\n```\n")
        f.write(verdicts[m]["raw"])
        f.write("\n```\n\n")

print(f"Mesh report written to: {md_out}")
print(f"Mesh JSON written to: {json_out}")
PY

cat "$OUTPUT"
