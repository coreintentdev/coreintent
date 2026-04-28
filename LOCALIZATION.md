# CoreIntent — Internationalization (i18n)

## Supported Locales

| Code | Language       | Direction | Status      |
|------|---------------|-----------|-------------|
| en   | English (NZ)  | LTR       | Complete    |
| es   | Spanish       | LTR       | Complete    |
| mi   | Te Reo Maori  | LTR       | Complete    |
| zh   | Chinese       | LTR       | Stub        |
| ja   | Japanese      | LTR       | Stub        |
| pt   | Portuguese    | LTR       | Stub        |
| fr   | French        | LTR       | Stub        |
| de   | German        | LTR       | Stub        |
| ar   | Arabic        | RTL       | Stub        |
| hi   | Hindi         | LTR       | Stub        |

Default locale: `en` (English, NZ)

## Architecture

### URL Structure

All pages live under `app/[locale]/`. The middleware detects the user's preferred locale and redirects:

```
/            → /en           (redirect)
/en          → Landing page (English)
/es          → Landing page (Spanish)
/mi          → Landing page (Te Reo Maori)
/es/pricing  → Pricing page (Spanish)
```

### Key Files

```
lib/i18n.ts           — Locale config, formatting utilities, translation loader
lib/i18n-context.tsx   — React context + hooks (useI18n, useTranslation, useLocale, useLocaleFormat)
messages/en.json       — English translations
messages/es.json       — Spanish translations
messages/mi.json       — Te Reo Maori translations
middleware.ts          — Locale detection (Accept-Language, cookie, URL prefix)
app/[locale]/layout.tsx — Locale-aware layout with hreflang SEO tags
components/LanguageSwitcher.tsx — Dropdown language selector
```

### How Locale Detection Works

1. Check URL path for locale prefix (`/es/pricing`)
2. Check `NEXT_LOCALE` cookie (set by language switcher)
3. Parse `Accept-Language` header from browser
4. Fall back to `en`

### Translation System

Translations are JSON key-value files in `messages/`. Keys use dot notation:

```json
{
  "hero.tagline": "The agentic AI trading engine...",
  "nav.terminal": "Terminal",
  "footer.rights": "All rights reserved."
}
```

### Using Translations in Components

**Client components** (most of the app):

```tsx
import { useI18n } from "@/lib/i18n-context";

function MyComponent() {
  const { t, locale, formatNumber, formatCurrency, formatDate } = useI18n();
  
  return (
    <div>
      <h1>{t("hero.tagline")}</h1>
      <p>{t("hero.description", { count: 3 })}</p>
      <span>{formatCurrency(45, "NZD")}</span>
      <time>{formatDate(new Date())}</time>
    </div>
  );
}
```

**Server components** (layout, metadata):

```tsx
import { getMessages, createTranslator } from "@/lib/i18n";

const messages = await getMessages(locale);
const t = createTranslator(messages);
```

### Number and Date Formatting

All formatting uses `Intl` APIs with the correct BCP 47 tag for each locale:

```tsx
const { formatNumber, formatCurrency, formatDate } = useI18n();

formatNumber(67420);         // "67,420" (en) / "67.420" (es)
formatCurrency(45, "NZD");   // "NZ$45" (en) / "45 NZ$" (fr)
formatDate(new Date());      // "28 April 2026" (en) / "28 de abril de 2026" (es)
```

Or use the standalone utilities:

```tsx
import { formatNumber, formatCurrency, formatDate, formatRelativeTime } from "@/lib/i18n";
```

### RTL Support

Arabic (`ar`) is automatically detected as RTL. The `[locale]/layout.tsx` sets `dir="rtl"` on the wrapper. CSS rules in `globals.css` handle layout mirroring.

## Adding a New Language

1. Create `messages/<code>.json` — copy `en.json` and translate all values
2. Add the locale code to `locales` array in `lib/i18n.ts`
3. Add entries to `localeNames`, `localeFlags`, `localeBcp47` in `lib/i18n.ts`
4. If RTL, add to `rtlLocales` array
5. Add a greeting to `LOCALE_GREETINGS` in `components/Terminal.tsx`
6. Test: visit `/<code>` in browser

No code changes needed beyond step 2-5 — the middleware, routing, and sitemap handle new locales automatically.

## Adding Translatable Strings

1. Add the key and English value to `messages/en.json`
2. Add translations to other locale files
3. Use `t("your.key")` in components via `useI18n()`

## Cultural Notes

- **en** is `en-NZ` (New Zealand English) — the founder is based in NZ
- **mi** (Te Reo Maori) reflects NZ cultural roots and Maori heritage awareness
- The platform targets global traders — every locale matters
- Arabic RTL support ensures proper layout for RTL readers
