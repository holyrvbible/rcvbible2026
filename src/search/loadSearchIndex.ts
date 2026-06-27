import { Document } from "flexsearch";
import type { SupportedLocale } from "../data/localeTypes";
import { getSearchIndexOptions } from "./searchIndexConfig";
import type { SearchDocument } from "./searchTypes";

export type SearchIndex = Document<SearchDocument>;

const cache = new Map<SupportedLocale, Promise<SearchIndex>>();

function isGzip(data: Uint8Array): boolean {
  return data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b;
}

async function decompressGzip(compressed: ArrayBuffer): Promise<string> {
  const stream = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));

  return await new Response(stream).text();
}

async function readSearchIndexJson(response: Response): Promise<string> {
  const bytes = new Uint8Array(await response.arrayBuffer());

  // Vite (and some hosts) set Content-Encoding: gzip for .gz files, so fetch
  // may already return decompressed JSON bytes.
  if (!isGzip(bytes)) {
    return new TextDecoder().decode(bytes);
  }

  return await decompressGzip(bytes.buffer);
}

async function fetchSearchIndex(locale: SupportedLocale): Promise<SearchIndex> {
  const response = await fetch(`/search/${locale}.json.gz`);

  if (!response.ok) {
    throw new Error(`Failed to load search index for ${locale}`);
  }

  const exported = JSON.parse(await readSearchIndexJson(response)) as Record<
    string,
    string
  >;
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
