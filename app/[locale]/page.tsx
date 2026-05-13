"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "@/lib/locale-context";
import { isValidLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import Home from "../page";

export default function LocalePage() {
  const params = useParams<{ locale: string }>();
  const { setLocale } = useLocale();

  useEffect(() => {
    if (params.locale && isValidLocale(params.locale)) {
      setLocale(params.locale as Locale);
    }
  }, [params.locale, setLocale]);

  return <Home />;
}
