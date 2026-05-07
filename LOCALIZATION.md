# CoreIntent i18n Architecture

## Overview

CoreIntent uses Next.js 15 App Router i18n with a `[locale]` dynamic segment pattern.
All pages live under `app/[locale]/` and the middleware handles locale detection and routing.

## Supported Locales

| Code | Language | Direction | Status |
|------|----------|-----------|--------|
| `en` | English | LTR | Full |
| `es` | Español | LTR | Full |
| `mi` | Te Reo Māori | LTR | Full |
| `zh` | 中文 (Simplified) | LTR | Stub |
| `ja` | 日本語 | LTR | Stub |
| `pt` | Português (BR) | LTR | Stub |
| `fr` | Français | LTR | Stub |
| `de` | Deutsch | LTR | Stub |
| `ar` | العربية | RTL | Stub |
| `hi` | हिन्दी | LTR | Stub |

"Full" = complete translation file. "Stub" = falls back to English until translated.

## Directory Structure

```
lib/
  i18n-config.ts    # Locale list, RTL config, BCP47 mappings
  i18n.ts           # Server-side translation utilities
  locale-context.tsx # React context provider (client)
  use-formatting.ts  # Client hook for locale-aware numbers/dates

messages/
  en.json           # English (default)
  es.json           # Spanish
  mi.json           # Te Reo Māori

middleware.ts       # Locale detection & routing

app/
  layout.tsx        # Root passthrough
  page.tsx          # Redirects to /en
  [locale]/
    layout.tsx      # Locale-aware layout (html lang, dir, provider)
    page.tsx        # Home page
    demo/
    pricing/
    stack/
    terms/
    privacy/
    disclaimer/

components/
  LanguageSwitcher.tsx  # Dropdown language picker
  SiteNav.tsx           # Locale-aware navigation
  SiteFooter.tsx        # Locale-aware footer
  Terminal.tsx           # Locale-aware welcome greeting
```

## How It Works

1. **Middleware** (`middleware.ts`) intercepts requests and checks:
   - Cookie `NEXT_LOCALE` (set on language switch)
   - `Accept-Language` header from browser
   - Falls back to `en` (default)
2. If the URL lacks a locale prefix, middleware redirects to `/{detected-locale}/path`
3. **Layout** (`app/[locale]/layout.tsx`) loads the correct translation file via `getMessages(locale)` and wraps children in a `LocaleProvider`
4. **Components** call `useLocale()` to access `t()` (translate) and `locale`
5. **Formatting** uses `useFormatting()` hook for locale-aware numbers, dates, currency

## Adding a New Language

1. Create `messages/{code}.json` — copy `en.json` and translate all values
2. Add the locale code to `locales` array in `lib/i18n-config.ts`
3. Add display name to `localeNames`, flag to `localeFlags`, BCP47 to `localeBcp47`
4. If RTL, add to `rtlLocales` array
5. Add Terminal greetings in `components/Terminal.tsx` `LOCALE_GREETINGS`
6. Done — middleware and routing handle the rest automatically

## Translation Keys

Keys use dot notation: `"hero.title"`, `"nav.terminal"`, `"footer.copyright"`.

Parameters use `{name}` syntax:
```json
{ "footer.copyright": "© {year} Corey McIvor. All rights reserved." }
```

Usage in components:
```tsx
const { t } = useLocale();
t("footer.copyright", { year: "2026" });
```

## RTL Support

Arabic (`ar`) is configured as RTL. The layout sets `dir="rtl"` on `<html>`.
CSS rules in `globals.css` handle directional overrides for:
- Navigation
- Ticker animations
- Step connectors
- Data rain effects

## SEO

- `generateMetadata()` in `app/[locale]/layout.tsx` produces locale-specific titles and descriptions
- `alternates.languages` generates hreflang tags for all supported locales
- Canonical URLs include the locale prefix (except `en` which maps to root)
- JSON-LD structured data lists all supported languages

## Formatting

Use the `useFormatting()` hook for locale-aware rendering:

```tsx
import { useFormatting } from "@/lib/use-formatting";

function PriceDisplay({ value }: { value: number }) {
  const { formatCurrency } = useFormatting();
  return <span>{formatCurrency(value, "USD")}</span>;
}
```

Available formatters: `formatNumber`, `formatCurrency`, `formatDate`, `formatPercent`, `formatCompact`, `formatRelativeTime`.

## Cultural Context

- **NZ-first**: Default locale is `en` (mapped to `en-NZ` BCP47). Founder is NZ-based.
- **Te Reo Māori**: Included as a supported locale — reflects NZ heritage and Māori cultural awareness.
- **Global traders**: Platform serves crypto traders worldwide; CJK and RTL support is intentional.
- **Bots welcome**: Translation files are structured JSON — AI agents can parse and use them directly.
