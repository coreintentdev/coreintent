# CoreIntent i18n Architecture

## Supported Locales

| Code | Language | Direction | Status |
|------|----------|-----------|--------|
| `en` | English | LTR | Complete |
| `es` | Español | LTR | Complete |
| `mi` | Te Reo Māori | LTR | Complete |
| `zh` | 中文 (Chinese) | LTR | Complete |
| `ja` | 日本語 (Japanese) | LTR | Complete |
| `pt` | Português | LTR | Complete |
| `fr` | Français | LTR | Complete |
| `de` | Deutsch | LTR | Complete |
| `ar` | العربية (Arabic) | RTL | Complete |
| `hi` | हिन्दी (Hindi) | LTR | Complete |

Default locale: `en`

## How It Works

### Routing

URL pattern: `/{locale}/page` (e.g., `/es/pricing`, `/mi/stack`)

- Middleware (`middleware.ts`) detects the browser's `Accept-Language` header
- Requests to `/` redirect to `/{detected-locale}`
- All pages live under `app/[locale]/`
- API routes (`/api/*`) are not locale-prefixed

### Translation Files

Location: `messages/{locale}.json`

Structure is nested JSON with dot-notation access:
```json
{
  "hero": {
    "tagline": "The agentic AI trading engine...",
    "description": "Grok spots the signal..."
  },
  "nav": {
    "terminal": "Terminal",
    "pricing": "Pricing"
  }
}
```

### Using Translations in Components

**Client components** use the React context hook:
```tsx
import { useTranslation } from "@/lib/i18n-context";

function MyComponent() {
  const { t, locale, dir } = useTranslation();
  return <h1>{t("hero.tagline")}</h1>;
}
```

**Server components** use the dictionary loader:
```tsx
import { getDictionary, t } from "@/lib/i18n";

export default async function Page({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return <h1>{t(dict, "hero.tagline")}</h1>;
}
```

### Locale-Aware Formatting

```tsx
import { formatDate, formatNumber, formatCurrency, formatPercent } from "@/lib/i18n";

formatDate(new Date(), "ja");        // "2026年4月22日"
formatNumber(67420, "de");           // "67.420"
formatCurrency(142.80, "pt", "USD"); // "US$ 142,80"
formatPercent(2.45, "fr");           // "2,45 %"
```

### RTL Support

Arabic (`ar`) automatically gets `dir="rtl"` on the `<html>` element. CSS rules in `globals.css` handle RTL-specific layout adjustments. The `dir` property is available via `useTranslation()`.

### SEO

- `<html lang={locale}>` set dynamically per request
- `<link rel="alternate" hrefLang="...">` tags for all locales in root layout
- `hreflang="x-default"` points to `/en`
- Sitemap includes all locale variants with `alternates`

## Adding a New Language

1. Add the locale code to `lib/i18n-config.ts`:
   - Add to `locales` array
   - Add display name to `localeNames`
   - If RTL, add to `rtlLocales`

2. Create `messages/{code}.json` — copy `messages/en.json` and translate

3. Add the dictionary loader in `lib/i18n.ts`:
   ```ts
   {code}: () => import("@/messages/{code}.json").then((m) => m.default),
   ```

4. Add locale-to-date mapping in `lib/i18n.ts` (`localeToDateLocale`)

5. Optionally add timezone mapping in `components/Terminal.tsx` (`localeTimezoneMap`)

6. Build and verify: `npm run build`

## File Map

```
lib/
  i18n-config.ts    — Locale list, RTL config, validation
  i18n.ts           — Dictionary loader, formatting utilities
  i18n-context.tsx   — React context provider + useTranslation hook
messages/
  en.json           — English (complete)
  es.json           — Spanish (complete)
  mi.json           — Te Reo Māori (complete)
  zh.json           — Chinese (complete)
  ja.json           — Japanese (complete)
  pt.json           — Portuguese (complete)
  fr.json           — French (complete)
  de.json           — German (complete)
  ar.json           — Arabic (complete, RTL)
  hi.json           — Hindi (complete)
middleware.ts       — Locale detection + redirect
app/
  layout.tsx        — Root layout with hreflang tags
  [locale]/
    layout.tsx      — I18nProvider wrapper
    page.tsx        — Localized landing page
components/
  LanguageSwitcher.tsx — Dropdown language picker
  SiteNav.tsx       — Nav with locale-aware links
  SiteFooter.tsx    — Footer with translated labels
  Terminal.tsx      — Locale-aware greeting
```
