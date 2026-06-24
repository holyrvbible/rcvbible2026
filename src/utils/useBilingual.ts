import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const bilingualAtom = atomWithStorage<boolean>("bilingual", false, undefined, {
  getOnInit: true,
});

export function useBilingual() {
    return useAtom(bilingualAtom);
}
