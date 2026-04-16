#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CoreIntent — Full Site Audit Script
# Run from project root: ./scripts/audit.sh
#
# Checks: build, links, legal, SEO, security, functions, truth
# Output: AUDIT_REPORT.md in project root
# ═══════════════════════════════════════════════════════════════

set -e

REPORT="AUDIT_REPORT.md"
PASS=0
FAIL=0
WARN=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_pass() { echo -e "${GREEN}PASS${NC} $1"; PASS=$((PASS + 1)); echo "- PASS: $1" >> "$REPORT"; }
log_fail() { echo -e "${RED}FAIL${NC} $1"; FAIL=$((FAIL + 1)); echo "- **FAIL:** $1" >> "$REPORT"; }
log_warn() { echo -e "${YELLOW}WARN${NC} $1"; WARN=$((WARN + 1)); echo "- WARN: $1" >> "$REPORT"; }
log_info() { echo -e "${BLUE}INFO${NC} $1"; echo "- INFO: $1" >> "$REPORT"; }

echo ""
echo "═══════════════════════════════════════════"
echo " CoreIntent — Full Site Audit"
echo " $(date)"
echo "═══════════════════════════════════════════"
echo ""

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo "ERROR: Run this from the coreintent project root"
  exit 1
fi

# Start report
cat > "$REPORT" << 'HEADER'
# CoreIntent Audit Report
HEADER
echo "Generated: $(date)" >> "$REPORT"
echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 1. BUILD CHECK
# ═══════════════════════════════════════════
echo "## 1. Build" >> "$REPORT"
echo ""
echo "--- BUILD CHECK ---"

if npm run build > /tmp/coreintent_build.log 2>&1; then
  log_pass "npm run build succeeds"
  ROUTES=$(grep -c "○\|ƒ" /tmp/coreintent_build.log 2>/dev/null || echo "?")
  log_info "Routes found: $ROUTES"
else
  log_fail "npm run build FAILS — see /tmp/coreintent_build.log"
fi

# TypeScript check
if npx tsc --noEmit > /dev/null 2>&1; then
  log_pass "TypeScript compiles (strict mode)"
else
  log_fail "TypeScript errors found"
fi

# Lint check
if npm run lint > /dev/null 2>&1; then
  log_pass "ESLint passes"
else
  log_warn "ESLint warnings or errors"
fi

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 2. PAGE ROUTES
# ═══════════════════════════════════════════
echo "## 2. Pages" >> "$REPORT"
echo ""
echo "--- PAGE CHECK ---"

for page in app/page.tsx app/pricing/page.tsx app/stack/page.tsx app/privacy/page.tsx app/terms/page.tsx app/disclaimer/page.tsx; do
  if [ -f "$page" ]; then
    log_pass "Page exists: $page"
  else
    log_fail "Page missing: $page"
  fi
done

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 3. LEGAL PAGES
# ═══════════════════════════════════════════
echo "## 3. Legal Compliance" >> "$REPORT"
echo ""
echo "--- LEGAL CHECK ---"

[ -f "app/privacy/page.tsx" ] && log_pass "Privacy policy page exists" || log_fail "Privacy policy MISSING (CRITICAL for trading platform)"
[ -f "app/terms/page.tsx" ] && log_pass "Terms of service page exists" || log_fail "Terms of service MISSING (CRITICAL)"
[ -f "app/disclaimer/page.tsx" ] && log_pass "Disclaimer page exists" || log_fail "Disclaimer MISSING (CRITICAL for crypto)"

# Check for risk warnings
if grep -rq "not financial advice\|significant risk\|past performance" app/ 2>/dev/null; then
  log_pass "Risk warnings found in codebase"
else
  log_fail "No risk warnings found (CRITICAL for trading platform)"
fi

# Check for NZ law reference
if grep -rq "New Zealand" app/ 2>/dev/null; then
  log_pass "NZ jurisdiction referenced"
else
  log_warn "No NZ jurisdiction reference found"
fi

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 4. SEO & META
# ═══════════════════════════════════════════
echo "## 4. SEO & Meta Tags" >> "$REPORT"
echo ""
echo "--- SEO CHECK ---"

# OG tags
if grep -q "openGraph" app/layout.tsx 2>/dev/null; then
  log_pass "OpenGraph meta tags configured"
else
  log_fail "OpenGraph meta tags MISSING"
fi

# Twitter cards
if grep -q "twitter" app/layout.tsx 2>/dev/null; then
  log_pass "Twitter card meta tags configured"
else
  log_fail "Twitter card meta tags MISSING"
fi

# robots.txt
if [ -f "public/robots.txt" ] || [ -f "app/robots.ts" ]; then
  log_pass "robots.txt exists"
else
  log_fail "robots.txt MISSING"
fi

