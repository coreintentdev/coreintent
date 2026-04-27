# CoreIntent i18n Architecture

## Supported Locales

| Code | Language       | Direction | Status     |
|------|---------------|-----------|------------|
| en   | English       | LTR       | Complete   |
| es   | Spanish       | LTR       | Complete   |
| mi   | Te Reo Maori  | LTR       | Complete   |
| zh   | Chinese       | LTR       | Planned    |
| ja   | Japanese      | LTR       | Planned    |
| pt   | Portuguese    | LTR       | Planned    |
| fr   | French        | LTR       | Planned    |
| de   | German        | LTR       | Planned    |
| ar   | Arabic        | RTL       | Planned    |
| hi   | Hindi         | LTR       | Planned    |

## How It Works

### Routing

- Default locale (`en`) serves at root: `/`, `/pricing`, `/stack`
- Other locales use prefix: `/es`, `/es/pricing`, `/mi/stack`
- Middleware detects locale from URL, cookie, or `Accept-Language` header
- All pages live under `app/[locale]/`

### Translation Files

Translation JSON files live in `messages/`:

```
messages/
  en.json   — English (source of truth)
  es.json   — Spanish
  mi.json   — Te Reo Maori
```

Keys use dot-notation (`hero.headline`, `footer.tagline`). Params use `{name}` syntax:

```json
{
  "footer": {
    "copyright": "© {year} Corey McIvor. All rights reserved."
  }
}
```

### Core Files

| File                       | Purpose                                     |
|---------------------------|---------------------------------------------|
| `lib/i18n.ts`             | Locale config, translation utilities, formatters |
| `lib/locale-context.tsx`  | React context providing `useLocale()` hook  |
| `middleware.ts`           | Locale detection, URL rewriting, cookie     |
| `app/[locale]/layout.tsx` | Loads messages, wraps children in provider  |
| `messages/*.json`         | Translation strings                         |
| `components/LanguageSwitcher.tsx` | Dropdown language selector           |

### Using Translations in Components

```tsx
import { useLocale } from "@/lib/locale-context";

function MyComponent() {
  const { locale, t } = useLocale();
  return <h1>{t("hero.headline")}</h1>;
}
```

### Date and Number Formatting

```tsx
import { formatDate, formatNumber, formatCurrency } from "@/lib/i18n";

formatDate(new Date(), "es");              // locale-aware date
formatNumber(1234.56, "de");               // 1.234,56
formatCurrency(99, "ja", "JPY");           // ¥99
```

### RTL Support

Arabic (`ar`) is the RTL locale. The middleware sets `dir="rtl"` on `<html>` via the `x-locale-dir` header. CSS rules in `globals.css` handle layout mirroring.

## Adding a New Language

1. Create `messages/{code}.json` — copy `en.json` and translate all values
2. Add the locale code to `locales` array in `lib/i18n.ts`
3. Add entries to `localeNames`, `localeFlags`, and `localeToDateOptions` in `lib/i18n.ts`
4. Add a terminal greeting in `getTerminalGreeting()` in `lib/i18n.ts`
5. Add terminal strings to `TERMINAL_GREETINGS` in `components/Terminal.tsx`
6. If RTL, add to `rtlLocales` array in `lib/i18n.ts` and `RTL_LOCALES` in `middleware.ts`
7. Build and verify: `npm run build`

## SEO

- Root layout sets `alternates.languages` for hreflang tags across all locales
- `<html lang>` attribute is set dynamically per request via middleware headers
- JSON-LD `inLanguage` lists all supported languages
- Each locale URL is independently indexable
