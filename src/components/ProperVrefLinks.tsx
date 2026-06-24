import { useMemo } from "react";
import { parseProperVrefs } from "../utils/verses";
import type { BkAbbr } from "../data/bibleMetadata";
import { VrefLinks } from "./VrefLinks";
import type { TryGetBkAbbrFn } from "../data/useTryGetBkAbbr";

/**
 * Transform proper raw strings into vref link anchors.
 */
export const ProperVrefLinks: React.FC<{
  tryGetBkAbbr: TryGetBkAbbrFn;
  text: string;
  bkAbbr: BkAbbr;
  ch?: number | null;
  vn?: number | null;
}> = ({ tryGetBkAbbr, text, bkAbbr, ch, vn }) => {
  const vrefLinks = useMemo(() => {
    return parseProperVrefs(tryGetBkAbbr, text, bkAbbr, ch, vn);
  }, [bkAbbr, ch, text, tryGetBkAbbr, vn]);

  return <VrefLinks vrefLinks={vrefLinks} defaultAbbr={bkAbbr} />;
};
