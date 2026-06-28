import { useCallback, useEffect, useState, type RefObject } from "react";
import styles from "./TopBarSearch.module.css";
import { useLocale } from "../data/useLocale";
import { useStrings } from "../data/useStrings";
import { SearchOverlay } from "./SearchOverlay";
import { useBibleSearch, type SearchResults } from "./useBibleSearch";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { searchTextAtom } from "./searchTextAtom";

export const TopBarSearch: React.FC<{
  searchInputRef: RefObject<HTMLInputElement | null>;
  closeSearchOverlayRef: RefObject<(() => void) | null>;
}> = ({ searchInputRef, closeSearchOverlayRef }) => {
  const strings = useStrings();
  const [searchText, setSearchText] = useAtom(searchTextAtom);
  const [searchActivated, setSearchActivated] = useState(false);
  const [focused, setFocused] = useState(false);
  const [overlayOpened, setOverlayOpened] = useState(false);

  const onClose = useCallback(() => {
    searchInputRef.current?.blur();
    setOverlayOpened(false);
  }, [searchInputRef]);

  useEffect(() => {
    closeSearchOverlayRef.current = onClose;
  }, [closeSearchOverlayRef, onClose]);

  useEffect(() => {
    if (!searchText.trim()) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, searchText]);

  const searchPlaceholder = strings
    ? `${strings.websiteShortTitle} 2026`
    : undefined;

  const showFloatingPlaceholder = !focused;

  const activateSearch = useCallback(() => {
    setSearchActivated(true);
    searchInputRef.current?.focus();
  }, [searchInputRef]);

  return (
    <>
      <div className={styles.searchWrap}>
        <div className={styles.searchField}>
          <input
            ref={searchInputRef}
            aria-label="Search the Bible"
            className={clsx(
              styles.searchInput,
              !showFloatingPlaceholder && styles.active,
            )}
            type="search"
            value={searchText}
            onFocus={() => {
              setSearchActivated(true);
              setFocused(true);
              if (searchText) {
                setOverlayOpened(true);
              }
            }}
            onBlur={() => {
              setFocused(false);
            }}
            onChange={(event) => {
              const s = event.target.value;
              setSearchText(s);
              setOverlayOpened(!!s);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                // input type=search clears the text when Escape is pressed.
                // We don't want that, so we prevent the default behavior.
                event.preventDefault();
                event.currentTarget.blur();
                setOverlayOpened(false);
              }
            }}
          />
          {focused && !!searchText && (
            <button
              aria-label="Clear search"
              className={styles.clearButton}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => {
                setSearchText("");
                setOverlayOpened(false);
                searchInputRef.current?.focus();
              }}
            >
              <IconX size={14} stroke={2} />
            </button>
          )}
          {!!searchPlaceholder && (
            <span
              aria-hidden={!showFloatingPlaceholder}
              className={clsx(
                styles.floatingPlaceholder,
                showFloatingPlaceholder && styles.visible,
              )}
              onMouseDown={(event) => {
                event.preventDefault();
                activateSearch();
              }}
            >
              {searchPlaceholder}
            </span>
          )}
        </div>
      </div>

      {/* Important: Lazy load the search indexes because they are big. */}
      {searchActivated && (
        <TopBarSearchOverlay
          opened={overlayOpened}
          query={searchText}
          onClose={onClose}
        />
      )}
    </>
  );
};

const TopBarSearchOverlay: React.FC<{
  opened: boolean;
  query: string;
  onClose: () => void;
}> = ({ opened, query, onClose }) => {
  const { locale } = useLocale();
  // The useBibleSearch() hook triggers the search index load.
  const { search, loading, error } = useBibleSearch(locale);
  const [results, setResults] = useState<SearchResults>();

  useEffect(() => {
    async function run() {
      setResults(await search(query));
    }

    void run();
  }, [query, search]);

  return (
    <SearchOverlay
      opened={opened}
      error={error}
      loading={loading}
      query={query}
      results={results}
      onClose={onClose}
    />
  );
};
