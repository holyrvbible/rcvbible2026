import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { localeAtom } from "../data/useLocale";
import { useAtomValue } from "jotai";

/** Read a route param as a number (positive integers only). */
export function useRouteNumParam(paramName: string) {
  const locale = useAtomValue(localeAtom);
  const maybeParam = useParams()[paramName];
  const navigate = useNavigate();
  const num =
    maybeParam && /^\d+$/.exec(maybeParam)
      ? parseInt(maybeParam, 10)
      : undefined;
  const redirected = useRef(false);

  useEffect(() => {
    if (num || redirected.current) return;
    redirected.current = true;
    const href = `/${locale}/404?url=${encodeURI(window.location.href)}`;
    console.log(`useRouteNumParam: redirect to ${href}`);
    void navigate(href);
  }, [locale, navigate, num]);

  return num;
}
