import {
  BkAbbrNum,
  BkChapterNumVerses,
  BkNumChapters,
  type BkAbbr,
} from "../data/bibleMetadata";
import type { SupportedLocale } from "../data/localeTypes";
import { importBookData } from "../data/useBookData";
import type { TryGetBkAbbrFn } from "../data/useTryGetBkAbbr";
import { getVerseRawText } from "../utils/verses";
import type { SearchHit } from "./searchTypes";

export interface VerseRef {
  abbr: BkAbbr;
  ch1: number;
  vn1: number;
  ch2: number;
  vn2: number;
}

export interface UnknownVref {
  unknownSegment: string;
}

export type ParsedRawVref = VerseRef | UnknownVref;

/**
 * Parse one or more Bible verse references from a free-text string.
 */
function parseUserInputVrefs(
  input: string,
  tryGetBkAbbr: TryGetBkAbbrFn,
): ParsedRawVref[] {
  const results: ParsedRawVref[] = [];

  // Split on semicolons or commas, trim each segment.
  const segments = input
    .split(/[;,；，、\n\r]/)
    .map((s) => s.trim())
    .filter(Boolean);

  let lastAbbr: BkAbbr | null = null;

  for (const segment of segments) {
    const ref = parseSegment(segment, tryGetBkAbbr, lastAbbr);
    results.push(ref);

    if ("abbr" in ref) {
      lastAbbr = ref.abbr;
    }
  }

  return results;
}

