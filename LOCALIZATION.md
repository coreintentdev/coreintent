# Localization (i18n) Architecture

CoreIntent supports 10 languages with full URL-based routing, RTL support, and locale-aware formatting.

## Supported Locales

| Code | Language       | Region | Direction |
|------|---------------|--------|-----------|
| en   | English        | en-NZ  | LTR       |
| es   | Español        | es-ES  | LTR       |
| mi   | Te Reo Māori   | mi-NZ  | LTR       |
| zh   | 中文            | zh-CN  | LTR       |
| ja   | 日本語          | ja-JP  | LTR       |
| pt   | Português      | pt-BR  | LTR       |
| fr   | Français       | fr-FR  | LTR       |
| de   | Deutsch        | de-DE  | LTR       |
| ar   | العربية         | ar-SA  | RTL       |
| hi   | हिन्दी          | hi-IN  | LTR       |

## URL Structure

All pages are routed under `/{locale}/`:
- `/en` — English landing page
- `/es/pricing` — Spanish competitions page
- `/mi/stack` — Te Reo Māori stack page

The middleware (`middleware.ts`) handles:
1. Detecting locale from the URL path
2. Redirecting bare paths (e.g., `/pricing` → `/en/pricing`)
3. Locale detection via `NEXT_LOCALE` cookie or `Accept-Language` header
4. Setting `x-locale` request header for the root layout

## File Structure

```
lib/
  i18n.ts           — Config, locale list, server utilities (formatting, detection)
  i18n-client.tsx   — React context provider + useTranslation hook

messages/
  en.json           — English (complete, used as fallback base)
  es.json           — Spanish (complete)
  mi.json           — Te Reo Māori (complete)
  zh.json           — Chinese Simplified (partial, falls back to English)
  ja.json           — Japanese (partial)
  pt.json           — Portuguese (partial)
  fr.json           — French (partial)
  de.json           — German (partial)
  ar.json           — Arabic (partial, RTL)
  hi.json           — Hindi (partial)

app/
  layout.tsx                — Root layout, reads locale from x-locale header
  [locale]/
    layout.tsx              — Locale layout, loads translations, wraps in TranslationProvider
    page.tsx                — Landing page
    pricing/page.tsx        — Competitions
    stack/page.tsx          — Technology stack
    demo/page.tsx           — Interactive demo
    privacy/page.tsx        — Privacy policy
    terms/page.tsx          — Terms of service
    disclaimer/page.tsx     — Disclaimer

components/
  LanguageSwitcher.tsx      — Dropdown language picker in the nav
  SiteNav.tsx               — Navigation with locale-aware links
  SiteFooter.tsx            — Footer with translated labels
  Terminal.tsx              — Terminal with locale-aware greeting
```

## How Translations Work

### Server side
The `[locale]/layout.tsx` loads translations using `getTranslations(locale)` and wraps children in a `TranslationProvider`.

### Client side
Any client component calls `useTranslation()` to get:
- `t(key)` — Resolve a dot-notated translation key (e.g., `t("hero.subtitle")`)
- `locale` — Current locale string
- `formatNumber(value, options?)` — Locale-aware number formatting
- `formatDate(date, options?)` — Locale-aware date formatting

### Fallback
Missing translation keys fall back to English. The `getTranslations` function deep-merges locale-specific messages on top of the English base, so partial translation files work correctly.

## Adding a New Language

1. Create `messages/{code}.json` with translated strings (use `en.json` as template)
2. Add the locale code to `lib/i18n.ts`:
   - Add to the `locales` array
   - Add to `localeNames`
   - Add to `localeRegions`
   - If RTL, add to `rtlLocales`
   - Add a `case` in `loadLocaleMessages()`
3. That's it — the middleware, routing, sitemap, and language switcher pick it up automatically.

## RTL Support

Arabic (`ar`) is configured as RTL. The root layout sets `dir="rtl"` on `<html>` when the locale is RTL. Additional CSS rules in `globals.css` handle:
- Text alignment
- Flex direction reversal for nav and footer
- Ticker animation direction

## SEO

- **hreflang**: Generated in `[locale]/layout.tsx` via `generateMetadata()` alternates
- **Sitemap**: `app/sitemap.ts` generates entries for all locale/page combinations with `alternates.languages`
- **Canonical**: Each locale page has its own canonical URL
- **lang attribute**: Set dynamically on `<html>` based on detected locale

## Date & Number Formatting

Use the formatting utilities from `lib/i18n.ts` or the `useTranslation()` hook:

```tsx
const { formatNumber, formatDate } = useTranslation();
formatNumber(67420.50);           // "67,420.50" (en-NZ) / "67.420,50" (de-DE)
formatDate(new Date());           // locale-aware date string
```

For server components, import directly from `lib/i18n.ts`:
```tsx
import { formatNumber, formatCurrency, formatDate } from "@/lib/i18n";
formatCurrency(45, "de", "USD"); // "$45.00" formatted for German locale
```
