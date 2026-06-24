import { useMemo, type ReactNode } from "react";
import type { Vref } from "../utils/verses";
import { vLink } from "../utils/links";
import type { BkAbbr } from "../data/bibleMetadata";
import { VrefTooltip } from "./VrefTooltip";

export const VrefLink: React.FC<{
  vref: Vref;
  defaultAbbr?: BkAbbr;
  children?: ReactNode;
}> = ({ vref, defaultAbbr, children }) => {
  const href = useMemo(() => vLink(vref, defaultAbbr), [defaultAbbr, vref]);

  return (
    <VrefTooltip vref={vref}>
      <a href={href} style={{ color: "#00f" }}>
        {children}
      </a>
    </VrefTooltip>
  );
};
