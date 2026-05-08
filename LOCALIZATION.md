# Internationalization (i18n) Architecture

CoreIntent supports 10 languages with full RTL support and locale-aware formatting.

## Supported Locales

| Code | Language | Status | RTL |
|------|----------|--------|-----|
| `en` | English | Full | No |
| `es` | Español | Full | No |
| `mi` | Te Reo Maori | Full | No |
| `zh` | Chinese | Nav + Hero | No |
| `ja` | Japanese | Nav + Hero | No |
| `pt` | Portuguese | Nav + Hero | No |
| `fr` | French | Nav + Hero | No |
| `de` | German | Nav + Hero | No |
| `ar` | Arabic | Nav + Hero | Yes |
| `hi` | Hindi | Nav + Hero | No |

## Architecture

### URL Pattern
Routes use `app/[locale]/` dynamic segments:
- `/en` — English home
- `/es/pricing` — Spanish pricing
- `/ar/demo` — Arabic demo (RTL)

### Middleware (`middleware.ts`)
- Detects locale from: URL path > `locale` cookie > `Accept-Language` header > default (`en`)
- Redirects bare paths (`/pricing` -> `/en/pricing`)
- Sets `x-locale` header for the root layout
- Skips API routes, static files, and metadata routes

### Translation Files (`messages/*.json`)
- Nested JSON structure with dot-notation access
- English (`en.json`) is the base — all keys must exist here
- Other locales only need translated keys; missing keys fall back to English via `deepMerge`

### i18n Library (`lib/i18n.ts`)
- `getMessages(locale)` — loads and merges translations (server-side)
- `createTranslator(messages)` — returns a `t(key, params?)` function
- `formatNumber(value, locale, options?)` — locale-aware number formatting
- `formatDate(date, locale, options?)` — locale-aware date formatting
- `formatCurrency(value, locale, currency?)` — locale-aware currency formatting
- `formatPercent(value, locale)` — locale-aware percentage formatting
- `detectLocale(acceptLanguage)` — parses Accept-Language header

### Client Context (`lib/i18n-client.tsx`)
- `I18nProvider` — React context wrapping `app/[locale]/layout.tsx`
- `useTranslations()` — returns `{ locale, messages, t }` in client components
- `useLocale()` — returns current locale

### RTL Support
- Arabic (`ar`) triggers `dir="rtl"` on the `<html>` element
- Set automatically by root layout reading the `x-locale` header
- CSS should use logical properties (`margin-inline-start` vs `margin-left`)

### SEO
- `generateMetadata` in `app/[locale]/layout.tsx` sets per-locale metadata
- `alternates.languages` generates `hreflang` tags for all locales
- `sitemap.ts` generates entries for every locale + page combination with `alternates`
- JSON-LD `inLanguage` lists all supported languages

## Adding a New Language

1. **Create translation file**: `messages/{code}.json`
   - Copy structure from `en.json`
   - Translate keys (missing keys fall back to English)

2. **Register the locale** in `lib/i18n.ts`:
   - Add to `locales` array
   - Add to `localeNames`
   - Add to `intlLocaleMap`
   - Add to `messageLoaders`
   - If RTL, add to `rtlLocales`

3. **Verify**: Run `npm run build` — the locale will be auto-included in:
   - Middleware routing
   - Language switcher
   - Sitemap
   - SEO hreflang tags

## Translation Key Format

```json
{
  "namespace": {
    "key": "Value with {param} interpolation"
  }
}
```

Usage in components:
```tsx
const { t } = useTranslations();
t("namespace.key", { param: "value" });
```

## Locale-Aware Formatting

```tsx
import { formatNumber, formatDate, formatCurrency } from "@/lib/i18n";

formatNumber(12847, "de");        // "12.847"
formatDate(new Date(), "ja");     // "2026/05/08"
formatCurrency(45, "en", "NZD");  // "NZ$45.00"
```
