import { useLocation, useNavigate } from "react-router";
import { BkAbbr, BkAbbrNum, BkNumChapters } from "../data/bibleMetadata";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { PageSpinner } from "../components/PageSpinner";
import { useAltLocale, useLocale } from "../data/useLocale";
import { useStrings, type StringsResult } from "../data/useStrings";
import { useBookData } from "../data/useBookData";
import { useBookNames } from "../data/useBookNames";
import { VerseLinks } from "../components/VerseLinks";
import { Center, Checkbox, Collapse, Group, Space, Stack } from "@mantine/core";
import { BookTopBar } from "../components/BookTopBar";
import { FadeLine } from "../components/FadeLine";
import { useShowAllNotes } from "../utils/useShowAllNotes";
import type { BookData, NotesRefsItem, OutlineItem } from "../data/booksTypes";
import { LinkButton } from "../components/LinkButton";
import { jumpToElement, scrollToTop } from "../utils/scrollToElement";
import { useChapterLinksOpened } from "../components/chapterLinksAtom";
import {
  ChapterLinksPopup,
  ChapterLinksToggle,
} from "../components/ChapterLinks";
import { PrevNextChapterLinks } from "../components/PrevNextChapterLinks";
import { supId } from "../utils/links";
import {
  parseVerseText,
  VERSE_SPLIT_SEPARATOR,
  type VtextWithSups,
} from "../utils/verses";
import { useTryGetBkAbbr } from "../data/useTryGetBkAbbr";
import { VtextLine } from "../components/VtextLine";
import { ChapterTitle } from "../components/ChapterTitle";
import { NotesRefsBlock } from "../components/NotesRefsBlock";
import { OutlinesBox } from "../components/OutlinesBox";
import { useBilingual } from "../utils/useBilingual";
import type { LocaleBookNames } from "../data/localeTypes";
import { SmoothTooltip } from "../components/SmoothTooltip";
import { useHideSups } from "../utils/useHideSups";
import { useSetDocumentTitle } from "../utils/useSetDocumentTitle";
import { useRouteBkAbbr } from "../utils/useRouteBkAbbr";
import { useRouteNumParam } from "../utils/useRouteNumParam";
import { useGlowOnce } from "../utils/useGlowOnce";

const BookChapter: React.FC = () => {
  const abbr = useRouteBkAbbr();
  const chapter = useRouteNumParam("chapter");

  const navigate = useNavigate();

  useEffect(() => {
    if (!abbr) {
      void navigate(`/404`);
      return;
    }

    const numChapters = BkNumChapters[BkAbbrNum[abbr]];

    if (typeof chapter !== "number" || chapter < 1 || chapter > numChapters) {
      void navigate(`/404`);
    }
  }, [abbr, chapter, navigate]);

  if (!abbr || !chapter) {
    return <PageSpinner />;
  }

  return <ParamsValid abbr={abbr} ch={chapter} />;
};

const ParamsValid: React.FC<{ abbr: BkAbbr; ch: number }> = ({ abbr, ch }) => {
  const locale = useLocale();
  const bookNames = useBookNames(locale);
  const bookData = useBookData(locale, abbr);
  const strings = useStrings();

  const [showAllNotes, setShowAllNotes] = useShowAllNotes();
  const [showNotesRefs, setShowNotesRefs] = useState<Set<string>>(
    () => new Set(),
  );

  if (!bookNames || !bookData || !strings) {
    return <PageSpinner />;
  }

  return (
    <ReadyAndValid
      abbr={abbr}
      ch={ch}
      bookNames={bookNames}
      bookData={bookData}
      strings={strings}
      showAllNotes={showAllNotes}
      setShowAllNotes={setShowAllNotes}
      showNotesRefs={showNotesRefs}
      setShowNotesRefs={setShowNotesRefs}
    />
  );
};

