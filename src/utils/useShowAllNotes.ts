import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const showAllNotesAtom = atomWithStorage<boolean>(
  "showAllNotes",
  false,
  undefined,
  {
    getOnInit: true,
  },
);

export function useShowAllNotes() {
  return useAtom(showAllNotesAtom);
}
