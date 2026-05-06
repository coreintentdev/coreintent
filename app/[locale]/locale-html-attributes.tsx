"use client";

import { useEffect } from "react";

export function LocaleHtmlAttributes({ lang, dir }: { lang: string; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", dir);
  }, [lang, dir]);

  return null;
}