const ReadyAndValid: React.FC<{
  abbr: BkAbbr;
  ch: number;
  bookNames: LocaleBookNames;
  bookData: BookData;
  strings: StringsResult;
  showAllNotes: boolean;
  setShowAllNotes: Dispatch<SetStateAction<boolean>>;
  showNotesRefs: Set<string>;
  setShowNotesRefs: Dispatch<SetStateAction<Set<string>>>;
}> = ({
  abbr,
  ch,
  bookNames,
  bookData,
  strings,
  showAllNotes,
  setShowAllNotes,
  showNotesRefs,
  setShowNotesRefs,
}) => {
  // altLocale data is optional to render the page (load async).
  const altLocale = useAltLocale();
  const [bilingual] = useBilingual();
  const [hideSups] = useHideSups();
  const altBookNames = useBookNames(altLocale);
  const altBookData = useBookData(altLocale, abbr);
  const tryGetBkAbbr = useTryGetBkAbbr(bookNames);
  const { hash } = useLocation();
  const glowOnce = useGlowOnce();

  const { opened: chLinksOpened, toggle: onToggleChLinksOpened } =
    useChapterLinksOpened();

  const chStr = String(ch);
  const numChapters = BkNumChapters[BkAbbrNum[abbr]];

  useSetDocumentTitle(bookNames[abbr].full + " " + chStr);

  // Remove the '#v' prefix.
  const hashSupId = hash.includes("^") ? hash.slice(2) : "";

  useEffect(() => {
    if (!hashSupId) return;

    setShowNotesRefs((old) => {
      const newState = new Set(old);
      newState.add(hashSupId);
      return newState;
    });

    jumpToElement(hashSupId, glowOnce);
  }, [glowOnce, hashSupId, setShowNotesRefs]);

  const chVerses = useMemo(() => {
    const chPrefix = chStr + ":";
    const entries = Object.entries(bookData.verses).filter(([k]) =>
      k.startsWith(chPrefix),
    );

    const results: {
      vref: string;
      vtextWithSups: VtextWithSups;
      partAOrB?: "a" | "b";
    }[] = [];

    for (const [vref, vtext] of entries) {
      if (vtext.includes(VERSE_SPLIT_SEPARATOR)) {
        const [a, b] = vtext.split(VERSE_SPLIT_SEPARATOR);
        results.push({ vref, vtextWithSups: parseVerseText(a), partAOrB: "a" });
        results.push({ vref, vtextWithSups: parseVerseText(b), partAOrB: "b" });
      } else {
        results.push({ vref, vtextWithSups: parseVerseText(vtext) });
      }
    }

    return results;
  }, [bookData.verses, chStr]);

  const onVrefClick = useCallback(
    (vn: string, notesRefsItems: NotesRefsItem[] | undefined) => {
      if (!notesRefsItems?.length) return;

      setShowNotesRefs((old) => {
        const newState = new Set(old);

        // If any is hidden, open all. Else close all.
        const anyHidden = hasAnyHidden(vn, notesRefsItems, newState);

        for (const item of notesRefsItems) {
          const id = supId(vn, item.sup);
          if (anyHidden) {
            newState.add(id);
          } else {
            newState.delete(id);
          }
        }

        return newState;
      });
    },
    [setShowNotesRefs],
  );

  const onVtextSupClick = useCallback(
    (vn: string, sup: string) => {
      const id = supId(vn, sup);
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

  const allSupIds = useMemo(() => {
    const supIds: string[] = [];

    const chTitleNotesItems = bookData.chTitleNote?.[String(ch)];
    if (chTitleNotesItems?.length) {
      for (const titleNote of chTitleNotesItems) {
        const id = supId("Title", titleNote.sup);
        supIds.push(id);
      }
    }

    for (const chVerse of chVerses) {
      const vn = chVerse.vref.split(":")[1];
      for (const supAndWord of chVerse.vtextWithSups) {
        if (typeof supAndWord === "string") continue; // vtext
        const id = supId(vn, supAndWord.sup); // sup+word
        supIds.push(id);
      }
    }

    return supIds;
  }, [bookData.chTitleNote, ch, chVerses]);

  const onShowAllNotesRefsClick = useCallback(() => {
    setShowAllNotes((v) => !v);

    if (showAllNotes) {
      setShowNotesRefs(new Set());
    } else {
      setShowNotesRefs(new Set(allSupIds));
    }
  }, [allSupIds, setShowAllNotes, setShowNotesRefs, showAllNotes]);

  const bkNames = bookNames[abbr];

  // Outlines at verse "-1" are for Psalm book titles.
  // They are special because they come before the chapter header.
  const topOutlines = bookData.outlines[`${chStr}:-1`] as
    | OutlineItem[]
    | undefined;

  return (
    <Stack gap={0} flex={1}>
      <BookTopBar abbr={abbr} />

      <Group
        justify="center"
        fz="180%"
        fw={500}
        ff="serif"
        lh={1.2}
        ta="center"
      >
        <SmoothTooltip label={strings.backToOverview}>
          <LinkButton
            to={`/${abbr}`}
            style={{
              color: "#33c",
              borderRadius: 16,
              padding: "0 16px",
            }}
          >
            {bkNames.long}
          </LinkButton>
        </SmoothTooltip>
      </Group>

      <Space h={8} />

      <Group justify="center" fw={500} fs="italic" ff="serif" gap={8}>
        <PrevNextChapterLinks abbr={abbr} ch={ch}>
          <ChapterLinksToggle ch={ch} onToggle={onToggleChLinksOpened} />
        </PrevNextChapterLinks>
      </Group>

      <Space h={12} />

      <div>
        <ChapterLinksPopup opened={chLinksOpened} abbr={abbr} current={ch} />
        <Collapse expanded={chLinksOpened}>
          <Space h={10} />
        </Collapse>
      </div>

      <Space h={8} />

      <FadeLine />

      <Space h={10} />

      <VerseLinks abbr={abbr} ch={ch} />

      <Space h={10} />

      <FadeLine />

      <Space h={10} />

      <Center>
        <LinkButton to="" onClick={onShowAllNotesRefsClick}>
          <Checkbox
            checked={showAllNotes}
            onClick={(e) => {
              // e.preventDefault(); --> will cause this to not work
              e.stopPropagation();
              onShowAllNotesRefsClick();
            }}
            styles={{
              input: {
                cursor: "pointer",
              },
            }}
          />
          &nbsp; {strings.showAllNotes}
        </LinkButton>
      </Center>

      <Space h={30} />

      <OutlinesBox
        abbr={abbr}
        ch={ch}
        vn="1"
        outlines={topOutlines}
        tryGetBkAbbr={tryGetBkAbbr}
      />

      <ChapterTitle
        abbr={abbr}
        bkRef={bkNames.ref}
        ch={ch}
        bookData={bookData}
        tryGetBkAbbr={tryGetBkAbbr}
        showNotesRefs={showNotesRefs}
        setShowNotesRefs={setShowNotesRefs}
      />

      {chVerses.map(({ vref, vtextWithSups, partAOrB }) => {
        const vn = vref.split(":")[1];
        const chVn = `${chStr}:${vn}`;
        const displayChVn = numChapters === 1 ? vn : chVn;

        // OUTLINE types should not show up in the verses.
        const outlinesAll = (
          bookData.outlines[chVn] as OutlineItem[] | undefined
        )?.filter((o) => o.type !== "OUTLINE");

        // Filter for parts A and B.
        const outlines =
          partAOrB === "a"
            ? outlinesAll?.filter((o) => !o.b)
            : partAOrB === "b"
              ? outlinesAll?.filter((o) => o.b)
              : outlinesAll;

        const vvInsert = bookData.vvInsert?.[chVn];

        const sups = vtextWithSups
          .filter((v) => typeof v !== "string")
          .map((s) => s.sup);

        const notesRefsItemsAll = bookData.notesRefs[vref] as
          | NotesRefsItem[]
          | undefined;

        const notesRefsItems = notesRefsItemsAll?.filter((n) =>
          sups.includes(String(n.sup)),
        );

        const bilingualVtext = `<b>${altBookNames?.[abbr].ref ?? ""} ${displayChVn}${partAOrB ?? ""}</b>&nbsp; ${altBookData?.verses[chVn] ?? ""}`;

        // If any is hidden, open all. Else close all.
        const anyHidden = notesRefsItems
          ? hasAnyHidden(vn, notesRefsItems, showNotesRefs)
          : false;

        return (
          <Fragment key={abbr + vref + (partAOrB ?? "")}>
            <OutlinesBox
              abbr={abbr}
              ch={ch}
              vn={vn}
              outlines={outlines}
              tryGetBkAbbr={tryGetBkAbbr}
            />

            {vvInsert ? (
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  backgroundColor: "#f7f7f7",
                  padding: "16px 12px 20px",
                  marginBottom: 12,
                  textAlign: "center",
                }}
                dangerouslySetInnerHTML={{ __html: vvInsert }}
              />
            ) : null}

            <VtextLine
              abbr={abbr}
              bkRef={bkNames.ref}
              ch={ch}
              vn={vn}
              partAOrB={partAOrB}
              notesRefsItems={notesRefsItems}
              vtextWithSups={vtextWithSups}
              showBilingual={bilingual}
              bilingualVtext={bilingualVtext}
              hideSups={hideSups}
              clickEffect={anyHidden ? "Show" : "Hide"}
              onVrefClick={() => {
                onVrefClick(vn, notesRefsItems);
              }}
              onVtextSupClick={(sup) => {
                onVtextSupClick(vn, sup);
              }}
            />

            <NotesRefsBlock
              abbr={abbr}
              bkRef={bkNames.ref}
              ch={ch}
              vn={vn}
              notesRefsItems={notesRefsItems}
              tryGetBkAbbr={tryGetBkAbbr}
              showNotesRefs={showNotesRefs}
              setShowNotesRefs={setShowNotesRefs}
            />
          </Fragment>
        );
      })}

      <Space h={10} />

      <FadeLine />

      <Space h={16} />

      <Group justify="center" fw={500} fs="italic" ff="serif">
        <PrevNextChapterLinks abbr={abbr} ch={ch}>
          {strings.get("chapterOfTotal", bkNames.full, ch, numChapters)}
        </PrevNextChapterLinks>
      </Group>

      <Space h={10} />

      <Center>
        <LinkButton
          to=""
          onClick={scrollToTop}
          style={{
            opacity: 0.5,
            fontSize: "95%",
            fontFamily: "serif",
            fontStyle: "italic",
          }}
        >
          {strings.backToTop}
        </LinkButton>
      </Center>

      <Space h={200} />
    </Stack>
  );
};

function hasAnyHidden(
  vn: string,
  notesRefsItems: NotesRefsItem[] | undefined,
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

export default BookChapter;
