import { useCallback, useEffect, useState } from "react";
import type { SupportedLocale } from "../data/localeTypes";
import type { SearchHit } from "./searchTypes";
import { loadSearchIndex, type SearchIndex } from "./loadSearchIndex";
import { performSearch } from "./performSearch";

export function useBibleSearch(locale: SupportedLocale) {
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    (query: string): SearchHit[] => {
      if (!index) return [];
      return performSearch(index, query);
    },
    [index],
  );

  return { search, loading, error };
}
