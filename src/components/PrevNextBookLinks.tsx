import { useMemo, type ReactNode } from "react";
import { BkAbbrNum, BkAbbr } from "../data/bibleMetadata";
import { LinkButton } from "./LinkButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const PREV_NEXT_BUTTON_SIZE = 26;
const ICON_SIZE = 20;

export const PrevNextBookLinks: React.FC<{
  abbr: BkAbbr;
  size?: number;
  children?: ReactNode;
}> = ({ abbr, size = PREV_NEXT_BUTTON_SIZE, children }) => {
  const { prevAbbr, nextAbbr } = useMemo(() => {
    const bkNum = BkAbbrNum[abbr];
    const lastNum = BkAbbr.length - 1;

    if (bkNum === 0) {
      return { prevAbbr: BkAbbr[lastNum], nextAbbr: BkAbbr[1] };
    }
    if (bkNum === lastNum) {
      return { prevAbbr: BkAbbr[lastNum - 1], nextAbbr: BkAbbr[0] };
    }
    return { prevAbbr: BkAbbr[bkNum - 1], nextAbbr: BkAbbr[bkNum + 1] };
  }, [abbr]);

  const iconSize = (size * ICON_SIZE) / PREV_NEXT_BUTTON_SIZE;
  const xPadding = (size * 8) / PREV_NEXT_BUTTON_SIZE;

  return (
    <>
      <LinkButton
        to={`/${prevAbbr}`}
        style={{
          padding: `2px ${String(xPadding)}px`,
          border: "1px solid #ccc",
          borderRadius: "3px",
          height: size,
          paddingRight: xPadding,
        }}
      >
        <IconChevronLeft size={iconSize} />
        {prevAbbr}
      </LinkButton>

      {children}

      <LinkButton
        to={`/${nextAbbr}`}
        style={{
          padding: "2px",
          border: "1px solid #ccc",
          borderRadius: "3px",
          height: size,
          paddingLeft: xPadding,
        }}
      >
        {nextAbbr}
        <IconChevronRight size={20} />
      </LinkButton>
    </>
  );
};
