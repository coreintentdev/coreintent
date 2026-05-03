# CoreIntent — Internationalization (i18n) Architecture

## Supported Locales

| Code | Language       | Direction | BCP 47  |
|------|---------------|-----------|---------|
| en   | English        | LTR       | en-NZ   |
| es   | Spanish        | LTR       | es      |
| mi   | Te Reo Maori   | LTR       | mi-NZ   |
| zh   | Chinese        | LTR       | zh-Hans |
| ja   | Japanese       | LTR       | ja      |
| pt   | Portuguese     | LTR       | pt-BR   |
| fr   | French         | LTR       | fr      |
| de   | German         | LTR       | de      |
| ar   | Arabic         | RTL       | ar      |
| hi   | Hindi          | LTR       | hi      |

## Architecture

### URL Pattern

All pages live under `app/[locale]/`. Middleware redirects bare paths to the user's preferred locale:
- `coreintent.dev/` redirects to `coreintent.dev/en/`
- `coreintent.dev/es/pricing` — Spanish pricing page
- `coreintent.dev/ar/` — Arabic landing page (RTL)

### File Structure

```
lib/
  i18n.ts              — Locale config, message loader, formatting utilities
  i18n-context.tsx     — React context (I18nProvider, useI18n, useLocale)

messages/
  en.json              — English (source of truth)
  es.json              — Spanish
  mi.json              — Te Reo Maori
  zh.json, ja.json, pt.json, fr.json, de.json, ar.json, hi.json

app/
  [locale]/
    layout.tsx         — Locale-aware layout (RTL, metadata, JSON-LD, I18nProvider)
    page.tsx           — Localized landing page
    pricing/page.tsx   — All 7 subpages also under [locale]
    ...

components/
  LanguageSwitcher.tsx — Dropdown locale selector in nav
```

### Key Components

**`lib/i18n.ts`** — Core utilities:
- `getMessages(locale)` — Async message loader with caching
- `createTranslator(messages)` — Returns `t(key, params?)` function
- `formatNumber`, `formatCurrency`, `formatDate`, `formatPercent`, `formatRelativeTime` — Intl-based formatters
- `extractLocaleFromPath`, `stripLocaleFromPath` — URL helpers
- `isLocale`, `isRtl`, `getDirection` — Locale checks

**`lib/i18n-context.tsx`** — React context for client components:
- `<I18nProvider locale={locale} messages={messages}>` — Wraps all `[locale]` pages
- `useI18n()` — Returns `{ locale, t, formatNumber, formatCurrency, formatDate }`
- `useLocale()` — Returns just the locale string
- `useLocaleFormat()` — Returns locale-bound format functions

**`components/LanguageSwitcher.tsx`** — Dropdown selector. Sets `NEXT_LOCALE` cookie and navigates to the equivalent page in the new locale.

### Middleware (`middleware.ts`)

- Detects preferred locale from `NEXT_LOCALE` cookie or `Accept-Language` header
- Redirects bare paths (e.g., `/pricing`) to locale-prefixed paths (`/en/pricing`)
- Passes through API routes (`/api/*`), static assets, and Next.js internals
- Injects security headers on all responses

### RTL Support

Arabic is the RTL locale. `app/[locale]/layout.tsx` sets `dir="rtl"` on the wrapper `<div>`.

### SEO

- **hreflang tags**: Injected in `app/layout.tsx` `<head>` for all 10 locales plus `x-default`
- **Canonical URLs**: Per-locale canonicals in `[locale]/layout.tsx` metadata
- **Sitemap**: `app/sitemap.ts` generates entries for every locale+page combination with `alternates.languages`
- **JSON-LD**: Lists all 10 languages in `inLanguage` arrays
- **OpenGraph**: Per-locale `og:locale` in metadata

### Terminal Localization

The terminal component (`components/Terminal.tsx`) uses `LOCALE_GREETINGS` — a static mapping of locale codes to welcome messages displayed above the ASCII art banner. The greeting changes automatically when users switch languages.

## Translation Key Convention

Keys use flat dot notation: `"section.key"`. Examples:
- `nav.terminal`, `nav.pricing` — Navigation labels
- `hero.badge`, `hero.tagline` — Hero section
- `hero.prop.models.title`, `hero.prop.models.desc` — Value prop cards
- `footer.tagline`, `footer.risk_warning` — Footer text
- `terminal.greeting`, `terminal.greeting_sub` — Terminal strings
- `meta.title`, `meta.description` — Page metadata

Interpolation uses `{param}` syntax: `t("key", { count: 5 })`.

## Adding a New Language

1. Add the locale code to `locales` array in `lib/i18n.ts`
2. Add entries to `localeNames`, `localeFlags`, `localeBcp47` maps
3. If RTL: add to `rtlLocales` array
4. Copy `messages/en.json` to `messages/{code}.json` and translate all values
5. Add greeting to `LOCALE_GREETINGS` in `components/Terminal.tsx`
6. Add hreflang entry in `app/layout.tsx`
7. Middleware and sitemap auto-detect from the `locales` array in `lib/i18n.ts`
8. Run `npm run build` to verify

## Locale-Aware Formatting

All formatting uses `Intl` APIs via helpers in `lib/i18n.ts`:
- `formatNumber(1234.5, "de")` → `"1.234,5"`
- `formatCurrency(45, "ja", "USD")` → `"$45"`
- `formatDate(new Date(), "fr")` → `"3 mai 2026"`
- `formatPercent(87.5, "ar")` → `"٨٧٫٥٪"`
- `formatRelativeTime(date, "es")` → `"hace 2 horas"`

The `useLocaleFormat()` hook provides locale-bound versions of these functions for client components.

## Cultural Notes

- Default locale is `en-NZ` (New Zealand English) — founder is NZ-based
- Te Reo Maori (`mi`) is included as a first-class locale reflecting NZ heritage
- Translations should be reviewed by native speakers before shipping to production
- Platform targets global traders — all 10 languages serve real market demographics
