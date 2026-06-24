import { BkAbbr, BkAbbrNum, BkNumChapters } from "../data/bibleMetadata";
import type { Vref } from "./verses";

export function linkTo(
  abbr: BkAbbr,
  ch?: number | null,
  vn?: number | null,
  refOrNote?: string | number | null,
): string {
  let href = `/${abbr}`;

  if (!ch) return href;

  href += `/${String(ch)}`;

  if (!vn) return href;

  href += `#v${String(vn)}`;

  if (!refOrNote) return href;

  href += `^${String(refOrNote)}`;

  return href;
}

export function vLink(
  { abbr, ch, vn, sup: nr }: Vref,
  defaultAbbr?: BkAbbr,
): string {
  return linkTo(abbr ?? defaultAbbr ?? "Gen", ch, vn, nr);
}

export function supId(vn: string | number, sup: string | number): string {
  return `${String(vn)}^${String(sup)}`;
}

/** For links within the same page only. */
export function supLink(vn: string | number, sup: string | number): string {
  return '#' + supId(vn, sup);
}

export function getPrevBook(abbr: BkAbbr): BkAbbr {
  const bkNum = BkAbbrNum[abbr];
  return BkAbbr[bkNum === 0 ? BkAbbr.length - 1 : bkNum - 1];
}

export function getNextBook(abbr: BkAbbr): BkAbbr {
  const bkNum = BkAbbrNum[abbr];
  return BkAbbr[bkNum === BkAbbr.length - 1 ? 0 : bkNum + 1];
}

export function getPrevChapter(
  abbr: BkAbbr,
  ch?: number,
): { abbr: BkAbbr; ch: number } {
  const bkNum = BkAbbrNum[abbr];

  if (!ch || ch === 1) {
    const prevBkNum = bkNum === 0 ? BkAbbr.length - 1 : bkNum - 1;
    return { abbr: BkAbbr[prevBkNum], ch: BkNumChapters[prevBkNum] };
  }

  return { abbr, ch: ch - 1 };
}

export function getNextChapter(
  abbr: BkAbbr,
  ch?: number,
): { abbr: BkAbbr; ch: number } {
  const bkNum = BkAbbrNum[abbr];
  const numChapters = BkNumChapters[bkNum];

  if (!ch || ch === numChapters) {
    const nextBkNum = bkNum === BkAbbr.length - 1 ? 0 : bkNum + 1;
    return { abbr: BkAbbr[nextBkNum], ch: 1 };
  }

  return { abbr, ch: ch + 1 };
}

/** ch=0 means the book overview page. */
export function getPrevChapterOrOverview(
  abbr: BkAbbr,
  ch?: number,
): { abbr: BkAbbr; ch: number } {
  const bkNum = BkAbbrNum[abbr];

  if (!ch) {
    const prevBkNum = bkNum === 0 ? BkAbbr.length - 1 : bkNum - 1;
    return { abbr: BkAbbr[prevBkNum], ch: BkNumChapters[prevBkNum] };
  }

  return { abbr, ch: ch - 1 };
}

/** ch=0 means the book overview page. */
export function getNextChapterOrOverview(
  abbr: BkAbbr,
  ch?: number,
): { abbr: BkAbbr; ch: number } {
  const bkNum = BkAbbrNum[abbr];
  const numChapters = BkNumChapters[bkNum];

  if (ch === numChapters) {
    const nextBkNum = bkNum === BkAbbr.length - 1 ? 0 : bkNum + 1;
    return { abbr: BkAbbr[nextBkNum], ch: 0 };
  }

  return { abbr, ch: (ch ?? 0) + 1 };
}
