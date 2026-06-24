import {
  BkAbbr,
  BkAbbrNum,
  BkNumChapters,
  BkOneChapterOnly,
  isValidBkAbbr,
} from "../data/bibleMetadata";
import type { TryGetBkAbbrFn } from "../data/useTryGetBkAbbr";

export const VERSE_SPLIT_SEPARATOR = '<br class="split">';

export interface Vref {
  // Book abbreviation.
  abbr?: BkAbbr | null;

  // Chapter number.
  ch?: number | null;

  // Verse number.
  vn?: number | null;

  // Title.
  title?: 1;

  // Notes and cross references.
  sup?: string | number | null;
}

/** Result of parsing a raw string into a list of vref anchors. */
export type VrefLinks = ({ vref: Vref; display: string } | string)[];

export function parseVref(vref: string): Vref {
  let s = vref;

  let abbr: BkAbbr | null = null;
  if (s.length >= 3) {
    const maybeAbbr = s.slice(0, 3);
    if (isValidBkAbbr(maybeAbbr)) {
      abbr = maybeAbbr;
      s = s.slice(3);
    }
  }

  let sup: string | null = null;
  if (s.includes("^")) {
    const [prefix, supStr] = s.split(":");
    sup = supStr;
    s = prefix;
  }

  let ch: number | null = null;
  let vn: number | null = null;
  if (s.includes(":")) {
    const [chStr, vnStr] = s.split(":");
    ch = Number(chStr);
    vn = Number(vnStr);
  } else if (s.length > 0) {
    ch = Number(s);
  }

  return { abbr, ch, vn, sup: sup };
}

export function getVerseHtmlNoSups(
  verse: string,
  partAorB?: "a" | "b",
): string {
  const text = verse.replace(/\[[^\]]+\]/g, "");

  if (partAorB) {
    const parts = text.split(VERSE_SPLIT_SEPARATOR);
    if (partAorB === "a") {
      return parts[0];
    } else {
      return parts[1];
    }
  }

  return text.replaceAll(VERSE_SPLIT_SEPARATOR, "");
}

export function stripHtmlTags(raw: string): string {
  return raw.replace(/<[^>]+>/g, " "); // replace with space to be safe
}

export function replaceHtmlEntities(raw: string): string {
  // Only need to include the entities which actually appear in the verses.
  let s = raw.replace(/&mdash;/g, "—");
  s = s.replace(/&ndash;/g, "–");
  s = s.replace(/&rsquo;/g, "’");
  s = s.replace(/&hellip;/g, "…");
  s = s.replace(/&ldquo;/g, "“");
  s = s.replace(/&rdquo;/g, "”");
  s = s.replace(/&nbsp;/g, " ");
  return s;
}

export function getVerseRawText(verse: string, partAorB?: "a" | "b") {
  const noSups = getVerseHtmlNoSups(verse, partAorB);
  const noTags = stripHtmlTags(noSups);
  return replaceHtmlEntities(noTags);
}

/**
 * Transform '{Gen1:1|Gen. 1:1}' to '<a href="...Gen1:1">Gen. 1.1</a>'.
 * Allows for other text to pass through without changes.
 */
export function parseCodedVrefs(text: string) {
  const a: VrefLinks = [];
  let s = text;

  while (s) {
    const openBrace = s.indexOf("{");
    const closeBrace = s.indexOf("}");

    if (openBrace < 0) {
      if (closeBrace >= 0) {
        throw new Error(`Stray close brace in ${text}`);
      }
      a.push(s);
      break;
    }

    if (closeBrace < 0) {
      throw new Error(`Open brace not closed in ${text}`);
    }

    if (closeBrace < openBrace) {
      throw new Error(`Close brace before open brace in ${text}`);
    }

    if (openBrace > 0) {
      a.push(s.slice(0, openBrace));
    }

    const insideBraces = s.slice(openBrace + 1, closeBrace);
    s = s.slice(closeBrace + 1);

    const b = insideBraces.split("|");
    if (b.length !== 2) {
      throw new Error(`Bad coded vref '${insideBraces}' in ${text}`);
    }

    const [vrefStr, display] = b;

    const vref = parseVref(vrefStr);

    a.push({ vref, display });
  }

  return a;
}

/**
 * Parse proper verse ref raw strings into hyperlinks.
 * This conversion is from raw text, hence is more complex.
 */
