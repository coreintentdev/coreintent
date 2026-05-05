# CoreIntent — Internationalization (i18n) Architecture

## Overview

CoreIntent uses `next-intl` v4 with the Next.js 15 App Router `[locale]` pattern for full internationalization. All user-facing content is translatable, routes are locale-prefixed, and RTL layouts are supported.

## Supported Locales

| Code | Language | Direction | Flag |
|------|----------|-----------|------|
| `en` | English (NZ) | LTR | 🇳🇿 |
| `es` | Español | LTR | 🇪🇸 |
| `mi` | Te Reo Māori | LTR | 🇳🇿 |
| `zh` | 中文 (Simplified) | LTR | 🇨🇳 |
| `ja` | 日本語 | LTR | 🇯🇵 |
| `pt` | Português (BR) | LTR | 🇧🇷 |
| `fr` | Français | LTR | 🇫🇷 |
| `de` | Deutsch | LTR | 🇩🇪 |
| `ar` | العربية | RTL | 🇸🇦 |
| `hi` | हिन्दी | LTR | 🇮🇳 |

Default locale: `en` (no URL prefix needed — uses `localePrefix: "as-needed"`).

## File Structure

```
coreintent/
├── i18n/
│   ├── routing.ts          # Locale routing config (defineRouting)
│   ├── navigation.ts       # Locale-aware Link, usePathname, useRouter
│   └── request.ts          # Server-side request config (loads messages)
├── lib/
│   └── i18n.ts             # Utility functions (formatNumber, formatDate, etc.)
├── messages/
│   ├── en.json             # English translations
│   ├── es.json             # Spanish translations
│   ├── mi.json             # Te Reo Māori translations
│   ├── zh.json             # Chinese (Simplified) translations
│   ├── ja.json             # Japanese translations
│   ├── pt.json             # Portuguese (BR) translations
│   ├── fr.json             # French translations
│   ├── de.json             # German translations
│   ├── ar.json             # Arabic translations
│   └── hi.json             # Hindi translations
├── app/
│   ├── layout.tsx          # Root layout (passthrough)
│   └── [locale]/
│       ├── layout.tsx      # Locale layout (html lang, dir, NextIntlClientProvider)
│       ├── page.tsx        # Landing page (uses useTranslations)
│       ├── demo/
│       ├── stack/
│       ├── pricing/
│       ├── privacy/
│       ├── terms/
│       └── disclaimer/
├── components/
│   ├── LanguageSwitcher.tsx  # Dropdown language picker
│   ├── SiteNav.tsx           # Nav with i18n links + language switcher
│   ├── SiteFooter.tsx        # Footer with translated strings
│   └── Terminal.tsx          # Terminal with locale-aware greeting
├── middleware.ts             # Handles locale detection + API CORS
└── next.config.js            # withNextIntl plugin wrapper
```

## How to Add a New Language

1. **Add the locale code** to `lib/i18n.ts`:
   ```ts
   export const locales = [..., "ko"] as const;
   ```

2. **Add metadata** to `localeNames` and `localeFlags` in `lib/i18n.ts`.

3. **Add hreflang mapping** in `getHreflangLocale()` in `lib/i18n.ts`.

4. **Create the translation file**: Copy `messages/en.json` to `messages/ko.json` and translate all values.

5. **Add terminal greeting** in `components/Terminal.tsx`:
   - Add entry to `LOCALE_GREETINGS` map
   - Add entry to `LOCALE_SUBTITLES` map

6. **If RTL**: Add the locale code to `rtlLocales` array in `lib/i18n.ts`.

7. **Build and verify**: `npm run build` — the new locale will auto-generate all pages.

## URL Routing

- Default locale (en): `https://coreintent.dev/` (no prefix)
- Other locales: `https://coreintent.dev/es/`, `https://coreintent.dev/mi/`, etc.
- The middleware auto-detects browser language via `Accept-Language` header and redirects.

## Using Translations in Components

### Client Components
```tsx
"use client";
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("hero");
  return <h1>{t("title")}</h1>;
}
```

### Server Components
```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("hero");
  return <h1>{t("title")}</h1>;
}
```

### Linking Between Pages
```tsx
import { Link } from "@/i18n/navigation";

// Automatically prefixes with current locale
<Link href="/pricing">Pricing</Link>
```

## Locale-Aware Formatting

Use utilities from `lib/i18n.ts`:

```ts
import { formatNumber, formatDate, formatCurrency } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

formatNumber(1234.5, "de");      // "1.234,5"
formatDate(new Date(), "ja");    // "2026/5/5"
formatCurrency(99.99, "en");     // "NZ$99.99"
formatCurrency(99.99, "ja", "JPY"); // "¥100"
```

## RTL Support

Arabic (`ar`) automatically gets `dir="rtl"` on the `<html>` element. CSS in `globals.css` handles layout flipping via `[dir="rtl"]` selectors. No JavaScript changes needed — just add translations and RTL kicks in.

## SEO

- Each locale gets its own `<link rel="alternate" hreflang="...">` tags via `generateMetadata()`
- Canonical URLs are locale-specific
- OpenGraph locale is set per-language
- Structured data (JSON-LD) is present on all locale variants

## Cultural Notes

- **en**: Primary locale, NZ English (en-NZ). Dates in NZ format.
- **mi**: Te Reo Māori — reflects the founder's NZ heritage. Translations aim for natural modern Māori.
- **ar**: Full RTL layout support. UI mirrors appropriately.
- All date/time displays default to `Pacific/Auckland` timezone (NZST/NZDT).
