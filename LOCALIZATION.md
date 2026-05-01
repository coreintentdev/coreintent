# CoreIntent — Internationalization (i18n) Architecture

## Overview

CoreIntent uses [next-intl](https://next-intl.dev) for internationalization with the Next.js 15 App Router. The default locale is English (en-NZ), with the locale prefix hidden from URLs for the default language (`localePrefix: "as-needed"`).

## Supported Locales

| Code | Language       | BCP-47 Tag | Direction |
|------|---------------|------------|-----------|
| en   | English       | en-NZ      | LTR       |
| es   | Espanol       | es         | LTR       |
| mi   | Te Reo Maori  | mi-NZ      | LTR       |
| zh   | Chinese       | zh-Hans    | LTR       |
| ja   | Japanese      | ja         | LTR       |
| pt   | Portuguese    | pt-BR      | LTR       |
| fr   | French        | fr         | LTR       |
| de   | German        | de         | LTR       |
| ar   | Arabic        | ar         | RTL       |
| hi   | Hindi         | hi         | LTR       |

## File Structure

```
coreintent/
  i18n/
    request.ts          # next-intl server config (loads messages per request)
    routing.ts          # Locale routing definition
    navigation.ts       # Locale-aware Link, useRouter, usePathname exports
  lib/
    i18n.ts             # Locale constants, validation, formatting utilities
  messages/
    en.json             # English translations (reference)
    es.json             # Spanish translations
    mi.json             # Te Reo Maori translations
  middleware.ts         # Locale detection + API CORS (combined)
  app/
    layout.tsx          # Minimal root layout (no <html> tag)
    [locale]/
      layout.tsx        # Per-locale layout (html lang, dir, NextIntlClientProvider)
      page.tsx          # Landing page with useTranslations hooks
      demo/             # Demo page
      pricing/          # Pricing page
      ...
```

## How It Works

### Routing

- `middleware.ts` intercepts all requests and detects the user's locale from:
  1. URL path prefix (`/es/pricing`)
  2. Cookie (set after language switch)
  3. `Accept-Language` header
- Default locale (en) does not require a URL prefix: `/` = English, `/es` = Spanish
- API routes (`/api/*`) bypass locale detection entirely

### Translation

- Server components: use `getTranslations()` from `next-intl/server`
- Client components: use `useTranslations()` from `next-intl`
- Navigation: import `{ Link, useRouter, usePathname }` from `@/i18n/navigation`

### Formatting

`lib/i18n.ts` exports locale-aware formatters:

```typescript
import { formatNumber, formatCurrency, formatDate, formatPercent } from "@/lib/i18n";

formatNumber(12847, "es");           // "12.847"
formatCurrency(45, "ja", "USD");     // "$45"
formatDate(new Date(), "mi");        // Maori-formatted date in Auckland timezone
formatPercent(87.5, "de");           // "87,5 %"
```

### RTL Support

Arabic (`ar`) automatically receives `dir="rtl"` on the `<html>` element. CSS rules in `globals.css` handle layout mirroring for RTL contexts. The ticker and data-rain animations remain LTR.

### SEO

- `generateMetadata()` in `app/[locale]/layout.tsx` produces per-locale `<title>`, `<meta description>`, and OpenGraph tags
- `hreflang` alternate links are generated for all supported locales
- Canonical URLs are locale-specific

## Adding a New Language

1. Add the locale code to `lib/i18n.ts`:
   ```typescript
   export const locales = ["en", "es", "mi", ..., "ko"] as const;
   ```

2. Add BCP-47 mapping in `LOCALE_TO_BCP47`:
   ```typescript
   ko: "ko",
   ```

3. Add display name in `LOCALE_NAMES`:
   ```typescript
   ko: "한국어",
   ```

4. If RTL, add to `RTL_LOCALES`.

5. Create `messages/ko.json` by copying `messages/en.json` and translating all values (keep keys identical).

6. Build and verify:
   ```bash
   npm run build
   ```

7. The language will automatically appear in the nav language switcher.

## Adding New Translation Keys

1. Add the key to `messages/en.json` (the reference file).
2. Add the same key to all other `messages/*.json` files.
3. Use in components:
   ```tsx
   const t = useTranslations("namespace");
   return <p>{t("key")}</p>;
   ```

## Terminal Localization

The terminal greeting is locale-aware. Greetings are defined in `components/Terminal.tsx` in the `LOCALE_GREETINGS` map. Date/time in the terminal banner uses `Intl.DateTimeFormat` with the user's BCP-47 locale tag.

## Translation Coverage

| Page      | en  | es  | mi  |
|-----------|-----|-----|-----|
| Landing   | 100%| 100%| 100%|
| Nav       | 100%| 100%| 100%|
| Footer    | 100%| 100%| 100%|
| Terminal  | Greeting | Greeting | Greeting |
| Other     | Pending | Pending | Pending |

Other pages (demo, stack, pricing, privacy, terms, disclaimer) currently render in English. Translation keys for these pages can be added incrementally.
