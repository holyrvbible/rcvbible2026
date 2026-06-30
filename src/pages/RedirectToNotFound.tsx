import { useAtomValue } from "jotai";
import { localeAtom } from "../data/useLocale";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const RedirectToNotFound: React.FC = () => {
  const locale = useAtomValue(localeAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const href = `/${locale}/404?url=${encodeURI(window.location.href)}`;
    console.log(`RedirectToNotFound: ${href}`);
    void navigate(href);
  }, [locale, navigate]);

  return null;
};
