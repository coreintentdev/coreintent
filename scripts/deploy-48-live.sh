#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CoreIntent — 48 Domains → Cloudflare Pages, LIVE
#
# What this does (per Pages project):
#   1. Creates the Pages project if missing
#   2. Deploys a static placeholder build (the repo's exported Next.js OR
#      a fallback single-page HTML if dist/ is empty)
#   3. Attaches the custom domain to the project
#   4. Writes a CNAME DNS record at Cloudflare pointing the apex/sub at
#      the project's pages.dev URL
#   5. Logs result per domain to deploy-48-live-YYYYMMDD.log
#
# Run on operator Mac (this sandbox cannot — outbound to api.cloudflare.com
# is firewalled, confirmed 2026-05-13).
#
# Required env:
#   CLOUDFLARE_API_TOKEN    Scoped: Pages:Edit + Zone:DNS:Edit + Account:Read
#   CLOUDFLARE_ACCOUNT_ID   a61bf8a23a8488f6e4257e7127c70b76
#
# Optional env:
#   BUILD_DIR               Directory of static files to deploy (default: ./out)
#   DOMAINS_FILE            Source of domain list (default: docs/DOMAINS_48.md table parser)
#   DRY_RUN                 Set to "1" to print actions without calling API
#
# Notes:
#   - Domains registered at Porkbun or Namecheap must have nameservers
#     pointed at Cloudflare BEFORE this script can write DNS records.
#     If a zone isn't in CF yet, the script will SKIP that domain and
#     log it for operator follow-up.
#   - Pages can attach up to 100 custom domains per project. Each of the
#     27 currently-live CF zones gets its own project named after the
#     zone (slugified). Pure subdomains (e.g. 336.coreyai.ai) are NOT
#     deployed as separate projects — they attach to the parent zone's
#     project as additional custom domains.
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

