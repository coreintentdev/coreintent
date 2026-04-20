# CoreIntent — Internationalization (i18n) Architecture

## Overview

CoreIntent uses [next-intl](https://next-intl.dev/) with Next.js 15 App Router for full internationalization. The platform supports 10 locales with locale-prefixed routing, RTL support, and locale-aware formatting.

## Supported Locales

| Code | Language       | Region          | Direction |
|------|---------------|-----------------|-----------|
| en   | English       | New Zealand     | LTR       |
| es   | Espanol       | Spain           | LTR       |
| mi   | Te Reo Maori  | New Zealand     | LTR       |
| zh   | Chinese       | China           | LTR       |
| ja   | Japanese      | Japan           | LTR       |
| pt   | Portuguese    | Brazil          | LTR       |
| fr   | French        | France          | LTR       |
| de   | German        | Germany         | LTR       |
| ar   | Arabic        | Saudi Arabia    | RTL       |
| hi   | Hindi         | India           | LTR       |

Default locale: `en` (no URL prefix for English — uses `as-needed` strategy).

## File Structure

```
coreintent/
├── i18n/
│   ├── config.ts        # Locale list, RTL config, region mapping
│   ├─��� routing.ts       # next-intl routing definition
│   ├── request.ts       # Server-side request config (loads messages)
│   └── navigation.ts    # Locale-aware Link, useRouter, usePathname
├── lib/
│   └── i18n.ts          # Formatting utilities (date, number, currency, price)
├── messages/
│   ├── en.json          # English (complete)
│   ├── es.json          # Spanish (complete)
│   ├── mi.json          # Te Reo Maori (complete)
│   ├── zh.json          # Chinese (complete)
│   ├── ja.json          # Japanese (complete)
│   ├── pt.json          # Portuguese (complete)
│   ├── fr.json          # French (complete)
│   ├── de.json          # German (complete)
│   ├── ar.json          # Arabic (complete, RTL)
│   └── hi.json          # Hindi (complete)
├── middleware.ts         # Locale detection + CORS (API excluded)
├── app/
│   ├── layout.tsx       # Root layout (imports globals.css only)
│   └── [locale]/
│       ├── layout.tsx   # Locale layout (html lang, dir, metadata, NextIntlClientProvider)
│       ├── page.tsx     # Landing page (translated hero, tabs, pipeline)
│       ├── pricing/     # Pricing page
│       ├── stack/       # Stack page
│       ├── demo/        # Demo page
│       ├── privacy/     # Privacy policy
│       ├── terms/       # Terms of service
│       └── disclaimer/  # Disclaimer
└── components/
    ├── LanguageSwitcher.tsx  # Dropdown locale picker with flags
    ├── SiteNav.tsx           # Nav with translated labels + switcher
    └── SiteFooter.tsx        # Footer with translated labels
```

## URL Routing

- English (default): `https://coreintent.dev/` (no prefix)
- Spanish: `https://coreintent.dev/es`
- Maori: `https://coreintent.dev/mi`
- Arabic: `https://coreintent.dev/ar`
- etc.

API routes (`/api/*`) are excluded from locale routing and work as before.

## How to Add a New Language

1. **Add the locale code** to `i18n/config.ts`:
   - Add to `locales` array
   - Add display name to `localeNames`
   - Add to `rtlLocales` if RTL
   - Add region to `localeRegionMap`

2. **Create translation file** at `messages/{code}.json`:
   - Copy `messages/en.json` as a starting template
   - Translate all string values (keep JSON keys identical)

3. **Add formatting config** in `lib/i18n.ts`:
   - Add timezone to `TIMEZONE_MAP`
   - Add currency to `CURRENCY_MAP`
   - Add terminal greeting to `getTerminalGreeting()`

4. **Build and test**: `npm run build` — the locale will auto-generate static pages.

## Translation File Structure

Each `messages/{locale}.json` has these top-level namespaces:

| Namespace          | Usage                                        |
|-------------------|----------------------------------------------|
| `meta`            | Page metadata (title, description, OG, Twitter) |
| `nav`             | Navigation labels                             |
| `hero`            | Landing page hero section + typewriter phrases |
| `valueProps`      | Value proposition cards                       |
| `pipeline`        | Signal pipeline steps                         |
| `stats`           | Stats banner labels                           |
| `poweredBy`       | "Powered by" label                            |
| `tabs`            | Tab labels (Terminal, Dashboard, etc.)        |
| `dashboard`       | Dashboard section labels                      |
| `agents`          | AI agent names and descriptions               |
| `testimonials`    | Testimonials section                          |
| `footer`          | Footer labels and legal text                  |
| `terminal`        | Terminal greeting and help text               |
| `languageSwitcher`| Language selector labels                      |

## Using Translations in Components

### Client Components

```tsx
"use client";
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("namespace");
  return <p>{t("key")}</p>;
}
```

### With Interpolation

```tsx
// In JSON: "copyright": "© {year} Corey McIvor."
t("copyright", { year: "2026" })
```

### Locale-Aware Navigation

```tsx
import { Link } from "@/i18n/navigation";

// Automatically prefixes with current locale
<Link href="/pricing">Pricing</Link>
```

## Locale-Aware Formatting

`lib/i18n.ts` provides these utilities:

| Function            | Purpose                                    |
|--------------------|--------------------------------------------|
| `formatNumber()`   | Locale-aware number formatting              |
| `formatCurrency()` | Currency with locale default                |
| `formatDate()`     | Date with locale timezone                   |
| `formatDateTime()` | Full date+time                              |
| `formatRelativeTime()` | "2 hours ago" in locale language        |
| `formatPercent()`  | Percentage formatting                       |
| `formatPrice()`    | USD price with locale number format         |
| `getTimezone()`    | Default timezone for locale                 |
| `getDirection()`   | "ltr" or "rtl"                              |
| `getTerminalGreeting()` | Welcome message in locale language     |
| `getHrefLangs()`   | All locale URLs for SEO `<link>` tags       |

## RTL Support

Arabic (`ar`) is configured as RTL. The `[locale]/layout.tsx` sets `dir="rtl"` on `<html>` automatically. Additional RTL styles are in `globals.css` under `[dir="rtl"]`.

## SEO

- Each locale gets its own `<html lang>` attribute
- `alternates.languages` in metadata generates `<link rel="alternate" hreflang>` for all locales
- `x-default` points to the English version
- Open Graph `locale` is set per locale (e.g., `es_ES`, `ja_JP`)
- Canonical URLs are locale-specific

## Middleware

The middleware (`middleware.ts`) handles:
1. Locale detection from `Accept-Language` header, cookies, and URL
2. Redirect to locale-prefixed URL when needed
3. CORS preflight for `/api/*` routes (unchanged)

## Terminal

The terminal component greets users in their detected language via `getTerminalGreeting()` in `lib/i18n.ts`. Terminal commands remain in English (they are code-like identifiers), but the welcome message and status text adapt to locale.
