import { useCallback, useMemo } from "react";
import type { LocaleBookNames } from "./localeTypes";
import { BkAbbr } from "./bibleMetadata";

export type LookupMap = Map<string, BkAbbr>;

export type TryGetBkAbbrFn = (bkAnyName: string) => BkAbbr | undefined;

export function useTryGetBkAbbr(bookNames: LocaleBookNames | undefined) {
  const lookupMap = useMemo((): LookupMap => {
    return createLookupMap(bookNames);
  }, [bookNames]);

  // Get the book abbreviation for any given book name, or null if not found.
  const tryGetBkAbbrFn = useCallback(
    (bkAnyName: string) => {
      return tryGetBkAbbr(bkAnyName, lookupMap);
    },
    [lookupMap],
  ) satisfies TryGetBkAbbrFn;

  return tryGetBkAbbrFn;
}

export function createLookupMap(
  bookNames: LocaleBookNames | undefined,
): LookupMap {
  const map = new Map<string, BkAbbr>() satisfies LookupMap;

  if (!bookNames) return map;

  function addBookName(abbr: BkAbbr, name: string) {
    map.set(name, abbr);
    map.set(name.toLocaleLowerCase(), abbr);

    if (name.includes(" ")) {
      // Convert '1 Pet.' to '1&nbsp;Pet.'.
      const nbsp = name.replace(" ", "&nbsp;");
      map.set(nbsp, abbr);
      map.set(nbsp.toLocaleLowerCase(), abbr);

      const rawNbsp = name.replace(" ", " ");
      map.set(rawNbsp, abbr);
      map.set(rawNbsp.toLocaleLowerCase(), abbr);
    }
  }

  for (const abbr of BkAbbr) {
    const bkNames = bookNames[abbr];
    addBookName(abbr, bkNames.abbr);
    addBookName(abbr, bkNames.full);
    addBookName(abbr, bkNames.long);
    addBookName(abbr, bkNames.ref);
  }

  // "Psalm" is not a book name, but "Psalms" is. But some verse refs look
  // like "Psalm 123" and not "Psalms 123".
  map.set("Psalm", "Psa");

  return map;
}

export function tryGetBkAbbr(
  bkAnyName: string,
  lookupMap: LookupMap,
): BkAbbr | undefined {
  return (
    lookupMap.get(bkAnyName) ?? lookupMap.get(bkAnyName.toLocaleLowerCase())
  );
}
