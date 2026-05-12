# CoreIntent — Internationalization (i18n) Architecture

## Overview

CoreIntent supports 10 languages with locale-based routing, RTL support, and locale-aware formatting.

| Code | Language | Region | Direction |
|------|----------|--------|-----------|
| `en` | English | en-NZ | LTR |
| `es` | Español | es-419 | LTR |
| `mi` | Te Reo Māori | mi-NZ | LTR |
| `zh` | 中文 | zh-CN | LTR |
| `ja` | 日本語 | ja-JP | LTR |
| `pt` | Português | pt-BR | LTR |
| `fr` | Français | fr-FR | LTR |
| `de` | Deutsch | de-DE | LTR |
| `ar` | العربية | ar-SA | RTL |
| `hi` | हिन्दी | hi-IN | LTR |

## URL Structure

All pages live under `app/[locale]/`:

```
/en           → English landing page
/es           → Spanish landing page
/mi/demo      → Te Reo Māori demo page
/ar/pricing   → Arabic pricing page (RTL)
```

Visiting `/` redirects to `/{detected_locale}` based on:
1. `NEXT_LOCALE` cookie (if set)
2. `Accept-Language` header negotiation
3. Falls back to `en`

## File Structure

```
lib/
  i18n-config.ts      # Locale definitions, RTL list, region map
  i18n.ts             # Translation loader, formatter utilities

messages/
  en.json             # English (complete, reference file)
  es.json             # Spanish (complete)
  mi.json             # Te Reo Māori (complete)
  zh.json             # Chinese Simplified (complete)
  ja.json             # Japanese (key strings)
  pt.json             # Portuguese (key strings)
  fr.json             # French (key strings)
  de.json             # German (key strings)
  ar.json             # Arabic (key strings, RTL)
  hi.json             # Hindi (key strings)

components/
  I18nProvider.tsx     # React context providing t(), formatNumber(), formatDate()
  LanguageSwitcher.tsx # Dropdown language selector in nav

app/
  [locale]/
    layout.tsx         # Locale layout with I18nProvider wrapper
    page.tsx           # Landing page with translated strings
    demo/page.tsx      # Demo page
    pricing/page.tsx   # Pricing page
    ...

middleware.ts          # Locale detection, cookie persistence, redirect
```

## How to Add a New Language

1. **Add the locale code** to `lib/i18n-config.ts`:
   - Add to `locales` array
   - Add display name to `localeNames`
   - Add region tag to `localeRegionMap`
   - If RTL, add to `rtlLocales`

2. **Create the message file** at `messages/{code}.json`:
   - Copy `messages/en.json` as a starting point
   - Translate all string values
   - Keep JSON keys unchanged

3. **Update middleware** (if the locale list is hardcoded there):
   - Add the code to `LOCALES` array in `middleware.ts`

4. **Test**: Visit `/{code}` and verify translations render correctly.

## Translation Keys

Message files use a flat-ish nested JSON structure:

```json
{
  "nav": {
    "terminal": "Terminal",
    "demo": "Demo"
  },
  "hero": {
    "title1": "Three AIs",
    "ctaPrimary": "Enter the Arena"
  }
}
```

Access in components:

```tsx
import { useI18n } from "@/components/I18nProvider";

function MyComponent() {
  const { t, locale, formatNumber, formatDate } = useI18n();

  return (
    <div>
      <h1>{t("hero.title1")}</h1>
      <p>{t("footer.copyright", { year: 2026 })}</p>
      <span>{formatNumber(67420)}</span>
      <span>{formatDate(new Date())}</span>
    </div>
  );
}
```

### Parameter interpolation

Use `{paramName}` in message values:

```json
{
  "footer": {
    "copyright": "© {year} Corey McIvor. All rights reserved."
  }
}
```

```tsx
t("footer.copyright", { year: 2026 })
// → "© 2026 Corey McIvor. All rights reserved."
```

## RTL Support

Arabic (and any future RTL language) is handled via:
- `dir="rtl"` attribute set on the locale layout wrapper
- CSS rules in `globals.css` under `[dir="rtl"]` selectors
- Flexbox `row-reverse` for nav and header layouts
- Mirrored connectors and positioned elements

## Locale-Aware Formatting

All number and date formatting uses `Intl.NumberFormat` and `Intl.DateTimeFormat` with the user's locale region:

```tsx
const { formatNumber, formatDate, formatCurrency } = useI18n();

formatNumber(67420)        // "67,420" (en) / "67.420" (de) / "٦٧٬٤٢٠" (ar)
formatDate(new Date())     // locale-appropriate date
formatCurrency(99, "USD")  // "$99" (en) / "99 $US" (fr) / "٩٩ US$" (ar)
```

## SEO

- Each locale page gets its own `canonical` URL
- `hreflang` alternate links are generated for all locales in `[locale]/layout.tsx`
- OpenGraph `locale` tag matches the region
- Schema.org `inLanguage` lists all supported languages

## No External Dependencies

The i18n system is built with zero npm packages — just Next.js App Router, React context, and the `Intl` API.