// Match parts but don't validate for now.
function splitSegment(
  segment: string,
  tryGetBkAbbr: TryGetBkAbbrFn,
  lastAbbr: BkAbbr | null,
): ParsedRawVref {
  function parseName(bkAnyName: string): BkAbbr | null {
    const trimmed = bkAnyName.trim();
    if (!trimmed) return lastAbbr;
    return tryGetBkAbbr(trimmed) ?? lastAbbr;
  }

  // Full vref range.
  // The book name can be in any language, so match any string prefix.
  let match = /^(.*?)(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*:\s*(\d+)\s*$/.exec(
    segment,
  );
  if (match) {
    const [, bkName, ch1Str, vn1Str, ch2Str, vn2Str] = match;
    const abbr = parseName(bkName);
    if (!abbr) {
      return { unknownSegment: `${segment}: Unknown book '${bkName.trim()}'` };
    }

    return {
      abbr,
      ch1: parseInt(ch1Str, 10),
      vn1: parseInt(vn1Str, 10),
      ch2: parseInt(ch2Str, 10),
      vn2: parseInt(vn2Str, 10),
    };
  }

  match = /^(.*?)(\d+)\s*:\s*(\d+)\s*-\s*(\d+)\s*$/.exec(segment);
  if (match) {
    const [, bkName, ch1Str, vn1Str, vn2Str] = match;
    const abbr = parseName(bkName);
    if (!abbr) {
      return { unknownSegment: `${segment}: Unknown book '${bkName.trim()}'` };
    }
    const ch1 = parseInt(ch1Str, 10);

    return {
      abbr,
      ch1,
      vn1: parseInt(vn1Str, 10),
      ch2: ch1,
      vn2: parseInt(vn2Str, 10),
    };
  }

  match = /^(.*?)(\d+)\s*-\s*(\d+)\s*:\s*(\d+)\s*$/.exec(segment);
  if (match) {
    const [, bkName, ch1Str, ch2Str, vn2Str] = match;
    const abbr = parseName(bkName);
    if (!abbr) {
      return { unknownSegment: `${segment}: Unknown book '${bkName.trim()}'` };
    }

    const numChapters = BkNumChapters[BkAbbrNum[abbr]];
    const ch1Num = parseInt(ch1Str, 10);
    const [ch1, vn1] = numChapters > 1 ? [ch1Num, 1] : [1, ch1Num];

    return {
      abbr,
      ch1,
      vn1,
      ch2: parseInt(ch2Str, 10),
      vn2: parseInt(vn2Str, 10),
    };
  }

  match = /^(.*?)(\d+)\s*:\s*(\d+)\s*$/.exec(segment);
  if (match) {
    const [, bkName, ch1Str, vn1Str] = match;
    const abbr = parseName(bkName);
    if (!abbr) {
      return { unknownSegment: `${segment}: Unknown book '${bkName.trim()}'` };
    }

    const ch1 = parseInt(ch1Str, 10);
    const vn1 = parseInt(vn1Str, 10);

    return {
      abbr,
      ch1,
      vn1,
      ch2: ch1,
      vn2: vn1,
    };
  }

  match = /^(.*?)(\d+)\s*-\s*(\d+)\s*$/.exec(segment);
  if (match) {
    const [, bkName, ch1Str, ch2Str] = match;
    const abbr = parseName(bkName);
    if (!abbr) {
      return { unknownSegment: `${segment}: Unknown book '${bkName.trim()}'` };
    }
    const numChapters = BkNumChapters[BkAbbrNum[abbr]];
    const ch1Num = parseInt(ch1Str, 10);
    const [ch1, vn1] = numChapters > 1 ? [ch1Num, 1] : [1, ch1Num];
    const ch2Num = parseInt(ch2Str, 10);
    const ch2NumVerses = BkChapterNumVerses[BkAbbrNum[abbr]][ch2Num - 1];
    const [ch2, vn2] = numChapters > 1 ? [ch2Num, ch2NumVerses] : [1, ch2Num];

    return {
      abbr,
      ch1,
      vn1,
      ch2,
      vn2,
    };
  }

  match = /^(.*?)(\d+)\s*$/.exec(segment);
  if (match) {
    const [, bkName, ch1Str] = match;
    const abbr = parseName(bkName);
    if (!abbr) {
      return { unknownSegment: `${segment}: Unknown book '${bkName.trim()}'` };
    }
    const numChapters = BkNumChapters[BkAbbrNum[abbr]];
    const ch1Num = parseInt(ch1Str, 10);
    const [ch1, vn1] = numChapters > 1 ? [ch1Num, 1] : [1, ch1Num];
    const ch2NumVerses = BkChapterNumVerses[BkAbbrNum[abbr]][ch1Num - 1];
    const [ch2, vn2] = numChapters > 1 ? [ch1Num, ch2NumVerses] : [1, ch1Num];

    return {
      abbr,
      ch1,
      vn1,
      ch2,
      vn2,
    };
  }

  const abbr = parseName(segment);
  if (!abbr) {
    return { unknownSegment: `${segment}: Unknown book '${segment.trim()}'` };
  }

  const ch2 = BkNumChapters[BkAbbrNum[abbr]];
  const vn2 = BkChapterNumVerses[BkAbbrNum[abbr]][ch2 - 1];
  return { abbr, ch1: 1, vn1: 1, ch2, vn2 };
}

function validateParsed(segment: string, parsed: VerseRef) {
  const { abbr, ch1, vn1, ch2, vn2 } = parsed;

  const numChapters = BkNumChapters[BkAbbrNum[abbr]];

  if (ch1 < 1 || ch1 > numChapters) {
    return { unknownSegment: `${segment}: Bad chapter number ${String(ch1)}` };
  }

  const numVerses1 = BkChapterNumVerses[BkAbbrNum[abbr]][ch1 - 1];
  if (vn1 < 1 || vn1 > numVerses1) {
    return {
      unknownSegment: `${segment}: Bad verse number ${String(vn1)} in ${abbr} ${String(ch1)}`,
    };
  }

  if (ch2 < 1 || ch2 > numChapters) {
    return {
      unknownSegment: `${segment}: Bad chapter number ${String(ch2)}`,
    };
  }

  const numVerses2 = BkChapterNumVerses[BkAbbrNum[abbr]][ch2 - 1];
  if (vn2 < 1 || vn2 > numVerses2) {
    return {
      unknownSegment: `${segment}: Bad verse number ${String(vn2)} in ${abbr} ${String(ch2)}`,
    };
  }

  if (ch1 === ch2 && vn1 > vn2) {
    return {
      unknownSegment: `${segment}: Bad verse range ${String(ch1)}:${String(vn1)}-${String(vn2)}`,
    };
  }

  return parsed;
}

function parseSegment(
  segment: string,
  tryGetBkAbbr: TryGetBkAbbrFn,
  lastAbbr: BkAbbr | null,
): ParsedRawVref {
  const parsed = splitSegment(segment, tryGetBkAbbr, lastAbbr);
  if ("unknownSegment" in parsed) return parsed;

  return validateParsed(segment, parsed);
}

export async function searchByVrefs(
  input: string,
  locale: SupportedLocale,
  tryGetBkAbbr: TryGetBkAbbrFn,
  limit: number,
): Promise<SearchHit[] | null> {
  const parsed = parseUserInputVrefs(input, tryGetBkAbbr);
  if (!parsed.length) {
    return null;
  }

  console.log(
    `searchByVrefs: input='${input}', results=${JSON.stringify(parsed)}`,
  );

  // Get verse text.
  const hits: SearchHit[] = [];

  for (const p of parsed) {
    if ("unknownSegment" in p) {
      return null;
    }

    const { abbr, ch2, vn2 } = p;
    let { ch1, vn1 } = p;

    const bookData = await importBookData(locale, abbr);
    const bkNum = BkAbbrNum[abbr];

    for (;;) {
      const vref = `${String(ch1)}:${String(vn1)}`;
      const vext = bookData.data.verses[vref];
      if (!vext) throw new Error(`Missing vtext for ${abbr} ${vref}`);

      hits.push({
        // React keys must be unique. If the user specifies the same verses
        // twice, we show it twice instead of deduping results.
        id: `${abbr}${vref}#${String(hits.length)}`,
        abbr,
        ch: ch1,
        vn: vn1,
        text: getVerseRawText(vext),
      });

      if (hits.length >= limit) {
        break;
      }

      if (ch1 === ch2 && vn1 === vn2) {
        break;
      }

      if (++vn1 > BkChapterNumVerses[bkNum][ch1 - 1]) {
        ch1++;
        vn1 = 1;
      }
    }
  }

  return hits;
}
