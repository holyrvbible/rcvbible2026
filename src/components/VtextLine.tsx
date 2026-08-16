import clsx from "clsx";
import { BkOneChapterOnly, type BkAbbr } from "../data/bibleMetadata";
import type { NotesRefsItem } from "../data/booksTypes";
import type { VtextWithSups } from "../utils/verses";
import { OptionalTooltip } from "./OptionalTooltip";
import styles from "./VtextLine.module.css";
import { LinkButton } from "./LinkButton";
import { ActionIcon, Collapse } from "@mantine/core";
import { useStrings } from "../data/useStrings";
import {
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import { useState, type HTMLAttributes } from "react";

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
  hideSups: boolean;
  clickEffect?: "Show" | "Hide";
  onVrefClick: () => void;
  onVtextSupClick: (sup: string) => void;
  isSpeaking: boolean;
  onReadAloud: () => void;
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
  hideSups,
  clickEffect,
  onVrefClick,
  onVtextSupClick,
  isSpeaking,
  onReadAloud,
}) => {
  const strings = useStrings();
  const clickable = !!notesRefsItems?.length;
  const clickLabel =
    clickable && clickEffect
      ? clickEffect === "Show"
        ? strings?.showNotes
        : strings?.hideNotes
      : null;

  // Play button is hidden by default.
  const [showPlayButton, setShowPlayButton] = useState(false);

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

        if (hideSups) {
          return word;
        }

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
      {showPlayButton && (
        <ActionIcon
          ml={8}
          bdrs={5}
          variant="outline"
          size="sm"
          onTouchStart={(e) => {
            // Make sure the button doesn't disappear in mobile when clicked.
            e.stopPropagation();
          }}
          onClick={onReadAloud}
        >
          {isSpeaking ? (
            <IconPlayerStopFilled size={16} />
          ) : (
            <IconPlayerPlayFilled size={16} />
          )}
        </ActionIcon>
      )}
      <Collapse expanded={showBilingual}>
        <div
          style={{ color: "#050", textIndent: -10, marginLeft: 20 }}
          dangerouslySetInnerHTML={{
            __html: hideSups
              ? bilingualVtext.replace(/\[[^]]+\]/g, "")
              : bilingualVtext
                  .replaceAll("[", "<sup>")
                  .replaceAll("]", "</sup>"),
          }}
        ></div>
      </Collapse>
    </>
  );

  const eventHandlers: HTMLAttributes<HTMLDivElement> = {
    // Mobile: Toggle show on any touch.
    onTouchStart: () => {
      setShowPlayButton((v) => !v);
    },
    // Desktop: Show on mouse hover.
    // In mobile, these events might get triggered on touch, causing the play
    // button to flicker on click. Using `hasFinePointer()` fixes this problem.
    onMouseEnter: () => {
      if (hasFinePointer()) {
        setShowPlayButton(true);
      }
    },
    onMouseLeave: () => {
      if (hasFinePointer()) {
        setShowPlayButton(false);
      }
    },
  };

  if (!partAOrB) {
    return (
      <div id={`v${vn}`} {...eventHandlers}>
        {content}
      </div>
    );
  }

  if (partAOrB === "a") {
    return (
      <div id={`v${vn}`} {...eventHandlers}>
        <div id={`v${vn}a`}>{content}</div>
      </div>
    );
  }

  return (
    <div id={`v${vn}b`} {...eventHandlers}>
      {content}
    </div>
  );
};

// Check if the primary pointing device is fine (mouse/stylus).
function hasFinePointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}
