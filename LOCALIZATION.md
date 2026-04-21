# CoreIntent — Internationalization (i18n) Architecture

## Overview

CoreIntent uses Next.js 15 App Router locale-based routing with a zero-dependency translation system. All user-facing routes live under `app/[locale]/`, and middleware handles locale detection, negotiation, and redirection.

## Supported Locales

| Code | Language       | Native Name  | RTL | Status     |
| ---- | -------------- | ------------ | --- | ---------- |
| en   | English        | English      | No  | Complete   |
| es   | Spanish        | Espanol      | No  | Complete   |
| mi   | Te Reo Maori   | Te Reo Maori | No  | Complete   |
| zh   | Chinese        | 中文          | No  | Fallback   |
| ja   | Japanese       | 日本語        | No  | Fallback   |
| pt   | Portuguese     | Portugues    | No  | Fallback   |
| fr   | French         | Francais     | No  | Fallback   |
| de   | German         | Deutsch      | No  | Fallback   |
| ar   | Arabic         | العربية       | Yes | Fallback   |
| hi   | Hindi          | हिन्दी        | No  | Fallback   |

"Fallback" means the locale is routable but uses English translations until a native translation file is provided.

## File Structure

```
lib/
  i18n-config.ts     # Locale definitions, RTL config, type exports
  i18n.ts            # Server-side dictionary loader, t() helper, locale negotiation
  i18n-context.tsx   # Client-side React context + useTranslation() hook
  format.ts          # Locale-aware number, currency, date, and relative time formatting

messages/
  en.json            # English (complete)
  es.json            # Spanish (complete)
  mi.json            # Te Reo Maori (complete)

middleware.ts        # Locale detection, URL redirect, cookie persistence

app/
  layout.tsx         # Root layout — reads x-locale header for html lang/dir
  [locale]/
    layout.tsx       # Locale layout — loads dictionary, wraps in I18nProvider, hreflang SEO
    page.tsx         # Landing page with translated strings
    pricing/         # Pricing page
    stack/           # Stack page
    demo/            # Demo page
    privacy/         # Privacy page
    terms/           # Terms page
    disclaimer/      # Disclaimer page

components/
  LanguageSwitcher.tsx   # Dropdown language picker in nav
  SiteNav.tsx            # Locale-aware navigation links
  SiteFooter.tsx         # Locale-aware footer links
  Terminal.tsx           # Locale-aware greeting banner
```

## How It Works

### Routing

1. Middleware intercepts all non-API, non-static requests
2. If the URL has a known locale prefix (`/es/pricing`), it passes through and sets `x-locale` header
3. If not, middleware checks: cookie > Accept-Language header > default (en)
4. Redirects to the locale-prefixed URL (e.g., `/pricing` -> `/en/pricing`)
5. Sets `NEXT_LOCALE` cookie for persistence

### Translation Loading

- Server components: `getDictionary(locale)` loads the JSON file via dynamic import
- Client components: `I18nProvider` wraps children with dictionary context
- `useTranslation()` hook returns `{ locale, dict, t }` where `t("key.path")` resolves nested keys

### Number/Date Formatting

Use `lib/format.ts` for all user-facing numbers and dates:
- `formatNumber(value, locale)` — locale-aware number formatting
- `formatCurrency(value, locale, currency?)` — currency formatting
- `formatDate(date, locale)` — date formatting
- `formatDateTime(date, locale)` — date + time formatting
- `formatRelativeTime(date, locale)` — "2 hours ago" style
- `formatCompactNumber(value, locale)` — "1.5K" style

### RTL Support

Arabic (`ar`) triggers RTL mode:
- Root layout sets `dir="rtl"` on `<html>`
- CSS handles direction flipping via `[dir="rtl"]` selectors
- Language switcher positions dropdown on the correct side

## Adding a New Language

1. Create `messages/{code}.json` by copying `messages/en.json` and translating all values
2. The locale code is already in `lib/i18n-config.ts` `locales` array — verify it's there
3. Add the dictionary loader in `lib/i18n.ts`:
   ```typescript
   {code}: () => import("@/messages/{code}.json").then((m) => m.default),
   ```
4. If the language is RTL, add it to `rtlLocales` in `lib/i18n-config.ts`
5. Run `npm run build` to verify

## Translation Key Structure

Keys are nested by section:

```json
{
  "nav": { "terminal": "...", "demo": "...", "stack": "...", "pricing": "..." },
  "hero": { "badge": "...", "subtitle": "...", "description": "...", ... },
  "valueProps": { "threeModels": { "label": "...", "desc": "..." }, ... },
  "pipeline": { "title": "...", "detect": "...", ... },
  "stats": { "aiModels": "...", ... },
  "tabs": { "terminal": "...", "dashboard": "...", ... },
  "dashboard": { "domainPortfolio": "...", ... },
  "agents": { "title": "...", "subtitle": "..." },
  "footer": { "tagline": "...", "product": "...", ... },
  "terminal": { "greeting": "...", "helpPrompt": "...", "welcome": "..." },
  "meta": { "title": "...", "description": "..." },
  "statusBar": { "paperTrading": "..." },
  "languageSwitcher": { "label": "..." }
}
```

## SEO

Each locale page includes:
- `<html lang="{locale}">` with correct BCP 47 tag
- `<link rel="alternate" hreflang="{locale}" href="...">` for all locales
- `<link rel="alternate" hreflang="x-default" href=".../en">` for default
- Locale-specific `<title>` and `<meta description>`
- OpenGraph `locale` property matches the page language

## Cultural Context

- **NZ-first**: Default locale is `en-NZ`, not `en-US`. Date formats, spelling (analyse not analyze), and currency reflect NZ conventions
- **Te Reo Maori**: Included as a first-class locale, not an afterthought. Reflects the founder's NZ heritage
- **Bots welcome**: The platform is AI-to-AI friendly — translations should be clear and parseable, not idiomatic to the point of being opaque
- **Honesty**: If a translation is machine-generated or approximate, label it. Don't present it as native-quality
