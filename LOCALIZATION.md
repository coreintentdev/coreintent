# CoreIntent i18n Architecture

## Supported Locales

| Code | Language       | Direction | Status       |
|------|----------------|-----------|--------------|
| en   | English        | LTR       | Complete     |
| es   | Español        | LTR       | Complete     |
| mi   | Te Reo Māori   | LTR       | Complete     |
| zh   | 中文 (Chinese)  | LTR       | Complete     |
| ja   | 日本語 (Japanese)| LTR      | Complete     |
| pt   | Português      | LTR       | Complete     |
| fr   | Français       | LTR       | Complete     |
| de   | Deutsch        | LTR       | Complete     |
| ar   | العربية (Arabic)| RTL       | Complete     |
| hi   | हिन्दी (Hindi)  | LTR       | Complete     |

## How It Works

### URL Structure

All pages use the `[locale]` dynamic segment:

```
/en           → English landing page
/es/pricing   → Spanish pricing page
/ar/demo      → Arabic demo page (RTL)
```

Visiting `/` redirects to `/{detected-locale}/` based on the browser's `Accept-Language` header. A `locale` cookie persists the choice.

### File Structure

```
lib/
  i18n.ts              ← Locale config, detection, formatting utilities
  i18n-context.tsx      ← React context + useTranslations hook
messages/
  en.json              ← English translations (source of truth)
  es.json              ← Spanish
  mi.json              ← Te Reo Māori
  zh.json              ← Chinese (Simplified)
  ja.json              ← Japanese
  pt.json              ← Portuguese
  fr.json              ← French
  de.json              ← German
  ar.json              ← Arabic
  hi.json              ← Hindi
middleware.ts           ← Locale detection + redirect
app/
  layout.tsx            ← Root layout (reads locale from x-locale header)
  [locale]/
    layout.tsx          ← Provides I18nProvider context
    page.tsx            ← Landing page
    pricing/page.tsx    ← Pricing page
    ...
components/
  LanguageSwitcher.tsx  ← Language picker dropdown
  SiteNav.tsx           ← Locale-aware navigation
  SiteFooter.tsx        ← Translated footer
  Terminal.tsx          ← Locale-aware greeting
```

### Translation Keys

Translations are organized by section in each JSON file:

```json
{
  "nav": { "terminal": "Terminal", "demo": "Demo", ... },
  "hero": { "badge": "...", "subtitle": "...", ... },
  "howItWorks": { "title": "...", "step1Title": "...", ... },
  "terminal": { "greeting": "...", "paperMode": "...", ... },
  "footer": { "tagline": "...", "builtBy": "...", ... },
  "meta": { "title": "...", "description": "..." },
  "common": { "loading": "...", "error": "...", ... }
}
```

### Using Translations in Components

```tsx
"use client";
import { useTranslations } from "@/lib/i18n-context";

function MyComponent() {
  const { t, locale, localePath, formatNumber, formatDate, formatCurrency } = useTranslations();

  return (
    <div>
      <h1>{t("hero", "headline1")}</h1>
      <p>{formatCurrency(45, "NZD")}</p>
      <a href={localePath("/pricing")}>Pricing</a>
    </div>
  );
}
```

### RTL Support

Arabic (`ar`) is the RTL locale. The root layout sets `dir="rtl"` on `<html>` when Arabic is active. RTL-specific CSS rules are in `globals.css` under `[dir="rtl"]`. The terminal maintains `direction: ltr` since code/commands are always left-to-right.

### SEO

- `<html lang>` is set dynamically per locale
- `hreflang` alternates are generated in the root layout metadata
- Sitemap includes all locale variants with `alternates.languages`
- Structured data (JSON-LD) declares `inLanguage` for all supported locales

## Adding a New Language

1. Create `messages/{code}.json` — copy `en.json` and translate all values
2. Add the locale code to the `locales` array in `lib/i18n.ts`
3. Add the display name to `localeNames` in `lib/i18n.ts`
4. If RTL, add to `rtlLocales` set in `lib/i18n.ts`
5. Build and test: `npm run build`

## Locale-Aware Formatting

Use the formatting utilities from `useTranslations()`:

- `formatNumber(1234.5)` → locale-appropriate number (e.g., "1,234.5" or "1.234,5")
- `formatDate(new Date())` → locale-appropriate date string
- `formatCurrency(99, "USD")` → locale-appropriate currency (e.g., "$99.00" or "99,00 $")

These wrap `Intl.NumberFormat` and `Intl.DateTimeFormat` with the current locale.

## Cultural Notes

- **Te Reo Māori (mi)**: Included as a first-class language reflecting the founder's NZ heritage and commitment to Aotearoa
- **Arabic (ar)**: Full RTL support with appropriate CSS overrides
- **Terminal**: Commands remain in English (technical standard), but greeting and UI text are translated
- All 10 languages have complete translation coverage for nav, hero, footer, terminal greeting, and metadata
