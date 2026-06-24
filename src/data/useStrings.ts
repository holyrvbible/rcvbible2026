import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupportedLocale } from "./localeTypes";
import { useLocale } from "./useLocale";
import type { StringsData } from "./en-US/strings";

const cache: Partial<Record<SupportedLocale, StringsData>> = {};

export type StringsResult = StringsData & {
  get: (key: keyof StringsData, ...args: (string | number)[]) => string;
};

export function useStrings(): StringsResult | null {
  const { locale } = useLocale();
  const [strings, setStrings] = useState<StringsData>();

  useEffect(() => {
    let canceled = false;

    async function load() {
      if (cache[locale]) {
        if (!canceled) setStrings(cache[locale]);
        return;
      }

      // Use constant import paths for full type-checking.
      const loaded = await (() => {
        switch (locale) {
          case "en-US":
            return import(`./en-US/strings`);
          case "zh-CN":
            return import(`./zh-CN/strings`);
          default:
            locale satisfies never;
            // Fallback to en-US.
            return import(`./en-US/strings`);
        }
      })();

      cache[locale] = loaded.strings;
      if (!canceled) setStrings(loaded.strings);
    }

    void load();

    return () => {
      canceled = true;
    };
  }, [locale]);

  // Get string with placeholder substitutions.
  const get = useCallback(
    (key: keyof StringsData, ...args: (string | number)[]): string => {
      if (!strings) return "";

      let s = strings[key];

      for (let i = 1; i <= args.length; i++) {
        const placeholder = `{${String(i)}}`;
        if (!s.includes(placeholder)) {
          throw new Error(
            `Missing placeholder '${placeholder}' in string '${key}': ${strings[key]}`,
          );
        }
        s = s.replaceAll(placeholder, String(args[i - 1]));
      }

      const i = args.length + 1;
      const placeholder = `{${String(i)}}`;

      if (strings[key].includes(placeholder)) {
        throw new Error(
          `Missing arg for placeholder '${placeholder}' in string '${key}': ${strings[key]}`,
        );
      }

      return s;
    },
    [strings],
  );

  return useMemo(() => (strings ? { ...strings, get } : null), [get, strings]);
}
