import { PageSpinner } from "../components/PageSpinner";
import { type BkAbbr } from "../data/bibleMetadata";
import { useBookData } from "../data/useBookData";
import { useLocale } from "../data/useLocale";
import { useStrings } from "../data/useStrings";
import { useBookNames } from "../data/useBookNames";
import { BookOutlineLazy } from "../components/BookOutlineLazy";
import { BookTopBar } from "../components/BookTopBar";
import { Center, Collapse, Group, Space, Stack } from "@mantine/core";
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
import { SmoothTooltip } from "../components/SmoothTooltip";
import { useSetDocumentTitle } from "../utils/useSetDocumentTitle";
import { useRouteBkAbbr } from "../utils/useRouteBkAbbr";

const Book: React.FC = () => {
  const abbr = useRouteBkAbbr();
  if (!abbr) return <PageSpinner />;
  return <ParamsValid abbr={abbr} />;
};

const ParamsValid: React.FC<{ abbr: BkAbbr }> = ({ abbr }) => {
  const { locale } = useLocale();
  const bookNames = useBookNames(locale);
  const bookData = useBookData(locale, abbr);
  const strings = useStrings();
  const tryGetBkAbbr = useTryGetBkAbbr(bookNames);

  const { opened: chLinksOpened, toggle: onToggleChLinksOpened } =
    useChapterLinksOpened();

  useSetDocumentTitle(bookNames?.[abbr].full);

  if (!bookNames || !bookData || !strings) {
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
        <SmoothTooltip label={strings.backToHome}>
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
        </SmoothTooltip>
      </Group>

      <Space h={8} />

      <Group justify="center" fw={500} fs="italic" ff="serif">
        <PrevNextChapterLinks abbr={abbr}>
          <ChapterLinksToggle onToggle={onToggleChLinksOpened}>
            {strings.overview}
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
        <b>{strings.get("subjectOf", bkNames.full)}</b>
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
            <div style={{ textAlign: "center" }}>
              {bkNames.full} {strings.overview}
            </div>
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
          {strings.backToTop}
        </LinkButton>
      </Center>

      <Space h={200} />
    </Stack>
  );
};

export default Book;
