import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Document } from "flexsearch";
import { BkAbbr, BkAbbrNum, BkNumChapters } from "../src/data/bibleMetadata.ts";
import { importBookData } from "../src/data/useBookData.ts";
import { importBookNames } from "../src/data/useBookNames.ts";
import { SupportedLocales } from "../src/data/localeTypes.ts";
import { getSearchIndexOptions } from "../src/search/searchIndexConfig.ts";
import type {
  SearchDocument,
  SearchStoredData,
} from "../src/search/searchTypes.ts";
import { getVerseRawText, VERSE_SPLIT_SEPARATOR } from "../src/utils/verses.ts";

// Output to `/public/search` instead of to `src/...` as we don't want to
// commit the indexes to git.
const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "..", "public", "search");

async function main() {
  mkdirSync(outputDir, { recursive: true });

  for (const name of readdirSync(outputDir)) {
    unlinkSync(join(outputDir, name));
  }

  for (const locale of SupportedLocales) {
    const index = new Document<SearchDocument>(getSearchIndexOptions(locale));
    const { default: bookNames } = await importBookNames(locale);

    for (const abbr of BkAbbr) {
      const bkNames = bookNames[abbr];
      const { data } = await importBookData(locale, abbr);

      for (const [vref, vtext] of Object.entries(data.verses)) {
        const vnStr = vref.split(":")[1];
        const displayVref = BkNumChapters[BkAbbrNum[abbr]] === 1 ? vnStr : vref;

        index.add({
          id: `${abbr}${vref}`,
          // Warning: The search doesn't work at all across multiple fields, so
          // put them all into one field.
          text:
            `${bkNames.full} ${bkNames.ref} ${abbr} ${displayVref}|` +
            getVerseRawText(vtext.replace(VERSE_SPLIT_SEPARATOR, " ")),
        } satisfies SearchStoredData);
      }
    }

    const exported: Record<string, unknown> = {};
    index.export((key, data) => {
      exported[key] = data;
    });

    writeFileSync(
      join(outputDir, `${locale}.json.gz`),
      gzipSync(JSON.stringify(exported)),
    );
    console.log(`Built search index for ${locale}`);
  }
}

void main();
