# CoreIntent Audit Report
Generated: Wed May  6 06:39:18 UTC 2026

## 1. Build
- PASS: npm run build succeeds
- INFO: Routes found: 29
- PASS: TypeScript compiles (strict mode)
- PASS: ESLint passes

## 2. Pages
- PASS: Page exists: app/page.tsx
- PASS: Page exists: app/[locale]/page.tsx
- PASS: Page exists: app/[locale]/pricing/page.tsx
- PASS: Page exists: app/[locale]/stack/page.tsx
- PASS: Page exists: app/[locale]/privacy/page.tsx
- PASS: Page exists: app/[locale]/terms/page.tsx
- PASS: Page exists: app/[locale]/disclaimer/page.tsx

## 3. Legal Compliance
- PASS: Privacy policy page exists
- PASS: Terms of service page exists
- PASS: Disclaimer page exists
- PASS: Risk warnings found in codebase
- PASS: NZ jurisdiction referenced

## 4. SEO & Meta Tags
- PASS: OpenGraph meta tags configured
- PASS: Twitter card meta tags configured
- PASS: robots.txt exists
- PASS: Sitemap exists
- PASS: Favicon exists
- PASS: Page metadata: app/[locale]/privacy/page.tsx
- PASS: Page metadata: app/[locale]/terms/page.tsx
- PASS: Page metadata: app/[locale]/disclaimer/page.tsx

## 5. Security
- PASS: X-Frame-Options header configured
- PASS: X-Content-Type-Options header configured
- PASS: HSTS header configured
- PASS: Referrer-Policy configured
- PASS: No exposed secrets in source code
- PASS: .env is NOT tracked by git
- WARN: dangerouslySetInnerHTML used (potential XSS): components/Terminal.tsx:2991:          <div key={i} dangerouslySetInnerHTML={{ __html: ansiToHtml(line) }} />

## 6. Navigation & Footer
- PASS: Shared SiteNav component exists
- PASS: Shared SiteFooter component exists
- PASS: Shared nav/footer used: app/[locale]/pricing/page.tsx
- PASS: Shared nav/footer used: app/[locale]/stack/page.tsx
- PASS: Shared nav/footer used: app/[locale]/privacy/page.tsx
- PASS: Shared nav/footer used: app/[locale]/terms/page.tsx
- PASS: Shared nav/footer used: app/[locale]/disclaimer/page.tsx
- PASS: next/link used in 6 files

## 7. Truth Check
- INFO: 12 API routes contain demo/hardcoded data

## 8. Accessibility
- PASS: ARIA attributes found (19 instances)
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
| PASS | 48 |
| FAIL | 0 |
| WARN | 1 |

**Audit Score: 97%** (48/49 checks passed)
