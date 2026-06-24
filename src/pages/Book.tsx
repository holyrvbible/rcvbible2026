import { PageSpinner } from "../components/PageSpinner";
import { type BkAbbr } from "../data/bibleMetadata";
import { useBookData } from "../data/useBookData";
import { useLocale } from "../data/useLocale";
import { useBookNames } from "../data/useBookNames";
import { BookOutlineLazy } from "../components/BookOutlineLazy";
import { BookTopBar } from "../components/BookTopBar";
import { Center, Collapse, Group, Space, Stack, Tooltip } from "@mantine/core";
import { FadeLine } from "../components/FadeLine";
import styles from "./Book.module.css";
import { CodedVrefLinks } from "../components/CodedVrefLinks";
import { replaceHtmlEntities } from "../utils/verses";
import { PrevNextChapterLinks } from "../components/PrevNextChapterLinks";
import { useChapterLinksOpened } from "../components/chapterLinksAtom";
import {
  ChapterLinksPopup,
  ChapterLinksToggle,
} from "../components/ChapterLinks";
import { useTryGetBkAbbr } from "../data/useTryGetBkAbbr";
import { LinkButton } from "../components/LinkButton";
import { scrollToTop } from "../utils/scrollToElement";

const Book: React.FC<{ abbr: BkAbbr }> = ({ abbr }) => {
  const { locale } = useLocale();
  const bookNames = useBookNames(locale);
  const bookData = useBookData(locale, abbr);
  const tryGetBkAbbr = useTryGetBkAbbr(bookNames);

  const { opened: chLinksOpened, toggle: onToggleChLinksOpened } =
    useChapterLinksOpened();

  if (!bookNames || !bookData) {
    return <PageSpinner />;
  }

  const bkNames = bookNames[abbr];

  return (
    <Stack gap={0} flex={1}>
      <BookTopBar abbr={abbr} />

      <Group
        className={styles.title}
        gap={0}
        justify="center"
        fz="180%"
        fw={500}
        ff="serif"
        lh={1.2}
        ta="center"
      >
        <Tooltip label="Back to home">
          <LinkButton
            to="/"
            style={{
              color: "#33c",
              borderRadius: 16,
              padding: "0 16px",
            }}
          >
            <Stack
              gap={2}
              dangerouslySetInnerHTML={{ __html: bookData.bigTitle }}
            />
          </LinkButton>
        </Tooltip>
      </Group>

      <Space h={8} />

      <Group justify="center" fw={500} fs="italic" ff="serif">
        <PrevNextChapterLinks abbr={abbr}>
          <ChapterLinksToggle onToggle={onToggleChLinksOpened}>
            Overview
          </ChapterLinksToggle>
        </PrevNextChapterLinks>
      </Group>

      <Space h={20} />

      <div>
        <ChapterLinksPopup opened={chLinksOpened} abbr={abbr} />
        <Collapse expanded={chLinksOpened}>
          <Space h={20} />
        </Collapse>
      </div>

      <FadeLine />

      <Space h={20} />

      <Center>
        <Stack
          gap={2}
          px={40}
          ml={20}
          style={{
            textIndent: "-20px",
            fontSize: "93%",
            opacity: 0.85,
          }}
        >
          {bookData.intro.map(([header, text], index) => {
            const key = index + 1;
            return (
              <div key={key}>
                {!!header && (
                  <b
                    style={{
                      color: "#333",
                      display: "inline-block",
                      marginRight: 5,
                    }}
                  >
                    {header}:
                  </b>
                )}
                <CodedVrefLinks text={replaceHtmlEntities(text)} />
              </div>
            );
          })}
        </Stack>
      </Center>

      <Space h={20} />

      <FadeLine />

      <Space h={17} />

      <div style={{ textAlign: "center", fontSize: "110%", opacity: 0.75 }}>
        <b>Subject of {bkNames.full}</b>
        <div dangerouslySetInnerHTML={{ __html: bookData.subject }}></div>
      </div>

      <Space h={24} />

      <FadeLine />

      <Space h={20} />

      <BookOutlineLazy
        abbr={abbr}
        bookNames={bookNames}
        bookData={bookData}
        tryGetBkAbbr={tryGetBkAbbr}
      />

      <Space h={20} />

      <Group justify="center" fw={500} fs="italic" ff="serif">
        <PrevNextChapterLinks abbr={abbr}>
          <ChapterLinksToggle onToggle={onToggleChLinksOpened}>
            {bkNames.full} Overview
          </ChapterLinksToggle>
        </PrevNextChapterLinks>
      </Group>

      <Space h={10} />

      <div>
        <ChapterLinksPopup opened={chLinksOpened} abbr={abbr} />
        <Collapse expanded={chLinksOpened}>
          <Space h={20} />
        </Collapse>
      </div>

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
          Back to Top
        </LinkButton>
      </Center>

      <Space h={100} />
    </Stack>
  );
};

export default Book;
