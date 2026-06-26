import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const hideSupsAtom = atomWithStorage<boolean>("hideSups", false, undefined, {
  getOnInit: true,
});

export function useHideSups() {
  return useAtom(hideSupsAtom);
}
