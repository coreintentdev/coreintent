# CoreIntent Audit Report
Generated: Thu Apr 16 14:29:47 UTC 2026

## 1. Build
- PASS: npm run build succeeds
- INFO: Routes found: 31
- PASS: TypeScript compiles (strict mode)
- PASS: ESLint passes

## 2. Pages
- PASS: Page exists: app/page.tsx
- PASS: Page exists: app/pricing/page.tsx
- PASS: Page exists: app/stack/page.tsx
- PASS: Page exists: app/privacy/page.tsx
- PASS: Page exists: app/terms/page.tsx
- PASS: Page exists: app/disclaimer/page.tsx

## 3. Legal Compliance
- PASS: Privacy policy page exists
- PASS: Terms of service page exists
- PASS: Disclaimer page exists
- PASS: Risk warnings found in codebase
- PASS: NZ jurisdiction referenced

## 4. SEO & Meta Tags
- PASS: OpenGraph meta tags configured
- PASS: Twitter card meta tags configured
- PASS: robots.txt configured (static or dynamic)
- PASS: Sitemap exists
- PASS: Favicon exists
- PASS: Page metadata: app/privacy/page.tsx
- PASS: Page metadata: app/terms/page.tsx
- PASS: Page metadata: app/disclaimer/page.tsx

## 5. Security
- PASS: X-Frame-Options header configured
- PASS: X-Content-Type-Options header configured
- PASS: HSTS header configured
- PASS: Referrer-Policy configured
- PASS: No exposed secrets in source code
- PASS: .env is NOT tracked by git
- WARN: dangerouslySetInnerHTML used (potential XSS): components/Terminal.tsx:1347:          <div key={i} dangerouslySetInnerHTML={{ __html: ansiToHtml(line) }} />

## 6. Navigation & Footer
- PASS: Shared SiteNav component exists
- PASS: Shared SiteFooter component exists
- PASS: Shared nav/footer used: app/pricing/page.tsx
- PASS: Shared nav/footer used: app/stack/page.tsx
- PASS: Shared nav/footer used: app/privacy/page.tsx
- PASS: Shared nav/footer used: app/terms/page.tsx
- PASS: Shared nav/footer used: app/disclaimer/page.tsx
- PASS: next/link used in 3 files

## 7. Truth Check
- WARN: Potentially misleading status '"active"' found in pages
  app/page.tsx:63:  { domain: "coreyai.ai", role: "Personal AI brand", status: "active" },
  app/page.tsx:64:  { domain: "zynthio.ai", role: "Parent brand / trading engine", status: "active" },
  app/page.tsx:65:  { domain: "coreintent.dev", role: "Dev hub / this site", status: "active" },
- PASS: Honest label 'planned' found in pages
- PASS: Honest label 'ready' found in pages
- PASS: Honest label 'paper' found in pages
- PASS: Honest label 'demo' found in pages
- PASS: Honest label 'alpha' found in pages
- INFO: 12 API routes contain demo/hardcoded data

## 8. Accessibility
- PASS: ARIA attributes found (12 instances)
- PASS: HTML lang attribute set

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
| PASS | 52 |
| FAIL | 0 |
| WARN | 2 |

**Audit Score: 96%** (52/54 checks passed)
