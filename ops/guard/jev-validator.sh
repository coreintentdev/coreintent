#!/usr/bin/env bash
set -euo pipefail

# jev-validator.sh — validate a JSON file against ops/guard/jev-schema.yaml.
# Usage:
#   ./jev-validator.sh path/to/output.json

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA="$DIR/jev-schema.yaml"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <json-file>" >&2
  exit 1
fi

FILE="$1"
if [[ ! -f "$FILE" ]]; then
  echo "File not found: $FILE" >&2
  exit 1
fi

python3 - <<'PY' "$SCHEMA" "$FILE"
import sys, json, yaml
try:
    import jsonschema
except ImportError:
    print("jsonschema not installed; install with: pip install jsonschema", file=sys.stderr)
    sys.exit(2)

schema = yaml.safe_load(open(sys.argv[1]))
data = json.load(open(sys.argv[2]))

validator = jsonschema.Draft7Validator(schema)
errors = list(validator.iter_errors(data))
if errors:
    print("INVALID")
    for e in sorted(errors, key=lambda x: x.path):
        path = "/".join(str(p) for p in e.path) or "/"
        print(f"  [{path}] {e.message}")
    sys.exit(1)
print("VALID")
PY
