# CoreIntent — Internationalization (i18n) Architecture

## Overview

CoreIntent uses a lightweight, built-in i18n system with no external dependencies. Locale routing is handled via Next.js App Router dynamic segments (`app/[locale]/`), with middleware for automatic locale detection and redirection.

## Supported Locales

| Code | Language       | Direction | Status     |
|------|---------------|-----------|------------|
| `en` | English        | LTR       | Complete   |
| `es` | Español        | LTR       | Complete   |
| `mi` | Te Reo Māori   | LTR       | Complete   |
| `zh` | 中文 (Chinese)  | LTR       | Complete   |
| `ja` | 日本語 (Japanese) | LTR     | Complete   |
| `pt` | Português      | LTR       | Complete   |
| `fr` | Français       | LTR       | Complete   |
| `de` | Deutsch        | LTR       | Complete   |
| `ar` | العربية (Arabic) | RTL      | Complete   |
| `hi` | हिन्दी (Hindi)  | LTR       | Complete   |

Default locale: `en`

## Architecture

```
middleware.ts              # Detects locale from URL or Accept-Language header
lib/i18n.ts               # Locale config, translation loader, formatting utils
lib/locale-context.tsx     # React context providing locale + t() to client components
messages/                  # Translation JSON files (one per locale)
  en.json
  es.json
  mi.json
  zh.json
  ja.json
  pt.json
  fr.json
  de.json
  ar.json
  hi.json
app/[locale]/              # All pages scoped under locale segment
  layout.tsx               # Sets <html lang=... dir=...>, loads messages
  page.tsx                 # Landing page wrapper
  HomeContent.tsx           # Landing page client component
  demo/page.tsx
  pricing/page.tsx
  stack/page.tsx
  privacy/page.tsx
  terms/page.tsx
  disclaimer/page.tsx
components/
  LanguageSwitcher.tsx     # Dropdown language selector in nav
  LocaleLayoutClient.tsx   # Client wrapper for LocaleProvider
```

## How Routing Works

1. User visits `/` → middleware detects locale from `Accept-Language` header → redirects to `/{locale}`
2. User visits `/es` → renders Spanish version of the landing page
3. User visits `/ar/pricing` → renders Arabic pricing page with RTL layout
4. Language switcher changes the locale segment in the URL

## How to Add a New Language

### 1. Add the locale code

In `lib/i18n.ts`, add the locale to `LOCALES`:

```ts
export const LOCALES = ["en", "es", "mi", "zh", "ja", "pt", "fr", "de", "ar", "hi", "ko"] as const;
```

### 2. Add locale metadata

In the same file, add entries to:
- `LOCALE_NAMES` — display name in the language itself
- `getHtmlLang()` — BCP 47 tag mapping

If the language is RTL, add it to `RTL_LOCALES`.

### 3. Create the translation file

Copy `messages/en.json` to `messages/{locale}.json` and translate all values. Keep the same key structure.

### 4. Add terminal greeting

In `components/Terminal.tsx`, add an entry to `LOCALE_GREETINGS`.

### 5. Build and test

```bash
npm run build
```

Visit `/{locale}` to verify. The language switcher will automatically include the new locale.

## Translation Keys

Translations use dot-notation keys with optional `{param}` interpolation:

```ts
// In a client component:
const { t } = useLocale();
t("hero.heading1");                    // "Three AIs"
t("footer.copyright", { year: "2026" }); // "© 2026 Corey McIvor..."
```

## RTL Support

Arabic (`ar`) automatically gets `dir="rtl"` on `<html>`. CSS rules in `globals.css` handle:
- Text alignment reversal
- Ticker animation direction
- Floating CTA position
- Step connector mirroring

## Date/Number Formatting

Use the locale-aware utilities from `lib/i18n.ts`:

```ts
import { formatNumber, formatCurrency, formatDate, formatRelativeTime } from "@/lib/i18n";

formatNumber(1234.5, "de");        // "1.234,5"
formatCurrency(99, "ja", "JPY");   // "￥99"
formatDate(new Date(), "mi");      // locale-aware date string
formatRelativeTime(past, "es");    // "hace 3 horas"
```

## SEO

- Each locale gets its own canonical URL (`/en`, `/es`, `/ar/pricing`, etc.)
- `hreflang` alternates are set via `generateMetadata()` in the locale layout
- Sitemap (`app/sitemap.ts`) generates entries for every locale × page combination
- JSON-LD structured data declares `inLanguage` as an array of all supported locales
