import type { DocumentData } from "flexsearch";
import type { BkAbbr } from "../data/bibleMetadata";

export interface SearchHit {
  id: string;
  abbr: BkAbbr;
  ch: number;
  vn: number;
  text: string;
}

export type SearchDocument = DocumentData & SearchHit;
