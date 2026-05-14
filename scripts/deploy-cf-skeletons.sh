#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CoreIntent — Cloudflare Pages Skeleton Deployer
# Creates 48 placeholder Pages projects under the CoreIntent CF account.
# Run from project root: ./scripts/deploy-cf-skeletons.sh
#
# Why this exists:
#   Claude Desktop sessions kept reporting "no token" when asked to deploy
#   the 48 skeleton sites. The VDS holds the SSH credentials; Cloudflare
#   needs a separate API token (CLOUDFLARE_API_TOKEN). Both must be set.
#
# Required env (from .env or shell):
#   CLOUDFLARE_API_TOKEN   — scoped to "Pages:Edit" + "Account:Read"
#   CLOUDFLARE_ACCOUNT_ID  — target Cloudflare account
#
# Optional:
#   CF_SKELETON_PREFIX     — project name prefix (default: "coreintent-skel")
#   CF_SKELETON_COUNT      — how many to create (default: 48)
# ═══════════════════════════════════════════════════════════════

set -e

# Load .env if present so the script can be run standalone.
if [ -f ".env" ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

PREFIX="${CF_SKELETON_PREFIX:-coreintent-skel}"
COUNT="${CF_SKELETON_COUNT:-48}"

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "ERROR: CLOUDFLARE_API_TOKEN is not set."
  echo "Set it in .env (see .env.example) or export it before running."
  echo "This is the missing piece that made Claude Desktop say 'no token'."
  exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "ERROR: CLOUDFLARE_ACCOUNT_ID is not set."
  exit 1
fi

API="https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects"

echo "═══════════════════════════════════════════"
echo " CoreIntent → Cloudflare Pages Skeletons"
echo " Account:  ${CLOUDFLARE_ACCOUNT_ID}"
echo " Prefix:   ${PREFIX}"
echo " Count:    ${COUNT}"
echo "═══════════════════════════════════════════"

CREATED=0
SKIPPED=0
FAILED=0

for i in $(seq 1 "$COUNT"); do
  NAME=$(printf "%s-%02d" "$PREFIX" "$i")

  RESP=$(curl -s -w "\n%{http_code}" -X POST "$API" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "{\"name\":\"${NAME}\",\"production_branch\":\"main\"}")

  CODE=$(echo "$RESP" | tail -n1)
  BODY=$(echo "$RESP" | sed '$d')

  case "$CODE" in
    200|201)
      echo "  [+] created  ${NAME}"
      CREATED=$((CREATED + 1))
      ;;
    409)
      echo "  [=] exists   ${NAME}"
      SKIPPED=$((SKIPPED + 1))
      ;;
    *)
      echo "  [!] failed   ${NAME} (HTTP ${CODE})"
      echo "      ${BODY}" | head -c 240
      echo ""
      FAILED=$((FAILED + 1))
      ;;
  esac
done

echo ""
echo "═══════════════════════════════════════════"
echo " Done. created=${CREATED} existing=${SKIPPED} failed=${FAILED}"
echo "═══════════════════════════════════════════"

[ "$FAILED" -eq 0 ]
