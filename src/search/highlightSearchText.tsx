import type { SupportedLocale } from "../data/localeTypes";
import styles from "./SearchOverlay.module.css";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSearchTerms(query: string, locale: SupportedLocale): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const terms = new Set<string>();

  for (const segment of trimmed.split(/\s+/)) {
    const cleaned = segment.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    if (!cleaned) continue;

    terms.add(cleaned);

    if (locale === "zh-CN" && /[\u4e00-\u9fff]/.test(cleaned)) {
      for (const char of cleaned) {
        if (/[\u4e00-\u9fff]/.test(char)) {
          terms.add(char);
        }
      }
    }
  }

  return [...terms].sort((a, b) => b.length - a.length);
}

export function highlightSearchText(
  text: string,
  query: string,
  locale: SupportedLocale,
): React.ReactNode {
  const terms = extractSearchTerms(query, locale);
  if (!terms.length) return text;

  const pattern = terms.map(escapeRegExp).join("|");
  const regex = new RegExp(`(${pattern})`, "giu");
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    const key = index + 1;

    return index % 2 === 1 ? (
      <mark key={key} className={styles.highlight}>
        {part}
      </mark>
    ) : (
      part
    );
  });
}
