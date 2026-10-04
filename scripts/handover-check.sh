#!/bin/bash
# Verify handover promises vs repo reality. Run from project root.
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

pass=0
fail=0
warn=0

check() {
  local label="$1"
  local ok="$2"
  if [ "$ok" = "1" ]; then
    echo -e "${GREEN}PASS${NC} $label"
    pass=$((pass + 1))
  else
    echo -e "${RED}FAIL${NC} $label"
    fail=$((fail + 1))
  fi
}

warn_check() {
  local label="$1"
  local ok="$1"
  echo -e "${YELLOW}WARN${NC} $label"
  warn=$((warn + 1))
}

echo "Handover accountability check"
echo "=============================="

[ -f MASTER_HANDOVER.md ] && ok=1 || ok=0
check "MASTER_HANDOVER.md exists" "$ok"

[ -f docs/HANDOVER_ACCOUNTABILITY_2026-04-21.md ] && ok=1 || ok=0
check "Accountability diff doc exists" "$ok"

[ -f docs/SESSION-HANDOVER-2026-03-23.md ] && ok=1 || ok=0
check "March session handover exists" "$ok"

[ -f TODO_MASTER_LIVE.md ] && ok=1 || ok=0
check "TODO_MASTER_LIVE.md exists" "$ok"

grep -q 'INC-022' app/api/incidents/route.ts && ok=1 || ok=0
check "INC-022 logged in incidents API" "$ok"

grep -q 'competition\|league' app/pricing/page.tsx && ok=1 || ok=0
check "Pricing uses competition/league model" "$ok"

[ -f app/api/legal/route.ts ] && ok=1 || ok=0
check "/api/legal exists (March must-fix)" "$ok"

[ -f app/api/health/route.ts ] && ok=1 || ok=0
check "/api/health exists (March must-fix)" "$ok"

[ -f app/api/competitions/route.ts ] && ok=1 || ok=0
check "/api/competitions exists (March should-build)" "$ok"

echo ""
echo "Summary: pass=$pass fail=$fail"
echo "Read docs/HANDOVER_ACCOUNTABILITY_2026-04-21.md for full old-vs-new analysis."
exit 0
