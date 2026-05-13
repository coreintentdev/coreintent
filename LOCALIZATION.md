# CoreIntent — Internationalization (i18n) Architecture

## Supported Locales

| Code | Language | Direction | Status |
|------|----------|-----------|--------|
| en | English | LTR | Complete |
| es | Spanish | LTR | Complete |
| mi | Te Reo Maori | LTR | Complete |
| zh | Chinese | LTR | Pending |
| ja | Japanese | LTR | Pending |
| pt | Portuguese | LTR | Pending |
| fr | French | LTR | Pending |
| de | German | LTR | Pending |
| ar | Arabic | RTL | Pending |
| hi | Hindi | LTR | Pending |

## Architecture

### Routing

URLs follow the pattern `/{locale}/path`:
- `/` — default English landing page
- `/es` — Spanish landing page
- `/mi/pricing` — Maori pricing page
- `/ar` — Arabic (RTL) landing page

The `app/[locale]/` directory mirrors the main `app/` routes. Each locale page wrapper reads the locale from the URL and sets it in the React context.

### Translation Files

Translation files live in `messages/{locale}.json` as flat key-value JSON:

```json
{
  "hero.badge": "Paper Trading Mode — Founding Spots Open",
  "hero.cta_primary": "Enter the Arena",
  "nav.terminal": "Terminal"
}
```

### Key Files

| File | Purpose |
|------|---------|
| `lib/i18n.ts` | Locale constants, translation loader, formatting utilities |
| `lib/locale-context.tsx` | React context provider for client components |
| `messages/*.json` | Translation strings per locale |
| `middleware.ts` | Locale detection from Accept-Language / cookies |
| `app/[locale]/` | Locale-specific route wrappers |
| `components/LanguageSwitcher.tsx` | Dropdown language selector in nav |

### Translation Function

```tsx
import { useTranslation } from "@/lib/locale-context";

function MyComponent() {
  const { t, locale } = useTranslation();
  return <h1>{t("hero.title")}</h1>;
}
```

Supports parameter interpolation:

```tsx
t("footer.copyright", { year: 2026 })
// "© 2026 Corey McIvor. All rights reserved."
```

### Locale-Aware Formatting

```tsx
import { formatNumber, formatCurrency, formatDate } from "@/lib/i18n";

formatNumber(12847, "de");     // "12.847"
formatCurrency(45, "ja");      // "￥45"
formatDate(new Date(), "es");  // "13 may 2026, 10:30"
```

### RTL Support

Arabic (`ar`) automatically gets `dir="rtl"` on the locale layout wrapper. CSS rules in `globals.css` under `[dir="rtl"]` handle layout mirroring.

### SEO

- `<html lang>` attribute set per locale
- hreflang alternate links generated in layout metadata
- x-default points to `/en`
- Sitemap includes all locale variants
- JSON-LD `inLanguage` lists all supported languages

## Adding a New Language

1. Create `messages/{code}.json` — copy `messages/en.json` and translate all values
2. Add the locale code to `SUPPORTED_LOCALES` in `lib/i18n.ts`
3. Add the display name to `LOCALE_NAMES` in `lib/i18n.ts`
4. If RTL, add to `RTL_LOCALES` in `lib/i18n.ts`
5. The `[locale]` routes, middleware, sitemap, and language switcher auto-detect new locales

## Terminal Greeting

The terminal component (`components/Terminal.tsx`) greets users in their detected language via the `LOCALE_GREETINGS` map. Add new greetings there when adding a language.

## Detection Priority

1. URL path segment (`/es/...`)
2. `coreintent-locale` cookie (set when user picks a language)
3. `Accept-Language` header (browser default)
4. Falls back to `en`
