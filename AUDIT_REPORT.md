# CoreIntent Audit Report
Generated: Mon Apr 20 04:43:13 UTC 2026

## 1. Build
- PASS: npm run build succeeds
- INFO: Routes found: 22
- PASS: TypeScript compiles (strict mode)
- PASS: ESLint passes

## 2. Pages
- **FAIL:** Page missing: app/page.tsx
- **FAIL:** Page missing: app/pricing/page.tsx
- **FAIL:** Page missing: app/stack/page.tsx
- **FAIL:** Page missing: app/privacy/page.tsx
- **FAIL:** Page missing: app/terms/page.tsx
- **FAIL:** Page missing: app/disclaimer/page.tsx

## 3. Legal Compliance
- **FAIL:** Privacy policy MISSING (CRITICAL for trading platform)
- **FAIL:** Terms of service MISSING (CRITICAL)
- **FAIL:** Disclaimer MISSING (CRITICAL for crypto)
- PASS: Risk warnings found in codebase
- PASS: NZ jurisdiction referenced

## 4. SEO & Meta Tags
- **FAIL:** OpenGraph meta tags MISSING
- **FAIL:** Twitter card meta tags MISSING
- PASS: robots.txt exists
- PASS: Sitemap exists
- PASS: Favicon exists

## 5. Security
- PASS: X-Frame-Options header configured
- PASS: X-Content-Type-Options header configured
- PASS: HSTS header configured
- PASS: Referrer-Policy configured
- PASS: No exposed secrets in source code
- PASS: .env is NOT tracked by git
- WARN: dangerouslySetInnerHTML used (potential XSS): components/Terminal.tsx:1569:          <div key={i} dangerouslySetInnerHTML={{ __html: ansiToHtml(line) }} />

## 6. Navigation & Footer
- PASS: Shared SiteNav component exists
- PASS: Shared SiteFooter component exists
- PASS: next/link used in 2 files

## 7. Truth Check
- INFO: 12 API routes contain demo/hardcoded data

## 8. Accessibility
- PASS: ARIA attributes found (14 instances)
- **FAIL:** HTML lang attribute missing

## 9. Dependencies

## 10. VPS & Deployment
- PASS: VPS script exists: scripts/risk_monitor.ts
- PASS: VPS script exists: scripts/signal_listener.ts
- PASS: VPS script exists: scripts/gtrade_listener.ts
- PASS: Deploy script exists: scripts/deploy-vps.sh
- PASS: Deploy script exists: scripts/deploy-vercel.sh
- PASS: Deploy script exists: scripts/deploy-all.sh
- PASS: Executable: scripts/deploy-all.sh
- PASS: Executable: scripts/deploy-vercel.sh
- PASS: Executable: scripts/deploy-vps.sh


## Summary

| Result | Count |
|--------|-------|
| PASS | 27 |
| FAIL | 12 |
| WARN | 1 |

**Audit Score: 67%** (27/40 checks passed)
