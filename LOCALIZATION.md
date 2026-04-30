# CoreIntent — Internationalization (i18n)

## Supported Languages

| Code | Language      | Direction | Status     |
|------|---------------|-----------|------------|
| en   | English       | LTR       | Complete   |
| es   | Español       | LTR       | Complete   |
| mi   | Te Reo Māori  | LTR       | Complete   |
| zh   | 中文           | LTR       | Stub ready |
| ja   | 日本語         | LTR       | Stub ready |
| pt   | Português     | LTR       | Stub ready |
| fr   | Français      | LTR       | Stub ready |
| de   | Deutsch       | LTR       | Stub ready |
| ar   | العربية       | RTL       | Stub ready |
| hi   | हिन्दी         | LTR       | Stub ready |

## Architecture

### Routing

CoreIntent uses Next.js App Router with `app/[locale]/` pattern:

```
app/
  layout.tsx           ← Root layout (dynamic lang/dir from cookie)
  page.tsx             ← Default landing page (uses i18n hook with English fallback)
  [locale]/
    layout.tsx         ← Locale layout (provides LocaleProvider context)
    page.tsx           ← Re-exports landing page with locale context
  api/                 ← API routes (not localized)
  pricing/             ← Other pages (accessible at root path)
```

### Translation Files

Translations live in `messages/{locale}.json`:

```
messages/
  en.json              ← English (source of truth)
  es.json              ← Spanish
  mi.json              ← Te Reo Māori
```

### Core Files

- `lib/i18n.ts` — Locale config, detection, formatting utilities
- `lib/locale-context.tsx` — React context provider and `useLocale()` hook
- `components/LanguageSwitcher.tsx` — Language selection dropdown
- `middleware.ts` — Locale detection from Accept-Language header + cookie

### How Translation Works

1. Middleware detects locale from cookie or Accept-Language header
2. Sets a `locale` cookie for subsequent requests
3. Root layout reads cookie for `lang` and `dir` attributes on `<html>`
4. `app/[locale]/layout.tsx` loads messages and wraps children in `LocaleProvider`
5. Components call `useLocale()` to access `t()`, `formatNumber()`, `formatDate()`, etc.
6. When no provider is present (root `/`), fallback uses English messages

### Usage in Components

```tsx
"use client";
import { useLocale } from "@/lib/locale-context";

function MyComponent() {
  const { t, formatNumber, formatDate, formatCurrency, locale, dir } = useLocale();

  return (
    <div>
      <h1>{t("hero.tagline")}</h1>
      <p>{t("footer.copyright", { year: "2026" })}</p>
      <p>{formatNumber(12847)}</p>
      <p>{formatCurrency(99.99, "NZD")}</p>
      <p>{formatDate(new Date())}</p>
    </div>
  );
}
```

### Translation Keys

Keys use dot notation: `section.key`

Example from `en.json`:
```json
{
  "hero": {
    "tagline": "The agentic AI trading engine...",
    "launchTerminal": "Launch Terminal"
  },
  "nav": {
    "terminal": "Terminal",
    "pricing": "Pricing"
  }
}
```

Interpolation uses `{param}` syntax:
```json
{
  "footer": {
    "copyright": "© {year} Corey McIvor. All rights reserved."
  }
}
```

## Adding a New Language

1. Create `messages/{code}.json` (copy `en.json` as template)
2. Translate all string values
3. The locale code is already in `SUPPORTED_LOCALES` in `lib/i18n.ts` — if adding a code not in the default list, add it there plus `LOCALE_NAMES` and `LOCALE_HTML_LANG`
4. If RTL, add to `RTL_LOCALES` in `lib/i18n.ts`
5. Build and test: `npm run build`

## RTL Support

Arabic (`ar`) is RTL. The system:
- Sets `dir="rtl"` on `<html>` via root layout
- CSS rules in `globals.css` handle layout mirroring
- The ticker animation reverses direction
- Step connectors flip horizontally

## SEO

- `<html lang="{locale}">` set dynamically per request
- `<link rel="alternate" hrefLang="...">` tags in `<head>` for all locales
- `<link rel="alternate" hrefLang="x-default">` points to root
- `alternates.languages` in metadata for search engine discovery
- Schema.org `inLanguage` lists all supported locales

## Date/Number Formatting

All formatting is locale-aware via `Intl` APIs:

- `formatNumber(12847)` → "12,847" (en) / "12.847" (es) / "12,847" (mi)
- `formatCurrency(99.99)` → "$99.99" (en) / "99,99 US$" (es)
- `formatDate(new Date())` → locale-appropriate date string
- `formatPercent(87.5)` → "87.5%" (en) / "87,5 %" (fr)

All dates default to Pacific/Auckland timezone.

## Terminal Greeting

The terminal component detects the user's locale and greets in their language:
- English: "Welcome to CoreIntent Commander"
- Spanish: "Bienvenido a CoreIntent Commander"
- Te Reo Māori: "Kia ora — Nau mai ki CoreIntent Commander"
- And 7 more languages

## Cultural Context

- Founder is NZ-based with Māori heritage awareness
- Te Reo Māori is a first-class supported language
- Platform targets global traders
- Bots are welcome across all locales
- All legal/business remains NZ-first regardless of user locale
