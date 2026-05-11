# CoreIntent — Internationalization (i18n) Architecture

## Overview

CoreIntent supports 10 languages via Next.js App Router locale routing. The system uses a `[locale]` dynamic segment, middleware-based locale detection, and JSON translation files.

## Supported Locales

| Code | Language | Native Name | Direction | Flag |
|------|----------|-------------|-----------|------|
| `en` | English | English | LTR | NZ |
| `es` | Spanish | Español | LTR | ES |
| `mi` | Maori | Te Reo Maori | LTR | NZ |
| `zh` | Chinese | 中文 | LTR | CN |
| `ja` | Japanese | 日本語 | LTR | JP |
| `pt` | Portuguese | Português | LTR | BR |
| `fr` | French | Français | LTR | FR |
| `de` | German | Deutsch | LTR | DE |
| `ar` | Arabic | العربية | RTL | SA |
| `hi` | Hindi | हिन्दी | LTR | IN |

Default locale: `en` (English, NZ context)

## Architecture

```
lib/
  i18n.ts            # Core config, types, formatting utilities
  i18n-context.tsx    # React context provider + useTranslation hook

messages/
  en.json            # English translations
  es.json            # Spanish
  mi.json            # Te Reo Maori
  zh.json            # Chinese (Simplified)
  ja.json            # Japanese
  pt.json            # Portuguese (Brazilian)
  fr.json            # French
  de.json            # German
  ar.json            # Arabic
  hi.json            # Hindi

app/
  layout.tsx         # Root layout (dynamic lang/dir from middleware header)
  [locale]/
    layout.tsx       # Locale layout (loads messages, provides I18nProvider)
    page.tsx         # Landing page
    pricing/         # ...and other pages
    stack/
    demo/
    privacy/
    terms/
    disclaimer/

middleware.ts        # Locale detection, routing, and redirect logic

components/
  LanguageSwitcher.tsx   # Dropdown language selector in nav
  HreflangTags.tsx       # SEO alternate-language link tags
  SiteNav.tsx            # Nav with translated labels + language switcher
  SiteFooter.tsx         # Footer with translated labels
  Terminal.tsx           # Locale-aware welcome banner
```

## How It Works

### 1. Routing

All pages live under `app/[locale]/`. The middleware detects the user's locale and redirects bare URLs (e.g. `/pricing`) to the localized version (e.g. `/en/pricing`).

Detection priority:
1. URL path prefix (`/es/pricing` -> `es`)
2. `NEXT_LOCALE` cookie (set on first visit)
3. `Accept-Language` header from browser
4. Falls back to `en`

### 2. Translation Loading

The `app/[locale]/layout.tsx` loads the JSON translation file for the current locale and wraps children in `<I18nProvider>`. Client components access translations via `useTranslation()`.

### 3. Using Translations in Components

```tsx
import { useTranslation } from "@/lib/i18n-context";

function MyComponent() {
  const { t, locale, formatNumber, formatDate, formatCurrency } = useTranslation();
  
  return (
    <div>
      <h1>{t("hero.title_line1")}</h1>
      <p>{t("hero.disclaimer")}</p>
      <p>{formatCurrency(99, "USD")}</p>
      <p>{formatDate(new Date(), { dateStyle: "long" })}</p>
    </div>
  );
}
```

### 4. Variable Interpolation

Translation strings support `{variable}` placeholders:

```json
{
  "footer.copyright": "© {year} Corey McIvor. All rights reserved."
}
```

```tsx
t("footer.copyright", { year: 2026 })
```

### 5. RTL Support

Arabic (`ar`) is automatically detected as RTL. The root layout sets `dir="rtl"` on `<html>`, and `globals.css` contains RTL-specific overrides that flip layouts, navigation direction, and step connectors. Terminal content stays LTR (code is always left-to-right).

### 6. SEO

- `<html lang="...">` is set dynamically per locale
- `<link rel="alternate" hreflang="...">` tags are rendered for all locales on every page
- `x-default` hreflang points to the English version
- Each locale route has its own canonical URL
- JSON-LD structured data includes `inLanguage` and `availableLanguage`

### 7. Date/Number Formatting

All formatting functions are locale-aware via `Intl` APIs:

- `formatNumber(value, options?)` — locale-specific number formatting
- `formatCurrency(value, currency?)` — locale-specific currency display
- `formatDate(date, options?)` — locale-specific date formatting
- `formatRelativeTime(date)` — "2 hours ago", "in 3 days", etc.

## Adding a New Language

1. **Add the locale code** to `LOCALES` in `lib/i18n.ts`
2. **Add metadata** to `LOCALE_META` in `lib/i18n.ts` (name, nativeName, flag)
3. **Create the translation file**: Copy `messages/en.json` to `messages/{code}.json` and translate all values
4. **If RTL**: Add the code to `RTL_LOCALES` in `lib/i18n.ts`
5. **Build and verify**: `npm run build` — the new locale routes are auto-generated via `generateStaticParams`

No other code changes needed. The middleware, routing, language switcher, and SEO tags all derive from the `LOCALES` array automatically.

## Translation Key Structure

```
meta.*           — Page metadata (title, description)
nav.*            — Navigation labels
hero.*           — Landing page hero section
howItWorks.*     — "How it works" section
valueProps.*     — Value proposition cards
miniTerminal.*   — Mini terminal preview section
footer.*         — Footer content
terminal.*       — Terminal welcome banner
common.*         — Shared/reusable strings
```

## Cultural Notes

- **Te Reo Maori (`mi`)**: Included as a first-class language reflecting the founder's NZ heritage. Translations prioritize natural expression over literal translation.
- **Arabic (`ar`)**: Full RTL layout support. Terminal/code sections remain LTR.
- **Chinese (`zh`)**: Simplified Chinese (zh-CN) is the default variant.
- **Portuguese (`pt`)**: Brazilian Portuguese as the primary variant (largest Portuguese-speaking market for crypto).
