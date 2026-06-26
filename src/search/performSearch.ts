import type { SearchDocument, SearchHit } from "./searchTypes";
import { type SearchIndex } from "./loadSearchIndex";

function flattenSearchResults(results: unknown): SearchHit[] {
  if (!Array.isArray(results)) return [];

  const hits: SearchHit[] = [];
  const seen = new Set<string>();

  for (const group of results) {
    if (typeof group !== "object" || group === null || !("result" in group)) {
      continue;
    }

    const { result } = group as { result: unknown };
    if (!Array.isArray(result)) continue;

    for (const item of result) {
      if (typeof item !== "object" || item === null || !("doc" in item)) {
        continue;
      }

      const { id, doc } = item as { id: string; doc: SearchDocument | null };
      if (!doc || seen.has(id)) continue;

      seen.add(id);
      hits.push({
        id,
        abbr: doc.abbr,
        ch: doc.ch,
        vn: doc.vn,
        text: doc.text,
      });
    }
  }

  return hits;
}

export function performSearch(
  searchIndex: SearchIndex,
  query: string,
  limit = 50,
): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results = searchIndex.search(trimmed, {
    enrich: true,
    limit,
  });

  return flattenSearchResults(results);
}
