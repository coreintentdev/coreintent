"use client";

import { useLocale } from "./locale-context";
import type { Locale } from "./i18n-config";

export function useFormatting() {
  const { locale } = useLocale();

  return {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),

    formatCurrency: (value: number, currency = "USD") =>
      new Intl.NumberFormat(locale, { style: "currency", currency }).format(value),

    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, options).format(date),

    formatPercent: (value: number, decimals = 2) =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value / 100),

    formatCompact: (value: number) =>
      new Intl.NumberFormat(locale, { notation: "compact" }).format(value),

    formatRelativeTime: (date: Date) => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHour = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHour / 24);

      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
      if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");
      if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
      if (Math.abs(diffHour) < 24) return rtf.format(-diffHour, "hour");
      return rtf.format(-diffDay, "day");
    },

    locale: locale as Locale,
  };
}
