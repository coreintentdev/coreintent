# CoreIntent — Internationalization (i18n)

## Architecture

CoreIntent uses [next-intl](https://next-intl-docs.vercel.app/) with the Next.js 15 App Router pattern.

### Supported Locales

| Code | Language       | Direction | Status        |
|------|---------------|-----------|---------------|
| en   | English        | LTR       | Full          |
| es   | Español        | LTR       | Full          |
| mi   | Te Reo Māori   | LTR       | Full          |
| zh   | 中文 (Chinese)  | LTR       | Full          |
| ar   | العربية (Arabic)| RTL       | Full          |
| ja   | 日本語 (Japanese)| LTR      | Full          |
| pt   | Português      | LTR       | Full          |
| fr   | Français       | LTR       | Full          |
| de   | Deutsch        | LTR       | Full          |
| hi   | हिन्दी (Hindi) | LTR       | Full          |

Default locale: `en` (English, NZ context).

### Directory Structure

```
i18n/
  config.ts          # Locale list, RTL locales, locale names
  routing.ts         # next-intl routing definition
  request.ts         # Server-side message loading
  navigation.ts      # Locale-aware Link, useRouter, usePathname
messages/
  en.json            # English translations
  es.json            # Spanish translations
  mi.json            # Te Reo Māori translations
  zh.json            # Chinese translations
  ar.json            # Arabic translations (RTL)
  ja.json            # Japanese translations
  pt.json            # Portuguese translations
  fr.json            # French translations
  de.json            # German translations
  hi.json            # Hindi translations
app/
  [locale]/          # All pages nested under locale segment
    layout.tsx       # Root locale layout (NextIntlClientProvider)
    page.tsx         # Home page with translations
    pricing/
    stack/
    demo/
    privacy/
    terms/
    disclaimer/
components/
  LanguageSwitcher.tsx  # Dropdown language selector
  SiteNav.tsx           # Navigation with translated labels
  SiteFooter.tsx        # Footer with translated labels
  Terminal.tsx          # Locale-aware welcome banner
lib/
  formatting.ts        # Locale-aware date/number/currency formatting
middleware.ts          # Locale detection + CORS handling
```

### URL Structure

All pages are served under `/{locale}/` prefix:

- `https://coreintent.dev/en` — English
- `https://coreintent.dev/es` — Spanish
- `https://coreintent.dev/mi` — Te Reo Māori
- `https://coreintent.dev/ar` — Arabic (RTL)

The middleware auto-detects the browser's preferred language and redirects accordingly.

### Translation Keys

Messages are organized by section in JSON files:

- `meta.*` — Page metadata (title, description, OG tags)
- `nav.*` — Navigation labels
- `hero.*` — Hero section content (badge, tagline, CTAs, typewriter phrases)
- `value_props.*` — Value proposition cards
- `stats.*` — Statistics labels
- `tabs.*` — Tab names
- `engine.*` — Engine status labels
- `footer.*` — Footer content
- `terminal.*` — Terminal greeting and messages
- `language.*` — Language switcher labels

### RTL Support

Arabic (`ar`) is the RTL locale. The system:

1. Sets `dir="rtl"` on the `<html>` element via `app/[locale]/layout.tsx`
2. CSS rules in `globals.css` handle text alignment and animation direction
3. Terminal and code blocks remain LTR for readability

### SEO

Each locale generates:
- Unique `<title>` and `<meta description>` via `generateMetadata()`
- `hreflang` alternate links for all 10 locales
- Canonical URL per locale
- Locale-specific OpenGraph metadata

### Date/Number Formatting

Use `lib/formatting.ts` for locale-aware formatting:

```typescript
import { formatNumber, formatCurrency, formatDate, formatPercent } from "@/lib/formatting";
import type { Locale } from "@/i18n/config";

formatNumber(67420, "es");         // "67.420"
formatCurrency(99.99, "ja", "USD"); // "$99.99"
formatDate(new Date(), "mi");       // Locale-formatted date
formatPercent(2.5, "de");           // "2,50 %"
```

## Adding a New Language

1. Add the locale code to `i18n/config.ts`:
   ```typescript
   export const locales = ["en", "es", "mi", ..., "ko"] as const;
   ```

2. Add the locale name to `localeNames` in the same file:
   ```typescript
   ko: "한국어",
   ```

3. Add a locale tag to `lib/formatting.ts`:
   ```typescript
   ko: "ko-KR",
   ```

4. Create `messages/ko.json` — copy `en.json` and translate all values.

5. Update the middleware matcher in `middleware.ts`:
   ```typescript
   matcher: ["/", "/(en|es|mi|...|ko)/:path*", "/api/:path*"],
   ```

6. If the language is RTL, add it to `rtlLocales` in `i18n/config.ts`.

7. Build and test: `npm run build`.

## Cultural Notes

- **Te Reo Māori (mi):** Included to honour NZ/Aotearoa heritage. Professional review recommended for production translations.
- **Arabic (ar):** Full RTL support. Terminal content stays LTR for code readability.
- **Flags:** Language switcher uses country flags as visual aids — NZ flag for both English and Māori.
- **Currency:** Market ticker displays USD by default. Formatting adapts to locale conventions (decimal/thousands separators).
