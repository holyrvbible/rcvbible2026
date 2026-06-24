import { useCallback } from "react";
import type { SupportedLocale } from "./localeTypes";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

function findBestMatchingLanguage(): SupportedLocale {
  const lang = navigator.language;
  return lang === "zh" || lang.startsWith("zh-") ? "zh-CN" : "en-US";
}

const DEFAULT_LOCALE = findBestMatchingLanguage();

const localeAtom = atomWithStorage<SupportedLocale>(
  "currentLocale",
  DEFAULT_LOCALE,
  undefined,
  { getOnInit: true },
);

const altLocaleAtom = atomWithStorage<SupportedLocale>(
  "altLocale",
  DEFAULT_LOCALE === "en-US" ? "zh-CN" : "en-US",
  undefined,
  { getOnInit: true },
);

export function useLocale() {
  const [locale, setLocaleOrig] = useAtom(localeAtom);
  const [altLocale, setAltLocaleOrig] = useAtom(altLocaleAtom);

  const setLocale = useCallback(
    (loc: SupportedLocale) => {
      setLocaleOrig(loc);
      setAltLocaleOrig(loc === "en-US" ? "zh-CN" : "en-US");
    },
    [setAltLocaleOrig, setLocaleOrig],
  );

  const setAltLocale = useCallback(
    (loc: SupportedLocale) => {
      setAltLocaleOrig(loc);
      setLocaleOrig(loc === "en-US" ? "zh-CN" : "en-US");
    },
    [setAltLocaleOrig, setLocaleOrig],
  );

  return { locale, setLocale, altLocale, setAltLocale };
}
