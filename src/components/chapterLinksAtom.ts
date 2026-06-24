import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";

const chapterLinksOpenedAtom = atomWithStorage<boolean>(
  "chapterLinksOpened",
  false,
  undefined,
  { getOnInit: true },
);

export function useChapterLinksOpened() {
  const [opened, setOpened] = useAtom(chapterLinksOpenedAtom);

  const toggle = useCallback(() => {
    setOpened((v) => !v);
  }, [setOpened]);

  return { opened, toggle };
}
