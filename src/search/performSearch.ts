import type {
  SearchDocument,
  SearchStoredData,
  SearchHit,
} from "./searchTypes";
import { type SearchIndex } from "./loadSearchIndex";
import type { BkAbbr } from "../data/bibleMetadata";

function flattenSearchResults(results: unknown): SearchStoredData[] {
  if (!Array.isArray(results)) return [];

  const hits: SearchStoredData[] = [];
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
        text: doc.text,
      });
    }
  }

  return hits;
}

function parseToSearchHit(hit: SearchStoredData): SearchHit {
  // The id contains the vref.
  const abbrChVn = hit.id;
  const match = /^(\w\w\w)(\d+):(\d+)$/.exec(abbrChVn);
  if (!match) throw new Error(`Bad hit id '${abbrChVn}'`);

  const abbr = match[1] as BkAbbr;
  const chStr = match[2];
  const ch = Number(chStr);
  const vnStr = match[3];
  const vn = Number(vnStr);

  // The text before the pipe is for searching only, but not for display.
  const text = hit.text.split("|")[1];

  return {
    id: hit.id,
    abbr,
    ch,
    vn,
    text,
  };
}

export function performSearch(
  searchIndex: SearchIndex,
  query: string,
  limit: number,
): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results = searchIndex.search(trimmed, {
    enrich: true,
    limit,
  });

  return flattenSearchResults(results).map(parseToSearchHit);
}
