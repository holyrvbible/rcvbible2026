import { useEffect, useState } from "react";
import type { SupportedLocale } from "./localeTypes";
import type { BookData } from "./booksTypes";
import type { BkAbbr } from "./bibleMetadata";

export type BookDataMap = Partial<Record<string, BookData>>;

const cache: BookDataMap = {};

function getCacheKey(locale: SupportedLocale, abbr: BkAbbr) {
  return locale + ":" + abbr;
}

export async function importBookData(
  locale: SupportedLocale,
  abbr: BkAbbr,
): Promise<{ data: BookData }> {
  // Use constant import paths for full type-checking.
  switch (locale) {
    case "en-US":
      switch (abbr) {
        case "Gen":
          return import(`./en-US/books/Gen`);
        case "Exo":
          return import(`./en-US/books/Exo`);
        case "Lev":
          return import(`./en-US/books/Lev`);
        case "Num":
          return import(`./en-US/books/Num`);
        case "Deu":
          return import(`./en-US/books/Deu`);
        case "Jos":
          return import(`./en-US/books/Jos`);
        case "Jdg":
          return import(`./en-US/books/Jdg`);
        case "Rut":
          return import(`./en-US/books/Rut`);
        case "1Sa":
          return import(`./en-US/books/1Sa`);
        case "2Sa":
          return import(`./en-US/books/2Sa`);
        case "1Ki":
          return import(`./en-US/books/1Ki`);
        case "2Ki":
          return import(`./en-US/books/2Ki`);
        case "1Ch":
          return import(`./en-US/books/1Ch`);
        case "2Ch":
          return import(`./en-US/books/2Ch`);
        case "Ezr":
          return import(`./en-US/books/Ezr`);
        case "Neh":
          return import(`./en-US/books/Neh`);
        case "Est":
          return import(`./en-US/books/Est`);
        case "Job":
          return import(`./en-US/books/Job`);
        case "Psa":
          return import(`./en-US/books/Psa`);
        case "Prv":
          return import(`./en-US/books/Prv`);
        case "Ecc":
          return import(`./en-US/books/Ecc`);
        case "SoS":
          return import(`./en-US/books/SoS`);
        case "Isa":
          return import(`./en-US/books/Isa`);
        case "Jer":
          return import(`./en-US/books/Jer`);
        case "Lam":
          return import(`./en-US/books/Lam`);
        case "Ezk":
          return import(`./en-US/books/Ezk`);
        case "Dan":
          return import(`./en-US/books/Dan`);
        case "Hos":
          return import(`./en-US/books/Hos`);
        case "Joe":
          return import(`./en-US/books/Joe`);
        case "Amo":
          return import(`./en-US/books/Amo`);
        case "Oba":
          return import(`./en-US/books/Oba`);
        case "Jon":
          return import(`./en-US/books/Jon`);
        case "Mic":
          return import(`./en-US/books/Mic`);
        case "Nah":
          return import(`./en-US/books/Nah`);
        case "Hab":
          return import(`./en-US/books/Hab`);
        case "Zep":
          return import(`./en-US/books/Zep`);
        case "Hag":
          return import(`./en-US/books/Hag`);
        case "Zec":
          return import(`./en-US/books/Zec`);
        case "Mal":
          return import(`./en-US/books/Mal`);
        case "Mat":
          return import(`./en-US/books/Mat`);
        case "Mrk":
          return import(`./en-US/books/Mrk`);
        case "Luk":
          return import(`./en-US/books/Luk`);
        case "Joh":
          return import(`./en-US/books/Joh`);
        case "Act":
          return import(`./en-US/books/Act`);
        case "Rom":
          return import(`./en-US/books/Rom`);
        case "1Co":
          return import(`./en-US/books/1Co`);
        case "2Co":
          return import(`./en-US/books/2Co`);
        case "Gal":
          return import(`./en-US/books/Gal`);
        case "Eph":
          return import(`./en-US/books/Eph`);
        case "Phi":
          return import(`./en-US/books/Phi`);
        case "Col":
          return import(`./en-US/books/Col`);
        case "1Th":
          return import(`./en-US/books/1Th`);
        case "2Th":
          return import(`./en-US/books/2Th`);
        case "1Ti":
          return import(`./en-US/books/1Ti`);
        case "2Ti":
          return import(`./en-US/books/2Ti`);
        case "Tit":
          return import(`./en-US/books/Tit`);
        case "Phm":
          return import(`./en-US/books/Phm`);
        case "Heb":
          return import(`./en-US/books/Heb`);
        case "Jam":
          return import(`./en-US/books/Jam`);
        case "1Pe":
          return import(`./en-US/books/1Pe`);
        case "2Pe":
          return import(`./en-US/books/2Pe`);
        case "1Jo":
          return import(`./en-US/books/1Jo`);
        case "2Jo":
          return import(`./en-US/books/2Jo`);
        case "3Jo":
          return import(`./en-US/books/3Jo`);
        case "Jud":
          return import(`./en-US/books/Jud`);
        case "Rev":
          return import(`./en-US/books/Rev`);
        default:
          abbr satisfies never;
          throw new Error(`Unknown book abbreviation: ${String(abbr)}`);
      }
    case "zh-CN":
      switch (abbr) {
        case "Gen":
          return import(`./zh-CN/books/Gen`);
        case "Exo":
          return import(`./zh-CN/books/Exo`);
        case "Lev":
          return import(`./zh-CN/books/Lev`);
        case "Num":
          return import(`./zh-CN/books/Num`);
        case "Deu":
          return import(`./zh-CN/books/Deu`);
        case "Jos":
          return import(`./zh-CN/books/Jos`);
        case "Jdg":
          return import(`./zh-CN/books/Jdg`);
        case "Rut":
          return import(`./zh-CN/books/Rut`);
        case "1Sa":
          return import(`./zh-CN/books/1Sa`);
        case "2Sa":
          return import(`./zh-CN/books/2Sa`);
        case "1Ki":
          return import(`./zh-CN/books/1Ki`);
        case "2Ki":
          return import(`./zh-CN/books/2Ki`);
        case "1Ch":
          return import(`./zh-CN/books/1Ch`);
        case "2Ch":
          return import(`./zh-CN/books/2Ch`);
        case "Ezr":
          return import(`./zh-CN/books/Ezr`);
        case "Neh":
          return import(`./zh-CN/books/Neh`);
        case "Est":
          return import(`./zh-CN/books/Est`);
        case "Job":
          return import(`./zh-CN/books/Job`);
        case "Psa":
          return import(`./zh-CN/books/Psa`);
        case "Prv":
          return import(`./zh-CN/books/Prv`);
        case "Ecc":
          return import(`./zh-CN/books/Ecc`);
        case "SoS":
          return import(`./zh-CN/books/SoS`);
        case "Isa":
          return import(`./zh-CN/books/Isa`);
        case "Jer":
          return import(`./zh-CN/books/Jer`);
        case "Lam":
          return import(`./zh-CN/books/Lam`);
        case "Ezk":
          return import(`./zh-CN/books/Ezk`);
        case "Dan":
          return import(`./zh-CN/books/Dan`);
        case "Hos":
          return import(`./zh-CN/books/Hos`);
        case "Joe":
          return import(`./zh-CN/books/Joe`);
        case "Amo":
          return import(`./zh-CN/books/Amo`);
        case "Oba":
          return import(`./zh-CN/books/Oba`);
        case "Jon":
          return import(`./zh-CN/books/Jon`);
        case "Mic":
          return import(`./zh-CN/books/Mic`);
        case "Nah":
          return import(`./zh-CN/books/Nah`);
        case "Hab":
          return import(`./zh-CN/books/Hab`);
        case "Zep":
          return import(`./zh-CN/books/Zep`);
        case "Hag":
          return import(`./zh-CN/books/Hag`);
        case "Zec":
          return import(`./zh-CN/books/Zec`);
        case "Mal":
          return import(`./zh-CN/books/Mal`);
        case "Mat":
          return import(`./zh-CN/books/Mat`);
        case "Mrk":
          return import(`./zh-CN/books/Mrk`);
        case "Luk":
          return import(`./zh-CN/books/Luk`);
        case "Joh":
          return import(`./zh-CN/books/Joh`);
        case "Act":
          return import(`./zh-CN/books/Act`);
        case "Rom":
          return import(`./zh-CN/books/Rom`);
        case "1Co":
          return import(`./zh-CN/books/1Co`);
        case "2Co":
          return import(`./zh-CN/books/2Co`);
        case "Gal":
          return import(`./zh-CN/books/Gal`);
        case "Eph":
          return import(`./zh-CN/books/Eph`);
        case "Phi":
          return import(`./zh-CN/books/Phi`);
        case "Col":
          return import(`./zh-CN/books/Col`);
        case "1Th":
          return import(`./zh-CN/books/1Th`);
        case "2Th":
          return import(`./zh-CN/books/2Th`);
        case "1Ti":
          return import(`./zh-CN/books/1Ti`);
        case "2Ti":
          return import(`./zh-CN/books/2Ti`);
        case "Tit":
          return import(`./zh-CN/books/Tit`);
        case "Phm":
          return import(`./zh-CN/books/Phm`);
        case "Heb":
          return import(`./zh-CN/books/Heb`);
        case "Jam":
          return import(`./zh-CN/books/Jam`);
        case "1Pe":
          return import(`./zh-CN/books/1Pe`);
        case "2Pe":
          return import(`./zh-CN/books/2Pe`);
        case "1Jo":
          return import(`./zh-CN/books/1Jo`);
        case "2Jo":
          return import(`./zh-CN/books/2Jo`);
        case "3Jo":
          return import(`./zh-CN/books/3Jo`);
        case "Jud":
          return import(`./zh-CN/books/Jud`);
        case "Rev":
          return import(`./zh-CN/books/Rev`);
        default:
          abbr satisfies never;
          throw new Error(`Unknown book abbreviation: ${String(abbr)}`);
      }
    default:
      locale satisfies never;
      throw new Error(`Unknown locale: ${String(locale)}`);
  }
}

export function useBookData(locale: SupportedLocale, abbr: BkAbbr) {
  const [bookDataMap, setBookDataMap] = useState<BookDataMap>({});

  const cacheKey = getCacheKey(locale, abbr);

  useEffect(() => {
    let canceled = false;

    async function load() {
      if (cache[cacheKey]) {
        if (!canceled) setBookDataMap({ ...cache });
        return;
      }

      const loaded = await importBookData(locale, abbr);

      cache[cacheKey] = loaded.data;
      if (!canceled) setBookDataMap({ ...cache });
    }

    void load();

    return () => {
      canceled = true;
    };
  }, [abbr, cacheKey, locale]);

  return bookDataMap[cacheKey];
}
