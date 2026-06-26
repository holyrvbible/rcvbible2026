import { Charset, type DocumentOptions } from "flexsearch";
import type { SupportedLocale } from "../data/localeTypes";
import type { SearchDocument } from "./searchTypes";

export function getSearchIndexOptions(
  locale: SupportedLocale,
): DocumentOptions<SearchDocument> {
  return {
    tokenize: "forward",
    ...(locale === "zh-CN" ? { charset: Charset.CJK } : {}),
    document: {
      id: "id",
      index: ["text"],
      store: ["abbr", "ch", "vn", "text"],
    },
  };
}
