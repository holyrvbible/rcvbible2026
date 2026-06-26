import { atom, useAtom } from "jotai";
import { pageZoom } from "../utils/pageZoom";
import { useCallback, useMemo } from "react";

const zoomPercentAtom = atom(pageZoom.getZoomPercent());

export function usePageZoom() {
  const [zoomPercent, setZoomPercent] = useAtom(zoomPercentAtom);

  const zoomIn = useCallback(() => {
    pageZoom.zoomIn();
    setZoomPercent(pageZoom.getZoomPercent());
  }, [setZoomPercent]);

  const zoomOut = useCallback(() => {
    pageZoom.zoomOut();
    setZoomPercent(pageZoom.getZoomPercent());
  }, [setZoomPercent]);

  return useMemo(
    () => ({ zoomPercent, zoomIn, zoomOut, setZoomPercent }),
    [zoomIn, zoomOut, zoomPercent, setZoomPercent],
  );
}
