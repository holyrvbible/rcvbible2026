import { useCallback, useEffect } from "react";
import { SupportedLocales, type SupportedLocale } from "./localeTypes";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { useLocation, useNavigate } from "react-router";

function findBestMatchingLanguage(): SupportedLocale {
  const lang = navigator.language;
  return lang === "zh" || lang.startsWith("zh-") ? "zh-CN" : "en-US";
}

const DEFAULT_LOCALE = findBestMatchingLanguage();

export const localeAtom = atomWithStorage<SupportedLocale>(
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
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    for (const loc of SupportedLocales) {
      if (pathname.startsWith("/" + loc)) {
        if (locale !== loc) {
          setLocaleOrig(loc);
          setAltLocaleOrig(loc === "en-US" ? "zh-CN" : "en-US");
        }
        return;
      }
    }

    void navigate(`/${locale}${pathname}`);
  }, [locale, navigate, pathname, setAltLocaleOrig, setLocaleOrig]);

  const setLocale = useCallback(
    (loc: SupportedLocale) => {
      const p = pathname.slice(1 + locale.length);
      void navigate(`/${loc}${p}`);
    },
    [locale.length, navigate, pathname],
  );

  return { locale, setLocale, altLocale };
}
