import { PageSpinner } from "../components/PageSpinner";
import { BkAbbr, BkAbbrNum } from "../data/bibleMetadata";
import type { LocaleBookNames } from "../data/localeTypes";
import { useBookNames } from "../data/useBookNames";
import { Fragment } from "react/jsx-runtime";
import { useStrings } from "../data/useStrings";
import type { StringName, StringsData } from "../data/en-US/strings";
import { useLocale } from "../data/useLocale";
import { FadeLine, VerticalFadeLine } from "../components/FadeLine";
import { linkTo } from "../utils/links";
import { LinkButton } from "../components/LinkButton";
import styles from "./Home.module.css";
import { Center } from "@mantine/core";
import { useSetDocumentTitle } from "../utils/useSetDocumentTitle";

type BookGroups = { name: StringName; books: BkAbbr[] }[];

const OldGroups: BookGroups = [
  { name: "booksOfMoses", books: ["Gen", "Exo", "Lev", "Num", "Deu"] },
  {
    name: "historyOfIsrael",
    books: [
      "Jos",
      "Jdg",
      "Rut",
      "1Sa",
      "2Sa",
      "1Ki",
      "2Ki",
      "1Ch",
      "2Ch",
      "Ezr",
      "Neh",
      "Est",
    ],
  },
  {
    name: "booksOfPoetry",
    books: ["Job", "Psa", "Prv", "Ecc", "SoS"],
  },
  {
    name: "majorProphets",
    books: ["Isa", "Jer", "Lam", "Ezk", "Dan"],
  },
  {
    name: "minorProphets",
    books: [
      "Hos",
      "Joe",
      "Amo",
      "Oba",
      "Jon",
      "Mic",
      "Nah",
      "Hab",
      "Zep",
      "Hag",
      "Zec",
      "Mal",
    ],
  },
];

const NewGroups: BookGroups = [
  { name: "theGospel", books: ["Mat", "Mrk", "Luk", "Joh"] },
  { name: "earlyChurch", books: ["Act"] },
  {
    name: "epistlesOfPaul",
    books: [
      "Rom",
      "1Co",
      "2Co",
      "Gal",
      "Eph",
      "Phi",
      "Col",
      "1Th",
      "2Th",
      "1Ti",
      "2Ti",
      "Tit",
      "Phm",
    ],
  },
  {
    name: "otherEpistles",
    books: ["Heb", "Jam", "1Pe", "2Pe", "1Jo", "2Jo", "3Jo", "Jud"],
  },
  {
    name: "secondComingOfChrist",
    books: ["Rev"],
  },
];

export const Home: React.FC = () => {
  const { locale } = useLocale();
  const bookNames = useBookNames(locale);
  const strings = useStrings();

  useSetDocumentTitle(strings?.websiteShortTitle);

  if (!bookNames || !strings) {
    return <PageSpinner />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.titleBox}>
        <div
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: strings.websiteTitle }}
        />
        <div className={styles.subTitle}>{strings.websiteSubtitle}</div>
      </div>

      <div className={styles.allBooks}>
        <div className={styles.booksStack}>
          <FadeLine />
          <div className={styles.stackTitle}>{strings.oldTestament}</div>
          <BooksGroup
            groups={OldGroups}
            bookNames={bookNames}
            strings={strings}
          />
        </div>

        <div className={styles.verticalFadeLine}>
          <VerticalFadeLine />
        </div>

        <div className={styles.booksStack}>
          <FadeLine />
          <div className={styles.stackTitle}>{strings.newTestament}</div>
          <BooksGroup
            groups={NewGroups}
            bookNames={bookNames}
            strings={strings}
          />
        </div>
      </div>

      <FadeLine />

      <div className={styles.footer}>
        <Center>
          <LinkButton
            to=""
            onClick={() => {
              // Jump to the top of the home root container.
              document.getElementsByClassName(styles.root)[0].scrollTop = 0;
            }}
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
      </div>
    </div>
  );
};

const BooksGroup: React.FC<{
  groups: BookGroups;
  bookNames: LocaleBookNames;
  strings: StringsData;
}> = ({ groups, bookNames, strings }) => {
  return groups.map((group) => {
    return (
      <Fragment key={group.name}>
        <FadeLine />
        <div className={styles.booksSection}>
          <div className={styles.booksSectionTitle}>{strings[group.name]}</div>
          <div className={styles.bookList}>
            {group.books.map((abbr) => {
              // Reset to 1 for New Testament.
              const num = (BkAbbrNum[abbr] % 39) + 1;

              return (
                <div className={styles.book} key={abbr}>
                  <LinkButton
                    className={styles.bookLink}
                    to={linkTo(abbr)}
                    // Need to override the default style in LinkButton.
                    style={{
                      justifyContent: "flex-start",
                      padding: "0 0 0 12px",
                      color: "#4444cf",
                      borderRadius: 10,
                    }}
                  >
                    <span className={styles.bookNumber}>{num}</span>{" "}
                    {bookNames[abbr].full}
                  </LinkButton>
                </div>
              );
            })}
          </div>
        </div>
      </Fragment>
    );
  });
};
