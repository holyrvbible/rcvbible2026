import { useCallback, useEffect } from "react";
import { SupportedLocales, type SupportedLocale } from "./localeTypes";
import { atomWithStorage } from "jotai/utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useLocation, useNavigate } from "react-router";

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

export function useInitLocale() {
  const [locale, setLocaleOrig] = useAtom(localeAtom);
  const setAltLocaleOrig = useSetAtom(altLocaleAtom);
  const { pathname, search, hash } = useLocation();
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

    void navigate(`/${locale}${pathname}${search}${hash}`, { replace: true });
  }, [
    hash,
    locale,
    navigate,
    pathname,
    search,
    setAltLocaleOrig,
    setLocaleOrig,
  ]);
}

export function useLocale() {
  return useAtomValue(localeAtom);
}

export function useAltLocale() {
  return useAtomValue(altLocaleAtom);
}

export function useSetLocale() {
  const locale = useAtomValue(localeAtom);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (loc: SupportedLocale) => {
      const p = pathname.slice(1 + locale.length);
      void navigate(`/${loc}${p}`);
    },
    [locale.length, navigate, pathname],
  );
}
