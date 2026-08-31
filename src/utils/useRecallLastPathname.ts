import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { SupportedLocales } from "../data/localeTypes";

const STORE_KEY = "lastLocation";

/** Only restore once per page load (survives React Strict Mode remounts). */
let restoreAttempted = false;

/** Avoid overwriting the stored location while a restore navigation is in flight. */
let pendingRestoreHref: string | null = null;

function locationHref(pathname: string, search: string, hash: string): string {
  return `${pathname}${search}${hash}`;
}

function isBareHomePathname(pathname: string): boolean {
  return pathname === "/" || pathname === "/index.html";
}

function isHomePathname(pathname: string): boolean {
  if (isBareHomePathname(pathname)) {
    return true;
  }

  return SupportedLocales.some(
    (locale) =>
      pathname === `/${locale}` ||
      pathname === `/${locale}/` ||
      pathname === `/${locale}/index.html`,
  );
}

function pathnameOf(href: string): string {
  return href.split(/[?#]/, 1)[0] ?? href;
}

function isRestorableHref(value: string | null): value is string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return false;
  }

  return !isBareHomePathname(pathnameOf(value));
}

export function useRecallLastPathname() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // `/` and `/index.html` are redirected to a locale home by useInitLocale.
    // Do not persist them, or an intentional last location would be overwritten.
    if (isBareHomePathname(pathname)) {
      console.log(`Ignore bare home pathname`);
      return;
    }

    const href = locationHref(pathname, search, hash);

    if (!restoreAttempted) {
      restoreAttempted = true;

      if (isHomePathname(pathname)) {
        const last = localStorage.getItem(STORE_KEY);

        if (isRestorableHref(last) && last !== href) {
          pendingRestoreHref = last;
          console.log(`Auto-navigate to last remembered location ${last}`);
          void navigate(last, { replace: true });
        }

        console.log(
          `No need to auto-navigate to last remembered location ${String(last)}`,
        );
        return;
      }
    }

    if (pendingRestoreHref !== null) {
      if (href !== pendingRestoreHref) {
        console.log(
          `Ignore pending restore: href=${href}, pendingRestoreHref=${pendingRestoreHref}`,
        );
        return;
      }
      pendingRestoreHref = null;
    }

    localStorage.setItem(STORE_KEY, href);
    console.log(`Saved last location ${href}`);
  }, [hash, navigate, pathname, search]);
}
