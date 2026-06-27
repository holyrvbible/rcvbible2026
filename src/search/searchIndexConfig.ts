import { Charset, type DocumentOptions } from "flexsearch";
import type { SupportedLocale } from "../data/localeTypes";
import type { SearchDocument, SearchStoredData } from "./searchTypes";

export function getSearchIndexOptions(
  locale: SupportedLocale,
): DocumentOptions<SearchDocument> {
  return {
    tokenize: "forward",
    ...(locale === "zh-CN" ? { charset: Charset.CJK } : {}),
    document: {
      id: "id",
      index: ["text"] satisfies (keyof SearchStoredData)[],
      store: ["text"] satisfies (keyof SearchStoredData)[],
    },
  };
}
