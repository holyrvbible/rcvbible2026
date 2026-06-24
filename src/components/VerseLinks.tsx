import { Stack } from "@mantine/core";
import {
  BkAbbrNum,
  BkChapterNumVerses,
  type BkAbbr,
} from "../data/bibleMetadata";
import { AnchorButton } from "./LinkButton";
import { Fragment, useMemo } from "react";
import { VrefTooltip } from "./VrefTooltip";
import { useLocation, useNavigate } from "react-router";
import { jumpToElement } from "../utils/scrollToElement";
import { useGlowOnce } from "../utils/useGlowOnce";
import { useStrings } from "../data/useStrings";

/** Number of verse numbers to put together in one nowrap group. */
const GROUP_SIZE = 5;

/**
 * If the last group have too few items, then put it together with the
 * previous group.
 */
const MIN_GROUP_SIZE = 2;

export const VerseLinks: React.FC<{ abbr: BkAbbr; ch: number }> = ({
  abbr,
  ch,
}) => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const glowOnce = useGlowOnce();
  const strings = useStrings();

  const vnGroups = useMemo(() => {
    const numVerses = BkChapterNumVerses[BkAbbrNum[abbr]][ch - 1] as
      | number
      | undefined;

    // When navigating to a new url, there is a lag in setting the new abbr &
    // ch, causing numVerses to become undefined.
    if (!numVerses) return;

    const groups = Array.from(
      {
        length: Math.floor(numVerses / GROUP_SIZE) + 1,
      },
      () => [],
    ) as number[][];

    for (let i = 0; i < numVerses; i++) {
      groups[Math.floor(i / GROUP_SIZE)].push(i + 1);
    }

    // Check last group to see if it has too few items.
    const g = groups[groups.length - 1];
    if (g.length < MIN_GROUP_SIZE) {
      const last = groups.pop() ?? [];
      g.push(...last);
    }

    return groups;
  }, [abbr, ch]);

  const pixel = <span style={{ display: "inline-block", width: 1 }}> </span>;

  return (
    <Stack gap={4} align="center">
      <b>{strings?.jumpToVerse}</b>
      <div style={{ textAlign: "center" }}>
        {vnGroups?.map((group, index) => (
          <Fragment key={group[0]}>
            {index > 0 && pixel}
            <span style={{ whiteSpace: "nowrap" }}>
              {group.map((vn, index2) => {
                const newHash = `v${String(vn)}`;

                return (
                  <Fragment key={vn}>
                    {index2 > 0 && pixel}
                    <VrefTooltip vref={{ abbr, ch, vn }} openDelay={800}>
                      <AnchorButton
                        href={`#${newHash}`}
                        style={{ display: "inline-block", minWidth: "30px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          if (hash.slice(1) === newHash) {
                            jumpToElement(newHash, glowOnce);
                          } else {
                            void navigate(`#${newHash}`);
                          }
                        }}
                      >
                        {vn}
                      </AnchorButton>
                    </VrefTooltip>
                  </Fragment>
                );
              })}
            </span>
          </Fragment>
        ))}
      </div>
    </Stack>
  );
};