export function parseProperVrefs(
  tryGetBkAbbr: TryGetBkAbbrFn,
  verseRefs: string,
  bkAbbr: BkAbbr,
  chapterNumber?: number | null,
  verseNumber?: number | null,
): VrefLinks {
  const result: VrefLinks = [];
  let remaining = verseRefs;
  let chStr = String(chapterNumber);
  let vnStr = String(verseNumber);
  let forceChapter = false;

  while (remaining) {
    let match = /^((\d( |(&nbsp;)))?[A-Z][a-z]+\.?) (\d+):(\d+)[ab]?/.exec(
      remaining,
    );
    if (match) {
      remaining = remaining.slice(match[0].length);
      const bkName = match[1];
      chStr = match[5];
      vnStr = match[6];

      const abbr = tryGetBkAbbr(bkName);
      if (abbr) {
        forceChapter = false;
        bkAbbr = abbr;
        result.push({
          vref: { abbr, ch: Number(chStr), vn: Number(vnStr) },
          display: match[0],
        });
      } else {
        result.push(bkName + " ");
        result.push({
          vref: { abbr: bkAbbr, ch: Number(chStr), vn: Number(vnStr) },
          display: `${chStr}:${vnStr}`,
        });
      }
      continue;
    }

    match = /^((\d( |(&nbsp;)))?[A-Z][a-z]+\.?) (\d+)/.exec(remaining);
    if (match) {
      remaining = remaining.slice(match[0].length);
      const bkName = match[1];
      chStr = match[5];

      const abbr = tryGetBkAbbr(bkName);
      if (abbr) {
        forceChapter = false;
        bkAbbr = abbr;
        if (BkOneChapterOnly.has(bkAbbr)) {
          result.push({
            vref: { abbr: bkAbbr, ch: 1, vn: Number(chStr) },
            display: match[0],
          });
        } else {
          result.push({
            vref: { abbr: bkAbbr, ch: Number(chStr) },
            display: match[0],
          });
        }
      } else {
        result.push(bkName + " ");
        result.push({
          vref: { abbr: bkAbbr, ch: Number(chStr) },
          display: chStr,
        });
      }
      continue;
    }

    match = /^(\d+):(\d+)[ab]?/.exec(remaining);
    if (match) {
      forceChapter = false;
      remaining = remaining.slice(match[0].length);
      chStr = match[1];
      vnStr = match[2];
      result.push({
        vref: { abbr: bkAbbr, ch: Number(chStr), vn: Number(vnStr) },
        display: match[0],
      });
      continue;
    }

    match = /^(\d+) title/.exec(remaining);
    if (match) {
      forceChapter = false;
      remaining = remaining.slice(match[0].length);
      chStr = match[1];
      result.push({
        vref: { abbr: bkAbbr, ch: Number(chStr), title: 1 },
        display: match[0],
      });
      continue;
    }

    match = /^(\d+)[ab]/.exec(remaining);
    if (match) {
      forceChapter = false;
      remaining = remaining.slice(match[0].length);
      vnStr = match[1];
      if (BkOneChapterOnly.has(bkAbbr)) {
        result.push({
          vref: { abbr: bkAbbr, ch: 1, vn: Number(vnStr) },
          display: match[0],
        });
      } else {
        result.push({
          vref: { abbr: bkAbbr, ch: Number(chStr), vn: Number(vnStr) },
          display: match[0],
        });
      }
      continue;
    }

    match = /^(\d+)/.exec(remaining);
    if (match) {
      remaining = remaining.slice(match[0].length);
      if (forceChapter) {
        chStr = match[1];
        if (BkOneChapterOnly.has(bkAbbr)) {
          result.push({
            vref: { abbr: bkAbbr, ch: 1, vn: Number(chStr) },
            display: match[0],
          });
        } else {
          result.push({
            vref: { abbr: bkAbbr, ch: Number(chStr) },
            display: match[0],
          });
        }
        forceChapter = false;
      } else {
        vnStr = match[1];
        if (BkOneChapterOnly.has(bkAbbr)) {
          result.push({
            vref: { abbr: bkAbbr, ch: 1, vn: Number(vnStr) },
            display: match[0],
          });
        } else {
          result.push({
            vref: { abbr: bkAbbr, ch: Number(chStr), vn: Number(vnStr) },
            display: match[0],
          });
        }
      }
      continue;
    }

    // HTML entity.
    match = /^&[a-zA-Z]+;/.exec(remaining);
    if (match) {
      remaining = remaining.slice(match[0].length);
      result.push(match[0]);
      if (match[0] === "&ndash;" || match[0] === "&mdash;") {
        forceChapter = true;
      }
      continue;
    }

    match = /^and note (\d+)/.exec(remaining);
    if (match) {
      remaining = remaining.slice(match[0].length);
      const note = match[1];
      result.push("and ");
      result.push({
        vref: { abbr: bkAbbr, ch: Number(chStr), vn: Number(vnStr), sup: note },
        display: "note " + note,
      });
      continue;
    }

    if (remaining.startsWith(";") || remaining.startsWith("–")) {
      forceChapter = true;
    }

    result.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return result;
}

export type VtextWithSups = ({ sup: string; word: string } | string)[];

export function parseVerseText(text: string): VtextWithSups {
  let remaining = text;
  const a: VtextWithSups = [];

  while (remaining) {
    const match = /\[([^\]]+)\]([^\s.,;&<。，；-]*)/.exec(remaining);
    if (!match) {
      a.push(remaining);
      return a;
    }

    const index = remaining.indexOf(match[0]);
    if (index >= 0) {
      if (index > 0) {
        a.push(remaining.slice(0, index));
      }
      remaining = remaining.slice(index + match[0].length);
    } else {
      remaining = remaining.slice(match[0].length);
    }

    a.push({ sup: match[1], word: match[2] });
  }

  return a;
}

export function chColon(abbr: BkAbbr, ch: number) {
  return ch === 1 && BkNumChapters[BkAbbrNum[abbr]] === 1 ? null : `${String(ch)}:`;
}
