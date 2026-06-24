import { useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { useGlowOnce } from "../utils/useGlowOnce";
import { jumpToElement } from "../utils/scrollToElement";

export const AutoScrollToHash: React.FC = () => {
  const { hash } = useLocation();
  const glowOnce = useGlowOnce();

  useLayoutEffect(() => {
    // Remove the '#' character to get the element ID.
    const elementId = hash.slice(1);
    if (!elementId) return;

    jumpToElement(elementId, glowOnce);
  }, [glowOnce, hash]);

  return null;
};
