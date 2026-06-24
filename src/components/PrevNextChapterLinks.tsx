import { type ReactNode } from "react";
import { BkAbbr } from "../data/bibleMetadata";
import { LinkButton } from "./LinkButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
  getNextChapterOrOverview,
  getPrevChapterOrOverview,
  vLink,
} from "../utils/links";

export const PrevNextChapterLinks: React.FC<{
  abbr: BkAbbr;
  ch?: number;
  size?: number;
  children?: ReactNode;
}> = ({ abbr, ch, size = 16, children }) => {
  return (
    <>
      <LinkButton
        to={vLink(getPrevChapterOrOverview(abbr, ch))}
        style={{
          padding: `2px`,
          border: "1px solid #ccc",
          borderRadius: "3px",
        }}
      >
        <IconChevronLeft size={size} style={{ height: size }} />
      </LinkButton>

      {children}

      <LinkButton
        to={vLink(getNextChapterOrOverview(abbr, ch))}
        style={{
          padding: "2px",
          border: "1px solid #ccc",
          borderRadius: "3px",
        }}
      >
        <IconChevronRight size={size} style={{ height: size }} />
      </LinkButton>
    </>
  );
};
