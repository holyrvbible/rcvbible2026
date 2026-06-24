import { useMemo } from "react";
import { parseCodedVrefs } from "../utils/verses";
import type { BkAbbr } from "../data/bibleMetadata";
import { VrefLinks } from "./VrefLinks";

/**
 * Transform '{Gen1:1|Gen. 1:1}' to '<a href="...Gen1:1">Gen. 1.1</a>'.
 * Allows for other text to pass through without changes.
 */
export const CodedVrefLinks: React.FC<{
  text: string;
  defaultAbbr?: BkAbbr;
}> = ({ text, defaultAbbr }) => {
  const vrefLinks = useMemo(() => {
    return parseCodedVrefs(text);
  }, [text]);

  return <VrefLinks vrefLinks={vrefLinks} defaultAbbr={defaultAbbr} />;
};
