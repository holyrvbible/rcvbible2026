import { Space } from "@mantine/core";
import { type BkAbbr } from "../data/bibleMetadata";
import type { BookData } from "../data/booksTypes";
import type { LocaleBookNames } from "../data/localeTypes";
import { ProperVrefLinks } from "./ProperVrefLinks";
import type { TryGetBkAbbrFn } from "../data/useTryGetBkAbbr";
import { parseVref, replaceHtmlEntities } from "../utils/verses";

const BookOutline: React.FC<{
  abbr: BkAbbr;
  bookNames: LocaleBookNames;
  bookData: BookData;
  tryGetBkAbbr: TryGetBkAbbrFn;
}> = ({ abbr, bookNames, bookData, tryGetBkAbbr }) => {
  return (
    <>
      <div style={{ textAlign: "center", fontSize: "110%" }}>
        <b>Outline of {bookNames[abbr].full}</b>
      </div>

      <Space h={10} />

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f7f7f7",
          padding: "10px 4px 10px",
        }}
      >
        {Object.entries(bookData.outlines).map(([vref, outlines], index) => {
          const key = abbr + String(index + 1);
          const parsedVref = parseVref(vref);

          return (
            <div key={key}>
              {outlines
                // TEXT types should not show up in the outline.
                .filter((o) => o.type !== "TEXT")
                .map((outline, index2) => {
                  const key = index2 + 1;
                  return (
                    <div
                      key={key}
                      style={{
                        marginLeft: 15 * outline.lv,
                        fontWeight: outline.lv === 1 ? 700 : undefined,
                        marginTop:
                          index > 0 && outline.lv === 1 ? 20 : undefined,
                      }}
                    >
                      {outline.parens ? "(" : null}
                      {outline.pt ? <>{outline.pt} </> : null}
                      <span
                        dangerouslySetInnerHTML={{ __html: outline.text }}
                      />

                      {outline.vrefs ? (
                        <>
                          &nbsp;&nbsp;&mdash;&nbsp;&nbsp;
                          <ProperVrefLinks
                            tryGetBkAbbr={tryGetBkAbbr}
                            text={replaceHtmlEntities(outline.vrefs)}
                            bkAbbr={abbr}
                            ch={parsedVref.ch}
                            vn={parsedVref.vn}
                          />
                        </>
                      ) : null}
                      {outline.parens ? ")" : null}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BookOutline;
