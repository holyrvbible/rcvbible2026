import { useEffect, useState } from "react";
import type { LocaleBookNames, SupportedLocale } from "./localeTypes";

const cache: Partial<Record<SupportedLocale, LocaleBookNames>> = {};

export async function importBookNames(locale: SupportedLocale) {
  const cached = cache[locale];
  if (cached) {
    return { default: cached };
  }

  switch (locale) {
    case "en-US":
      return import(`./en-US/bookNames`);
    case "zh-CN":
      return import(`./zh-CN/bookNames`);
    default:
      locale satisfies never;
      // Fallback to en-US.
      return import(`./en-US/bookNames`);
  }
}

export function useBookNames(locale: SupportedLocale) {
  const [bookNames, setBookNames] = useState<LocaleBookNames>();

  useEffect(() => {
    let canceled = false;

    async function load() {
      if (cache[locale]) {
        if (!canceled) setBookNames(cache[locale]);
        return;
      }

      // Use constant import paths for full type-checking.
      const loaded = await importBookNames(locale);

      cache[locale] = loaded.default;
      if (!canceled) setBookNames(loaded.default);
    }

    void load();

    return () => {
      canceled = true;
    };
  }, [locale]);

  return bookNames;
}
