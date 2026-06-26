import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Document } from "flexsearch";
import { BkAbbr } from "../src/data/bibleMetadata.ts";
import { importBookData } from "../src/data/useBookData.ts";
import { SupportedLocales } from "../src/data/localeTypes.ts";
import { getSearchIndexOptions } from "../src/search/searchIndexConfig.ts";
import type { SearchDocument } from "../src/search/searchTypes.ts";
import { getVerseRawText, VERSE_SPLIT_SEPARATOR } from "../src/utils/verses.ts";

// Output to `/public/search` instead of to `src/...` as we don't want to
// commit the indexes to git.
const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "..", "public", "search");

async function main() {
  mkdirSync(outputDir, { recursive: true });

  for (const locale of SupportedLocales) {
    const index = new Document<SearchDocument>(getSearchIndexOptions(locale));

    for (const abbr of BkAbbr) {
      const { data } = await importBookData(locale, abbr);

      for (const [vref, vtext] of Object.entries(data.verses)) {
        const [chStr, vnStr] = vref.split(":");
        const ch = Number(chStr);
        const vn = Number(vnStr);

        index.add({
          id: `${abbr}:${vref}`,
          abbr,
          ch,
          vn,
          text: getVerseRawText(vtext.replace(VERSE_SPLIT_SEPARATOR, " ")),
        });
      }
    }

    const exported: Record<string, unknown> = {};
    index.export((key, data) => {
      exported[key] = data;
    });

    writeFileSync(join(outputDir, `${locale}.json`), JSON.stringify(exported));
    console.log(`Built search index for ${locale}`);
  }
}

void main();
