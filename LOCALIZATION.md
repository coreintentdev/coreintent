# CoreIntent i18n Architecture

## Overview

CoreIntent uses [next-intl](https://next-intl.dev) with Next.js App Router for internationalization. The default locale is English (`en`) and the URL prefix is omitted for it (`/` instead of `/en`). All other locales are prefixed (`/es`, `/mi`, `/ar`, etc.).

## Supported Locales

| Code | Language        | Direction | BCP 47 Tag |
|------|-----------------|-----------|------------|
| en   | English         | LTR       | en-NZ      |
| es   | Spanish         | LTR       | es-419     |
| mi   | Te Reo Maori    | LTR       | mi-NZ      |
| zh   | Chinese (Simplified) | LTR  | zh-CN      |
| ja   | Japanese        | LTR       | ja-JP      |
| pt   | Portuguese (BR) | LTR       | pt-BR      |
| fr   | French          | LTR       | fr-FR      |
| de   | German          | LTR       | de-DE      |
| ar   | Arabic          | RTL       | ar-SA      |
| hi   | Hindi           | LTR       | hi-IN      |

## File Structure

```
i18n/
  routing.ts       # Locale definitions, navigation helpers (Link, usePathname, etc.)
  request.ts       # Server-side message loading for next-intl

lib/
  i18n.ts          # Locale-aware formatting: dates, numbers, currency, percentages

messages/
  en.json          # English translations (source of truth)
  es.json          # Spanish
  mi.json          # Te Reo Maori
  zh.json          # Chinese (Simplified)
  ja.json          # Japanese
  pt.json          # Portuguese (Brazilian)
  fr.json          # French
  de.json          # German
  ar.json          # Arabic
  hi.json          # Hindi

app/
  layout.tsx       # Root layout (passthrough)
  [locale]/
    layout.tsx     # Locale-aware layout with NextIntlClientProvider, RTL support, SEO
    page.tsx       # Landing page with translated hero, tabs, pipeline
    pricing/       # Competitions page
    stack/         # Stack page
    ...

components/
  LanguageSwitcher.tsx  # Dropdown locale picker in the nav
  SiteNav.tsx           # Navigation with translated labels + language switcher
  Terminal.tsx          # Terminal with locale-aware greetings
```

## How It Works

### Routing

The middleware (`middleware.ts`) handles locale detection and routing:
1. API routes (`/api/*`) bypass locale routing and get CORS handling
2. All other routes go through `next-intl/middleware` which:
   - Detects locale from `Accept-Language` header, cookies, or URL prefix
   - Redirects to the appropriate locale path
   - Sets `en` as default (no URL prefix)

### Using Translations

**Client components** (most of this app):
```tsx
import { useTranslations } from "next-intl";

function MyComponent() {
  const t = useTranslations("hero");
  return <h1>{t("subtitle")}</h1>;
}
```

**Server components**:
```tsx
import { getTranslations } from "next-intl/server";

async function MyPage() {
  const t = await getTranslations("hero");
  return <h1>{t("subtitle")}</h1>;
}
```

**Locale-aware links** (instead of `next/link`):
```tsx
import { Link } from "@/i18n/routing";
<Link href="/pricing">Pricing</Link>
```

### Date & Number Formatting

Use the utilities in `lib/i18n.ts`:
```tsx
import { formatDate, formatCurrency, formatPercent } from "@/lib/i18n";

formatDate(new Date(), "ja");           // "2026年4月18日"
formatCurrency(45, "de");               // "45,00 $"
formatPercent(87.5, "es");              // "87,5 %"
```

### RTL Support

Arabic (`ar`) is automatically detected as RTL. The `[locale]/layout.tsx` sets `dir="rtl"` on the `<html>` tag. CSS rules in `globals.css` handle:
- Base `direction: rtl` and `text-align: right`
- Terminal and code blocks remain LTR
- Navigation remains LTR for consistency

### SEO

Each locale generates:
- `<html lang="xx">` with correct language code
- `<link rel="alternate" hreflang="xx">` tags for all locales via `alternates.languages`
- Locale-specific canonical URLs
- Translated `<title>` and `<meta description>`

## Adding a New Language

1. **Add the locale code** to `SUPPORTED_LOCALES` in `i18n/routing.ts`
2. **Add the display name** to `LOCALE_NAMES` in the same file
3. **Add BCP 47 tag and timezone** to the maps in `lib/i18n.ts`
4. **If RTL**, add to `RTL_LOCALES` in `i18n/routing.ts`
5. **Create translation file** at `messages/{code}.json` — copy `en.json` and translate
6. **Add terminal greeting** to `LOCALE_GREETINGS` in `components/Terminal.tsx`
7. **Update middleware matcher** in `middleware.ts` to include the new locale code
8. **Build and test**: `npm run build`

## Translation Keys

The `en.json` file is the source of truth. All translation files must have the same key structure. Key namespaces:

- `meta` — Page title and description (SEO)
- `nav` — Navigation labels
- `hero` — Landing page hero section
- `tabs` — Tab bar labels
- `valueProps` — Value proposition cards
- `pipeline` — Signal pipeline steps
- `stats` — Stats banner labels
- `typewriter` — TypeWriter animation phrases (array)
- `terminal` — Terminal component strings
- `footer` — Footer labels
- `common` — Shared strings
- `languageSwitcher` — Language picker label
- `poweredBy` — "Powered by" header
- `socialProof` — Testimonials section header

## Cultural Notes

- **NZ-first**: Default locale is `en-NZ`, timestamps default to `Pacific/Auckland`
- **Te Reo Maori**: Included as first-class locale reflecting the founder's NZ heritage
- **Arabic RTL**: Full right-to-left support with appropriate CSS
- **Brand names stay untranslated**: CoreIntent, Zynthio, Grok, Claude, Perplexity, ZynRip
