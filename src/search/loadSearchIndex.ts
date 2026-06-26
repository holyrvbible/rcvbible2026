import { Document } from "flexsearch";
import type { SupportedLocale } from "../data/localeTypes";
import { getSearchIndexOptions } from "./searchIndexConfig";
import type { SearchDocument } from "./searchTypes";

export type SearchIndex = Document<SearchDocument>;

const cache = new Map<SupportedLocale, Promise<SearchIndex>>();

async function fetchSearchIndex(locale: SupportedLocale): Promise<SearchIndex> {
  const response = await fetch(`/search/${locale}.json`);

  if (!response.ok) {
    throw new Error(`Failed to load search index for ${locale}`);
  }

  const exported = (await response.json()) as Record<string, string>;
  const index = new Document(getSearchIndexOptions(locale));

  for (const [key, data] of Object.entries(exported)) {
    index.import(key, data);
  }

  return index;
}

export async function loadSearchIndex(
  locale: SupportedLocale,
): Promise<SearchIndex> {
  // Dedupe concurrent fetches.
  let promise = cache.get(locale);

  if (!promise) {
    promise = fetchSearchIndex(locale);
    cache.set(locale, promise);
  }

  return await promise;
}