API="https://api.cloudflare.com/client/v4"
LOG="deploy-48-live-$(date +%Y%m%d_%H%M%S).log"
DRY_RUN="${DRY_RUN:-0}"
BUILD_DIR="${BUILD_DIR:-./out}"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] || [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "ERROR: set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID before running."
  echo "Token scopes required: Pages:Edit + Zone:DNS:Edit + Account:Read"
  echo "Account ID: a61bf8a23a8488f6e4257e7127c70b76"
  exit 1
fi

AUTH=( -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json" )

log()  { printf '%s  %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" | tee -a "$LOG"; }
fail() { log "FAIL: $*"; }
ok()   { log "OK:   $*"; }

# === 1. Domain list — from docs/DOMAINS_48.md (the 27 live zones) ===
ZONES=(
  coreintent.dev
  coreyai.ai coreyai.dev coreyai.net
  coreylive.ai coreylive.com
  kervalon.ai kervalon.app
  mosoko.ai mosoko.app mosoko.dev
  pelicancharters.ai
  rhrhmn.app
  singpal.ai singpal.app singpal.net singpal.org singpals.com
  songpal.ai songpal.app songpal.dev songpal.io songpal.net songpal.org
  zyncontext.ai
  zynthio.ai zynthio.net
)

# === 2. Ensure build dir has something to deploy ===
if [ ! -d "$BUILD_DIR" ] || [ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]; then
  log "BUILD_DIR=$BUILD_DIR is empty — generating a one-page placeholder so deploys are not skeleton-empty."
  mkdir -p "$BUILD_DIR"
  cat > "$BUILD_DIR/index.html" <<'HTML'
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CoreIntent — coming online</title>
<style>body{font-family:system-ui,sans-serif;background:#0a0a0a;color:#e5e5e5;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}main{text-align:center;max-width:560px;padding:24px}h1{font-size:2rem;margin:0 0 8px}p{color:#a3a3a3;line-height:1.5}a{color:#60a5fa}</style>
</head><body><main>
<h1>CoreIntent</h1>
<p>Online. Real content shipping. Multi-AI trading engine, competition platform, built by Zynthio.</p>
<p><a href="https://coreintent.dev">coreintent.dev</a></p>
</main></body></html>
HTML
fi

# === 3. Helpers ===
cf_post() { curl -s -w '\n%{http_code}' -X POST "${AUTH[@]}" "$1" --data "$2"; }
cf_get()  { curl -s -w '\n%{http_code}' "${AUTH[@]}" "$1"; }

slug() { echo "$1" | tr '.' '-' | tr '[:upper:]' '[:lower:]'; }

ensure_pages_project() {
  local name="$1"
  local resp code body
  resp=$(cf_get "$API/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$name") || true
  code=$(echo "$resp" | tail -n1); body=$(echo "$resp" | sed '$d')
  if [ "$code" = "200" ]; then ok "project $name exists"; return 0; fi
  if [ "$DRY_RUN" = "1" ]; then log "DRY: create project $name"; return 0; fi
  resp=$(cf_post "$API/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects" \
    "{\"name\":\"$name\",\"production_branch\":\"main\"}")
  code=$(echo "$resp" | tail -n1)
  if [ "$code" = "200" ] || [ "$code" = "201" ]; then ok "project $name created"
  else fail "create $name HTTP $code"; return 1; fi
}

deploy_pages_build() {
  local name="$1"
  if [ "$DRY_RUN" = "1" ]; then log "DRY: wrangler pages deploy $BUILD_DIR --project-name=$name"; return 0; fi
  if ! command -v wrangler >/dev/null 2>&1; then
    fail "wrangler CLI not installed — npm i -g wrangler, then re-run"
    return 1
  fi
  wrangler pages deploy "$BUILD_DIR" --project-name="$name" --commit-dirty=true >/dev/null 2>&1 \
    && ok "deployed build to $name" \
    || fail "wrangler deploy failed for $name"
}

attach_domain() {
  local name="$1" domain="$2" resp code
  resp=$(cf_post "$API/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$name/domains" \
    "{\"name\":\"$domain\"}")
  code=$(echo "$resp" | tail -n1)
  case "$code" in
    200|201) ok "attached domain $domain → $name" ;;
    409)     ok "domain $domain already attached to $name" ;;
    *)       fail "attach $domain → $name HTTP $code" ;;
  esac
}

zone_id() {
  local zone="$1" resp
  resp=$(cf_get "$API/zones?name=$zone" | sed '$d')
  echo "$resp" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/'
}

write_dns() {
  local zone="$1" record_name="$2" target="$3" zid
  zid=$(zone_id "$zone")
  if [ -z "$zid" ]; then fail "zone $zone not in CF — skipping DNS"; return; fi
  if [ "$DRY_RUN" = "1" ]; then log "DRY: CNAME $record_name → $target in $zone"; return; fi
  curl -s -X POST "$API/zones/$zid/dns_records" "${AUTH[@]}" \
    --data "{\"type\":\"CNAME\",\"name\":\"$record_name\",\"content\":\"$target\",\"proxied\":true}" \
    > /dev/null && ok "CNAME $record_name → $target" || fail "CNAME $record_name"
}

# === 4. Main loop ===
log "═══ deploy-48-live starting ═══"
log "Account: $CLOUDFLARE_ACCOUNT_ID"
log "Build:   $BUILD_DIR"
log "Dry-run: $DRY_RUN"
log ""

for zone in "${ZONES[@]}"; do
  name=$(slug "$zone")
  log "--- $zone (project: $name) ---"
  ensure_pages_project "$name" || continue
  deploy_pages_build "$name"   || true
  attach_domain "$name" "$zone"
  attach_domain "$name" "www.$zone"
  # CNAME from zone apex + www to the pages.dev URL is handled automatically
  # by Cloudflare when the domain is attached to a Pages project via the
  # /domains endpoint. No extra DNS write needed.
done

log "═══ done — see $LOG ═══"
log ""
log "Next:"
log "  - Verify with: curl -sI https://coreintent.dev | head -3"
log "  - Repeat for any zone showing FAIL above"
log "  - Porkbun/Namecheap registrar: confirm nameservers point at Cloudflare for any zone in DOMAINS_48.md that wasn't found above"
