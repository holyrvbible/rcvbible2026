export const strings = {
  websiteTitle: "Holy Bible Recovery Version",
  websiteShortTitle: "RcvBible",
  websiteSubtitle: "English + Chinese with footnotes & cross-references",
  oldTestament: "The Old Testament",
  newTestament: "The New Testament",
  booksOfMoses: "Books of Moses",
  historyOfIsrael: "History of Israel",
  booksOfPoetry: "Books of Poetry",
  majorProphets: "Major Prophets",
  minorProphets: "Minor Prophets",
  theGospel: "The Gospel",
  earlyChurch: "The Early Church",
  epistlesOfPaul: "Epistles of Paul",
  otherEpistles: "Other Epistles",
  secondComingOfChrist: "The Second Coming of Christ",
  versionText: "2026 Version",
  overview: "Overview",
  backToTop: "Back to Top",
  jumpToVerse: "Jump to Verse",
  showAllNotes: "Show All Notes",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  toggleBilingualMode: "Toggle bilingual mode",
  backToOverview: "Back to overview",
  toggleChapterLinks: "Toggle chapter links",
  backToHome: "Back to home",
} as const;

// Use the English translation to define the i18n type.
export type StringName = keyof typeof strings;

export type StringsData = Record<StringName, string>;
