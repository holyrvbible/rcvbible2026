import { Fragment } from "react/jsx-runtime";
import type { NotesRefsItem } from "../data/booksTypes";
import { supId } from "../utils/links";
import { Collapse, Space } from "@mantine/core";
import { chColon, replaceHtmlEntities } from "../utils/verses";
import { CodedVrefLinks } from "./CodedVrefLinks";
import { LinkButton } from "./LinkButton";
import { ProperVrefLinks } from "./ProperVrefLinks";
import type { TryGetBkAbbrFn } from "../data/useTryGetBkAbbr";
import type { SetStateAction } from "jotai";
import { type BkAbbr } from "../data/bibleMetadata";
import { SmoothTooltip } from "./SmoothTooltip";

export const NotesRefsBlock: React.FC<{
  abbr: BkAbbr;
  bkRef: string;
  ch: number;
  vn: string;
  notesRefsItems: NotesRefsItem[] | undefined;
  tryGetBkAbbr: TryGetBkAbbrFn;
  showAllNotes: boolean;
  showNotesRefs: Set<string>;
  setShowNotesRefs: (value: SetStateAction<Set<string>>) => void;
}> = ({
  abbr,
  bkRef,
  ch,
  vn,
  notesRefsItems,
  tryGetBkAbbr,
  showAllNotes,
  showNotesRefs,
  setShowNotesRefs,
}) => {
  const anyExpanded =
    showAllNotes ||
    !!notesRefsItems?.some(({ sup }) => {
      const id = supId(vn, sup);
      return showNotesRefs.has(id);
    });

  return (
    <div
      style={{
        border: anyExpanded ? "1px solid rgb(221, 221, 221)" : "none",
        borderRadius: 12,
        backgroundColor: "rgb(250, 255, 250)",
        color: "rgb(85, 85, 85)",
        padding: "2px 10px 6px",
        margin: anyExpanded ? "4px 0" : 0,
        fontSize: "95%",
      }}
    >
      {notesRefsItems?.map(({ sup, word, vrefs, lines }) => {
        const id = supId(vn, sup);

        // Make additional id jump targets for each sup character.
        // e.g. sup='2b', moreIds=['2', 'b']
        const supStr = String(sup);
        const moreIds = supStr.length >= 2 ? supStr.split("") : [];

        return (
          <Fragment key={sup}>
            <Collapse expanded={showAllNotes || showNotesRefs.has(id)}>
              <div id={id}>
                {moreIds.map((id) => (
                  <span key={id} id={id} />
                ))}
                <SmoothTooltip label="Hide this note">
                  <LinkButton
                    to=""
                    onClick={() => {
                      setShowNotesRefs((old) => {
                        const newState = new Set(old);
                        newState.delete(id);
                        return newState;
                      });
                    }}
                    style={{
                      color: "#77f",
                      display: "inline-block",
                      fontWeight: 700,
                    }}
                  >
                    {bkRef} {chColon(abbr, ch)}
                    {vn}
                    <sup>{sup}</sup>
                  </LinkButton>
                </SmoothTooltip>

                {word ? (
                  <b
                    style={{ color: "#44f" }}
                    dangerouslySetInnerHTML={{ __html: word }}
                  />
                ) : null}

                {vrefs ? (
                  <div
                    style={{
                      display: "inline-block",
                      opacity: 0.7,
                    }}
                  >
                    <Space w={8} display="inline-block" />
                    {vrefs.includes("{") ? (
                      <CodedVrefLinks text={replaceHtmlEntities(vrefs)} />
                    ) : (
                      <ProperVrefLinks
                        tryGetBkAbbr={tryGetBkAbbr}
                        text={vrefs}
                        bkAbbr={abbr}
                        ch={ch}
                        vn={Number(vn)}
                      />
                    )}
                  </div>
                ) : null}
              </div>

              {lines?.map((line, index) => {
                const key = index + 1;
                return (
                  <div key={key}>
                    <CodedVrefLinks text={replaceHtmlEntities(line)} />
                  </div>
                );
              })}
            </Collapse>
          </Fragment>
        );
      })}
    </div>
  );
};
