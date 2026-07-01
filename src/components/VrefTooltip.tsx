import { useMemo } from "react";
import { getVerseHtmlNoSups, type Vref } from "../utils/verses";
import { useLocale } from "../data/useLocale";
import { useBookData } from "../data/useBookData";
import { BkOneChapterOnly, type BkAbbr } from "../data/bibleMetadata";
import { type TooltipProps } from "@mantine/core";
import { useBookNames } from "../data/useBookNames";
import type { LocaleBookNames } from "../data/localeTypes";
import type { BookData } from "../data/booksTypes";
import { SmoothTooltip } from "./SmoothTooltip";

// The label is always provided by this component.
export type TooltipPropsNoLabel = Omit<TooltipProps, "label">;

export const VrefTooltip: React.FC<
  {
    vref: Vref;
  } & TooltipPropsNoLabel
> = ({ vref, ...tooltipProps }) => {
  // No way to show the verse without knowing which verse it is.
  // Notes/refs tooltips not supported yet.
  if (!vref.abbr || !vref.ch || !vref.vn || vref.sup) {
    return tooltipProps.children;
  }

  return (
    <VrefTooltip2
      abbr={vref.abbr}
      ch={vref.ch}
      vn={vref.vn}
      {...tooltipProps}
    />
  );
};

const VrefTooltip2: React.FC<
  {
    abbr: BkAbbr;
    ch: number;
    vn: number;
  } & TooltipPropsNoLabel
> = ({ abbr, ch, vn, ...tooltipProps }) => {
  const locale = useLocale();
  const bookNames = useBookNames(locale);
  const bookData = useBookData(locale, abbr);

  if (!bookNames || !bookData) {
    return tooltipProps.children;
  }

  return (
    <VrefTooltip3
      abbr={abbr}
      ch={ch}
      vn={vn}
      bookNames={bookNames}
      bookData={bookData}
      {...tooltipProps}
    />
  );
};

const VrefTooltip3: React.FC<
  {
    abbr: BkAbbr;
    ch: number;
    vn: number;
    bookNames: LocaleBookNames;
    bookData: BookData;
  } & TooltipPropsNoLabel
> = ({ abbr, ch, vn, bookNames, bookData, ...tooltipProps }) => {
  const verseText = useMemo(() => {
    const chVn = `${String(ch)}:${String(vn)}`;
    const text = bookData.verses[chVn] as string | undefined;
    if (!text) {
      console.error(`Missing verse text ${abbr}${chVn}`);
      return null;
    }
    return getVerseHtmlNoSups(text);
  }, [abbr, bookData.verses, ch, vn]);

  if (!verseText) {
    return tooltipProps.children;
  }

  return (
    <SmoothTooltip
      label={
        <>
          <b>
            {bookNames[abbr].ref}{" "}
            {BkOneChapterOnly.has(abbr) ? "" : String(ch) + ":"}
            {vn}
          </b>{" "}
          <span dangerouslySetInnerHTML={{ __html: verseText }} />
        </>
      }
      multiline
      maw={375}
      ta="center"
      {...tooltipProps}
    />
  );
};
