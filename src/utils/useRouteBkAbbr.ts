import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { BkAbbrFromLower } from "../data/bibleMetadata";
import { localeAtom } from "../data/useLocale";
import { useAtomValue } from "jotai";

/** Read the book abbreviation from the ":abbr" route param. */
export function useRouteBkAbbr() {
  const locale = useAtomValue(localeAtom);
  const maybeAbbr = useParams().abbr;
  const navigate = useNavigate();
  const abbr = maybeAbbr && BkAbbrFromLower[maybeAbbr.toLocaleLowerCase()];
  const redirected = useRef(false);

  useEffect(() => {
    if (abbr || redirected.current) return;
    redirected.current = true;
    const href = `/${locale}/404?url=${encodeURI(window.location.href)}`;
    console.log(`useRouteBkAbbr: redirect to ${href}`);
    void navigate(href);
  }, [abbr, locale, navigate]);

  return abbr;
}
