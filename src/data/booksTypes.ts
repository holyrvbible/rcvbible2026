/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type OutlineItemType = "TEXT" | "OUTLINE";

export type OutlineItem = {
  lv: number;
  // Applicable in most cases, otherwise just put an empty string.
  pt: string;
  text: string;
  vrefs?: string;
  label?: string;
  jumpToText?: string;
  jumpToAllOutlines?: string;
  type?: OutlineItemType;
  b?: 1;
  parens?: 1;
};

export type NotesRefsItem = {
  sup: string | number;
  // TODO: The Chinese data for word is missing.
  word?: string;
  vrefs?: string;
  lines?: string[];
};

export type ChTitleNoteItem = {
  sup: string | number;
  word: string;
  text?: string;
  vrefs?: string;
};

export type BookData = {
  bigTitle: string;
  intro: string[][];
  subject: string;
  verses: Record<string, string>;
  outlines: Record<string, OutlineItem[]>;
  notesRefs: Record<string, NotesRefsItem[]>;
  chTitle?: Record<string, string>;
  vvInsert?: Record<string, string>;
  chTitleNote?: Record<string, ChTitleNoteItem[]>;
};
