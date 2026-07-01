import { Group, Loader, Transition } from "@mantine/core";
import styles from "./SearchOverlay.module.css";
import { linkTo } from "../utils/links";
import { useStrings } from "../data/useStrings";
import { BkAbbrNum, BkNumChapters } from "../data/bibleMetadata";
import { useBookNames } from "../data/useBookNames";
import { useLocale } from "../data/useLocale";
import { useMemo } from "react";
import clsx from "clsx";
import { LinkButton } from "../components/LinkButton";
import { IconX } from "@tabler/icons-react";
import type { SearchResults } from "./useBibleSearch";
import { highlightSearchText } from "./highlightSearchText";

export const SearchOverlay: React.FC<{
  opened: boolean;
  query: string;
  results: SearchResults | undefined;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}> = ({ opened, query, results, loading, error, onClose }) => {
  const strings = useStrings();
  const locale = useLocale();
  const bookNames = useBookNames(locale);

  const status = useMemo(() => {
    if (loading) {
      return <Loader type="dots" />;
    }
    if (error) {
      return [error, false];
    }

    if (!results) {
      return <>{strings?.searchEnterText}</>;
    }

    if (results.searchType === "none") {
      return <>{strings?.searchLoadingIndex}</>;
    }

    const q = query.trim();
    if (!results.hits.length) {
      return <>{strings?.get("searchNoResults", q)}</>;
    }

    if (results.searchType === "fullText") {
      return (
        <>
          {results.hits.length === 1
            ? strings?.get("searchShowingOneResult", q)
            : strings?.get("searchShowingResults", results.hits.length, q)}
        </>
      );
    }

    return (
      <>
        {results.hits.length === 1
          ? strings?.get("searchListingOneVerse", q)
          : strings?.get("searchListingVerses", q)}
      </>
    );
  }, [error, loading, query, results, strings]);

  return (
    <Transition
      duration={300}
      mounted={opened}
      timingFunction="ease-in-out"
      transition="fade"
    >
      {(transitionStyles) => (
        <div
          className={styles.overlay}
          role="dialog"
          aria-label={strings?.searchResultsDialog}
          style={transitionStyles}
        >
          <Group className={clsx(styles.status, error && styles.error)}>
            {status}
            <LinkButton className={styles.closeButton} to="" onClick={onClose}>
              <IconX size={20} />
            </LinkButton>
          </Group>

          {!loading && !error && !!results?.hits.length && (
            <ul
              className={styles.results}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {results.hits.map((hit) => {
                const displayVref =
                  BkNumChapters[BkAbbrNum[hit.abbr]] === 1
                    ? String(hit.ch)
                    : `${String(hit.ch)}:${String(hit.vn)}`;

                const href = linkTo(hit.abbr, hit.ch, hit.vn);

                return (
                  <li key={hit.id} className={styles.result}>
                    <LinkButton
                      className={styles.ref}
                      to={href}
                      onClick={onClose}
                    >
                      {bookNames?.[hit.abbr]?.ref} {displayVref}
                    </LinkButton>
                    <span className={styles.snippet}>
                      {results.searchType === "fullText"
                        ? highlightSearchText(hit.text, query, locale)
                        : hit.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </Transition>
  );
};
