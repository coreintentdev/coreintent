#!/usr/bin/env bash
set -euo pipefail

# perspective-engine.sh — run a task through Layers 1–5 of the CoreIntent guard.
# Usage:
#   ./perspective-engine.sh --problem "Push coreintent to VDS" --roles all --output report.md
#   ./perspective-engine.sh --problem "..." --config my-roles.yaml --output report.md

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/output/reports"
PROBLEM=""
ROLES="all"
CONFIG="$SCRIPT_DIR/roles.yaml"
OUTPUT=""

usage() {
  cat <<'EOF'
Usage:
  ./perspective-engine.sh --problem "..." [--roles executor,verifier,investigator] [--config roles.yaml] [--output report.md]

  --roles all    (default) runs executor,verifier,investigator,security_auditor,performance_analyst,business_impact
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --problem) PROBLEM="$2"; shift 2 ;;
    --roles) ROLES="$2"; shift 2 ;;
    --config) CONFIG="$2"; shift 2 ;;
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

if [[ -z "$OUTPUT" ]]; then
  OUTPUT="$OUT_DIR/default-report.md"
fi
mkdir -p "$(dirname "$OUTPUT")"

if [[ "$ROLES" == "all" ]]; then
  ROLES="executor,verifier,investigator,security_auditor,performance_analyst,business_impact"
fi

# Build report
{
  echo "# Perspective Report"
  echo
  echo "Problem: $PROBLEM"
  echo
  echo "Roles: $ROLES"
  echo
  echo "Config: $CONFIG"
  echo
  echo "---"
  echo
} > "$OUTPUT"

# Run each role
python3 - <<'PY' "$CONFIG" "$PROBLEM" "$ROLES" "$OUTPUT" "$SCRIPT_DIR"
import sys, yaml, os

config_path, problem, roles_csv, output_path, script_dir = sys.argv[1:]
roles_to_run = [r.strip() for r in roles_csv.split(",")]
config = yaml.safe_load(open(config_path)) or {}

# If the YAML uses a "roles:" wrapper, unwrap it
if "roles" in config and isinstance(config["roles"], dict):
    config = config["roles"]

def render(role_id, role):
    name = role.get("name", role_id)
    layer = role.get("layer", 4)
    gate = role.get("gate", False)
    desc = role.get("description", "")
    env_cmd = os.environ.get(f"ROLE_CMD_{role_id.upper()}")

    if env_cmd:
        # Run the user-provided command and capture output
        import subprocess, shlex
        try:
            out = subprocess.check_output(shlex.split(env_cmd) + [problem], text=True, timeout=120)
        except Exception as e:
            out = f"[command failed: {e}]"
        return out.strip()

    # Built-in heuristic content
    if role_id == "executor":
        return (
            f"Proposed action for: {problem}\n\n"
            "1. Define the actual end state\n"
            "2. Break it into concrete, verifiable steps\n"
            "3. Propose the minimal safe commands\n"
            "4. Do not assume host, repo, path, or permissions exist without checking\n\n"
            "Assumptions: [1] target environment reachable, [2] operator has authorised the change, [3] rollback path exists.\n"
            "Risks: misconfiguration, downtime, wrong target."
        )
    if role_id == "verifier":
        return (
            "Verification checklist:\n\n"
            "- Confirm VDS address is 100.64.0.2, not 100.121.107.112\n"
            "- Confirm SSH login method: ssh vds\n"
            "- Confirm repo/path exists before mutating\n"
            "- Confirm no destructive flags such as --delete-during or rm -rf\n"
            "- Confirm no git rewrite or force push\n\n"
            "Decision: needs-evidence until live verification is shown."
        )
    if role_id == "investigator":
        return (
            "Blind spots to inspect:\n\n"
            "- Is the target a bare mirror or a working checkout?\n"
            "- Are we making assumptions from documentation instead of checking the live system?\n"
            "- What is the rollback plan if the action fails?\n"
            "- Are cost/quotas checked before any paid API call?\n\n"
            "Mitigations: dry-run first, capture logs, verify health endpoint."
        )
    if role_id == "security_auditor":
        return (
            "Security read:\n\n"
            "- Verify SSH method and key paths before acting\n"
            "- Reject destructive workflows unless ALLOW_DESTRUCTIVE=1 is explicit\n"
            "- Require confirmation before any git rewrite, repo deletion, or overwrite\n"
            "- Check for wrong host addresses and stale docs"
        )
    if role_id == "performance_analyst":
        return (
            "Performance read:\n\n"
            "- A bare mirror is cheap and stable\n"
            "- A working copy is a separate operational concern\n"
            "- Do not mix mirror operations and working-copy cleanup in the same task\n"
            "- Keep the process simple: setup mirror, push, audit"
        )
    if role_id == "business_impact":
        return (
            "Business read:\n\n"
            "- The real value is a safe, auditable git mirror and known working copy\n"
            "- This reduces operational risk and avoids destructive mistakes\n"
            "- NZ-first; never register anything in Australia\n"
            "- No real-user data or financial transactions without explicit go"
        )
    if role_id == "infra":
        return (
            "Infra read:\n\n"
            "- Confirm target is zynthio-vds-7372 (100.64.0.2) or VMI fallback (161.97.89.49)\n"
            "- Check named SSH aliases in ~/.ssh/config\n"
            "- Consider Headscale mesh, nginx, and DNS impact"
        )
    if role_id == "custom":
        return "Custom role not configured at runtime. Skipping."

    return desc or f"No built-in content for role '{role_id}'. Add a ROLE_CMD_{role_id.upper()} env var or define system_prompt in roles.yaml."

with open(output_path, "a") as out:
    for role_id in roles_to_run:
        role = config.get(role_id)
        if not role:
            out.write(f"## Role not found: {role_id}\n\n")
            continue
        name = role.get("name", role_id)
        layer = role.get("layer", 4)
        gate = role.get("gate", False)
        out.write(f"## Layer {layer} — {name}\n\n")
        if gate:
            out.write("*(Gate role)*\n\n")
        out.write(render(role_id, role))
        out.write("\n\n---\n\n")

    out.write("## Final synthesis\n\n")
    out.write("The minimal safe pattern is:\n\n")
    out.write("1. Verify the VDS and SSH method\n")
    out.write("2. Verify the repo path and target\n")
    out.write("3. Decide if the task is a mirror, a working copy, or a deploy\n")
    out.write("4. Reject destructive flags until explicitly authorized\n")
    out.write("5. Run the smallest safe action\n")
    out.write("6. Record the outcome with consequence.sh\n\n")
    out.write("This prevents common issues: wrong VDS address, fake package claims, bad repo assumptions, destructive syncs, and path confusion.\n")

PY

echo "Perspective report written to: $OUTPUT"
