import { Charset, type DocumentOptions } from "flexsearch";
import type { SupportedLocale } from "../data/localeTypes";
import type {
  SearchDocument,
  SearchSourceData,
  SearchStoredData,
} from "./searchTypes";

export function getSearchIndexOptions(
  locale: SupportedLocale,
): DocumentOptions<SearchDocument> {
  return {
    tokenize: "forward",
    ...(locale === "zh-CN" ? { charset: Charset.CJK } : {}),
    document: {
      id: "id",
      index: ["full", "text"] satisfies (keyof SearchSourceData)[],
      store: ["text"] satisfies (keyof SearchStoredData)[],
    },
  };
}
