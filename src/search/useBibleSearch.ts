import { useCallback, useEffect, useState } from "react";
import type { SupportedLocale } from "../data/localeTypes";
import type { SearchHit } from "./searchTypes";
import { loadSearchIndex, type SearchIndex } from "./loadSearchIndex";
import { performSearch } from "./performSearch";
import { useTryGetBkAbbr } from "../data/useTryGetBkAbbr";
import { useBookNames } from "../data/useBookNames";
import { searchByVrefs } from "./searchByVrefs";

const LIMIT = 50;

export interface SearchResults {
  searchType: "vrefs" | "fullText" | "none";
  hits: SearchHit[];
}

export function useBibleSearch(locale: SupportedLocale) {
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bookNames = useBookNames(locale);
  const tryGetBkAbbr = useTryGetBkAbbr(bookNames);

  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const loaded = await loadSearchIndex(locale);
        if (!canceled) {
          setIndex(loaded);
        }
      } catch (err) {
        if (!canceled) {
          setError(err instanceof Error ? err.message : "Search unavailable");
          setIndex(null);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      canceled = true;
    };
  }, [locale]);

  const search = useCallback(
    async (query: string): Promise<SearchResults> => {
      const vrefHits = await searchByVrefs(query, locale, tryGetBkAbbr, LIMIT);

      if (vrefHits) {
        return { searchType: "vrefs", hits: vrefHits };
      }

      if (!index) {
        return { searchType: "none", hits: [] };
      }

      const hits = performSearch(index, query, LIMIT);
      return { searchType: "fullText", hits };
    },
    [index, locale, tryGetBkAbbr],
  );

  return { search, loading, error };
}