# sitemap
if [ -f "app/sitemap.ts" ] || [ -f "public/sitemap.xml" ]; then
  log_pass "Sitemap exists"
else
  log_fail "Sitemap MISSING"
fi

# favicon
if ls public/favicon* public/icon* app/favicon* app/icon* 2>/dev/null | head -1 > /dev/null 2>&1; then
  log_pass "Favicon exists"
else
  log_warn "No favicon found"
fi

# Page-level metadata
for page in app/privacy/page.tsx app/terms/page.tsx app/disclaimer/page.tsx; do
  if [ -f "$page" ] && grep -q "metadata" "$page" 2>/dev/null; then
    log_pass "Page metadata: $page"
  elif [ -f "$page" ]; then
    log_warn "No page-level metadata: $page"
  fi
done

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 5. SECURITY
# ═══════════════════════════════════════════
echo "## 5. Security" >> "$REPORT"
echo ""
echo "--- SECURITY CHECK ---"

# Security headers
if grep -q "X-Frame-Options" next.config.js 2>/dev/null; then
  log_pass "X-Frame-Options header configured"
else
  log_fail "X-Frame-Options MISSING"
fi

if grep -q "X-Content-Type-Options" next.config.js 2>/dev/null; then
  log_pass "X-Content-Type-Options header configured"
else
  log_fail "X-Content-Type-Options MISSING"
fi

if grep -q "Strict-Transport-Security" next.config.js 2>/dev/null; then
  log_pass "HSTS header configured"
else
  log_warn "HSTS header MISSING"
fi

if grep -q "Referrer-Policy" next.config.js 2>/dev/null; then
  log_pass "Referrer-Policy configured"
else
  log_warn "Referrer-Policy MISSING"
fi

# Exposed secrets
SECRETS_FOUND=0
for pattern in "sk-ant-api" "sk_live" "xai-" "pplx-" "AKIA" "ghp_" "ghu_"; do
  if grep -rq "$pattern" app/ components/ lib/ --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null; then
    # Check if it's in a placeholder check, not a real key
    REAL_MATCH=$(grep -rn "$pattern" app/ components/ lib/ --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null | grep -v "xxx\|placeholder\|example\|process.env\|startsWith\|===" || true)
    if [ -n "$REAL_MATCH" ]; then
      log_fail "POSSIBLE EXPOSED SECRET: $pattern found in source"
      SECRETS_FOUND=$((SECRETS_FOUND + 1))
    fi
  fi
done
[ $SECRETS_FOUND -eq 0 ] && log_pass "No exposed secrets in source code"

# .env in git
if git ls-files --error-unmatch .env 2>/dev/null; then
  log_fail ".env file is tracked by git (SECURITY RISK)"
else
  log_pass ".env is NOT tracked by git"
fi

# dangerouslySetInnerHTML
DANGEROUS=$(grep -rn "dangerouslySetInnerHTML" components/ app/ 2>/dev/null || true)
if [ -n "$DANGEROUS" ]; then
  log_warn "dangerouslySetInnerHTML used (potential XSS): $(echo "$DANGEROUS" | head -1)"
else
  log_pass "No dangerouslySetInnerHTML usage"
fi

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 6. NAVIGATION & FOOTER
# ═══════════════════════════════════════════
echo "## 6. Navigation & Footer" >> "$REPORT"
echo ""
echo "--- NAV/FOOTER CHECK ---"

[ -f "components/SiteNav.tsx" ] && log_pass "Shared SiteNav component exists" || log_fail "No shared navigation component"
[ -f "components/SiteFooter.tsx" ] && log_pass "Shared SiteFooter component exists" || log_fail "No shared footer component"

# Check pages use shared nav
for page in app/pricing/page.tsx app/stack/page.tsx app/privacy/page.tsx app/terms/page.tsx app/disclaimer/page.tsx; do
  if [ -f "$page" ]; then
    if grep -q "SiteNav\|SiteFooter" "$page" 2>/dev/null; then
      log_pass "Shared nav/footer used: $page"
    else
      log_warn "Missing shared nav/footer: $page"
    fi
  fi
done

# Internal links (next/link usage)
LINK_COUNT=$(grep -rn "from \"next/link\"" app/ components/ 2>/dev/null | wc -l)
if [ "$LINK_COUNT" -gt 0 ]; then
  log_pass "next/link used in $LINK_COUNT files"
else
  log_fail "next/link not used anywhere (no internal navigation)"
fi

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 7. TRUTH CHECK — No Fake Status Claims
# ═══════════════════════════════════════════
echo "## 7. Truth Check" >> "$REPORT"
echo ""
echo "--- TRUTH CHECK ---"

