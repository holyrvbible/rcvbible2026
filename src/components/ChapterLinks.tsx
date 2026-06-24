import { BkAbbr, BkAbbrNum, BkNumChapters } from "../data/bibleMetadata";
import { Collapse, Group, Tooltip } from "@mantine/core";
import { LinkButton } from "./LinkButton";
import { Fragment } from "react/jsx-runtime";
import styles from "./ChapterLinks.module.css";
import type { ReactNode } from "react";

const BUTTON_WIDTH = 40;

export const ChapterLinksToggle: React.FC<{
  ch?: number;
  onToggle: () => void;
  children?: ReactNode;
}> = ({ ch, onToggle, children }) => {
  return (
    <Tooltip label="Toggle chapter links" position="bottom">
      <LinkButton
        className={styles.toggle}
        to=""
        onClick={onToggle}
        style={{
          gap: "6px",
          width: "140px",
          fontStyle: "italic",
          fontFamily: "serif",
          color: "#33f",
        }}
      >
        {children ?? (ch ? <>Chapter {ch}</> : <>Chapters</>)}
      </LinkButton>
    </Tooltip>
  );
};

export const ChapterLinksPopup: React.FC<{
  opened: boolean;
  abbr: BkAbbr;
  current?: number;
}> = ({ opened, abbr, current }) => {
  return (
    <Collapse expanded={opened}>
      <Group gap={6} fz="90%" justify="center">
        {Array.from({ length: BkNumChapters[BkAbbrNum[abbr]] }).map(
          (_, index) => {
            const ch = index + 1;
            return (
              <Fragment key={ch}>
                {current === ch ? (
                  <Group
                    justify="center"
                    style={{
                      width: BUTTON_WIDTH,
                      backgroundColor: "#f4f4f4",
                      border: "1px solid #55f",
                      borderRadius: "6px",
                      fontWeight: 700,
                    }}
                  >
                    {ch}
                  </Group>
                ) : (
                  <LinkButton
                    to={`/${abbr}/${String(ch)}`}
                    variant="green"
                    style={{
                      width: BUTTON_WIDTH,
                      fontWeight: 600,
                    }}
                  >
                    {ch}
                  </LinkButton>
                )}
              </Fragment>
            );
          },
        )}
      </Group>
    </Collapse>
  );
};
