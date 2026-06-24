/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { BkAbbr } from "./bibleMetadata";

export const SupportedLocales = ["en-US", "zh-CN"] as const;

export type SupportedLocale = (typeof SupportedLocales)[number];

export type BookNameData = {
  abbr: BkAbbr;
  ref: string;
  full: string;
  long: string;
};

export type LocaleBookNames = Record<BkAbbr, BookNameData>;
