import { useCallback, useMemo, type SetStateAction } from "react";
import type { BkAbbr } from "../data/bibleMetadata";
import type { BookData, ChTitleNoteItem } from "../data/booksTypes";
import { parseVerseText } from "../utils/verses";
import { LinkButton } from "./LinkButton";
import { NotesRefsBlock } from "./NotesRefsBlock";
import { type TryGetBkAbbrFn } from "../data/useTryGetBkAbbr";
import { supId } from "../utils/links";
import { useStrings } from "../data/useStrings";

export const ChapterTitle: React.FC<{
  abbr: BkAbbr;
  bkRef: string;
  ch: number;
  bookData: BookData;
  tryGetBkAbbr: TryGetBkAbbrFn;
  showAllNotes: boolean;
  showNotesRefs: Set<string>;
  setShowNotesRefs: (value: SetStateAction<Set<string>>) => void;
}> = ({
  abbr,
  bkRef,
  ch,
  bookData,
  tryGetBkAbbr,
  showAllNotes,
  showNotesRefs,
  setShowNotesRefs,
}) => {
  const strings = useStrings();
  const chTitleWithSups = useMemo(() => {
    const s = bookData.chTitle?.[String(ch)];
    if (!s) return null;

    return parseVerseText(s);
  }, [bookData.chTitle, ch]);

  const notesRefsItems = bookData.chTitleNote?.[String(ch)];

  const onLabelClick = useCallback(() => {
    if (!notesRefsItems?.length) return;

    setShowNotesRefs((old) => {
      const newState = new Set(old);

      // If any is hidden, open all. Else close all.
      const anyHidden = hasAnyHidden("Title", notesRefsItems, newState);

      for (const item of notesRefsItems) {
        const id = supId("Title", item.sup);
        if (anyHidden) {
          newState.add(id);
        } else {
          newState.delete(id);
        }
      }

      return newState;
    });
  }, [notesRefsItems, setShowNotesRefs]);

  const onSupClick = useCallback(
    (sup: string) => {
      const id = supId("Title", sup);
      setShowNotesRefs((old) => {
        const newState = new Set(old);
        const wasShown = newState.has(id);
        if (wasShown) {
          newState.delete(id);
        } else {
          newState.add(id);
        }
        return newState;
      });
    },
    [setShowNotesRefs],
  );

  if (!chTitleWithSups) {
    return null;
  }

  return (
    <>
      <div
        id="chTitle"
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          backgroundColor: "#f7f7f7",
          padding: "16px 12px 20px",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        <LinkButton
          to=""
          onClick={onLabelClick}
          style={{ display: "inline-block", color: "#77f", fontWeight: 600 }}
        >
          {strings?.titleLabel}
        </LinkButton>
        {chTitleWithSups.map((v, index) => {
          const key = index + 1;

          if (typeof v === "string") {
            return <span key={key} dangerouslySetInnerHTML={{ __html: v }} />;
          }

          const { sup, word } = v;
          return (
            <LinkButton
              key={key}
              to=""
              onClick={(e) => {
                e.preventDefault();
                onSupClick(sup);
              }}
              style={{
                display: "inline-block",
                padding: "0 4px",
                margin: "0 -4px",
              }}
            >
              <sup>{sup}</sup>
              <span style={{ color: "#55f" }}>{word}</span>
            </LinkButton>
          );
        })}
      </div>

      <NotesRefsBlock
        abbr={abbr}
        bkRef={bkRef}
        ch={ch}
        vn="Title"
        notesRefsItems={notesRefsItems}
        tryGetBkAbbr={tryGetBkAbbr}
        showAllNotes={showAllNotes}
        showNotesRefs={showNotesRefs}
        setShowNotesRefs={setShowNotesRefs}
      />
    </>
  );
};

function hasAnyHidden(
  vn: string,
  notesRefsItems: ChTitleNoteItem[] | undefined,
  showNotesRefs: Set<string>,
) {
  if (!notesRefsItems?.length) return false;

  // If any is hidden, open all. Else close all.
  for (const item of notesRefsItems) {
    const id = supId(vn, item.sup);
    if (!showNotesRefs.has(id)) {
      return true;
    }
  }

  return false;
}
