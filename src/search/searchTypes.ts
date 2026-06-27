import type { DocumentData } from "flexsearch";
import type { BkAbbr } from "../data/bibleMetadata";

export interface SearchStoredData {
  id: string;
  text: string;
}

export type SearchDocument = DocumentData & SearchStoredData;

export interface SearchHit {
  id: string;
  abbr: BkAbbr;
  ch: number;
  vn: number;
  text: string;
}
