import { Charset, type DocumentOptions } from "flexsearch";
import type { SupportedLocale } from "../data/localeTypes";
import type { SearchDocument, SearchStoredData } from "./searchTypes";

export function getSearchIndexOptions(
  locale: SupportedLocale,
): DocumentOptions<SearchDocument> {
  return {
    // Warning: This must be set to "full" in order to find words within
    // sentences in Chinese.
    tokenize: "full",
    ...(locale === "zh-CN" ? { charset: Charset.CJK } : {}),
    document: {
      id: "id",
      index: ["text"] satisfies (keyof SearchStoredData)[],
      store: ["text"] satisfies (keyof SearchStoredData)[],
    },
  };
}
