# CoreIntent — Internationalization (i18n) Architecture

## Overview

CoreIntent uses path-based locale routing (`/en/`, `/es/`, `/mi/`, etc.) with the Next.js 15 App Router. All user-facing pages live under `app/[locale]/` and receive their language from the URL.

## Supported Locales

| Code | Language       | Direction | Status  |
|------|---------------|-----------|---------|
| `en` | English       | LTR       | Complete |
| `es` | Español       | LTR       | Complete |
| `mi` | Te Reo Māori  | LTR       | Complete |
| `ar` | العربية       | RTL       | Complete |
| `zh` | 中文           | LTR       | Stub    |
| `ja` | 日本語         | LTR       | Stub    |
| `pt` | Português     | LTR       | Stub    |
| `fr` | Français      | LTR       | Stub    |
| `de` | Deutsch       | LTR       | Stub    |
| `hi` | हिन्दी         | LTR       | Stub    |

Default locale: `en`. Stub locales fall back to English until translation files are added.

## File Structure

```
lib/
  i18n.ts            # Locale config, translation utils, formatting helpers
  i18n-context.tsx    # React context provider and useI18n/useTranslation hooks

messages/
  en.json            # English translations (complete)
  es.json            # Spanish translations (complete)
  mi.json            # Te Reo Māori translations (complete)
  ar.json            # Arabic translations (complete)

app/
  layout.tsx         # Thin root layout (passthrough)
  page.tsx           # Root redirect → /en
  [locale]/
    layout.tsx       # Locale-aware layout (loads messages, sets lang/dir, SEO)
    page.tsx         # Landing page with translation hooks
    demo/
    pricing/
    stack/
    privacy/
    terms/
    disclaimer/

components/
  LanguageSwitcher.tsx  # Dropdown language picker in the nav
  SiteNav.tsx           # Locale-aware navigation links
  SiteFooter.tsx        # Locale-aware footer
  Terminal.tsx          # Locale-aware welcome banner and time formatting

middleware.ts          # Locale detection from Accept-Language + cookie, redirect to /[locale]
```

## How Locale Routing Works

1. **Middleware** (`middleware.ts`) intercepts all non-API, non-static requests
2. If the URL already has a locale prefix (`/es/pricing`), it passes through
3. If not, it detects the preferred locale from:
   - `NEXT_LOCALE` cookie (set by language switcher)
   - `Accept-Language` header negotiation
   - Falls back to `en`
4. Redirects to the locale-prefixed path (`/pricing` → `/es/pricing`)

## How to Add a New Language

1. **Create the translation file**: Copy `messages/en.json` to `messages/{code}.json`
2. **Translate all keys** in the new file
3. **Register the locale** in `lib/i18n.ts`:
   - Add the code to `SUPPORTED_LOCALES`
   - Add the display name to `LOCALE_NAMES`
   - Add the HTML lang tag to `LOCALE_HTML_LANG`
   - If RTL, add to `RTL_LOCALES`
4. **Done** — the middleware, routing, sitemap, and language switcher all read from `SUPPORTED_LOCALES` automatically

No other code changes needed. The system auto-generates static params, sitemap entries, and hreflang tags for every locale in `SUPPORTED_LOCALES`.

## Translation Keys

Translations use dot-notation keys with optional parameter interpolation:

```typescript
const { t } = useTranslation();

t("hero.tagline")                           // → "Three AI Models. One Engine."
t("footer.copyright", { year: "2026" })     // → "© 2026 Corey McIvor. All rights reserved."
```

Keys that don't exist in the current locale's file fall back to the key string itself.

Array values (like `hero_phrases`) are accessed via `messages.hero_phrases` directly.

## Formatting Utilities

All formatting functions are locale-aware and available via the `useI18n()` hook:

```typescript
const { formatNumber, formatCurrency, formatDate, formatRelativeTime } = useI18n();

formatNumber(12847)              // "12,847" (en) / "12.847" (es)
formatCurrency(45, "USD")        // "$45" (en) / "US$45" (pt)
formatDate(new Date())           // "6 May 2026, 2:30 pm" (en) / "6 may 2026, 14:30" (es)
formatRelativeTime(pastDate)     // "2 hours ago" (en) / "hace 2 horas" (es)
```

## RTL Support

Arabic (and any future RTL locale) is handled by:

1. `dir="rtl"` attribute on `<html>` (set in `[locale]/layout.tsx`)
2. CSS rules in `globals.css` under `[dir="rtl"]` selectors
3. Terminal/code blocks remain LTR via `unicode-bidi: embed`
4. The language switcher shows RTL locale names in their native direction

## SEO

- Each locale gets its own `<link rel="canonical">` pointing to `/[locale]/`
- `hreflang` alternate links are generated for all supported locales in metadata
- The sitemap (`app/sitemap.ts`) generates entries for every locale × page combination with proper `alternates.languages`
- OpenGraph `locale` tag matches the current locale's HTML lang

## Cultural Notes

- **Māori (mi)**: Included as a first-class language. Founder is NZ-based with Māori heritage awareness. Translations use macrons (ā, ē, ī, ō, ū) where appropriate.
- **Arabic (ar)**: Full RTL support. Terminal and code remain LTR for readability.
- **NZ-first**: Default locale is `en-NZ`, not `en-US`. Date/time formatting defaults to NZ conventions.
