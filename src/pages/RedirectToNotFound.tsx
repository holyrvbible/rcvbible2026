import { useLocale } from "../data/useLocale";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const RedirectToNotFound: React.FC = () => {
  const locale = useLocale();
  const navigate = useNavigate();

  useEffect(() => {
    const href = `/${locale}/404?url=${encodeURI(window.location.href)}`;
    console.log(`RedirectToNotFound: ${href}`);
    void navigate(href);
  }, [locale, navigate]);

  return null;
};
