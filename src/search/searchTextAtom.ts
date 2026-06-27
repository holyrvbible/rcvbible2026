import { atomWithStorage } from "jotai/utils";

export const searchTextAtom = atomWithStorage<string>(
  "searchText",
  "",
  undefined,
  { getOnInit: true },
);
