import { BkAbbr } from "../data/bibleMetadata";
import type { OutlineItem } from "../data/booksTypes";
import { replaceHtmlEntities } from "../utils/verses";
import { ProperVrefLinks } from "../components/ProperVrefLinks";
import { type TryGetBkAbbrFn } from "../data/useTryGetBkAbbr";

export const OutlinesBox: React.FC<{
  abbr: BkAbbr;
  ch: number;
  vn: string;
  outlines: OutlineItem[] | undefined;
  tryGetBkAbbr: TryGetBkAbbrFn;
}> = ({ abbr, ch, vn, outlines, tryGetBkAbbr }) => {
  return (
    <>
      {!!outlines?.length && (
        <div
          id={`v${vn}-Outlines`}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            backgroundColor: "#f7f7f7",
            padding: "4px 4px 6px",
            margin: "4px 0",
          }}
        >
          {outlines.map((outline, index) => {
            const key = index + 1;

            return (
              <div
                key={key}
                style={{
                  marginLeft: 20 * outline.lv - 10,
                  fontWeight: outline.lv === 1 ? 700 : 500,
                }}
              >
                {outline.parens ? "(" : null}
                {outline.pt ? <>{outline.pt} </> : null}
                <span dangerouslySetInnerHTML={{ __html: outline.text }} />
                {outline.vrefs ? (
                  <>
                    &nbsp;&nbsp;
                    <ProperVrefLinks
                      tryGetBkAbbr={tryGetBkAbbr}
                      text={replaceHtmlEntities(outline.vrefs)}
                      bkAbbr={abbr}
                      ch={ch}
                      vn={Number(vn)}
                    />
                  </>
                ) : null}
                {outline.parens ? ")" : null}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