# Check for misleading status words in pages
for word in '"connected"' '"active"' '"running"' '"live"'; do
  MATCHES=$(grep -rn "$word" app/page.tsx app/stack/page.tsx app/pricing/page.tsx 2>/dev/null | grep -v "// " | grep -v "comment" || true)
  if [ -n "$MATCHES" ]; then
    log_warn "Potentially misleading status '$word' found in pages"
    echo "$MATCHES" | head -3 | while read -r line; do
      echo "  $line" >> "$REPORT"
      echo "    $line"
    done
  fi
done

# Check for honest labels
for word in "planned" "ready" "paper" "demo" "alpha"; do
  if grep -rqi "$word" app/page.tsx app/stack/page.tsx 2>/dev/null; then
    log_pass "Honest label '$word' found in pages"
  fi
done

# Demo data in API routes
DEMO_ROUTES=0
for route in app/api/*/route.ts; do
  if grep -qi "demo\|hardcoded\|placeholder\|static" "$route" 2>/dev/null; then
    DEMO_ROUTES=$((DEMO_ROUTES + 1))
  fi
done
if [ $DEMO_ROUTES -gt 0 ]; then
  log_info "$DEMO_ROUTES API routes contain demo/hardcoded data"
fi

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 8. ACCESSIBILITY
# ═══════════════════════════════════════════
echo "## 8. Accessibility" >> "$REPORT"
echo ""
echo "--- ACCESSIBILITY CHECK ---"

if grep -rq 'aria-label\|aria-pressed\|role=' app/ components/ 2>/dev/null; then
  ARIA_COUNT=$(grep -rn 'aria-label\|aria-pressed\|role=' app/ components/ 2>/dev/null | wc -l)
  log_pass "ARIA attributes found ($ARIA_COUNT instances)"
else
  log_fail "No ARIA attributes found"
fi

if grep -q 'lang="en' app/layout.tsx 2>/dev/null; then
  log_pass "HTML lang attribute set"
else
  log_fail "HTML lang attribute missing"
fi

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 9. DEPENDENCIES
# ═══════════════════════════════════════════
echo "## 9. Dependencies" >> "$REPORT"
echo ""
echo "--- DEPENDENCY CHECK ---"

# Unused dependencies
if grep -q "@xterm/xterm" package.json 2>/dev/null; then
  if grep -rq "xterm" components/ app/ --include="*.ts" --include="*.tsx" 2>/dev/null; then
    log_pass "xterm package is used"
  else
    log_warn "xterm package in package.json but not imported in components"
  fi
fi

# Check for outdated patterns
if grep -q '"next": "\^14' package.json 2>/dev/null; then
  log_info "Using Next.js 14"
fi

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# 10. VPS SCRIPTS
# ═══════════════════════════════════════════
echo "## 10. VPS & Deployment" >> "$REPORT"
echo ""
echo "--- VPS CHECK ---"

for script in scripts/risk_monitor.ts scripts/signal_listener.ts scripts/gtrade_listener.ts; do
  [ -f "$script" ] && log_pass "VPS script exists: $script" || log_fail "VPS script missing: $script"
done

for deploy in scripts/deploy-vps.sh scripts/deploy-vercel.sh scripts/deploy-all.sh; do
  [ -f "$deploy" ] && log_pass "Deploy script exists: $deploy" || log_warn "Deploy script missing: $deploy"
done

# Check if deploy scripts are executable
for deploy in scripts/deploy-*.sh; do
  if [ -f "$deploy" ]; then
    if [ -x "$deploy" ]; then
      log_pass "Executable: $deploy"
    else
      log_warn "Not executable: $deploy (run chmod +x)"
    fi
  fi
done

echo "" >> "$REPORT"

# ═══════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════
echo "" >> "$REPORT"
echo "## Summary" >> "$REPORT"
echo "" >> "$REPORT"
echo "| Result | Count |" >> "$REPORT"
echo "|--------|-------|" >> "$REPORT"
echo "| PASS | $PASS |" >> "$REPORT"
echo "| FAIL | $FAIL |" >> "$REPORT"
echo "| WARN | $WARN |" >> "$REPORT"
echo "" >> "$REPORT"

TOTAL=$((PASS + FAIL + WARN))
SCORE=$(( (PASS * 100) / (TOTAL > 0 ? TOTAL : 1) ))
echo "**Audit Score: ${SCORE}%** ($PASS/$TOTAL checks passed)" >> "$REPORT"

echo ""
echo "═══════════════════════════════════════════"
echo " AUDIT COMPLETE"
echo "═══════════════════════════════════════════"
echo ""
echo -e " ${GREEN}PASS:${NC} $PASS"
echo -e " ${RED}FAIL:${NC} $FAIL"
echo -e " ${YELLOW}WARN:${NC} $WARN"
echo ""
echo " Score: ${SCORE}% ($PASS/$TOTAL)"
echo ""
echo " Full report: $REPORT"
echo ""
