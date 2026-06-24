import clsx from "clsx";
import { BkOneChapterOnly, type BkAbbr } from "../data/bibleMetadata";
import type { NotesRefsItem } from "../data/booksTypes";
import type { VtextWithSups } from "../utils/verses";
import { OptionalTooltip } from "./OptionalTooltip";
import styles from "./VtextLine.module.css";
import { LinkButton } from "./LinkButton";
import { Collapse } from "@mantine/core";
import { useStrings } from "../data/useStrings";

export const VtextLine: React.FC<{
  abbr: BkAbbr;
  bkRef: string;
  ch: number;
  vn: string;
  partAOrB: "a" | "b" | undefined;
  notesRefsItems?: NotesRefsItem[];
  vtextWithSups: VtextWithSups;
  showBilingual: boolean;
  bilingualVtext: string;
  clickEffect?: "Show" | "Hide";
  onVrefClick: () => void;
  onVtextSupClick: (sup: string) => void;
}> = ({
  abbr,
  bkRef,
  ch,
  vn,
  partAOrB,
  notesRefsItems,
  vtextWithSups,
  showBilingual,
  bilingualVtext,
  clickEffect,
  onVrefClick,
  onVtextSupClick,
}) => {
  const strings = useStrings();
  const clickable = !!notesRefsItems?.length;
  const clickLabel =
    clickable && clickEffect
      ? clickEffect === "Show"
        ? strings?.showNotes
        : strings?.hideNotes
      : null;

  const content = (
    <>
      <OptionalTooltip label={clickLabel}>
        <span
          className={clsx(styles.vref, clickable && styles.clickable)}
          tabIndex={0}
          onClick={onVrefClick}
        >
          {bkRef}{" "}
          {BkOneChapterOnly.has(abbr) ? (
            <>{vn}</>
          ) : (
            <>
              {ch}:{vn}
              {partAOrB ? (
                <span style={{ color: "#494" }}>{partAOrB}</span>
              ) : null}
            </>
          )}
        </span>
      </OptionalTooltip>
      {vtextWithSups.map((v, index) => {
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
              onVtextSupClick(sup);
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
      <Collapse expanded={showBilingual}>
        <div
          style={{ color: "#050", textIndent: -10, marginLeft: 20 }}
          dangerouslySetInnerHTML={{
            __html: bilingualVtext
              .replaceAll("[", "<sup>")
              .replaceAll("]", "</sup>"),
          }}
        ></div>
      </Collapse>
    </>
  );

  if (!partAOrB) {
    return <div id={`v${vn}`}>{content}</div>;
  }

  if (partAOrB === "a") {
    return (
      <div id={`v${vn}`}>
        <div id={`v${vn}a`}>{content}</div>
      </div>
    );
  }

  return <div id={`v${vn}b`}>{content}</div>;
};
