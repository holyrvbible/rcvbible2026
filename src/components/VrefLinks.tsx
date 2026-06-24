import type { BkAbbr } from "../data/bibleMetadata";
import type { VrefLinks as VrefLinksT } from "../utils/verses";
import { VrefLink } from "./VrefLink";

export const VrefLinks: React.FC<{
  vrefLinks: VrefLinksT;
  defaultAbbr?: BkAbbr;
}> = ({ vrefLinks, defaultAbbr }) => {
  return vrefLinks.map((g, index) => {
    const key = index + 1;

    if (typeof g === "string") {
      return g;
    }

    const { vref, display } = g;

    return (
      <VrefLink key={key} vref={vref} defaultAbbr={defaultAbbr}>
        <span dangerouslySetInnerHTML={{ __html: display }} />
      </VrefLink>
    );
  });
};
